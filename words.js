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
        return {
          sender: s.sender,
          total: s.total,
          unique: s.counts.size,
          ratio: s.total ? s.counts.size / s.total : 0,
          top,
          signature: top.length ? top[0].word : null,
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

  return { tokenize, analyze, BOOKS, bookReport, STOP_WORDS };
});
