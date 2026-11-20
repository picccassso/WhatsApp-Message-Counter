/* Node test for words.js — run: node test/words.test.js */
'use strict';
const fs = require('fs');
const path = require('path');
const { parse, senderMap, detectNames, parseTimestamps } = require('../parser.js');
const { tokenize, analyze, quizCandidates, madLibsCandidates, eraQuizCandidates, chatEras, BOOKS, bookReport } = require('../words.js');

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

/* ---------- tokenize ---------- */

check('tokenize lowercases and strips punctuation', tokenize('Hello, HELLO! Well...'), ['hello', 'hello', 'well']);
check('contractions and hyphens stay one word', tokenize("don't stop well-known"), ["don't", 'stop', 'well-known']);
check('pure numbers are dropped', tokenize('train at 8, by 2025, platform 9'), ['train', 'at', 'by', 'platform']);
check('unicode letters work', tokenize('Naïve café Über'), ['naïve', 'café', 'über']);
check('emoji are not words', tokenize('lol 😂🔥 ok'), ['lol', 'ok']);
check('empty and punctuation-only', [tokenize(''), tokenize('... --- !!!')], [[], []]);

/* ---------- analyze ---------- */

const chat = [
  '12/05/2025, 18:43 - Alex: lol hi lol',
  '12/05/2025, 18:44 - Sam: hi',
  '12/05/2025, 18:45 - Alex: <Media omitted>',
  '12/05/2025, 18:46 - Sam: IMG-20250512-WA0004.jpg (file attached)',
  '12/05/2025, 18:47 - Alex: hi 😂',
].join('\n');
const w = analyze(parse(chat).messages);

check('total words (media skipped)', w.totalWords, 5); // lol hi lol + hi + hi
check('unique words', w.uniqueWords, 2); // lol, hi
check('messageCount excludes media', w.messageCount, 3);
check('mediaSkipped', w.mediaSkipped, 2);
check('ratio', w.ratio, 2 / 5);
check('top words sorted by count', w.top, [{ word: 'hi', count: 3 }, { word: 'lol', count: 2 }]);
check('top emoji', w.topEmoji, [{ emoji: '😂', count: 1 }]);
check('senders ranked by unique words', w.senders.map((s) => s.sender), ['Alex', 'Sam']);
const alex = w.senders.find((s) => s.sender === 'Alex');
check('alex total/unique', [alex.total, alex.unique], [4, 2]);
check('signature is most-used word', alex.signature, 'hi'); // hi ×2 beats lol ×2 alphabetically? hi count 2, lol count 2 -> tie -> 'hi' < 'lol'
check('per-sender top words', alex.top, [{ word: 'hi', count: 2 }, { word: 'lol', count: 2 }]);

// all-media chat -> empty analysis, no crashes
{
  const r = parse('12/05/2025, 18:43 - Alex: <Media omitted>\n12/05/2025, 18:44 - Sam: IMG-1.jpg (file attached)\n');
  const a = analyze(r.messages);
  check('all-media totalWords', a.totalWords, 0);
  check('all-media uniqueWords', a.uniqueWords, 0);
  check('all-media ratio', a.ratio, 0);
  check('all-media senders empty', a.senders, []);
  check('all-media mediaSkipped', a.mediaSkipped, 2);
}

/* ---------- bookReport ---------- */

check('BOOKS ascending by uniqueWords', BOOKS.map((b) => b.uniqueWords), [50, 230, 6500, 10500, 30000]);

{
  const r = bookReport(0);
  check('0 words: nothing writable', r.writable, null);
  check('0 words: all pct 0', r.books.map((b) => b.pct), [0, 0, 0, 0, 0]);
}
{
  const r = bookReport(49);
  check('49 words: still nothing writable', r.writable, null);
}
{
  const r = bookReport(50);
  check('50 words: Green Eggs and Ham writable', r.writable && r.writable.title, 'Green Eggs and Ham');
  check('covered book pct capped at 100', r.books[0].pct, 100);
  check('covered flag', r.books[0].covered, true);
  check('next book not covered', r.books[1].covered, false);
}
{
  const r = bookReport(230);
  check('230 words: Cat in the Hat writable', r.writable && r.writable.title, 'The Cat in the Hat');
}
{
  const r = bookReport(100000);
  check('100k words: LOTR writable', r.writable && r.writable.title, 'The Lord of the Rings');
  check('all covered', r.books.every((b) => b.covered), true);
}
{
  const r = bookReport(115); // halfway between 50 and 230
  check('pct is share of the book vocab', Math.round(r.books[1].pct), 50);
}

/* ---------- analyze with a sender map: names inside texts become labels ---------- */

