/*
 * words.js — vocabulary games for a parsed WhatsApp chat (the "word games" section).
 *
 * Pure functions over parser.js's result.messages, no DOM, no network:
 *   tokenize(text)        -> lowercase word tokens (Unicode-aware; contractions and
 *                            hyphenated words kept, pure numbers dropped, emoji ignored)
 *   analyze(messages, opts) -> same as analyze(messages), but with
 *                              opts.senderMap / opts.nameMap (Maps of real name ->
 *                              "Person X" label, e.g. from parser.js's senderMap()
 *                              and detectNames()) every whole-word name token in
 *                              the counts is shown as its label, so the word cloud
 *                              and signatures don't leak names typed inside texts
 *   analyze(messages)     -> { totalWords, uniqueWords, ratio, messageCount, mediaSkipped,
 *                              top, topEmoji, senders: [{ sender, total, unique, ratio,
 *                              top, signature }] } — senders ranked by vocabulary size
 *   BOOKS                 -> famous books with rough unique-word counts (a game, not a
 *                            library — the numbers are public approximations)
 *   bookReport(unique)    -> per-book coverage % plus the biggest book that many unique
 *                            words could have written ("the book bank")
 *
 * Media placeholder messages (<Media omitted>, (file attached), …) carry no words
 * and are skipped (counted separately as mediaSkipped).
 *
 * Works in the browser (window.WhatsAppWords) and in node (module.exports)
 * so the analysis can be unit-tested.
 */
