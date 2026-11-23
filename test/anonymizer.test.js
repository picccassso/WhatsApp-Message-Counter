/*
 * test/anonymizer.test.js — Comprehensive tests for anonymizer.js
 * Run: node test/anonymizer.test.js
 */
'use strict';

const fs = require('fs');
const path = require('path');
const assert = require('assert');
const { parse } = require('../parser.js');
const Anon = require('../anonymizer.js');

let passed = 0;
function check(label, actual, expected) {
  try {
    assert.deepStrictEqual(actual, expected);
    passed++;
    console.log('ok  ', label);
  } catch (err) {
    console.error('FAIL', label);
    console.error('  actual:  ', actual);
    console.error('  expected:', expected);
    process.exitCode = 1;
  }
}

/* ---------- 1. Sender decomposition, nicknames, shared surnames, phone senders ---------- */
{
  const chat = [
    '12/05/2025, 18:42 - Messages and calls are end-to-end encrypted. No one outside of this chat, not even WhatsApp, can read or listen to them.',
    '12/05/2025, 18:43 - Alexander Smith 🍕: hey Chris, did you tell Alex about Saturday?',
    '12/05/2025, 18:44 - Christopher Jones: yep! Alexander Smith is all set, tell Al too',
    '12/05/2025, 18:45 - +44 7700 900123: calling +44 7700 900123 or @447700900123 later',
  ].join('\n');

  const r = parse(chat);
  const plan = Anon.createPlan(r);
  const out = Anon.exportText(r, plan);

  check('Alexander Smith sender anonymized to Person A', out.includes(' - Person A: '), true);
  check('Christopher Jones sender anonymized to Person B', out.includes(' - Person B: '), true);
  check('Phone sender anonymized to Person C', out.includes(' - Person C: '), true);
  check('Alex auto-linked to Alexander Smith (Person A)', out.includes('did you tell Person A about Saturday?'), true);
  check('Al auto-linked to Alexander Smith (Person A)', out.includes('tell Person A too'), true);
  check('Chris auto-linked to Christopher Jones (Person B)', out.includes('hey Person B,'), true);
  check('Full name Alexander Smith becomes single Person A', out.includes('yep! Person A is all set'), true);
  check('Phone sender mentions + @digits map to Person C', out.includes('calling Person C or Person C later'), true);
  check('No real sender parts left', /\b(Alexander|Smith|Christopher|Jones|Alex|Chris|7700)\b/i.test(out), false);

  // Round-trip re-parse must preserve exact counts & timestamps
  const r2 = parse(out);
  check('round-trip preserves message total', r2.total, r.total);
  check('round-trip preserves system notes', r2.systemNotes, r.systemNotes);
}

/* ---------- 2. Shared surname between two senders never leaks ---------- */
{
  const chat = [
    '12/05/2025, 18:43 - Alex Smith: hey Emma, tell the Smith family hi',
    '12/05/2025, 18:44 - Emma Smith: will do Alex!',
  ].join('\n');
  const r = parse(chat);
  const plan = Anon.createPlan(r);
  const out = Anon.exportText(r, plan);

  check('Alex maps to Person A', out.includes('will do Person A!'), true);
  check('Emma maps to Person B', out.includes('hey Person B,'), true);
  check('Shared surname Smith is still scrubbed', /\bSmith\b/i.test(out), false);
}