{
  const r = parse([
    '12/05/2025, 18:43 - Alex: alex alex sam',
    '12/05/2025, 18:44 - Sam: sam sam hi alex',
    '12/05/2025, 18:45 - Alex: Samantha and sam',
  ].join('\n'));
  const w = analyze(r.messages, { senderMap: senderMap(r) });
  check('anonymized top words', w.top.map((t) => [t.word, t.count]),
    [['Person B', 4], ['Person A', 3], ['and', 1], ['hi', 1], ['samantha', 1]]);
  check('no raw name token survives', w.top.some((t) => /^(alex|sam)$/i.test(t.word)), false);
  check('totals unchanged by anonymization', [w.totalWords, w.messageCount], [10, 3]);
  check('unique words', w.uniqueWords, 5);
  const alex = w.senders.find((s) => s.sender === 'Alex');
  const sam = w.senders.find((s) => s.sender === 'Sam');
  check('signature is the label, not the name', [alex.signature, sam.signature], ['Person A', 'Person B']);
  check('per-sender top uses labels', sam.top[0], { word: 'Person B', count: 2 });
}

// one-letter sender names are not relabeled in word counts ("a" is a word)
{
  const r = parse('12/05/2025, 18:43 - A: a a ok\n');
  const w = analyze(r.messages, { senderMap: senderMap(r) });
  check('one-letter name kept as a word', w.top.map((t) => t.word), ['a', 'ok']);
}

// no opts -> identical to before
{
  const r = parse('12/05/2025, 18:43 - Alex: alex alex\n');
  check('no opts keeps raw tokens', analyze(r.messages).top, [{ word: 'alex', count: 2 }]);
  check('null opts keeps raw tokens', analyze(r.messages, null).top, [{ word: 'alex', count: 2 }]);
}

// detected third-party names (parser.detectNames) are labeled in the cloud too
{
  const r = parse([
    '12/05/2025, 18:43 - Alex: samantha says hi to samantha',
    '12/05/2025, 18:44 - Sam: hi alex',
  ].join('\n'));
  const sm = senderMap(r);
  const w = analyze(r.messages, { senderMap: sm, nameMap: detectNames(r, { senderMap: sm }) });
  check('detected name labeled in top words', w.top.find((t) => t.word === 'Person C'), { word: 'Person C', count: 2 });
  check('no raw detected name in top words', w.top.some((t) => /samantha/i.test(t.word)), false);
}

/* ---------- filterStopWords & per-sender favEmoji ---------- */

{
  const r = parse([
    '12/05/2025, 18:43 - Alex: the and to the coffee coffee 😂',
    '12/05/2025, 18:44 - Sam: i am the tea 🔥🔥',
  ].join('\n'));
  const filtered = analyze(r.messages, { filterStopWords: true });
  check('stop words skipped in top cloud', filtered.top.map((t) => t.word), ['coffee', 'tea']);
  check('totalWords/uniqueWords keep stop words for Book Bank accuracy', [filtered.totalWords, filtered.uniqueWords], [10, 7]);
  const alex = filtered.senders.find((s) => s.sender === 'Alex');
  const sam = filtered.senders.find((s) => s.sender === 'Sam');
  check('signature skips stop words', [alex.signature, sam.signature], ['coffee', 'tea']);
  check('per-sender favEmoji', [alex.favEmoji, sam.favEmoji], [{ emoji: '😂', count: 1 }, { emoji: '🔥', count: 2 }]);

  // fallback if a chat contains only stop words
  const allStop = analyze(parse('12/05/2025, 18:43 - Alex: the and to\n').messages, { filterStopWords: true });
  check('all-stop-word chat falls back cleanly', allStop.top.length, 3);
}

/* ---------- catchphrase (TF-IDF distinctiveness) & quizCandidates ---------- */

{
  const r = parse([
    '12/05/2025, 18:43 - Alex: espresso espresso espresso good yeah yeah',
    '12/05/2025, 18:44 - Sam: matcha matcha matcha good yeah yeah',
    '12/05/2025, 18:45 - Alex: seriously love espresso every morning',
    '12/05/2025, 18:46 - Sam: iced matcha beats everything honestly',
  ].join('\n'));
  const w = analyze(r.messages, { filterStopWords: true });
  const alex = w.senders.find((s) => s.sender === 'Alex');
  const sam = w.senders.find((s) => s.sender === 'Sam');
  check('alex catchphrase is distinctively espresso', alex.catchphrase && alex.catchphrase.word, 'espresso');
  check('sam catchphrase is distinctively matcha', sam.catchphrase && sam.catchphrase.word, 'matcha');
  check('catchphrase 100% share', [alex.catchphrase.share, sam.catchphrase.share], [100, 100]);

  const qc = quizCandidates(r.messages);
  check('quizCandidates returns both senders', new Set(qc.map((q) => q.sender)).size, 2);
  check('quizCandidates skips media', quizCandidates(parse('12/05/2025, 18:43 - Alex: <Media omitted>\n12/05/2025, 18:44 - Sam: <Media omitted>\n').messages), []);
}

/* ---------- madLibsCandidates, eraQuizCandidates, chatEras ---------- */

