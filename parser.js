/*
 * parser.js — parse a WhatsApp "Export chat" .txt file into message stats.
 *
 * Formats handled (all plain UTF-8 text, one message per line):
 *   Android:   12/05/2025, 18:42 - Alex: hi
 *   Android:   12/05/25, 6:42 PM - Alex: hi            (US locale, 12h)
 *   iOS:       [12/05/2025, 18:42:11] Alex: hi          (brackets, seconds)
 *   iOS US:    [5/12/25, 6:42:11 PM] Alex: hi
 *   ISO:       [2025-05-12, 18:42:11] Alex: hi
 *   System:    12/05/2025, 18:42 - Messages and calls are end-to-end encrypted...
 *   Multi-line messages: continuation lines don't start with a timestamp and
 *   are appended to the previous message (they don't count as new messages).
 *   Invisible LTR/RTL marks (‎ etc.) and BOM are stripped first.
 *
 * Also exported: senderMap(result) (anonymized "Person A, B, …" labels),
 * detectNames(result, { extraNames }) (finds OTHER people's names mentioned
 * inside the texts — common first names/surnames from names.js plus any
 * hand-listed extraNames — and labels them "Person C", "Person D", … in order
 * of first appearance), and toText(result, { senderMap, ... }) which rebuilds
 * the export file line by line in its original style — handy for re-exporting,
 * optionally fully anonymized.
 *
 * Works in the browser (window.WhatsAppParser) and in node (module.exports)
 * so the parsing logic can be unit-tested. In node it require()s names.js;
 * in the browser index.html must load names.js first.
 */
