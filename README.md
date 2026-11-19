# WhatsApp Message Counter

Drop a WhatsApp chat export onto the page and get the message count instantly — plus a per-sender breakdown and a "rhythm strip" where every message is one tick. No upload, no server: everything runs locally in your browser.

## Use it

Open `index.html` in any modern browser (double-click works, no build step), then:

- drag a `.txt` export onto the page, or click to browse, or
- open `index.html?sample` to try it with a bundled sample chat.

### Getting the .txt from WhatsApp

- **Android:** open the chat → ⋮ → More → Export chat → **Without media**
- **iPhone:** tap the chat title → scroll down → Export Chat → **Without media**

"Without media" gives you a plain `.txt`. (A `.zip` from "Include media" isn't text — the app will tell you if you drop one.)

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
- `parser.js` — the export parser, also loadable in node for tests
- `test/parser.test.js` — run with `node test/parser.test.js`
- `test/fixtures/` — sample exports used by the tests
- `test/preview-big.html` — dev preview that renders `fixtures/big_100k.txt`

## Privacy

The file is read with the browser's File API and never leaves your device. There is no network call except the Google Fonts stylesheet (the app works offline with system fonts).