/* ---------- 3. Places, addresses, postcodes, coords, maps links, orgs, contacts, files, groups ---------- */
{
  const chat = [
    '12/05/2025, 18:40 - Priya created group "Shoreditch Flatmates 2025"',
    '12/05/2025, 18:41 - Priya: moved to 42 Oak Avenue, SW1A 1AA near Shoreditch in London!',
    '12/05/2025, 18:42 - Rohan: nice! check https://maps.app.goo.gl/abc123XYZ or 51.5074, -0.1278',
    '12/05/2025, 18:43 - Priya: I started working at Monzo and got an interview at Google',
    '12/05/2025, 18:44 - Rohan: email me at rohan.verma@company.co.uk or call 07700 900456, IG is @rohan_v',
    '12/05/2025, 18:45 - Priya: check https://linkedin.com/in/priya-patel and Priya_Resume.pdf (file attached)',
    '12/05/2025, 18:46 - Rohan: IMG-20250512-WA0004.jpg (file attached)',
    '12/05/2025, 18:47 - Priya: let us take a bath and start reading, nice deal!',
    '12/05/2025, 18:48 - Rohan: wait I am flying to Bath tomorrow after visiting St Thomas Hospital',
    '12/05/2025, 18:49 - Priya: <Media omitted>',
    '12/05/2025, 18:50 - Rohan: meet Dr. Vikram Patel and Sarah Jenkins at Heathrow Airport',
  ].join('\n');

  const r = parse(chat);
  const plan = Anon.createPlan(r);
  const out = Anon.exportText(r, plan);

  check('Group subject scrubbed', out.includes('Shoreditch Flatmates'), false);
  check('Group replaced with Group 1', out.includes('created group "Group 1"'), true);
  check('Street address scrubbed', out.includes('42 Oak Avenue'), false);
  check('UK postcode scrubbed', out.includes('SW1A 1AA'), false);
  check('Shoreditch & London scrubbed', /Shoreditch|London/i.test(out), false);
  check('Maps link tagged as Map Link', out.includes('[Map Link 1]'), true);
  check('GPS coords scrubbed', out.includes('51.5074'), false);
  check('Monzo & Google scrubbed as Orgs', /Monzo|Google/i.test(out), false);
  check('Email scrubbed', out.includes('rohan.verma@company.co.uk'), false);
  check('Phone scrubbed', out.includes('07700 900456'), false);
  check('Social handle scrubbed', out.includes('@rohan_v'), false);
  check('LinkedIn URL scrubbed', out.includes('linkedin.com'), false);
  check('PDF filename scrubbed', out.includes('Priya_Resume.pdf'), false);
  check('WA image filename scrubbed', out.includes('IMG-20250512-WA0004.jpg'), false);
  check('(file attached) preserved for parser fidelity', out.includes('(file attached)'), true);
  check('<Media omitted> preserved', out.includes('<Media omitted>'), true);
  check('Ambiguous lowercase prose preserved (bath, reading, nice, deal)', out.includes('take a bath and start reading, nice deal!'), true);
  check('Contextual Bath scrubbed as Place', out.includes('flying to Place'), true);
  check('St Thomas Hospital scrubbed', out.includes('St Thomas Hospital'), false);
  check('Dr. Vikram Patel merged as single Person', /Vikram|Patel/.test(out), false);
  check('Sarah Jenkins merged as single Person', /Sarah|Jenkins/.test(out), false);
  check('Heathrow Airport scrubbed', out.includes('Heathrow Airport'), false);

  // Leak audit should report clean / zero high leaks!
  const audit = Anon.auditLeaks(r, plan);
  check('Leak audit finds 0 high-severity leaks', audit.findings.filter((f) => f.severity === 'high').length, 0);

  // Re-parse check
  const r2 = parse(out);
  check('Complex anonymized chat re-parses to exact same message total', r2.total, r.total);
  check('Complex anonymized chat preserves media count', r2.media, r.media);
}

/* ---------- 4. Realistic Fake Stand-ins + Zero Cascading + Reroll ---------- */
{
  const chat = [
    '12/05/2025, 18:43 - Jordan: hey Alex, are you in Lisbon or Riverton?',
    '12/05/2025, 18:44 - Alex: in Lisbon working at Northstar, email alex@acme.io',
  ].join('\n');
  const r = parse(chat);
  const plan = Anon.createPlan(r, { mode: 'realistic', seed: 1 });
  const out = Anon.exportText(r, plan);

  check('Realistic mode scrubs Jordan (never reuses Jordan for Alex)', /\bJordan\b/.test(out), false);
  check('Realistic mode scrubs Alex', /\bAlex\b/.test(out), false);
  check('Realistic mode scrubs Lisbon', /\bLisbon\b/.test(out), false);
  check('Realistic mode scrubs Northstar', /\bNorthstar\b/.test(out), false);
  check('Realistic mode scrubs email to example.com', out.includes('@example.com'), true);
  check('Realistic mode does NOT use Person A', out.includes('Person A'), false);

  const labelBefore = Anon.getLabel(plan, plan.entities[0]);
  Anon.rerollFakeNames(plan);
  const labelAfter = Anon.getLabel(plan, plan.entities[0]);
  check('Reroll changes realistic fake name', labelBefore !== labelAfter, true);
}

