/* app.js — wire the parser to the page. No dependencies, no network. */
(function () {
  'use strict';

  const $ = (id) => document.getElementById(id);
  const dropSection = $('dropSection');
  const dropZone = $('dropZone');
  const fileInput = $('fileInput');
  const sampleBtn = $('sampleBtn');
  const errorSection = $('errorSection');
  const errorText = $('errorText');
  const errorSampleBtn = $('errorSampleBtn');
  const resultSection = $('resultSection');
  const typingStatus = $('typingStatus');
  const fileName = $('fileName');
  const fileSub = $('fileSub');
  const answerBtn = $('answerBtn');
  const bigNumber = $('bigNumber');
  const answerUnit = $('answerUnit');
  const answerDots = $('answerDots');
  const receiptsIcon = $('receiptsIcon');
  const strip = $('strip');
  const stripTimelineBtn = $('stripTimelineBtn');
  const stripClockBtn = $('stripClockBtn');
  const wordFilterPill = $('wordFilterPill');
  const stripHint = $('stripHint');
  const stripTooltip = $('stripTooltip');
  const sendersEl = $('senders');
  const extras = $('extras');
  const vibeList = $('vibeList');
  const againBtn = $('againBtn');
  const anonToggle = $('anonToggle');
  const extraNamesInput = $('extraNames');
  const exportBtn = $('exportBtn');
  const cardBtn = $('cardBtn');
  const wordsToggle = $('wordsToggle');
  const wordSection = $('wordSection');
  const wordSub = $('wordSub');
  const wordStats = $('wordStats');
  const wordBoard = $('wordBoard');
  const stopWordsToggle = $('stopWordsToggle');
  const wordCloud = $('wordCloud');
  const bookNote = $('bookNote');
  const bookBank = $('bookBank');
  const bookExpandBtn = $('bookExpandBtn');

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const numberFmt = new Intl.NumberFormat();

  // WhatsApp-ish participant colors, assigned in order of message count.
  const PALETTE = ['#00a884', '#53bdeb', '#f0b429', '#e56399', '#a78bfa', '#f47c48', '#7cd4c0', '#ff8a65'];

  const SAMPLE = [
    '12/05/2025, 18:42 - Messages and calls are end-to-end encrypted. No one outside of this chat, not even WhatsApp, can read or listen to them.',
    '12/05/2025, 18:43 - Alex: are we still on for tomorrow?',
    '12/05/2025, 18:43 - Sam: yes! train at 8 🚆',
    '12/05/2025, 18:44 - Alex: perfect, I will bring the tickets',
    '12/05/2025, 18:45 - Sam: IMG-20250512-WA0004.jpg (file attached)',
    '12/05/2025, 18:45 - Alex: haha, nice one 😂',
    '12/05/2025, 18:46 - Sam: look at this\nand this\nand this',
    '12/05/2025, 18:47 - Alex: <Media omitted>',
    '12/05/2025, 18:49 - Sam: wait until you see the view from the top',
    '13/05/2025, 08:12 - Alex: morning! coffee at 9? ☕',
    '13/05/2025, 08:13 - Sam: 9 works',
    '13/05/2025, 08:14 - Alex: great, see you there',
    '13/05/2025, 09:02 - Sam: on my way now',
    '13/05/2025, 09:15 - Sam changed the subject to "Trip plans"',
    '13/05/2025, 09:20 - Alex: booking the hotel tonight',
    '13/05/2025, 09:21 - Sam: I can look at flights',
    '13/05/2025, 09:22 - Alex: deal',
    '13/05/2025, 09:25 - Sam: VID-20250513-WA0001.mp4 (file attached)',
    '13/05/2025, 09:26 - Alex: that shortcut is unreal 🔥',
    '13/05/2025, 09:27 - Sam: adding it to the doc\nsecond line of the doc link',
    '14/05/2025, 19:40 - Alex: hotel booked',
    '14/05/2025, 19:41 - Sam: flights at 10:15',
    '14/05/2025, 19:42 - Alex: we are actually doing this 😂',
    '14/05/2025, 19:43 - Sam: we are',
    '15/05/2025, 07:55 - Alex: gate closes in 20',
    '15/05/2025, 07:56 - Sam: running',
    '',
  ].join('\n');

  let current = null;
  let countRaf = 0;

  /* ---------- file intake ---------- */

  dropZone.addEventListener('click', () => fileInput.click());
  fileInput.addEventListener('change', () => {
    if (fileInput.files.length) handleFile(fileInput.files[0]);
    fileInput.value = '';
  });
  sampleBtn.addEventListener('click', () => {
    const result = WhatsAppParser.parse(SAMPLE);
    render('Sample chat.txt', new Blob([SAMPLE]).size, result, SAMPLE);
  });
  errorSampleBtn.addEventListener('click', () => {
    const result = WhatsAppParser.parse(SAMPLE);
    render('Sample chat.txt', new Blob([SAMPLE]).size, result, SAMPLE);
  });
  againBtn.addEventListener('click', reset);

  anonToggle.addEventListener('change', () => {
    if (!current) return;
    current.anon = anonToggle.checked;
    syncAnonUI();
    buildSenderRows(current.result);
    renderVibes();
    if (!wordSection.hidden) renderWords();
    hideTooltip();
  });

  if (exportBtn) {
    exportBtn.addEventListener('click', () => {
      if (!current) return;
      const opts = current.anon ? { senderMap: current.map, nameMap: ensureDetected() } : {};
      const text = WhatsAppParser.toText(current.result, opts);
      const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = (current.anon ? 'anonymized-chat' : (current.name || 'chat').replace(/\.txt$/i, '')) + '.txt';
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    });
  }

  if (cardBtn) {
    cardBtn.addEventListener('click', saveCard);
  }

  wordsToggle.addEventListener('change', () => {
    if (!current) return;
    if (wordsToggle.checked) {
      renderWords();
      wordSection.hidden = false;
      wordSection.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'nearest' });
    } else {
      wordSection.hidden = true;
    }
  });

  if (stopWordsToggle) {
    stopWordsToggle.addEventListener('change', () => {
      if (!current || wordSection.hidden) return;
      renderWords();
    });
  }

  if (bookExpandBtn) {
    bookExpandBtn.addEventListener('click', () => {
      if (!current) return;
      current.bookExpanded = !current.bookExpanded;
      renderWords();
    });
  }

  if (answerBtn) {
    answerBtn.addEventListener('click', () => {
      if (!current) return;
      current.lensIndex = (current.lensIndex + 1) % 4;
      updateAnswerBubble(false);
    });
  }

  if (stripTimelineBtn && stripClockBtn) {
    stripTimelineBtn.addEventListener('click', () => setStripMode('timeline'));
    stripClockBtn.addEventListener('click', () => setStripMode('clock'));
  }

  if (wordFilterPill) {
    wordFilterPill.addEventListener('click', () => setSpotlightWord(null));
  }

  let dragDepth = 0;
  window.addEventListener('dragenter', (e) => {
    e.preventDefault();
    dragDepth++;
    dropZone.classList.add('dragging');
  });
  window.addEventListener('dragover', (e) => e.preventDefault());
  window.addEventListener('dragleave', (e) => {
    e.preventDefault();
    dragDepth = Math.max(0, dragDepth - 1);
    if (dragDepth === 0) dropZone.classList.remove('dragging');
  });
  window.addEventListener('drop', (e) => {
    e.preventDefault();
    dragDepth = 0;
    dropZone.classList.remove('dragging');
    const file = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
    if (file) handleFile(file);
  });

  async function handleFile(file) {
    const head = new Uint8Array(await file.slice(0, 4).arrayBuffer());
    const isZip = head[0] === 0x50 && head[1] === 0x4b;
    if (isZip || /\.zip$/i.test(file.name)) {
      showError('That file is a .zip archive. When exporting in WhatsApp, choose Without media — you will get a plain .txt you can drop here.');
      return;
    }
    if (typingStatus) typingStatus.hidden = false;
    let text;
    try {
      text = await file.text();
    } catch {
      if (typingStatus) typingStatus.hidden = true;
      showError('Could not read that file. Try again with the .txt from Export chat.');
      return;
    }
    const result = WhatsAppParser.parse(text);
    if (!result.total) {
      if (typingStatus) typingStatus.hidden = true;
      showError('No messages found in that file. A WhatsApp export has one message per line, like: 12/05/2025, 18:42 - Alex: hi. Make sure you exported the chat as a .txt (Without media).');
      return;
    }
    render(file.name, file.size, result, text);
  }

  function showError(message) {
    dropSection.hidden = true;
    resultSection.hidden = true;
    errorText.textContent = message;
    errorSection.hidden = false;
  }

  function reset() {
    cancelAnimationFrame(countRaf);
    if (typingStatus) typingStatus.hidden = true;
    errorSection.hidden = true;
    resultSection.hidden = true;
    dropSection.hidden = false;
    anonToggle.checked = false;
    wordsToggle.checked = false;
    wordSection.hidden = true;
    hideTooltip();
    dropZone.focus();
  }

  /* ---------- helpers & anonymization ---------- */

  function labelFor(sender) {
    return current && current.anon && current.map.get(sender) ? current.map.get(sender) : sender;
  }

  function syncAnonUI() {
    const on = Boolean(current && current.anon);
    if (extraNamesInput) extraNamesInput.hidden = !on;
    if (exportBtn) exportBtn.hidden = !on;
  }

  function readExtraNames() {
    if (!extraNamesInput) return [];
    return extraNamesInput.value.split(/[,;\n]/).map((s) => s.trim()).filter(Boolean);
  }

  function ensureDetected() {
    if (!current.detected) {
      current.detected = WhatsAppParser.detectNames(current.result, {
        senderMap: current.map,
        extraNames: readExtraNames(),
      });
    }
    return current.detected;
  }

  function wordsFor(anon, filterStopWords) {
    const skip = filterStopWords !== false;
    const key = (anon ? 'anon|' : 'plain|') + (skip ? '1|' : '0|') + readExtraNames().join(',');
    if (!current.wordsCache[key]) {
      current.wordsCache[key] = WhatsAppWords.analyze(
        current.result.messages,
        Object.assign(
          { filterStopWords: skip },
          anon ? { senderMap: current.map, nameMap: ensureDetected() } : {}
        )
      );
    }
    return current.wordsCache[key];
  }

  if (extraNamesInput) {
    extraNamesInput.addEventListener('input', () => {
      if (!current) return;
      current.detected = null;
      current.wordsCache = {};
      if (current.anon && !wordSection.hidden) renderWords();
    });
  }

  function formatHour(h) {
    if (h === 0) return '12 AM';
    if (h < 12) return h + ' AM';
    if (h === 12) return '12 PM';
    return (h - 12) + ' PM';
  }

  function formatSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  }

  /* ---------- main render ---------- */

  function render(name, size, result, rawText) {
    cancelAnimationFrame(countRaf);
    const insights = WhatsAppParser.insights
      ? WhatsAppParser.insights(result)
      : { hours: new Array(24).fill(0), hourSenders: [], totalParsedTs: 0, textChars: result.chars || 0, avgChars: 0 };

    current = {
      result,
      insights,
      colors: new Map(),
      map: WhatsAppParser.senderMap(result),
      anon: false,
      name,
      rawText,
      detected: null,
      wordsCache: {},
      stripMode: 'timeline',
      hoverIndex: null,
      highlightSender: null,
      spotlightWord: null,
      stripLayout: null,
      lensIndex: 0,
      bookExpanded: false,
    };

    anonToggle.checked = false;
    wordsToggle.checked = false;
    wordSection.hidden = true;
    syncAnonUI();
    if (wordFilterPill) wordFilterPill.hidden = true;
    if (stripTimelineBtn && stripClockBtn) {
      stripTimelineBtn.classList.add('active');
      stripClockBtn.classList.remove('active');
      stripTimelineBtn.setAttribute('aria-selected', 'true');
      stripClockBtn.setAttribute('aria-selected', 'false');
    }
    hideTooltip();

    result.senders.forEach((s, i) => current.colors.set(s.sender, PALETTE[i % PALETTE.length]));

    dropSection.hidden = true;
    errorSection.hidden = true;
    resultSection.hidden = false;

    fileName.textContent = name;
    const sizeSpan = document.createElement('span');
    sizeSpan.className = 'size';
    sizeSpan.textContent = formatSize(size);
    fileName.appendChild(sizeSpan);

    fileSub.textContent = result.first && result.last
      ? `from ${result.first} to ${result.last}`
      : '';

    const parts = [];
    if (result.media) parts.push(`${numberFmt.format(result.media)} media message${result.media === 1 ? '' : 's'}`);
    if (result.systemNotes) parts.push(`${numberFmt.format(result.systemNotes)} system note${result.systemNotes === 1 ? '' : 's'} skipped`);
    if (insights.avgChars) parts.push(`avg ${numberFmt.format(insights.avgChars)} chars/msg`);
    extras.textContent = parts.join(', ');

    renderVibes();
    buildSenderRows(result);
    updateAnswerBubble(true);

    drawStrip(1);
    if (!reduceMotion) animateStrip();

    resultSection.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'nearest' });
  }

  /* ---------- answer bubble lenses + receipts ---------- */

  function lensData(index) {
    const { result, insights } = current;
    if (index === 1) {
      const w = wordsFor(current.anon, false);
      return { value: w.totalWords, display: numberFmt.format(w.totalWords), unit: w.totalWords === 1 ? 'word' : 'words', animate: false };
    }
    if (index === 2) {
      return { value: result.chars, display: numberFmt.format(result.chars), unit: 'characters', animate: false };
    }
    if (index === 3) {
      const mins = Math.max(1, Math.round((insights.textChars || result.chars) / 200));
      if (mins >= 60) {
        const hrs = (mins / 60).toFixed(1);
        return { value: hrs, display: hrs, unit: 'hrs typing', animate: false };
      }
      return { value: mins, display: numberFmt.format(mins), unit: mins === 1 ? 'min typing' : 'mins typing', animate: false };
    }
    return { value: result.total, display: numberFmt.format(result.total), unit: result.total === 1 ? 'message' : 'messages', animate: true };
  }

  function updateAnswerBubble(animateInitial) {
    const data = lensData(current.lensIndex);
    if (answerUnit) answerUnit.textContent = data.unit;
    if (answerDots) {
      answerDots.textContent = '';
      for (let i = 0; i < 4; i++) {
        const dot = document.createElement('i');
        if (i === current.lensIndex) dot.className = 'on';
        answerDots.appendChild(dot);
      }
    }

    if (animateInitial && data.animate) {
      if (receiptsIcon) receiptsIcon.classList.remove('read');
      if (typingStatus && !reduceMotion) typingStatus.hidden = false;
      countUp(bigNumber, data.value, () => {
        if (typingStatus) typingStatus.hidden = true;
        if (receiptsIcon) receiptsIcon.classList.add('read');
      });
    } else {
      bigNumber.textContent = data.display;
      if (typingStatus) typingStatus.hidden = true;
      if (receiptsIcon) receiptsIcon.classList.add('read');
    }
  }

  function countUp(el, target, onDone) {
    cancelAnimationFrame(countRaf);
    if (reduceMotion || target < 1) {
      el.textContent = numberFmt.format(target);
      if (onDone) onDone();
      return;
    }
    const duration = 850;
    const start = performance.now();
    function frame(now) {
      const t = Math.min(1, (now - start) / duration);
      const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
      el.textContent = numberFmt.format(Math.round(target * eased));
      if (t < 1) {
        countRaf = requestAnimationFrame(frame);
      } else if (onDone) {
        onDone();
      }
    }
    countRaf = requestAnimationFrame(frame);
  }

  /* ---------- chat vibe superlatives ---------- */

  function renderVibes() {
    if (!vibeList || !current) return;
    const { insights } = current;
    const chips = [];

    if (insights.peakHour) {
      const owl = insights.peakHour.hour >= 22 || insights.peakHour.hour <= 4 ? '🦉' : '⏰';
      chips.push([`${owl} peak`, formatHour(insights.peakHour.hour)]);
    }
    if (insights.peakDay) {
      chips.push(['🔥 busiest day', `${insights.peakDay.label} (${numberFmt.format(insights.peakDay.count)})`]);
    }
    if (insights.longestStreak) {
      chips.push(['💬 streak', `${labelFor(insights.longestStreak.sender)} ×${numberFmt.format(insights.longestStreak.count)}`]);
    }
    if (insights.novelist && current.result.senders.length >= 2) {
      chips.push(['✍️ novelist', `${labelFor(insights.novelist.sender)} (${insights.novelist.avgChars} ch/msg)`]);
    } else if (insights.starter) {
      chips.push(['🚀 starter', `${labelFor(insights.starter.sender)} (×${insights.starter.count})`]);
    }
    if (chips.length < 4 && insights.laugher && current.result.senders.length >= 2) {
      chips.push(['😂 laugh track', `${labelFor(insights.laugher.sender)} (×${numberFmt.format(insights.laugher.count)})`]);
    }

    vibeList.textContent = '';
    vibeList.hidden = chips.length === 0;
    for (const [k, v] of chips.slice(0, 4)) {
      const li = document.createElement('li');
      li.className = 'vibe-chip';
      li.append(k + ' ');
      const strong = document.createElement('strong');
      strong.textContent = v;
      li.appendChild(strong);
      vibeList.appendChild(li);
    }
  }

  /* ---------- sender rows ---------- */

  function buildSenderRows(result) {
    sendersEl.textContent = '';
    for (const s of result.senders) {
      const li = document.createElement('li');
      li.className = 'sender';
      li.dataset.sender = s.sender;
      if (current.highlightSender === s.sender) li.classList.add('active');

      const chip = document.createElement('span');
      chip.className = 'chip';
      chip.style.background = current.colors.get(s.sender);

      const label = labelFor(s.sender);
      const nameEl = document.createElement('span');
      nameEl.className = 'name';
      nameEl.textContent = label;
      nameEl.title = label;

      const count = document.createElement('span');
      count.className = 'count';
      count.textContent = numberFmt.format(s.count);

      const bar = document.createElement('span');
      bar.className = 'bar';
      const fill = document.createElement('i');
      fill.style.width = ((s.count / result.total) * 100).toFixed(2) + '%';
      fill.style.background = current.colors.get(s.sender);
      bar.appendChild(fill);

      li.append(chip, nameEl, count, bar);
      li.addEventListener('mouseenter', () => highlight(s.sender));
      li.addEventListener('mouseleave', () => highlight(null));
      li.addEventListener('click', () => highlight(current.highlightSender === s.sender ? null : s.sender));
      sendersEl.appendChild(li);
    }
  }

  function highlight(sender) {
    if (!current) return;
    current.highlightSender = sender;
    for (const li of sendersEl.children) {
      li.classList.toggle('active', li.dataset.sender === sender);
    }
    drawStrip(1);
  }

  /* ---------- word games ---------- */

  function escapeRegExp(s) {
    return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  function setSpotlightWord(word) {
    if (!current) return;
    if (!word || (current.spotlightWord && current.spotlightWord.word === word)) {
      current.spotlightWord = null;
      if (wordFilterPill) wordFilterPill.hidden = true;
    } else {
      const msgs = current.result.messages;
      const flags = new Uint8Array(msgs.length);

      // If spotlighting an anonymized "Person X" label, match messages from/mentioning them.
      let personTerms = null;
      if (current.anon && /^Person [A-Z]+$/.test(word)) {
        const senderMatches = new Set();
        const textTerms = [];
        for (const [real, lbl] of current.map) {
          if (lbl === word) { senderMatches.add(real); textTerms.push(real); }
        }
        for (const [real, lbl] of ensureDetected()) {
          if (lbl === word) textTerms.push(real);
        }
        const re = textTerms.length
          ? new RegExp('(?<![\\p{L}\\p{N}_])(' + textTerms.map(escapeRegExp).join('|') + ')(?![\\p{L}\\p{N}_])', 'iu')
          : null;
        personTerms = { senderMatches, re };
      }

      if (personTerms) {
        for (let i = 0; i < msgs.length; i++) {
          const m = msgs[i];
          if (personTerms.senderMatches.has(m.sender) || (personTerms.re && personTerms.re.test(m.text))) {
            flags[i] = 1;
          }
        }
      } else {
        const re = new RegExp('(?<![\\p{L}\\p{N}_])' + escapeRegExp(word) + '(?![\\p{L}\\p{N}_])', 'iu');
        for (let i = 0; i < msgs.length; i++) {
          if (!msgs[i].media && re.test(msgs[i].text)) flags[i] = 1;
        }
      }

      current.spotlightWord = { word, flags };
      if (wordFilterPill) {
        wordFilterPill.textContent = `“${word}” ×`;
        wordFilterPill.hidden = false;
      }
      if (current.stripMode === 'clock') setStripMode('timeline');
    }

    for (const btn of wordCloud.querySelectorAll('.word-chip')) {
      btn.classList.toggle('active', Boolean(current.spotlightWord && btn.dataset.word === current.spotlightWord.word));
    }
    drawStrip(1);
  }

  function renderWords() {
    const skipCommon = stopWordsToggle ? stopWordsToggle.checked : true;
    const w = wordsFor(current.anon, skipCommon);

    wordSection.classList.toggle('empty', !w.totalWords);
    wordSub.textContent = w.totalWords
      ? `${numberFmt.format(w.totalWords)} words in ${numberFmt.format(w.messageCount)} messages` +
        (w.mediaSkipped ? ` — ${numberFmt.format(w.mediaSkipped)} media message${w.mediaSkipped === 1 ? '' : 's'} skipped` : '')
      : 'no words in this chat — just media and vibes 📷';
    bookNote.textContent = '';

    // stat chips
    wordStats.textContent = '';
    if (w.totalWords) {
      const chips = [
        [numberFmt.format(w.totalWords), 'words total'],
        [numberFmt.format(w.uniqueWords), 'different words'],
        [Math.round(w.ratio * 100) + '%', 'vocab diversity'],
        [(w.totalWords / w.messageCount).toFixed(1), 'words per message'],
      ];
      for (const [value, caption] of chips) {
        const box = document.createElement('div');
        box.className = 'stat';
        const num = document.createElement('span');
        num.className = 'stat-num';
        num.textContent = value;
        const cap = document.createElement('span');
        cap.className = 'stat-label';
        cap.textContent = caption;
        box.append(num, cap);
        wordStats.appendChild(box);
      }

      if (w.topEmoji.length) {
        const box = document.createElement('div');
        box.className = 'stat';
        const row = document.createElement('span');
        row.className = 'stat-num stat-emoji-row';
        row.textContent = `${w.topEmoji[0].emoji} ×${numberFmt.format(w.topEmoji[0].count)}`;
        if (w.topEmoji.length > 1) {
          const rest = document.createElement('span');
          rest.className = 'stat-emoji-rest';
          rest.textContent = w.topEmoji.slice(1).map((e) => e.emoji).join(' ');
          row.appendChild(rest);
        }
        const cap = document.createElement('span');
        cap.className = 'stat-label';
        cap.textContent = w.topEmoji.length > 1 ? 'top emojis' : 'favourite emoji';
        box.append(row, cap);
        wordStats.appendChild(box);
      }
    }

    // diversity leaderboard
    wordBoard.textContent = '';
    const medals = ['🥇', '🥈', '🥉'];
    const maxUnique = Math.max(1, ...w.senders.map((s) => s.unique));
    w.senders.forEach((s, i) => {
      const li = document.createElement('li');
      li.className = 'word-row';

      const rank = document.createElement('span');
      rank.className = 'rank';
      rank.textContent = i < medals.length ? medals[i] : '#' + (i + 1);

      const chip = document.createElement('span');
      chip.className = 'chip';
      chip.style.background = current.colors.get(s.sender);

      const who = document.createElement('span');
      who.className = 'who';
      const nameEl = document.createElement('span');
      nameEl.className = 'name';
      nameEl.textContent = labelFor(s.sender);
      nameEl.title = labelFor(s.sender);

      const sig = document.createElement('small');
      sig.className = 'sig';
      const sigParts = [];
      if (s.signature) sigParts.push(`signature “${s.signature}” ×${numberFmt.format(s.top[0].count)}`);
      sigParts.push(`${Math.round(s.ratio * 100)}% diverse`);
      if (s.favEmoji) sigParts.push(`fav ${s.favEmoji.emoji}`);
      sig.textContent = sigParts.join(' · ');
      who.append(nameEl, sig);

      const uniq = document.createElement('span');
      uniq.className = 'count';
      uniq.textContent = numberFmt.format(s.unique);
      uniq.title = `${numberFmt.format(s.unique)} different words`;

      const bar = document.createElement('span');
      bar.className = 'bar';
      const fill = document.createElement('i');
      fill.style.width = ((s.unique / maxUnique) * 100).toFixed(2) + '%';
      fill.style.background = current.colors.get(s.sender);
      bar.appendChild(fill);

      li.append(rank, chip, who, uniq, bar);
      wordBoard.appendChild(li);
    });

    // most used words — interactive cloud
    wordCloud.textContent = '';
    const maxCount = w.top.length ? w.top[0].count : 1;
    for (const t of w.top) {
      const chipEl = document.createElement('button');
      chipEl.type = 'button';
      chipEl.className = 'word-chip';
      chipEl.dataset.word = t.word;
      if (current.spotlightWord && current.spotlightWord.word === t.word) chipEl.classList.add('active');
      chipEl.style.fontSize = (0.8 + 1.15 * (t.count / maxCount)).toFixed(2) + 'rem';
      const wordEl = document.createElement('span');
      wordEl.textContent = t.word;
      const countEl = document.createElement('small');
      countEl.textContent = '×' + numberFmt.format(t.count);
      chipEl.append(wordEl, countEl);
      chipEl.title = `Click to spotlight “${t.word}” on the strip (${numberFmt.format(t.count)} times)`;
      chipEl.addEventListener('click', () => setSpotlightWord(t.word));
      wordCloud.appendChild(chipEl);
    }

    // the book bank — compact by default (unlocked + next), expandable to all 5
    const report = WhatsAppWords.bookReport(w.uniqueWords);
    const next = report.books.find((b) => !b.covered);
    if (w.totalWords) {
      if (report.writable) {
        bookNote.textContent = `📚 with ${numberFmt.format(w.uniqueWords)} different words, this chat's word bank could have written ${report.writable.title} by ${report.writable.author}!`;
      } else if (next) {
        bookNote.textContent = `📚 ${numberFmt.format(w.uniqueWords)} different words — ${Math.floor(next.pct)}% of the way to all the words in ${next.title}`;
      }
    }

    let visibleBooks = report.books;
    if (!current.bookExpanded) {
      const picks = [];
      if (report.writable) picks.push(report.writable);
      if (next) picks.push(next);
      if (picks.length) visibleBooks = picks;
    }

    bookBank.textContent = '';
    for (const b of visibleBooks) {
      const li = document.createElement('li');
      li.className = 'book';

      const line = document.createElement('div');
      line.className = 'book-line';
      const title = document.createElement('span');
      title.className = 'book-title';
      title.append(b.title + ' ');
      const author = document.createElement('span');
      author.className = 'author';
      author.textContent = b.author;
      title.appendChild(author);
      const pct = document.createElement('span');
      pct.className = 'book-pct';
      pct.textContent = b.covered
        ? `✅ all ≈${numberFmt.format(b.uniqueWords)} words`
        : `${Math.floor(b.pct)}% of ≈${numberFmt.format(b.uniqueWords)} words`;
      line.append(title, pct);

      const bar = document.createElement('span');
      bar.className = 'bar';
      const fill = document.createElement('i');
      fill.style.width = b.pct.toFixed(2) + '%';
      bar.appendChild(fill);

      li.append(line, bar);
      if (b.covered) {
        const badge = document.createElement('p');
        badge.className = 'book-badge';
        badge.textContent = 'writable with this chat’s words';
        li.appendChild(badge);
      }
      bookBank.appendChild(li);
    }

    if (bookExpandBtn) {
      const hasHidden = report.books.length > visibleBooks.length || current.bookExpanded;
      bookExpandBtn.hidden = !w.totalWords || !hasHidden;
      bookExpandBtn.textContent = current.bookExpanded
        ? 'show less'
        : `show all ${report.books.length} books`;
    }
  }

  /* ---------- rhythm strip (timeline + 24h clock + tooltip) ---------- */

  function setStripMode(mode) {
    if (!current || current.stripMode === mode) return;
    current.stripMode = mode;
    current.hoverIndex = null;
    hideTooltip();
    if (stripTimelineBtn && stripClockBtn) {
      stripTimelineBtn.classList.toggle('active', mode === 'timeline');
      stripClockBtn.classList.toggle('active', mode === 'clock');
      stripTimelineBtn.setAttribute('aria-selected', String(mode === 'timeline'));
      stripClockBtn.setAttribute('aria-selected', String(mode === 'clock'));
    }
    if (stripHint) {
      stripHint.textContent = mode === 'clock'
        ? 'hourly activity · hover a bar for counts'
        : 'hover to scrub · click sender to spotlight';
    }
    drawStrip(1);
    if (!reduceMotion) animateStrip();
  }

  function drawStrip(progress) {
    if (!current) return;
    const dpr = window.devicePixelRatio || 1;
    const cssW = strip.clientWidth || strip.parentElement.clientWidth;
    const cssH = strip.clientHeight || 76;
    if (strip.width !== Math.round(cssW * dpr) || strip.height !== Math.round(cssH * dpr)) {
      strip.width = Math.round(cssW * dpr);
      strip.height = Math.round(cssH * dpr);
    }
    const ctx = strip.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, cssW, cssH);

    if (current.stripMode === 'clock') {
      drawClockStrip(ctx, cssW, cssH, progress);
    } else {
      drawTimelineStrip(ctx, cssW, cssH, progress);
    }
  }

  function drawTimelineStrip(ctx, cssW, cssH, progress) {
    const { result, colors, highlightSender, spotlightWord, hoverIndex } = current;
    const msgs = result.messages;
    const n = msgs.length;
    if (!n) return;

    let maxLen = 1;
    for (const m of msgs) maxLen = Math.max(maxLen, m.text.length);
    const maxLog = Math.log(1 + maxLen);

    const maxTicks = Math.max(1, Math.floor(cssW / 2));
    const bucketSize = Math.max(1, Math.ceil(n / maxTicks));
    const buckets = Math.ceil(n / bucketSize);
    const slot = cssW / buckets;
    const gap = slot > 3 ? 1 : slot > 1.5 ? 0.5 : 0;
    const tickW = Math.max(0.6, slot - gap);
    const minH = 5;
    const visible = Math.max(1, Math.floor(buckets * progress));

    current.stripLayout = { mode: 'timeline', buckets, slot, bucketSize, n };

    for (let b = 0; b < visible; b++) {
      const start = b * bucketSize;
      const end = Math.min(start + bucketSize, n);
      let best = null;
      for (let j = start; j < end; j++) {
        const m = msgs[j];
        if (highlightSender && m.sender !== highlightSender) continue;
        if (spotlightWord && !spotlightWord.flags[j]) continue;
        if (!best || m.text.length > best.text.length) best = m;
      }
      const dimmed = (highlightSender || spotlightWord) && !best;
      if (!best) best = msgs[start];
      const h = minH + (cssH - minH - 4) * (Math.log(1 + best.text.length) / maxLog);
      const x = b * slot + gap / 2;

      if (hoverIndex === b) {
        ctx.fillStyle = 'rgba(233, 237, 239, 0.12)';
        ctx.fillRect(b * slot, 0, Math.max(1, slot), cssH);
      }

      ctx.globalAlpha = dimmed ? 0.12 : 1;
      ctx.fillStyle = colors.get(best.sender) || '#8696a0';
      if (tickW >= 3) {
        ctx.beginPath();
        ctx.roundRect(x, cssH - h, tickW, h, Math.min(2, tickW / 2));
        ctx.fill();
      } else {
        ctx.fillRect(x, cssH - h, tickW, h);
      }
    }
    ctx.globalAlpha = 1;
  }

  function drawClockStrip(ctx, cssW, cssH, progress) {
    const { insights, result, colors, highlightSender, hoverIndex } = current;
    const hours = insights.hours || new Array(24).fill(0);
    const maxHour = Math.max(1, ...hours);
    const labelH = 14;
    const plotH = Math.max(16, cssH - labelH - 4);
    const slot = cssW / 24;
    const gap = Math.min(6, Math.max(2, slot * 0.22));
    const barW = Math.max(4, slot - gap);

    current.stripLayout = { mode: 'clock', slot };

    for (let h = 0; h < 24; h++) {
      const total = hours[h];
      const x = h * slot + gap / 2;

      if (hoverIndex === h) {
        ctx.fillStyle = 'rgba(233, 237, 239, 0.08)';
        ctx.fillRect(h * slot, 0, slot, cssH - labelH);
      }

      if (!total) {
        ctx.globalAlpha = 0.2;
        ctx.fillStyle = '#2a3942';
        ctx.fillRect(x, cssH - labelH - 2, barW, 2);
      } else {
        const barH = Math.max(3, plotH * (total / maxHour) * progress);
        let yCursor = cssH - labelH;
        const hs = insights.hourSenders && insights.hourSenders[h];

        if (hs && hs.size) {
          for (const s of result.senders) {
            const count = hs.get(s.sender) || 0;
            if (!count) continue;
            const segH = barH * (count / total);
            ctx.globalAlpha = highlightSender && s.sender !== highlightSender ? 0.15 : 1;
            ctx.fillStyle = colors.get(s.sender) || '#8696a0';
            ctx.fillRect(x, yCursor - segH, barW, Math.max(0.8, segH));
            yCursor -= segH;
          }
        } else {
          ctx.globalAlpha = 1;
          ctx.fillStyle = '#00a884';
          ctx.fillRect(x, cssH - labelH - barH, barW, barH);
        }
      }
    }

    ctx.globalAlpha = 1;
    ctx.fillStyle = '#8696a0';
    ctx.font = '10px "Space Grotesk", system-ui, sans-serif';
    ctx.textAlign = 'center';
    for (const h of [0, 6, 12, 18, 23]) {
      const lbl = h === 0 ? '12a' : h === 6 ? '6a' : h === 12 ? '12p' : h === 18 ? '6p' : '11p';
      ctx.fillText(lbl, h * slot + slot / 2, cssH - 2);
    }
  }

  function animateStrip() {
    const duration = 600;
    const start = performance.now();
    function frame(now) {
      const t = Math.min(1, (now - start) / duration);
      drawStrip(t * t * (3 - 2 * t));
      if (t < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  /* ---------- strip hover / scrub tooltip ---------- */

  function hideTooltip() {
    if (stripTooltip) stripTooltip.hidden = true;
    if (current && current.hoverIndex !== null) {
      current.hoverIndex = null;
      drawStrip(1);
    }
  }

  function updateTooltip(clientX) {
    if (!current || !current.stripLayout || !stripTooltip) return;
    const rect = strip.getBoundingClientRect();
    const x = Math.max(0, Math.min(rect.width - 0.01, clientX - rect.left));
    const layout = current.stripLayout;

    if (layout.mode === 'timeline') {
      const b = Math.min(layout.buckets - 1, Math.floor(x / layout.slot));
      if (b < 0) return;
      if (current.hoverIndex !== b) {
        current.hoverIndex = b;
        drawStrip(1);
      }
      const start = b * layout.bucketSize;
      const end = Math.min(start + layout.bucketSize, layout.n);
      let best = current.result.messages[start];
      for (let j = start; j < end; j++) {
        const m = current.result.messages[j];
        if (current.highlightSender && m.sender !== current.highlightSender) continue;
        if (current.spotlightWord && !current.spotlightWord.flags[j]) continue;
        if (m.text.length >= best.text.length) best = m;
      }
      const bucketCount = end - start;
      const snippet = best.media
        ? 'media message'
        : current.anon
          ? `${numberFmt.format(best.text.length)} chars`
          : best.text.replace(/\s+/g, ' ').slice(0, 44) + (best.text.length > 44 ? '…' : '');
      renderTooltipContent(
        current.colors.get(best.sender),
        labelFor(best.sender),
        best.ts + (bucketCount > 1 ? ` · ${bucketCount} msgs` : ''),
        snippet,
        x,
        rect.width
      );
    } else {
      const h = Math.min(23, Math.max(0, Math.floor(x / layout.slot)));
      if (current.hoverIndex !== h) {
        current.hoverIndex = h;
        drawStrip(1);
      }
      const count = current.insights.hours[h] || 0;
      const total = current.insights.totalParsedTs || current.result.total || 1;
      const pct = Math.round((count / total) * 100);
      let topSender = null;
      let topCount = 0;
      const hs = current.insights.hourSenders && current.insights.hourSenders[h];
      if (hs) {
        for (const [s, c] of hs) {
          if (c > topCount) { topCount = c; topSender = s; }
        }
      }
      const body = count
        ? `${numberFmt.format(count)} message${count === 1 ? '' : 's'} (${pct}%)` + (topSender ? ` · mostly ${labelFor(topSender)}` : '')
        : 'no messages at this hour';
      renderTooltipContent(
        topSender ? current.colors.get(topSender) : '#8696a0',
        `${formatHour(h)} – ${formatHour((h + 1) % 24)}`,
        '',
        body,
        h * layout.slot + layout.slot / 2,
        rect.width
      );
    }
  }

  function renderTooltipContent(color, title, meta, body, anchorX, width) {
    stripTooltip.textContent = '';
    const head = document.createElement('div');
    head.className = 'tt-head';
    if (color) {
      const dot = document.createElement('span');
      dot.className = 'tt-dot';
      dot.style.background = color;
      head.appendChild(dot);
    }
    const nameSpan = document.createElement('span');
    nameSpan.textContent = title;
    head.appendChild(nameSpan);
    if (meta) {
      const tsSpan = document.createElement('span');
      tsSpan.className = 'tt-ts';
      tsSpan.textContent = meta;
      head.appendChild(tsSpan);
    }
    const bodyEl = document.createElement('div');
    bodyEl.className = 'tt-body';
    bodyEl.textContent = body;
    stripTooltip.append(head, bodyEl);
    stripTooltip.hidden = false;

    const pad = Math.min(110, width / 2);
    const clampedX = Math.max(pad, Math.min(width - pad, anchorX));
    stripTooltip.style.left = clampedX + 'px';
  }

  strip.addEventListener('pointermove', (e) => updateTooltip(e.clientX));
  strip.addEventListener('pointerleave', hideTooltip);

  /* ---------- shareable PNG receipt card ---------- */

  function saveCard() {
    if (!current) return;
    const W = 1200;
    const H = 675;
    const scale = 2;
    const c = document.createElement('canvas');
    c.width = W * scale;
    c.height = H * scale;
    const ctx = c.getContext('2d');
    ctx.scale(scale, scale);

    // Background + frame
    ctx.fillStyle = '#0b141a';
    ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = '#2a3942';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(24, 24, W - 48, H - 48, 28);
    ctx.stroke();

    // Header
    ctx.fillStyle = '#00a884';
    ctx.beginPath();
    ctx.arc(64, 72, 6, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#e9edef';
    ctx.font = '500 20px "Space Grotesk", system-ui, sans-serif';
    ctx.fillText('message counter', 82, 79);

    const titleText = current.anon ? 'Anonymized chat' : (current.name || 'WhatsApp chat');
    ctx.fillStyle = '#8696a0';
    ctx.font = '400 18px "Space Grotesk", system-ui, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(titleText.slice(0, 48), W - 60, 79);
    ctx.textAlign = 'left';

    if (current.result.first && current.result.last) {
      ctx.fillStyle = '#8696a0';
      ctx.font = '400 16px "Space Grotesk", system-ui, sans-serif';
      ctx.fillText(`from ${current.result.first} to ${current.result.last}`, 60, 114);
    }

    // Left hero WhatsApp bubble
    const bx = 60, by = 165, bw = 440, bh = 250;
    ctx.fillStyle = '#005c4b';
    ctx.beginPath();
    ctx.roundRect(bx, by, bw, bh, 26);
    ctx.fill();

    ctx.fillStyle = '#e9edef';
    const numStr = numberFmt.format(current.result.total);
    const numFontSize = numStr.length > 7 ? 78 : numStr.length > 5 ? 96 : 114;
    ctx.font = `700 ${numFontSize}px "Space Grotesk", system-ui, sans-serif`;
    ctx.fillText(numStr, bx + 36, by + 148);

    ctx.fillStyle = 'rgba(233, 237, 239, 0.8)';
    ctx.font = '400 22px "Space Grotesk", system-ui, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(current.result.total === 1 ? 'message' : 'messages', bx + bw - 68, by + bh - 28);
    ctx.textAlign = 'left';

    // Blue double-ticks
    ctx.strokeStyle = '#53bdeb';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    const tx = bx + bw - 56, ty = by + bh - 42;
    ctx.beginPath();
    ctx.moveTo(tx, ty + 8); ctx.lineTo(tx + 5, ty + 13); ctx.lineTo(tx + 14, ty + 3);
    ctx.moveTo(tx + 11, ty + 8); ctx.lineTo(tx + 16, ty + 13); ctx.lineTo(tx + 25, ty + 3);
    ctx.stroke();

    // Vibe line under bubble
    const vibeStrings = Array.from(vibeList ? vibeList.children : []).map((li) => li.textContent);
    if (vibeStrings.length) {
      ctx.fillStyle = '#8696a0';
      ctx.font = '400 17px "Space Grotesk", system-ui, sans-serif';
      vibeStrings.slice(0, 3).forEach((vs, idx) => {
        ctx.fillText(vs, 60, 462 + idx * 32);
      });
    }

    // Right side: mini rhythm strip
    const sx = 555, sy = 165, sw = 585, sh = 96;
    const msgs = current.result.messages;
    if (msgs.length) {
      let maxLen = 1;
      for (const m of msgs) maxLen = Math.max(maxLen, m.text.length);
      const maxLog = Math.log(1 + maxLen);
      const buckets = Math.min(msgs.length, 190);
      const bSize = Math.ceil(msgs.length / buckets);
      const slot = sw / buckets;
      for (let b = 0; b < buckets; b++) {
        const sIdx = b * bSize;
        const eIdx = Math.min(sIdx + bSize, msgs.length);
        let best = msgs[sIdx];
        for (let j = sIdx; j < eIdx; j++) {
          if (msgs[j].text.length > best.text.length) best = msgs[j];
        }
        const h = 6 + (sh - 10) * (Math.log(1 + best.text.length) / maxLog);
        ctx.fillStyle = current.colors.get(best.sender) || '#00a884';
        ctx.fillRect(sx + b * slot, sy + sh - h, Math.max(1.5, slot - 1), h);
      }
    }

    // Right side: top 5 senders
    const topSenders = current.result.senders.slice(0, 5);
    topSenders.forEach((s, idx) => {
      const y = 312 + idx * 54;
      const color = current.colors.get(s.sender) || '#00a884';
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(sx + 6, y - 6, 5, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#e9edef';
      ctx.font = '500 20px "Space Grotesk", system-ui, sans-serif';
      ctx.fillText(labelFor(s.sender).slice(0, 26), sx + 22, y);

      ctx.fillStyle = '#8696a0';
      ctx.textAlign = 'right';
      ctx.fillText(numberFmt.format(s.count), sx + sw, y);
      ctx.textAlign = 'left';

      ctx.fillStyle = '#1b252c';
      ctx.fillRect(sx, y + 12, sw, 5);
      ctx.fillStyle = color;
      ctx.fillRect(sx, y + 12, sw * (s.count / current.result.total), 5);
    });

    // Footer
    ctx.fillStyle = '#8696a0';
    ctx.font = '400 15px "Space Grotesk", system-ui, sans-serif';
    ctx.fillText('counted locally in your browser · whatsapp message counter', 60, H - 52);

    c.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const base = current.anon ? 'anonymized-chat' : (current.name || 'whatsapp-chat').replace(/\.txt$/i, '');
      a.download = base + '-card.png';
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      const prev = cardBtn.textContent;
      cardBtn.textContent = 'Saved!';
      setTimeout(() => { cardBtn.textContent = prev; }, 1400);
    }, 'image/png');
  }

  let resizeTimer = null;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      hideTooltip();
      drawStrip(1);
    }, 100);
  });

  // ?sample loads the bundled demo chat (also handy for sharing a preview); add &words to open the word games too.
  if (/[?&]sample\b/.test(location.search)) {
    const result = WhatsAppParser.parse(SAMPLE);
    render('Sample chat.txt', new Blob([SAMPLE]).size, result, SAMPLE);
    if (/[?&]words([&#]|$)/.test(location.search)) wordsToggle.click();
  }

  // Tiny hook so tests (and the curious) can feed text straight in:
  // window.__countText('name.txt', rawText)
  window.__countText = (name, text) => {
    const result = WhatsAppParser.parse(text);
    if (!result.total) { showError('No messages found in that text.'); return; }
    render(name, new Blob([text]).size, result, text);
  };
})();