(function (root, factory) {
  const api = factory();
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.WhatsAppWords = api;
})(typeof self !== 'undefined' ? self : globalThis, function () {
  'use strict';

  // Same placeholder detection as parser.js — those messages are not prose.
  const MEDIA_RE = /<media omitted>|\(file attached\)|\b(?:image|video|audio|sticker|document|location|contact card|gif|voice message) omitted\b/i;
  const DELETED_RE = /^(?:this message was deleted|you deleted this message)\.?$/i;
  const isDeleted = (m) => Boolean(m.deleted || DELETED_RE.test(String(m.text || '').trim()));
  const isNonProse = (m) => Boolean(m.media || MEDIA_RE.test(m.text) || isDeleted(m));

  // Word tokens: runs of Unicode letters/numbers, keeping inner apostrophes and
  // hyphens ("don't", "well-known"). Standalone pure numbers ("8", "2025") are
  // dropped afterwards — they're times and years, not vocabulary.
  const TOKEN_RE = /[\p{L}\p{N}]+(?:['’\-][\p{L}\p{N}]+)*/gu;
  const PURE_NUMBER_RE = /^\p{N}+$/u;

  // Emoji, including ZWJ sequences (families, couples) and skin-tone modifiers.
  const EMOJI_RE = /\p{Extended_Pictographic}(?:[\uFE0E\uFE0F]|\p{Emoji_Modifier})?(?:\u200D\p{Extended_Pictographic}(?:[\uFE0E\uFE0F]|\p{Emoji_Modifier})?)*/gu;

  function tokenize(text) {
    const matches = String(text).toLowerCase().match(TOKEN_RE);
    if (!matches) return [];
    const out = [];
    for (const w of matches) {
      if (!PURE_NUMBER_RE.test(w)) out.push(w);
    }
    return out;
  }

  // Common grammatical glue words skipped from the cloud/signatures when
  // opts.filterStopWords is true (totals & unique counts stay unfiltered).
  const STOP_WORDS = new Set([
    'a', 'an', 'the', 'and', 'or', 'but', 'if', 'so', 'as', 'at', 'by', 'for', 'from', 'in',
    'into', 'of', 'on', 'out', 'over', 'to', 'up', 'with', 'about', 'after', 'than', 'then',
    'i', 'me', 'my', 'mine', 'we', 'us', 'our', 'ours', 'you', 'your', 'yours', 'he', 'him',
    'his', 'she', 'her', 'hers', 'it', 'its', 'they', 'them', 'their', 'theirs',
    'this', 'that', 'these', 'those', 'there', 'here', 'what', 'which', 'who', 'whom', 'when',
    'where', 'why', 'how', 'all', 'any', 'both', 'each', 'more', 'most', 'other', 'some',
    'such', 'only', 'own', 'same', 'too', 'very', 'just', 'also', 'now',
    'am', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
    'have', 'has', 'had', 'having', 'do', 'does', 'did', 'doing',
    'will', 'would', 'shall', 'should', 'can', 'could', 'may', 'might', 'must',
    'not', 'no', 'nor',
    "i'm", "i've", "i'll", "i'd", "you're", "you've", "you'll", "you'd",
    "he's", "she's", "it's", "we're", "we've", "we'll", "they're", "they've", "they'll",
    "that's", "there's", "here's", "what's", "who's", "let's",
    "don't", "doesn't", "didn't", "can't", "couldn't", "won't", "wouldn't",
    "shouldn't", "isn't", "aren't", "wasn't", "weren't", "haven't", "hasn't", "hadn't",
    'im', 'ive', 'ill', 'youre', 'its', 'thats', 'dont', 'didnt', 'cant', 'wont',
  ]);

  // Top-n of a Map as [{ [key]: value, count }], ties broken alphabetically.
  function topEntries(map, n, key, skip) {
    const out = [];
    for (const [value, count] of map.entries()) {
      if (skip && skip.has(value)) continue;
      out.push({ [key]: value, count });
    }
    return out
      .sort((a, b) => b.count - a.count || String(a[key]).localeCompare(String(b[key])))
      .slice(0, n);
  }

  function analyze(messages, opts) {
    // Optional anonymization: opts.senderMap (the chat's senders) and
    // opts.nameMap (other detected names, e.g. parser.js's detectNames())
    // map real names to labels. Tokens are lowercased by tokenize(), so the
    // lookup is keyed on the lowercase name; one-letter names are skipped —
    // replacing a single-letter token would relabel ordinary words (same rule
    // as parser.js's replaceNames).
    let nameLabels = null;
    if (opts && (opts.senderMap || opts.nameMap)) {
      nameLabels = new Map();
      const add = (map) => {
        if (!map) return;
        for (const [name, label] of map) {
          if (name.length >= 2 && !nameLabels.has(name.toLowerCase())) {
            nameLabels.set(name.toLowerCase(), label);
          }
        }
      };
      add(opts.senderMap);
      add(opts.nameMap);
      if (!nameLabels.size) nameLabels = null;
    }

    const skip = opts && opts.filterStopWords ? STOP_WORDS : null;
    const overall = new Map();
    const emoji = new Map();
    const perSender = new Map();
    let totalWords = 0;
    let mediaSkipped = 0;
    let messageCount = 0;

    for (const m of messages) {
      if (m.media || MEDIA_RE.test(m.text)) {
        mediaSkipped++;
        continue;
      }
      if (isDeleted(m)) continue;
      messageCount++;
      const tokens = tokenize(m.text);
      totalWords += tokens.length;

      let s = perSender.get(m.sender);
      if (!s) {
        s = { sender: m.sender, counts: new Map(), emoji: new Map(), total: 0 };
        perSender.set(m.sender, s);
      }
      for (const raw of tokens) {
        const t = nameLabels ? nameLabels.get(raw) || raw : raw;
        overall.set(t, (overall.get(t) || 0) + 1);
        s.counts.set(t, (s.counts.get(t) || 0) + 1);
        s.total++;
      }

      const em = m.text.match(EMOJI_RE);
      if (em) {
        for (const e of em) {
          emoji.set(e, (emoji.get(e) || 0) + 1);
          s.emoji.set(e, (s.emoji.get(e) || 0) + 1);
        }
      }
    }

    const senders = Array.from(perSender.values())
      .map((s) => {
        let top = topEntries(s.counts, 5, 'word', skip);
        if (!top.length && skip) top = topEntries(s.counts, 5, 'word');
        const fav = topEntries(s.emoji, 1, 'emoji');

        // Catchphrase: most distinctively used word compared to everyone else in the chat.
        let catchphrase = null;
        if (perSender.size >= 2 && s.total > 0) {
          const minCount = s.total >= 60 ? 3 : s.total >= 20 ? 2 : 1;
          const totalOthers = Math.max(0, totalWords - s.total);
          let bestScore = 0;
          let bestWord = null;
          let bestCount = 0;
          let bestShare = 0;
          for (const [word, countSelf] of s.counts.entries()) {
            if (countSelf < minCount) continue;
            if (word.length < 2) continue;
            if (STOP_WORDS.has(word)) continue;
            if (nameLabels && /^Person [A-Z]+$/.test(word)) continue;
            const totalW = overall.get(word) || countSelf;
            const countOthers = Math.max(0, totalW - countSelf);
            const pSelf = (countSelf + 0.5) / (s.total + 10);
            const pOthers = (countOthers + 0.5) / (totalOthers + 10);
            if (pSelf <= pOthers * 1.15) continue;
            const score = (pSelf / pOthers) * Math.log2(1 + countSelf);
            if (score > bestScore || (score === bestScore && bestWord && word.localeCompare(bestWord) < 0)) {
              bestScore = score;
              bestWord = word;
              bestCount = countSelf;
              bestShare = Math.round((countSelf / totalW) * 100);
            }
          }
          if (bestWord) {
            catchphrase = { word: bestWord, count: bestCount, share: bestShare };
          }
        }

        return {
          sender: s.sender,
          total: s.total,
          unique: s.counts.size,
          ratio: s.total ? s.counts.size / s.total : 0,
          top,
          signature: top.length ? top[0].word : null,
          catchphrase,
          favEmoji: fav.length ? fav[0] : null,
        };
      })
      // Rank by vocabulary size, then by diversity ratio, then by name.
      .sort((a, b) => b.unique - a.unique || b.ratio - a.ratio || a.sender.localeCompare(b.sender));

    let top = topEntries(overall, 12, 'word', skip);
    if (!top.length && skip) top = topEntries(overall, 12, 'word');

    return {
      totalWords,
      uniqueWords: overall.size,
      ratio: totalWords ? overall.size / totalWords : 0,
      messageCount,
      mediaSkipped,
      top,
      topEmoji: topEntries(emoji, 5, 'emoji'),
      senders,
    };
  }

  // Pick clean, non-trivial message candidates for the "Who said it?" mini-game.
  // Excludes media placeholders, bare URLs, very short messages, and huge essays,
  // and balances across senders. Returns [{ index, sender, ts, text }].
  function quizCandidates(messages, opts) {
    opts = opts || {};
    const maxTotal = opts.limit || 240;
    const urlOnlyRe = /^\s*(?:https?:\/\/|www\.)\S+\s*$/i;
    const cleanText = (t) => String(t).replace(/\s+/g, ' ').trim();

    const collect = (minChars, minWords) => {
      const bySender = new Map();
      for (let i = 0; i < messages.length; i++) {
        const m = messages[i];
        if (isNonProse(m)) continue;
        const txt = cleanText(m.text);
        if (txt.length < minChars || txt.length > 220) continue;
        if (urlOnlyRe.test(txt)) continue;
        const words = tokenize(txt);
        if (words.length < minWords) continue;
        let arr = bySender.get(m.sender);
        if (!arr) { arr = []; bySender.set(m.sender, arr); }
        arr.push({ index: i, sender: m.sender, ts: m.ts, text: txt });
      }
      return bySender;
    };

    let bySender = collect(16, 3);
    let total = 0;
    for (const arr of bySender.values()) total += arr.length;
    if (total < 6 || bySender.size < 2) {
      bySender = collect(8, 2);
    }

    const senders = Array.from(bySender.keys());
    if (senders.length < 2) return [];

    // Sample evenly across senders so one hyper-active sender doesn't dominate.
    const perCap = Math.max(8, Math.ceil(maxTotal / senders.length));
    const pool = [];
    for (const arr of bySender.values()) {
      if (arr.length <= perCap) {
        for (const item of arr) pool.push(item);
      } else {
        const step = arr.length / perCap;
        for (let k = 0; k < perCap; k++) {
          pool.push(arr[Math.floor(k * step)]);
        }
      }
    }
    return pool;
  }

  // Rough unique-word counts of famous books, ascending. These are widely cited
  // approximations (word forms, not lemmas) — good enough for a game, and the UI
  // labels them with "≈".
  const BOOKS = [
    { title: 'Green Eggs and Ham', author: 'Dr. Seuss', uniqueWords: 50, totalWords: 800 },
    { title: 'The Cat in the Hat', author: 'Dr. Seuss', uniqueWords: 230, totalWords: 1600 },
    { title: 'The Hobbit', author: 'J.R.R. Tolkien', uniqueWords: 6500, totalWords: 95000 },
    { title: "Harry Potter and the Philosopher's Stone", author: 'J.K. Rowling', uniqueWords: 10500, totalWords: 77000 },
    { title: 'The Lord of the Rings', author: 'J.R.R. Tolkien', uniqueWords: 30000, totalWords: 576000 },
  ].sort((a, b) => a.uniqueWords - b.uniqueWords);

  // How much of each book's vocabulary does `uniqueWords` cover, and which is the
  // biggest book that vocabulary is large enough to have written?
  function bookReport(uniqueWords) {
    const books = BOOKS.map((b) => ({
      title: b.title,
      author: b.author,
      uniqueWords: b.uniqueWords,
      totalWords: b.totalWords,
      pct: b.uniqueWords ? Math.min(100, (uniqueWords / b.uniqueWords) * 100) : 100,
      covered: uniqueWords >= b.uniqueWords,
    }));
    const writable = books.filter((b) => b.covered).pop() || null; // books are ascending
    return { books, writable };
  }

  function escapeRegExp(s) {
    return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  function buildNameLookup(opts) {
    if (!opts || (!opts.senderMap && !opts.nameMap)) return null;
    const map = new Map();
    const add = (m) => {
      if (!m) return;
      for (const [name, label] of m) {
        if (name.length >= 2 && !map.has(name.toLowerCase())) {
          map.set(name.toLowerCase(), label);
        }
      }
    };
    add(opts.senderMap);
    add(opts.nameMap);
    return map.size ? map : null;
  }

  // "Chat Mad Libs" (Fill in the blank): picks real messages containing a distinctive
  // non-stop word from the chat, masks that word with "_____", and offers 4 words from
  // the chat's own vocabulary (1 right answer + 3 plausible distractors).
  function madLibsCandidates(messages, opts) {
    opts = opts || {};
    const maxTotal = opts.limit || 120;
    const urlOnlyRe = /^\s*(?:https?:\/\/|www\.)\S+\s*$/i;
    const cleanText = (t) => String(t).replace(/\s+/g, ' ').trim();
    const nameLabels = buildNameLookup(opts);
    const analysis = analyze(messages, {
      filterStopWords: true,
      senderMap: opts.senderMap,
      nameMap: opts.nameMap,
    });

    // Build pool of interesting candidate vocabulary words (skipping stop words, short words, and "Person X")
    const vocab = [];
    const seen = new Set();
    const addVocab = (w) => {
      if (!w || w.length < 4) return;
      if (STOP_WORDS.has(w)) return;
      if (/^Person [A-Z]+$/.test(w)) return;
      if (seen.has(w)) return;
      seen.add(w);
      vocab.push(w);
    };
    for (const s of analysis.senders) {
      if (s.catchphrase) addVocab(s.catchphrase.word);
      for (const t of s.top) addVocab(t.word);
    }
    for (const t of analysis.top) addVocab(t.word);

    // Also pull additional frequency-ranked words from the chat if vocab is still small
    if (vocab.length < 24) {
      const freq = new Map();
      for (const m of messages) {
        if (isNonProse(m)) continue;
        for (const raw of tokenize(m.text)) {
          const t = nameLabels ? nameLabels.get(raw) || raw : raw;
          if (t.length < 4 || STOP_WORDS.has(t) || /^Person [A-Z]+$/.test(t)) continue;
          freq.set(t, (freq.get(t) || 0) + 1);
        }
      }
      for (const [w] of Array.from(freq.entries()).sort((a, b) => b[1] - a[1])) {
        addVocab(w);
        if (vocab.length >= 60) break;
      }
    }

    if (vocab.length < 4) return [];

    const vocabSet = new Set(vocab);
    const items = [];
    const step = Math.max(1, Math.floor(messages.length / (maxTotal * 4)));

    for (let i = 0; i < messages.length; i += step) {
      const m = messages[i];
      if (isNonProse(m)) continue;
      const txt = cleanText(m.text);
      if (txt.length < 16 || txt.length > 180) continue;
      if (urlOnlyRe.test(txt)) continue;
      const tokens = tokenize(txt);
      if (tokens.length < 4) continue;

      // Pick the first vocab word occurring in this message (preferring catchphrases / longer words)
      const tokenSet = new Set(tokens);
      let chosen = null;
      for (const raw of tokens) {
        if (nameLabels && nameLabels.has(raw)) continue;
        if (!vocabSet.has(raw)) continue;
        if (!chosen || raw.length > chosen.length) chosen = raw;
      }
      if (!chosen) continue;

      const re = new RegExp('(?<![\\p{L}\\p{N}_])' + escapeRegExp(chosen) + '(?![\\p{L}\\p{N}_])', 'iu');
      if (!re.test(txt)) continue;

      // Pick 3 distractors from vocab not already in this message
      const distractors = [];
      const startOff = (i * 7 + chosen.length) % vocab.length;
      for (let k = 0; k < vocab.length && distractors.length < 3; k++) {
        const cand = vocab[(startOff + k) % vocab.length];
        if (cand !== chosen && !tokenSet.has(cand)) distractors.push(cand);
      }
      if (distractors.length < 3) continue;

      items.push({
        index: i,
        sender: m.sender,
        ts: m.ts,
        text: txt,
        answer: chosen,
        distractors,
      });
      if (items.length >= maxTotal) break;
    }
    return items;
  }

  // "Guess the Era" mini-game:
  //   - >= 2 distinct years  -> Guess the Year
  //   - >= 3 distinct months -> Guess the Month
  //   - otherwise            -> Guess the Act (Opening / Middle / Finale)
  const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  function eraQuizCandidates(messages, timestamps, opts) {
    opts = opts || {};
    const maxTotal = opts.limit || 150;
    const urlOnlyRe = /^\s*(?:https?:\/\/|www\.)\S+\s*$/i;
    const cleanText = (t) => String(t).replace(/\s+/g, ' ').trim();
    const tsArr = Array.isArray(timestamps) ? timestamps : [];

    const years = new Set();
    const months = new Set();
    for (let i = 0; i < tsArr.length; i++) {
      const p = tsArr[i];
      if (!p) continue;
      years.add(String(p.year));
      months.add(p.year + '-' + String(p.month).padStart(2, '0'));
    }

    let mode = 'act';
    let allChoices = ['Act I · Opening', 'Act II · Middle', 'Act III · Finale'];
    if (years.size >= 2) {
      mode = 'year';
      allChoices = Array.from(years).sort();
    } else if (months.size >= 3) {
      mode = 'month';
      allChoices = Array.from(months).sort().map((ym) => {
        const [y, m] = ym.split('-').map(Number);
        return MONTHS_SHORT[m - 1] + ' ' + y;
      });
    }

    const bucketOf = (i) => {
      if (mode === 'year') {
        const p = tsArr[i];
        return p ? String(p.year) : null;
      }
      if (mode === 'month') {
        const p = tsArr[i];
        return p ? MONTHS_SHORT[p.month - 1] + ' ' + p.year : null;
      }
      const third = messages.length / 3;
      if (i < third) return 'Act I · Opening';
      if (i < third * 2) return 'Act II · Middle';
      return 'Act III · Finale';
    };

    const byBucket = new Map();
    const collect = (minChars, minWords) => {
      byBucket.clear();
      for (let i = 0; i < messages.length; i++) {
        const m = messages[i];
        if (isNonProse(m)) continue;
        const txt = cleanText(m.text);
        if (txt.length < minChars || txt.length > 210) continue;
        if (urlOnlyRe.test(txt)) continue;
        if (tokenize(txt).length < minWords) continue;
        const ans = bucketOf(i);
        if (!ans) continue;
        let arr = byBucket.get(ans);
        if (!arr) { arr = []; byBucket.set(ans, arr); }
        arr.push({ index: i, sender: m.sender, ts: m.ts, text: txt, answer: ans });
      }
    };

    collect(14, 3);
    if (byBucket.size < 2) collect(6, 2);
    if (byBucket.size < 2) return { mode, choices: [], items: [] };

    const perCap = Math.max(8, Math.ceil(maxTotal / byBucket.size));
    const items = [];
    for (const arr of byBucket.values()) {
      if (arr.length <= perCap) {
        for (const it of arr) items.push(it);
      } else {
        const step = arr.length / perCap;
        for (let k = 0; k < perCap; k++) items.push(arr[Math.floor(k * step)]);
      }
    }

    return { mode, choices: allChoices, items };
  }

  // "Chat Eras" (Then vs. Now): splits the chat into first half vs. second half
  // and surfaces extinct words, rising slang, pace shift, and sender share shifts.
  function chatEras(messages, timestamps, opts) {
    opts = opts || {};
    const msgs = messages || [];
    if (msgs.length < 10) return null;

    const mid = Math.floor(msgs.length / 2);
    const tsArr = Array.isArray(timestamps) ? timestamps : [];
    const nameLabels = buildNameLookup(opts);

    const scanHalf = (start, end) => {
      const words = new Map();
      const senderCounts = new Map();
      const dayKeys = new Set();
      let totalWords = 0;
      let textMsgs = 0;
      let chars = 0;
      let firstP = null;
      let lastP = null;

      for (let i = start; i < end; i++) {
        const m = msgs[i];
        senderCounts.set(m.sender, (senderCounts.get(m.sender) || 0) + 1);
        const p = tsArr[i];
        if (p) {
          if (!firstP) firstP = p;
          lastP = p;
          dayKeys.add(p.dayKey);
        }
        if (isNonProse(m)) continue;
        textMsgs++;
        chars += m.text.length;
        for (const raw of tokenize(m.text)) {
          const t = nameLabels ? nameLabels.get(raw) || raw : raw;
          totalWords++;
          if (t.length < 3 || STOP_WORDS.has(t) || /^Person [A-Z]+$/.test(t)) continue;
          words.set(t, (words.get(t) || 0) + 1);
        }
      }

      return {
        count: end - start,
        textMsgs,
        totalWords,
        avgChars: textMsgs ? Math.round(chars / textMsgs) : 0,
        activeDays: dayKeys.size,
        msgsPerDay: dayKeys.size ? Math.round(((end - start) / dayKeys.size) * 10) / 10 : null,
        words,
        senderCounts,
        firstP,
        lastP,
      };
    };

    const thenH = scanHalf(0, mid);
    const nowH = scanHalf(mid, msgs.length);

    const labelSpan = (h, fallback) => {
      if (!h.firstP || !h.lastP) return fallback;
      if (h.firstP.year !== h.lastP.year) return `${h.firstP.year}–${h.lastP.year}`;
      if (h.firstP.month !== h.lastP.month) {
        return `${MONTHS_SHORT[h.firstP.month - 1]}–${MONTHS_SHORT[h.lastP.month - 1]} ${h.firstP.year}`;
      }
      if (h.firstP.day !== h.lastP.day) {
        return `${h.firstP.day}–${h.lastP.day} ${MONTHS_SHORT[h.firstP.month - 1]}`;
      }
      return fallback;
    };

    const thenLabel = labelSpan(thenH, 'First half');
    const nowLabel = labelSpan(nowH, 'Second half');
    const sameLabel = thenLabel === nowLabel;

    // Find extinct words (strong in Then, vanished/dropped in Now) and rising slang (strong in Now, absent/low in Then)
    const minCount = msgs.length >= 60 ? 2 : 1;
    const extinct = [];
    const rising = [];

    for (const [word, cThen] of thenH.words) {
      if (cThen < minCount) continue;
      const cNow = nowH.words.get(word) || 0;
      const rThen = (cThen + 0.5) / (thenH.totalWords + 20);
      const rNow = (cNow + 0.5) / (nowH.totalWords + 20);
      if (rThen > rNow * 1.6 && cThen > cNow) {
        const score = (rThen / rNow) * Math.log2(1 + cThen);
        extinct.push({ word, thenCount: cThen, nowCount: cNow, score });
      }
    }
    for (const [word, cNow] of nowH.words) {
      if (cNow < minCount) continue;
      const cThen = thenH.words.get(word) || 0;
      const rThen = (cThen + 0.5) / (thenH.totalWords + 20);
      const rNow = (cNow + 0.5) / (nowH.totalWords + 20);
      if (rNow > rThen * 1.6 && cNow > cThen) {
        const score = (rNow / rThen) * Math.log2(1 + cNow);
        rising.push({ word, thenCount: cThen, nowCount: cNow, score });
      }
    }

    extinct.sort((a, b) => b.score - a.score || b.thenCount - a.thenCount || a.word.localeCompare(b.word));
    rising.sort((a, b) => b.score - a.score || b.nowCount - a.nowCount || a.word.localeCompare(b.word));

    // Sender share shifts (percentage points)
    const allSenders = new Set([...thenH.senderCounts.keys(), ...nowH.senderCounts.keys()]);
    const senderShifts = [];
    for (const sender of allSenders) {
      const pctThen = Math.round(((thenH.senderCounts.get(sender) || 0) / Math.max(1, thenH.count)) * 100);
      const pctNow = Math.round(((nowH.senderCounts.get(sender) || 0) / Math.max(1, nowH.count)) * 100);
      senderShifts.push({ sender, pctThen, pctNow, delta: pctNow - pctThen });
    }
    senderShifts.sort((a, b) => b.delta - a.delta || a.sender.localeCompare(b.sender));

    return {
      thenLabel: sameLabel ? 'First half' : thenLabel,
      nowLabel: sameLabel ? 'Second half' : nowLabel,
      thenAvgChars: thenH.avgChars,
      nowAvgChars: nowH.avgChars,
      thenMsgsPerDay: thenH.msgsPerDay,
      nowMsgsPerDay: nowH.msgsPerDay,
      extinct: extinct.slice(0, 5),
      rising: rising.slice(0, 5),
      senderShifts,
    };
  }

  return {
    tokenize,
    analyze,
    quizCandidates,
    madLibsCandidates,
    eraQuizCandidates,
    chatEras,
    BOOKS,
    bookReport,
    STOP_WORDS,
  };
});
