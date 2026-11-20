/*
 * quality.js — message-quality scoring ("spam-adjusted counts") for a parsed chat.
 *
 * This is the tiny, fully client-side "ML pipeline" for the counter:
 *
 *   raw export line
 *     -> features(msg)            feature extraction (length, vocabulary, laugh-only,
 *                                 ack-only, emoji-only, duplicate, burst, link, …)
 *     -> score(features, MODEL)  logistic regression  p = sigmoid(b + Σ wᵢ·xᵢ)
 *     -> cleaning rules           media/deleted -> weight 0, consecutive duplicates
 *                                 collapse (weight × DUP_FACTOR)
 *     -> analyze(messages)        per-sender adjusted = Σ weights, plus a breakdown
 *                                 of what was filtered (laughs, acks, dupes, media…)
 *
 * The MODEL weights below are hand-set on obvious examples, but they are a real
 * logistic model: to "train" your own, call toCSV(messages) to dump a labelled
 * feature table, fit a logistic regression on it in Python/sklearn (or anywhere),
 * and paste the fitted weights back into MODEL. Inference then runs entirely in
 * the browser — no server, no data leaving the device.
 *
 * API:
 *   features(msg, ctx)      -> { len, words, uniqueRatio, capsRatio, emojiRatio, hasLink,
 *                               hasQuestion, laughOnly, ackOnly, emojiOnly, tiny, dup,
 *                               burst, media, deleted, gapMs }
 *   score(f)                -> weight in [0, 1] (probability the message is substantive)
 *   kindOf(msg, f)          -> 'media' | 'deleted' | 'duplicate' | 'emoji' | 'reaction'
 *                            | 'ack' | 'substantive'
 *   analyze(messages, opts) -> { total, adjusted, filtered, counts, senders, weights, kinds }
 *       opts.ms: array aligned with messages with epoch-ms timestamps (or null),
 *                e.g. parser.parseTimestamps(messages).map(t => t && t.ms)
 *   toCSV(messages, opts)   -> labelled feature table as CSV (for training your own model)
 *   MODEL                   -> the logistic weights { bias, weights: { feature: w } }
 *
 * Works in the browser (window.WhatsAppQuality) and in node (module.exports);
 * in node it require()s words.js for tokenization, in the browser index.html
 * must load words.js first.
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

  // Laugh tokens: haha…, hehe…, lol…, lmao…, rofl, xd… (doubled letters required
  // so ordinary words like "he" or "ha" don't count).
  const LAUGH_TOKEN = '(?:ha(?:ha)+|he(?:he)+|lol+|lmao+|rofl|xd{2,})';
  const LAUGH_ONLY_RE = new RegExp('^(?:' + LAUGH_TOKEN + ')(?:\\s*(?:' + LAUGH_TOKEN + '))*[\\s.,!?]*$', 'i');
  const LAUGH_RE = new RegExp('\\b(?:ha(?:ha)+|he(?:he)+|lol+|lmao+|rofl)\\b|[😂🤣💀]', 'iu');

  // One-word acknowledgements — real messages, but near-zero effort.
  const ACK_SET = new Set([
    'ok', 'okay', 'okey', 'oke', 'k', 'kk', 'yep', 'yup', 'yes', 'yeah', 'ye',
    'no', 'nope', 'nah', 'sure', 'cool', 'nice', 'good', 'thanks', 'thank you',
    'thx', 'ty', 'pls', 'please', '👍', '❤️', '🙏', '😅', '😬', '👌', '🔥',
  ]);

  const URL_RE = /(?:https?:\/\/|www\.)\S+/i;
  const UPPER_RE = /\p{Lu}/gu;
  const LETTER_RE = /\p{L}/gu;
  let EMOJI_RE = null;
  try { EMOJI_RE = new RegExp('\\p{Extended_Pictographic}', 'gu'); } catch (e) { /* older engine */ }

  const tokenize = (WORDS && WORDS.tokenize)
    ? WORDS.tokenize
    : (t) => String(t || '').toLowerCase().match(/[\p{L}\p{N}](?:['’\-][\p{L}\p{N}])*/gu) || [];

  // Two identical messages from the same sender within this window are treated
  // as a double-send / paste-spam duplicate (the first one still scores normally).
  const DUP_WINDOW_MS = 120 * 1000;
  // A reply from the same sender within this window is a rapid-fire burst.
  const BURST_MS = 3000;
  // Duplicate messages keep this fraction of their score.
  const DUP_FACTOR = 0.35;

  // Logistic-regression weights. Features are roughly scaled to [0, 1]; positive
  // weights push towards "substantive", negative towards "low-effort filler".
  // Hand-set on obvious examples — replace with fitted weights from toCSV() if
  // you train a real model.
  const MODEL = {
    bias: -1.0,
    weights: {
      lenNorm: 2.4,       // min(1, chars / 140)
      wordsNorm: 1.8,     // min(1, words / 24)
      uniqueRatio: 0.7,   // unique words / words
      hasQuestion: 0.5,
      hasLink: 0.4,
      capsRatio: 0.3,     // ALL-CAPS share of letters (shouting is effort)
      emojiRatio: -0.3,   // emoji share of characters
      laughOnly: -3.8,    // the whole message is "haha 😂"
      ackOnly: -3.4,      // the whole message is "ok" / "👍"
      emojiOnly: -3.6,    // no letters at all
      tiny: -1.2,         // ≤3 chars, no question, no link
      dup: -1.6,          // identical repeat within DUP_WINDOW_MS
      burst: -0.5,        // same sender again within BURST_MS
    },
  };

  function sigmoid(z) { return 1 / (1 + Math.exp(-z)); }

  function normalizeText(text) {
    return String(text || '').toLowerCase().replace(/\s+/g, ' ').trim();
  }

  // Strip emoji + punctuation; what remains decides laugh-only vs ack vs emoji-only.
  function stripEmojiPunct(text) {
    let t = String(text || '');
    if (EMOJI_RE) t = t.replace(EMOJI_RE, ' ');
    t = t.replace(/[^\p{L}\p{N}\s]/gu, ' ');
    return t.replace(/\s+/g, ' ').trim();
  }

  function countEmoji(text) {
    if (!EMOJI_RE) return 0;
    const m = String(text || '').match(EMOJI_RE);
    return m ? m.length : 0;
  }

  /*
   * Extract the feature vector for one message.
   * ctx: { prevBySender: Map<sender, { norm, ms }>, ms: epoch-ms of this message or null }
   * (features() creates and updates nothing itself; analyze() drives the context,
   *  but callers may reuse the same ctx object across calls to get dup/burst flags.)
   */
  function features(msg, ctx) {
    ctx = ctx || { prevBySender: new Map(), ms: null };
    const text = String((msg && msg.text) || '');
    const trimmed = text.trim();
    const media = Boolean(msg && (msg.media || MEDIA_RE.test(trimmed)));
    const deleted = Boolean(msg && (msg.deleted || DELETED_RE.test(trimmed)));

    const toks = tokenize(trimmed);
    const words = toks.length;
    const unique = new Set(toks).size;
    const chars = trimmed.length;
    const letters = trimmed.match(LETTER_RE);
    const uppers = trimmed.match(UPPER_RE);
    const emojis = countEmoji(trimmed);

    const stripped = stripEmojiPunct(trimmed);
    const lower = normalizeText(trimmed);
    const ackNorm = stripped.toLowerCase();
    const laughOnly = !media && !deleted && stripped.length > 0 && LAUGH_ONLY_RE.test(stripped);
    const ackOnly = !media && !deleted && (ACK_SET.has(lower) || ACK_SET.has(ackNorm));
    const emojiOnly = !media && !deleted && !ackOnly && stripped.length === 0 && emojis > 0;
    const hasLink = URL_RE.test(trimmed);
    const hasQuestion = trimmed.indexOf('?') !== -1;
    const tiny = !media && !deleted && chars <= 3 && !hasQuestion && !hasLink;

    // Duplicate / burst need the previous message from the SAME sender.
    const prev = ctx.prevBySender.get(msg && msg.sender);
    const ms = typeof ctx.ms === 'number' ? ctx.ms : null;
    let dup = false;
    let burst = false;
    let gapMs = null;
    if (prev && ms !== null && typeof prev.ms === 'number') {
      gapMs = ms - prev.ms;
      if (gapMs >= 0 && gapMs <= DUP_WINDOW_MS && prev.norm === lower && lower.length > 0) dup = true;
      if (gapMs >= 0 && gapMs <= BURST_MS) burst = true;
    }

    return {
      len: chars,
      words,
      uniqueRatio: words ? unique / words : 0,
      capsRatio: letters && letters.length ? (uppers ? uppers.length : 0) / letters.length : 0,
      emojiRatio: chars ? emojis / chars : 0,
      hasLink: hasLink ? 1 : 0,
      hasQuestion: hasQuestion ? 1 : 0,
      laughOnly: laughOnly ? 1 : 0,
      ackOnly: ackOnly ? 1 : 0,
      emojiOnly: emojiOnly ? 1 : 0,
      tiny: tiny ? 1 : 0,
      dup: dup ? 1 : 0,
      burst: burst ? 1 : 0,
      media: media ? 1 : 0,
      deleted: deleted ? 1 : 0,
      gapMs,
      // model-ready scaled features
      lenNorm: Math.min(1, chars / 140),
      wordsNorm: Math.min(1, words / 24),
    };
  }

  // Logistic score: probability the message is "substantive" (worth a full count).
  function score(f) {
    if (!f) return 0;
    if (f.media || f.deleted) return 0;
    let z = MODEL.bias;
    const w = MODEL.weights;
    for (const k of Object.keys(w)) {
      const v = f[k];
      if (typeof v === 'number') z += w[k] * v;
    }
    let p = sigmoid(z);
    if (f.dup) p *= DUP_FACTOR;
    return Math.min(1, Math.max(0, p));
  }

  function kindOf(msg, f) {
    if (!f) return 'substantive';
    if (f.media) return 'media';
    if (f.deleted) return 'deleted';
    if (f.dup) return 'duplicate';
    if (f.ackOnly) return 'ack';
    if (f.emojiOnly) return 'emoji';
    if (f.laughOnly) return 'reaction';
    return 'substantive';
  }

  /*
   * Run the whole pipeline over a parsed chat.
   * messages: parser.js result.messages; opts.ms: aligned epoch-ms array (or nulls).
   */
  function analyze(messages, opts) {
    opts = opts || {};
    const msgs = messages || [];
    const msArr = opts.ms || null;
    const prevBySender = new Map();
    const weights = new Array(msgs.length);
    const kinds = new Array(msgs.length);
    const counts = { substantive: 0, reaction: 0, ack: 0, emoji: 0, duplicate: 0, media: 0, deleted: 0 };
    const senders = new Map();

    let adjusted = 0;

    const getS = (name) => {
      let s = senders.get(name);
      if (!s) {
        s = {
          sender: name, raw: 0, adjusted: 0, reactions: 0, acks: 0, emojis: 0,
          dupes: 0, media: 0, deleted: 0, bursts: 0,
        };
        senders.set(name, s);
      }
      return s;
    };

    for (let i = 0; i < msgs.length; i++) {
      const m = msgs[i];
      const ctx = {
        prevBySender,
        ms: msArr ? (typeof msArr[i] === 'number' ? msArr[i] : (msArr[i] && typeof msArr[i].ms === 'number' ? msArr[i].ms : null)) : null,
      };
      const f = features(m, ctx);
      const kind = kindOf(m, f);
      const w = score(f);

      weights[i] = Math.round(w * 1000) / 1000;
      kinds[i] = kind;
      counts[kind]++;
      adjusted += w;

      const st = getS(m.sender);
      st.raw++;
      st.adjusted += w;
      if (kind === 'reaction') st.reactions++;
      else if (kind === 'ack') st.acks++;
      else if (kind === 'emoji') st.emojis++;
      else if (kind === 'duplicate') st.dupes++;
      else if (kind === 'media') st.media++;
      else if (kind === 'deleted') st.deleted++;
      if (f.burst && kind === 'substantive') st.bursts++;

      // Update the same-sender context for the next message (dup/burst detection).
      const norm = normalizeText(m.text);
      prevBySender.set(m.sender, { norm, ms: ctx.ms });
    }

    const senderList = Array.from(senders.values()).map((s) => ({
      sender: s.sender,
      raw: s.raw,
      adjusted: Math.round(s.adjusted * 10) / 10,
      filtered: Math.round((s.raw - s.adjusted) * 10) / 10,
      reactions: s.reactions,
      acks: s.acks,
      emojis: s.emojis,
      dupes: s.dupes,
      media: s.media,
      deleted: s.deleted,
      bursts: s.bursts,
    })).sort((a, b) => b.adjusted - a.adjusted || b.raw - a.raw || a.sender.localeCompare(b.sender));

    const total = msgs.length;
    return {
      total,
      adjusted: Math.round(adjusted * 10) / 10,
      filtered: Math.round((total - adjusted) * 10) / 10,
      counts,
      senders: senderList,
      weights,
      kinds,
    };
  }

  // Dump a labelled feature table as CSV — feed this to sklearn/PyTorch/whatever
  // to train a real model, then paste the fitted weights into MODEL.
  function toCSV(messages, opts) {
    opts = opts || {};
    const msgs = messages || [];
    const msArr = opts.ms || null;
    const prevBySender = new Map();
    const cols = ['label', 'kind', 'weight', 'len', 'words', 'uniqueRatio', 'capsRatio',
      'emojiRatio', 'hasLink', 'hasQuestion', 'laughOnly', 'ackOnly', 'emojiOnly',
      'tiny', 'dup', 'burst', 'media', 'deleted', 'gapMs'];
    const rows = [cols.join(',')];
    for (let i = 0; i < msgs.length; i++) {
      const m = msgs[i];
      const ctx = {
        prevBySender,
        ms: msArr ? (typeof msArr[i] === 'number' ? msArr[i] : (msArr[i] && typeof msArr[i].ms === 'number' ? msArr[i].ms : null)) : null,
      };
      const f = features(m, ctx);
      const kind = kindOf(m, f);
      const w = score(f);
      // suggested training label: 1 = substantive, 0 = filler (media/deleted excluded)
      const label = (kind === 'media' || kind === 'deleted') ? '' : (kind === 'substantive' ? 1 : 0);
      rows.push([
        label, kind, Math.round(w * 1000) / 1000, f.len, f.words,
        f.uniqueRatio.toFixed(3), f.capsRatio.toFixed(3), f.emojiRatio.toFixed(3),
        f.hasLink, f.hasQuestion, f.laughOnly, f.ackOnly, f.emojiOnly,
        f.tiny, f.dup, f.burst, f.media, f.deleted,
        f.gapMs === null ? '' : f.gapMs,
      ].join(','));
      prevBySender.set(m.sender, { norm: normalizeText(m.text), ms: ctx.ms });
    }
    return rows.join('\n') + '\n';
  }

  return {
    MODEL,
    DUP_WINDOW_MS,
    BURST_MS,
    DUP_FACTOR,
    LAUGH_RE,
    sigmoid,
    features,
    score,
    kindOf,
    analyze,
    toCSV,
  };
});
