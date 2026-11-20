/* app.js: wire the parser and word games to the page. */
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
  const stripCalendarBtn = $('stripCalendarBtn');
  const wordSearch = $('wordSearch');
  const wordFilterPill = $('wordFilterPill');
  const memoryBtn = $('memoryBtn');
  const stripHint = $('stripHint');
  const stripTooltip = $('stripTooltip');
  const sendersBar = $('sendersBar');
  const raceStatus = $('raceStatus');
  const raceBtn = $('raceBtn');
  const raceResetBtn = $('raceResetBtn');
  const raceTrack = $('raceTrack');
  const raceFill = $('raceFill');
  const sendersEl = $('senders');
  const extras = $('extras');
  const vibeList = $('vibeList');
  const againBtn = $('againBtn');
  const anonToggle = $('anonToggle');
  const extraNamesInput = $('extraNames');
  const wrappedBtn = $('wrappedBtn');
  const exportBtn = $('exportBtn');
  const cardBtn = $('cardBtn');
  const cardMenu = $('cardMenu');
  const cardWideBtn = $('cardWideBtn');
  const cardStoryBtn = $('cardStoryBtn');
  const wordsToggle = $('wordsToggle');
  const wordSection = $('wordSection');
  const wordSub = $('wordSub');
  const wordStats = $('wordStats');
  const quizBox = $('quizBox');
  const quizScore = $('quizScore');
  const quizQuote = $('quizQuote');
  const quizMeta = $('quizMeta');
  const quizChoices = $('quizChoices');
  const quizFooter = $('quizFooter');
  const quizFeedback = $('quizFeedback');
  const quizPeekBtn = $('quizPeekBtn');
  const quizNextBtn = $('quizNextBtn');
  const wordBoard = $('wordBoard');
  const stopWordsToggle = $('stopWordsToggle');
  const wordCloud = $('wordCloud');
  const bookNote = $('bookNote');
  const bookBank = $('bookBank');
  const bookExpandBtn = $('bookExpandBtn');

  // Modals
  const peekModal = $('peekModal');
  const peekTitle = $('peekTitle');
  const peekSub = $('peekSub');
  const peekMessages = $('peekMessages');
  const peekCloseBtn = $('peekCloseBtn');
  const peekPrevBtn = $('peekPrevBtn');
  const peekRandomBtn = $('peekRandomBtn');
  const peekNextBtn = $('peekNextBtn');

  const wrappedModal = $('wrappedModal');
  const wrappedBars = $('wrappedBars');
  const wrappedCounter = $('wrappedCounter');
  const wrappedSlide = $('wrappedSlide');
  const wrappedCloseBtn = $('wrappedCloseBtn');
  const wrappedPrevBtn = $('wrappedPrevBtn');
  const wrappedNextBtn = $('wrappedNextBtn');

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const numberFmt = new Intl.NumberFormat();
  const LENS_COUNT = 6;
  const WRAPPED_SLIDES = 6;

  // WhatsApp-ish participant colors, assigned in order of message count.
  const PALETTE = ['#00a884', '#53bdeb', '#f0b429', '#e56399', '#a78bfa', '#f47c48', '#7cd4c0', '#ff8a65'];
  const DAY_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const MONTH_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

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
  let raceRaf = 0;
  let searchTimer = null;

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
    if (!wordSection.hidden) {
      renderWords();
      renderQuizCurrent();
    }
    if (peekModal && !peekModal.hidden) renderPeekWindow();
    if (wrappedModal && !wrappedModal.hidden) renderWrappedSlide();
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

  // Save card menu (16:9 + 9:16)
  function closeCardMenu() {
    if (!cardMenu || !cardBtn) return;
    cardMenu.hidden = true;
    cardBtn.setAttribute('aria-expanded', 'false');
  }
  if (cardBtn && cardMenu) {
    cardBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const willOpen = cardMenu.hidden;
      cardMenu.hidden = !willOpen;
      cardBtn.setAttribute('aria-expanded', String(willOpen));
    });
    document.addEventListener('click', (e) => {
      if (!cardMenu.hidden && !cardMenu.contains(e.target) && e.target !== cardBtn) {
        closeCardMenu();
      }
    });
  }
  if (cardWideBtn) {
    cardWideBtn.addEventListener('click', () => {
      closeCardMenu();
      saveCard('wide');
    });
  }
  if (cardStoryBtn) {
    cardStoryBtn.addEventListener('click', () => {
      closeCardMenu();
      saveCard('story');
    });
  }

  if (wrappedBtn) {
    wrappedBtn.addEventListener('click', openWrapped);
  }

  wordsToggle.addEventListener('change', () => {
    if (!current) return;
    if (wordsToggle.checked) {
      renderWords();
      ensureQuiz();
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
      current.lensIndex = (current.lensIndex + 1) % LENS_COUNT;
      updateAnswerBubble(false);
    });
  }

  if (stripTimelineBtn) stripTimelineBtn.addEventListener('click', () => setStripMode('timeline'));
  if (stripClockBtn) stripClockBtn.addEventListener('click', () => setStripMode('clock'));
  if (stripCalendarBtn) stripCalendarBtn.addEventListener('click', () => setStripMode('calendar'));

  if (wordFilterPill) {
    wordFilterPill.addEventListener('click', () => clearSpotlight());
  }

  if (wordSearch) {
    wordSearch.addEventListener('input', () => {
      clearTimeout(searchTimer);
      const val = wordSearch.value.trim();
      searchTimer = setTimeout(() => {
        if (!current) return;
        if (!val) clearSpotlight();
        else setSpotlightWord(val, { fromSearch: true });
      }, 180);
    });
    wordSearch.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        clearTimeout(searchTimer);
        const val = wordSearch.value.trim();
        if (!val) clearSpotlight();
        else setSpotlightWord(val, { fromSearch: true });
      } else if (e.key === 'Escape') {
        wordSearch.value = '';
        clearSpotlight();
        wordSearch.blur();
      }
    });
  }

  if (memoryBtn) {
    memoryBtn.addEventListener('click', () => openRandomPeek());
  }

  if (raceBtn) {
    raceBtn.addEventListener('click', toggleRace);
  }
  if (raceResetBtn) {
    raceResetBtn.addEventListener('click', () => stopRace(true));
  }

  if (quizNextBtn) quizNextBtn.addEventListener('click', nextQuizQuestion);
  if (quizPeekBtn) {
    quizPeekBtn.addEventListener('click', () => {
      if (!current || !current.quiz || !current.quiz.current) return;
      openPeek(current.quiz.current.index, 'From “Who said it?”');
    });
  }

  // Modal close handlers + keyboard shortcuts
  if (peekCloseBtn) peekCloseBtn.addEventListener('click', closePeek);
  if (peekModal) {
    peekModal.addEventListener('click', (e) => {
      if (e.target === peekModal) closePeek();
    });
  }
  if (peekPrevBtn) {
    peekPrevBtn.addEventListener('click', () => {
      if (!current || !current.peek) return;
      current.peek.index = Math.max(0, current.peek.index - 4);
      current.peek.title = 'Moment peek';
      renderPeekWindow();
    });
  }
  if (peekNextBtn) {
    peekNextBtn.addEventListener('click', () => {
      if (!current || !current.peek) return;
      current.peek.index = Math.min(current.result.messages.length - 1, current.peek.index + 4);
      current.peek.title = 'Moment peek';
      renderPeekWindow();
    });
  }
  if (peekRandomBtn) peekRandomBtn.addEventListener('click', () => openRandomPeek());

  if (wrappedCloseBtn) wrappedCloseBtn.addEventListener('click', closeWrapped);
  if (wrappedModal) {
    wrappedModal.addEventListener('click', (e) => {
      if (e.target === wrappedModal) closeWrapped();
    });
  }
  if (wrappedPrevBtn) wrappedPrevBtn.addEventListener('click', () => stepWrapped(-1));
  if (wrappedNextBtn) wrappedNextBtn.addEventListener('click', () => stepWrapped(1));

  // Swipe support for Wrapped
  let touchStartX = null;
  if (wrappedSlide) {
    wrappedSlide.addEventListener('touchstart', (e) => {
      if (e.touches && e.touches.length === 1) touchStartX = e.touches[0].clientX;
    }, { passive: true });
    wrappedSlide.addEventListener('touchend', (e) => {
      if (touchStartX === null || !e.changedTouches || !e.changedTouches.length) return;
      const dx = e.changedTouches[0].clientX - touchStartX;
      touchStartX = null;
      if (Math.abs(dx) > 45) stepWrapped(dx < 0 ? 1 : -1);
    }, { passive: true });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeCardMenu();
      if (peekModal && !peekModal.hidden) closePeek();
      if (wrappedModal && !wrappedModal.hidden) closeWrapped();
    } else if (wrappedModal && !wrappedModal.hidden) {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        stepWrapped(1);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        stepWrapped(-1);
      }
    }
  });

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
      showError('That file is a .zip archive. When exporting in WhatsApp, pick "Without media" to get a plain .txt file you can drop here.');
      return;
    }
    if (typingStatus) typingStatus.hidden = false;
    let text;
    try {
      text = await file.text();
    } catch {
      if (typingStatus) typingStatus.hidden = true;
      showError('Could not read that file. Try again with the .txt file from Export chat.');
      return;
    }
    const result = WhatsAppParser.parse(text);
    if (!result.total) {
      if (typingStatus) typingStatus.hidden = true;
      showError('No messages found in that file. WhatsApp exports have one message per line (like "12/05/2025, 18:42 - Alex: hi"). Make sure you exported as .txt with "Without media".');
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
    stopRace(false);
    closePeek();
    closeWrapped();
    closeCardMenu();
    if (typingStatus) typingStatus.hidden = true;
    errorSection.hidden = true;
    resultSection.hidden = true;
    dropSection.hidden = false;
    anonToggle.checked = false;
    wordsToggle.checked = false;
    wordSection.hidden = true;
    if (wordSearch) wordSearch.value = '';
    hideTooltip();
    dropZone.focus();
  }

  /* ---------- helpers & anonymization ---------- */

  function labelFor(sender) {
    return current && current.anon && current.map.get(sender) ? current.map.get(sender) : sender;
  }

  function textFor(rawText) {
    if (!current || !current.anon) return rawText;
    if (WhatsAppParser.replaceNames) {
      return WhatsAppParser.replaceNames(rawText, current.map, ensureDetected());
    }
    return rawText;
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
      if (current.anon) {
        if (!wordSection.hidden) {
          renderWords();
          renderQuizCurrent();
        }
        if (peekModal && !peekModal.hidden) renderPeekWindow();
        if (wrappedModal && !wrappedModal.hidden) renderWrappedSlide();
      }
    });
  }

  function formatHour(h) {
    if (h === 0) return '12 AM';
    if (h < 12) return h + ' AM';
    if (h === 12) return '12 PM';
    return (h - 12) + ' PM';
  }

  function formatDuration(ms) {
    if (WhatsAppParser.formatDurationShort) return WhatsAppParser.formatDurationShort(ms);
    if (ms == null) return '-';
    const mins = Math.round(ms / 60000);
    if (mins < 1) return '<1m';
    if (mins < 60) return mins + 'm';
    return Math.round(mins / 60) + 'h';
  }

  function formatSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  }

  function hexToRgba(hex, alpha) {
    const h = hex.replace('#', '');
    const r = parseInt(h.slice(0, 2), 16) || 0;
    const g = parseInt(h.slice(2, 4), 16) || 168;
    const b = parseInt(h.slice(4, 6), 16) || 132;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  /* ---------- main render ---------- */

  function render(name, size, result, rawText) {
    cancelAnimationFrame(countRaf);
    stopRace(false);
    closePeek();
    closeWrapped();
    closeCardMenu();

    const insights = WhatsAppParser.insights
      ? WhatsAppParser.insights(result)
      : { hours: new Array(24).fill(0), weekdays: new Array(7).fill(0), dayList: [], hourSenders: [], totalParsedTs: 0, textChars: result.chars || 0, avgChars: 0, senderStats: {}, awards: [] };

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
      openDossier: null,
      spotlightWord: null,
      spotlightRange: null,
      activeVibe: null,
      stripLayout: null,
      lensIndex: 0,
      bookExpanded: false,
      peek: null,
      quiz: null,
      wrappedIndex: 0,
      race: null,
    };

    anonToggle.checked = false;
    wordsToggle.checked = false;
    wordSection.hidden = true;
    syncAnonUI();
    if (wordFilterPill) wordFilterPill.hidden = true;
    if (wordSearch) wordSearch.value = '';
    syncStripTabs('timeline');
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

    if (sendersBar) {
      sendersBar.hidden = result.senders.length < 2;
      if (raceStatus) raceStatus.textContent = 'click a sender to see their stats';
      if (raceBtn) raceBtn.textContent = '▶ Play race';
      if (raceResetBtn) raceResetBtn.hidden = true;
      if (raceTrack) raceTrack.hidden = true;
    }

    renderVibes();
    buildSenderRows(result);
    updateAnswerBubble(true);

    drawStrip(1);
    if (!reduceMotion) animateStrip();

    resultSection.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'nearest' });
  }

  /* ---------- answer bubble lenses (6 units) + receipts ---------- */

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
    if (index === 4) {
      const w = wordsFor(current.anon, false);
      const pages = w.totalWords / 250;
      const display = pages >= 10
        ? numberFmt.format(Math.round(pages))
        : Math.max(0.1, pages).toFixed(1);
      return { value: display, display, unit: pages >= 1.5 || pages < 0.95 ? 'paperback pages' : 'paperback page', animate: false };
    }
    if (index === 5) {
      const cm = result.total * 1.15;
      if (cm < 100) {
        return { value: Math.round(cm), display: numberFmt.format(Math.round(cm)), unit: 'cm scrolled', animate: false };
      }
      const m = cm / 100;
      if (m >= 1000) {
        const km = (m / 1000).toFixed(2);
        return { value: km, display: km, unit: 'km scrolled', animate: false };
      }
      const mStr = m >= 100 ? numberFmt.format(Math.round(m)) : m.toFixed(1);
      return { value: mStr, display: mStr, unit: 'm scrolled', animate: false };
    }
    return { value: result.total, display: numberFmt.format(result.total), unit: result.total === 1 ? 'message' : 'messages', animate: true };
  }

  function updateAnswerBubble(animateInitial) {
    const data = lensData(current.lensIndex);
    if (answerUnit) answerUnit.textContent = data.unit;
    if (answerDots) {
      answerDots.textContent = '';
      for (let i = 0; i < LENS_COUNT; i++) {
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

  /* ---------- clickable chat vibe superlatives ---------- */

  function renderVibes() {
    if (!vibeList || !current) return;
    const { insights } = current;
    const items = [];

    if (insights.peakHour) {
      const owl = insights.peakHour.hour >= 22 || insights.peakHour.hour <= 4 ? '🦉' : '⏰';
      items.push({
        id: 'peakHour',
        prefix: `${owl} peak`,
        value: formatHour(insights.peakHour.hour),
        title: 'Toggle 24h clock highlight on peak hour',
        onClick: () => {
          if (current.activeVibe === 'peakHour') {
            current.activeVibe = null;
            current.hoverIndex = null;
            syncVibeActive();
            if (current.stripMode === 'clock') setStripMode('timeline');
            else drawStrip(1);
            return;
          }
          clearSpotlight();
          current.activeVibe = 'peakHour';
          setStripMode('clock');
          current.hoverIndex = insights.peakHour.hour;
          drawStrip(1);
          syncVibeActive();
        },
      });
    }
    if (insights.peakDay && insights.peakDayRange) {
      items.push({
        id: 'peakDay',
        prefix: '🔥 busiest day',
        value: `${insights.peakDay.label} (${numberFmt.format(insights.peakDay.count)})`,
        title: 'Toggle busiest day highlight on the strip',
        onClick: () => {
          if (current.activeVibe === 'peakDay') {
            clearSpotlight();
            return;
          }
          current.activeVibe = 'peakDay';
          setSpotlightRange(
            `🔥 ${insights.peakDay.label}`,
            insights.peakDayRange.firstIdx,
            insights.peakDayRange.lastIdx
          );
          syncVibeActive();
        },
      });
    }
    if (insights.longestStreak && insights.streakRange) {
      items.push({
        id: 'streak',
        prefix: '💬 streak',
        value: `${labelFor(insights.longestStreak.sender)} ×${numberFmt.format(insights.longestStreak.count)}`,
        title: 'Toggle streak highlight on the strip',
        onClick: () => {
          if (current.activeVibe === 'streak') {
            clearSpotlight();
            return;
          }
          current.activeVibe = 'streak';
          setSpotlightRange(
            `💬 ${labelFor(insights.longestStreak.sender)} ×${insights.longestStreak.count}`,
            insights.streakRange.startIdx,
            insights.streakRange.endIdx
          );
          syncVibeActive();
        },
      });
    }
    if (insights.longestSilence && insights.longestSilence.ms >= 6 * 3600000) {
      const ls = insights.longestSilence;
      items.push({
        id: 'silence',
        prefix: '🌵 silence broken',
        value: `${formatDuration(ls.ms)} by ${labelFor(ls.breaker)}`,
        title: 'Peek at the message that broke the longest silence',
        onClick: () => {
          openPeek(ls.endIdx, `Silence broken after ${formatDuration(ls.ms)}`);
        },
      });
    }
    if (insights.fastestReplier && current.result.senders.length >= 2) {
      items.push({
        id: 'fastest',
        prefix: '⚡ fastest',
        value: `${labelFor(insights.fastestReplier.sender)} (${formatDuration(insights.fastestReplier.medianMs)})`,
        title: 'Toggle fastest replier highlight and stats',
        onClick: () => {
          const closing = current.activeVibe === 'fastest' && current.openDossier === insights.fastestReplier.sender;
          toggleSenderDossier(insights.fastestReplier.sender, !closing);
          current.activeVibe = closing ? null : 'fastest';
          syncVibeActive();
        },
      });
    } else if (insights.novelist && current.result.senders.length >= 2) {
      items.push({
        id: 'novelist',
        prefix: '✍️ novelist',
        value: `${labelFor(insights.novelist.sender)} (${insights.novelist.avgChars} ch/msg)`,
        title: 'Toggle novelist highlight and stats',
        onClick: () => {
          const closing = current.activeVibe === 'novelist' && current.openDossier === insights.novelist.sender;
          toggleSenderDossier(insights.novelist.sender, !closing);
          current.activeVibe = closing ? null : 'novelist';
          syncVibeActive();
        },
      });
    }

    vibeList.textContent = '';
    vibeList.hidden = items.length === 0;
    for (const item of items.slice(0, 5)) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'vibe-chip';
      btn.dataset.vibe = item.id;
      btn.title = item.title;
      if (current.activeVibe === item.id) btn.classList.add('active');
      btn.append(item.prefix + ' ');
      const strong = document.createElement('strong');
      strong.textContent = item.value;
      btn.appendChild(strong);
      btn.addEventListener('click', item.onClick);
      vibeList.appendChild(btn);
    }
  }

  function syncVibeActive() {
    if (!vibeList || !current) return;
    for (const btn of vibeList.children) {
      btn.classList.toggle('active', btn.dataset.vibe === current.activeVibe);
    }
  }

  /* ---------- sender rows + inline dossier + chat race ---------- */

  function toggleSenderDossier(sender, forceOpen) {
    if (!current) return;
    if (current.race && current.race.active) stopRace(true);
    const next = forceOpen ? sender : (current.openDossier === sender ? null : sender);
    current.openDossier = next;
    current.highlightSender = next;
    if (!next && (current.activeVibe === 'fastest' || current.activeVibe === 'novelist')) {
      current.activeVibe = null;
      syncVibeActive();
    }
    buildSenderRows(current.result);
    drawStrip(1);
    if (next) {
      const row = sendersEl.querySelector(`.sender[data-sender="${CSS.escape(next)}"]`);
      if (row) row.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'nearest' });
    }
  }

  function buildSenderRows(result, raceFrame) {
    sendersEl.textContent = '';
    let list;
    let totalForBar;

    if (raceFrame) {
      list = result.senders
        .map((s) => ({ sender: s.sender, count: raceFrame.counts.get(s.sender) || 0 }))
        .sort((a, b) => b.count - a.count || a.sender.localeCompare(b.sender));
      totalForBar = Math.max(1, list[0] ? list[0].count : 1);
    } else {
      list = result.senders;
      totalForBar = Math.max(1, result.total);
    }

    for (const s of list) {
      const li = document.createElement('li');
      li.className = 'sender';
      li.dataset.sender = s.sender;
      const isOpen = !raceFrame && current.openDossier === s.sender;
      if (current.highlightSender === s.sender) li.classList.add('active');
      if (isOpen) li.classList.add('open');

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
      const pct = raceFrame ? (s.count / totalForBar) * 100 : (s.count / totalForBar) * 100;
      fill.style.width = pct.toFixed(2) + '%';
      fill.style.background = current.colors.get(s.sender);
      bar.appendChild(fill);

      li.append(chip, nameEl, count, bar);

      if (!raceFrame) {
        li.addEventListener('mouseenter', () => {
          if (!current.openDossier) highlight(s.sender);
        });
        li.addEventListener('mouseleave', () => {
          if (!current.openDossier) highlight(null);
        });
        li.addEventListener('click', (e) => {
          if (e.target.closest('.dossier')) return;
          toggleSenderDossier(s.sender);
        });

        if (isOpen) {
          li.appendChild(buildDossierEl(s.sender));
        }
      }

      sendersEl.appendChild(li);
    }
  }

  function buildDossierEl(sender) {
    const box = document.createElement('div');
    box.className = 'dossier';
    const st = (current.insights.senderStats && current.insights.senderStats[sender]) || null;
    const w = wordsFor(current.anon, true);
    const ws = w.senders.find((x) => x.sender === sender) || null;

    // Award badges
    if (st && st.badges && st.badges.length) {
      const badges = document.createElement('div');
      badges.className = 'dossier-badges';
      for (const b of st.badges) {
        const pill = document.createElement('span');
        pill.className = 'dossier-badge';
        pill.append(`${b.icon} ${b.title}`);
        const sm = document.createElement('small');
        sm.textContent = b.detail;
        pill.appendChild(sm);
        badges.appendChild(pill);
      }
      box.appendChild(badges);
    }

    // Stats grid
    const grid = document.createElement('div');
    grid.className = 'dossier-stats';
    const addStat = (val, lbl, onClick) => {
      const cell = document.createElement('div');
      cell.className = 'dossier-stat';
      if (onClick) {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'dossier-phrase-btn';
        btn.textContent = val;
        btn.title = 'Click to spotlight this word on the strip';
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          onClick();
        });
        cell.appendChild(btn);
      } else {
        const strong = document.createElement('strong');
        strong.textContent = val;
        cell.appendChild(strong);
      }
      const sp = document.createElement('span');
      sp.textContent = lbl;
      cell.appendChild(sp);
      grid.appendChild(cell);
    };

    if (st) {
      if (st.medianReplyMs !== null) addStat(formatDuration(st.medianReplyMs), 'median reply');
      addStat(`${numberFmt.format(st.avgChars)} ch`, 'avg length');
      addStat(`${st.avgBurst}× (max ${st.maxBurst})`, 'msgs per turn');
      if (current.result.senders.length >= 2) {
        addStat(`${st.starts} / ${st.lastWords}`, 'starts / last word');
      }
      if (st.nightMsgs) addStat(`${st.nightPct}%`, 'after midnight');
      if (st.questions) addStat(numberFmt.format(st.questions), 'questions asked');
    }

    if (ws && ws.catchphrase) {
      addStat(`“${ws.catchphrase.word}”`, `catchphrase (${ws.catchphrase.share}% theirs)`, () => {
        setSpotlightWord(ws.catchphrase.word);
      });
    } else if (ws && ws.signature) {
      addStat(`“${ws.signature}”`, 'top word', () => {
        setSpotlightWord(ws.signature);
      });
    }
    if (ws && ws.favEmoji) {
      addStat(`${ws.favEmoji.emoji} ×${numberFmt.format(ws.favEmoji.count)}`, 'fav emoji');
    }

    box.appendChild(grid);
    return box;
  }

  function highlight(sender) {
    if (!current) return;
    current.highlightSender = sender;
    for (const li of sendersEl.children) {
      li.classList.toggle('active', li.dataset.sender === sender);
    }
    drawStrip(1);
  }

  /* ---------- chat race (time-lapse sender replay) ---------- */

  function buildRaceFrames() {
    const msgs = current.result.messages;
    const n = msgs.length;
    const targetFrames = Math.min(n, 60);
    const step = n / targetFrames;
    const counts = new Map();
    const frames = [];
    let nextCut = 0;

    for (let i = 0; i < n; i++) {
      const s = msgs[i].sender;
      counts.set(s, (counts.get(s) || 0) + 1);
      if (i + 1 >= Math.round((nextCut + 1) * step) || i === n - 1) {
        frames.push({
          idx: i,
          ts: msgs[i].ts,
          pct: ((i + 1) / n) * 100,
          counts: new Map(counts),
        });
        nextCut++;
      }
    }
    return frames;
  }

  function toggleRace() {
    if (!current || current.result.senders.length < 2) return;
    if (!current.race) {
      current.openDossier = null;
      current.race = {
        frames: buildRaceFrames(),
        frameIdx: 0,
        playing: false,
        active: true,
        lastTick: 0,
      };
    }

    const r = current.race;
    if (r.playing) {
      r.playing = false;
      cancelAnimationFrame(raceRaf);
      if (raceBtn) raceBtn.textContent = '▶ Resume';
      return;
    }

    if (r.frameIdx >= r.frames.length - 1) {
      r.frameIdx = 0;
    }
    r.playing = true;
    r.active = true;
    r.lastTick = performance.now();
    if (raceBtn) raceBtn.textContent = '⏸ Pause';
    if (raceResetBtn) raceResetBtn.hidden = false;
    if (raceTrack) raceTrack.hidden = false;

    const msPerFrame = Math.max(55, Math.min(180, Math.round(5200 / Math.max(1, r.frames.length))));

    function step(now) {
      if (!current || !current.race || !current.race.playing) return;
      if (now - r.lastTick >= msPerFrame) {
        r.lastTick = now;
        const f = r.frames[r.frameIdx];
        if (raceStatus) raceStatus.textContent = `race · ${f.ts} (${numberFmt.format(f.idx + 1)} msgs)`;
        if (raceFill) raceFill.style.width = f.pct.toFixed(1) + '%';
        buildSenderRows(current.result, f);
        if (r.frameIdx >= r.frames.length - 1) {
          r.playing = false;
          if (raceBtn) raceBtn.textContent = '↻ Replay';
          return;
        }
        r.frameIdx++;
      }
      raceRaf = requestAnimationFrame(step);
    }

    // Draw first frame immediately
    const f0 = r.frames[r.frameIdx];
    if (raceStatus) raceStatus.textContent = `race · ${f0.ts}`;
    if (raceFill) raceFill.style.width = f0.pct.toFixed(1) + '%';
    buildSenderRows(current.result, f0);
    raceRaf = requestAnimationFrame(step);
  }

  function stopRace(rerender) {
    cancelAnimationFrame(raceRaf);
    if (current) current.race = null;
    if (raceBtn) raceBtn.textContent = '▶ Play race';
    if (raceResetBtn) raceResetBtn.hidden = true;
    if (raceTrack) raceTrack.hidden = true;
    if (raceFill) raceFill.style.width = '0%';
    if (raceStatus) raceStatus.textContent = 'click a sender to see their stats';
    if (rerender && current) buildSenderRows(current.result);
  }

  /* ---------- word spotlight & range spotlight ---------- */

  function escapeRegExp(s) {
    return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  function clearSpotlight() {
    if (!current) return;
    current.spotlightWord = null;
    current.spotlightRange = null;
    current.activeVibe = null;
    if (wordFilterPill) wordFilterPill.hidden = true;
    if (wordSearch && document.activeElement !== wordSearch) wordSearch.value = '';
    syncWordChipActive();
    syncVibeActive();
    drawStrip(1);
  }

  function setSpotlightRange(label, startIdx, endIdx) {
    if (!current) return;
    current.spotlightWord = null;
    current.spotlightRange = { label, startIdx, endIdx };
    if (wordSearch) wordSearch.value = '';
    if (wordFilterPill) {
      wordFilterPill.textContent = `${label} ×`;
      wordFilterPill.hidden = false;
    }
    if (current.stripMode !== 'timeline') setStripMode('timeline');
    syncWordChipActive();
    drawStrip(1);
  }

  function setSpotlightWord(word, opts) {
    if (!current) return;
    const fromSearch = opts && opts.fromSearch;
    if (!word || (!fromSearch && current.spotlightWord && current.spotlightWord.word.toLowerCase() === word.toLowerCase())) {
      clearSpotlight();
      return;
    }

    current.spotlightRange = null;
    current.activeVibe = null;
    syncVibeActive();

    const msgs = current.result.messages;
    const flags = new Uint8Array(msgs.length);
    let hits = 0;
    const bySender = new Map();

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
          hits++;
          bySender.set(m.sender, (bySender.get(m.sender) || 0) + 1);
        }
      }
    } else {
      const re = new RegExp('(?<![\\p{L}\\p{N}_])' + escapeRegExp(word) + '(?![\\p{L}\\p{N}_])', 'iu');
      for (let i = 0; i < msgs.length; i++) {
        if (!msgs[i].media && re.test(msgs[i].text)) {
          flags[i] = 1;
          hits++;
          bySender.set(msgs[i].sender, (bySender.get(msgs[i].sender) || 0) + 1);
        }
      }
    }

    let topSender = null;
    let topCount = 0;
    for (const [s, c] of bySender) {
      if (c > topCount) { topCount = c; topSender = s; }
    }

    current.spotlightWord = { word, flags, hits, topSender };
    if (wordFilterPill) {
      const who = topSender && current.result.senders.length >= 2 ? ` · mostly ${labelFor(topSender)}` : '';
      wordFilterPill.textContent = hits
        ? `“${word}” ×${numberFmt.format(hits)}${who} ×`
        : `“${word}” · 0 matches ×`;
      wordFilterPill.hidden = false;
    }
    if (!fromSearch && wordSearch) wordSearch.value = word;
    if (current.stripMode !== 'timeline') setStripMode('timeline');

    syncWordChipActive();
    drawStrip(1);
  }

  function syncWordChipActive() {
    if (!wordCloud) return;
    for (const btn of wordCloud.querySelectorAll('.word-chip')) {
      btn.classList.toggle(
        'active',
        Boolean(current && current.spotlightWord && btn.dataset.word.toLowerCase() === current.spotlightWord.word.toLowerCase())
      );
    }
  }

  /* ---------- word games + "Who said it?" mini-game ---------- */

  function renderWords() {
    const skipCommon = stopWordsToggle ? stopWordsToggle.checked : true;
    const w = wordsFor(current.anon, skipCommon);

    wordSection.classList.toggle('empty', !w.totalWords);
    wordSub.textContent = w.totalWords
      ? `${numberFmt.format(w.totalWords)} words across ${numberFmt.format(w.messageCount)} messages` +
        (w.mediaSkipped ? ` (${numberFmt.format(w.mediaSkipped)} media message${w.mediaSkipped === 1 ? '' : 's'} skipped)` : '')
      : 'No text messages in this chat, just media 📷';
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

    // diversity & catchphrases leaderboard
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
      if (s.catchphrase) {
        sigParts.push(`catchphrase “${s.catchphrase.word}” (${s.catchphrase.share}% theirs)`);
      } else if (s.signature) {
        sigParts.push(`signature “${s.signature}” ×${numberFmt.format(s.top[0].count)}`);
      }
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

    // most used words (interactive cloud)
    wordCloud.textContent = '';
    const maxCount = w.top.length ? w.top[0].count : 1;
    for (const t of w.top) {
      const chipEl = document.createElement('button');
      chipEl.type = 'button';
      chipEl.className = 'word-chip';
      chipEl.dataset.word = t.word;
      if (current.spotlightWord && current.spotlightWord.word.toLowerCase() === t.word.toLowerCase()) {
        chipEl.classList.add('active');
      }
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

    // the book bank (compact by default, expandable to all 5)
    const report = WhatsAppWords.bookReport(w.uniqueWords);
    const next = report.books.find((b) => !b.covered);
    if (w.totalWords) {
      if (report.writable) {
        bookNote.textContent = `📚 With ${numberFmt.format(w.uniqueWords)} unique words, this chat covers the vocabulary of ${report.writable.title} by ${report.writable.author}.`;
      } else if (next) {
        bookNote.textContent = `📚 ${numberFmt.format(w.uniqueWords)} unique words: ${Math.floor(next.pct)}% of the vocabulary in ${next.title}.`;
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

  /* ---------- "Who said it?" mini-game ---------- */

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function ensureQuiz() {
    if (!quizBox || !current) return;
    if (current.result.senders.length < 2 || !WhatsAppWords.quizCandidates) {
      quizBox.hidden = true;
      return;
    }
    if (!current.quiz) {
      const pool = shuffle(WhatsAppWords.quizCandidates(current.result.messages));
      if (!pool.length) {
        quizBox.hidden = true;
        return;
      }
      current.quiz = {
        pool,
        cursor: 0,
        correct: 0,
        total: 0,
        streak: 0,
        current: null,
        choices: [],
        picked: null,
      };
      nextQuizQuestion();
    } else {
      renderQuizCurrent();
    }
    quizBox.hidden = false;
  }

  function nextQuizQuestion() {
    if (!current || !current.quiz) return;
    const qz = current.quiz;
    if (qz.cursor >= qz.pool.length) {
      qz.pool = shuffle(qz.pool);
      qz.cursor = 0;
    }
    const item = qz.pool[qz.cursor++];
    const allSenders = current.result.senders.map((s) => s.sender);
    let choices;
    if (allSenders.length <= 4) {
      choices = allSenders;
    } else {
      const others = shuffle(allSenders.filter((s) => s !== item.sender)).slice(0, 3);
      choices = shuffle([item.sender].concat(others));
    }
    qz.current = item;
    qz.choices = choices;
    qz.picked = null;
    renderQuizCurrent();
  }

  function renderQuizCurrent() {
    if (!current || !current.quiz || !current.quiz.current || !quizBox) return;
    const qz = current.quiz;
    const item = qz.current;

    if (quizScore) {
      const streakTxt = qz.streak >= 2 ? `🔥 ${qz.streak} · ` : '';
      quizScore.textContent = `${streakTxt}${qz.correct} / ${qz.total}`;
    }
    if (quizQuote) {
      quizQuote.textContent = `“${textFor(item.text)}”`;
    }
    if (quizMeta) {
      quizMeta.hidden = qz.picked === null;
      quizMeta.textContent = `${labelFor(item.sender)} · ${item.ts}`;
    }

    if (quizChoices) {
      quizChoices.textContent = '';
      for (const sender of qz.choices) {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'quiz-choice';
        const dot = document.createElement('span');
        dot.className = 'chip';
        dot.style.background = current.colors.get(sender);
        btn.append(dot, labelFor(sender));

        if (qz.picked !== null) {
          btn.disabled = true;
          if (sender === item.sender) btn.classList.add('correct');
          else if (sender === qz.picked) btn.classList.add('wrong');
          else btn.classList.add('dim');
        } else {
          btn.addEventListener('click', () => answerQuiz(sender));
        }
        quizChoices.appendChild(btn);
      }
    }

    if (quizFooter && quizFeedback) {
      quizFooter.hidden = qz.picked === null;
      if (qz.picked !== null) {
        const right = qz.picked === item.sender;
        quizFeedback.className = 'quiz-feedback ' + (right ? 'good' : 'miss');
        quizFeedback.textContent = right
          ? 'Spot on!'
          : `Actually ${labelFor(item.sender)}`;
      }
    }
  }

  function answerQuiz(sender) {
    if (!current || !current.quiz || current.quiz.picked !== null) return;
    const qz = current.quiz;
    qz.picked = sender;
    qz.total++;
    if (sender === qz.current.sender) {
      qz.correct++;
      qz.streak++;
    } else {
      qz.streak = 0;
    }
    renderQuizCurrent();
  }

  /* ---------- rhythm strip (timeline + 24h clock + calendar heatmap) ---------- */

  function syncStripTabs(mode) {
    const map = [
      [stripTimelineBtn, 'timeline'],
      [stripClockBtn, 'clock'],
      [stripCalendarBtn, 'calendar'],
    ];
    for (const [btn, m] of map) {
      if (!btn) continue;
      btn.classList.toggle('active', mode === m);
      btn.setAttribute('aria-selected', String(mode === m));
    }
    if (stripHint) {
      if (mode === 'clock') stripHint.textContent = 'hourly activity · hover a bar for counts';
      else if (mode === 'calendar') stripHint.textContent = 'daily activity · click a day to peek';
      else stripHint.textContent = 'hover to scrub · click to peek';
    }
  }

  function setStripMode(mode) {
    if (!current || current.stripMode === mode) return;
    current.stripMode = mode;
    current.hoverIndex = null;
    if (mode !== 'clock' && current.activeVibe === 'peakHour') {
      current.activeVibe = null;
      syncVibeActive();
    }
    hideTooltip();
    syncStripTabs(mode);
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
    } else if (current.stripMode === 'calendar') {
      drawCalendarStrip(ctx, cssW, cssH, progress);
    } else {
      drawTimelineStrip(ctx, cssW, cssH, progress);
    }
  }

  function msgMatchesFilters(idx, msg) {
    if (current.highlightSender && msg.sender !== current.highlightSender) return false;
    if (current.spotlightWord && !current.spotlightWord.flags[idx]) return false;
    if (current.spotlightRange) {
      if (idx < current.spotlightRange.startIdx || idx > current.spotlightRange.endIdx) return false;
    }
    return true;
  }

  function drawTimelineStrip(ctx, cssW, cssH, progress) {
    const { result, colors, highlightSender, spotlightWord, spotlightRange, hoverIndex } = current;
    const msgs = result.messages;
    const n = msgs.length;
    if (!n) return;

    const hasFilter = Boolean(highlightSender || spotlightWord || spotlightRange);
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
        if (hasFilter && !msgMatchesFilters(j, m)) continue;
        if (!best || m.text.length > best.text.length) best = m;
      }
      const dimmed = hasFilter && !best;
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

  function parseDayKeyUTC(dayKey) {
    const [y, m, d] = dayKey.split('-').map(Number);
    return Date.UTC(y, m - 1, d);
  }

  function dayKeyFromUTC(ms) {
    const dt = new Date(ms);
    return dt.getUTCFullYear() + '-' + String(dt.getUTCMonth() + 1).padStart(2, '0') + '-' + String(dt.getUTCDate()).padStart(2, '0');
  }

  function drawCalendarStrip(ctx, cssW, cssH, progress) {
    const { insights, colors, highlightSender, hoverIndex } = current;
    const dayList = insights.dayList || [];
    if (!dayList.length) {
      ctx.fillStyle = '#8696a0';
      ctx.font = '12px "Space Grotesk", system-ui, sans-serif';
      ctx.fillText('No parseable dates found for calendar view.', 8, cssH / 2);
      current.stripLayout = { mode: 'calendar', cells: [] };
      return;
    }

    const dayMap = new Map();
    for (const d of dayList) dayMap.set(d.dayKey, d);

    const firstMs = parseDayKeyUTC(dayList[0].dayKey);
    const lastMs = parseDayKeyUTC(dayList[dayList.length - 1].dayKey);
    const spanDays = Math.round((lastMs - firstMs) / 86400000) + 1;
    const baseColor = highlightSender ? (colors.get(highlightSender) || '#00a884') : '#00a884';

    const countForDay = (d) => {
      if (!d) return 0;
      if (highlightSender && d.senders) return d.senders.get(highlightSender) || 0;
      return d.count;
    };

    // Short chat (<= 14 days): draw spacious daily tiles so it feels rich and legible
    if (spanDays <= 14) {
      const n = spanDays;
      const gap = 6;
      const labelH = 16;
      const slot = cssW / n;
      const tileW = Math.max(12, slot - gap);
      const tileH = Math.max(24, cssH - labelH - 4);
      let maxC = 1;
      const cells = [];

      for (let i = 0; i < n; i++) {
        const ms = firstMs + i * 86400000;
        const key = dayKeyFromUTC(ms);
        const dt = new Date(ms);
        const info = dayMap.get(key) || null;
        const count = countForDay(info);
        if (count > maxC) maxC = count;
        cells.push({
          x: i * slot + gap / 2,
          y: 2,
          w: tileW,
          h: tileH,
          dayKey: key,
          label: info ? info.label : `${dt.getUTCDate()} ${MONTH_SHORT[dt.getUTCMonth()]} ${dt.getUTCFullYear()}`,
          shortLabel: `${DAY_SHORT[dt.getUTCDay()]} ${dt.getUTCDate()}`,
          count,
          info,
        });
      }

      const visible = Math.max(1, Math.ceil(cells.length * progress));
      for (let i = 0; i < visible; i++) {
        const c = cells[i];
        const intensity = c.count ? 0.22 + 0.78 * (c.count / maxC) : 0;
        ctx.fillStyle = c.count ? hexToRgba(baseColor, intensity) : '#162229';
        ctx.beginPath();
        ctx.roundRect(c.x, c.y, c.w, c.h, 8);
        ctx.fill();

        if (hoverIndex === i) {
          ctx.strokeStyle = '#e9edef';
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }

        if (c.count && c.w >= 26) {
          ctx.fillStyle = intensity > 0.55 ? '#06231c' : '#e9edef';
          ctx.font = '600 12px "Space Grotesk", system-ui, sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(numberFmt.format(c.count), c.x + c.w / 2, c.y + c.h / 2 + 4);
        }

        ctx.fillStyle = '#8696a0';
        ctx.font = '10px "Space Grotesk", system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(c.shortLabel, c.x + c.w / 2, cssH - 2);
      }
      ctx.textAlign = 'left';
      current.stripLayout = { mode: 'calendar', cells };
      return;
    }

    // Multi-week GitHub-style heatmap grid (up to last 53 weeks so cells stay crisp)
    const maxDays = 53 * 7;
    const rawStartMs = spanDays > maxDays ? lastMs - (maxDays - 1) * 86400000 : firstMs;
    const startDow = new Date(rawStartMs).getUTCDay();
    const gridStartMs = rawStartMs - startDow * 86400000;
    const totalDays = Math.round((lastMs - gridStartMs) / 86400000) + 1;
    const weeks = Math.ceil(totalDays / 7);

    const labelH = 13;
    const availH = Math.max(28, cssH - labelH - 2);
    const cellGap = weeks > 36 ? 1.5 : 2.5;
    const cellSize = Math.max(3, Math.min((availH - cellGap * 6) / 7, (cssW - cellGap * (weeks - 1)) / weeks));
    const gridW = weeks * cellSize + (weeks - 1) * cellGap;
    const offsetX = Math.max(0, (cssW - gridW) / 2);
    const offsetY = Math.max(0, (availH - (7 * cellSize + 6 * cellGap)) / 2);

    let maxC = 1;
    const cells = [];
    for (let i = 0; i < totalDays; i++) {
      const ms = gridStartMs + i * 86400000;
      const key = dayKeyFromUTC(ms);
      const info = dayMap.get(key) || null;
      const count = countForDay(info);
      if (count > maxC) maxC = count;
      const w = Math.floor(i / 7);
      const dow = i % 7;
      const dt = new Date(ms);
      cells.push({
        x: offsetX + w * (cellSize + cellGap),
        y: offsetY + dow * (cellSize + cellGap),
        w: cellSize,
        h: cellSize,
        dayKey: key,
        month: dt.getUTCMonth(),
        day: dt.getUTCDate(),
        label: info ? info.label : `${dt.getUTCDate()} ${MONTH_SHORT[dt.getUTCMonth()]} ${dt.getUTCFullYear()}`,
        count,
        info,
        week: w,
      });
    }

    const visibleWeeks = Math.max(1, Math.ceil(weeks * progress));
    for (let i = 0; i < cells.length; i++) {
      const c = cells[i];
      if (c.week >= visibleWeeks) continue;
      const ratio = c.count ? Math.sqrt(c.count / maxC) : 0;
      ctx.fillStyle = c.count ? hexToRgba(baseColor, 0.22 + 0.78 * ratio) : '#162229';
      if (cellSize >= 6) {
        ctx.beginPath();
        ctx.roundRect(c.x, c.y, c.w, c.h, 2);
        ctx.fill();
      } else {
        ctx.fillRect(c.x, c.y, c.w, c.h);
      }
      if (hoverIndex === i) {
        ctx.strokeStyle = '#e9edef';
        ctx.lineWidth = 1.2;
        ctx.strokeRect(c.x - 0.5, c.y - 0.5, c.w + 1, c.h + 1);
      }
    }

    // Month labels along bottom (anchored to the actual start month and each month boundary)
    ctx.fillStyle = '#8696a0';
    ctx.font = '10px "Space Grotesk", system-ui, sans-serif';
    ctx.textAlign = 'left';
    let lastMonth = -1;
    let lastLabelX = -999;
    for (let w = 0; w < weeks; w++) {
      const weekEndCell = cells[Math.min(cells.length - 1, w * 7 + 6)];
      const anchor = w === 0 ? weekEndCell : cells[w * 7];
      if (!anchor) continue;
      const m = weekEndCell ? weekEndCell.month : anchor.month;
      if (m !== lastMonth) {
        lastMonth = m;
        if (anchor.x - lastLabelX >= 24) {
          ctx.fillText(MONTH_SHORT[m], anchor.x, cssH - 2);
          lastLabelX = anchor.x;
        }
      }
    }

    current.stripLayout = { mode: 'calendar', cells };
  }

  function animateStrip() {
    const duration = 560;
    const start = performance.now();
    function frame(now) {
      const t = Math.min(1, (now - start) / duration);
      drawStrip(t * t * (3 - 2 * t));
      if (t < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  /* ---------- strip hover / scrub tooltip & click-to-peek ---------- */

  function hideTooltip() {
    if (stripTooltip) stripTooltip.hidden = true;
    if (current && current.hoverIndex !== null) {
      current.hoverIndex = null;
      drawStrip(1);
    }
  }

  function pickTimelineBest(b) {
    const layout = current.stripLayout;
    const start = b * layout.bucketSize;
    const end = Math.min(start + layout.bucketSize, layout.n);
    const hasFilter = Boolean(current.highlightSender || current.spotlightWord || current.spotlightRange);
    let bestIdx = start;
    let best = null;
    for (let j = start; j < end; j++) {
      const m = current.result.messages[j];
      if (hasFilter && !msgMatchesFilters(j, m)) continue;
      if (!best || m.text.length >= best.text.length) {
        best = m;
        bestIdx = j;
      }
    }
    if (!best) {
      best = current.result.messages[start];
      bestIdx = start;
    }
    return { best, bestIdx, bucketCount: end - start };
  }

  function findCalendarCell(x, y) {
    const cells = current.stripLayout && current.stripLayout.cells;
    if (!cells || !cells.length) return -1;
    for (let i = 0; i < cells.length; i++) {
      const c = cells[i];
      if (x >= c.x - 2 && x <= c.x + c.w + 2 && y >= c.y - 2 && y <= c.y + c.h + 2) {
        return i;
      }
    }
    return -1;
  }

  function updateTooltip(clientX, clientY) {
    if (!current || !current.stripLayout || !stripTooltip) return;
    const rect = strip.getBoundingClientRect();
    const x = Math.max(0, Math.min(rect.width - 0.01, clientX - rect.left));
    const y = Math.max(0, Math.min(rect.height - 0.01, clientY - rect.top));
    const layout = current.stripLayout;

    if (layout.mode === 'timeline') {
      const b = Math.min(layout.buckets - 1, Math.floor(x / layout.slot));
      if (b < 0) return;
      if (current.hoverIndex !== b) {
        current.hoverIndex = b;
        drawStrip(1);
      }
      const { best, bucketCount } = pickTimelineBest(b);
      const bodyTxt = best.media
        ? 'media message'
        : textFor(best.text).replace(/\s+/g, ' ');
      const snippet = bodyTxt.slice(0, 46) + (bodyTxt.length > 46 ? '…' : '');
      renderTooltipContent(
        current.colors.get(best.sender),
        labelFor(best.sender),
        best.ts + (bucketCount > 1 ? ` · ${bucketCount} msgs` : ''),
        snippet,
        x,
        rect.width
      );
    } else if (layout.mode === 'clock') {
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
    } else if (layout.mode === 'calendar') {
      const idx = findCalendarCell(x, y);
      if (idx < 0) {
        hideTooltip();
        return;
      }
      if (current.hoverIndex !== idx) {
        current.hoverIndex = idx;
        drawStrip(1);
      }
      const c = layout.cells[idx];
      const topS = c.info && c.info.topSender ? c.info.topSender : null;
      const color = current.highlightSender
        ? current.colors.get(current.highlightSender)
        : (topS ? current.colors.get(topS) : '#8696a0');
      const body = c.count
        ? `${numberFmt.format(c.count)} message${c.count === 1 ? '' : 's'}` +
          (!current.highlightSender && topS ? ` · mostly ${labelFor(topS)}` : '') +
          ' · click to peek'
        : 'quiet day';
      renderTooltipContent(color, c.label, '', body, c.x + c.w / 2, rect.width);
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

    const pad = Math.min(115, width / 2);
    const clampedX = Math.max(pad, Math.min(width - pad, anchorX));
    stripTooltip.style.left = clampedX + 'px';
  }

  strip.addEventListener('pointermove', (e) => updateTooltip(e.clientX, e.clientY));
  strip.addEventListener('pointerleave', hideTooltip);
  strip.addEventListener('click', (e) => {
    if (!current || !current.stripLayout) return;
    const rect = strip.getBoundingClientRect();
    const x = Math.max(0, Math.min(rect.width - 0.01, e.clientX - rect.left));
    const y = Math.max(0, Math.min(rect.height - 0.01, e.clientY - rect.top));
    const layout = current.stripLayout;

    if (layout.mode === 'timeline') {
      const b = Math.min(layout.buckets - 1, Math.floor(x / layout.slot));
      if (b < 0) return;
      const { bestIdx } = pickTimelineBest(b);
      const label = current.spotlightWord
        ? `Spotlight: “${current.spotlightWord.word}”`
        : current.spotlightRange
          ? current.spotlightRange.label
          : 'Moment peek';
      openPeek(bestIdx, label);
    } else if (layout.mode === 'calendar') {
      const idx = findCalendarCell(x, y);
      if (idx < 0) return;
      const c = layout.cells[idx];
      if (!c.info) return;
      let targetIdx = c.info.firstIdx;
      if (current.highlightSender) {
        for (let i = c.info.firstIdx; i <= c.info.lastIdx; i++) {
          if (current.result.messages[i].sender === current.highlightSender) {
            targetIdx = i;
            break;
          }
        }
      }
      openPeek(targetIdx, `Day peek · ${c.label}`);
    }
  });

  /* ---------- Moment Peek (Time Capsule modal) ---------- */

  function openRandomPeek() {
    if (!current || !current.result.messages.length) return;
    const msgs = current.result.messages;
    let pick = Math.floor(Math.random() * msgs.length);
    for (let tries = 0; tries < 12; tries++) {
      const idx = Math.floor(Math.random() * msgs.length);
      if (!msgs[idx].media && msgs[idx].text.trim().length >= 8) {
        pick = idx;
        break;
      }
    }
    openPeek(pick, '🎲 Random memory');
  }

  function openPeek(index, title) {
    if (!current || !peekModal) return;
    const clamped = Math.max(0, Math.min(current.result.messages.length - 1, index));
    current.peek = { index: clamped, title: title || 'Moment peek' };
    renderPeekWindow();
    peekModal.hidden = false;
    if (peekCloseBtn) peekCloseBtn.focus();
  }

  function closePeek() {
    if (peekModal) peekModal.hidden = true;
    if (current) current.peek = null;
  }

  function renderPeekWindow() {
    if (!current || !current.peek || !peekMessages) return;
    const msgs = current.result.messages;
    const idx = current.peek.index;
    const start = Math.max(0, idx - 2);
    const end = Math.min(msgs.length - 1, idx + 2);
    const rightSender = current.result.senders[0] ? current.result.senders[0].sender : null;

    if (peekTitle) peekTitle.textContent = current.peek.title;
    if (peekSub) peekSub.textContent = `message #${numberFmt.format(idx + 1)} of ${numberFmt.format(msgs.length)} · ${msgs[idx].ts}`;
    if (peekPrevBtn) peekPrevBtn.disabled = start === 0;
    if (peekNextBtn) peekNextBtn.disabled = end === msgs.length - 1;

    peekMessages.textContent = '';
    const ls = current.insights.longestSilence;

    for (let i = start; i <= end; i++) {
      const m = msgs[i];
      if (ls && i === ls.endIdx && i > start) {
        const gapEl = document.createElement('div');
        gapEl.className = 'peek-gap';
        gapEl.textContent = `🌵 ${formatDuration(ls.ms)} of silence`;
        peekMessages.appendChild(gapEl);
      }

      const row = document.createElement('div');
      const isRight = m.sender === rightSender;
      row.className = 'peek-msg ' + (isRight ? 'out' : 'in') + (i === idx ? ' target' : '');

      const senderEl = document.createElement('span');
      senderEl.className = 'peek-sender';
      senderEl.style.color = isRight ? '#a7f3d0' : (current.colors.get(m.sender) || '#53bdeb');
      senderEl.textContent = labelFor(m.sender);

      const textEl = document.createElement('span');
      textEl.textContent = m.media ? '📎 Media message' : textFor(m.text);

      const tsEl = document.createElement('span');
      tsEl.className = 'peek-ts';
      tsEl.textContent = m.ts;

      row.append(senderEl, textEl, tsEl);
      peekMessages.appendChild(row);
    }
  }

  /* ---------- Chat Wrapped (6-slide tappable Story Mode) ---------- */

  function openWrapped() {
    if (!current || !wrappedModal) return;
    current.wrappedIndex = 0;
    renderWrappedSlide();
    wrappedModal.hidden = false;
    if (wrappedNextBtn) wrappedNextBtn.focus();
  }

  function closeWrapped() {
    if (wrappedModal) wrappedModal.hidden = true;
  }

  function stepWrapped(delta) {
    if (!current) return;
    const next = current.wrappedIndex + delta;
    if (next < 0) return;
    if (next >= WRAPPED_SLIDES) {
      closeWrapped();
      return;
    }
    current.wrappedIndex = next;
    renderWrappedSlide();
  }

  function renderWrappedSlide() {
    if (!current || !wrappedSlide) return;
    const idx = current.wrappedIndex;
    const { result, insights } = current;
    const w = wordsFor(current.anon, true);
    const wAll = wordsFor(current.anon, false);
    const books = WhatsAppWords.bookReport(wAll.uniqueWords);

    if (wrappedBars) {
      wrappedBars.textContent = '';
      for (let i = 0; i < WRAPPED_SLIDES; i++) {
        const bar = document.createElement('span');
        bar.className = 'wrapped-bar' + (i < idx ? ' done' : i === idx ? ' active' : '');
        bar.appendChild(document.createElement('i'));
        bar.addEventListener('click', () => {
          current.wrappedIndex = i;
          renderWrappedSlide();
        });
        wrappedBars.appendChild(bar);
      }
    }
    if (wrappedCounter) wrappedCounter.textContent = `${idx + 1} / ${WRAPPED_SLIDES}`;
    if (wrappedPrevBtn) wrappedPrevBtn.disabled = idx === 0;
    if (wrappedNextBtn) wrappedNextBtn.textContent = idx === WRAPPED_SLIDES - 1 ? 'Done ✓' : 'Next →';

    wrappedSlide.textContent = '';

    const addKicker = (t) => { const p = document.createElement('p'); p.className = 'w-kicker'; p.textContent = t; wrappedSlide.appendChild(p); };
    const addTitle = (t) => { const h = document.createElement('h2'); h.className = 'w-title'; h.textContent = t; wrappedSlide.appendChild(h); };
    const addSub = (t) => { const p = document.createElement('p'); p.className = 'w-sub'; p.textContent = t; wrappedSlide.appendChild(p); };

    if (idx === 0) {
      // Slide 1: The Big Picture
      addKicker('the big picture');
      addTitle(current.anon ? 'Your anonymized chat' : (current.name || 'This chat').replace(/\.txt$/i, ''));
      if (result.first && result.last) addSub(`from ${result.first} to ${result.last}`);

      const bub = document.createElement('div');
      bub.className = 'w-bubble';
      const num = document.createElement('span');
      num.className = 'w-bubble-num';
      num.textContent = numberFmt.format(result.total);
      const unit = document.createElement('span');
      unit.className = 'w-bubble-unit';
      unit.textContent = result.total === 1 ? 'message exchanged' : 'messages exchanged';
      bub.append(num, unit);
      wrappedSlide.appendChild(bub);

      const grid = document.createElement('div');
      grid.className = 'w-grid';
      const pages = wAll.totalWords / 250;
      const mins = Math.max(1, Math.round((insights.textChars || result.chars) / 200));
      const typingVal = mins >= 60 ? `${(mins / 60).toFixed(1)} hrs` : `${numberFmt.format(mins)} mins`;
      const scrollM = (result.total * 1.15) / 100;
      const cards = [
        [numberFmt.format(wAll.totalWords), 'words written'],
        [pages >= 10 ? numberFmt.format(Math.round(pages)) : Math.max(0.1, pages).toFixed(1), 'paperback pages'],
        [typingVal, 'estimated typing'],
        [scrollM >= 1 ? `${scrollM >= 100 ? numberFmt.format(Math.round(scrollM)) : scrollM.toFixed(1)} m` : `${Math.round(result.total * 1.15)} cm`, 'thumb scroll distance'],
      ];
      for (const [v, l] of cards) {
        const c = document.createElement('div');
        c.className = 'w-card';
        const st = document.createElement('strong');
        st.textContent = v;
        const sp = document.createElement('span');
        sp.textContent = l;
        c.append(st, sp);
        grid.appendChild(c);
      }
      wrappedSlide.appendChild(grid);
    } else if (idx === 1) {
      // Slide 2: Your Rhythm
      addKicker('your rhythm');
      const peakH = insights.peakHour ? formatHour(insights.peakHour.hour) : 'anytime';
      const owl = insights.peakHour && (insights.peakHour.hour >= 22 || insights.peakHour.hour <= 4);
      addTitle(owl ? `Night owls peaking at ${peakH}` : `Most alive around ${peakH}`);
      if (insights.peakDay) {
        addSub(`Busiest day ever was ${insights.peakDay.label} with ${numberFmt.format(insights.peakDay.count)} messages.`);
      }

      // Mini 24h bar chart
      const clock = document.createElement('div');
      clock.className = 'w-clock';
      const maxH = Math.max(1, ...(insights.hours || [1]));
      for (let h = 0; h < 24; h++) {
        const bar = document.createElement('i');
        const val = (insights.hours && insights.hours[h]) || 0;
        bar.style.height = Math.max(5, Math.round((val / maxH) * 100)) + '%';
        if (insights.peakHour && h === insights.peakHour.hour) bar.className = 'peak';
        bar.title = `${formatHour(h)}: ${numberFmt.format(val)} msgs`;
        clock.appendChild(bar);
      }
      wrappedSlide.appendChild(clock);

      const grid = document.createElement('div');
      grid.className = 'w-grid';
      const activeDays = (insights.dayList || []).length;
      const topDowIdx = (insights.weekdays || []).reduce((best, val, i, arr) => (val > arr[best] ? i : best), 0);
      const rhythmCards = [
        [numberFmt.format(activeDays), activeDays === 1 ? 'active day' : 'active days'],
        [DAY_SHORT[topDowIdx] + 's', 'chatty day of week'],
      ];
      if (insights.longestSilence) {
        rhythmCards.push([formatDuration(insights.longestSilence.ms), `longest silence (broken by ${labelFor(insights.longestSilence.breaker)})`]);
      }
      if (insights.longestStreak) {
        rhythmCards.push([`×${numberFmt.format(insights.longestStreak.count)}`, `longest streak (${labelFor(insights.longestStreak.sender)})`]);
      }
      for (const [v, l] of rhythmCards) {
        const c = document.createElement('div');
        c.className = 'w-card';
        const st = document.createElement('strong');
        st.textContent = v;
        const sp = document.createElement('span');
        sp.textContent = l;
        c.append(st, sp);
        grid.appendChild(c);
      }
      wrappedSlide.appendChild(grid);
    } else if (idx === 2) {
      // Slide 3: Cast & Dynamics
      addKicker('the cast');
      const leader = result.senders[0];
      const leadPct = leader ? Math.round((leader.count / result.total) * 100) : 0;
      addTitle(leader ? `${labelFor(leader.sender)} led with ${leadPct}%` : 'The participants');

      const ul = document.createElement('ul');
      ul.className = 'w-list';
      const medals = ['🥇', '🥈', '🥉'];
      result.senders.slice(0, 5).forEach((s, i) => {
        const li = document.createElement('li');
        li.className = 'w-row';
        const m = document.createElement('span');
        m.textContent = i < 3 ? medals[i] : `#${i + 1}`;
        const chip = document.createElement('span');
        chip.className = 'chip';
        chip.style.background = current.colors.get(s.sender);
        const nm = document.createElement('strong');
        nm.textContent = labelFor(s.sender);
        const sm = document.createElement('small');
        sm.textContent = `${numberFmt.format(s.count)} (${Math.round((s.count / result.total) * 100)}%)`;
        li.append(m, chip, nm, sm);
        ul.appendChild(li);
      });
      wrappedSlide.appendChild(ul);

      const dynGrid = document.createElement('div');
      dynGrid.className = 'w-grid';
      if (insights.fastestReplier) {
        const c = document.createElement('div'); c.className = 'w-card';
        c.innerHTML = '';
        const st = document.createElement('strong'); st.textContent = `⚡ ${labelFor(insights.fastestReplier.sender)}`;
        const sp = document.createElement('span'); sp.textContent = `fastest draw (${formatDuration(insights.fastestReplier.medianMs)})`;
        c.append(st, sp); dynGrid.appendChild(c);
      }
      if (insights.slowestReplier) {
        const c = document.createElement('div'); c.className = 'w-card';
        const st = document.createElement('strong'); st.textContent = `🐢 ${labelFor(insights.slowestReplier.sender)}`;
        const sp = document.createElement('span'); sp.textContent = `left on read (${formatDuration(insights.slowestReplier.medianMs)})`;
        c.append(st, sp); dynGrid.appendChild(c);
      }
      if (insights.starter) {
        const c = document.createElement('div'); c.className = 'w-card';
        const st = document.createElement('strong'); st.textContent = `🚀 ${labelFor(insights.starter.sender)}`;
        const sp = document.createElement('span'); sp.textContent = `convo starter (×${insights.starter.count})`;
        c.append(st, sp); dynGrid.appendChild(c);
      }
      if (insights.lastWord) {
        const c = document.createElement('div'); c.className = 'w-card';
        const st = document.createElement('strong'); st.textContent = `🏁 ${labelFor(insights.lastWord.sender)}`;
        const sp = document.createElement('span'); sp.textContent = `always gets last word (×${insights.lastWord.count})`;
        c.append(st, sp); dynGrid.appendChild(c);
      }
      if (dynGrid.children.length) wrappedSlide.appendChild(dynGrid);
    } else if (idx === 3) {
      // Slide 4: Chat Awards
      addKicker('chat awards');
      addTitle(insights.awards && insights.awards.length ? 'And the trophies go to…' : 'Just you in this one');
      if (insights.awards && insights.awards.length) {
        const grid = document.createElement('div');
        grid.className = 'w-grid';
        for (const a of insights.awards.slice(0, 6)) {
          const c = document.createElement('div');
          c.className = 'w-card';
          const st = document.createElement('strong');
          st.textContent = `${a.icon} ${labelFor(a.sender)}`;
          const sp = document.createElement('span');
          sp.textContent = `${a.title} · ${a.detail}`;
          c.append(st, sp);
          grid.appendChild(c);
        }
        wrappedSlide.appendChild(grid);
      } else {
        addSub('Drop a chat with two or more people to unlock head-to-head awards and reply speeds.');
      }
    } else if (idx === 4) {
      // Slide 5: Words & Catchphrases
      addKicker('words & catchphrases');
      addTitle(books.writable
        ? `Vocab big enough for ${books.writable.title}`
        : `${numberFmt.format(wAll.uniqueWords)} unique words`);
      if (w.topEmoji.length) {
        addSub(`Top emojis: ${w.topEmoji.map((e) => `${e.emoji} ×${numberFmt.format(e.count)}`).join('  ')}`);
      }

      const ul = document.createElement('ul');
      ul.className = 'w-list';
      w.senders.slice(0, 5).forEach((s) => {
        const phrase = s.catchphrase ? s.catchphrase.word : s.signature;
        if (!phrase) return;
        const li = document.createElement('li');
        li.className = 'w-row';
        const chip = document.createElement('span');
        chip.className = 'chip';
        chip.style.background = current.colors.get(s.sender);
        const nm = document.createElement('strong');
        nm.textContent = labelFor(s.sender);
        const sm = document.createElement('small');
        sm.textContent = `“${phrase}”` + (s.catchphrase ? ` · ${s.catchphrase.share}% theirs` : '');
        li.append(chip, nm, sm);
        ul.appendChild(li);
      });
      if (ul.children.length) wrappedSlide.appendChild(ul);
    } else {
      // Slide 6: Share the Receipt
      addKicker('save & share');
      addTitle('Drop the receipt back in the chat');
      addSub(current.anon
        ? 'Anonymize is on, so both cards will use Person A, Person B labels.'
        : 'Pick 16:9 for desktop or 9:16 for WhatsApp Status and Stories.');

      const btns = document.createElement('div');
      btns.className = 'w-share-btns';
      const preview = document.createElement('div');
      preview.className = 'w-card-preview';
      preview.hidden = true;

      const bStory = document.createElement('button');
      bStory.type = 'button';
      bStory.className = 'again-btn accent-btn';
      bStory.textContent = 'Save 9:16 Story card (PNG)';
      bStory.addEventListener('click', () => saveCard('story', bStory, preview));

      const bWide = document.createElement('button');
      bWide.type = 'button';
      bWide.className = 'again-btn';
      bWide.textContent = 'Save 16:9 Landscape card (PNG)';
      bWide.addEventListener('click', () => saveCard('wide', bWide, preview));

      btns.append(bStory, bWide);
      wrappedSlide.append(btns, preview);
    }
  }

  /* ---------- shareable PNG receipt cards (16:9 landscape + 9:16 story) ---------- */

  function roundRectPath(ctx, x, y, w, h, r) {
    const rad = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    if (typeof ctx.roundRect === 'function') {
      ctx.roundRect(x, y, w, h, rad);
      return;
    }
    ctx.moveTo(x + rad, y);
    ctx.arcTo(x + w, y, x + w, y + h, rad);
    ctx.arcTo(x + w, y + h, x, y + h, rad);
    ctx.arcTo(x, y + h, x, y, rad);
    ctx.arcTo(x, y, x + w, y, rad);
    ctx.closePath();
  }

  function dataUrlToBlob(dataUrl) {
    const parts = dataUrl.split(',');
    const mime = (parts[0].match(/:(.*?);/) || [])[1] || 'image/png';
    const bin = atob(parts[1]);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return new Blob([bytes], { type: mime });
  }

  function triggerDownload(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.rel = 'noopener';
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 60000);
  }

  function saveCard(format, feedbackBtn, previewEl) {
    if (!current) return;
    const isStory = format === 'story';
    const W = isStory ? 1080 : 1200;
    const H = isStory ? 1920 : 675;
    // Story is already native 1080x1920 Full HD; wide uses 2x for crisp retina output.
    const scale = isStory ? 1 : 2;
    const c = document.createElement('canvas');
    c.width = W * scale;
    c.height = H * scale;
    const ctx = c.getContext('2d');
    if (!ctx) return;
    ctx.scale(scale, scale);

    try {
      if (isStory) {
        drawStoryCard(ctx, W, H);
      } else {
        drawWideCard(ctx, W, H);
      }
    } catch (err) {
      console.error('Card render failed:', err);
      return;
    }

    const base = current.anon ? 'anonymized-chat' : (current.name || 'whatsapp-chat').replace(/\.txt$/i, '');
    const filename = base + (isStory ? '-story.png' : '-card.png');

    // Synchronous encoding keeps Safari / mobile user-gesture activation intact.
    const dataUrl = c.toDataURL('image/png');
    const blob = dataUrlToBlob(dataUrl);

    if (previewEl) {
      previewEl.textContent = '';
      const img = document.createElement('img');
      img.src = dataUrl;
      img.alt = isStory ? '9:16 Story card preview' : '16:9 Landscape card preview';
      const tip = document.createElement('span');
      tip.textContent = 'Long-press or right-click image to save if download did not start';
      previewEl.append(img, tip);
      previewEl.hidden = false;
    }

    const targetBtn = feedbackBtn || cardBtn;
    const flashBtn = (label) => {
      if (!targetBtn) return;
      const prev = targetBtn.dataset.origLabel || targetBtn.textContent;
      targetBtn.dataset.origLabel = prev;
      targetBtn.textContent = label;
      setTimeout(() => { targetBtn.textContent = prev; }, 1600);
    };

    // On mobile touch browsers with Web Share Level 2, offer the native share/save sheet.
    const isTouch = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
    if (isTouch && typeof File === 'function' && navigator.share && navigator.canShare) {
      try {
        const file = new File([blob], filename, { type: 'image/png' });
        if (navigator.canShare({ files: [file] })) {
          flashBtn('Opening share…');
          navigator.share({ files: [file], title: 'Chat Wrapped' }).then(
            () => flashBtn('Shared!'),
            (err) => {
              if (!err || err.name !== 'AbortError') {
                triggerDownload(blob, filename);
                flashBtn('Saved!');
              }
            }
          );
          return;
        }
      } catch {
        // Fall through to standard download
      }
    }

    triggerDownload(blob, filename);
    flashBtn('Saved!');
  }

  function drawMiniStripOnCard(ctx, sx, sy, sw, sh, maxBuckets) {
    const msgs = current.result.messages;
    if (!msgs.length) return;
    let maxLen = 1;
    for (const m of msgs) maxLen = Math.max(maxLen, m.text.length);
    const maxLog = Math.log(1 + maxLen);
    const bSize = Math.max(1, Math.ceil(msgs.length / maxBuckets));
    const buckets = Math.ceil(msgs.length / bSize);
    const slot = sw / buckets;
    for (let b = 0; b < buckets; b++) {
      const sIdx = b * bSize;
      if (sIdx >= msgs.length) break;
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

  function drawDoubleTicks(ctx, tx, ty, lineWidth) {
    ctx.strokeStyle = '#53bdeb';
    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(tx, ty + 8); ctx.lineTo(tx + 5, ty + 13); ctx.lineTo(tx + 14, ty + 3);
    ctx.moveTo(tx + 11, ty + 8); ctx.lineTo(tx + 16, ty + 13); ctx.lineTo(tx + 25, ty + 3);
    ctx.stroke();
  }

  function drawWideCard(ctx, W, H) {
    ctx.fillStyle = '#0b141a';
    ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = '#2a3942';
    ctx.lineWidth = 2;
    roundRectPath(ctx, 24, 24, W - 48, H - 48, 28);
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
    roundRectPath(ctx, bx, by, bw, bh, 26);
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
    drawDoubleTicks(ctx, bx + bw - 56, by + bh - 42, 3);

    // Vibe line under bubble
    const vibeStrings = Array.from(vibeList ? vibeList.children : []).map((el) => el.textContent);
    if (vibeStrings.length) {
      ctx.fillStyle = '#8696a0';
      ctx.font = '400 17px "Space Grotesk", system-ui, sans-serif';
      vibeStrings.slice(0, 3).forEach((vs, idx) => {
        ctx.fillText(vs.slice(0, 44), 60, 462 + idx * 32);
      });
    }

    // Right side: mini rhythm strip
    const sx = 555, sy = 165, sw = 585, sh = 96;
    drawMiniStripOnCard(ctx, sx, sy, sw, sh, 190);

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
  }

  function drawStoryCard(ctx, W, H) {
    // Vertical 9:16 WhatsApp Status / Story card (1080 × 1920)
    ctx.fillStyle = '#0b141a';
    ctx.fillRect(0, 0, W, H);

    // Subtle top-right emerald glow
    const grad = ctx.createRadialGradient(W * 0.85, H * 0.08, 40, W * 0.85, H * 0.08, 620);
    grad.addColorStop(0, 'rgba(0, 168, 132, 0.22)');
    grad.addColorStop(1, 'rgba(0, 168, 132, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    // Outer hairline frame
    ctx.strokeStyle = '#2a3942';
    ctx.lineWidth = 3;
    roundRectPath(ctx, 42, 42, W - 84, H - 84, 44);
    ctx.stroke();

    // Header
    ctx.fillStyle = '#00a884';
    ctx.beginPath();
    ctx.arc(104, 120, 9, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#e9edef';
    ctx.font = '600 28px "Space Grotesk", system-ui, sans-serif';
    ctx.fillText('chat wrapped', 128, 130);

    const titleText = current.anon ? 'Anonymized chat' : (current.name || 'WhatsApp chat').replace(/\.txt$/i, '');
    ctx.fillStyle = '#8696a0';
    ctx.font = '400 24px "Space Grotesk", system-ui, sans-serif';
    ctx.fillText(titleText.slice(0, 42), 92, 184);
    if (current.result.first && current.result.last) {
      ctx.fillText(`from ${current.result.first} to ${current.result.last}`, 92, 222);
    }

    // Hero bubble
    const bx = 92, by = 285, bw = W - 184, bh = 320;
    ctx.fillStyle = '#005c4b';
    roundRectPath(ctx, bx, by, bw, bh, 36);
    ctx.fill();

    ctx.fillStyle = '#e9edef';
    const numStr = numberFmt.format(current.result.total);
    const numSize = numStr.length > 7 ? 112 : numStr.length > 5 ? 140 : 168;
    ctx.font = `700 ${numSize}px "Space Grotesk", system-ui, sans-serif`;
    ctx.fillText(numStr, bx + 48, by + 195);

    ctx.fillStyle = 'rgba(233, 237, 239, 0.85)';
    ctx.font = '400 32px "Space Grotesk", system-ui, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(current.result.total === 1 ? 'message' : 'messages', bx + bw - 92, by + bh - 38);
    ctx.textAlign = 'left';
    drawDoubleTicks(ctx, bx + bw - 74, by + bh - 56, 4);

    // Rhythm strip
    drawMiniStripOnCard(ctx, 92, 660, W - 184, 150, 200);

    // Top 5 senders
    ctx.fillStyle = '#8696a0';
    ctx.font = '500 22px "Space Grotesk", system-ui, sans-serif';
    ctx.fillText('top participants', 92, 875);

    const topSenders = current.result.senders.slice(0, 5);
    topSenders.forEach((s, idx) => {
      const y = 935 + idx * 78;
      const color = current.colors.get(s.sender) || '#00a884';
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(102, y - 8, 8, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#e9edef';
      ctx.font = '500 28px "Space Grotesk", system-ui, sans-serif';
      ctx.fillText(labelFor(s.sender).slice(0, 26), 128, y);

      ctx.fillStyle = '#8696a0';
      ctx.textAlign = 'right';
      ctx.fillText(`${numberFmt.format(s.count)} (${Math.round((s.count / current.result.total) * 100)}%)`, W - 92, y);
      ctx.textAlign = 'left';

      ctx.fillStyle = '#1b252c';
      ctx.fillRect(92, y + 18, W - 184, 8);
      ctx.fillStyle = color;
      ctx.fillRect(92, y + 18, (W - 184) * (s.count / current.result.total), 8);
    });

    // Highlights / Awards cards (2x2 grid)
    const wAll = wordsFor(current.anon, false);
    const books = WhatsAppWords.bookReport(wAll.uniqueWords);
    const cards = [];
    if (current.insights.peakHour) {
      cards.push(['peak hour', formatHour(current.insights.peakHour.hour)]);
    }
    if (current.insights.peakDay) {
      cards.push(['busiest day', `${current.insights.peakDay.label}`]);
    }
    if (current.insights.awards && current.insights.awards.length) {
      for (const a of current.insights.awards.slice(0, 2)) {
        cards.push([`${a.icon} ${a.title.toLowerCase()}`, labelFor(a.sender)]);
      }
    }
    if (cards.length < 4 && books.writable) {
      cards.push(['📚 word bank', books.writable.title]);
    }
    if (cards.length < 4) {
      cards.push(['unique words', numberFmt.format(wAll.uniqueWords)]);
    }

    const gy = 1380;
    const gw = (W - 184 - 24) / 2;
    const gh = 152;
    cards.slice(0, 4).forEach(([lbl, val], idx) => {
      const col = idx % 2;
      const row = Math.floor(idx / 2);
      const cx = 92 + col * (gw + 24);
      const cy = gy + row * (gh + 24);
      ctx.fillStyle = '#111b21';
      ctx.strokeStyle = '#2a3942';
      ctx.lineWidth = 2;
      roundRectPath(ctx, cx, cy, gw, gh, 24);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#8696a0';
      ctx.font = '400 22px "Space Grotesk", system-ui, sans-serif';
      ctx.fillText(lbl.slice(0, 24), cx + 28, cy + 52);

      ctx.fillStyle = '#e9edef';
      ctx.font = '700 32px "Space Grotesk", system-ui, sans-serif';
      ctx.fillText(val.slice(0, 20), cx + 28, cy + 108);
    });

    // Footer
    ctx.fillStyle = '#8696a0';
    ctx.font = '400 22px "Space Grotesk", system-ui, sans-serif';
    ctx.fillText('counted locally in your browser · whatsapp message counter', 92, H - 96);
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
