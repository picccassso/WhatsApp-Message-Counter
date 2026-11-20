/*
 * quality.js — on-device ML & NLP data-cleaning pipeline ("spam-adjusted counts")
 * for a parsed WhatsApp chat.
 *
 * Pipeline stages (100% client-side, zero dependencies, Node-testable):
 *
 *   1. Corpus stats (NLP)       Single-pass IDF (Inverse Document Frequency) over
 *                               the whole chat so chat-specific spam words / slang
 *                               automatically get low information weight.
 *   2. Feature extraction       16 normalized features per message: length, word
 *                               count, vocab diversity, mean IDF (information bits),
 *                               laugh-only & continuous laughRatio (multi-language
 *                               laughs + emojis), ack/filler detection, emoji-only,
 *                               char-repetition/keysmash, rapid-fire burst depth
 *                               (consecutive same-sender streak), near-duplicate
 *                               within 2 min (last 3 msgs, stretched-char canonical),
 *                               links, real questions, concrete numbers, caps.
 *   3. Logistic scoring         p = sigmoid(b + Σ wᵢ·xᵢ) with 3 built-in presets
 *                               ('balanced', 'strict', 'laughsOnly') plus exact
 *                               log-odds feature attribution via explain().
 *   4. Hard cleaning rules      media/deleted -> weight 0; duplicates -> × DUP_FACTOR;
 *                               rapid low-effort consecutive bursts tagged 'burst'.
 *   5. In-browser ML training   train() fits an L2-regularized Logistic Regression
 *                               directly in JS (batch gradient descent with momentum
 *                               + stratified holdout metrics: accuracy, F1, ROC-AUC,
 *                               loss history) from Active Learning user labels and/or
 *                               confident corpus anchors.
 *
 * API:
 *   MODEL, PRESETS, FEATURE_META, DUP_WINDOW_MS, BURST_MS, DUP_FACTOR, LAUGH_RE
 *   sigmoid(z), buildCorpusStats(messages), features(msg, ctx), score(f, model),
 *   kindOf(msg, f, w), explain(msg, ctx, model), analyze(messages, opts),
 *   sampleUncertain(messages, analysis, opts), train(messages, userLabels, opts),
 *   autoTrain(messages, opts), toCSV(messages, opts)
 */
