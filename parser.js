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

  // System notices that iOS WhatsApp prefixes with "<Chat Name>: " (making them look like a real message).
  const SYSTEM_TEXT_RE = new RegExp(
    '^(?:' +
      'Messages(?: to this (?:chat|group))? and calls are (?:now secured with )?end-to-end encrypt(?:ed|ion)\\.' +
      '|Your security code with .+ changed\\.' +
      '|This (?:business uses a secure service from Meta|chat is with (?:a|the official) business account)\\b' +
      '|You (?:blocked|unblocked) this contact\\.' +
      '|(?:This sender|The sender|.+) is (?:a contact|not in your contacts)\\.' +
      '|(?:You|.+) (?:turned (?:on|off) disappearing messages|updated the message timer)\\b' +
      '|Disappearing messages were turned (?:on|off)\\b' +
      '|.+ changed (?:their|his|her) phone number to a new number\\b' +
      '|.+ (?:created group|changed the subject(?: from ["“][^"”]+["”])? to) ["“][^"”]+["”]\\.?$' +
      '|.+ (?:changed|deleted) (?:this group\'s icon|the group description)\\.?$' +
      '|.+ joined using (?:this group\'s|an) invite link\\.?$' +
      '|You\'re now an admin\\.?$' +
    ')',
    'i'
  );

  function isSystemNotice(sender, body) {
    const t = body.trim();
    if (!t) return false;
    if (t === sender + ' is a contact' || t === sender + ' is a contact.') return true;
    return SYSTEM_TEXT_RE.test(t);
  }

  function parse(text) {
    const clean = String(text).replace(/^\uFEFF/, '').replace(INVISIBLE_RE, '');
    const lines = clean.split(/\r\n|\r|\n/);

    const entries = []; // every timestamped line, in file order: { kind: 'message'|'note', ts, bracketed, sender?, text, media? }
    let current = null; // last entry, so continuation lines can attach to it

    for (const raw of lines) {
      if (!raw.trim()) continue;

      const m = MESSAGE_RE.exec(raw);
      if (m && m[2].indexOf('"') === -1 && !isSystemNotice(m[2].trim(), m[3])) {
        // A sender name never contains a quote; system lines like
        // 'changed the subject to "a: b"' do — don't mistake them for messages.
        // Also skip iOS-prefixed system notices ("<Chat Name>: Messages and calls are end-to-end encrypted...").
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

  // Fast date+time extraction for chat insights and the 24h activity strip.
  const TS_PARTS_RE = /^(\d{1,4})[/.-](\d{1,2})[/.-](\d{2,4}),\s*(\d{1,2}):(\d{2})(?::\d{2})?\s*(AM|PM|am|pm)?$/;
  const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const LAUGH_RE = /\b(?:ha(?:ha)+|he(?:he)+|lol+|lmao+|rofl)\b|[😂🤣💀]/iu;
  const URL_RE = /(?:https?:\/\/|www\.)\S+/i;
  const UPPER_RE = /\p{Lu}/gu;
  const LETTER_RE = /\p{L}/gu;

  function isShouting(text) {
    if (!text) return false;
    if (/!{3,}/.test(text)) return true;
    const uppers = text.match(UPPER_RE);
    if (!uppers || uppers.length < 4) return false;
    const letters = text.match(LETTER_RE);
    return Boolean(letters && letters.length >= 4 && uppers.length / letters.length >= 0.7);
  }

  function median(nums) {
    if (!nums || !nums.length) return null;
    const sorted = nums.slice().sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 ? sorted[mid] : Math.round((sorted[mid - 1] + sorted[mid]) / 2);
  }

  function formatDurationShort(ms) {
    if (ms == null) return '';
    if (ms < 60000) return '<1m';
    const mins = Math.round(ms / 60000);
    if (mins < 60) return mins + 'm';
    const hrs = ms / 3600000;
    if (hrs < 24) return (hrs < 10 ? hrs.toFixed(1).replace(/\.0$/, '') : Math.round(hrs)) + 'h';
    const days = Math.round(hrs / 24);
    return days + (days === 1 ? ' day' : ' days');
  }

  // Determine whether non-ISO numeric dates are DD/MM or MM/DD across the chat.
  function detectDateOrder(messages) {
    let sawFirstOver12 = false;
    let sawSecondOver12 = false;
    let sawAmPm = false;
    for (let i = 0; i < messages.length; i++) {
      const m = TS_PARTS_RE.exec(messages[i].ts);
      if (!m) continue;
      if (m[1].length === 4) continue; // YYYY-MM-DD
      const a = +m[1];
      const b = +m[2];
      if (a > 12) sawFirstOver12 = true;
      if (b > 12) sawSecondOver12 = true;
      if (m[6]) sawAmPm = true;
      if (sawFirstOver12 || sawSecondOver12) break;
    }
    if (sawFirstOver12 && !sawSecondOver12) return 'DMY';
    if (sawSecondOver12 && !sawFirstOver12) return 'MDY';
    return sawAmPm ? 'MDY' : 'DMY';
  }

  function parseTs(ts, order) {
    const m = TS_PARTS_RE.exec(ts);
    if (!m) return null;
    let year, month, day;
    if (m[1].length === 4) {
      year = +m[1];
      month = +m[2];
      day = +m[3];
    } else {
      year = +m[3];
      if (year < 100) year += 2000;
      if (order === 'MDY') {
        month = +m[1];
        day = +m[2];
      } else {
        day = +m[1];
        month = +m[2];
      }
    }
    if (month < 1 || month > 12 || day < 1 || day > 31) return null;
    let hour = +m[4];
    const min = +m[5];
    const ampm = m[6] ? m[6].toUpperCase() : null;
    if (ampm) {
      if (ampm === 'AM' && hour === 12) hour = 0;
      else if (ampm === 'PM' && hour < 12) hour += 12;
    }
    if (hour < 0 || hour > 23 || min < 0 || min > 59) return null;
    const ms = Date.UTC(year, month - 1, day, hour, min);
    const weekday = new Date(ms).getUTCDay();
    const dayKey = year + '-' + String(month).padStart(2, '0') + '-' + String(day).padStart(2, '0');
    const dayLabel = day + ' ' + MONTHS[month - 1] + ' ' + year;
    return { year, month, day, hour, ms, weekday, dayKey, dayLabel };
  }

  function parseTimestamps(messages) {
    const msgs = messages || [];
    const order = detectDateOrder(msgs);
    const out = new Array(msgs.length);
    for (let i = 0; i < msgs.length; i++) {
      out[i] = parseTs(msgs[i].ts, order);
    }
    return out;
  }

  // Extract group subject changes ("Alex changed the subject to ...") from system notes.
  const SUBJECT_CHANGED_RE = /^(.+?)\s+changed the subject(?: from ["“]([^"”]+)["”])? to ["“]([^"”]+)["”]\.?$/i;
  const GROUP_CREATED_RE = /^(.+?)\s+created group ["“]([^"”]+)["”]\.?$/i;

  function extractGroupLore(entries) {
    const changes = [];
    const counts = new Map();
    for (const e of entries || []) {
      if (e.kind !== 'note') continue;
      // Strip optional iOS "<Group Name>: " prefix on system notes
      let text = e.text.trim();
      const colonIdx = text.indexOf(': ');
      if (colonIdx > 0 && colonIdx < 80) {
        const after = text.slice(colonIdx + 2);
        if (SUBJECT_CHANGED_RE.test(after) || GROUP_CREATED_RE.test(after)) {
          text = after;
        }
      }
      let m = SUBJECT_CHANGED_RE.exec(text);
      if (m) {
        const actor = m[1].trim();
        const prevSubject = m[2] || null;
        const subject = m[3];
        changes.push({ ts: e.ts, actor, kind: 'renamed', subject, prevSubject, rawText: text });
        counts.set(actor, (counts.get(actor) || 0) + 1);
        continue;
      }
      m = GROUP_CREATED_RE.exec(text);
      if (m) {
        const actor = m[1].trim();
        const subject = m[2];
        changes.push({ ts: e.ts, actor, kind: 'created', subject, prevSubject: null, rawText: text });
        counts.set(actor, (counts.get(actor) || 0) + 1);
      }
    }
    let topRenamer = null;
    for (const [actor, count] of counts) {
      if (!topRenamer || count > topRenamer.count) topRenamer = { actor, count };
    }
    return { changes, topRenamer };
  }

  // Find messages sent on the same month & day in earlier years ("On this day").
  function findOnThisDay(result, refDate) {
    const dt = refDate instanceof Date ? refDate : new Date();
    const refYear = dt.getFullYear();
    const refMonth = dt.getMonth() + 1;
    const refDay = dt.getDate();
    const msgs = (result && result.messages) || [];
    const parsed = parseTimestamps(msgs);
    const byYear = new Map();
    for (let i = 0; i < msgs.length; i++) {
      const p = parsed[i];
      if (!p) continue;
      if (p.month === refMonth && p.day === refDay && p.year < refYear) {
        let entry = byYear.get(p.year);
        if (!entry) {
          entry = { year: p.year, count: 0, firstIdx: i, lastIdx: i, ts: msgs[i].ts };
          byYear.set(p.year, entry);
        }
        entry.count++;
        entry.lastIdx = i;
      }
    }
    const years = Array.from(byYear.values()).sort((a, b) => b.year - a.year);
    const total = years.reduce((sum, y) => sum + y.count, 0);
    return {
      month: refMonth,
      day: refDay,
      label: refDay + ' ' + MONTHS[refMonth - 1],
      total,
      years,
    };
  }

  // Stamp the whole chat with a cheeky personality archetype based on its stats,
  // complete with personalized "why you got this" receipts, 6 DNA vitals, runner-up matches,
  // and the full catalog of archetypes.
  function formatHourLabel(h) {
    if (h == null) return '—';
    if (h === 0) return '12 AM';
    if (h < 12) return h + ' AM';
    if (h === 12) return '12 PM';
    return (h - 12) + ' PM';
  }

  function chatArchetype(result, ins) {
    const total = (result && result.total) || 0;
    const senders = (result && result.senders) || [];
    const pct = (r) => Math.round(r * 100);

    const statsList = Object.values((ins && ins.senderStats) || {});
    const totalTs = (ins && ins.totalParsedTs) || 0;
    const nightTotal = statsList.reduce((s, x) => s + (x.nightMsgs || 0), 0);
    const earlyTotal = statsList.reduce((s, x) => s + (x.earlyMsgs || 0), 0);
    const laughTotal = statsList.reduce((s, x) => s + (x.laughs || 0), 0);
    const questionTotal = statsList.reduce((s, x) => s + (x.questions || 0), 0);
    const shoutTotal = statsList.reduce((s, x) => s + (x.shouts || 0), 0);
    const shareTotal = statsList.reduce((s, x) => s + (x.shares || 0), 0);
    const textTotal = Math.max(1, statsList.reduce((s, x) => s + (x.textCount || 0), 0));

    const topShare = total && senders.length ? senders[0].count / total : 1;
    const nightRate = totalTs ? nightTotal / totalTs : 0;
    const earlyRate = totalTs ? earlyTotal / totalTs : 0;
    const laughRate = laughTotal / textTotal;
    const questionRate = questionTotal / textTotal;
    const shoutRate = shoutTotal / textTotal;
    const shareRate = total ? shareTotal / total : 0;
    const avgChars = (ins && ins.avgChars) || 0;
    const avgBurst = statsList.length
      ? Math.round((statsList.reduce((s, x) => s + (x.avgBurst || 0), 0) / statsList.length) * 10) / 10
      : 1;
    const fastestMs = ins && ins.fastestReplier ? ins.fastestReplier.medianMs : null;
    const peakH = ins && ins.peakHour ? ins.peakHour.hour : null;
    const silenceDays = ins && ins.longestSilence ? ins.longestSilence.days : 0;
    const activeDays = (ins && ins.dayList && ins.dayList.length) || 1;
    const msgsPerActiveDay = Math.round((total / activeDays) * 10) / 10;

    const vitals = [
      {
        label: 'Reply speed',
        value: fastestMs !== null ? formatDurationShort(fastestMs) + ' fastest median' : '—',
        pct: fastestMs !== null ? Math.max(8, Math.min(100, Math.round(100 - Math.min(92, Math.log2(1 + fastestMs / 60000) * 18)))) : 0,
      },
      {
        label: 'Burstiness',
        value: avgBurst + ' msgs/turn',
        pct: Math.min(100, Math.round((avgBurst / 4) * 100)),
      },
      {
        label: 'After midnight',
        value: pct(nightRate) + '% (peak ' + formatHourLabel(peakH) + ')',
        pct: Math.min(100, Math.round(nightRate * 250)),
      },
      {
        label: 'Laugh density',
        value: pct(laughRate) + '% of texts',
        pct: Math.min(100, Math.round(laughRate * 350)),
      },
      {
        label: 'Media & links',
        value: pct(shareRate) + '% of msgs',
        pct: Math.min(100, Math.round(shareRate * 250)),
      },
      {
        label: 'Avg length',
        value: avgChars + ' chars/msg',
        pct: Math.min(100, Math.round((avgChars / 120) * 100)),
      },
    ];

    const rules = [
      {
        id: 'podcast',
        icon: '🎙️',
        title: 'One-Sided Podcast',
        tagline: 'One host, one very patient live audience.',
        criteria: 'One sender sends ≥72% of all messages',
        matched: senders.length >= 2 && topShare >= 0.72 && total >= 10,
        reason: () => `Top sender accounts for ${pct(topShare)}% of all ${total.toLocaleString()} messages (threshold ≥72%).`,
      },
      {
        id: 'nightOwls',
        icon: '🦉',
        title: '3 AM Oversharing Syndicate',
        tagline: 'Nothing good happens after midnight — except this chat.',
        criteria: '≥25% of messages after midnight, or peak hour between 11 PM and 3 AM',
        matched: senders.length >= 2 && (nightRate >= 0.25 || (peakH !== null && (peakH >= 23 || peakH <= 3))),
        reason: () => nightRate >= 0.25
          ? `${pct(nightRate)}% of your messages happen between midnight and 4 AM (peak hour: ${formatHourLabel(peakH)}).`
          : `Your chat’s peak hour is ${formatHourLabel(peakH)}, with ${pct(nightRate)}% of all texts sent after midnight.`,
      },
      {
        id: 'hotline',
        icon: '📢',
        title: 'All-Caps Emergency Hotline',
        tagline: 'Volume permanently stuck at 11.',
        criteria: '≥14% of text messages in ALL CAPS or triple-exclamation',
        matched: senders.length >= 2 && shoutRate >= 0.14 && shoutTotal >= 3,
        reason: () => `${pct(shoutRate)}% of text messages (${shoutTotal}) are ALL CAPS or triple-exclamation loud.`,
      },
      {
        id: 'memes',
        icon: '📎',
        title: 'Rapid-Fire Meme Pipeline',
        tagline: 'Half conversation, half curated internet archive.',
        criteria: '≥28% of messages are media or links',
        matched: senders.length >= 2 && shareRate >= 0.28 && shareTotal >= 4,
        reason: () => `${pct(shareRate)}% of the chat (${shareTotal} messages) is shared media or links.`,
      },
      {
        id: 'comedy',
        icon: '🎭',
        title: 'Unofficial Comedy Club',
        tagline: 'High laugh-to-message ratio. Unhinged in the best way.',
        criteria: '≥18% of text messages contain laughs (haha/lol/😂/💀)',
        matched: senders.length >= 2 && laughRate >= 0.18 && laughTotal >= 3,
        reason: () => `${pct(laughRate)}% of text messages (${laughTotal}) are laughs, haha’s, or 😂/💀 reactions.`,
      },
      {
        id: 'chaosEngine',
        icon: '⚡',
        title: 'Rapid-Fire Chaos Engine',
        tagline: 'Blink and you have 14 unread messages.',
        criteria: 'Fastest median reply ≤2m and avg ≥1.8 messages per turn',
        matched: senders.length >= 2 && fastestMs !== null && fastestMs <= 120000 && avgBurst >= 1.8,
        reason: () => `Fastest median reply is ${formatDurationShort(fastestMs)} (≤2m) and senders fire off an average of ${avgBurst} messages per turn (≥1.8×) at ${msgsPerActiveDay} msgs/active day.`,
      },
      {
        id: 'penPals',
        icon: '🪶',
        title: 'Victorian Pen Pals',
        tagline: 'Thoughtful essays delivered at a dignified pace.',
        criteria: 'Avg ≥85 chars/message and median reply ≥15m',
        matched: senders.length >= 2 && avgChars >= 85 && (fastestMs === null || fastestMs >= 15 * 60000),
        reason: () => `Messages average ${avgChars} characters each with a relaxed ${fastestMs !== null ? formatDurationShort(fastestMs) : 'unhurried'} reply pace.`,
      },
      {
        id: 'investigation',
        icon: '🕵️',
        title: '24/7 Investigation Bureau',
        tagline: 'So many questions, not nearly enough answers.',
        criteria: '≥26% of text messages contain a question mark',
        matched: senders.length >= 2 && questionRate >= 0.26 && questionTotal >= 4,
        reason: () => `${pct(questionRate)}% of text messages (${questionTotal}) ask a question.`,
      },
      {
        id: 'sunrise',
        icon: '☕',
        title: 'Sunrise Coffee Club',
        tagline: 'Awake and texting before the rest of the world.',
        criteria: '≥25% of messages sent between 5 AM and 8 AM',
        matched: senders.length >= 2 && earlyRate >= 0.25 && earlyTotal >= 3,
        reason: () => `${pct(earlyRate)}% of messages (${earlyTotal}) are sent between 5 AM and 8 AM.`,
      },
      {
        id: 'comet',
        icon: '☄️',
        title: "Halley's Comet Check-Ins",
        tagline: 'Rare appearances, always worth the wait.',
        criteria: 'Longest silence ≥14 days and fewer than 8 msgs/active day',
        matched: senders.length >= 2 && silenceDays >= 14 && msgsPerActiveDay < 8,
        reason: () => `Longest gap was ${silenceDays} days with a breezy ${msgsPerActiveDay} messages per active day.`,
      },
      {
        id: 'council',
        icon: '🎪',
        title: 'Group Chat Council',
        tagline: 'Zero consensus, maximum entertainment.',
        criteria: '3+ active participants with balanced chaos',
        matched: senders.length >= 3,
        reason: () => `${senders.length} participants trading ${msgsPerActiveDay} messages per active day (top voice holds ${pct(topShare)}%).`,
      },
      {
        id: 'pingPong',
        icon: '🏓',
        title: 'Telepathic Ping-Pong Duo',
        tagline: 'Balanced back-and-forth with razor-sharp replies.',
        criteria: '2-person chat with ≤58% top share and ≤5m median reply',
        matched: senders.length === 2 && topShare <= 0.58 && fastestMs !== null && fastestMs <= 5 * 60000,
        reason: () => `Near-even ${pct(topShare)}% / ${100 - pct(topShare)}% split with a ${formatDurationShort(fastestMs)} median reply speed.`,
      },
      {
        id: 'banter',
        icon: '💬',
        title: 'Classic Banter Vault',
        tagline: 'Steady rhythm, solid lore, zero dull moments.',
        criteria: 'Well-rounded chat with no single extreme skew',
        matched: senders.length >= 2,
        reason: () => `${msgsPerActiveDay} messages per active day, averaging ${avgChars} chars/msg with a ${pct(topShare)}% top-sender share.`,
      },
    ];

    const catalog = rules.map((r) => ({
      id: r.id,
      icon: r.icon,
      title: r.title,
      tagline: r.tagline,
      criteria: r.criteria,
      matched: r.matched,
    }));

    if (!total) {
      return {
        id: 'empty',
        icon: '💬',
        title: 'Empty Room',
        tagline: 'No messages yet.',
        reason: 'Drop a WhatsApp chat export to diagnose its personality.',
        criteria: '0 messages',
        vitals,
        runnersUp: [],
        all: catalog,
      };
    }

    if (senders.length === 1) {
      return {
        id: 'diary',
        icon: '📓',
        title: 'Solo Brain-Dump Diary',
        tagline: 'Just you, your notes, and zero interruptions.',
        reason: `100% of all ${total.toLocaleString()} messages come from a single sender.`,
        criteria: 'Single-sender chat',
        vitals,
        runnersUp: [],
        all: catalog,
      };
    }

    const matched = rules.filter((r) => r.matched);
    const winner = matched[0] || rules[rules.length - 1];
    const runnersUp = matched
      .slice(1)
      .filter((r) => r.id !== 'banter')
      .slice(0, 3)
      .map((r) => ({ id: r.id, icon: r.icon, title: r.title, tagline: r.tagline, reason: r.reason() }));

    return {
      id: winner.id,
      icon: winner.icon,
      title: winner.title,
      tagline: winner.tagline,
      criteria: winner.criteria,
      reason: winner.reason(),
      vitals,
      runnersUp,
      all: catalog,
    };
  }

  // Compute fun chat insights in a single pass over result.messages:
  // 24h activity, daily calendar, weekdays, peak hour, busiest day, longest monologue streak,
  // conversation starter / last word (6h silence), reply speeds, longest silence broken,
  // novelist, laugher, per-sender dossier stats, and chat superlative awards.
  function insights(result) {
    const msgs = result.messages || [];
    const order = detectDateOrder(msgs);
    const hours = new Array(24).fill(0);
    const weekdays = new Array(7).fill(0);
    const hourSenders = Array.from({ length: 24 }, () => new Map());
    const days = new Map();
    const starters = new Map();
    const lastWords = new Map();
    const laughs = new Map();
    const textStats = new Map(); // sender -> { count, chars }
    const replyGaps = new Map(); // sender -> number[] (ms)
    const pairCounts = new Map(); // "a\0b" -> { a, b, count }
    const partnerMaps = new Map(); // sender -> Map<other, count>
    const perSender = new Map();
    const tsRecords = []; // { idx, ms, ts, sender } for sliding chaos peak

    const getS = (name) => {
      let s = perSender.get(name);
      if (!s) {
        s = {
          sender: name,
          count: 0,
          textCount: 0,
          chars: 0,
          mediaCount: 0,
          starts: 0,
          lastWords: 0,
          laughs: 0,
          laughsTriggered: 0,
          bestPunchlineIdx: null,
          bestPunchlineScore: -1,
          questions: 0,
          shouts: 0,
          links: 0,
          nightMsgs: 0,
          earlyMsgs: 0,
          totalTs: 0,
          bursts: 0,
          maxBurst: 0,
        };
        perSender.set(name, s);
      }
      return s;
    };

    const recordPair = (a, b) => {
      if (!a || !b || a === b) return;
      const key = a < b ? a + '\0' + b : b + '\0' + a;
      let pair = pairCounts.get(key);
      if (!pair) {
        pair = a < b ? { a, b, count: 0 } : { a: b, b: a, count: 0 };
        pairCounts.set(key, pair);
      }
      pair.count++;
      let ma = partnerMaps.get(a);
      if (!ma) { ma = new Map(); partnerMaps.set(a, ma); }
      ma.set(b, (ma.get(b) || 0) + 1);
      let mb = partnerMaps.get(b);
      if (!mb) { mb = new Map(); partnerMaps.set(b, mb); }
      mb.set(a, (mb.get(a) || 0) + 1);
    };

    let totalParsedTs = 0;
    let prevMs = null;
    let prevSender = null;
    let prevIdx = -1;
    let lastMsgSender = null;
    let streakSender = null;
    let streakCount = 0;
    let streakStart = 0;
    let longestStreak = null;
    let streakRange = null;
    let longestSilence = null;
    let textChars = 0;
    let textMessages = 0;
    let totalExchanges = 0;
    const recentMsgs = []; // last 3 parsed entries: { idx, sender, ms, text, media }

    const GAP_MS = 6 * 3600 * 1000;
    const PAIR_GAP_MS = 2 * 3600 * 1000;
    const LAUGH_TRIGGER_MS = 10 * 60 * 1000;

    for (let i = 0; i < msgs.length; i++) {
      const m = msgs[i];
      const st = getS(m.sender);
      st.count++;

      const p = parseTs(m.ts, order);

      if (!m.media) {
        textMessages++;
        textChars += m.text.length;
        st.textCount++;
        st.chars += m.text.length;
        let ts = textStats.get(m.sender);
        if (!ts) { ts = { count: 0, chars: 0 }; textStats.set(m.sender, ts); }
        ts.count++;
        ts.chars += m.text.length;

        if (LAUGH_RE.test(m.text)) {
          laughs.set(m.sender, (laughs.get(m.sender) || 0) + 1);
          st.laughs++;
          // Credit the most recent different sender's non-laugh setup message within the last 3 messages (10m window).
          for (let r = recentMsgs.length - 1; r >= 0; r--) {
            const prev = recentMsgs[r];
            if (prev.sender === m.sender) continue;
            if (!prev.media && LAUGH_RE.test(prev.text)) continue;
            if (p && prev.ms !== null && (p.ms - prev.ms > LAUGH_TRIGGER_MS || p.ms < prev.ms)) continue;
            const comic = getS(prev.sender);
            comic.laughsTriggered++;
            const txtLen = prev.media ? 0 : prev.text.trim().length;
            const quality = prev.media
              ? 1
              : (txtLen >= 14 && txtLen <= 160 ? 3 : 2);
            if (quality > comic.bestPunchlineScore || (quality === comic.bestPunchlineScore && comic.bestPunchlineIdx === null)) {
              comic.bestPunchlineScore = quality;
              comic.bestPunchlineIdx = prev.idx;
            }
            break;
          }
        }
        if (m.text.indexOf('?') !== -1) st.questions++;
        if (isShouting(m.text)) st.shouts++;
        if (URL_RE.test(m.text)) st.links++;
      } else {
        st.mediaCount++;
      }

      if (m.sender === streakSender) {
        streakCount++;
      } else {
        streakSender = m.sender;
        streakCount = 1;
        streakStart = i;
        st.bursts++;
      }
      if (streakCount > st.maxBurst) st.maxBurst = streakCount;
      if (!longestStreak || streakCount > longestStreak.count) {
        longestStreak = { sender: streakSender, count: streakCount };
        streakRange = { startIdx: streakStart, endIdx: i };
      }

      if (p) {
        totalParsedTs++;
        hours[p.hour]++;
        weekdays[p.weekday]++;
        const hs = hourSenders[p.hour];
        hs.set(m.sender, (hs.get(m.sender) || 0) + 1);
        tsRecords.push({ idx: i, ms: p.ms, ts: m.ts, sender: m.sender });

        st.totalTs++;
        if (p.hour >= 0 && p.hour <= 4) st.nightMsgs++;
        if (p.hour >= 5 && p.hour <= 8) st.earlyMsgs++;

        let d = days.get(p.dayKey);
        if (!d) {
          d = {
            dayKey: p.dayKey,
            label: p.dayLabel,
            count: 0,
            weekday: p.weekday,
            firstIdx: i,
            lastIdx: i,
            senders: new Map(),
          };
          days.set(p.dayKey, d);
        }
        d.count++;
        d.lastIdx = i;
        d.senders.set(m.sender, (d.senders.get(m.sender) || 0) + 1);

        if (prevMs !== null) {
          const gap = p.ms - prevMs;
          if (gap >= GAP_MS) {
            starters.set(m.sender, (starters.get(m.sender) || 0) + 1);
            st.starts++;
            if (prevSender) {
              lastWords.set(prevSender, (lastWords.get(prevSender) || 0) + 1);
              getS(prevSender).lastWords++;
            }
          } else if (gap >= 0 && prevSender && m.sender !== prevSender) {
            let rg = replyGaps.get(m.sender);
            if (!rg) { rg = []; replyGaps.set(m.sender, rg); }
            rg.push(gap);
            if (gap <= PAIR_GAP_MS) {
              recordPair(prevSender, m.sender);
              totalExchanges++;
            }
          }
          if (gap >= 3600000 && (!longestSilence || gap > longestSilence.ms)) {
            longestSilence = {
              ms: gap,
              days: Math.round((gap / 86400000) * 10) / 10,
              hours: Math.round((gap / 3600000) * 10) / 10,
              breaker: m.sender,
              prevSender: prevSender,
              startIdx: prevIdx,
              endIdx: i,
              fromTs: msgs[prevIdx].ts,
              toTs: m.ts,
            };
          }
        }
        prevMs = p.ms;
        prevSender = m.sender;
        prevIdx = i;
      } else if (lastMsgSender && lastMsgSender !== m.sender) {
        recordPair(lastMsgSender, m.sender);
        totalExchanges++;
      }

      lastMsgSender = m.sender;
      recentMsgs.push({ idx: i, sender: m.sender, ms: p ? p.ms : null, text: m.text, media: m.media });
      if (recentMsgs.length > 3) recentMsgs.shift();
    }

    // Sliding 5-minute chaos peak (wildest burst of messages in <= 5 minutes)
    let chaosPeak = null;
    if (tsRecords.length >= 4) {
      const WINDOW_MS = 5 * 60 * 1000;
      let left = 0;
      let bestCount = 0;
      let bestL = 0;
      let bestR = 0;
      for (let right = 0; right < tsRecords.length; right++) {
        // Guard against out-of-order timestamps in weird exports
        if (right > 0 && tsRecords[right].ms < tsRecords[right - 1].ms) {
          left = right;
        }
        while (left < right && tsRecords[right].ms - tsRecords[left].ms > WINDOW_MS) {
          left++;
        }
        const count = right - left + 1;
        if (count > bestCount) {
          bestCount = count;
          bestL = left;
          bestR = right;
        }
      }
      if (bestCount >= 4) {
        const spanMs = Math.max(60000, tsRecords[bestR].ms - tsRecords[bestL].ms);
        const durationMin = Math.max(1, Math.round(spanMs / 60000));
        const involved = new Set();
        for (let k = bestL; k <= bestR; k++) involved.add(tsRecords[k].sender);
        chaosPeak = {
          count: bestCount,
          startIdx: tsRecords[bestL].idx,
          endIdx: tsRecords[bestR].idx,
          startTs: tsRecords[bestL].ts,
          endTs: tsRecords[bestR].ts,
          durationMin,
          msgsPerMin: Math.round((bestCount / Math.min(5, durationMin)) * 10) / 10,
          senderCount: involved.size,
        };
      }
    }

    let peakHour = null;
    if (totalParsedTs > 0) {
      let bestH = 0;
      for (let h = 1; h < 24; h++) {
        if (hours[h] > hours[bestH]) bestH = h;
      }
      peakHour = { hour: bestH, count: hours[bestH] };
    }

    let peakDay = null;
    let peakDayRange = null;
    const dayList = [];
    for (const d of days.values()) {
      let topSender = null;
      let topCount = 0;
      for (const [s, c] of d.senders) {
        if (c > topCount) { topCount = c; topSender = s; }
      }
      dayList.push({
        dayKey: d.dayKey,
        label: d.label,
        count: d.count,
        weekday: d.weekday,
        firstIdx: d.firstIdx,
        lastIdx: d.lastIdx,
        topSender,
        senders: d.senders,
      });
      if (!peakDay || d.count > peakDay.count) {
        peakDay = { dayKey: d.dayKey, label: d.label, count: d.count };
        peakDayRange = { firstIdx: d.firstIdx, lastIdx: d.lastIdx };
      }
    }
    dayList.sort((a, b) => a.dayKey.localeCompare(b.dayKey));

    const multiSender = (result.senders || []).length >= 2;

    let starter = null;
    let lastWord = null;
    if (multiSender) {
      for (const [sender, count] of starters) {
        if (!starter || count > starter.count) starter = { sender, count };
      }
      for (const [sender, count] of lastWords) {
        if (!lastWord || count > lastWord.count) lastWord = { sender, count };
      }
    }

    let novelist = null;
    for (const [sender, st] of textStats) {
      if (st.count < 2 && msgs.length > 4) continue;
      const avg = Math.round(st.chars / st.count);
      if (!novelist || avg > novelist.avgChars) novelist = { sender, avgChars: avg };
    }

    let laugher = null;
    for (const [sender, count] of laughs) {
      if (!laugher || count > laugher.count) laugher = { sender, count };
    }

    // Finalize per-sender dossier stats
    const senderStats = {};
    let fastestReplier = null;
    let slowestReplier = null;
    let machineGun = null;
    let nightOwl = null;
    let earlyBird = null;
    let interrogator = null;
    let shouter = null;
    let dealer = null;
    let comedian = null;

    // Build Ping-Pong reply pair matrix (especially revealing in 3+ sender group chats)
    const pairs = Array.from(pairCounts.values())
      .sort((x, y) => y.count - x.count || x.a.localeCompare(y.a) || x.b.localeCompare(y.b))
      .map((p) => ({
        a: p.a,
        b: p.b,
        count: p.count,
        pct: totalExchanges ? Math.round((p.count / totalExchanges) * 100) : 0,
      }));
    const pingPongBySender = {};
    for (const [sender, pMap] of partnerMaps) {
      let bestPartner = null;
      let bestCount = 0;
      let sum = 0;
      for (const [other, c] of pMap) {
        sum += c;
        if (c > bestCount) { bestCount = c; bestPartner = other; }
      }
      if (bestPartner) {
        pingPongBySender[sender] = {
          partner: bestPartner,
          count: bestCount,
          pct: sum ? Math.round((bestCount / sum) * 100) : 0,
        };
      }
    }
    const pingPong = {
      pairs: pairs.slice(0, 6),
      totalExchanges,
      bySender: pingPongBySender,
    };

    for (const s of perSender.values()) {
      const rg = replyGaps.get(s.sender) || [];
      const med = rg.length ? median(rg) : null;
      const avgChars = s.textCount ? Math.round(s.chars / s.textCount) : 0;
      const avgBurst = s.bursts ? Math.round((s.count / s.bursts) * 10) / 10 : 0;
      const nightPct = s.totalTs ? Math.round((s.nightMsgs / s.totalTs) * 100) : 0;
      const earlyPct = s.totalTs ? Math.round((s.earlyMsgs / s.totalTs) * 100) : 0;
      const shares = s.mediaCount + s.links;

      const entry = {
        sender: s.sender,
        count: s.count,
        textCount: s.textCount,
        chars: s.chars,
        avgChars,
        mediaCount: s.mediaCount,
        starts: s.starts,
        lastWords: s.lastWords,
        laughs: s.laughs,
        laughsTriggered: s.laughsTriggered,
        bestPunchlineIdx: s.bestPunchlineIdx,
        questions: s.questions,
        shouts: s.shouts,
        links: s.links,
        shares,
        nightMsgs: s.nightMsgs,
        earlyMsgs: s.earlyMsgs,
        nightPct,
        earlyPct,
        bursts: s.bursts,
        avgBurst,
        maxBurst: s.maxBurst,
        medianReplyMs: med,
        replyCount: rg.length,
        bestie: pingPongBySender[s.sender] || null,
        badges: [],
      };
      senderStats[s.sender] = entry;

      if (multiSender) {
        if (med !== null && rg.length >= 2) {
          if (!fastestReplier || med < fastestReplier.medianMs) {
            fastestReplier = { sender: s.sender, medianMs: med };
          }
          if (!slowestReplier || med > slowestReplier.medianMs) {
            slowestReplier = { sender: s.sender, medianMs: med };
          }
        }
        if (s.laughsTriggered >= 1 && (!comedian || s.laughsTriggered > comedian.count)) {
          comedian = { sender: s.sender, count: s.laughsTriggered, punchlineIdx: s.bestPunchlineIdx };
        }
        if (avgBurst >= 1.4 && s.bursts >= 2 && (!machineGun || avgBurst > machineGun.avgBurst)) {
          machineGun = { sender: s.sender, avgBurst };
        }
        if (s.nightMsgs >= 2 && (!nightOwl || nightPct > nightOwl.pct || (nightPct === nightOwl.pct && s.nightMsgs > nightOwl.count))) {
          nightOwl = { sender: s.sender, pct: nightPct, count: s.nightMsgs };
        }
        if (s.earlyMsgs >= 2 && (!earlyBird || earlyPct > earlyBird.pct || (earlyPct === earlyBird.pct && s.earlyMsgs > earlyBird.count))) {
          earlyBird = { sender: s.sender, pct: earlyPct, count: s.earlyMsgs };
        }
        if (s.questions >= 2 && (!interrogator || s.questions > interrogator.count)) {
          interrogator = { sender: s.sender, count: s.questions };
        }
        if (s.shouts >= 2 && (!shouter || s.shouts > shouter.count)) {
          shouter = { sender: s.sender, count: s.shouts };
        }
        if (shares >= 2 && (!dealer || shares > dealer.count)) {
          dealer = { sender: s.sender, count: shares };
        }
      }
    }

    if (slowestReplier && fastestReplier && slowestReplier.sender === fastestReplier.sender) {
      slowestReplier = null;
    }

    // Build award badges and attach to each winning sender's dossier
    const awards = [];
    const addAward = (id, icon, title, sender, detail) => {
      if (!sender || !senderStats[sender]) return;
      const a = { id, icon, title, sender, detail };
      awards.push(a);
      senderStats[sender].badges.push({ id, icon, title, detail });
    };

    if (multiSender) {
      if (comedian) addAward('comedian', '🎭', 'Comedian', comedian.sender, '×' + comedian.count + ' laughs triggered');
      if (fastestReplier) addAward('fastest', '⚡', 'Fastest draw', fastestReplier.sender, formatDurationShort(fastestReplier.medianMs) + ' median');
      if (slowestReplier) addAward('slowest', '🐢', 'Left on read', slowestReplier.sender, formatDurationShort(slowestReplier.medianMs) + ' median');
      if (starter) addAward('starter', '🚀', 'Convo starter', starter.sender, '×' + starter.count);
      if (lastWord) addAward('lastWord', '🏁', 'Last word', lastWord.sender, '×' + lastWord.count);
      if (novelist) addAward('novelist', '✍️', 'Novelist', novelist.sender, novelist.avgChars + ' ch/msg');
      if (machineGun) addAward('machineGun', '💥', 'Machine-gun', machineGun.sender, machineGun.avgBurst + ' msgs/turn');
      if (nightOwl) addAward('nightOwl', '🌙', 'Night owl', nightOwl.sender, nightOwl.pct + '% after midnight');
      if (earlyBird) addAward('earlyBird', '☀️', 'Early bird', earlyBird.sender, earlyBird.pct + '% early AM');
      if (laugher) addAward('laugher', '😂', 'Laugh track', laugher.sender, '×' + laugher.count);
      if (interrogator) addAward('interrogator', '❓', 'Interrogator', interrogator.sender, interrogator.count + ' questions');
      if (shouter) addAward('shouter', '📢', 'ALL CAPS', shouter.sender, shouter.count + ' loud msgs');
      if (dealer) addAward('dealer', '📎', 'Link & media dealer', dealer.sender, dealer.count + ' shared');
    }

    const groupLore = extractGroupLore(result.entries);

    const out = {
      hours,
      weekdays,
      hourSenders,
      dayList,
      totalParsedTs,
      peakHour,
      peakDay,
      peakDayRange,
      chaosPeak,
      longestStreak: multiSender && longestStreak && longestStreak.count >= 2 ? longestStreak : null,
      streakRange: multiSender && longestStreak && longestStreak.count >= 2 ? streakRange : null,
      longestSilence,
      starter,
      lastWord,
      novelist,
      laugher,
      comedian,
      fastestReplier,
      slowestReplier,
      pingPong,
      groupLore,
      senderStats,
      awards,
      textChars,
      avgChars: textMessages ? Math.round(textChars / textMessages) : 0,
    };
    out.archetype = chatArchetype(result, out);
    return out;
  }

  return {
    parse,
    senderMap,
    detectNames,
    replaceNames,
    toText,
    insights,
    formatDurationShort,
    parseTimestamps,
    findOnThisDay,
    chatArchetype,
  };
});
