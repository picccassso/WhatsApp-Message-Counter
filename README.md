# WhatsApp Message Counter

Drop a WhatsApp chat export onto the page to count its messages, see a per-sender breakdown, and explore a rhythm strip where every message is a tick. Everything runs locally in your browser.

## Use it

Open `index.html` in any modern browser (double-click works directly). Then:

- drag a `.txt` or `.zip` export onto the page, click to browse, or paste (`⌘V` / `Ctrl+V`) an export straight from your clipboard, or
- open `index.html?sample` to try it with a bundled sample chat (`index.html?sample&words` opens with the word games turned on).

### Getting the export from WhatsApp

- **Android:** open the chat → ⋮ → More → Export chat → **Without media** (gives a `.txt` file)
- **iPhone:** tap the chat title → scroll down → Export Chat → **Without media** (gives a `.zip` containing `_chat.txt`)

Both `.txt` and `.zip` files (even *Include media* archives) can be dropped directly onto the page — the `.txt` inside a `.zip` is unpacked right in your browser.

### Anonymizing and re-exporting

On the results screen:

- **Anonymize names:** flip the switch to replace every sender with `Person A`, `Person B`, and so on (in order of who messaged first). Colors, counts, and the strip stay the same, and you can flip it back anytime.
- **Export anonymized .txt:** downloads the chat in its original WhatsApp line layout so you can re-open or share it with the same counts. Sender fields become `Person A/B/...`, and names inside message bodies are scrubbed too. Anonymized exports always save as `anonymized-chat.txt` so the original filename (often `WhatsApp Chat with Alex.txt`) stays private.

Which names get scrubbed from message bodies and system lines (`Alex changed the subject...`):

- **The senders' own names**, in any capitalization (`alex`, `Alex`, `ALEX` all match), whole-word only so `Sam` stays untouched inside `Samantha`.
- **Other people's names mentioned in texts:** a built-in list of ~650 common first names and surnames (`names.js`) is detected automatically and labeled `Person C`, `Person D`, etc. in order of first appearance. Names that are also ordinary English words (`Will`, `Grace`, `Cook`, ...) are only replaced when capitalized, leaving sentences like `will you come?` or `the cook is here` intact.
- **Anything the list misses:** type extra names into the "also hide..." box next to the switch (comma-separated; multi-word names like `Dr. House` work too).

Anonymization is best-effort for whole-word matches of known names. Nicknames, typos, or names outside the list can slip through, so skim the exported `.txt` before sharing it.

Word games, Moment Peek, Wrapped, and PNG cards all follow the anonymize switch.

### 🧹 Spam-adjusted counts & 🧪 ML Lab (on-device NLP + active learning)

The raw counter counts every parsed line. Flip **🧹 Spam-adjusted** to run the full client-side data-cleaning and ML pipeline in `quality.js`:

1. **Corpus-level NLP (IDF):** computes chat-specific Inverse Document Frequency across the export so words spammed repeatedly in *this* chat automatically carry low information weight, regardless of language or inside-joke slang.
2. **18-feature extraction & cleaning rules:** measures length, vocabulary diversity, mean IDF novelty, multi-language/slang laugh share (`haha`, `lol`, `lmao`, `lmfao`, `jajaja`, `kkkk`, `mdr`, `wkwk`, `im dead`, 😂🤣💀😭), low-effort acknowledgements, emoji-only messages, character-repetition/keysmash spam, consecutive rapid-fire burst streaks, and stretched near-duplicates across a 2-minute / 3-message window, while zeroing out media placeholders and deleted stubs.
3. **Logistic scoring & live UI integration:** scores every message with `p = sigmoid(b + Σ wᵢ·xᵢ)` using one of three built-in profiles (**Balanced**, **Strict anti-spam**, **Laughs & dupes only**) or your own trained model. Sender rows show **signal %**, **▲/▼ rank-flip badges**, and a dual raw-vs-substantive bar; the timeline strip, Chat Race, Moment Peek, Wrapped, PNG cards, and WhatsApp summary export all follow the switch.
4. **🧪 ML Lab (train on your own chat):** click **🧪 ML Lab** to inspect per-sender stacked signal-vs-spam breakdowns, the score distribution histogram, an **Active Learning** trainer (label uncertain messages with `1` / `2` to fit an L2-regularized MAP logistic regression directly in your browser, with a live loss curve, validation accuracy/F1/ROC-AUC, and feature-weight chart), a live message sandbox with exact log-odds feature attribution, and one-click CSV / JSON weight exports. Everything stays 100% on your device.

### Interactive views, toys & Chat Wrapped ✨

