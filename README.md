# WhatsApp Message Counter

Drop a WhatsApp chat export onto the page and get the message count instantly — plus a per-sender breakdown and a "rhythm strip" where every message is one tick. No upload, no server: everything runs locally in your browser.

## Use it

Open `index.html` in any modern browser (double-click works, no build step), then:

- drag a `.txt` export onto the page, or click to browse, or
- open `index.html?sample` to try it with a bundled sample chat (`index.html?sample&words` lands with the word games already on).

### Getting the .txt from WhatsApp

- **Android:** open the chat → ⋮ → More → Export chat → **Without media**
- **iPhone:** tap the chat title → scroll down → Export Chat → **Without media**

"Without media" gives you a plain `.txt`. (A `.zip` from "Include media" isn't text — the app will tell you if you drop one.)

### Anonymizing and re-exporting

On the results screen:

- **Anonymize names** — flip the switch and every sender is shown as `Person A`, `Person B`, … (in order of who messaged first). Colors, counts and the strip are unchanged; flip it back to see real names again.
- **Export .txt** — downloads the chat as a `.txt` in its original WhatsApp line layout, so you can drop it back into this app (or share it) and get the same counts. If the anonymize switch is on, the export is anonymized too: sender fields become `Person A/B/…`, and names mentioned in system lines (`Alex changed the subject…`) and inside message text are replaced as well. Anonymized downloads are always named `anonymized-chat.txt` — real exports are often called `WhatsApp Chat with Alex.txt`, and that file name would leak the name.

Anonymization is best-effort: it replaces exact, whole-word, case-sensitive matches of each sender's name (so `Sam` is replaced but `Samantha` is left alone). Nicknames or misspelled mentions in free text are not caught — check the export before sharing it.

### Word games 🎲

Flip the **Word games** switch on the results screen for a separate, just-for-fun section (off by default):

- **chat stats** — total words, different (unique) words, diversity (unique ÷ total), words per message, and the favourite emoji;
- **diversity leaderboard** — every sender ranked by vocabulary size (🥇🥈🥉), each with their signature (most-used) word; follows the anonymize switch, so names become `Person A/B/…` there too;
- **most used words** — the chat's top 12 words as a mini cloud, sized by frequency;
- **the book bank** — the chat's unique-word count compared against rough unique-word counts of famous books (Green Eggs and Ham ≈ 50, The Cat in the Hat ≈ 230, The Hobbit ≈ 6,500, Harry Potter and the Philosopher's Stone ≈ 10,500, The Lord of the Rings ≈ 30,000): how much of each book's vocabulary the chat covers, and the biggest book this chat's word bank could have written.

Media placeholder messages (`<Media omitted>`, `(file attached)`, …) don't count as words, and pure numbers are ignored. The analysis runs once per file, locally in your browser, only when you flip the switch — a 100k-message export takes well under a second.

## What counts as a message

One line that starts with a timestamp and a sender, e.g.

```
12/05/2025, 18:42 - Alex: hi
[5/12/25, 6:43:02 PM] Sam: hello
[2025-05-12, 18:42:11] Priya: hey
```

Handled: Android and iOS layouts, `DD/MM/YY` / `M/D/YY` / `YYYY-MM-DD`, 12h and 24h clocks, optional brackets and seconds, multi-line messages (continuations don't add to the count), media placeholders (`<Media omitted>`, `(file attached)`), system notices (encryption messages, subject changes — counted separately, never as messages), and the invisible RTL/LTR marks WhatsApp adds.

## Files

- `index.html`, `styles.css`, `app.js` — the app (vanilla, no dependencies)
- `parser.js` — the export parser plus `senderMap()` / `toText()` for anonymized re-exports; also loadable in node for tests
- `words.js` — the word-games analysis (`tokenize()` / `analyze()` / `bookReport()`) behind the Word games switch; also loadable in node for tests
- `test/parser.test.js` — run with `node test/parser.test.js`
- `test/words.test.js` — run with `node test/words.test.js`
- `test/fixtures/` — sample exports used by the tests
- `test/preview-big.html` — dev preview that renders `fixtures/big_100k.txt`

## Privacy

The file is read with the browser's File API and never leaves your device — counting and exporting both happen locally. There is no network call except the Google Fonts stylesheet (the app works offline with system fonts).