(function (root, factory) {
  const words = (typeof module !== 'undefined' && module.exports)
    ? require('./words.js')
    : (root.WhatsAppWords || null);
  const api = factory(words);
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.WhatsAppQuality = api;
})(typeof self !== 'undefined' ? self : globalThis, function (WORDS) {
  'use strict';

  // Same placeholder detection as parser.js — those messages are not prose.
  const MEDIA_RE = /<media omitted>|\(file attached\)|\b(?:image|video|audio|sticker|document|location|contact card|gif|voice message) omitted\b/i;
  const DELETED_RE = /^(?:this message was deleted|you deleted this message)\.?$/i;

  // Multi-language & internet laugh tokens:
  // haha…, hehe…, hihi…, bahaha…, ahaha…, muahaha…, jajaja…, keke…, kkkk…,
  // lol+, lolz, lmao+, lmfao+, rofl+, xd{2,}, mdr+, ptdr+, wkwk+, 555+, sksk+
  const LAUGH_TOKEN = '(?:(?:a|ba|bwa|mua|wa)?ha(?:ha)+h?|he(?:he)+h?|hi(?:hi)+h?|ho(?:ho)+h?|ja(?:ja)+j?|je(?:je)+j?|ke(?:ke)+|k{4,}|lol+z?|lel+|lmao+|lmfao+|rofl+|xd{2,}|mdr+|ptdr+|wkwk(?:wk)*|sksk(?:sk)*|5{3,})';
  const LAUGH_TOKEN_RE = new RegExp('^' + LAUGH_TOKEN + '$', 'i');
  const LAUGH_ONLY_RE = new RegExp('^(?:' + LAUGH_TOKEN + ')(?:\\s+(?:' + LAUGH_TOKEN + '))*$', 'i');
  const LAUGH_RE = new RegExp('\\b' + LAUGH_TOKEN + '\\b|[😂🤣💀😭😹]', 'iu');
  const LAUGH_EMOJI_RE = /[😂🤣💀😭😹]/gu;

  // Multi-word laugh reactions that are pure reaction filler on their own.
  const LAUGH_PHRASES = new Set([
    'im dead', "i'm dead", 'dead', 'crying', 'screaming', 'im crying', "i'm crying",
    'so funny', 'too funny', 'actually dead', 'literally dead', 'cant breathe',
    "can't breathe", 'dying', 'im dying', "i'm dying",
  ]);

  // Low-effort one/two-word acknowledgements & filler reactions.
  const ACK_SET = new Set([
    'ok', 'okay', 'okey', 'oke', 'okk', 'okkk', 'k', 'kk', 'kkk',
    'yep', 'yup', 'yes', 'yeah', 'ye', 'yea', 'ya', 'yah', 'yess', 'yesss',
    'no', 'nope', 'nah', 'na', 'nahh', 'noo',
    'sure', 'cool', 'nice', 'good', 'great', 'awesome', 'sweet', 'fine', 'alright', 'aight',
    'bet', 'word', 'true', 'same', 'facts', 'fax', 'real', 'valid', 'fair', 'based',
    'fr', 'ngl', 'tbh', 'idk', 'ikr', 'idc', 'imo', 'smh', 'ffs', 'wtf', 'omg', 'omfg',
    'oof', 'rip', 'gg', 'np', 'yw', 'thx', 'ty', 'tysm', 'thanks', 'thank you', 'cheers',
    'pls', 'plz', 'please', 'omw', 'brb', 'gtg', 'gn', 'gm', 'bye', 'cya',
    'sup', 'wyd', 'bruh', 'bro', 'mate', 'dude', 'man',
    'oh', 'ah', 'ahh', 'uh', 'uhh', 'hm', 'hmm', 'hmmm', 'mhm', 'mhmm', 'uh huh', 'whoa', 'wow',
    'fair enough', 'makes sense', 'no worries', 'sounds good', 'got it', 'gotcha',
    'all good', 'my bad', 'for sure', 'of course', 'thank u', 'no problem', 'will do',
    'see ya', 'see you', 'good night', 'good morning', 'oh ok', 'oh okay', 'ok cool',
    'ok nice', 'ok thanks', 'yeah ok', 'yeah sure', 'haha yes', 'haha no', 'haha ok',
    'haha yeah', 'lol ok', 'lol yes', 'lol no', 'lol same', 'lmao same', 'haha same',
    '👍', '👎', '❤️', '♥️', '🙏', '😅', '😬', '👌', '🔥', '💯', '👀', '🫡', '🙌', '👏', '✅',
  ]);

  const URL_RE = /(?:https?:\/\/|www\.)\S+/i;
  const UPPER_RE = /\p{Lu}/gu;
  const LETTER_RE = /\p{L}/gu;
  const DIGIT_RE = /\d/;
  const STRETCH_RE = /(.)\1{2,}/gu;
  const LONG_STRETCH_RE = /(.)\1{3,}/gu;
  const PURE_PUNCT_RE = /^[?!.\u2026,\-_*~]+$/;
  let EMOJI_RE = null;
  try { EMOJI_RE = new RegExp('\\p{Extended_Pictographic}', 'gu'); } catch (e) { /* older engine */ }

  const tokenize = (WORDS && WORDS.tokenize)
    ? WORDS.tokenize
    : (t) => String(t || '').toLowerCase().match(/[\p{L}\p{N}](?:['’\-][\p{L}\p{N}])*/gu) || [];

  // Duplicate window: identical or canonicalized repeat from the same sender
  // within 2 minutes (checks the sender's last 3 messages, not just 1).
  const DUP_WINDOW_MS = 120 * 1000;
  // Rapid-fire burst window: <= 15s (handles 1-second iOS timestamps) OR
  // gapMs === 0 (handles 1-minute resolution Android exports).
  const BURST_MS = 15 * 1000;
  // Duplicate messages keep this fraction of their score.
  const DUP_FACTOR = 0.35;
  // Consecutive same-sender messages within this window count as one burst run.
  const RUN_WINDOW_MS = 60 * 1000;

  // Feature metadata for explainability & UI charts.
  const FEATURE_META = {
    lenNorm:     { label: 'Message length',     short: 'length' },
    wordsNorm:   { label: 'Word count',         short: 'words' },
    uniqueRatio: { label: 'Word diversity',     short: 'diversity' },
    idfMean:     { label: 'Info novelty (IDF)', short: 'novelty' },
    hasQuestion: { label: 'Real question',      short: 'question' },
    hasLink:     { label: 'Shared link',        short: 'link' },
    hasNumber:   { label: 'Specific number',    short: 'number' },
    capsRatio:   { label: 'All-caps emphasis',  short: 'caps' },
    emojiRatio:  { label: 'Emoji density',      short: 'emoji ratio' },
    laughOnly:   { label: 'Laugh-only',         short: 'laugh-only' },
    laughRatio:  { label: 'Laugh share',        short: 'laugh share' },
    ackOnly:     { label: 'Short ack / filler', short: 'ack/filler' },
    emojiOnly:   { label: 'Emoji-only',         short: 'emoji-only' },
    tiny:        { label: 'Tiny (≤3 chars)',    short: 'tiny' },
    charRepeat:  { label: 'Stretched / spammy', short: 'repetition' },
    dup:         { label: 'Recent duplicate',   short: 'duplicate' },
    burst:       { label: 'Rapid-fire burst',   short: 'rapid burst' },
    burstDepth:  { label: 'Spam streak depth',  short: 'spam streak' },
  };

  const FEATURE_KEYS = Object.keys(FEATURE_META);

  // Built-in logistic-regression presets: p = sigmoid(bias + Σ wᵢ·xᵢ).
  const PRESETS = {
    balanced: {
      name: 'balanced',
      label: 'Balanced',
      description: 'Filters laugh-spam, acks, duplicates, and discounts rapid-fire filler bursts.',
      bias: -1.15,
      weights: {
        lenNorm:     2.2,
        wordsNorm:   1.7,
        uniqueRatio: 0.65,
        idfMean:     1.15,
        hasQuestion: 0.55,
        hasLink:     0.45,
        hasNumber:   0.35,
        capsRatio:   0.2,
        emojiRatio: -0.35,
        laughOnly:  -3.2,
        laughRatio: -2.0,
        ackOnly:    -3.5,
        emojiOnly:  -3.6,
        tiny:       -1.25,
        charRepeat: -1.4,
        dup:        -1.6,
        burst:      -0.45,
        burstDepth: -1.1,
      },
    },
    strict: {
      name: 'strict',
      label: 'Strict anti-spam',
      description: 'Harsh on rapid-fire burst texting, short fragments, and laugh-heavy replies.',
      bias: -1.55,
      weights: {
        lenNorm:     2.6,
        wordsNorm:   2.1,
        uniqueRatio: 0.8,
        idfMean:     1.45,
        hasQuestion: 0.5,
        hasLink:     0.4,
        hasNumber:   0.35,
        capsRatio:   0.1,
        emojiRatio: -0.6,
        laughOnly:  -3.8,
        laughRatio: -2.8,
        ackOnly:    -4.0,
        emojiOnly:  -4.0,
        tiny:       -1.7,
        charRepeat: -2.0,
        dup:        -2.2,
        burst:      -0.95,
        burstDepth: -2.1,
      },
    },
    laughsOnly: {
      name: 'laughsOnly',
      label: 'Laughs & dupes only',
      description: 'Only removes laughs, emoji-only, dupes & media — keeps short replies & bursts intact.',
      bias: -0.35,
      weights: {
        lenNorm:     1.4,
        wordsNorm:   1.1,
        uniqueRatio: 0.4,
        idfMean:     0.55,
        hasQuestion: 0.4,
        hasLink:     0.4,
        hasNumber:   0.25,
        capsRatio:   0.15,
        emojiRatio: -0.2,
        laughOnly:  -4.2,
        laughRatio: -2.4,
        ackOnly:    -1.2,
        emojiOnly:  -3.8,
        tiny:       -0.4,
        charRepeat: -1.2,
        dup:        -2.0,
        burst:      -0.05,
        burstDepth: -0.1,
      },
    },
  };

  // Default exported MODEL (kept mutable-compatible with v1 API).
  const MODEL = {
    name: PRESETS.balanced.name,
    bias: PRESETS.balanced.bias,
    weights: Object.assign({}, PRESETS.balanced.weights),
  };

  function sigmoid(z) {
    if (z >= 35) return 1;
    if (z <= -35) return 0;
    return 1 / (1 + Math.exp(-z));
  }

  function normalizeText(text) {
    return String(text || '').toLowerCase().replace(/\s+/g, ' ').trim();
  }

  // Collapse 3+ repeated characters (e.g. "noooooo" -> "noo", "haaaaha" -> "haaha")
  // for near-duplicate & stretched-ack matching.
  function canonicalize(text) {
    return normalizeText(text).replace(STRETCH_RE, '$1$1');
  }

  // Strip emoji + punctuation; what remains decides laugh-only vs ack vs emoji-only.
  function stripEmojiPunct(text) {
    let t = String(text || '');
    if (EMOJI_RE) t = t.replace(EMOJI_RE, ' ');
    t = t.replace(/[^\p{L}\p{N}\s']/gu, ' ');
    return t.replace(/\s+/g, ' ').trim();
  }

  function countEmoji(text) {
    if (!EMOJI_RE) return 0;
    const m = String(text || '').match(EMOJI_RE);
    return m ? m.length : 0;
  }

  function countLaughEmoji(text) {
    const m = String(text || '').match(LAUGH_EMOJI_RE);
    return m ? m.length : 0;
  }

  /*
   * Stage 1: Build chat-specific IDF lookup table in one fast pass.
   * Words that appear in a huge fraction of messages (even custom slang or
   * non-English filler) get low IDF; specific topical vocabulary gets high IDF.
   */
  function buildCorpusStats(messages) {
    const msgs = messages || [];
    const df = new Map();
    let docCount = 0;
    // For huge chats (>20k), evenly-spaced sampling estimates IDF accurately in ~40ms.
    const stride = msgs.length > 20000 ? Math.floor(msgs.length / 20000) : 1;

    for (let i = 0; i < msgs.length; i += stride) {
      const m = msgs[i];
      if (!m || m.media || m.deleted) continue;
      const text = m.text;
      if (!text) continue;
      docCount++;
      const toks = tokenize(text);
      const len = toks.length;
      if (!len) continue;
      if (len === 1) {
        const t = toks[0];
        df.set(t, (df.get(t) || 0) + 1);
      } else {
        const seen = new Set();
        for (let k = 0; k < len; k++) {
          const t = toks[k];
          if (!seen.has(t)) {
            seen.add(t);
            df.set(t, (df.get(t) || 0) + 1);
          }
        }
      }
    }

    const maxIdf = Math.log((docCount + 1) / 1) + 1;
    return {
      docCount,
      vocabSize: df.size,
      maxIdf: maxIdf > 0 ? maxIdf : 1,
      df,
    };
  }

  function tokenIdfNorm(tok, corpus) {
    if (!corpus || corpus.docCount < 5) return 0.5;
    const d = corpus.df.get(tok) || 0;
    const idf = Math.log((corpus.docCount + 1) / (d + 1)) + 1;
    return Math.min(1, Math.max(0, idf / corpus.maxIdf));
  }

  // Detect stretched/repetitive keysmash or punctuation spam in [0, 1].
  function computeCharRepeat(trimmed, chars) {
    if (chars >= 2 && PURE_PUNCT_RE.test(trimmed)) return 1;
    if (chars < 4) return 0;
    let stretchedChars = 0;
    const stretches = trimmed.match(LONG_STRETCH_RE);
    if (stretches) {
      for (let i = 0; i < stretches.length; i++) stretchedChars += stretches[i].length;
    }
    const stretchFrac = stretchedChars / chars;
    // Also check very low unique-character ratio on long runs ("abababab", "????????").
    const lowerNoSpace = trimmed.toLowerCase().replace(/\s+/g, '');
    let lowDiv = 0;
    if (lowerNoSpace.length >= 6) {
      const uniqChars = new Set(lowerNoSpace).size;
      const ratio = uniqChars / lowerNoSpace.length;
      if (ratio < 0.25) lowDiv = Math.min(1, (0.25 - ratio) / 0.2);
    }
    return Math.min(1, Math.max(stretchFrac, lowDiv));
  }

  /*
   * Stage 2: Extract the feature vector for one message.
   * ctx: {
   *   prevBySender: Map<sender, { norm, canon, ms, recent: Array<{norm, canon, ms}> }>,
   *   lastSender: string | null,
   *   lastMs: number | null,
   *   runLen: number,        // consecutive messages by same sender in this turn
   *   shortRunLen: number,   // consecutive short/rapid messages by same sender
   *   ms: number | null,
   *   corpus: corpusStats | null,
   * }
   */
  function features(msg, ctx) {
    ctx = ctx || { prevBySender: new Map(), ms: null };
    const text = String((msg && msg.text) || '');
    const trimmed = text.trim();
    const media = Boolean(msg && (msg.media || MEDIA_RE.test(trimmed)));
    const deleted = Boolean(msg && (msg.deleted || DELETED_RE.test(trimmed)));

    const toks = (media || deleted) ? [] : tokenize(trimmed);
    const words = toks.length;
    const chars = trimmed.length;

    let unique = 0;
    let laughToks = 0;
    let idfSum = 0;
    if (words > 0) {
      const uniqSet = new Set();
      for (let i = 0; i < words; i++) {
        const tk = toks[i];
        uniqSet.add(tk);
        if (LAUGH_TOKEN_RE.test(tk)) laughToks++;
        idfSum += tokenIdfNorm(tk, ctx.corpus);
      }
      unique = uniqSet.size;
    }

    const letters = (media || deleted) ? null : trimmed.match(LETTER_RE);
    const letterCount = letters ? letters.length : 0;
    const uppers = (letterCount >= 4) ? trimmed.match(UPPER_RE) : null;
    const emojis = (media || deleted) ? 0 : countEmoji(trimmed);
    const laughEmojis = (!media && !deleted && emojis > 0) ? countLaughEmoji(trimmed) : 0;

    const stripped = (media || deleted) ? '' : stripEmojiPunct(trimmed);
    const lower = normalizeText(trimmed);
    const canon = canonicalize(trimmed);
    const ackNorm = stripped.toLowerCase();
    const ackCanon = canonicalize(stripped);

    const isLaughPhrase = !media && !deleted && ackNorm.length > 0 && LAUGH_PHRASES.has(ackNorm);
    const laughOnly = !media && !deleted && (
      (stripped.length > 0 && (LAUGH_ONLY_RE.test(stripped) || isLaughPhrase)) ||
      (stripped.length === 0 && laughEmojis > 0 && laughEmojis === emojis)
    );
    const ackOnly = !media && !deleted && !laughOnly && (
      ACK_SET.has(lower) || ACK_SET.has(ackNorm) || ACK_SET.has(ackCanon)
    );
    const emojiOnly = !media && !deleted && !ackOnly && !laughOnly && stripped.length === 0 && emojis > 0;

    // Continuous laugh share: (laugh tokens + laugh emojis) / (tokens + emojis)
    const denom = words + emojis;
    const laughRatio = (media || deleted) ? 0 : (
      laughOnly ? 1 : (denom > 0 ? Math.min(1, (laughToks + laughEmojis) / denom) : 0)
    );

    const hasLink = !media && !deleted && URL_RE.test(trimmed);
    // Only reward '?' as a real question when there's actual text (>= 2 words or >= 8 chars), not bare "???".
    const hasQuestion = !media && !deleted && trimmed.indexOf('?') !== -1 && (words >= 2 || chars >= 8);
    // Concrete numbers (times, prices, dates) excluding Thai "555" laugh.
    const hasNumber = !media && !deleted && !laughOnly && DIGIT_RE.test(trimmed) && !/^5{3,}$/.test(stripped);
    const tiny = !media && !deleted && chars <= 3 && !hasQuestion && !hasLink;
    const charRepeat = (media || deleted) ? 0 : computeCharRepeat(trimmed, chars);

    // Duplicate & rapid-fire burst detection from same sender.
    const sender = msg && msg.sender;
    const prev = ctx.prevBySender ? ctx.prevBySender.get(sender) : null;
    const ms = typeof ctx.ms === 'number' ? ctx.ms : null;
    let dup = false;
    let burst = false;
    let gapMs = null;

    if (prev && ms !== null && typeof prev.ms === 'number') {
      gapMs = ms - prev.ms;
      if (gapMs >= 0 && gapMs <= BURST_MS) burst = true;
      // Check against last 3 messages from this sender within DUP_WINDOW_MS.
      if (lower.length > 0) {
        const recent = prev.recent || [prev];
        for (let r = recent.length - 1; r >= 0; r--) {
          const item = recent[r];
          if (typeof item.ms !== 'number') continue;
          const dt = ms - item.ms;
          if (dt < 0 || dt > DUP_WINDOW_MS) continue;
          if (item.norm === lower || (canon.length >= 2 && item.canon === canon)) {
            dup = true;
            break;
          }
        }
      }
    }

    // Consecutive short-message burst depth (e.g. sending 5 tiny texts in a row).
    const sameTurn = ctx.lastSender === sender && (
      ms === null || ctx.lastMs === null || (ms - ctx.lastMs >= 0 && ms - ctx.lastMs <= RUN_WINDOW_MS)
    );
    const runPos = sameTurn ? (ctx.runLen || 0) : 0;
    const isShortFragment = !media && !deleted && !hasLink && chars < 40;
    const shortRunPos = (sameTurn && isShortFragment) ? (ctx.shortRunLen || 0) : 0;
    // First message in a turn has burstDepth 0; 2nd+ short consecutive message ramps up.
    const burstDepth = shortRunPos > 0 ? Math.min(1, shortRunPos / 4) : 0;

    return {
      len: chars,
      words,
      uniqueRatio: words ? unique / words : 0,
      idfMean: words ? idfSum / words : 0,
      capsRatio: letterCount >= 4 ? (uppers ? uppers.length : 0) / letterCount : 0,
      emojiRatio: chars ? Math.min(1, emojis / chars) : 0,
      hasLink: hasLink ? 1 : 0,
      hasQuestion: hasQuestion ? 1 : 0,
      hasNumber: hasNumber ? 1 : 0,
      laughOnly: laughOnly ? 1 : 0,
      laughRatio,
      ackOnly: ackOnly ? 1 : 0,
      emojiOnly: emojiOnly ? 1 : 0,
      tiny: tiny ? 1 : 0,
      charRepeat,
      dup: dup ? 1 : 0,
      burst: burst ? 1 : 0,
      burstDepth,
      runPos,
      media: media ? 1 : 0,
      deleted: deleted ? 1 : 0,
      gapMs,
      // model-ready scaled features
      lenNorm: Math.min(1, chars / 140),
      wordsNorm: Math.min(1, words / 24),
    };
  }

  function resolveModel(modelOrPreset) {
    if (!modelOrPreset) return MODEL;
    if (typeof modelOrPreset === 'string') {
      return PRESETS[modelOrPreset] || MODEL;
    }
    if (modelOrPreset && modelOrPreset.weights) return modelOrPreset;
    return MODEL;
  }

  // Stage 3: Logistic score — probability the message is substantive in [0, 1].
  function score(f, modelOrPreset) {
    if (!f) return 0;
    if (f.media || f.deleted) return 0;
    const m = resolveModel(modelOrPreset);
    let z = m.bias;
    const w = m.weights;
    for (let i = 0; i < FEATURE_KEYS.length; i++) {
      const k = FEATURE_KEYS[i];
      const wk = w[k];
      const vk = f[k];
      if (typeof wk === 'number' && typeof vk === 'number') z += wk * vk;
    }
    let p = sigmoid(z);
    if (f.dup) p *= DUP_FACTOR;
    return Math.min(1, Math.max(0, p));
  }

  // Classify a message into its primary bucket for breakdowns & UI badges.
  function kindOf(msg, f, wScore) {
    if (!f) return 'substantive';
    if (f.media) return 'media';
    if (f.deleted) return 'deleted';
    if (f.dup) return 'duplicate';
    if (f.ackOnly) return 'ack';
    if (f.laughOnly) return 'reaction';
    if (f.emojiOnly) return 'emoji';
    if (f.laughRatio >= 0.5 && f.words <= 4) return 'reaction';
    if (f.burstDepth >= 0.5 && typeof wScore === 'number' && wScore < 0.45) return 'burst';
    return 'substantive';
  }

  // Exact linear attribution (log-odds delta per feature) for explainability.
  function explain(msg, ctx, modelOrPreset) {
    const f = (msg && typeof msg.lenNorm === 'number') ? msg : features(msg, ctx);
    const m = resolveModel(modelOrPreset);
    const s = score(f, m);
    const kind = kindOf(msg, f, s);
    if (f.media || f.deleted) {
      return {
        score: 0,
        kind,
        bias: m.bias,
        logit: -Infinity,
        features: f,
        contributions: [{
          feature: f.media ? 'media' : 'deleted',
          label: f.media ? 'Media placeholder' : 'Deleted stub',
          short: f.media ? 'media' : 'deleted',
          value: 1,
          weight: -Infinity,
          delta: -10,
        }],
        topReasons: [f.media ? 'media placeholder (0)' : 'deleted stub (0)'],
      };
    }

    let z = m.bias;
    const contributions = [];
    for (let i = 0; i < FEATURE_KEYS.length; i++) {
      const k = FEATURE_KEYS[i];
      const val = typeof f[k] === 'number' ? f[k] : 0;
      const wt = typeof m.weights[k] === 'number' ? m.weights[k] : 0;
      const delta = wt * val;
      z += delta;
      if (Math.abs(delta) >= 0.03) {
        const meta = FEATURE_META[k] || { label: k, short: k };
        contributions.push({
          feature: k,
          label: meta.label,
          short: meta.short,
          value: Math.round(val * 1000) / 1000,
          weight: Math.round(wt * 1000) / 1000,
          delta: Math.round(delta * 1000) / 1000,
        });
      }
    }
    contributions.sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta));
    const topReasons = contributions.slice(0, 3).map((c) => {
      const sign = c.delta >= 0 ? '+' : '−';
      return `${c.short} ${sign}${Math.abs(c.delta).toFixed(2)}`;
    });
    if (f.dup) topReasons.unshift(`duplicate ×${DUP_FACTOR}`);

    return {
      score: Math.round(s * 1000) / 1000,
      kind,
      bias: m.bias,
      logit: Math.round(z * 1000) / 1000,
      features: f,
      contributions,
      topReasons,
    };
  }

  function extractMs(msArr, i) {
    if (!msArr) return null;
    const v = msArr[i];
    if (typeof v === 'number') return v;
    if (v && typeof v.ms === 'number') return v.ms;
    return null;
  }

  function updateContext(ctx, m, f) {
    const norm = normalizeText(m.text);
    const canon = canonicalize(m.text);
    let entry = ctx.prevBySender.get(m.sender);
    if (!entry) {
      entry = { norm, canon, ms: ctx.ms, recent: [] };
      ctx.prevBySender.set(m.sender, entry);
    } else {
      entry.norm = norm;
      entry.canon = canon;
      entry.ms = ctx.ms;
    }
    entry.recent.push({ norm, canon, ms: ctx.ms });
    if (entry.recent.length > 3) entry.recent.shift();

    const sameTurn = ctx.lastSender === m.sender && (
      ctx.ms === null || ctx.lastMs === null || (ctx.ms - ctx.lastMs >= 0 && ctx.ms - ctx.lastMs <= RUN_WINDOW_MS)
    );
    if (sameTurn) {
      ctx.runLen = (ctx.runLen || 0) + 1;
      if (!f.media && !f.deleted && !f.hasLink && f.len < 40) {
        ctx.shortRunLen = (ctx.shortRunLen || 0) + 1;
      } else {
        ctx.shortRunLen = 0;
      }
    } else {
      ctx.runLen = 1;
      ctx.shortRunLen = (!f.media && !f.deleted && !f.hasLink && f.len < 40) ? 1 : 0;
    }
    ctx.lastSender = m.sender;
    ctx.lastMs = ctx.ms;
  }

  /*
   * Run the full pipeline over a parsed chat.
   * opts: { ms, model, preset, corpus }
   */
  function analyze(messages, opts) {
    opts = opts || {};
    const msgs = messages || [];
    const msArr = opts.ms || null;
    const activeModel = resolveModel(opts.model || opts.preset);
    const corpus = opts.corpus || buildCorpusStats(msgs);

    const ctx = {
      prevBySender: new Map(),
      lastSender: null,
      lastMs: null,
      runLen: 0,
      shortRunLen: 0,
      ms: null,
      corpus,
    };

    const weights = new Array(msgs.length);
    const kinds = new Array(msgs.length);
    const counts = {
      substantive: 0, reaction: 0, ack: 0, emoji: 0,
      duplicate: 0, burst: 0, media: 0, deleted: 0,
    };
    const histogram = new Array(10).fill(0);
    const senders = new Map();
    let adjusted = 0;

    const getS = (name) => {
      let s = senders.get(name);
      if (!s) {
        s = {
          sender: name, raw: 0, adjusted: 0, substantive: 0,
          reactions: 0, acks: 0, emojis: 0, dupes: 0, burstSpam: 0,
          media: 0, deleted: 0, bursts: 0,
        };
        senders.set(name, s);
      }
      return s;
    };

    for (let i = 0; i < msgs.length; i++) {
      const m = msgs[i];
      ctx.ms = extractMs(msArr, i);
      const f = features(m, ctx);
      const w = score(f, activeModel);
      const kind = kindOf(m, f, w);

      weights[i] = Math.round(w * 1000) / 1000;
      kinds[i] = kind;
      counts[kind]++;
      adjusted += w;

      if (!f.media && !f.deleted) {
        const bin = Math.min(9, Math.floor(w * 10));
        histogram[bin]++;
      }

      const st = getS(m.sender);
      st.raw++;
      st.adjusted += w;
      if (kind === 'substantive') st.substantive++;
      else if (kind === 'reaction') st.reactions++;
      else if (kind === 'ack') st.acks++;
      else if (kind === 'emoji') st.emojis++;
      else if (kind === 'duplicate') st.dupes++;
      else if (kind === 'burst') st.burstSpam++;
      else if (kind === 'media') st.media++;
      else if (kind === 'deleted') st.deleted++;
      if (f.burst && kind === 'substantive') st.bursts++;

      updateContext(ctx, m, f);
    }

    // Compute raw rank vs adjusted rank so we can highlight rank flips!
    const rawOrder = Array.from(senders.values())
      .sort((a, b) => b.raw - a.raw || a.sender.localeCompare(b.sender));
    const rawRankMap = new Map();
    rawOrder.forEach((s, idx) => rawRankMap.set(s.sender, idx + 1));

    const senderList = Array.from(senders.values()).map((s) => {
      const adj = Math.round(s.adjusted * 10) / 10;
      const filt = Math.round((s.raw - s.adjusted) * 10) / 10;
      const signalPct = s.raw > 0 ? Math.round((s.adjusted / s.raw) * 100) : 0;
      return {
        sender: s.sender,
        raw: s.raw,
        adjusted: adj,
        filtered: filt,
        signalPct,
        substantive: s.substantive,
        reactions: s.reactions,
        acks: s.acks,
        emojis: s.emojis,
        dupes: s.dupes,
        burstSpam: s.burstSpam,
        media: s.media,
        deleted: s.deleted,
        bursts: s.bursts,
        rawRank: rawRankMap.get(s.sender) || 1,
        adjRank: 1,
        rankDelta: 0,
      };
    }).sort((a, b) => b.adjusted - a.adjusted || b.raw - a.raw || a.sender.localeCompare(b.sender));

    let anyRankShift = false;
    senderList.forEach((s, idx) => {
      s.adjRank = idx + 1;
      s.rankDelta = s.rawRank - s.adjRank;
      if (s.rankDelta !== 0) anyRankShift = true;
    });

    const leaderFlipped = Boolean(
      rawOrder.length >= 2 &&
      senderList.length >= 2 &&
      rawOrder[0].sender !== senderList[0].sender
    );

    // Cleanest & spammiest sender (require at least 5 msgs if available).
    const minMsgs = msgs.length >= 20 ? 5 : 1;
    const eligible = senderList.filter((s) => s.raw >= minMsgs);
    let cleanestSender = null;
    let spammiestSender = null;
    if (eligible.length >= 2) {
      const bySignal = eligible.slice().sort((a, b) => b.signalPct - a.signalPct || b.raw - a.raw);
      cleanestSender = bySignal[0];
      spammiestSender = bySignal[bySignal.length - 1];
    }

    const total = msgs.length;
    const adjRounded = Math.round(adjusted * 10) / 10;
    return {
      total,
      adjusted: adjRounded,
      filtered: Math.round((total - adjusted) * 10) / 10,
      signalRatio: total > 0 ? Math.round((adjusted / total) * 1000) / 1000 : 0,
      signalPct: total > 0 ? Math.round((adjusted / total) * 100) : 0,
      counts,
      senders: senderList,
      rawLeader: rawOrder[0] ? rawOrder[0].sender : null,
      adjLeader: senderList[0] ? senderList[0].sender : null,
      leaderFlipped,
      anyRankShift,
      cleanestSender,
      spammiestSender,
      histogram,
      weights,
      kinds,
      corpus: { docCount: corpus.docCount, vocabSize: corpus.vocabSize },
      model: {
        name: activeModel.name || 'custom',
        label: activeModel.label || 'Custom trained',
        bias: activeModel.bias,
        weights: Object.assign({}, activeModel.weights),
        metrics: activeModel.metrics || null,
      },
      _corpus: corpus,
    };
  }

  /*
   * Active Learning Uncertainty Sampler:
   * Picks diverse, informative messages (prioritizing p near 0.5, deduplicated by text)
   * for the user to label in the ML Lab.
   */
  function sampleUncertain(messages, analysis, opts) {
    opts = opts || {};
    const msgs = messages || [];
    const limit = opts.limit || 24;
    const exclude = opts.exclude instanceof Set ? opts.exclude : new Set();
    const weights = (analysis && analysis.weights) || [];
    const kinds = (analysis && analysis.kinds) || [];

    const candidates = [];
    const seenText = new Set();

    // Stride through very large chats so sampling stays instant (<15ms on 100k msgs).
    const stride = msgs.length > 6000 ? Math.floor(msgs.length / 6000) : 1;

    for (let i = 0; i < msgs.length; i += stride) {
      if (exclude.has(i)) continue;
      const m = msgs[i];
      if (!m || m.media || m.deleted) continue;
      const kind = kinds[i] || 'substantive';
      if (kind === 'media' || kind === 'deleted') continue;
      const norm = normalizeText(m.text);
      if (!norm || seenText.has(norm)) continue;
      seenText.add(norm);

      const p = typeof weights[i] === 'number' ? weights[i] : 0.5;
      // Uncertainty peaks at p = 0.5 (value 1.0); also give slight variety across kinds.
      const uncertainty = 1 - Math.abs(p - 0.5) * 2;
      candidates.push({ idx: i, p, kind, sender: m.sender, uncertainty });
    }

    // Sort by uncertainty descending (most ambiguous messages first).
    candidates.sort((a, b) => b.uncertainty - a.uncertainty || a.idx - b.idx);

    const picked = [];
    const used = new Set();
    const senderCounts = new Map();

    // First take top uncertain messages with mild sender balancing.
    const uncertainQuota = Math.ceil(limit * 0.7);
    for (let i = 0; i < candidates.length && picked.length < uncertainQuota; i++) {
      const c = candidates[i];
      const sc = senderCounts.get(c.sender) || 0;
      if (sc >= Math.ceil(limit / 2) && candidates.length > limit) continue;
      picked.push(c);
      used.add(c.idx);
      senderCounts.set(c.sender, sc + 1);
    }

    // Fill remaining slots with stratified clear examples (laughs/acks/bursts/substantive)
    // so the user also calibrates the ends of the scale.
    const wantKinds = ['reaction', 'ack', 'burst', 'substantive', 'emoji', 'duplicate'];
    for (let pass = 0; pass < 4 && picked.length < limit; pass++) {
      for (let k = 0; k < wantKinds.length && picked.length < limit; k++) {
        const target = wantKinds[k];
        const found = candidates.find((c) => !used.has(c.idx) && c.kind === target);
        if (found) {
          picked.push(found);
          used.add(found.idx);
        }
      }
    }

    // Top up if still below limit.
    for (let i = 0; i < candidates.length && picked.length < limit; i++) {
      if (!used.has(candidates[i].idx)) {
        picked.push(candidates[i]);
        used.add(candidates[i].idx);
      }
    }

    return picked;
  }

  /*
   * Stage 5: Real In-Browser L2-Regularized Logistic Regression Trainer!
   *
   * Combines:
   *  - User-labeled examples (Map<idx, 0|1> or Array<{idx, label}>), heavily weighted
   *    so even 6–12 human clicks meaningfully steer the model to the user's taste.
   *  - High-confidence corpus anchors (weak supervision from clear substantive / clear
   *    filler messages in this chat) with light weight, preventing overfitting on small
   *    human label sets.
   *
   * Optimizes regularized binary cross-entropy:
   *   L(w, b) = (1/W) Σ αᵢ · BCE(yᵢ, σ(b + w·xᵢ)) + (λ/2) ||w - w₀||²
   * where anchoring towards the prior w₀ (MAP estimation / Gaussian prior!) keeps
   * unseen features well-behaved while letting data-supported features adapt freely!
   */
  function computeRocAuc(preds) {
    // preds: Array<{ y: 0|1, p: number }>
    let pos = 0;
    let neg = 0;
    for (let i = 0; i < preds.length; i++) {
      if (preds[i].y === 1) pos++;
      else neg++;
    }
    if (!pos || !neg) return null;
    const sorted = preds.slice().sort((a, b) => a.p - b.p);
    let rankSum = 0;
    let i = 0;
    while (i < sorted.length) {
      let j = i + 1;
      while (j < sorted.length && sorted[j].p === sorted[i].p) j++;
      const avgRank = (i + j + 1) / 2; // 1-based average rank for ties
      for (let k = i; k < j; k++) {
        if (sorted[k].y === 1) rankSum += avgRank;
      }
      i = j;
    }
    const auc = (rankSum - (pos * (pos + 1)) / 2) / (pos * neg);
    return Math.round(Math.min(1, Math.max(0, auc)) * 1000) / 1000;
  }

  function evalPredictions(rows, bias, wVec) {
    let tp = 0, fp = 0, tn = 0, fn = 0;
    let lossSum = 0;
    let wSum = 0;
    const preds = [];
    for (let i = 0; i < rows.length; i++) {
      const r = rows[i];
      let z = bias;
      for (let j = 0; j < FEATURE_KEYS.length; j++) z += wVec[j] * r.x[j];
      const p = sigmoid(z);
      const pc = Math.min(1 - 1e-7, Math.max(1e-7, p));
      lossSum += r.sampleWeight * (-(r.y * Math.log(pc) + (1 - r.y) * Math.log(1 - pc)));
      wSum += r.sampleWeight;
      const pred = p >= 0.5 ? 1 : 0;
      if (pred === 1 && r.y === 1) tp++;
      else if (pred === 1 && r.y === 0) fp++;
      else if (pred === 0 && r.y === 0) tn++;
      else fn++;
      preds.push({ y: r.y, p });
    }
    const n = rows.length || 1;
    const accuracy = Math.round(((tp + tn) / n) * 1000) / 1000;
    const precision = (tp + fp) ? Math.round((tp / (tp + fp)) * 1000) / 1000 : 1;
    const recall = (tp + fn) ? Math.round((tp / (tp + fn)) * 1000) / 1000 : 1;
    const f1 = (precision + recall) ? Math.round(((2 * precision * recall) / (precision + recall)) * 1000) / 1000 : 0;
    const rocAuc = computeRocAuc(preds);
    return {
      count: rows.length,
      loss: wSum ? Math.round((lossSum / wSum) * 10000) / 10000 : 0,
      accuracy,
      precision,
      recall,
      f1,
      rocAuc,
      tp, fp, tn, fn,
    };
  }

  function train(messages, userLabels, opts) {
    opts = opts || {};
    const msgs = messages || [];
    const msArr = opts.ms || null;
    const baseModel = resolveModel(opts.baseModel || opts.preset || 'balanced');
    const corpus = opts.corpus || buildCorpusStats(msgs);

    // Normalize userLabels into Map<idx, 0|1>
    const labelMap = new Map();
    if (userLabels instanceof Map) {
      for (const [k, v] of userLabels) {
        if (v === 0 || v === 1) labelMap.set(Number(k), v);
      }
    } else if (Array.isArray(userLabels)) {
      for (let i = 0; i < userLabels.length; i++) {
        const it = userLabels[i];
        if (it && (it.label === 0 || it.label === 1)) labelMap.set(Number(it.idx), it.label);
      }
    } else if (userLabels && typeof userLabels === 'object') {
      for (const k of Object.keys(userLabels)) {
        const v = userLabels[k];
        if (v === 0 || v === 1) labelMap.set(Number(k), v);
      }
    }

    // Extract feature vectors for labeled indices + a stratified sample of anchors.
    const maxAnchors = typeof opts.maxAnchors === 'number' ? opts.maxAnchors : 600;
    const anchorStride = msgs.length > 2400 ? Math.max(1, Math.floor(msgs.length / 2400)) : 1;

    const ctx = {
      prevBySender: new Map(),
      lastSender: null,
      lastMs: null,
      runLen: 0,
      shortRunLen: 0,
      ms: null,
      corpus,
    };

    const userRows = [];
    const posAnchors = [];
    const negAnchors = [];

    for (let i = 0; i < msgs.length; i++) {
      const m = msgs[i];
      ctx.ms = extractMs(msArr, i);
      const isUser = labelMap.has(i);
      const wantAnchor = (i % anchorStride === 0) && (posAnchors.length < maxAnchors || negAnchors.length < maxAnchors);

      if (!isUser && !wantAnchor) {
        // Still keep minimal context warm if close to next sampled message.
        if (msgs.length <= 2400) {
          const fSkip = features(m, ctx);
          updateContext(ctx, m, fSkip);
        }
        continue;
      }

      const f = features(m, ctx);
      updateContext(ctx, m, f);
      if (f.media || f.deleted) continue;

      const x = new Array(FEATURE_KEYS.length);
      for (let j = 0; j < FEATURE_KEYS.length; j++) {
        const v = f[FEATURE_KEYS[j]];
        x[j] = typeof v === 'number' ? v : 0;
      }

      if (isUser) {
        userRows.push({ idx: i, x, y: labelMap.get(i), isUser: true, sampleWeight: 1 });
      } else if (wantAnchor) {
        // High-confidence weak-supervision anchors from this chat:
        // clearly substantive (long, informative, not laugh/ack/dup) -> 1
        // clearly filler (laughOnly, ackOnly, emojiOnly, dup, or charRepeat) -> 0
        const baseP = score(f, baseModel);
        if (baseP >= 0.85 && posAnchors.length < maxAnchors / 2) {
          posAnchors.push({ idx: i, x, y: 1, isUser: false, sampleWeight: 1 });
        } else if (baseP <= 0.15 && negAnchors.length < maxAnchors / 2) {
          negAnchors.push({ idx: i, x, y: 0, isUser: false, sampleWeight: 1 });
        }
      }
    }

    // Balance anchors so training isn't skewed 98/2 on a chat with few laughs.
    const anchorCount = Math.min(posAnchors.length, negAnchors.length) > 0
      ? Math.min(Math.max(posAnchors.length, negAnchors.length), maxAnchors)
      : Math.max(posAnchors.length, negAnchors.length);
    const half = Math.ceil(anchorCount / 2);
    const anchors = posAnchors.slice(0, half).concat(negAnchors.slice(0, half));

    // Scale user label weight so human labels strongly steer the boundary even when few.
    const hasUser = userRows.length > 0;
    const userWeight = hasUser
      ? Math.max(4, Math.min(28, (anchors.length * 0.65) / Math.max(1, userRows.length)))
      : 1;
    for (let i = 0; i < userRows.length; i++) userRows[i].sampleWeight = userWeight;

    // Deterministic stratified 80/20 split on anchors for validation metrics.
    const trainRows = [];
    const valRows = [];
    for (let i = 0; i < anchors.length; i++) {
      if (i % 5 === 4 && anchors.length >= 10) valRows.push(anchors[i]);
      else trainRows.push(anchors[i]);
    }
    // Include user rows in training (and report user-fit accuracy separately).
    for (let i = 0; i < userRows.length; i++) trainRows.push(userRows[i]);

    const D = FEATURE_KEYS.length;
    const priorW = FEATURE_KEYS.map((k) => baseModel.weights[k] || 0);
    const priorB = baseModel.bias;
    const w = priorW.slice();
    let b = priorB;

    if (!trainRows.length) {
      return {
        model: {
          name: hasUser ? 'custom' : (baseModel.name || 'balanced'),
          label: hasUser ? 'Custom trained' : (baseModel.label || 'Balanced'),
          bias: b,
          weights: Object.assign({}, baseModel.weights),
          metrics: null,
        },
        lossHistory: [],
        metrics: {
          trainCount: 0, valCount: 0, userCount: userRows.length,
          accuracy: 1, precision: 1, recall: 1, f1: 1, rocAuc: null, userAccuracy: null, epochs: 0,
        },
      };
    }

    // Batch gradient descent with momentum + MAP L2 prior toward base weights.
    const epochs = opts.epochs || 140;
    const baseLr = opts.lr || 0.35;
    const lambda = opts.lambda != null ? opts.lambda : (hasUser ? 0.015 : 0.03);
    const beta = 0.85;
    const vW = new Array(D).fill(0);
    let vB = 0;
    const lossHistory = [];

    let totalWeight = 0;
    for (let i = 0; i < trainRows.length; i++) totalWeight += trainRows[i].sampleWeight;
    const invW = 1 / Math.max(1e-9, totalWeight);

    for (let ep = 0; ep < epochs; ep++) {
      const lr = baseLr * (0.15 + 0.85 * 0.5 * (1 + Math.cos((Math.PI * ep) / epochs)));
      const gW = new Array(D).fill(0);
      let gB = 0;
      let loss = 0;

      for (let i = 0; i < trainRows.length; i++) {
        const r = trainRows[i];
        let z = b;
        for (let j = 0; j < D; j++) z += w[j] * r.x[j];
        const p = sigmoid(z);
        const err = (p - r.y) * r.sampleWeight;
        gB += err;
        for (let j = 0; j < D; j++) {
          if (r.x[j] !== 0) gW[j] += err * r.x[j];
        }
        const pc = Math.min(1 - 1e-7, Math.max(1e-7, p));
        loss += r.sampleWeight * (-(r.y * Math.log(pc) + (1 - r.y) * Math.log(1 - pc)));
      }

      // MAP L2 regularization toward priorW prevents wild drift on unobserved features.
      let reg = 0;
      for (let j = 0; j < D; j++) {
        const diff = w[j] - priorW[j];
        reg += 0.5 * lambda * diff * diff;
        const grad = gW[j] * invW + lambda * diff;
        vW[j] = beta * vW[j] + (1 - beta) * grad;
        w[j] = Math.max(-6, Math.min(6, w[j] - lr * vW[j]));
      }
      const gradB = gB * invW + lambda * 0.25 * (b - priorB);
      vB = beta * vB + (1 - beta) * gradB;
      b = Math.max(-5, Math.min(5, b - lr * vB));

      if (ep % 5 === 0 || ep === epochs - 1) {
        lossHistory.push(Math.round((loss * invW + reg) * 10000) / 10000);
      }
    }

    const evalSet = valRows.length >= 6 ? valRows : trainRows;
    const valEval = evalPredictions(evalSet, b, w);
    const userEval = userRows.length ? evalPredictions(userRows, b, w) : null;

    const fittedWeights = {};
    for (let j = 0; j < D; j++) {
      fittedWeights[FEATURE_KEYS[j]] = Math.round(w[j] * 1000) / 1000;
    }

    const metrics = {
      trainCount: trainRows.length,
      valCount: valRows.length,
      userCount: userRows.length,
      anchorCount: anchors.length,
      epochs,
      finalLoss: lossHistory[lossHistory.length - 1] || 0,
      initialLoss: lossHistory[0] || 0,
      accuracy: valEval.accuracy,
      precision: valEval.precision,
      recall: valEval.recall,
      f1: valEval.f1,
      rocAuc: valEval.rocAuc,
      userAccuracy: userEval ? userEval.accuracy : null,
      lossHistory,
    };

    const fittedModel = {
      name: hasUser ? 'custom' : 'calibrated',
      label: hasUser ? `Custom (${userRows.length} labels)` : 'Chat-calibrated',
      bias: Math.round(b * 1000) / 1000,
      weights: fittedWeights,
      metrics,
    };

    return {
      model: fittedModel,
      lossHistory,
      metrics,
    };
  }

  // Convenience wrapper: zero-click self-supervised calibration on a chat.
  function autoTrain(messages, opts) {
    return train(messages, null, opts);
  }

  // Dump a labelled feature table as CSV — feed this to sklearn/PyTorch/whatever
  // to train an external model, or inspect the exact feature matrix.
  function toCSV(messages, opts) {
    opts = opts || {};
    const msgs = messages || [];
    const msArr = opts.ms || null;
    const activeModel = resolveModel(opts.model || opts.preset);
    const corpus = opts.corpus || buildCorpusStats(msgs);
    const userLabels = opts.userLabels instanceof Map ? opts.userLabels : null;

    const ctx = {
      prevBySender: new Map(),
      lastSender: null,
      lastMs: null,
      runLen: 0,
      shortRunLen: 0,
      ms: null,
      corpus,
    };

    const cols = [
      'label', 'kind', 'weight', 'len', 'words', 'uniqueRatio', 'idfMean',
      'capsRatio', 'emojiRatio', 'hasLink', 'hasQuestion', 'hasNumber',
      'laughOnly', 'laughRatio', 'ackOnly', 'emojiOnly', 'tiny', 'charRepeat',
      'dup', 'burst', 'burstDepth', 'runPos', 'media', 'deleted', 'gapMs',
    ];
    const rows = [cols.join(',')];
    for (let i = 0; i < msgs.length; i++) {
      const m = msgs[i];
      ctx.ms = extractMs(msArr, i);
      const f = features(m, ctx);
      const w = score(f, activeModel);
      const kind = kindOf(m, f, w);
      let label;
      if (userLabels && userLabels.has(i)) {
        label = userLabels.get(i);
      } else {
        label = (kind === 'media' || kind === 'deleted') ? '' : (kind === 'substantive' ? 1 : 0);
      }
      rows.push([
        label, kind, Math.round(w * 1000) / 1000, f.len, f.words,
        f.uniqueRatio.toFixed(3), f.idfMean.toFixed(3),
        f.capsRatio.toFixed(3), f.emojiRatio.toFixed(3),
        f.hasLink, f.hasQuestion, f.hasNumber,
        f.laughOnly, f.laughRatio.toFixed(3), f.ackOnly, f.emojiOnly,
        f.tiny, f.charRepeat.toFixed(3),
        f.dup, f.burst, f.burstDepth.toFixed(3), f.runPos,
        f.media, f.deleted, f.gapMs === null ? '' : f.gapMs,
      ].join(','));
      updateContext(ctx, m, f);
    }
    return rows.join('\n') + '\n';
  }

  return {
    MODEL,
    PRESETS,
    FEATURE_META,
    FEATURE_KEYS,
    DUP_WINDOW_MS,
    BURST_MS,
    DUP_FACTOR,
    LAUGH_RE,
    sigmoid,
    buildCorpusStats,
    features,
    score,
    kindOf,
    explain,
    analyze,
    sampleUncertain,
    train,
    autoTrain,
    toCSV,
  };
});