- **Answer bubble lenses & Chat Archetype:** click the green message-count bubble to cycle through **messages**, **words**, **characters**, **typing time**, **paperback pages**, and **scroll distance**. Underneath, the chat gets stamped with a personality **Archetype** (e.g. *3 AM Oversharing Syndicate*, *Unofficial Comedy Club*, *One-Sided Podcast*, *Victorian Pen Pals*).
- **Rhythm strip & Word Tug-of-War:** scrub the Timeline, inspect the 24h clock, or switch to the GitHub-style **Calendar** heatmap. Type any word into **search a word…** — or tap a quick preset (`sorry`, `love`, `haha`, `wait`, `coffee`, `omg`) — to light up where it peaked and see the proportional **Word Tug-of-War** split across senders.
- **Moment Peek, Typing Replay, Day 1 & Out-of-Context Quote Cards:** click any tick on the timeline, any active day on the calendar, or **🎲 Memory** to pop open a WhatsApp bubble preview with **← Earlier**, **🕰️ Day 1**, **🎲 Random**, and **Later →** navigation. Hit **▶ Replay** to watch the exchange play back with animated `typing…` bubbles, or click one or multiple bubbles (or hit **Select all**) and click **📸 Quote card** to export the full untruncated message or multi-bubble exchange as a PNG receipt.
- **Clickable vibe chips:** jump straight to **⚡ Chaos peak** (wildest 5-minute burst), **🎭 Comedian** (who triggers the most laughs from others, peeking straight at their punchline), **🎂 On this day** (same-date memories from past years), peak hour, busiest day, longest streak, longest silence broken, or fastest replier.
- **Sender stats, Group Ping-Pong, Group Lore & Audio Chat Race:** click any sender row to expand their inline stats, catchphrase, laughs triggered, top reply buddy, and award badges (🎭 Comedian, ⚡ Fastest draw, 🐢 Left on read, 🚀 Convo starter, 🏁 Last word, 💥 Machine-gun, 🌙 Night owl, ❓ Interrogator, 📢 ALL CAPS, 📎 Link & media dealer). Group chats (3+ people) also reveal **🏓 Who talks to whom?** reply pairs and **📜 Group lore** (every group name change + top renamer). Flip **🔇/🔊 Sound** to hear a soft Web Audio pentatonic marimba synth during **▶ Play race** and timeline scrubbing.
- **Year / Timeframe switcher:** multi-year chats show an **All time / 2024 / 2025 / …** pill bar beside the date range so you can slice the entire view — counts, strip, vibes, archetype, Wrapped, word games, and share cards — down to a single year.
- **✨ Wrapped, Shareable Cards & WhatsApp Summary:** click **✨ Wrapped** (or the Archetype badge) for a 7-slide tappable recap including Archetype, Chaos Peak, Power Duo, Awards, Eras, and Lore & Time Capsule. Under **Save card ▾**, download a **16:9 Landscape card** PNG, a **9:16 Story card** PNG, or click **Copy WhatsApp summary** to paste a formatted breakdown straight back into the chat.

### Word games 🎲

Flip the **Word games** switch on the results screen to open the vocabulary section:

- **chat stats:** total words, unique words, vocabulary diversity (unique ÷ total), words per message, and top emojis.
- **3-mode party quiz:** switch between **Who said it?** (guess the sender), **Mad Libs** (fill in the blank from a real message using the chat's own vocabulary), and **Guess the Era** (guess the year, month, or act a message came from), all with streak tracking and one-click *Peek in context*.
- **diversity & catchphrases:** ranks every sender by vocabulary size (🥇🥈🥉), showing their most distinctive catchphrase (words they use far more than everyone else), diversity %, and favourite emoji.
- **most used words:** an interactive cloud of the chat's top 12 words (click any word to highlight it on the strip and open its Tug-of-War bar, with a checkbox to skip common glue words).
- **chat eras · then vs. now:** compares the first half vs. second half of the chat to surface **extinct words** (clickable), **rising slang** (clickable), pace & length shifts, and who got chattier over time.
- **the book bank:** compares the chat's unique-word count against rough unique-word counts of five famous books (Green Eggs and Ham ≈ 50, The Cat in the Hat ≈ 230, The Hobbit ≈ 6,500, Harry Potter and the Philosopher's Stone ≈ 10,500, The Lord of the Rings ≈ 30,000) and shows the biggest book your chat's vocabulary covers.

Media placeholders (`<Media omitted>`, `(file attached)`, ...), deleted message stubs (`This message was deleted`), `<This message was edited>` tags, and pure numbers are skipped when counting words. Analysis runs once per file in your browser when you flip the switch, taking well under a second even on a 100k-message export.

## What counts as a message

One line starting with a timestamp and a sender, for example:

```
12/05/2025, 18:42 - Alex: hi
[5/12/25, 6:43:02 PM] Sam: hello
[2025-05-12, 18:42:11] Priya: hey
```

Supported formats: Android and iOS layouts, `DD/MM/YY` / `M/D/YY` / `YYYY-MM-DD`, 12h (`AM`/`PM` and `a.m.`/`p.m.`) and 24h clocks, optional commas/brackets/seconds, multi-line messages (continuation lines attach to the previous message), `<This message was edited>` stripping, deleted message stubs, media placeholders, system notices (encryption messages and subject changes are tracked separately), and the invisible RTL/LTR marks WhatsApp adds.

## Files

- `index.html`, `styles.css`, `app.js`: the vanilla web app
- `names.js`: built-in list of common first names and surnames used when anonymizing message bodies
- `parser.js`: export parser, insights calculator, and anonymized re-exporter (`parse`, `senderMap`, `detectNames`, `replaceNames`, `toText`, `insights`), also loadable in Node for tests
- `words.js`: word-games analysis (`tokenize`, `analyze`, `quizCandidates`, `bookReport`), also loadable in Node for tests
- `quality.js`: on-device NLP & ML message-quality pipeline — corpus IDF, 18-feature extraction, logistic scoring presets, exact feature attribution (`explain`), Active Learning uncertainty sampling (`sampleUncertain`), in-browser L2 logistic regression trainer (`train`/`autoTrain`), and CSV export (`toCSV`), also loadable in Node for tests
- `test/parser.test.js`: run with `node test/parser.test.js`
- `test/words.test.js`: run with `node test/words.test.js`
- `test/quality.test.js`: run with `node test/quality.test.js`
- `test/fixtures/`: sample exports used by the tests
- `test/preview-big.html`: dev preview for `fixtures/big_100k.txt`

## Privacy

Files are read locally with the browser's File API, so counting, word games, card rendering, and anonymized exporting all happen on your device. The page only fetches the Space Grotesk stylesheet from Google Fonts (and falls back cleanly to system fonts offline).
