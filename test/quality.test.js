/* Node test for quality.js — run: node test/quality.test.js */
'use strict';
const { parse, parseTimestamps } = require('../parser.js');
const Q = require('../quality.js');

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
function ok(name, cond, extra) {
  if (!cond) {
    failures++;
    console.error(`FAIL ${name}${extra ? ' — ' + extra : ''}`);
  } else {
    console.log(`ok   ${name}`);
  }
}

/* ---------- features / kindOf / score ---------- */

const f = (text, extra) => Q.features(Object.assign({ sender: 'A', text }, extra || {}), { prevBySender: new Map(), ms: null });

check('laugh-only detected', Q.kindOf(null, f('haha 😂')), 'reaction');
check('lol lol detected', Q.kindOf(null, f('lol lol')), 'reaction');
check('lmao detected', Q.kindOf(null, f('LMAOO')), 'reaction');
check('ordinary "he" is not a laugh', Q.kindOf(null, f('he said no')), 'substantive');
check('ack detected', Q.kindOf(null, f('ok')), 'ack');
check('ack with punctuation', Q.kindOf(null, f('Okay!')), 'ack');
check('thumbs up is an ack', Q.kindOf(null, f('👍')), 'ack');
check('emoji-only detected', Q.kindOf(null, f('😂😂🔥')), 'emoji');
check('media is media', Q.kindOf({ text: '<Media omitted>', media: true }, f('<Media omitted>', { media: true })), 'media');
check('deleted is deleted', Q.kindOf({ text: 'This message was deleted', deleted: true }, f('This message was deleted', { deleted: true })), 'deleted');
check('real message is substantive', Q.kindOf(null, f('are we still on for dinner tomorrow?')), 'substantive');

ok('laugh-only scores near zero', Q.score(f('haha 😂')) < 0.05, 'score=' + Q.score(f('haha 😂')));
ok('ack scores near zero', Q.score(f('ok')) < 0.05, 'score=' + Q.score(f('ok')));
ok('media scores exactly zero', Q.score(f('<Media omitted>', { media: true })) === 0);
ok('short greeting scores low but nonzero', Q.score(f('hi')) > 0.05 && Q.score(f('hi')) < 0.6, 'score=' + Q.score(f('hi')));
ok('long substantive message scores high', Q.score(f('hey, are we still on for dinner tomorrow? want to try that new ramen place around the corner')) > 0.8, 'score=' + Q.score(f('hey, are we still on for dinner tomorrow? want to try that new ramen place around the corner')));

/* ---------- analyze over a synthetic chat ---------- */

const chat = [
  '12/05/2025, 18:00 - Alex: hey, are we still on for dinner tomorrow?',
  '12/05/2025, 18:00 - Alex: like the ramen place on 5th?',
  '12/05/2025, 18:01 - Sam: haha',
  '12/05/2025, 18:01 - Sam: lol 😂',
  '12/05/2025, 18:01 - Sam: lol 😂',          // exact duplicate within window
  '12/05/2025, 18:02 - Sam: ok',
  '12/05/2025, 18:02 - Sam: <Media omitted>',
  '12/05/2025, 18:03 - Alex: yes! 7pm works, see you there then. really looking forward to it honestly',
  '12/05/2025, 18:04 - Sam: This message was deleted',
  '12/05/2025, 18:05 - Sam: 👍',
].join('\n');

const result = parse(chat);
const ms = parseTimestamps(result.messages).map((t) => (t && typeof t.ms === 'number' ? t.ms : null));
const a = Q.analyze(result.messages, { ms });

check('total counts every line', a.total, 10);
check('weights aligned with messages', a.weights.length, result.messages.length);
check('kinds aligned with messages', a.kinds.length, result.messages.length);
ok('adjusted < total when spam present', a.adjusted < a.total, `adjusted=${a.adjusted} total=${a.total}`);
check('media counted', a.counts.media, 1);
check('deleted counted', a.counts.deleted, 1);
check('reaction counted', a.counts.reaction, 2);
check('ack counted', a.counts.ack, 2); // "ok" + "👍"
check('duplicate counted', a.counts.duplicate, 1);
check('substantive counted', a.counts.substantive, 3);

