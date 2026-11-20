/* Node test for parser.js — run: node test/parser.test.js */
'use strict';
const fs = require('fs');
const path = require('path');
const { parse, senderMap, detectNames, toText, insights, parseTimestamps, findOnThisDay, chatArchetype } = require('../parser.js');

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
  check('third-party name Samantha detected and labeled', out.includes('tell Person C hi'), true);
  check('no Samantha left', /(?<![\p{L}\p{N}_])Samantha(?![\p{L}\p{N}_])/iu.test(out), false);
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

// case-insensitive mentions in free text + possessives + longer names win
{
  const r = parse([
    '12/05/2025, 18:43 - Alex: hey alex, meet ALEX at 8',
    '12/05/2025, 18:44 - Sam: sam is here, Samantha stays, Sam\'s car is fast',
    '12/05/2025, 18:45 - Alex: ok',
  ].join('\n'));
  const out = toText(r, { senderMap: senderMap(r) });
  check('no name left in any capitalization', /(?<![\p{L}\p{N}_])(alex|sam)(?![\p{L}\p{N}_])/iu.test(out), false);
  check('lowercase/uppercase mentions replaced', out.includes('12/05/2025, 18:43 - Person A: hey Person A, meet Person A at 8'), true);
  check('possessive replaced, third-party name labeled', out.includes('Person B is here, Person C stays, Person B\'s car is fast'), true);
}

