/* Node test for parser.js — run: node test/parser.test.js */
'use strict';
const fs = require('fs');
const path = require('path');
const { parse, senderMap, toText } = require('../parser.js');

let failures = 0;
function check(name, actual, expected) {
  const ok = JSON.stringify(actual) === JSON.stringify(expected);
  if (!ok) {
    failures++;
    console.error(`FAIL ${name}\n  expected: ${JSON.stringify(expected)}\n  actual:   ${JSON.stringify(actual)}`);
  } else {
    console.log(`ok   ${name}`);
  }
}

function load(f) {
  return fs.readFileSync(path.join(__dirname, 'fixtures', f), 'utf8');
}

// Android 24h, multiline, media, system lines with quoted colon
let r = parse(load('android_24h.txt'));
check('android total', r.total, 10);
check('android senders', r.senders.map(s => [s.sender, s.count]), [['Alex', 6], ['Sam', 4]]);
check('android media', r.media, 2);
check('android notes', r.systemNotes, 2);
check('android first', r.first, '12/05/2025, 18:43');
check('android last', r.last, '13/05/2025, 09:16');
check('multiline stays one message', r.messages[5].text.includes('and a third'), true);

// iOS US 12h with brackets + seconds
r = parse(load('ios_us_12h.txt'));
check('ios total', r.total, 4);
check('ios senders', r.senders.map(s => [s.sender, s.count]), [['Alex', 2], ['Sam', 2]]);
check('ios media', r.media, 1);
check('ios notes', r.systemNotes, 1);
check('ios first ts', r.first, '5/12/25, 6:43:02 PM');

// ISO dates
r = parse(load('iso.txt'));
check('iso total', r.total, 3);
check('iso media', r.media, 1);
check('iso first', r.first, '2025-05-12, 18:42:11');

// BOM + invisible LTR marks + system line containing a quoted colon + continuation
r = parse(load('edge_invisible.txt'));
check('edge total', r.total, 4);
check('edge notes', r.systemNotes, 1);
check('edge continuation attached', r.messages[1].text, 'second\ncontinuation without timestamp');
check('edge senders', r.senders.map(s => [s.sender, s.count]), [['Alex', 3], ['Sam', 1]]);

// garbage / empty input
r = parse('hello world\nthis is not a whatsapp export\n');
check('garbage total', r.total, 0);
check('garbage first', r.first, null);
r = parse('');
check('empty total', r.total, 0);

/* ---------- re-export (toText) round-trips ---------- */

function roundTrip(f) {
  const a = parse(load(f));
  const b = parse(toText(a));
  check(f + ' round-trip total', b.total, a.total);
  check(f + ' round-trip notes', b.systemNotes, a.systemNotes);
  check(f + ' round-trip media', b.media, a.media);
  check(f + ' round-trip first/last', [b.first, b.last], [a.first, a.last]);
  check(f + ' round-trip senders', b.senders.map(s => [s.sender, s.count, s.chars]),
    a.senders.map(s => [s.sender, s.count, s.chars]));
  check(f + ' round-trip messages', b.messages.map(m => [m.ts, m.sender, m.text, m.media]),
    a.messages.map(m => [m.ts, m.sender, m.text, m.media]));
  check(f + ' round-trip note lines', b.entries.filter(e => e.kind === 'note').map(e => [e.ts, e.text]),
    a.entries.filter(e => e.kind === 'note').map(e => [e.ts, e.text]));
}
['android_24h.txt', 'ios_us_12h.txt', 'iso.txt', 'edge_invisible.txt', 'anon.txt'].forEach(roundTrip);

// big fixture: round-trip the stats (comparing 100k message texts would be slow)
{
  const a = parse(load('big_100k.txt'));
  const b = parse(toText(a));
  check('big round-trip total', b.total, a.total);
  check('big round-trip senders', b.senders.map(s => [s.sender, s.count]), a.senders.map(s => [s.sender, s.count]));
  check('big round-trip first/last', [b.first, b.last], [a.first, a.last]);
  check('big round-trip notes', b.systemNotes, a.systemNotes);
}

/* ---------- anonymization (senderMap + toText) ---------- */

{
  const r = parse(load('anon.txt'));
  check('anon fixture total', r.total, 4);
  check('anon fixture notes', r.systemNotes, 2); // encryption notice + subject change

  const map = senderMap(r);
  check('map is first-appearance order', Array.from(map.entries()),
    [['Alex', 'Person A'], ['Sam', 'Person B']]);

  const out = toText(r, { senderMap: map });
  check('export has labels', out.includes('Person A') && out.includes('Person B'), true);
  check('no whole-word Alex left', /(?<![\p{L}\p{N}_])Alex(?![\p{L}\p{N}_])/u.test(out), false);
  check('no whole-word Sam left', /(?<![\p{L}\p{N}_])Sam(?![\p{L}\p{N}_])/u.test(out), false);
  check('Samantha preserved (no substring match)', out.includes('tell Samantha hi'), true);
  check('sender field anonymized', out.includes('12/05/2025, 18:43 - Person A: hi Person B, how are you?'), true);
  check('system line anonymized', out.includes('Person A changed the subject to "Person A & Person B trip"'), true);
  check('multiline body anonymized', out.includes('second line mentioning Person B'), true);

  const r2 = parse(out);
  check('anonymized export re-parses to same total', r2.total, r.total);
  check('anonymized export senders are labels', r2.senders.map(s => s.sender).sort(), ['Person A', 'Person B']);

  const plain = toText(r);
  check('plain export keeps names', plain.includes(' - Alex: ') && plain.includes(' - Sam: '), true);
  check('plain export keeps system line verbatim', plain.includes('Alex changed the subject to "Alex & Sam trip"'), true);
}

// label sequence: A..Z then AA
{
  let text = '';
  for (let i = 0; i < 27; i++) text += '12/05/2025, 18:' + String(i).padStart(2, '0') + ' - S' + i + ': hi\n';
  const map = senderMap(parse(text));
  check('26th label is Person Z', map.get('S25'), 'Person Z');
  check('27th label is Person AA', map.get('S26'), 'Person AA');
}

// one-letter senders: field replaced, free text left alone
{
  const r = parse('12/05/2025, 18:43 - A: grade A is great\n12/05/2025, 18:44 - B: ok\n');
  const out = toText(r, { senderMap: senderMap(r) });
  check('1-char sender field replaced', out.includes(' - Person A: grade A is great'), true);
}

if (failures) {
  console.error(`\n${failures} test(s) failed`);
  process.exit(1);
}
console.log('\nall tests passed');
