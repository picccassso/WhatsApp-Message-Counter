/* Node test for parser.js — run: node test/parser.test.js */
'use strict';
const fs = require('fs');
const path = require('path');
const { parse } = require('../parser.js');

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

if (failures) {
  console.error(`\n${failures} test(s) failed`);
  process.exit(1);
}
console.log('\nall tests passed');