{
  const r = parse([
    '12/05/2024, 18:43 - Alex: espresso espresso morning espresso at the station',
    '12/05/2024, 18:44 - Sam: grabbing espresso and a fresh croissant before boarding',
    '13/05/2024, 09:10 - Alex: Lisbon sunshine and espresso every single morning',
    '13/05/2024, 09:12 - Sam: booking the rooftop terrace hotel tonight for sure',
    '14/05/2024, 10:00 - Alex: train tickets ready for the adventure ahead',
    '14/05/2024, 10:05 - Sam: suitcase barely closed but espresso kept me alive',
    '10/01/2025, 19:10 - Sam: craving spicy ramen bowls this freezing winter night',
    '10/01/2025, 19:12 - Alex: spicy ramen sounds legendary on Saturday evening',
    '11/01/2025, 12:00 - Sam: Tokyo ramen tour planning starts over noodles tonight',
    '11/01/2025, 12:05 - Sam: seriously cannot stop thinking about spicy ramen',
    '12/01/2025, 18:00 - Sam: ordering extra noodles and ramen broth right now',
    '12/01/2025, 18:05 - Alex: count me in for ramen every single weekend',
  ].join('\n'));
  const ts = parseTimestamps(r.messages);

  // Mad Libs
  const ml = madLibsCandidates(r.messages);
  check('madLibs produces items', ml.length >= 4, true);
  check('madLibs each item has 3 distractors', ml.every((x) => x.distractors.length === 3 && !x.distractors.includes(x.answer)), true);

  // Era quiz (2 years -> year mode)
  const eq = eraQuizCandidates(r.messages, ts);
  check('eraQuiz mode is year', eq.mode, 'year');
  check('eraQuiz choices are 2024 & 2025', eq.choices, ['2024', '2025']);
  check('eraQuiz has items from both years', new Set(eq.items.map((x) => x.answer)).size, 2);

  // Era quiz short chat -> act mode
  const shortR = parse([
    '12/05/2025, 18:43 - Alex: opening message about the trip',
    '12/05/2025, 18:44 - Sam: second message on the same day',
    '12/05/2025, 18:45 - Alex: middle message talking about dinner',
    '12/05/2025, 18:46 - Sam: another middle message with details',
    '12/05/2025, 18:47 - Alex: finale message wrapping things up',
    '12/05/2025, 18:48 - Sam: final message goodnight everyone',
  ].join('\n'));
  const shortEq = eraQuizCandidates(shortR.messages, parseTimestamps(shortR.messages));
  check('short chat eraQuiz falls back to act mode', shortEq.mode, 'act');
  check('act mode has 3 choices', shortEq.choices.length, 3);

  // Chat Eras (Then vs. Now)
  const eras = chatEras(r.messages, ts);
  check('chatEras detects extinct espresso', eras.extinct.some((x) => x.word === 'espresso'), true);
  check('chatEras detects rising ramen', eras.rising.some((x) => x.word === 'ramen'), true);
  check('chatEras Sam got chattier in Now', eras.senderShifts.find((s) => s.sender === 'Sam').delta > 0, true);
}

/* ---------- big fixture: runs fast and sane on 100k messages ---------- */

{
  const big = analyze(parse(load('big_100k.txt')).messages);
  check('big totalWords > 0', big.totalWords > 0, true);
  check('big uniqueWords in range', big.uniqueWords > 0 && big.uniqueWords < big.totalWords, true);
  check('big senders', big.senders.map((s) => s.sender).sort(), ['+40 712 345 678', 'Alex', 'Priya', 'Sam']);
  check('big mediaSkipped >= 1', big.mediaSkipped >= 1, true);
  check('big top sorted desc', big.top.every((t, i) => i === 0 || big.top[i - 1].count >= t.count), true);
  check('big top capped at 12', big.top.length <= 12, true);
  check('big per-sender top capped at 5', big.senders.every((s) => s.top.length <= 5), true);
}

// Deleted message stubs and <This message was edited> tags are excluded from vocabulary & quizzes
{
  const raw = [
    '12/05/2025, 10:00 - Alex: espresso morning <This message was edited>',
    '12/05/2025, 10:01 - Sam: This message was deleted',
    '12/05/2025, 10:02 - Alex: You deleted this message',
    '12/05/2025, 10:03 - Sam: matcha latte please',
  ].join('\n');
  const parsed = parse(raw);
  const res = analyze(parsed.messages);
  const words = res.top.map((t) => t.word);
  check('deleted stub words excluded from analyze', words.includes('deleted'), false);
  check('edited tag words excluded from analyze', words.includes('edited'), false);
  check('real words kept in analyze', words.includes('espresso') && words.includes('matcha'), true);
  check('messageCount excludes deleted stubs', res.messageCount, 2);
}

if (failures) {
  console.error(`\n${failures} test(s) failed`);
  process.exit(1);
}
console.log('\nall tests passed');