// a longer name must win over its prefix when both are senders
{
  const r = parse([
    '12/05/2025, 18:43 - Sam: hi Samantha',
    '12/05/2025, 18:44 - Samantha: hi Sam',
  ].join('\n'));
  const out = toText(r, { senderMap: senderMap(r) });
  check('longest name matches first', out.includes('12/05/2025, 18:43 - Person A: hi Person B'), true);
  check('prefix name still replaced standalone', out.includes('12/05/2025, 18:44 - Person B: hi Person A'), true);
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

/* ---------- detecting third-party names inside the texts ---------- */

{
  const r = parse([
    '12/05/2025, 18:43 - Alex: hi Zara and Maria',
    '12/05/2025, 18:44 - Alex: maria waves back',
  ].join('\n'));
  const sm = senderMap(r);
  const detected = detectNames(r, { senderMap: sm });
  check('detectNames labels in first-appearance order', Array.from(detected.entries()),
    [['Zara', 'Person B'], ['Maria', 'Person C']]);
  const out = toText(r, { senderMap: sm });
  check('third-party names labeled in text', out.includes('Person A: hi Person B and Person C'), true);
  check('lowercase mention labeled too', out.includes('Person A: Person C waves back'), true);
  check('no Zara/Maria left', /(?<![\p{L}\p{N}_])(zara|maria)(?![\p{L}\p{N}_])/iu.test(out), false);
  // passing the precomputed map gives the same result
  check('toText accepts precomputed nameMap', toText(r, { senderMap: sm, nameMap: detected }), out);
}

// ambiguous names (also ordinary words): replaced only when capitalized
{
  const r = parse('12/05/2025, 18:43 - Alex: Will you come? will we go?\n');
  const out = toText(r, { senderMap: senderMap(r) });
  check('capitalized ambiguous name replaced', out.includes('Person B you come?'), true);
  check('lowercase ordinary word kept', out.includes('will we go?'), true);
}

// a sender whose name is also a word: still replaced in any case
{
  const r = parse('12/05/2025, 18:43 - Will: will you come? I will wait\n');
  const out = toText(r, { senderMap: senderMap(r) });
  check('sender name replaced in any case', out.includes(' - Person A: Person A you come? I Person A wait'), true);
}

// extra names + disabling the built-in list
{
  const r = parse('12/05/2025, 18:43 - Alex: tell Mum and dr. House hi\n');
  const sm = senderMap(r);
  const out = toText(r, { senderMap: sm, extraNames: ['Mum', 'Dr. House'], useNameList: false });
  check('extra names replaced in any case (incl. multi-word)', out.includes('tell Person B and Person C hi'), true);
  const out2 = toText(r, { senderMap: sm, useNameList: false });
  check('dictionary off when useNameList false', out2.includes('tell Mum and dr. House hi'), true);
}

// a name that is only a substring of a longer word is never touched
{
  const r = parse('12/05/2025, 18:43 - Alex: marinate the chicken, Maryam style\n');
  const out = toText(r, { senderMap: senderMap(r) });
  check('substring of a longer word kept', out.includes('marinate the chicken'), true);
  check('real mention replaced', out.includes('Person B style'), true);
}

/* ---------- insights (hours, peak day, streak, starter, novelist, laugher) ---------- */

{
  const r = parse([
    '12/05/2025, 22:05 - Alex: hey',
    '12/05/2025, 22:06 - Sam: hello there my friend how is your evening going today',
    '12/05/2025, 22:07 - Alex: haha 😂',
    '12/05/2025, 22:08 - Alex: wait',
    '12/05/2025, 22:09 - Alex: look',
    '13/05/2025, 09:00 - Sam: morning lol',
  ].join('\n'));
  const ins = insights(r);
  check('insights peak hour', ins.peakHour, { hour: 22, count: 5 });
  check('insights peak day', ins.peakDay, { dayKey: '2025-05-12', label: '12 May 2025', count: 5 });
  check('insights longest streak', ins.longestStreak, { sender: 'Alex', count: 3 });
  check('insights starter after >=6h gap', ins.starter, { sender: 'Sam', count: 1 });
  check('insights novelist', ins.novelist.sender, 'Sam');
  check('insights laugher tie breaks by first', ins.laugher, { sender: 'Alex', count: 1 });
  check('insights hours sum', ins.hours.reduce((a, b) => a + b, 0), 6);
}

// single-sender chat omits streak and starter
{
  const r = parse('12/05/2025, 10:00 - Alex: note 1\n12/05/2025, 20:00 - Alex: note 2\n');
  const ins = insights(r);
  check('single-sender streak null', ins.longestStreak, null);
  check('single-sender starter null', ins.starter, null);
  check('single-sender lastWord null', ins.lastWord, null);
  check('single-sender awards empty', ins.awards, []);
}

/* ---------- extended insights (reply speed, silence, last word, calendar, dossier badges) ---------- */

{
  const r = parse([
    '12/05/2025, 01:10 - Alex: ARE YOU AWAKE???',
    '12/05/2025, 01:11 - Sam: yes! check https://example.com',
    '12/05/2025, 01:12 - Alex: WAIT WHAT?!',
    '12/05/2025, 01:12 - Alex: omg',
    '12/05/2025, 01:13 - Alex: tell me more?',
    '12/05/2025, 01:25 - Sam: <Media omitted>',
    '15/05/2025, 06:30 - Sam: morning after three days',
    '15/05/2025, 06:32 - Alex: morning!',
    '15/05/2025, 07:00 - Sam: coffee?',
  ].join('\n'));
  const ins = insights(r);
  check('dayList chronological', ins.dayList.map((d) => d.dayKey), ['2025-05-12', '2025-05-15']);
  check('weekdays sum matches parsed timestamps', ins.weekdays.reduce((a, b) => a + b, 0), 9);
  check('longest silence breaker is Sam', ins.longestSilence.breaker, 'Sam');
  check('longest silence >= 3 days', ins.longestSilence.days >= 3, true);
  check('lastWord before 6h gap is Sam', ins.lastWord, { sender: 'Sam', count: 1 });
  check('fastest replier is Alex', ins.fastestReplier && ins.fastestReplier.sender, 'Alex');
  check('slowest replier is Sam', ins.slowestReplier && ins.slowestReplier.sender, 'Sam');
  check('alex questions & shouts tracked', [ins.senderStats.Alex.questions, ins.senderStats.Alex.shouts], [3, 2]);
  check('sam links & media tracked', [ins.senderStats.Sam.links, ins.senderStats.Sam.mediaCount], [1, 1]);
  check('alex nightMsgs & sam earlyMsgs', [ins.senderStats.Alex.nightMsgs, ins.senderStats.Sam.earlyMsgs], [4, 2]);
  check('streakRange matches longestStreak', ins.streakRange, { startIdx: 2, endIdx: 4 });
  check('awards populated', ins.awards.length >= 4, true);
}

/* ---------- comedian, chaosPeak, pingPong, groupLore, archetype, onThisDay ---------- */

{
  const r = parse([
    '12/05/2024, 18:42 - Alex created group "Trip plans"',
    '12/05/2024, 18:43 - Alex: I just dropped my sandwich on my laptop',
    '12/05/2024, 18:43 - Sam: HAHAHA NO WAY 😂',
    '12/05/2024, 18:44 - Priya: lmao classic Alex 💀',
    '12/05/2024, 18:44 - Alex: send help please',
    '12/05/2024, 18:45 - Sam: on my way with napkins',
    '12/05/2024, 18:46 - Alex: thank you legend',
    '12/05/2024, 18:46 - Sam changed the subject to "Sandwich Incident 2024"',
    '12/05/2024, 18:47 - Sam changed the subject to "Laptop Survivors"',
    '12/05/2025, 10:00 - Sam: happy sandwich anniversary!',
  ].join('\n'));
  const ins = insights(r);

  // Comedian: Alex triggered both Sam's and Priya's laughs
  check('comedian is Alex', ins.comedian && ins.comedian.sender, 'Alex');
  check('comedian count is 2', ins.comedian && ins.comedian.count, 2);
  check('comedian punchline points to sandwich msg', ins.comedian && ins.comedian.punchlineIdx, 0);
  check('comedian award added', ins.awards.some((a) => a.id === 'comedian' && a.sender === 'Alex'), true);

  // Chaos peak: 6 messages between 18:43 and 18:46
  check('chaosPeak count >= 6', ins.chaosPeak && ins.chaosPeak.count >= 6, true);
  check('chaosPeak startIdx', ins.chaosPeak && ins.chaosPeak.startIdx, 0);

  // Ping-pong: Alex <-> Sam has the most back-and-forths in 3-person group
  check('pingPong top pair is Alex & Sam', ins.pingPong.pairs[0] && [ins.pingPong.pairs[0].a, ins.pingPong.pairs[0].b], ['Alex', 'Sam']);
  check('pingPong Alex bestie is Sam', ins.senderStats.Alex.bestie && ins.senderStats.Alex.bestie.partner, 'Sam');

  // Group lore: 3 subject changes, Sam is top renamer (x2)
  check('groupLore count', ins.groupLore.changes.length, 3);
  check('groupLore first created', [ins.groupLore.changes[0].kind, ins.groupLore.changes[0].subject], ['created', 'Trip plans']);
  check('groupLore topRenamer', ins.groupLore.topRenamer, { actor: 'Sam', count: 2 });

  // Archetype is populated with reason, vitals, and catalog
  check('archetype has icon, title, reason & vitals', Boolean(ins.archetype && ins.archetype.icon && ins.archetype.title && ins.archetype.reason && ins.archetype.vitals.length === 6 && ins.archetype.all.length >= 10), true);

  // On This Day: ref date 12 May 2026 finds both 2025 and 2024
  const otd = findOnThisDay(r, new Date(2026, 4, 12));
  check('onThisDay total matches 2024 + 2025', otd.total, 7);
  check('onThisDay years desc', otd.years.map((y) => y.year), [2025, 2024]);
  const otd2025 = findOnThisDay(r, new Date(2025, 4, 12));
  check('onThisDay skips same year', otd2025.years.map((y) => y.year), [2024]);

  // parseTimestamps aligned with messages
  const ts = parseTimestamps(r.messages);
  check('parseTimestamps length', ts.length, r.messages.length);
  check('parseTimestamps year 2024 & 2025', [ts[0].year, ts[ts.length - 1].year], [2024, 2025]);
}

// chatArchetype solo diary check
{
  const r = parse('12/05/2025, 10:00 - Alex: note to self\n');
  const arch = chatArchetype(r, insights(r));
  check('solo chat archetype is diary', arch.title, 'Solo Brain-Dump Diary');
}

// iOS chat-name-prefixed system notices (encryption banner, contact banner, disappearing msgs, group subject changes)
{
  const raw = [
    '[16/11/2026, 21:00:21] ula 🥰: \u200EMessages and calls are end-to-end encrypted. Only people in this chat can read, listen to, or share them.',
    '[16/11/2026, 21:00:21] ula 🥰: \u200Eula 🥰 is a contact.',
    '[16/11/2026, 21:00:22] ula 🥰: You turned on disappearing messages. New messages will disappear from this chat 24 hours after they\'re sent.',
    '[16/11/2026, 21:00:22] Trip Chat: Alex created group "Trip Chat"',
    '[16/11/2026, 21:01:00] ula 🥰: heyyy!',
    '[16/11/2026, 21:01:15] Alex: hey!!',
    '[16/11/2026, 21:02:00] Trip Chat: Alex changed the subject to "Lisbon 2026"',
  ].join('\n');
  const r = parse(raw);
  check('iOS prefixed system notices skipped from messages', r.total, 2);
  check('iOS prefixed notices counted as systemNotes', r.systemNotes, 5);
  check('iOS Day 1 message is actual first text', r.messages[0].text, 'heyyy!');
  const ins = insights(r);
  check('iOS prefixed groupLore extracts clean actor & subjects', ins.groupLore.changes.map((c) => [c.actor, c.subject]), [
    ['Alex', 'Trip Chat'],
    ['Alex', 'Lisbon 2026'],
  ]);
  const rt = parse(toText(r));
  check('iOS prefixed notices round-trip cleanly', [rt.total, rt.systemNotes], [2, 5]);
}

if (failures) {
  console.error(`\n${failures} test(s) failed`);
  process.exit(1);
}
console.log('\nall tests passed');
