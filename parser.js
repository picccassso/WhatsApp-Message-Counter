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
 * Works in the browser (window.WhatsAppParser) and in node (module.exports)
 * so the parsing logic can be unit-tested.
 */
(function (root, factory) {
  const api = factory();
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.WhatsAppParser = api;
})(typeof self !== 'undefined' ? self : globalThis, function () {
  'use strict';

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

    const messages = []; // { ts, sender, text, media }
    const notes = [];    // system lines (encryption notices, "X left", ...)
    let current = null;  // last entry, so continuation lines can attach to it

    for (const raw of lines) {
      if (!raw.trim()) continue;

      const m = MESSAGE_RE.exec(raw);
      if (m && m[2].indexOf('"') === -1) {
        // A sender name never contains a quote; system lines like
        // 'changed the subject to "a: b"' do — don't mistake them for messages.
        current = {
          ts: m[1].replace(/[[\]]/g, '').trim(),
          sender: m[2].trim(),
          text: m[3],
          media: MEDIA_RE.test(m[3]),
        };
        messages.push(current);
        continue;
      }

      const s = TIMESTAMPED_RE.exec(raw);
      if (s) {
        current = { text: s[2] };
        notes.push(current);
        continue;
      }

      if (current) {
        current.text += '\n' + raw;
        if (current.sender !== undefined) current.media = MEDIA_RE.test(current.text);
      }
    }

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
    };
  }

  return { parse };
});