const alex = a.senders.find((s) => s.sender === 'Alex');
const sam = a.senders.find((s) => s.sender === 'Sam');
check('Alex raw', alex.raw, 3);
check('Sam raw', sam.raw, 7);
ok('Alex adjusted close to raw (real messages)', alex.adjusted > alex.raw * 0.7, `adjusted=${alex.adjusted}`);
ok('Sam adjusted much lower than raw (spam)', sam.adjusted < sam.raw * 0.5, `adjusted=${sam.adjusted}`);
check('Sam reactions', sam.reactions, 2);
check('Sam dupes', sam.dupes, 1);
check('Sam media', sam.media, 1);
check('Sam deleted', sam.deleted, 1);
ok('sender list sorted by adjusted', a.senders[0].adjusted >= a.senders[a.senders.length - 1].adjusted);
ok('per-sender adjusted sums to chat adjusted (±0.2 rounding)',
  Math.abs(a.senders.reduce((s, x) => s + x.adjusted, 0) - a.adjusted) < 0.2,
  `sum=${a.senders.reduce((s, x) => s + x.adjusted, 0)} adjusted=${a.adjusted}`);

/* ---------- duplicate window: same text far apart is NOT a dupe ---------- */

const chat2 = [
  '12/05/2025, 10:00 - Alex: ok',
  '12/05/2025, 18:00 - Alex: ok',
].join('\n');
const r2 = parse(chat2);
const ms2 = parseTimestamps(r2.messages).map((t) => t.ms);
const a2 = Q.analyze(r2.messages, { ms: ms2 });
check('same text hours apart: no duplicate', a2.counts.duplicate, 0);
check('both are acks', a2.counts.ack, 2);

/* ---------- rapid-fire burst flag ---------- */

const chat3 = [
  '12/05/2025, 10:00:00 - Alex: first message here',
  '12/05/2025, 10:00:02 - Alex: second message two seconds later',
].join('\n');
const r3 = parse(chat3);
const a3 = Q.analyze(r3.messages, { ms: parseTimestamps(r3.messages).map((t) => t.ms) });
ok('second rapid message flagged burst', a3.kinds[1] === 'substantive' && a3.weights[1] < a3.weights[0],
  `w0=${a3.weights[0]} w1=${a3.weights[1]}`);

/* ---------- toCSV ---------- */

const csv = Q.toCSV(result.messages, { ms });
const csvLines = csv.trim().split('\n');
check('csv header + one row per message', csvLines.length, 11);
check('csv header starts with label,kind,weight', csvLines[0].split(',').slice(0, 3), ['label', 'kind', 'weight']);
ok('csv media row has empty label', csvLines.some((l) => l.startsWith(',media,')), csv);
ok('csv substantive row labelled 1', csvLines.some((l) => l.startsWith('1,substantive,')), csv);

/* ---------- works without timestamps (no crash, no dup detection) ---------- */

const a4 = Q.analyze(result.messages);
check('no-ms analyze still counts', a4.total, 10);
check('no-ms analyze: no duplicates detected', a4.counts.duplicate, 0);
ok('no-ms analyze: spam still discounted', a4.adjusted < a4.total, `adjusted=${a4.adjusted}`);

/* ---------- sigmoid ---------- */

check('sigmoid(0) = 0.5', Q.sigmoid(0), 0.5);
ok('sigmoid monotonic', Q.sigmoid(-10) < Q.sigmoid(0) && Q.sigmoid(0) < Q.sigmoid(10));

/* ---------- fixture smoke test ---------- */

const fs = require('fs');
const path = require('path');
const big = parse(fs.readFileSync(path.join(__dirname, 'fixtures', 'big_100k.txt'), 'utf8'));
const msBig = parseTimestamps(big.messages).map((t) => (t && typeof t.ms === 'number' ? t.ms : null));
const t0 = Date.now();
const aBig = Q.analyze(big.messages, { ms: msBig });
const dt = Date.now() - t0;
check('100k fixture total', aBig.total, big.total);
ok('100k fixture analyzed fast (<2s)', dt < 2000, dt + 'ms');
ok('100k fixture adjusted <= total', aBig.adjusted <= aBig.total, `adjusted=${aBig.adjusted} total=${aBig.total}`);
console.log(`     100k messages in ${dt}ms, adjusted=${aBig.adjusted} of ${aBig.total}, counts=${JSON.stringify(aBig.counts)}`);

console.log(failures ? `\n${failures} FAILURES` : '\nall quality tests passed');
process.exit(failures ? 1 : 0);