(function (root, factory) {
  const names = (typeof module !== 'undefined' && module.exports)
    ? require('./names.js')
    : (root.WhatsAppNames || { FIRST_NAMES: [], SURNAMES: [], AMBIGUOUS: new Set() });
  const api = factory(names);
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.WhatsAppParser = api;
})(typeof self !== 'undefined' ? self : globalThis, function (NAMES) {
  'use strict';

  // Built-in name dictionary (names.js) + names that are also ordinary words.
  const DICT_NAMES = (NAMES.FIRST_NAMES || []).concat(NAMES.SURNAMES || []);
  const AMBIGUOUS = NAMES.AMBIGUOUS || new Set();

  // Invisible direction marks WhatsApp sprinkles into exports + BOM.
  const INVISIBLE_RE = /[\u200E\u200F\u202A-\u202E\u2066-\u2069\uFEFF]/g;

  // Timestamp prefix shared by message and system lines:
  //   optional "[", date (d/m/y or m/d/y or y-m-d, separators / . -),
  //   comma, time (h:mm[:ss] [AM/PM]), optional "]"
  const TS =
    '\\[?\\s*\\d{1,4}[/.-]\\d{1,2}[/.-]\\d{2,4},\\s*\\d{1,2}:\\d{2}(?::\\d{2})?\\s*(?:AM|PM|am|pm)?\\s*\\]?';

  // A real message line: <timestamp> [-] Sender: text
  const MESSAGE_RE = new RegExp('^(' + TS + ')\\s*-?\\s*([^:\\n]{1,80}?):\\s?([\\s\\S]*)$');

  // Any line that starts with a timestamp (message or system notice).
  const TIMESTAMPED_RE = new RegExp('^(' + TS + ')\\s*-?\\s*([\\s\\S]*)$');

  // Placeholders WhatsApp writes instead of media / attachments.
  const MEDIA_RE = /<media omitted>|\(file attached\)|\b(?:image|video|audio|sticker|document|location|contact card|gif|voice message) omitted\b/i;

  function parse(text) {
    const clean = String(text).replace(/^\uFEFF/, '').replace(INVISIBLE_RE, '');
    const lines = clean.split(/\r\n|\r|\n/);

    const entries = []; // every timestamped line, in file order: { kind: 'message'|'note', ts, bracketed, sender?, text, media? }
    let current = null; // last entry, so continuation lines can attach to it

    for (const raw of lines) {
      if (!raw.trim()) continue;

      const m = MESSAGE_RE.exec(raw);
      if (m && m[2].indexOf('"') === -1) {
        // A sender name never contains a quote; system lines like
        // 'changed the subject to "a: b"' do — don't mistake them for messages.
        current = {
          kind: 'message',
          ts: m[1].replace(/[[\]]/g, '').trim(),
          bracketed: m[1].charAt(0) === '[',
          sender: m[2].trim(),
          text: m[3],
          media: MEDIA_RE.test(m[3]),
        };
        entries.push(current);
        continue;
      }

      const s = TIMESTAMPED_RE.exec(raw);
      if (s) {
        current = {
          kind: 'note',
          ts: s[1].replace(/[[\]]/g, '').trim(),
          bracketed: s[1].charAt(0) === '[',
          text: s[2],
        };
        entries.push(current);
        continue;
      }

      if (current) {
        current.text += '\n' + raw;
        if (current.kind === 'message') current.media = MEDIA_RE.test(current.text);
      }
    }

    const messages = entries.filter((e) => e.kind === 'message');
    const notes = entries.filter((e) => e.kind === 'note');

    const bySender = new Map();
    let media = 0;
    let chars = 0;
    for (const msg of messages) {
      const entry = bySender.get(msg.sender) || { sender: msg.sender, count: 0, chars: 0 };
      entry.count += 1;
      entry.chars += msg.text.length;
      bySender.set(msg.sender, entry);
      if (msg.media) media += 1;
      chars += msg.text.length;
    }

    return {
      total: messages.length,
      systemNotes: notes.length,
      media,
      chars,
      first: messages.length ? messages[0].ts : null,
      last: messages.length ? messages[messages.length - 1].ts : null,
      senders: Array.from(bySender.values()).sort((a, b) => b.count - a.count),
      messages, // kept for the rhythm strip: [{ sender, text, ... }]
      entries,  // every timestamped line in file order — used by toText() to rebuild the export
    };
  }

  function escapeRegExp(s) {
    return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  // "Person A".."Person Z", then "Person AA", "Person AB", … (spreadsheet-style letters).
  function labelForIndex(i) {
    let s = '';
    for (i += 1; i > 0; i = Math.floor((i - 1) / 26)) {
      s = String.fromCharCode(65 + ((i - 1) % 26)) + s;
    }
    return 'Person ' + s;
  }

  // Map each real sender to an anonymized label, in order of first appearance in the chat.
  function senderMap(result) {
    const map = new Map();
    for (const m of result.messages) {
      if (!map.has(m.sender)) map.set(m.sender, labelForIndex(map.size));
    }
    return map;
  }

  // Find names of people OTHER than the senders that are mentioned inside the
  // chat texts, and label them "Person C", "Person D", … continuing after the
  // sender labels, in order of first appearance in the export.
  //
  // Candidates: the built-in dictionary (names.js: common first names and
  // surnames) plus opts.extraNames (hand-listed, e.g. ["Mum", "Dr. House"]).
  // A candidate only gets a label if it actually occurs in the text. Matching
  // rules for the later replacement pass:
  //   - sender names (in senderMap): any capitalization
  //   - dictionary/extra names NOT in AMBIGUOUS: any capitalization
  //   - dictionary/extra names in AMBIGUOUS (also ordinary words, e.g. "Will"):
  //     only when capitalized or ALL-CAPS, so "will you come?" stays intact
  // Pass useNameList: false to skip the built-in dictionary and only use
  // extraNames.
  function detectNames(result, opts) {
    opts = opts || {};
    const base = opts.senderMap || senderMap(result);
    const taken = new Set(Array.from(base.keys()).map((n) => n.toLowerCase()));

    // All word tokens in the export, as written and lowercased — a cheap
    // prefilter so the per-name regexes below only run for names that occur.
    const WORD_RE = /[\p{L}\p{N}_]+/gu;
    const words = new Set();
    const lowerWords = new Set();
    for (const e of result.entries) {
      for (const m of e.text.matchAll(WORD_RE)) {
        words.add(m[0]);
        lowerWords.add(m[0].toLowerCase());
      }
    }
    const full = result.entries.map((e) => e.text).join('\n');
    const fullLower = full.toLowerCase();

    const extras = (opts.extraNames || [])
      .map((s) => String(s).trim())
      .filter((s) => s.length >= 2);
    const list = (opts.useNameList === false ? [] : DICT_NAMES).concat(extras);

    const candidates = []; // canonical names that occur in the text
    for (const n of list) {
      const key = n.toLowerCase();
      if (taken.has(key)) continue; // already covered by a sender's label
      taken.add(key);
      if (AMBIGUOUS.has(n)) {
        if (words.has(n) || words.has(n.toUpperCase())) candidates.push(n);
      } else if (lowerWords.has(key)) {
        candidates.push(n);
      } else if (extras.includes(n)) {
        // multi-word extra names won't be single tokens — test the raw text
        const re = new RegExp('(?<![\\p{L}\\p{N}_])' + escapeRegExp(n) + '(?![\\p{L}\\p{N}_])', 'iu');
        if (re.test(full)) candidates.push(n);
      }
    }

    // Order candidates by first appearance in the export text.
    const withIdx = [];
    for (const n of candidates) {
      let idx = -1;
      if (AMBIGUOUS.has(n)) {
        const reCap = new RegExp('(?<![\\p{L}\\p{N}_])' + escapeRegExp(n) + '(?![\\p{L}\\p{N}_])', 'u');
        const reCaps = new RegExp('(?<![\\p{L}\\p{N}_])' + escapeRegExp(n.toUpperCase()) + '(?![\\p{L}\\p{N}_])', 'u');
        const a = reCap.exec(full);
        const b = reCaps.exec(full);
        const hits = [a && a.index, b && b.index].filter((i) => i >= 0);
        idx = hits.length ? Math.min(...hits) : -1;
      } else {
        const re = new RegExp('(?<![\\p{L}\\p{N}_])' + escapeRegExp(n) + '(?![\\p{L}\\p{N}_])', 'iu');
        const m = re.exec(fullLower);
        idx = m ? m.index : -1;
      }
      if (idx >= 0) withIdx.push({ n, idx });
    }
    withIdx.sort((a, b) => a.idx - b.idx || a.n.localeCompare(b.n));

    const detected = new Map();
    let i = base.size;
    for (const { n } of withIdx) detected.set(n, labelForIndex(i++));
    return detected;
  }

  // Replace whole-word mentions of names in free text with their labels.
  //   senderMap — Map<name, label> of the chat's senders: matched in ANY
  //               capitalization ("alex", "Alex", "ALEX" all count).
  //   detected  — Map<name, label> from detectNames(): matched in any
  //               capitalization, except AMBIGUOUS names (also ordinary words),
  //               which are only matched capitalized or ALL-CAPS.
  // Longest names first so "Samantha" wins over "Sam"; Unicode-aware
  // boundaries so "Sam" never matches inside "Samantha"; replacements can't
  // cascade because labels ("Person A") contain no names. One-letter names
  // are skipped — replacing a single letter would mangle prose (toText still
  // always replaces the sender field itself).
  function replaceNames(text, senderMap, detected) {
    const all = new Map();
    for (const [k, v] of senderMap) all.set(k, v);
    for (const [k, v] of detected) all.set(k, v);
    const labelByLower = new Map();
    for (const n of all.keys()) {
      const key = n.toLowerCase();
      if (!labelByLower.has(key)) labelByLower.set(key, all.get(n));
    }
    const anyCase = [];
    const capOnly = [];
    for (const n of all.keys()) {
      if (n.length < 2) continue;
      if (senderMap.has(n) || !AMBIGUOUS.has(n)) anyCase.push(n);
      else capOnly.push(n);
    }
    anyCase.sort((a, b) => b.length - a.length);
    capOnly.sort((a, b) => b.length - a.length);

    let t = text;
    if (anyCase.length) {
      const re = new RegExp(
        '(?<![\\p{L}\\p{N}_])(' + anyCase.map(escapeRegExp).join('|') + ')(?![\\p{L}\\p{N}_])',
        'giu'
      );
      t = t.replace(re, (whole) => labelByLower.get(whole.toLowerCase()));
    }
    if (capOnly.length) {
      const re = new RegExp(
        '(?<![\\p{L}\\p{N}_])(' + capOnly.map((n) => escapeRegExp(n) + '|' + escapeRegExp(n.toUpperCase())).join('|') + ')(?![\\p{L}\\p{N}_])',
        'gu'
      );
      t = t.replace(re, (whole) => labelByLower.get(whole.toLowerCase()));
    }
    return t;
  }

  // Rebuild the export file from a parse result, line by line, keeping each
  // line's original style (Android "ts - Sender: text" vs iOS "[ts] Sender: text").
  // Pass { senderMap } to anonymize: the sender field always becomes the label,
  // and names mentioned in message bodies and system lines are replaced too —
  // the senders' own names in any capitalization, plus other detected names
  // (pass { nameMap } to reuse a detectNames() result, or { extraNames } /
  // { useNameList } to control detection).
  function toText(result, opts) {
    opts = opts || {};
    const map = opts.senderMap || null;
    const detected = map ? (opts.nameMap || detectNames(result, opts)) : new Map();
    const lines = [];
    for (const e of result.entries) {
      const ts = e.bracketed ? '[' + e.ts + ']' : e.ts;
      if (e.kind === 'message') {
        const sender = map ? map.get(e.sender) || e.sender : e.sender;
        const text = map ? replaceNames(e.text, map, detected) : e.text;
        lines.push(e.bracketed ? ts + ' ' + sender + ': ' + text : ts + ' - ' + sender + ': ' + text);
      } else {
        const text = map ? replaceNames(e.text, map, detected) : e.text;
        lines.push(e.bracketed ? ts + ' ' + text : ts + ' - ' + text);
      }
    }
    return lines.length ? lines.join('\n') + '\n' : '';
  }

  return { parse, senderMap, detectNames, toText };
});