/* ---------- 5. Entity management: Merge, Add Alias, Suspects Promotion, Diff ---------- */
{
  const chat = [
    '12/05/2025, 18:43 - Alex: met Zorgon at KwikMart yesterday',
    '12/05/2025, 18:44 - Sam: tell Snoopy hi from me',
  ].join('\n');
  const r = parse(chat);
  const plan = Anon.createPlan(r);

  const suspectTerms = plan.suspects.map((s) => s.term);
  check('Suspect scanner flags unknown mid-sentence Zorgon', suspectTerms.includes('Zorgon'), true);
  check('Suspect scanner flags unknown mid-sentence KwikMart', suspectTerms.includes('KwikMart'), true);
  check('Suspect scanner flags unknown mid-sentence Snoopy', suspectTerms.includes('Snoopy'), true);

  // Merge Snoopy into Alex (Person A) as a nickname!
  const alexEnt = plan.entities.find((e) => e.primary === 'Alex');
  Anon.promoteSuspect(plan, 'Snoopy', { mergeInto: alexEnt.id });
  Anon.promoteSuspect(plan, 'KwikMart', 'place');
  Anon.promoteSuspect(plan, 'Zorgon', 'person');

  const out = Anon.exportText(r, plan);
  check('Snoopy merged into Person A', out.includes('tell Person A hi from me'), true);
  check('KwikMart promoted to Place 1', out.includes('at Place 1 yesterday'), true);
  check('Zorgon promoted to Person C', out.includes('met Person C at Place 1'), true);

  // Diff segments work cleanly
  const diff = Anon.anonymizeStringWithDiff('met Zorgon at KwikMart yesterday', plan);
  check('Diff text matches anonymized text', diff.text, 'met Person C at Place 1 yesterday');
  check('Diff identifies 2 replaced segments', diff.segments.filter((s) => s.replaced).length, 2);
}

/* ---------- 6. Regression tests: scrub buttons, verifyTerm, pool overflow, iOS <attached:> ---------- */
{
  // 6a. Case-sensitive existing entities (bath, will, apple, uk) must be scrubbable on explicit addCustomEntity
  const chat = [
    '12/05/2025, 18:42 - Alex: I went to Bath yesterday and had a bath later, saw Will too, will call him',
    '12/05/2025, 18:43 - Sam: working at Apple and eating an apple in the uk (UK)',
    '12/05/2025, 18:44 - Alex: ask smiths and alex123 and bob_jones',
    '12/05/2025, 18:45 - Sam: <attached: 00001-Alex_Smith_Passport.pdf>',
  ].join('\n');
  const r = parse(chat);
  const plan = Anon.createPlan(r);

  // Before explicit scrub, lowercase ambiguous terms remain
  check('verifyTerm finds lowercase bath before explicit scrub', Anon.verifyTerm(r, plan, 'bath').wholeWordLines, 1);
  check('verifyTerm finds lowercase will before explicit scrub', Anon.verifyTerm(r, plan, 'will').wholeWordLines, 1);
  check('verifyTerm finds lowercase apple before explicit scrub', Anon.verifyTerm(r, plan, 'apple').wholeWordLines, 1);
  check('verifyTerm finds lowercase uk before explicit scrub', Anon.verifyTerm(r, plan, 'uk').wholeWordLines, 1);

  Anon.addCustomEntity(plan, 'bath', 'place', { retype: true });
  Anon.addCustomEntity(plan, 'will', 'person', { retype: true });
  Anon.addCustomEntity(plan, 'apple', 'org', { retype: true });
  Anon.addCustomEntity(plan, 'uk', 'place', { retype: true });

  check('explicit scrub clears caseSensitive on bath', Anon.verifyTerm(r, plan, 'bath').totalLines, 0);
  check('explicit scrub clears caseSensitive on will', Anon.verifyTerm(r, plan, 'will').totalLines, 0);
  check('explicit scrub clears caseSensitive on apple', Anon.verifyTerm(r, plan, 'apple').totalLines, 0);
  check('explicit scrub clears caseSensitive on uk', Anon.verifyTerm(r, plan, 'uk').totalLines, 0);

  // 6b. Disabled category gets retyped/re-enabled on explicit scrub
  const chat2 = '12/05/2025, 18:42 - Alex: I work at Monzo in Bristol\n';
  const r2 = parse(chat2);
  const plan2 = Anon.createPlan(r2);
  Anon.setCategoryEnabled(plan2, 'org', false);
  check('Monzo appears when org category is disabled', Anon.verifyTerm(r2, plan2, 'Monzo').wholeWordLines, 1);
  Anon.addCustomEntity(plan2, 'Monzo', 'person', { retype: true });
  check('Scrub as Person moves/activates Monzo even when org category was off', Anon.verifyTerm(r2, plan2, 'Monzo').totalLines, 0);

  // 6c. Substring detection & literal upgrade
  const subRes = Anon.verifyTerm(r, plan, 'bob');
  check('verifyTerm classifies bob_jones as substring hit', subRes.wholeWordLines === 0 && subRes.substringLines === 1, true);
  check('verifyTerm extracts containing token bob_jones', subRes.tokens.some((t) => t.text === 'bob_jones'), true);
  Anon.addCustomEntity(plan, 'bob', 'person', { kind: 'literal', retype: true });
  check('literal scrub removes substring bob inside bob_jones', Anon.verifyTerm(r, plan, 'bob').totalLines, 0);

  // 6d. iOS <attached: filename> is auto-scrubbed while keeping <attached: > marker
  const outIos = Anon.exportText(r, plan);
  check('iOS <attached: > marker preserved', outIos.includes('<attached: '), true);
  check('iOS attached filename Passport scrubbed', outIos.includes('Passport'), false);
  check('verifyTerm reports 0 leaks for Passport', Anon.verifyTerm(r, plan, 'Passport').totalLines, 0);

  // 6e. Pool exhaustion (>80 people, >40 orgs) never re-introduces real chat words & verifyTerm ignores generated labels
  const manyLines = [];
  for (let i = 0; i < 85; i++) {
    manyLines.push(`12/05/2025, 18:42 - Sender${i}: met Jordan and Taylor and Northstar and Al and Ed`);
  }
  const rMany = parse(manyLines.join('\n'));
  const planMany = Anon.createPlan(rMany, { mode: 'realistic', seed: 1 });
  for (let i = 0; i < 40; i++) Anon.addCustomEntity(planMany, 'ExtraOrg' + i, 'org');
  const labelsMany = planMany.entities.map((e) => Anon.getLabel(planMany, e).toLowerCase());
  check('Realistic pool overflow never reuses real name Jordan', labelsMany.some((l) => l.includes('jordan')), false);
  check('Realistic pool overflow never reuses real name Taylor', labelsMany.some((l) => l.includes('taylor')), false);
  check('Realistic pool overflow never reuses real org Northstar', labelsMany.some((l) => l.includes('northstar')), false);

  Anon.setMode(planMany, 'typed');
  Anon.addCustomEntity(planMany, 'Al', 'person', { retype: true });
  check('Typed mode Person AL label does not false-positive in verifyTerm for Al', Anon.verifyTerm(rMany, planMany, 'Al').totalLines, 0);
}

/* ---------- 7. Performance benchmark on big_100k.txt ---------- */
{
  const bigPath = path.join(__dirname, 'fixtures', 'big_100k.txt');
  if (fs.existsSync(bigPath)) {
    const bigRaw = fs.readFileSync(bigPath, 'utf8');
    const r = parse(bigRaw);
    const t0 = Date.now();
    const plan = Anon.createPlan(r);
    const t1 = Date.now();
    const out = Anon.exportText(r, plan);
    const t2 = Date.now();
    const audit = Anon.auditLeaks(r, plan);
    const t3 = Date.now();
    console.log(`perf big_100k (${r.total} msgs): plan=${t1 - t0}ms, export=${t2 - t1}ms, audit=${t3 - t2}ms, entities=${plan.entities.length}, score=${audit.score}`);
    check('big_100k plan+export completes under 4000ms', (t2 - t0) < 4000, true);
    check('big_100k export non-empty', out.length > 100000, true);
  }
}

console.log(`\n${passed} anonymizer checks passed`);
