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
  const yearFilter = $('yearFilter');
  const dropOverlay = $('dropOverlay');
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
  const wordDuelBar = $('wordDuelBar');
  const memoryBtn = $('memoryBtn');
  const stripHint = $('stripHint');
  const stripTooltip = $('stripTooltip');
  const sendersBar = $('sendersBar');
  const raceStatus = $('raceStatus');
  const soundToggleBtn = $('soundToggleBtn');
  const raceBtn = $('raceBtn');
  const raceResetBtn = $('raceResetBtn');
  const raceTrack = $('raceTrack');
  const raceFill = $('raceFill');
  const sendersEl = $('senders');
  const groupExtras = $('groupExtras');
  const pingPongCard = $('pingPongCard');
  const pingPongSub = $('pingPongSub');
  const pingPongList = $('pingPongList');
  const groupLoreCard = $('groupLoreCard');
  const groupLoreSub = $('groupLoreSub');
  const groupLoreList = $('groupLoreList');
  const extras = $('extras');
  const archetypeBadge = $('archetypeBadge');
  const vibeList = $('vibeList');
  const againBtn = $('againBtn');
  const anonToggle = $('anonToggle');
  const qualityToggle = $('qualityToggle');
  const mlLabBtn = $('mlLabBtn');
  const extraNamesInput = $('extraNames');
  const wrappedBtn = $('wrappedBtn');
  const exportBtn = $('exportBtn');
  const cardBtn = $('cardBtn');
  const cardMenu = $('cardMenu');
  const cardWideBtn = $('cardWideBtn');
  const cardStoryBtn = $('cardStoryBtn');
  const cardCopyTextBtn = $('cardCopyTextBtn');
  const wordsToggle = $('wordsToggle');
  const wordSection = $('wordSection');
  const wordSub = $('wordSub');
  const wordStats = $('wordStats');
  const quizBox = $('quizBox');
  const quizModeWho = $('quizModeWho');
  const quizModeMad = $('quizModeMad');
  const quizModeEra = $('quizModeEra');
  const quizPromptHint = $('quizPromptHint');
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
  const erasBox = $('erasBox');
  const erasSpan = $('erasSpan');
  const erasGrid = $('erasGrid');
  const bookNote = $('bookNote');
  const bookBank = $('bookBank');
  const bookExpandBtn = $('bookExpandBtn');

  // Modals
  const peekModal = $('peekModal');
  const peekTitle = $('peekTitle');
  const peekSub = $('peekSub');
  const peekMessages = $('peekMessages');
  const peekReplayBtn = $('peekReplayBtn');
  const peekCloseBtn = $('peekCloseBtn');
  const peekPrevBtn = $('peekPrevBtn');
  const peekDay1Btn = $('peekDay1Btn');
  const peekRandomBtn = $('peekRandomBtn');
  const peekNextBtn = $('peekNextBtn');
  const peekSelectAllBtn = $('peekSelectAllBtn');
  const peekQuoteBtn = $('peekQuoteBtn');

  const archModal = $('archModal');
  const archModalTitle = $('archModalTitle');
  const archModalSub = $('archModalSub');
  const archBody = $('archBody');
  const archCloseBtn = $('archCloseBtn');
  const archWrappedBtn = $('archWrappedBtn');
  const archDoneBtn = $('archDoneBtn');

  const mlModal = $('mlModal');
  const mlModalTitle = $('mlModalTitle');
  const mlModalSub = $('mlModalSub');
  const mlBody = $('mlBody');
  const mlCloseBtn = $('mlCloseBtn');
  const mlDoneBtn = $('mlDoneBtn');
  const mlTabOverview = $('mlTabOverview');
  const mlTabTrain = $('mlTabTrain');
  const mlTabInspect = $('mlTabInspect');
  const mlExportCsvBtn = $('mlExportCsvBtn');
  const mlCopyModelBtn = $('mlCopyModelBtn');
  const mlApplyToggleBtn = $('mlApplyToggleBtn');

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
  const WRAPPED_SLIDES = 7;
  const WORD_PRESETS = ['sorry', 'love', 'haha', 'wait', 'coffee', 'omg'];

  // WhatsApp-ish participant colors, assigned in order of message count.
  const PALETTE = ['#00a884', '#53bdeb', '#f0b429', '#e56399', '#a78bfa', '#f47c48', '#7cd4c0', '#ff8a65'];
  const DAY_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const MONTH_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const SAMPLE = [
    '12/05/2024, 18:42 - Messages and calls are end-to-end encrypted. No one outside of this chat, not even WhatsApp, can read or listen to them.',
    '12/05/2024, 18:42 - Alex created group "Trip plans"',
    '12/05/2024, 18:43 - Alex: are we still on for the Lisbon trip tomorrow?',
    '12/05/2024, 18:43 - Sam: yes! espresso at the station at 8 ☕',
    '12/05/2024, 18:44 - Priya: sorry I am still packing my backpack lol',
    '12/05/2024, 18:44 - Alex: classic Priya, I will bring the train tickets',
    '12/05/2024, 18:45 - Sam: IMG-20240512-WA0004.jpg (file attached)',
    '12/05/2024, 18:45 - Alex: haha that suitcase is bigger than your flat 😂',
    '12/05/2024, 18:46 - Priya: wait look at this\nand this\nand this',
    '12/05/2024, 18:47 - Sam: omg I love this itinerary already',
    '13/05/2024, 08:12 - Alex: morning! coffee at 9? ☕',
    '13/05/2024, 08:13 - Sam: 9 works, grabbing espresso right now',
    '13/05/2024, 08:14 - Priya: running late sorry!! save me a croissant',
    '13/05/2024, 09:02 - Sam: on my way now',
    '13/05/2024, 09:15 - Sam changed the subject to "Lisbon Squad 2024 🇵🇹"',
    '13/05/2024, 09:20 - Alex: booking the hotel tonight, check https://example.com/hotel',
    '13/05/2024, 09:21 - Sam: I can look at flights',
    '13/05/2024, 09:22 - Priya: deal, just make sure there is a rooftop terrace',
    '13/05/2024, 09:25 - Sam: VID-20240513-WA0001.mp4 (file attached)',
    '13/05/2024, 09:26 - Alex: that shortcut is unreal 🔥',
    '14/05/2024, 23:40 - Priya: WAIT STOP EVERYTHING',
    '14/05/2024, 23:40 - Alex: what happened?!',
    '14/05/2024, 23:41 - Priya: I accidentally booked the return flight for NEXT YEAR',
    '14/05/2024, 23:41 - Sam: HAHAHA NO WAY 😂😂',
    '14/05/2024, 23:41 - Sam: haha',
    '14/05/2024, 23:41 - Sam: lol 😂',
    '14/05/2024, 23:41 - Sam: lol 😂',
    '14/05/2024, 23:41 - Sam: wait',
    '14/05/2024, 23:41 - Sam: bro',
    '14/05/2024, 23:41 - Sam: no way',
    '14/05/2024, 23:41 - Sam: 😂😂😂',
    '14/05/2024, 23:41 - Alex: lmao guess you live in Lisbon now 💀',
    '14/05/2024, 23:42 - Priya changed the subject to "Priya Lives In Lisbon Now"',
    '14/05/2024, 23:42 - Sam: wait can you still cancel within 24 hours?',
    '14/05/2024, 23:43 - Priya: omg yes fixed it! crisis averted 😅',
    '14/05/2024, 23:43 - Sam: ok',
    '14/05/2024, 23:43 - Sam: 👍',
    '14/05/2024, 23:44 - Alex: legend, never change',
    '10/01/2025, 19:10 - Sam: happy new year team! reunion dinner soon?',
    '10/01/2025, 19:11 - Alex: YES! ramen or tacos this weekend?',
    '10/01/2025, 19:12 - Priya: ramen 100%, I am craving spicy ramen so bad',
    '10/01/2025, 19:13 - Sam: love ramen, Saturday at 7?',
    '10/01/2025, 19:14 - Alex: Saturday ramen locked in 🍜',
    '10/01/2025, 19:15 - Priya: wait should we plan the next summer trip over ramen?',
    '10/01/2025, 19:16 - Sam: Tokyo ramen tour 2025 let us gooo',
    '10/01/2025, 19:17 - Alex: haha only if Priya lets someone else book the flights 😂',
    '10/01/2025, 19:18 - Priya: fair enough lol I deserve that',
    '10/01/2025, 19:19 - Sam changed the subject to "Tokyo Ramen Tour 2025 🍜"',
    '11/01/2025, 11:05 - Alex: <Media omitted>',
    '11/01/2025, 11:06 - Sam: omg look at those ramen bowls, starving already',
    '11/01/2025, 11:07 - Priya: see you both at 7, actually leaving early this time!',
    '',
  ].join('\n');

  let current = null;
  let countRaf = 0;
  let raceRaf = 0;
  let searchTimer = null;
  let lensTimer = null;
  let lensPaused = false;
  let soundEnabled = false;
  let audioCtx = null;
  let lastNoteAt = 0;
  let replayTimers = [];

  /* ---------- Web Audio pentatonic marimba synth ---------- */

  const PENTATONIC = [261.63, 293.66, 329.63, 392.0, 440.0, 523.25, 587.33, 659.25];

  function ensureAudio() {
    if (audioCtx) {
      if (audioCtx.state === 'suspended') audioCtx.resume().catch(() => {});
      return audioCtx;
    }
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return null;
    try {
      audioCtx = new Ctx();
    } catch {
      return null;
    }
    return audioCtx;
  }

  function playSenderNote(sender, weight) {
    if (!soundEnabled || !current) return;
    const nowMs = performance.now();
    if (nowMs - lastNoteAt < 48) return;
    lastNoteAt = nowMs;

    const ctx = ensureAudio();
    if (!ctx) return;
    const idx = Math.max(0, current.result.senders.findIndex((s) => s.sender === sender));
    const freq = PENTATONIC[idx % PENTATONIC.length];
    const t0 = ctx.currentTime;
    const w = Math.max(0.25, Math.min(1, weight == null ? 0.6 : weight));

    try {
      const osc = ctx.createOscillator();
      const harm = ctx.createOscillator();
      const gain = ctx.createGain();
      const hGain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t0);
      harm.type = 'triangle';
      harm.frequency.setValueAtTime(freq * 2, t0);

      const peak = 0.045 + 0.055 * w;
      gain.gain.setValueAtTime(0.0001, t0);
      gain.gain.linearRampToValueAtTime(peak, t0 + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.24 + 0.1 * w);

      hGain.gain.setValueAtTime(0.18, t0);

      osc.connect(gain);
      harm.connect(hGain);
      hGain.connect(gain);
      gain.connect(ctx.destination);

      osc.start(t0);
      harm.start(t0);
      osc.stop(t0 + 0.38);
      harm.stop(t0 + 0.38);
    } catch {
      // Ignore audio scheduling errors in restricted contexts
    }
  }

  function syncSoundBtn() {
    if (!soundToggleBtn) return;
    soundToggleBtn.textContent = soundEnabled ? '🔊 Sound' : '🔇 Sound';
    soundToggleBtn.classList.toggle('on', soundEnabled);
    soundToggleBtn.setAttribute('aria-pressed', String(soundEnabled));
  }

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
    renderGroupExtras();
    renderVibes();
    renderWordDuelBar();
    if (current.spotlightWord) {
      const sw = current.spotlightWord;
      const who = sw.topSender && current.result.senders.length >= 2 ? ` · mostly ${labelFor(sw.topSender)}` : '';
      if (wordFilterPill) {
        wordFilterPill.textContent = sw.hits
          ? `“${sw.word}” ×${numberFmt.format(sw.hits)}${who} ×`
          : `“${sw.word}” · 0 matches ×`;
      }
    }
    if (!wordSection.hidden) {
      renderWords();
      renderQuizCurrent();
    }
    if (peekModal && !peekModal.hidden) renderPeekWindow();
    if (archModal && !archModal.hidden) openArchetypeModal();
    if (mlModal && !mlModal.hidden) renderMlModal();
    if (wrappedModal && !wrappedModal.hidden) renderWrappedSlide();
    hideTooltip();
  });

  // 🧹 Spam-adjusted counts: re-rank senders by the ML-weighted substantive count
  // (laugh-spam, acks, bursts, duplicates, media all handled — see quality.js).
  function setAdjustedMode(enabled) {
    if (!current) return;
    current.adjusted = Boolean(enabled);
    current.lensIndex = 0;
    if (qualityToggle) qualityToggle.checked = current.adjusted;
    if (current.race && current.race.active) stopRace(false);
    syncMlLabBtn();
    updateExtrasLine();
    renderArchetype();
    renderVibes();
    buildSenderRows(current.result);
    renderGroupExtras();
    updateAnswerBubble(true);
    if (!wordSection.hidden) renderWords();
    drawStrip(1);
    if (peekModal && !peekModal.hidden) renderPeekWindow();
    if (archModal && !archModal.hidden) openArchetypeModal();
    if (mlModal && !mlModal.hidden) renderMlModal();
    if (wrappedModal && !wrappedModal.hidden) renderWrappedSlide();
  }

  function syncMlLabBtn() {
    if (!mlLabBtn) return;
    const isCustom = Boolean(current && current.customModel);
    const isOn = Boolean(current && (current.adjusted || isCustom));
    mlLabBtn.classList.toggle('on', isOn);
    mlLabBtn.textContent = isCustom ? '🧪 ML Lab · custom' : '🧪 ML Lab';
  }

  if (qualityToggle) {
    qualityToggle.addEventListener('change', () => {
      setAdjustedMode(qualityToggle.checked);
    });
  }
  if (mlLabBtn) {
    mlLabBtn.addEventListener('click', () => openMlModal('overview'));
  }
  if (mlCloseBtn) mlCloseBtn.addEventListener('click', closeMlModal);
  if (mlDoneBtn) mlDoneBtn.addEventListener('click', closeMlModal);
  if (mlModal) {
    mlModal.addEventListener('click', (e) => {
      if (e.target === mlModal) closeMlModal();
    });
  }
  if (mlTabOverview) mlTabOverview.addEventListener('click', () => setMlTab('overview'));
  if (mlTabTrain) mlTabTrain.addEventListener('click', () => setMlTab('train'));
  if (mlTabInspect) mlTabInspect.addEventListener('click', () => setMlTab('inspect'));
  if (mlExportCsvBtn) mlExportCsvBtn.addEventListener('click', exportQualityCSV);
  if (mlCopyModelBtn) mlCopyModelBtn.addEventListener('click', copyQualityModelJSON);
  if (mlApplyToggleBtn) {
    mlApplyToggleBtn.addEventListener('click', () => {
      if (!current) return;
      setAdjustedMode(!current.adjusted);
    });
  }

  if (exportBtn) {
    exportBtn.addEventListener('click', () => {
      if (!current) return;
      const opts = current.anon ? { senderMap: current.map, nameMap: ensureDetected() } : {};
      const text = WhatsAppParser.toText(current.result, opts);
      const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const yearTag = current.selectedYear ? '-' + current.selectedYear : '';
      const base = current.anon ? 'anonymized-chat' : (current.name || 'chat').replace(/\.(txt|zip)$/i, '');
      a.download = base + yearTag + '.txt';
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
  if (cardCopyTextBtn) {
    cardCopyTextBtn.addEventListener('click', () => {
      closeCardMenu();
      copyWhatsAppSummary();
    });
  }

  if (wrappedBtn) {
    wrappedBtn.addEventListener('click', openWrapped);
  }
  if (archetypeBadge) {
    archetypeBadge.addEventListener('click', openArchetypeModal);
  }
  if (archCloseBtn) archCloseBtn.addEventListener('click', closeArchetypeModal);
  if (archDoneBtn) archDoneBtn.addEventListener('click', closeArchetypeModal);
  if (archModal) {
    archModal.addEventListener('click', (e) => {
      if (e.target === archModal) closeArchetypeModal();
    });
  }
  if (archWrappedBtn) {
    archWrappedBtn.addEventListener('click', () => {
      closeArchetypeModal();
      openWrapped();
    });
  }
  if (soundToggleBtn) {
    soundToggleBtn.addEventListener('click', () => {
      soundEnabled = !soundEnabled;
      syncSoundBtn();
      if (soundEnabled && current && current.result.senders.length) {
        ensureAudio();
        playSenderNote(current.result.senders[0].sender, 0.7);
      }
    });
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
      updateAnswerBubble(false, true);
      scheduleLensAuto(4500);
    });
    answerBtn.addEventListener('pointerenter', () => {
      lensPaused = true;
      stopLensAuto();
    });
    answerBtn.addEventListener('pointerleave', () => {
      lensPaused = false;
      scheduleLensAuto(3200);
    });
    answerBtn.addEventListener('focus', () => {
      lensPaused = true;
      stopLensAuto();
    });
    answerBtn.addEventListener('blur', () => {
      lensPaused = false;
      scheduleLensAuto(3200);
    });
  }

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stopLensAuto();
    else if (current && !lensPaused) scheduleLensAuto(4500);
  });

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

  if (quizModeWho) quizModeWho.addEventListener('click', () => setQuizMode('who'));
  if (quizModeMad) quizModeMad.addEventListener('click', () => setQuizMode('mad'));
  if (quizModeEra) quizModeEra.addEventListener('click', () => setQuizMode('era'));
  if (quizNextBtn) quizNextBtn.addEventListener('click', nextQuizQuestion);
  if (quizPeekBtn) {
    quizPeekBtn.addEventListener('click', () => {
      const qState = activeQuizState();
      if (!qState || !qState.current) return;
      const modeTitle = current.quiz.mode === 'mad'
        ? 'From “Mad Libs”'
        : current.quiz.mode === 'era'
          ? 'From “Guess the Era”'
          : 'From “Who said it?”';
      openPeek(qState.current.index, modeTitle);
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
      stopPeekReplay();
      current.peek.index = Math.max(0, current.peek.index - 4);
      current.peek.selected = new Set([current.peek.index]);
      current.peek.title = 'Moment peek';
      renderPeekWindow();
    });
  }
  if (peekNextBtn) {
    peekNextBtn.addEventListener('click', () => {
      if (!current || !current.peek) return;
      stopPeekReplay();
      current.peek.index = Math.min(current.result.messages.length - 1, current.peek.index + 4);
      current.peek.selected = new Set([current.peek.index]);
      current.peek.title = 'Moment peek';
      renderPeekWindow();
    });
  }
  if (peekDay1Btn) {
    peekDay1Btn.addEventListener('click', () => {
      if (!current || !current.result.messages.length) return;
      openPeek(0, '🕰️ Day 1 · The very beginning');
    });
  }
  if (peekRandomBtn) peekRandomBtn.addEventListener('click', () => openRandomPeek());
  if (peekReplayBtn) peekReplayBtn.addEventListener('click', togglePeekReplay);
  if (peekSelectAllBtn) {
    peekSelectAllBtn.addEventListener('click', () => {
      if (!current || !current.peek || current.peek.replaying) return;
      const { start, end } = peekWindowBounds();
      const totalVisible = end - start + 1;
      if (current.peek.selected.size >= totalVisible) {
        current.peek.selected = new Set([current.peek.index]);
      } else {
        const all = new Set();
        for (let i = start; i <= end; i++) all.add(i);
        current.peek.selected = all;
      }
      syncPeekSelectionUI();
    });
  }
  if (peekQuoteBtn) {
    peekQuoteBtn.addEventListener('click', () => {
      if (!current || !current.peek) return;
      const indices = Array.from(current.peek.selected || [current.peek.index]).sort((a, b) => a - b);
      saveQuoteCard(indices, peekQuoteBtn);
    });
  }

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
      if (archModal && !archModal.hidden) closeArchetypeModal();
      if (mlModal && !mlModal.hidden) closeMlModal();
      if (wrappedModal && !wrappedModal.hidden) closeWrapped();
    } else if (mlModal && !mlModal.hidden && current && current.mlTab === 'train') {
      const tag = (e.target && e.target.tagName) || '';
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      if (e.key === '1') {
        e.preventDefault();
        labelCurrentAlItem(0);
      } else if (e.key === '2') {
        e.preventDefault();
        labelCurrentAlItem(1);
      } else if (e.key === 's' || e.key === 'S') {
        e.preventDefault();
        skipCurrentAlItem();
      }
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
  function setDragVisual(active) {
    if (active) {
      if (dropSection.hidden) {
        if (dropOverlay) dropOverlay.hidden = false;
      } else {
        dropZone.classList.add('dragging');
      }
    } else {
      dropZone.classList.remove('dragging');
      if (dropOverlay) dropOverlay.hidden = true;
    }
  }
  window.addEventListener('dragenter', (e) => {
    e.preventDefault();
    dragDepth++;
    setDragVisual(true);
  });
  window.addEventListener('dragover', (e) => e.preventDefault());
  window.addEventListener('dragleave', (e) => {
    e.preventDefault();
    dragDepth = Math.max(0, dragDepth - 1);
    if (dragDepth === 0) setDragVisual(false);
  });
  window.addEventListener('drop', (e) => {
    e.preventDefault();
    dragDepth = 0;
    setDragVisual(false);
    const file = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
    if (file) handleFile(file);
  });

  // Allow pasting a WhatsApp chat export directly (⌘V / Ctrl+V) when not typing in a field.
  window.addEventListener('paste', (e) => {
    const t = e.target;
    if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return;
    const cd = e.clipboardData;
    if (!cd) return;
    if (cd.files && cd.files.length) {
      e.preventDefault();
      handleFile(cd.files[0]);
      return;
    }
    const pasted = cd.getData('text/plain');
    if (!pasted || pasted.length < 12) return;
    const result = WhatsAppParser.parse(pasted);
    if (result.total > 0) {
      e.preventDefault();
      render('Pasted chat.txt', new Blob([pasted]).size, result, pasted);
    }
  });

  async function handleFile(file) {
    if (typingStatus) typingStatus.hidden = false;
    const head = new Uint8Array(await file.slice(0, 4).arrayBuffer());
    const isZip = head[0] === 0x50 && head[1] === 0x4b;
    let text;
    let displayName = file.name;
    let displaySize = file.size;

    if (isZip || /\.zip$/i.test(file.name)) {
      if (!WhatsAppParser.extractChatFromZip) {
        if (typingStatus) typingStatus.hidden = true;
        showError('Could not unpack that .zip archive. Try unzipping it first and dropping the .txt file.');
        return;
      }
      try {
        const extracted = await WhatsAppParser.extractChatFromZip(await file.arrayBuffer());
        text = extracted.text;
        displayName = /^_chat\.txt$/i.test(extracted.name) ? file.name : extracted.name;
        displaySize = extracted.size;
      } catch (err) {
        if (typingStatus) typingStatus.hidden = true;
        showError((err && err.message) || 'Could not read that .zip archive. Try unzipping it and dropping the .txt file.');
        return;
      }
    } else {
      try {
        text = await file.text();
      } catch {
        if (typingStatus) typingStatus.hidden = true;
        showError('Could not read that file. Try again with the .txt or .zip file from Export chat.');
        return;
      }
    }

    const result = WhatsAppParser.parse(text);
    if (!result.total) {
      if (typingStatus) typingStatus.hidden = true;
      showError('No messages found in that file. WhatsApp exports have one message per line (like "12/05/2025, 18:42 - Alex: hi").');
      return;
    }
    render(displayName, displaySize, result, text);
  }

  function showError(message) {
    dropSection.hidden = true;
    resultSection.hidden = true;
    errorText.textContent = message;
    errorSection.hidden = false;
  }

  function reset() {
    cancelAnimationFrame(countRaf);
    stopLensAuto();
    stopRace(false);
    closePeek();
    closeArchetypeModal();
    closeMlModal();
    closeWrapped();
    closeCardMenu();
    if (typingStatus) typingStatus.hidden = true;
    errorSection.hidden = true;
    resultSection.hidden = true;
    dropSection.hidden = false;
    anonToggle.checked = false;
    wordsToggle.checked = false;
    if (qualityToggle) qualityToggle.checked = false;
    wordSection.hidden = true;
    if (wordSearch) wordSearch.value = '';
    if (yearFilter) {
      yearFilter.hidden = true;
      yearFilter.textContent = '';
    }
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

  function ensureCleanBundle() {
    if (!current) return null;
    if (!current.adjusted || !current.quality) {
      return { result: current.result, insights: current.insights };
    }
    if (current.cleanBundle) return current.cleanBundle;

    const origMsgs = current.result.messages || [];
    const q = current.quality;
    const cleanMsgs = [];
    const origIndices = [];
    const bySender = new Map();
    let chars = 0;

    for (let i = 0; i < origMsgs.length; i++) {
      const k = q.kinds[i];
      const w = q.weights[i];
      if (k !== 'substantive' || w < 0.5) continue;
      const m = origMsgs[i];
      cleanMsgs.push(m);
      origIndices.push(i);
      chars += m.text.length;
      const entry = bySender.get(m.sender) || { sender: m.sender, count: 0, chars: 0 };
      entry.count++;
      entry.chars += m.text.length;
      bySender.set(m.sender, entry);
    }

    if (!cleanMsgs.length) {
      current.cleanBundle = { result: current.result, insights: current.insights };
      return current.cleanBundle;
    }

    const noteEntries = (current.result.entries || []).filter((e) => e.kind === 'note');
    const cleanResult = {
      total: cleanMsgs.length,
      systemNotes: current.result.systemNotes || 0,
      media: 0,
      deleted: 0,
      edited: cleanMsgs.reduce((n, m) => n + (m.edited ? 1 : 0), 0),
      chars,
      first: cleanMsgs[0].ts,
      last: cleanMsgs[cleanMsgs.length - 1].ts,
      senders: Array.from(bySender.values()).sort((a, b) => b.count - a.count || a.sender.localeCompare(b.sender)),
      messages: cleanMsgs,
      entries: cleanMsgs.concat(noteEntries),
    };

    const cleanInsights = WhatsAppParser.insights
      ? WhatsAppParser.insights(cleanResult)
      : current.insights;

    // Remap every message index back to the full chat so Moment Peek & spotlights align.
    const mapIdx = (ci) => (typeof ci === 'number' && ci >= 0 && ci < origIndices.length ? origIndices[ci] : ci);
    if (cleanInsights.chaosPeak) {
      cleanInsights.chaosPeak.startIdx = mapIdx(cleanInsights.chaosPeak.startIdx);
      cleanInsights.chaosPeak.endIdx = mapIdx(cleanInsights.chaosPeak.endIdx);
    }
    if (cleanInsights.peakDayRange) {
      cleanInsights.peakDayRange.firstIdx = mapIdx(cleanInsights.peakDayRange.firstIdx);
      cleanInsights.peakDayRange.lastIdx = mapIdx(cleanInsights.peakDayRange.lastIdx);
    }
    if (cleanInsights.streakRange) {
      cleanInsights.streakRange.startIdx = mapIdx(cleanInsights.streakRange.startIdx);
      cleanInsights.streakRange.endIdx = mapIdx(cleanInsights.streakRange.endIdx);
    }
    if (cleanInsights.longestSilence) {
      cleanInsights.longestSilence.startIdx = mapIdx(cleanInsights.longestSilence.startIdx);
      cleanInsights.longestSilence.endIdx = mapIdx(cleanInsights.longestSilence.endIdx);
    }
    if (cleanInsights.dayList) {
      for (const d of cleanInsights.dayList) {
        d.firstIdx = mapIdx(d.firstIdx);
        d.lastIdx = mapIdx(d.lastIdx);
      }
    }

    // Preserve comedian (laughs triggered by jokes) and groupLore (system notes) from raw chat.
    if (current.insights.comedian && !cleanInsights.comedian) {
      cleanInsights.comedian = current.insights.comedian;
      if (cleanInsights.senderStats && current.insights.senderStats) {
        for (const s of Object.keys(cleanInsights.senderStats)) {
          const rawSt = current.insights.senderStats[s];
          if (rawSt && rawSt.laughsTriggered) {
            cleanInsights.senderStats[s].laughsTriggered = rawSt.laughsTriggered;
            cleanInsights.senderStats[s].bestPunchlineIdx = rawSt.bestPunchlineIdx;
          }
        }
      }
      if (cleanInsights.awards && !cleanInsights.awards.some((a) => a.id === 'comedian')) {
        const cm = current.insights.comedian;
        cleanInsights.awards.unshift({
          id: 'comedian', icon: '🎭', title: 'Comedian',
          sender: cm.sender, detail: '×' + cm.count + ' laughs triggered',
        });
        if (cleanInsights.senderStats && cleanInsights.senderStats[cm.sender]) {
          cleanInsights.senderStats[cm.sender].badges.unshift({
            id: 'comedian', icon: '🎭', title: 'Comedian', detail: '×' + cm.count + ' laughs triggered',
          });
        }
      }
    }
    if (current.insights.groupLore) {
      cleanInsights.groupLore = current.insights.groupLore;
    }

    current.cleanBundle = { result: cleanResult, insights: cleanInsights, origIndices };
    return current.cleanBundle;
  }

  function activeInsights() {
    const b = ensureCleanBundle();
    return b ? b.insights : current.insights;
  }

  function activeTextResult() {
    const b = ensureCleanBundle();
    return b ? b.result : current.result;
  }

  function wordsFor(anon, filterStopWords) {
    const skip = filterStopWords !== false;
    const modeTag = current.adjusted ? 'clean|' : 'raw|';
    const key = modeTag + (anon ? 'anon|' : 'plain|') + (skip ? '1|' : '0|') + readExtraNames().join(',');
    if (!current.wordsCache[key]) {
      current.wordsCache[key] = WhatsAppWords.analyze(
        activeTextResult().messages,
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
      current.erasCache = {};
      if (current.anon) {
        renderGroupExtras();
        if (!wordSection.hidden) {
          renderWords();
          renderQuizCurrent();
        }
        if (peekModal && !peekModal.hidden) renderPeekWindow();
        if (archModal && !archModal.hidden) openArchetypeModal();
        if (mlModal && !mlModal.hidden) renderMlModal();
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

  /* ---------- main render & year switcher ---------- */

  function renderYearFilter() {
    if (!yearFilter || !current) return;
    const years = current.years || [];
    if (years.length < 2) {
      yearFilter.hidden = true;
      yearFilter.textContent = '';
      return;
    }
    yearFilter.hidden = false;
    yearFilter.textContent = '';

    const makeTab = (label, yearVal) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      const active = current.selectedYear === yearVal;
      btn.className = 'pill-btn' + (active ? ' active' : '');
      btn.setAttribute('role', 'tab');
      btn.setAttribute('aria-selected', String(active));
      btn.textContent = label;
      btn.addEventListener('click', () => {
        if (!current || current.selectedYear === yearVal) return;
        selectYear(yearVal);
      });
      return btn;
    };

    yearFilter.appendChild(makeTab('All time', null));
    for (const y of years) {
      yearFilter.appendChild(makeTab(String(y), y));
    }
  }

  function selectYear(year) {
    if (!current || !current.fullResult) return;
    const sliced = year && WhatsAppParser.filterByYear
      ? WhatsAppParser.filterByYear(current.fullResult, year)
      : current.fullResult;
    if (!sliced || !sliced.total) return;

    const keepAnon = current.anon;
    const keepAdjusted = current.adjusted;
    const keepQualityPreset = current.qualityPreset || 'balanced';
    const keepCustomModel = current.customModel || null;
    const keepWordsOpen = Boolean(wordsToggle && wordsToggle.checked);
    const keepStripMode = current.stripMode || 'timeline';
    render(current.name, current.size, sliced, current.rawText, {
      fullResult: current.fullResult,
      years: current.years,
      selectedYear: year,
      colors: current.colors,
      map: current.map,
      anon: keepAnon,
      adjusted: keepAdjusted,
      qualityPreset: keepQualityPreset,
      customModel: keepCustomModel,
      wordsOpen: keepWordsOpen,
      stripMode: keepStripMode,
      skipScroll: true,
    });
  }

  /* ---------- extras line under the answer bubble ---------- */

  function formatQualityBits(obj) {
    const bits = [];
    if (obj.reactions || obj.reaction) bits.push(`${numberFmt.format(obj.reactions || obj.reaction)} laughs`);
    if (obj.acks || obj.ack) bits.push(`${numberFmt.format(obj.acks || obj.ack)} acks`);
    if (obj.burstSpam || obj.burst) bits.push(`${numberFmt.format(obj.burstSpam || obj.burst)} bursts`);
    if (obj.emojis || obj.emoji) bits.push(`${numberFmt.format(obj.emojis || obj.emoji)} emoji`);
    if (obj.dupes || obj.duplicate) bits.push(`${numberFmt.format(obj.dupes || obj.duplicate)} dupes`);
    if (obj.media) bits.push(`${numberFmt.format(obj.media)} media`);
    if (obj.deleted) bits.push(`${numberFmt.format(obj.deleted)} deleted`);
    return bits;
  }

  function formatAdjustedNum(val) {
    return val >= 10 ? numberFmt.format(Math.round(val)) : (Math.round(val * 10) / 10).toString();
  }

  function updateExtrasLine() {
    if (!current || !extras) return;
    const { result, quality, adjusted } = current;
    const insights = activeInsights();
    const parts = [];
    if (result.media) parts.push(`${numberFmt.format(result.media)} media message${result.media === 1 ? '' : 's'}`);
    if (result.deleted) parts.push(`${numberFmt.format(result.deleted)} deleted`);
    if (result.edited) parts.push(`${numberFmt.format(result.edited)} edited`);
    if (result.systemNotes) parts.push(`${numberFmt.format(result.systemNotes)} system note${result.systemNotes === 1 ? '' : 's'} skipped`);
    if (insights.avgChars) parts.push(`avg ${numberFmt.format(insights.avgChars)} chars/msg`);

    extras.textContent = '';
    if (parts.length) extras.append(parts.join(', '));

    if (adjusted && quality) {
      if (parts.length) extras.append(' · ');
      const bits = formatQualityBits(quality.counts);
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'extras-ml-btn';
      btn.title = 'Click to inspect the ML cleaning pipeline & train on your chat';
      const detail = bits.length ? ` (${bits.slice(0, 4).join(', ')})` : '';
      btn.textContent = `🧹 ${quality.signalPct}% signal · ${formatAdjustedNum(quality.adjusted)} of ${numberFmt.format(quality.total)}${detail}`;
      btn.addEventListener('click', () => openMlModal('overview'));
      extras.appendChild(btn);
    }
  }

  function render(name, size, result, rawText, opts) {
    opts = opts || {};
    cancelAnimationFrame(countRaf);
    stopLensAuto();
    stopRace(false);
    closePeek();
    closeArchetypeModal();
    closeMlModal();
    closeWrapped();
    closeCardMenu();

    const fullResult = opts.fullResult || result;
    const years = opts.years || (WhatsAppParser.availableYears ? WhatsAppParser.availableYears(fullResult) : []);
    const selectedYear = opts.selectedYear || null;

    const insights = WhatsAppParser.insights
      ? WhatsAppParser.insights(result)
      : { hours: new Array(24).fill(0), weekdays: new Array(7).fill(0), dayList: [], hourSenders: [], totalParsedTs: 0, textChars: result.chars || 0, avgChars: 0, senderStats: {}, awards: [] };
    const timestamps = WhatsAppParser.parseTimestamps ? WhatsAppParser.parseTimestamps(result.messages) : [];
    const msArr = timestamps.map((t) => (t && typeof t.ms === 'number' ? t.ms : null));
    const qualityPreset = opts.qualityPreset || 'balanced';
    const customModel = opts.customModel || null;
    // Message-quality ML pipeline: corpus IDF + 18 features + logistic scoring + cleaning rules.
    const quality = (typeof WhatsAppQuality !== 'undefined' && WhatsAppQuality.analyze)
      ? WhatsAppQuality.analyze(result.messages, {
          ms: msArr,
          model: customModel || undefined,
          preset: qualityPreset,
        })
      : null;
    const onThisDay = WhatsAppParser.findOnThisDay ? WhatsAppParser.findOnThisDay(result) : { total: 0, years: [] };

    const colors = opts.colors ? new Map(opts.colors) : new Map();
    if (!opts.colors) {
      fullResult.senders.forEach((s, i) => colors.set(s.sender, PALETTE[i % PALETTE.length]));
    }
    const map = opts.map || WhatsAppParser.senderMap(fullResult);
    const anon = Boolean(opts.anon);
    const adjusted = Boolean(opts.adjusted);
    const stripMode = opts.stripMode || 'timeline';

    current = {
      result,
      fullResult,
      years,
      selectedYear,
      size,
      insights,
      timestamps,
      msArr,
      quality,
      cleanBundle: null,
      adjusted,
      qualityPreset,
      customModel,
      userLabels: new Map(),
      mlTab: 'overview',
      alQueue: null,
      alCursor: 0,
      inspectFilter: 'borderline',
      sandboxText: '',
      sandboxBurst: false,
      sandboxDup: false,
      onThisDay,
      colors,
      map,
      anon,
      name,
      rawText,
      detected: null,
      wordsCache: {},
      erasCache: {},
      stripMode,
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

    anonToggle.checked = anon;
    if (qualityToggle) qualityToggle.checked = adjusted;
    syncMlLabBtn();
    wordsToggle.checked = Boolean(opts.wordsOpen);
    wordSection.hidden = !opts.wordsOpen;
    syncAnonUI();
    syncSoundBtn();
    if (wordFilterPill) wordFilterPill.hidden = true;
    if (wordSearch) wordSearch.value = '';
    syncStripTabs(stripMode);
    hideTooltip();

    dropSection.hidden = true;
    errorSection.hidden = true;
    resultSection.hidden = false;

    fileName.textContent = name;
    const sizeSpan = document.createElement('span');
    sizeSpan.className = 'size';
    sizeSpan.textContent = formatSize(size);
    fileName.appendChild(sizeSpan);

    const rangeText = result.first && result.last
      ? `from ${result.first} to ${result.last}`
      : '';
    fileSub.textContent = selectedYear
      ? `${selectedYear} · ${rangeText}`
      : rangeText;
    renderYearFilter();

    updateExtrasLine();

    if (sendersBar) {
      sendersBar.hidden = result.senders.length < 2;
      if (raceStatus) raceStatus.textContent = 'click a sender to see their stats';
      if (raceBtn) raceBtn.textContent = '▶ Play race';
      if (raceResetBtn) raceResetBtn.hidden = true;
      if (raceTrack) raceTrack.hidden = true;
    }

    renderArchetype();
    renderVibes();
    renderWordDuelBar();
    buildSenderRows(result);
    renderGroupExtras();
    updateAnswerBubble(true);

    if (opts.wordsOpen) {
      renderWords();
      ensureQuiz();
    }

    drawStrip(1);
    if (!reduceMotion) animateStrip();

    if (!opts.skipScroll) {
      resultSection.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'nearest' });
    }
  }

  /* ---------- answer bubble lenses (6 units) + receipts ---------- */

  function lensData(index) {
    const result = activeTextResult();
    const insights = activeInsights();
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
      const countForScroll = current.adjusted && current.quality ? current.quality.adjusted : result.total;
      const cm = countForScroll * 1.15;
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
    if (current.adjusted && current.quality) {
      const adj = current.quality.adjusted;
      const disp = adj >= 10 ? numberFmt.format(Math.round(adj)) : adj.toFixed(1);
      const rounded = Math.round(adj);
      return { value: rounded, display: disp, unit: rounded === 1 ? 'substantive message' : 'substantive messages', animate: true };
    }
    return { value: current.result.total, display: numberFmt.format(current.result.total), unit: current.result.total === 1 ? 'message' : 'messages', animate: true };
  }

  function stopLensAuto() {
    clearTimeout(lensTimer);
    lensTimer = null;
  }

  function scheduleLensAuto(delayMs) {
    stopLensAuto();
    if (reduceMotion || lensPaused || document.hidden || !current || resultSection.hidden) return;
    lensTimer = setTimeout(() => {
      if (!current || lensPaused || document.hidden || resultSection.hidden) return;
      const modalOpen = (peekModal && !peekModal.hidden)
        || (archModal && !archModal.hidden)
        || (mlModal && !mlModal.hidden)
        || (wrappedModal && !wrappedModal.hidden);
      if (!modalOpen) {
        current.lensIndex = (current.lensIndex + 1) % LENS_COUNT;
        updateAnswerBubble(false, true);
      }
      scheduleLensAuto(4500);
    }, delayMs == null ? 4500 : delayMs);
  }

  function updateAnswerBubble(animateInitial, animateSwap) {
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

    if (animateSwap && answerBtn && !reduceMotion) {
      answerBtn.classList.remove('swap');
      void answerBtn.offsetWidth;
      answerBtn.classList.add('swap');
    }

    if (animateInitial && data.animate) {
      if (receiptsIcon) receiptsIcon.classList.remove('read');
      if (typingStatus && !reduceMotion) typingStatus.hidden = false;
      countUp(bigNumber, data.value, () => {
        if (typingStatus) typingStatus.hidden = true;
        if (receiptsIcon) receiptsIcon.classList.add('read');
        scheduleLensAuto(5500);
      });
    } else {
      bigNumber.textContent = data.display;
      if (typingStatus) typingStatus.hidden = true;
      if (receiptsIcon) receiptsIcon.classList.add('read');
      if (animateInitial) scheduleLensAuto(5500);
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

  /* ---------- chat archetype badge + clickable chat vibe superlatives ---------- */

  function renderArchetype() {
    if (!archetypeBadge || !current) return;
    const arch = activeInsights().archetype;
    if (!arch) {
      archetypeBadge.hidden = true;
      return;
    }
    archetypeBadge.textContent = '';
    const icon = document.createElement('span');
    icon.className = 'archetype-icon';
    icon.textContent = arch.icon;
    const txt = document.createElement('span');
    txt.className = 'archetype-text';
    const title = document.createElement('span');
    title.className = 'archetype-title';
    title.textContent = arch.title;
    const sub = document.createElement('span');
    sub.className = 'archetype-sub';
    sub.textContent = arch.tagline;
    txt.append(title, sub);
    const cue = document.createElement('span');
    cue.className = 'archetype-cue';
    cue.textContent = 'why?';
    archetypeBadge.append(icon, txt, cue);
    archetypeBadge.hidden = false;
  }

  function openArchetypeModal() {
    if (!current || !archModal || !archBody) return;
    const arch = activeInsights().archetype;
    if (!arch) return;

    if (archModalTitle) archModalTitle.textContent = `${arch.icon} ${arch.title}`;
    if (archModalSub) archModalSub.textContent = current.adjusted ? 'Why your spam-adjusted chat earned this archetype' : 'Why your chat earned this archetype';

    archBody.textContent = '';

    // Hero summary
    const hero = document.createElement('div');
    hero.className = 'arch-hero';
    const ic = document.createElement('span');
    ic.className = 'arch-hero-icon';
    ic.textContent = arch.icon;
    const hText = document.createElement('div');
    hText.className = 'arch-hero-text';
    const hStrong = document.createElement('strong');
    hStrong.textContent = arch.title;
    const hTag = document.createElement('span');
    hTag.textContent = arch.tagline;
    hText.append(hStrong, hTag);
    hero.append(ic, hText);
    archBody.appendChild(hero);

    // Personalized reason + rule
    if (arch.reason) {
      const p = document.createElement('p');
      p.className = 'arch-reason';
      p.textContent = arch.reason;
      archBody.appendChild(p);
    }
    if (arch.criteria) {
      const crit = document.createElement('p');
      crit.className = 'arch-criteria';
      crit.textContent = `Rule: ${arch.criteria}`;
      archBody.appendChild(crit);
    }

    // 6 DNA Vitals
    if (arch.vitals && arch.vitals.length) {
      const sec = document.createElement('div');
      const h = document.createElement('h4');
      h.className = 'arch-sec-title';
      h.textContent = 'Your chat DNA';
      const grid = document.createElement('div');
      grid.className = 'arch-vitals';
      for (const v of arch.vitals) {
        const cell = document.createElement('div');
        cell.className = 'arch-vital';
        const top = document.createElement('div');
        top.className = 'arch-vital-top';
        const lbl = document.createElement('span');
        lbl.textContent = v.label;
        const val = document.createElement('strong');
        val.textContent = v.value;
        top.append(lbl, val);
        const bar = document.createElement('span');
        bar.className = 'arch-vital-bar';
        const fill = document.createElement('i');
        fill.style.width = Math.max(3, Math.min(100, v.pct || 0)) + '%';
        bar.appendChild(fill);
        cell.append(top, bar);
        grid.appendChild(cell);
      }
      sec.append(h, grid);
      archBody.appendChild(sec);
    }

    // Runner-up traits this chat also qualified for
    if (arch.runnersUp && arch.runnersUp.length) {
      const sec = document.createElement('div');
      const h = document.createElement('h4');
      h.className = 'arch-sec-title';
      h.textContent = 'Also qualified for';
      const list = document.createElement('div');
      list.className = 'arch-runners';
      for (const r of arch.runnersUp) {
        const card = document.createElement('div');
        card.className = 'arch-runner';
        const st = document.createElement('strong');
        st.textContent = `${r.icon} ${r.title}`;
        const sp = document.createElement('span');
        sp.textContent = r.reason || r.tagline;
        card.append(st, sp);
        list.appendChild(card);
      }
      sec.append(h, list);
      archBody.appendChild(sec);
    }

    // Collapsible catalog of all possible archetypes
    if (arch.all && arch.all.length) {
      const details = document.createElement('details');
      details.className = 'arch-details';
      const summary = document.createElement('summary');
      summary.textContent = `See all ${arch.all.length} chat archetypes & rules`;
      const ul = document.createElement('ul');
      ul.className = 'arch-catalog';
      for (const item of arch.all) {
        const li = document.createElement('li');
        li.className = 'arch-cat-item' + (item.id === arch.id ? ' yours' : '');
        const st = document.createElement('strong');
        st.textContent = `${item.icon} ${item.title}` + (item.id === arch.id ? ' (yours)' : item.matched ? ' ✓' : '');
        const sp = document.createElement('span');
        sp.textContent = item.criteria;
        li.append(st, sp);
        ul.appendChild(li);
      }
      details.append(summary, ul);
      archBody.appendChild(details);
    }

    archModal.hidden = false;
    if (archCloseBtn) archCloseBtn.focus();
  }

  function closeArchetypeModal() {
    if (archModal) archModal.hidden = true;
  }

  /* ---------- ML Cleaning Pipeline Lab (Overview, Active Learning, Live Inspector) ---------- */

  const ML_KIND_COLORS = {
    substantive: '#00a884',
    reaction: '#f0b429',
    ack: '#53bdeb',
    burst: '#e56399',
    emoji: '#a78bfa',
    duplicate: '#f47c48',
    media: '#4b5c66',
  };

  function activeQualityModel() {
    if (!current || typeof WhatsAppQuality === 'undefined') return null;
    if (current.customModel) return current.customModel;
    return (WhatsAppQuality.PRESETS && WhatsAppQuality.PRESETS[current.qualityPreset]) || WhatsAppQuality.MODEL;
  }

  function recomputeQuality(opts) {
    if (!current || typeof WhatsAppQuality === 'undefined' || !WhatsAppQuality.analyze) return;
    opts = opts || {};
    const corpus = current.quality && current.quality._corpus ? current.quality._corpus : undefined;
    current.quality = WhatsAppQuality.analyze(current.result.messages, {
      ms: current.msArr,
      model: current.customModel || undefined,
      preset: current.qualityPreset || 'balanced',
      corpus,
    });
    current.cleanBundle = null;
    current.wordsCache = {};
    if (!opts.keepQueue) {
      current.alQueue = null;
      current.alCursor = 0;
    }
    syncMlLabBtn();
    updateExtrasLine();
    renderArchetype();
    renderVibes();
    buildSenderRows(current.result);
    renderGroupExtras();
    updateAnswerBubble(false, false);
    if (!wordSection.hidden) renderWords();
    drawStrip(1);
    if (peekModal && !peekModal.hidden) renderPeekWindow();
    if (archModal && !archModal.hidden) openArchetypeModal();
    if (wrappedModal && !wrappedModal.hidden) renderWrappedSlide();
  }

  function ensureAlQueue() {
    if (!current || !current.quality || !WhatsAppQuality.sampleUncertain) return [];
    if (!current.alQueue || current.alCursor >= current.alQueue.length) {
      current.alQueue = WhatsAppQuality.sampleUncertain(current.result.messages, current.quality, {
        limit: 30,
        exclude: new Set(current.userLabels.keys()),
      });
      current.alCursor = 0;
    }
    return current.alQueue;
  }

  function labelCurrentAlItem(y) {
    if (!current) return;
    const q = ensureAlQueue();
    const item = q[current.alCursor];
    if (!item) return;
    current.userLabels.set(item.idx, y);
    current.alCursor++;
    // Auto-retrain smoothly once user has at least 4 labels, or update queue view.
    if (current.userLabels.size >= 4) {
      runInBrowserTraining(true);
    } else {
      renderMlModal();
    }
  }

  function skipCurrentAlItem() {
    if (!current) return;
    const q = ensureAlQueue();
    if (current.alCursor < q.length) {
      current.alCursor++;
      renderMlModal();
    }
  }

  function runInBrowserTraining(keepQueue) {
    if (!current || typeof WhatsAppQuality === 'undefined' || !WhatsAppQuality.train) return;
    const res = WhatsAppQuality.train(current.result.messages, current.userLabels, {
      ms: current.msArr,
      preset: current.qualityPreset || 'balanced',
      corpus: current.quality && current.quality._corpus ? current.quality._corpus : undefined,
    });
    current.customModel = res.model;
    if (!current.adjusted) {
      current.adjusted = true;
      if (qualityToggle) qualityToggle.checked = true;
    }
    recomputeQuality({ keepQueue: Boolean(keepQueue) });
    if (mlModal && !mlModal.hidden) renderMlModal();
  }

  function openMlModal(tab) {
    if (!current || !mlModal || !current.quality) return;
    current.mlTab = tab || current.mlTab || 'overview';
    renderMlModal();
    mlModal.hidden = false;
    if (mlCloseBtn) mlCloseBtn.focus();
  }

  function closeMlModal() {
    if (mlModal) mlModal.hidden = true;
  }

  function setMlTab(tab) {
    if (!current) return;
    current.mlTab = tab;
    if (mlBody) mlBody.scrollTop = 0;
    renderMlModal();
  }

  function syncMlTabButtons() {
    const map = [
      [mlTabOverview, 'overview'],
      [mlTabTrain, 'train'],
      [mlTabInspect, 'inspect'],
    ];
    for (const [btn, id] of map) {
      if (!btn) continue;
      const active = current && current.mlTab === id;
      btn.classList.toggle('active', active);
      btn.setAttribute('aria-selected', String(active));
    }
  }

  function renderMlModal() {
    if (!current || !current.quality || !mlBody) return;
    const q = current.quality;
    syncMlTabButtons();

    if (mlModalTitle) mlModalTitle.textContent = '🧪 ML cleaning pipeline';
    if (mlModalSub) {
      const vocab = q.corpus ? numberFmt.format(q.corpus.vocabSize) : '0';
      mlModalSub.textContent = `${q.model.label} · ${numberFmt.format(q.total)} msgs · ${vocab} vocab IDF · 100% on-device`;
    }
    if (mlApplyToggleBtn) {
      mlApplyToggleBtn.textContent = current.adjusted ? '✓ Spam-adjusted ON' : 'Enable spam-adjusted';
      mlApplyToggleBtn.classList.toggle('accent-pill', !current.adjusted);
    }

    mlBody.textContent = '';
    if (current.mlTab === 'train') {
      renderMlTrain(mlBody);
    } else if (current.mlTab === 'inspect') {
      renderMlInspect(mlBody);
    } else {
      renderMlOverview(mlBody);
    }
  }

  function renderMlOverview(container) {
    const q = current.quality;

    // 1. Verdict callout (highlights leaderboard rank flip if one occurred!)
    const verdict = document.createElement('div');
    verdict.className = 'ml-verdict' + (q.leaderFlipped ? ' flip' : '');
    const vText = document.createElement('div');
    vText.className = 'ml-verdict-text';
    const vStrong = document.createElement('strong');
    const vSpan = document.createElement('span');

    if (q.leaderFlipped && q.rawLeader && q.adjLeader) {
      const rawLeadS = q.senders.find((s) => s.sender === q.rawLeader);
      const adjLeadS = q.senders.find((s) => s.sender === q.adjLeader);
      vStrong.textContent = `Rank flip: ${labelFor(q.adjLeader)} takes #1 after cleaning`;
      vSpan.textContent = `${labelFor(q.rawLeader)} led raw counts (${rawLeadS ? rawLeadS.signalPct : 0}% signal), while ${labelFor(q.adjLeader)} sent more substantive messages (${adjLeadS ? adjLeadS.signalPct : 0}% signal).`;
    } else if (q.cleanestSender && q.spammiestSender && q.cleanestSender.sender !== q.spammiestSender.sender) {
      vStrong.textContent = `${formatAdjustedNum(q.adjusted)} substantive messages out of ${numberFmt.format(q.total)} raw`;
      vSpan.textContent = `Cleanest signal: ${labelFor(q.cleanestSender.sender)} (${q.cleanestSender.signalPct}%). Most filtered filler: ${labelFor(q.spammiestSender.sender)} (${100 - q.spammiestSender.signalPct}% discounted).`;
    } else {
      vStrong.textContent = `${formatAdjustedNum(q.adjusted)} substantive messages out of ${numberFmt.format(q.total)} raw`;
      const bits = formatQualityBits(q.counts);
      vSpan.textContent = bits.length ? `Filtered breakdown: ${bits.join(', ')}.` : 'Almost every message in this chat looks substantive.';
    }
    vText.append(vStrong, vSpan);

    const vKpi = document.createElement('div');
    vKpi.className = 'ml-verdict-kpi';
    const kStrong = document.createElement('strong');
    kStrong.textContent = `${q.signalPct}%`;
    const kLbl = document.createElement('span');
    kLbl.textContent = 'chat signal';
    vKpi.append(kStrong, kLbl);
    verdict.append(vText, vKpi);
    container.appendChild(verdict);

    // 2. Model preset selector
    const presetSec = document.createElement('div');
    const pHead = document.createElement('div');
    pHead.className = 'ml-section-head';
    const pTitle = document.createElement('h4');
    pTitle.className = 'ml-section-title';
    pTitle.textContent = 'Scoring profile';
    const pSub = document.createElement('span');
    pSub.className = 'ml-section-sub';
    pSub.textContent = current.customModel ? `Using ${current.customModel.label}` : 'Pick a preset or train your own';
    pHead.append(pTitle, pSub);

    const pRow = document.createElement('div');
    pRow.className = 'ml-presets';
    const presetList = Object.values(WhatsAppQuality.PRESETS || {});
    for (const pr of presetList) {
      const btn = document.createElement('button');
      btn.type = 'button';
      const isAct = !current.customModel && current.qualityPreset === pr.name;
      btn.className = 'ml-preset-btn' + (isAct ? ' active' : '');
      const st = document.createElement('strong');
      st.textContent = pr.label;
      const sp = document.createElement('span');
      sp.textContent = pr.description;
      btn.append(st, sp);
      btn.addEventListener('click', () => {
        current.qualityPreset = pr.name;
        current.customModel = null;
        if (!current.adjusted) {
          current.adjusted = true;
          if (qualityToggle) qualityToggle.checked = true;
        }
        recomputeQuality();
        renderMlModal();
      });
      pRow.appendChild(btn);
    }
    presetSec.append(pHead, pRow);
    container.appendChild(presetSec);

    // 3. Per-sender signal vs spam stacked breakdown
    const senderSec = document.createElement('div');
    const sHead = document.createElement('div');
    sHead.className = 'ml-section-head';
    const sTitle = document.createElement('h4');
    sTitle.className = 'ml-section-title';
    sTitle.textContent = 'Before vs. after by sender';
    const sSub = document.createElement('span');
    sSub.className = 'ml-section-sub';
    sSub.textContent = 'Ranked by substantive weight';
    sHead.append(sTitle, sSub);

    const legend = document.createElement('div');
    legend.className = 'ml-legend';
    const legendItems = [
      ['substantive', 'Substantive'],
      ['reaction', 'Laughs'],
      ['ack', 'Acks'],
      ['burst', 'Burst spam'],
      ['emoji', 'Emoji-only'],
      ['duplicate', 'Dupes'],
      ['media', 'Media/del'],
    ];
    for (const [key, lbl] of legendItems) {
      const it = document.createElement('span');
      it.className = 'ml-legend-item';
      const dot = document.createElement('span');
      dot.className = 'ml-legend-dot';
      dot.style.background = ML_KIND_COLORS[key];
      it.append(dot, lbl);
      legend.appendChild(it);
    }

    const ul = document.createElement('ul');
    ul.className = 'ml-sender-list';
    for (const s of q.senders.slice(0, 10)) {
      const li = document.createElement('li');
      li.className = 'ml-sender-row';

      const top = document.createElement('div');
      top.className = 'ml-sender-top';
      const nm = document.createElement('span');
      nm.className = 'ml-sender-name';
      const chip = document.createElement('span');
      chip.className = 'chip';
      chip.style.background = current.colors.get(s.sender) || '#00a884';
      nm.append(chip, `#${s.adjRank} ${labelFor(s.sender)}`);
      if (s.rankDelta !== 0) {
        const rd = document.createElement('span');
        rd.className = 'rank-delta ' + (s.rankDelta > 0 ? 'up' : 'down');
        rd.textContent = (s.rankDelta > 0 ? '▲' : '▼') + Math.abs(s.rankDelta);
        nm.appendChild(rd);
      }

      const nums = document.createElement('span');
      nums.className = 'ml-sender-nums';
      const stNum = document.createElement('strong');
      stNum.textContent = formatAdjustedNum(s.adjusted);
      nums.append(stNum, ` / ${numberFmt.format(s.raw)} raw · ${s.signalPct}% signal`);
      top.append(nm, nums);

      const stack = document.createElement('div');
      stack.className = 'ml-stack';
      const segs = [
        ['substantive', s.substantive],
        ['reaction', s.reactions],
        ['ack', s.acks],
        ['burst', s.burstSpam],
        ['emoji', s.emojis],
        ['duplicate', s.dupes],
        ['media', s.media + s.deleted],
      ];
      const denom = Math.max(1, s.raw);
      for (const [k, cnt] of segs) {
        if (!cnt) continue;
        const bar = document.createElement('i');
        bar.style.width = ((cnt / denom) * 100).toFixed(2) + '%';
        bar.style.background = ML_KIND_COLORS[k];
        bar.title = `${k}: ${numberFmt.format(cnt)} (${Math.round((cnt / denom) * 100)}%)`;
        stack.appendChild(bar);
      }

      const detail = document.createElement('div');
      detail.className = 'ml-sender-detail';
      const bits = formatQualityBits(s);
      detail.textContent = bits.length ? `Filtered: ${bits.join(' · ')}` : 'Clean record — almost no spam detected';

      li.append(top, stack, detail);
      ul.appendChild(li);
    }
    senderSec.append(sHead, legend, ul);
    container.appendChild(senderSec);

    // 4. Score distribution histogram (10 bins from 0.0 to 1.0)
    if (q.histogram && q.histogram.length === 10) {
      const hWrap = document.createElement('div');
      hWrap.className = 'ml-hist-wrap';
      const hHead = document.createElement('div');
      hHead.className = 'ml-section-head';
      const hTitle = document.createElement('h4');
      hTitle.className = 'ml-section-title';
      hTitle.textContent = 'Predicted score distribution P(substantive | x)';
      const hSub = document.createElement('span');
      hSub.className = 'ml-section-sub';
      hSub.textContent = 'Left = filler · Right = substantive';
      hHead.append(hTitle, hSub);

      const hist = document.createElement('div');
      hist.className = 'ml-hist';
      const maxBin = Math.max(1, ...q.histogram);
      q.histogram.forEach((cnt, idx) => {
        const col = document.createElement('div');
        col.className = 'ml-hist-col';
        const bar = document.createElement('span');
        bar.className = 'ml-hist-bar';
        bar.style.height = Math.max(5, Math.round((cnt / maxBin) * 100)) + '%';
        bar.style.background = idx < 3 ? '#e56399' : idx < 6 ? '#f0b429' : '#00a884';
        bar.title = `${(idx / 10).toFixed(1)}–${((idx + 1) / 10).toFixed(1)}: ${numberFmt.format(cnt)} msgs`;
        col.appendChild(bar);
        hist.appendChild(col);
      });

      const axis = document.createElement('div');
      axis.className = 'ml-hist-axis';
      axis.innerHTML = '<span>0.0 (spam)</span><span>0.5 (borderline)</span><span>1.0 (substantive)</span>';
      hWrap.append(hHead, hist, axis);
      container.appendChild(hWrap);
    }
  }

  function renderMlTrain(container) {
    const q = current.quality;
    const queue = ensureAlQueue();
    const item = queue[current.alCursor] || null;

    // 1. Active Learning labeling box
    const alBox = document.createElement('div');
    alBox.className = 'ml-al-box';

    const alHead = document.createElement('div');
    alHead.className = 'ml-section-head';
    const alTitle = document.createElement('h4');
    alTitle.className = 'ml-section-title';
    alTitle.textContent = 'Active learning: teach the model your chat';
    const alSub = document.createElement('span');
    alSub.className = 'ml-section-sub';
    alSub.textContent = `${current.userLabels.size} labeled · uncertainty sampling`;
    alHead.append(alTitle, alSub);
    alBox.appendChild(alHead);

    if (item) {
      const m = current.result.messages[item.idx];
      const bub = document.createElement('div');
      bub.className = 'ml-al-bubble';

      const meta = document.createElement('div');
      meta.className = 'ml-al-meta';
      const senderSp = document.createElement('span');
      senderSp.className = 'ml-al-sender';
      senderSp.style.color = current.colors.get(m.sender) || '#00a884';
      senderSp.textContent = labelFor(m.sender);
      const tsSp = document.createElement('span');
      tsSp.textContent = `${m.ts} · #${numberFmt.format(item.idx + 1)}`;
      meta.append(senderSp, tsSp);

      const txt = document.createElement('p');
      txt.className = 'ml-al-text';
      txt.textContent = textFor(m.text);

      const scoreRow = document.createElement('div');
      scoreRow.className = 'ml-al-score-row';
      const curW = q.weights[item.idx];
      const exp = WhatsAppQuality.explain(m, { prevBySender: new Map(), ms: null, corpus: q._corpus }, activeQualityModel());
      scoreRow.textContent = `Current prediction: ${Math.round(curW * 100)}% substantive (${q.kinds[item.idx]})` +
        (exp.topReasons.length ? ` · ${exp.topReasons.join(', ')}` : '');

      bub.append(meta, txt, scoreRow);
      alBox.appendChild(bub);

      const acts = document.createElement('div');
      acts.className = 'ml-al-actions';

      const btnSpam = document.createElement('button');
      btnSpam.type = 'button';
      btnSpam.className = 'pill-action ml-btn-spam';
      btnSpam.append('✗ Spam / filler');
      const k1 = document.createElement('span'); k1.className = 'ml-kbd'; k1.textContent = '1';
      btnSpam.appendChild(k1);
      btnSpam.addEventListener('click', () => labelCurrentAlItem(0));

      const btnReal = document.createElement('button');
      btnReal.type = 'button';
      btnReal.className = 'pill-action ml-btn-real';
      btnReal.append('✓ Substantive');
      const k2 = document.createElement('span'); k2.className = 'ml-kbd'; k2.textContent = '2';
      btnReal.appendChild(k2);
      btnReal.addEventListener('click', () => labelCurrentAlItem(1));

      const btnSkip = document.createElement('button');
      btnSkip.type = 'button';
      btnSkip.className = 'pill-action';
      btnSkip.append('Skip');
      const ks = document.createElement('span'); ks.className = 'ml-kbd'; ks.textContent = 'S';
      btnSkip.appendChild(ks);
      btnSkip.addEventListener('click', skipCurrentAlItem);

      acts.append(btnSpam, btnReal, btnSkip);
      alBox.appendChild(acts);
    } else {
      const doneP = document.createElement('p');
      doneP.className = 'ml-section-sub';
      doneP.style.margin = '0';
      doneP.textContent = 'You reviewed all sampled borderline messages! Train the model below or reset to start fresh.';
      alBox.appendChild(doneP);
    }

    const trainBar = document.createElement('div');
    trainBar.className = 'ml-train-bar';
    const statusTxt = document.createElement('span');
    statusTxt.className = 'ml-section-sub';
    statusTxt.textContent = current.userLabels.size >= 4
      ? 'Model auto-retrains with your labels (L2 MAP logistic regression).'
      : 'Label 4+ borderline messages or run one-click auto-calibration.';

    const tBtns = document.createElement('div');
    tBtns.className = 'ml-train-btns';

    const trainBtn = document.createElement('button');
    trainBtn.type = 'button';
    trainBtn.className = 'pill-action accent-pill';
    trainBtn.textContent = current.userLabels.size ? `Train on ${current.userLabels.size} labels` : 'Auto-calibrate on chat';
    trainBtn.addEventListener('click', () => runInBrowserTraining(false));

    tBtns.appendChild(trainBtn);
    if (current.customModel || current.userLabels.size) {
      const resetBtn = document.createElement('button');
      resetBtn.type = 'button';
      resetBtn.className = 'pill-action';
      resetBtn.textContent = 'Reset weights';
      resetBtn.addEventListener('click', () => {
        current.customModel = null;
        current.userLabels.clear();
        recomputeQuality();
        renderMlModal();
      });
      tBtns.appendChild(resetBtn);
    }

    trainBar.append(statusTxt, tBtns);
    alBox.appendChild(trainBar);
    container.appendChild(alBox);

    // 2. Training metrics + SVG Loss Curve (shown once trained)
    const metrics = q.model && q.model.metrics;
    if (metrics) {
      const mGrid = document.createElement('div');
      mGrid.className = 'ml-metrics-grid';
      const cards = [
        [`${Math.round(metrics.accuracy * 100)}%`, 'val accuracy'],
        [metrics.f1.toFixed(2), 'F1 score'],
        [metrics.rocAuc != null ? metrics.rocAuc.toFixed(3) : '—', 'ROC-AUC'],
        [metrics.userAccuracy != null ? `${Math.round(metrics.userAccuracy * 100)}%` : `${metrics.epochs}`, metrics.userAccuracy != null ? `your ${metrics.userCount} labels` : 'GD epochs'],
      ];
      for (const [val, lbl] of cards) {
        const c = document.createElement('div');
        c.className = 'ml-metric-card';
        const st = document.createElement('strong'); st.textContent = val;
        const sp = document.createElement('span'); sp.textContent = lbl;
        c.append(st, sp);
        mGrid.appendChild(c);
      }
      container.appendChild(mGrid);

      if (metrics.lossHistory && metrics.lossHistory.length >= 2) {
        const lossBox = document.createElement('div');
        lossBox.className = 'ml-loss-box';
        const lHead = document.createElement('div');
        lHead.className = 'ml-section-head';
        const lTitle = document.createElement('h4');
        lTitle.className = 'ml-section-title';
        lTitle.textContent = 'Training loss curve (regularized cross-entropy)';
        const lSub = document.createElement('span');
        lSub.className = 'ml-section-sub';
        lSub.textContent = `${metrics.initialLoss.toFixed(3)} → ${metrics.finalLoss.toFixed(3)} (${metrics.trainCount} train rows)`;
        lHead.append(lTitle, lSub);

        const hist = metrics.lossHistory;
        const maxL = Math.max(...hist, 0.001);
        const minL = Math.min(...hist, 0);
        const span = Math.max(0.001, maxL - minL);
        const W = 400, H = 56, pad = 6;
        const pts = hist.map((v, i) => {
          const x = pad + ((W - pad * 2) * i) / (hist.length - 1);
          const y = H - pad - ((H - pad * 2) * (v - minL)) / span;
          return `${x.toFixed(1)},${y.toFixed(1)}`;
        }).join(' ');
        const svgNS = 'http://www.w3.org/2000/svg';
        const svg = document.createElementNS(svgNS, 'svg');
        svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
        svg.setAttribute('class', 'ml-loss-svg');
        const poly = document.createElementNS(svgNS, 'polyline');
        poly.setAttribute('fill', 'none');
        poly.setAttribute('stroke', '#00a884');
        poly.setAttribute('stroke-width', '2.5');
        poly.setAttribute('stroke-linecap', 'round');
        poly.setAttribute('stroke-linejoin', 'round');
        poly.setAttribute('points', pts);
        svg.appendChild(poly);

        lossBox.append(lHead, svg);
        container.appendChild(lossBox);
      }
    }

    // 3. Learned Feature Weights diverging bar chart
    const wWrap = document.createElement('div');
    wWrap.className = 'ml-weights';
    const wHead = document.createElement('div');
    wHead.className = 'ml-section-head';
    const wTitle = document.createElement('h4');
    wTitle.className = 'ml-section-title';
    wTitle.textContent = `Feature weights (bias = ${q.model.bias.toFixed(2)})`;
    const wSub = document.createElement('span');
    wSub.className = 'ml-section-sub';
    wSub.textContent = 'Pink = spam signal · Green = substantive';
    wHead.append(wTitle, wSub);
    wWrap.appendChild(wHead);

    const wEntries = Object.keys(q.model.weights)
      .map((k) => ({ key: k, label: (WhatsAppQuality.FEATURE_META[k] && WhatsAppQuality.FEATURE_META[k].label) || k, val: q.model.weights[k] }))
      .sort((a, b) => Math.abs(b.val) - Math.abs(a.val));
    const maxAbs = Math.max(1, ...wEntries.map((e) => Math.abs(e.val)));

    for (const e of wEntries) {
      const row = document.createElement('div');
      row.className = 'ml-w-row';
      const lbl = document.createElement('span');
      lbl.className = 'ml-w-lbl';
      lbl.textContent = e.label;
      lbl.title = e.key;

      const track = document.createElement('span');
      track.className = 'ml-w-track';
      const center = document.createElement('i');
      center.className = 'ml-w-center';
      const fill = document.createElement('i');
      fill.className = 'ml-w-fill ' + (e.val >= 0 ? 'pos' : 'neg');
      fill.style.width = ((Math.abs(e.val) / maxAbs) * 50).toFixed(1) + '%';
      track.append(center, fill);

      const val = document.createElement('span');
      val.className = 'ml-w-val';
      val.textContent = (e.val >= 0 ? '+' : '−') + Math.abs(e.val).toFixed(2);
      row.append(lbl, track, val);
      wWrap.appendChild(row);
    }
    container.appendChild(wWrap);
  }

  function renderMlInspect(container) {
    const q = current.quality;
    const model = activeQualityModel();

    // 1. Live Message Sandbox + exact log-odds feature waterfall
    const box = document.createElement('div');
    box.className = 'ml-sandbox';

    const head = document.createElement('div');
    head.className = 'ml-section-head';
    const title = document.createElement('h4');
    title.className = 'ml-section-title';
    title.textContent = 'Test any message live';
    const sub = document.createElement('span');
    sub.className = 'ml-section-sub';
    sub.textContent = 'Exact log-odds feature attribution';
    head.append(title, sub);

    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'ml-sandbox-input';
    input.placeholder = 'Try "haha omg 😂" or "wait are we still on for ramen at 7pm?"';
    input.value = current.sandboxText || 'haha omg 😂';

    const flagsRow = document.createElement('div');
    flagsRow.className = 'ml-sandbox-flags';

    const makeFlag = (lblText, checked, onChange) => {
      const lbl = document.createElement('label');
      lbl.className = 'mini-check';
      const cb = document.createElement('input');
      cb.type = 'checkbox';
      cb.checked = checked;
      cb.addEventListener('change', () => onChange(cb.checked));
      const sp = document.createElement('span');
      sp.textContent = lblText;
      lbl.append(cb, sp);
      return lbl;
    };

    const resultRow = document.createElement('div');
    resultRow.className = 'ml-sandbox-result';
    const wf = document.createElement('div');
    wf.className = 'ml-waterfall';

    const updateSandbox = () => {
      const txt = input.value;
      current.sandboxText = txt;
      const prevMap = new Map();
      const nowMs = 1000000;
      if (current.sandboxDup) {
        const norm = txt.toLowerCase().replace(/\s+/g, ' ').trim();
        prevMap.set('Sandbox', { norm, canon: norm, ms: nowMs - 5000, recent: [{ norm, canon: norm, ms: nowMs - 5000 }] });
      } else if (current.sandboxBurst) {
        prevMap.set('Sandbox', { norm: '__prev__', canon: '__prev__', ms: nowMs - 2000, recent: [{ norm: '__prev__', canon: '__prev__', ms: nowMs - 2000 }] });
      }
      const ctx = {
        prevBySender: prevMap,
        lastSender: current.sandboxBurst ? 'Sandbox' : null,
        lastMs: current.sandboxBurst ? nowMs - 2000 : null,
        runLen: current.sandboxBurst ? 3 : 0,
        shortRunLen: current.sandboxBurst ? 3 : 0,
        ms: nowMs,
        corpus: q._corpus,
      };
      const exp = WhatsAppQuality.explain({ sender: 'Sandbox', text: txt }, ctx, model);

      resultRow.textContent = '';
      const left = document.createElement('strong');
      left.textContent = `Score: ${(exp.score * 100).toFixed(1)}% · ${exp.kind}`;
      left.style.color = exp.score >= 0.65 ? '#00a884' : exp.score < 0.35 ? '#e56399' : '#f0b429';
      const right = document.createElement('span');
      right.className = 'ml-section-sub';
      right.textContent = Number.isFinite(exp.logit) ? `z = ${exp.logit.toFixed(2)} → σ(z) = ${exp.score.toFixed(3)}` : 'hard rule → 0';
      resultRow.append(left, right);

      wf.textContent = '';
      const bRow = document.createElement('div');
      bRow.className = 'ml-wf-row';
      const bL = document.createElement('span'); bL.textContent = 'Model intercept (bias)';
      const bV = document.createElement('span');
      bV.className = exp.bias >= 0 ? 'pos' : 'neg';
      bV.textContent = (exp.bias >= 0 ? '+' : '−') + Math.abs(exp.bias).toFixed(2);
      bRow.append(bL, bV);
      wf.appendChild(bRow);

      for (const c of exp.contributions.slice(0, 8)) {
        const r = document.createElement('div');
        r.className = 'ml-wf-row';
        const l = document.createElement('span');
        l.textContent = `${c.label} (x=${c.value})`;
        const v = document.createElement('span');
        v.className = c.delta >= 0 ? 'pos' : 'neg';
        v.textContent = (c.delta >= 0 ? '+' : '−') + Math.abs(c.delta).toFixed(2);
        r.append(l, v);
        wf.appendChild(r);
      }
    };

    flagsRow.append(
      makeFlag('4th msg in rapid burst', current.sandboxBurst, (v) => { current.sandboxBurst = v; updateSandbox(); }),
      makeFlag('Repeated within 2 min', current.sandboxDup, (v) => { current.sandboxDup = v; updateSandbox(); })
    );
    input.addEventListener('input', updateSandbox);
    box.append(head, input, flagsRow, resultRow, wf);
    container.appendChild(box);
    updateSandbox();

    // 2. Real Chat Example Auditor (click any message to jump to Moment Peek)
    const auditSec = document.createElement('div');
    const aHead = document.createElement('div');
    aHead.className = 'ml-section-head';
    const aTitle = document.createElement('h4');
    aTitle.className = 'ml-section-title';
    aTitle.textContent = 'Audit real messages from this chat';
    const aSub = document.createElement('span');
    aSub.className = 'ml-section-sub';
    aSub.textContent = 'Click any row to peek in context';
    aHead.append(aTitle, aSub);

    const filterRow = document.createElement('div');
    filterRow.className = 'ml-audit-filters';
    const filters = [
      ['borderline', 'Borderline'],
      ['reaction', 'Laughs'],
      ['ack', 'Acks'],
      ['burst', 'Burst spam'],
      ['duplicate', 'Dupes'],
      ['substantive', 'Top substantive'],
    ];
    for (const [id, lbl] of filters) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'pill-btn' + (current.inspectFilter === id ? ' active' : '');
      btn.textContent = lbl;
      btn.addEventListener('click', () => {
        current.inspectFilter = id;
        renderMlModal();
      });
      filterRow.appendChild(btn);
    }

    const list = document.createElement('ul');
    list.className = 'ml-audit-list';
    const msgs = current.result.messages;
    const picked = [];
    const stride = msgs.length > 8000 ? Math.floor(msgs.length / 8000) : 1;
    const seen = new Set();

    for (let i = 0; i < msgs.length; i += stride) {
      const k = q.kinds[i];
      const w = q.weights[i];
      if (k === 'media' || k === 'deleted') continue;
      if (current.inspectFilter === 'borderline') {
        if (w < 0.25 || w > 0.75) continue;
      } else if (current.inspectFilter === 'substantive') {
        if (k !== 'substantive' || w < 0.85) continue;
      } else if (k !== current.inspectFilter) {
        continue;
      }
      const norm = msgs[i].text.trim().toLowerCase();
      if (seen.has(norm)) continue;
      seen.add(norm);
      picked.push({ idx: i, w, k });
      if (picked.length >= 60) break;
    }

    if (current.inspectFilter === 'borderline') {
      picked.sort((a, b) => Math.abs(a.w - 0.5) - Math.abs(b.w - 0.5));
    } else if (current.inspectFilter === 'substantive') {
      picked.sort((a, b) => b.w - a.w);
    } else {
      picked.sort((a, b) => a.w - b.w);
    }

    if (!picked.length) {
      const empty = document.createElement('p');
      empty.className = 'ml-section-sub';
      empty.textContent = 'No messages in this category for the current filter.';
      auditSec.append(aHead, filterRow, empty);
    } else {
      for (const it of picked.slice(0, 10)) {
        const m = msgs[it.idx];
        const li = document.createElement('li');
        li.className = 'ml-audit-item';
        const top = document.createElement('div');
        top.className = 'ml-audit-top';
        const who = document.createElement('span');
        who.style.color = current.colors.get(m.sender) || '#00a884';
        who.style.fontWeight = '600';
        who.textContent = `${labelFor(m.sender)} · ${m.ts}`;
        const sc = document.createElement('span');
        sc.textContent = `${Math.round(it.w * 100)}% (${it.k})`;
        top.append(who, sc);

        const body = document.createElement('div');
        body.className = 'ml-audit-body';
        const t = textFor(m.text).replace(/\s+/g, ' ');
        body.textContent = t.length > 140 ? t.slice(0, 140) + '…' : t;

        const exp = WhatsAppQuality.explain(m, { prevBySender: new Map(), ms: null, corpus: q._corpus }, model);
        const reasons = document.createElement('div');
        reasons.className = 'ml-audit-reasons';
        reasons.textContent = exp.topReasons.join(' · ');

        li.append(top, body, reasons);
        li.addEventListener('click', () => {
          closeMlModal();
          openPeek(it.idx, `ML audit · ${Math.round(it.w * 100)}% (${it.k})`);
        });
        list.appendChild(li);
      }
      auditSec.append(aHead, filterRow, list);
    }
    container.appendChild(auditSec);
  }

  function exportQualityCSV() {
    if (!current || typeof WhatsAppQuality === 'undefined' || !WhatsAppQuality.toCSV) return;
    const csv = WhatsAppQuality.toCSV(current.result.messages, {
      ms: current.msArr,
      model: activeQualityModel(),
      corpus: current.quality && current.quality._corpus ? current.quality._corpus : undefined,
      userLabels: current.userLabels,
    });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const yearTag = current.selectedYear ? '-' + current.selectedYear : '';
    const base = current.anon ? 'anonymized-chat' : (current.name || 'whatsapp-chat').replace(/\.(txt|zip)$/i, '');
    triggerDownload(blob, `${base}${yearTag}-ml-features.csv`);
    if (mlExportCsvBtn) {
      const prev = mlExportCsvBtn.textContent;
      mlExportCsvBtn.textContent = 'Downloaded ✓';
      setTimeout(() => { mlExportCsvBtn.textContent = prev; }, 1600);
    }
  }

  async function copyQualityModelJSON() {
    if (!current || !current.quality) return;
    const payload = JSON.stringify({
      name: current.quality.model.name,
      label: current.quality.model.label,
      bias: current.quality.model.bias,
      weights: current.quality.model.weights,
      metrics: current.quality.model.metrics || undefined,
    }, null, 2);
    let ok = false;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      try {
        await navigator.clipboard.writeText(payload);
        ok = true;
      } catch {
        ok = false;
      }
    }
    if (!ok) {
      const ta = document.createElement('textarea');
      ta.value = payload;
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      try { ok = document.execCommand('copy'); } catch { ok = false; }
      ta.remove();
    }
    if (mlCopyModelBtn) {
      const prev = mlCopyModelBtn.textContent;
      mlCopyModelBtn.textContent = ok ? 'Copied JSON ✓' : 'Copy failed';
      setTimeout(() => { mlCopyModelBtn.textContent = prev; }, 1600);
    }
  }

  function renderVibes() {
    if (!vibeList || !current) return;
    const { onThisDay, quality, adjusted } = current;
    const insights = activeInsights();
    const items = [];

    if (adjusted && quality && current.result.senders.length >= 2) {
      if (quality.leaderFlipped && quality.adjLeader) {
        items.push({
          id: 'qualityFlip',
          prefix: '🏆 rank flip',
          value: `${labelFor(quality.adjLeader)} takes #1`,
          title: 'Open ML Lab to see how cleaning flipped the leaderboard',
          onClick: () => openMlModal('overview'),
        });
      } else if (quality.cleanestSender) {
        items.push({
          id: 'qualityClean',
          prefix: '🧹 cleanest signal',
          value: `${labelFor(quality.cleanestSender.sender)} (${quality.cleanestSender.signalPct}%)`,
          title: 'Open ML Lab to inspect per-sender signal vs spam',
          onClick: () => openMlModal('overview'),
        });
      }
    }

    if (onThisDay && onThisDay.total > 0 && onThisDay.years.length) {
      const latest = onThisDay.years[0];
      items.push({
        id: 'onThisDay',
        prefix: `🎂 on ${onThisDay.label}`,
        value: `${numberFmt.format(onThisDay.total)} msg${onThisDay.total === 1 ? '' : 's'} (${onThisDay.years.map((y) => y.year).join(', ')})`,
        title: 'Peek at memories from this exact date in past years',
        onClick: () => {
          openPeek(latest.firstIdx, `🎂 On this day · ${onThisDay.label} ${latest.year}`);
        },
      });
    }
    if (insights.chaosPeak) {
      const cp = insights.chaosPeak;
      items.push({
        id: 'chaosPeak',
        prefix: '⚡ chaos peak',
        value: `${numberFmt.format(cp.count)} msgs in ${cp.durationMin}m`,
        title: `Highlight and peek at the wildest 5-minute burst (${cp.startTs})`,
        onClick: () => {
          if (current.activeVibe === 'chaosPeak') {
            clearSpotlight();
            return;
          }
          current.activeVibe = 'chaosPeak';
          setSpotlightRange(`⚡ Chaos peak (${cp.count} in ${cp.durationMin}m)`, cp.startIdx, cp.endIdx);
          syncVibeActive();
          openPeek(cp.startIdx, `⚡ Chaos peak · ${cp.count} msgs in ${cp.durationMin}m`);
        },
      });
    }
    if (insights.comedian && current.result.senders.length >= 2) {
      const cm = insights.comedian;
      items.push({
        id: 'comedian',
        prefix: '🎭 comedian',
        value: `${labelFor(cm.sender)} (×${numberFmt.format(cm.count)})`,
        title: cm.punchlineIdx !== null ? 'Peek at one of their laugh-triggering punchlines' : 'Highlight comedian',
        onClick: () => {
          if (cm.punchlineIdx !== null) {
            openPeek(cm.punchlineIdx, `🎭 Punchline by ${labelFor(cm.sender)}`);
          } else {
            toggleSenderDossier(cm.sender);
          }
        },
      });
    }
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
    for (const item of items.slice(0, adjusted ? 8 : 7)) {
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
    } else if (current.adjusted && current.quality) {
      const bySender = new Map(current.quality.senders.map((x) => [x.sender, x]));
      list = result.senders
        .map((s) => {
          const qs = bySender.get(s.sender);
          return { sender: s.sender, count: qs ? qs.adjusted : s.count, raw: s.count, qs: qs || null };
        })
        .sort((a, b) => b.count - a.count || a.sender.localeCompare(b.sender));
      totalForBar = Math.max(1, current.quality.adjusted);
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
      if (s.qs) {
        // 🧹 spam-adjusted mode: show weighted count + signal % + rank-delta badge
        const wrap = document.createElement('span');
        wrap.className = 'count-wrap';

        if (s.qs.rankDelta !== 0) {
          const delta = document.createElement('span');
          delta.className = 'rank-delta ' + (s.qs.rankDelta > 0 ? 'up' : 'down');
          delta.textContent = (s.qs.rankDelta > 0 ? '▲' : '▼') + Math.abs(s.qs.rankDelta);
          delta.title = `Raw rank #${s.qs.rawRank} → Adjusted rank #${s.qs.adjRank}`;
          wrap.appendChild(delta);
        }

        const sig = document.createElement('span');
        sig.className = 'signal-tag';
        sig.textContent = `${s.qs.signalPct}%`;
        sig.title = `${s.qs.signalPct}% substantive signal (${formatAdjustedNum(s.qs.adjusted)} of ${numberFmt.format(s.qs.raw)} raw)`;
        wrap.appendChild(sig);

        const numEl = document.createElement('span');
        numEl.textContent = formatAdjustedNum(s.count);
        wrap.appendChild(numEl);

        count.appendChild(wrap);
        const bits = [`${numberFmt.format(s.qs.raw)} raw`, `${s.qs.signalPct}% signal`].concat(formatQualityBits(s.qs));
        count.title = '🧹 ' + bits.join(' · ');
      } else {
        count.textContent = raceFrame && current.adjusted ? formatAdjustedNum(s.count) : numberFmt.format(s.count);
      }

      const bar = document.createElement('span');
      bar.className = 'bar';
      const color = current.colors.get(s.sender);
      if (s.qs) {
        // Ghost bar shows raw share behind the solid substantive bar.
        const rawFill = document.createElement('i');
        rawFill.className = 'bar-raw';
        rawFill.style.width = ((s.raw / Math.max(1, result.total)) * 100).toFixed(2) + '%';
        rawFill.style.background = color;
        bar.appendChild(rawFill);

        const fill = document.createElement('i');
        fill.className = 'bar-adj';
        fill.style.width = ((s.count / totalForBar) * 100).toFixed(2) + '%';
        fill.style.background = color;
        bar.appendChild(fill);
      } else {
        const fill = document.createElement('i');
        const pct = (s.count / totalForBar) * 100;
        fill.style.width = pct.toFixed(2) + '%';
        fill.style.background = color;
        bar.appendChild(fill);
      }

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
    const ins = activeInsights();
    const st = (ins.senderStats && ins.senderStats[sender]) || null;
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

    if (current.quality) {
      const qs = current.quality.senders.find((x) => x.sender === sender);
      if (qs) {
        const adj = formatAdjustedNum(qs.adjusted);
        const bits = formatQualityBits(qs);
        const rankNote = qs.rankDelta > 0 ? ` · ▲${qs.rankDelta}` : qs.rankDelta < 0 ? ` · ▼${Math.abs(qs.rankDelta)}` : '';
        addStat(
          `${qs.signalPct}% (${adj} / ${numberFmt.format(qs.raw)})`,
          bits.length ? `signal 🧹${rankNote} (${bits.slice(0, 3).join(', ')})` : `signal 🧹${rankNote}`,
          () => openMlModal('overview')
        );
      }
    }

    if (st) {
      if (st.medianReplyMs !== null) addStat(formatDuration(st.medianReplyMs), 'median reply');
      addStat(`${numberFmt.format(st.avgChars)} ch`, 'avg length');
      addStat(`${st.avgBurst}× (max ${st.maxBurst})`, 'msgs per turn');
      if (current.result.senders.length >= 2) {
        addStat(`${st.starts} / ${st.lastWords}`, 'starts / last word');
      }
      if (st.laughsTriggered) {
        addStat(
          `🎭 ×${numberFmt.format(st.laughsTriggered)}`,
          'laughs triggered',
          st.bestPunchlineIdx !== null
            ? () => openPeek(st.bestPunchlineIdx, `🎭 Punchline by ${labelFor(sender)}`)
            : null
        );
      }
      if (current.result.senders.length >= 3 && st.bestie) {
        addStat(
          `${labelFor(st.bestie.partner)} (${st.bestie.pct}%)`,
          'top reply buddy'
        );
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

  /* ---------- Group Ping-Pong & Group Lore cards ---------- */

  function renderGroupExtras() {
    if (!groupExtras || !current) return;
    const { result } = current;
    const insights = activeInsights();
    let shownAny = false;

    // 1. Ping-Pong: Who talks to whom (for 3+ person group chats)
    const pp = insights.pingPong;
    const showPingPong = result.senders.length >= 3 && pp && pp.pairs && pp.pairs.length > 0 && pp.totalExchanges >= 2;
    if (pingPongCard && pingPongList) {
      pingPongCard.hidden = !showPingPong;
      if (showPingPong) {
        shownAny = true;
        if (pingPongSub) {
          pingPongSub.textContent = `${numberFmt.format(pp.totalExchanges)} back-and-forths`;
        }
        pingPongList.textContent = '';
        const topCount = Math.max(1, pp.pairs[0].count);
        for (const pair of pp.pairs.slice(0, 5)) {
          const li = document.createElement('li');
          li.className = 'pingpong-row';

          const top = document.createElement('div');
          top.className = 'pingpong-top';
          const pairSpan = document.createElement('span');
          pairSpan.className = 'pingpong-pair';

          const dotA = document.createElement('span');
          dotA.className = 'dot';
          dotA.style.background = current.colors.get(pair.a) || '#00a884';
          const dotB = document.createElement('span');
          dotB.className = 'dot';
          dotB.style.background = current.colors.get(pair.b) || '#53bdeb';
          const arrow = document.createElement('span');
          arrow.className = 'pingpong-arrow';
          arrow.textContent = '↔';

          pairSpan.append(dotA, labelFor(pair.a), arrow, dotB, labelFor(pair.b));

          const meta = document.createElement('span');
          meta.className = 'pingpong-meta';
          meta.textContent = `${numberFmt.format(pair.count)} (${pair.pct}%)`;

          top.append(pairSpan, meta);

          const bar = document.createElement('span');
          bar.className = 'pingpong-bar';
          const fill = document.createElement('i');
          fill.style.width = ((pair.count / topCount) * 100).toFixed(1) + '%';
          fill.style.background = `linear-gradient(90deg, ${current.colors.get(pair.a) || '#00a884'}, ${current.colors.get(pair.b) || '#53bdeb'})`;
          bar.appendChild(fill);

          li.append(top, bar);
          pingPongList.appendChild(li);
        }
      }
    }

    // 2. Group Lore: subject creation & renames from system notes
    const lore = insights.groupLore;
    const showLore = Boolean(lore && lore.changes && lore.changes.length > 0);
    if (groupLoreCard && groupLoreList) {
      groupLoreCard.hidden = !showLore;
      if (showLore) {
        shownAny = true;
        if (groupLoreSub) {
          const who = lore.topRenamer
            ? ` · top renamer: ${labelFor(lore.topRenamer.actor)} (×${lore.topRenamer.count})`
            : '';
          groupLoreSub.textContent = `${lore.changes.length} name${lore.changes.length === 1 ? '' : 's'}${who}`;
        }
        groupLoreList.textContent = '';
        for (const ch of lore.changes.slice(0, 12)) {
          const li = document.createElement('li');
          li.className = 'lore-item';
          const subj = document.createElement('span');
          subj.className = 'lore-subject';
          subj.textContent = `“${textFor(ch.subject)}”`;
          const meta = document.createElement('span');
          meta.className = 'lore-meta';
          const actorLabel = current.map.has(ch.actor) ? labelFor(ch.actor) : textFor(ch.actor);
          meta.textContent = `${ch.kind === 'created' ? 'created by' : 'renamed by'} ${actorLabel} · ${ch.ts}`;
          li.append(subj, meta);
          groupLoreList.appendChild(li);
        }
      }
    }

    groupExtras.hidden = !shownAny;
  }

  /* ---------- chat race (time-lapse sender replay) ---------- */

  function buildRaceFrames() {
    const msgs = current.result.messages;
    const n = msgs.length;
    const useWeights = Boolean(current.adjusted && current.quality && current.quality.weights);
    const qWeights = useWeights ? current.quality.weights : null;
    const targetFrames = Math.min(n, 60);
    const step = n / targetFrames;
    const counts = new Map();
    const frames = [];
    let nextCut = 0;

    for (let i = 0; i < n; i++) {
      const s = msgs[i].sender;
      const inc = qWeights ? (qWeights[i] || 0) : 1;
      counts.set(s, (counts.get(s) || 0) + inc);
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

    function playRaceFrameSound(frame, prevFrame) {
      if (!soundEnabled || !frame) return;
      let bestSender = null;
      let bestDelta = 0;
      for (const [s, c] of frame.counts) {
        const prev = prevFrame ? (prevFrame.counts.get(s) || 0) : 0;
        const delta = c - prev;
        if (delta > bestDelta) {
          bestDelta = delta;
          bestSender = s;
        }
      }
      if (bestSender) {
        const weight = Math.min(1, 0.35 + Math.log2(1 + bestDelta) / 6);
        playSenderNote(bestSender, weight);
      }
    }

    function step(now) {
      if (!current || !current.race || !current.race.playing) return;
      if (now - r.lastTick >= msPerFrame) {
        r.lastTick = now;
        const prevF = r.frameIdx > 0 ? r.frames[r.frameIdx - 1] : null;
        const f = r.frames[r.frameIdx];
        if (raceStatus) raceStatus.textContent = `race · ${f.ts} (${numberFmt.format(f.idx + 1)} msgs)`;
        if (raceFill) raceFill.style.width = f.pct.toFixed(1) + '%';
        buildSenderRows(current.result, f);
        playRaceFrameSound(f, prevF);
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
    playRaceFrameSound(f0, null);
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
    renderWordDuelBar();
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
    renderWordDuelBar();
    drawStrip(1);
  }

  function renderWordDuelBar() {
    if (!wordDuelBar || !current) return;
    wordDuelBar.textContent = '';

    const sw = current.spotlightWord;
    if (sw && sw.hits > 0 && sw.breakdown && sw.breakdown.length && current.result.senders.length >= 2) {
      const wrap = document.createElement('div');
      wrap.className = 'duel-wrap';

      const track = document.createElement('div');
      track.className = 'duel-track';
      for (const entry of sw.breakdown) {
        const seg = document.createElement('span');
        seg.className = 'duel-seg';
        seg.style.width = ((entry.count / sw.hits) * 100).toFixed(2) + '%';
        seg.style.background = current.colors.get(entry.sender) || '#00a884';
        seg.title = `${labelFor(entry.sender)}: ${numberFmt.format(entry.count)} (${entry.pct}%)`;
        track.appendChild(seg);
      }

      const legend = document.createElement('div');
      legend.className = 'duel-legend';
      const topTag = document.createElement('span');
      topTag.textContent = `“${sw.word}” split:`;
      legend.appendChild(topTag);
      for (const entry of sw.breakdown.slice(0, 4)) {
        const item = document.createElement('span');
        item.className = 'duel-item';
        const dot = document.createElement('span');
        dot.className = 'dot';
        dot.style.background = current.colors.get(entry.sender) || '#00a884';
        const strong = document.createElement('strong');
        strong.textContent = labelFor(entry.sender);
        item.append(dot, strong, ` ${entry.pct}% (${numberFmt.format(entry.count)})`);
        legend.appendChild(item);
      }

      wrap.append(track, legend);
      wordDuelBar.appendChild(wrap);
      wordDuelBar.hidden = false;
      return;
    }

    // Otherwise show mischievous quick-preset pills
    const row = document.createElement('div');
    row.className = 'word-presets';
    const lbl = document.createElement('span');
    lbl.textContent = 'try a word duel:';
    row.appendChild(lbl);
    for (const preset of WORD_PRESETS) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'word-preset-btn';
      btn.textContent = preset;
      btn.addEventListener('click', () => setSpotlightWord(preset));
      row.appendChild(btn);
    }
    wordDuelBar.appendChild(row);
    wordDuelBar.hidden = false;
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
    const breakdown = [];
    for (const [s, c] of bySender) {
      if (c > topCount) { topCount = c; topSender = s; }
      breakdown.push({ sender: s, count: c, pct: hits ? Math.round((c / hits) * 100) : 0 });
    }
    breakdown.sort((a, b) => b.count - a.count || a.sender.localeCompare(b.sender));

    current.spotlightWord = { word, flags, hits, topSender, breakdown };
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
    renderWordDuelBar();
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

    // chat eras (Then vs. Now)
    renderEras();

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

  /* ---------- Chat Eras (Then vs. Now) ---------- */

  function erasFor(anon) {
    if (!WhatsAppWords.chatEras) return null;
    const key = (anon ? 'anon|' : 'plain|') + readExtraNames().join(',');
    if (!Object.prototype.hasOwnProperty.call(current.erasCache, key)) {
      current.erasCache[key] = WhatsAppWords.chatEras(
        current.result.messages,
        current.timestamps,
        anon ? { senderMap: current.map, nameMap: ensureDetected() } : {}
      );
    }
    return current.erasCache[key];
  }

  function renderEras() {
    if (!erasBox || !erasGrid || !current) return;
    const eras = erasFor(current.anon);
    if (!eras) {
      erasBox.hidden = true;
      return;
    }
    erasBox.hidden = false;
    if (erasSpan) erasSpan.textContent = `${eras.thenLabel} → ${eras.nowLabel}`;
    erasGrid.textContent = '';

    // Card 1: Extinct words
    if (eras.extinct.length) {
      const card = document.createElement('div');
      card.className = 'era-card';
      const head = document.createElement('span');
      head.className = 'era-card-head';
      head.textContent = `🦕 went extinct since ${eras.thenLabel}`;
      const chips = document.createElement('div');
      chips.className = 'era-chips';
      for (const item of eras.extinct) {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'era-chip extinct';
        btn.textContent = item.word;
        const sm = document.createElement('small');
        sm.textContent = `${item.thenCount}→${item.nowCount}`;
        btn.appendChild(sm);
        btn.title = `Spotlight “${item.word}” on the strip`;
        btn.addEventListener('click', () => setSpotlightWord(item.word));
        chips.appendChild(btn);
      }
      card.append(head, chips);
      erasGrid.appendChild(card);
    }

    // Card 2: Rising slang
    if (eras.rising.length) {
      const card = document.createElement('div');
      card.className = 'era-card';
      const head = document.createElement('span');
      head.className = 'era-card-head';
      head.textContent = `🌱 rising in ${eras.nowLabel}`;
      const chips = document.createElement('div');
      chips.className = 'era-chips';
      for (const item of eras.rising) {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'era-chip rising';
        btn.textContent = item.word;
        const sm = document.createElement('small');
        sm.textContent = `${item.thenCount}→${item.nowCount}`;
        btn.appendChild(sm);
        btn.title = `Spotlight “${item.word}” on the strip`;
        btn.addEventListener('click', () => setSpotlightWord(item.word));
        chips.appendChild(btn);
      }
      card.append(head, chips);
      erasGrid.appendChild(card);
    }

    // Card 3: Pace & chatter shift
    const shiftCard = document.createElement('div');
    shiftCard.className = 'era-card';
    const shiftHead = document.createElement('span');
    shiftHead.className = 'era-card-head';
    shiftHead.textContent = '📈 vibe & chatter shift';
    const list = document.createElement('div');
    list.className = 'era-shifts';

    const addShift = (label, valText, cls) => {
      const row = document.createElement('div');
      row.className = 'era-shift-row';
      const l = document.createElement('span');
      l.textContent = label;
      const v = document.createElement('span');
      if (cls) v.className = cls;
      v.textContent = valText;
      row.append(l, v);
      list.appendChild(row);
    };

    if (eras.thenMsgsPerDay && eras.nowMsgsPerDay) {
      const deltaPace = Math.round((eras.nowMsgsPerDay - eras.thenMsgsPerDay) * 10) / 10;
      addShift(
        'msgs/active day',
        `${eras.thenMsgsPerDay} → ${eras.nowMsgsPerDay}`,
        deltaPace > 0 ? 'up' : deltaPace < 0 ? 'down' : 'flat'
      );
    }
    if (eras.thenAvgChars || eras.nowAvgChars) {
      const dChars = eras.nowAvgChars - eras.thenAvgChars;
      addShift(
        'avg length',
        `${eras.thenAvgChars} → ${eras.nowAvgChars} ch`,
        dChars > 0 ? 'up' : dChars < 0 ? 'down' : 'flat'
      );
    }
    if (eras.senderShifts.length >= 2) {
      for (const sh of eras.senderShifts.slice(0, 3)) {
        const sign = sh.delta > 0 ? '+' : '';
        addShift(
          labelFor(sh.sender),
          `${sh.pctThen}% → ${sh.pctNow}% (${sign}${sh.delta}%)`,
          sh.delta >= 3 ? 'up' : sh.delta <= -3 ? 'down' : 'flat'
        );
      }
    }

    shiftCard.append(shiftHead, list);
    erasGrid.appendChild(shiftCard);
  }

  /* ---------- 3-Mode Party Quiz (Who said it? / Mad Libs / Guess the Era) ---------- */

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function makeQuizState(pool, extra) {
    return Object.assign({
      pool,
      cursor: 0,
      correct: 0,
      total: 0,
      streak: 0,
      current: null,
      choices: [],
      picked: null,
    }, extra || {});
  }

  function activeQuizState() {
    if (!current || !current.quiz) return null;
    return current.quiz.states[current.quiz.mode] || null;
  }

  function ensureQuiz() {
    if (!quizBox || !current) return;
    if (!current.quiz) {
      const whoPool = (current.result.senders.length >= 2 && WhatsAppWords.quizCandidates)
        ? shuffle(WhatsAppWords.quizCandidates(current.result.messages))
        : [];
      const madPool = WhatsAppWords.madLibsCandidates
        ? shuffle(WhatsAppWords.madLibsCandidates(current.result.messages, {
          senderMap: current.map,
          nameMap: ensureDetected(),
        }))
        : [];
      const eraRaw = WhatsAppWords.eraQuizCandidates
        ? WhatsAppWords.eraQuizCandidates(current.result.messages, current.timestamps)
        : { mode: 'act', choices: [], items: [] };
      const eraPool = shuffle(eraRaw.items || []);

      const states = {
        who: whoPool.length ? makeQuizState(whoPool) : null,
        mad: madPool.length ? makeQuizState(madPool) : null,
        era: eraPool.length ? makeQuizState(eraPool, { eraMode: eraRaw.mode, allEraChoices: eraRaw.choices }) : null,
      };
      const firstMode = states.who ? 'who' : states.mad ? 'mad' : states.era ? 'era' : null;
      if (!firstMode) {
        quizBox.hidden = true;
        return;
      }
      current.quiz = { mode: firstMode, states };
      nextQuizQuestion();
    } else {
      renderQuizCurrent();
    }
    syncQuizModeTabs();
    quizBox.hidden = false;
  }

  function syncQuizModeTabs() {
    if (!current || !current.quiz) return;
    const map = [
      [quizModeWho, 'who'],
      [quizModeMad, 'mad'],
      [quizModeEra, 'era'],
    ];
    for (const [btn, m] of map) {
      if (!btn) continue;
      const available = Boolean(current.quiz.states[m]);
      btn.hidden = !available;
      btn.classList.toggle('active', current.quiz.mode === m);
      btn.setAttribute('aria-selected', String(current.quiz.mode === m));
    }
  }

  function setQuizMode(mode) {
    if (!current || !current.quiz || !current.quiz.states[mode]) return;
    current.quiz.mode = mode;
    syncQuizModeTabs();
    const st = current.quiz.states[mode];
    if (!st.current) nextQuizQuestion();
    else renderQuizCurrent();
  }

  function nextQuizQuestion() {
    const qz = activeQuizState();
    if (!qz) return;
    const mode = current.quiz.mode;
    if (qz.cursor >= qz.pool.length) {
      qz.pool = shuffle(qz.pool);
      qz.cursor = 0;
    }
    const item = qz.pool[qz.cursor++];
    let choices = [];

    if (mode === 'who') {
      const allSenders = current.result.senders.map((s) => s.sender);
      if (allSenders.length <= 4) {
        choices = allSenders;
      } else {
        const others = shuffle(allSenders.filter((s) => s !== item.sender)).slice(0, 3);
        choices = shuffle([item.sender].concat(others));
      }
    } else if (mode === 'mad') {
      choices = shuffle([item.answer].concat(item.distractors));
    } else if (mode === 'era') {
      const allC = qz.allEraChoices || [];
      if (allC.length <= 4) {
        choices = allC.slice();
      } else {
        const others = shuffle(allC.filter((c) => c !== item.answer)).slice(0, 3);
        choices = [item.answer].concat(others).sort((a, b) => allC.indexOf(a) - allC.indexOf(b));
      }
    }

    qz.current = item;
    qz.choices = choices;
    qz.picked = null;
    renderQuizCurrent();
  }

  function renderQuizCurrent() {
    const qz = activeQuizState();
    if (!qz || !qz.current || !quizBox) return;
    const mode = current.quiz.mode;
    const item = qz.current;
    syncQuizModeTabs();

    if (quizScore) {
      const streakTxt = qz.streak >= 2 ? `🔥 ${qz.streak} · ` : '';
      quizScore.textContent = `${streakTxt}${qz.correct} / ${qz.total}`;
    }

    if (quizPromptHint) {
      if (mode === 'mad') {
        quizPromptHint.textContent = `${labelFor(item.sender)} sent this — fill in the blank:`;
        quizPromptHint.hidden = false;
      } else if (mode === 'era') {
        const unit = qz.eraMode === 'year' ? 'year' : qz.eraMode === 'month' ? 'month' : 'part of the chat';
        quizPromptHint.textContent = `${labelFor(item.sender)} said this — which ${unit}?`;
        quizPromptHint.hidden = false;
      } else {
        quizPromptHint.hidden = true;
      }
    }

    if (quizQuote) {
      const displayText = textFor(item.text);
      if (mode === 'mad') {
        quizQuote.textContent = '';
        const re = new RegExp('(?<![\\p{L}\\p{N}_])(' + escapeRegExp(item.answer) + ')(?![\\p{L}\\p{N}_])', 'iu');
        const m = re.exec(displayText);
        if (m) {
          const before = displayText.slice(0, m.index);
          const after = displayText.slice(m.index + m[0].length);
          const blank = document.createElement('span');
          blank.className = 'madlib-blank' + (qz.picked !== null ? ' revealed' : '');
          blank.textContent = qz.picked !== null ? m[0] : '_____';
          quizQuote.append('“', before, blank, after, '”');
        } else {
          quizQuote.textContent = `“${displayText}”`;
        }
      } else {
        quizQuote.textContent = `“${displayText}”`;
      }
    }

    if (quizMeta) {
      quizMeta.hidden = qz.picked === null;
      quizMeta.textContent = `${labelFor(item.sender)} · ${item.ts}`;
    }

    const correctKey = mode === 'who' ? item.sender : item.answer;

    if (quizChoices) {
      quizChoices.textContent = '';
      for (const choice of qz.choices) {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'quiz-choice';
        if (mode === 'who') {
          const dot = document.createElement('span');
          dot.className = 'chip';
          dot.style.background = current.colors.get(choice);
          btn.append(dot, labelFor(choice));
        } else {
          btn.textContent = choice;
        }

        if (qz.picked !== null) {
          btn.disabled = true;
          if (choice === correctKey) btn.classList.add('correct');
          else if (choice === qz.picked) btn.classList.add('wrong');
          else btn.classList.add('dim');
        } else {
          btn.addEventListener('click', () => answerQuiz(choice));
        }
        quizChoices.appendChild(btn);
      }
    }

    if (quizFooter && quizFeedback) {
      quizFooter.hidden = qz.picked === null;
      if (qz.picked !== null) {
        const right = qz.picked === correctKey;
        quizFeedback.className = 'quiz-feedback ' + (right ? 'good' : 'miss');
        if (right) {
          quizFeedback.textContent = 'Spot on!';
        } else if (mode === 'who') {
          quizFeedback.textContent = `Actually ${labelFor(item.sender)}`;
        } else if (mode === 'mad') {
          quizFeedback.textContent = `It was “${item.answer}”`;
        } else {
          quizFeedback.textContent = `Sent in ${item.answer}`;
        }
      }
    }
  }

  function answerQuiz(choice) {
    const qz = activeQuizState();
    if (!qz || qz.picked !== null) return;
    const mode = current.quiz.mode;
    const correctKey = mode === 'who' ? qz.current.sender : qz.current.answer;
    qz.picked = choice;
    qz.total++;
    if (choice === correctKey) {
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

    const useQ = Boolean(current.adjusted && current.quality && current.quality.weights);
    const qW = useQ ? current.quality.weights : null;

    for (let b = 0; b < visible; b++) {
      const start = b * bucketSize;
      const end = Math.min(start + bucketSize, n);
      let best = null;
      let bestIdx = start;
      let bestScore = -1;
      for (let j = start; j < end; j++) {
        const m = msgs[j];
        if (hasFilter && !msgMatchesFilters(j, m)) continue;
        const sc = useQ ? (m.text.length * (0.15 + (qW[j] || 0))) : m.text.length;
        if (!best || sc > bestScore) {
          best = m;
          bestIdx = j;
          bestScore = sc;
        }
      }
      const dimmed = hasFilter && !best;
      if (!best) {
        best = msgs[start];
        bestIdx = start;
      }
      const qw = useQ ? (qW[bestIdx] || 0) : 1;
      const h = minH + (cssH - minH - 4) * (Math.log(1 + best.text.length) / maxLog) * (useQ ? (0.35 + 0.65 * qw) : 1);
      const x = b * slot + gap / 2;

      if (hoverIndex === b) {
        ctx.fillStyle = 'rgba(233, 237, 239, 0.12)';
        ctx.fillRect(b * slot, 0, Math.max(1, slot), cssH);
      }

      ctx.globalAlpha = dimmed ? 0.12 : (useQ ? (0.2 + 0.8 * qw) : 1);
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
    const { result, colors, highlightSender, hoverIndex } = current;
    const insights = activeInsights();
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
    const { colors, highlightSender, hoverIndex } = current;
    const insights = activeInsights();
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
      const changed = current.hoverIndex !== b;
      if (changed) {
        current.hoverIndex = b;
        drawStrip(1);
      }
      const { best, bucketCount } = pickTimelineBest(b);
      if (changed && soundEnabled) {
        const weight = Math.min(1, 0.3 + Math.log(1 + best.text.length) / 6);
        playSenderNote(best.sender, weight);
      }
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
      const ins = activeInsights();
      const count = ins.hours[h] || 0;
      const total = ins.totalParsedTs || activeTextResult().total || 1;
      const pct = Math.round((count / total) * 100);
      let topSender = null;
      let topCount = 0;
      const hs = ins.hourSenders && ins.hourSenders[h];
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

  /* ---------- Moment Peek (Time Capsule modal + Replay + Out-of-Context Quote Card) ---------- */

  function stopPeekReplay() {
    for (const t of replayTimers) clearTimeout(t);
    replayTimers = [];
    if (current && current.peek) current.peek.replaying = false;
    if (peekReplayBtn) {
      peekReplayBtn.textContent = '▶ Replay';
      peekReplayBtn.classList.remove('on');
    }
  }

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

  function peekWindowBounds() {
    const msgs = current.result.messages;
    const idx = current.peek.index;
    const start = Math.max(0, idx - 2);
    const end = Math.min(msgs.length - 1, idx + 2);
    return { start, end };
  }

  function openPeek(index, title) {
    if (!current || !peekModal) return;
    stopPeekReplay();
    const clamped = Math.max(0, Math.min(current.result.messages.length - 1, index));
    current.peek = {
      index: clamped,
      selected: new Set([clamped]),
      title: title || 'Moment peek',
      replaying: false,
    };
    renderPeekWindow();
    peekModal.hidden = false;
    if (peekCloseBtn) peekCloseBtn.focus();
  }

  function closePeek() {
    stopPeekReplay();
    if (peekModal) peekModal.hidden = true;
    if (current) current.peek = null;
  }

  function syncPeekSelectionUI() {
    if (!current || !current.peek || !peekMessages) return;
    const msgs = current.result.messages;
    const sel = current.peek.selected || new Set([current.peek.index]);
    const sorted = Array.from(sel).sort((a, b) => a - b);
    const { start, end } = peekWindowBounds();
    const totalVisible = end - start + 1;

    for (const el of peekMessages.querySelectorAll('.peek-msg')) {
      const i = Number(el.dataset.idx);
      el.classList.toggle('target', sel.has(i));
    }

    if (peekSub) {
      if (sorted.length <= 1) {
        const one = sorted[0] != null ? sorted[0] : current.peek.index;
        peekSub.textContent = `message #${numberFmt.format(one + 1)} of ${numberFmt.format(msgs.length)} · tap bubbles to multi-select`;
      } else {
        const first = sorted[0];
        const last = sorted[sorted.length - 1];
        peekSub.textContent = `${sorted.length} messages selected (#${numberFmt.format(first + 1)}–#${numberFmt.format(last + 1)})`;
      }
    }

    if (peekSelectAllBtn) {
      peekSelectAllBtn.hidden = totalVisible < 2;
      peekSelectAllBtn.textContent = sel.size >= totalVisible ? 'Just 1' : 'Select all';
    }

    if (peekQuoteBtn) {
      const label = sorted.length > 1 ? `📸 Quote card (${sorted.length})` : '📸 Quote card';
      peekQuoteBtn.textContent = label;
    }
  }

  function createPeekBubbleEl(i, m, rightSender, isSelected, animate) {
    const row = document.createElement('div');
    const isRight = m.sender === rightSender;
    row.className = 'peek-msg ' + (isRight ? 'out' : 'in') + (isSelected ? ' target' : '') + (animate ? ' entering' : '');
    row.dataset.idx = String(i);
    row.title = 'Click to toggle this message in your Quote card';
    row.addEventListener('click', () => {
      if (!current || !current.peek || current.peek.replaying) return;
      const sel = current.peek.selected;
      if (sel.has(i)) {
        if (sel.size > 1) sel.delete(i);
      } else {
        sel.add(i);
      }
      syncPeekSelectionUI();
    });

    const senderEl = document.createElement('span');
    senderEl.className = 'peek-sender';
    senderEl.style.color = isRight ? '#a7f3d0' : (current.colors.get(m.sender) || '#53bdeb');
    senderEl.textContent = labelFor(m.sender);

    const textEl = document.createElement('span');
    textEl.textContent = m.media ? '📎 Media message' : textFor(m.text);

    const tsEl = document.createElement('span');
    tsEl.className = 'peek-ts';
    tsEl.textContent = m.ts;

    if (current.adjusted && current.quality && typeof current.quality.weights[i] === 'number') {
      const metaRow = document.createElement('div');
      metaRow.className = 'peek-meta-row';
      const wVal = current.quality.weights[i];
      const kind = current.quality.kinds[i] || 'substantive';
      const qPill = document.createElement('span');
      qPill.className = 'peek-quality ' + (wVal >= 0.65 ? 'high' : wVal < 0.35 ? 'low' : '');
      qPill.textContent = kind === 'substantive' ? `signal ${Math.round(wVal * 100)}%` : `${kind} · ${Math.round(wVal * 100)}%`;
      if (WhatsAppQuality && WhatsAppQuality.explain) {
        const exp = WhatsAppQuality.explain(m, { prevBySender: new Map(), ms: null, corpus: current.quality._corpus }, activeQualityModel());
        if (exp.topReasons && exp.topReasons.length) {
          qPill.title = 'ML score ' + wVal.toFixed(2) + ' · ' + exp.topReasons.join(', ');
        }
      }
      metaRow.append(qPill, tsEl);
      row.append(senderEl, textEl, metaRow);
    } else {
      row.append(senderEl, textEl, tsEl);
    }
    return row;
  }

  function renderPeekWindow() {
    if (!current || !current.peek || !peekMessages) return;
    stopPeekReplay();
    const msgs = current.result.messages;
    const idx = current.peek.index;
    const { start, end } = peekWindowBounds();
    const rightSender = current.result.senders[0] ? current.result.senders[0].sender : null;
    if (!current.peek.selected || !current.peek.selected.size) {
      current.peek.selected = new Set([idx]);
    }

    if (peekTitle) peekTitle.textContent = current.peek.title;
    if (peekPrevBtn) peekPrevBtn.disabled = start === 0;
    if (peekNextBtn) peekNextBtn.disabled = end === msgs.length - 1;
    if (peekDay1Btn) peekDay1Btn.disabled = idx === 0;

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
      peekMessages.appendChild(createPeekBubbleEl(i, m, rightSender, current.peek.selected.has(i), false));
    }
    syncPeekSelectionUI();
  }

  function togglePeekReplay() {
    if (!current || !current.peek || !peekMessages) return;
    if (current.peek.replaying) {
      renderPeekWindow();
      return;
    }

    const msgs = current.result.messages;
    const idx = current.peek.index;
    const start = Math.max(0, idx - 2);
    const end = Math.min(msgs.length - 1, idx + 2);
    const rightSender = current.result.senders[0] ? current.result.senders[0].sender : null;
    const ls = current.insights.longestSilence;

    current.peek.replaying = true;
    if (peekReplayBtn) {
      peekReplayBtn.textContent = '⏹ Stop';
      peekReplayBtn.classList.add('on');
    }
    peekMessages.textContent = '';

    let cursor = start;
    function playNext() {
      if (!current || !current.peek || !current.peek.replaying) return;
      if (cursor > end) {
        stopPeekReplay();
        return;
      }
      const i = cursor++;
      const m = msgs[i];
      if (ls && i === ls.endIdx && i > start) {
        const gapEl = document.createElement('div');
        gapEl.className = 'peek-gap';
        gapEl.textContent = `🌵 ${formatDuration(ls.ms)} of silence`;
        peekMessages.appendChild(gapEl);
      }

      const isRight = m.sender === rightSender;
      const typingEl = document.createElement('div');
      typingEl.className = 'peek-typing' + (isRight ? ' out' : '');
      const who = document.createElement('span');
      who.textContent = `${labelFor(m.sender)} is typing`;
      const dots = document.createElement('span');
      dots.className = 'dots';
      dots.setAttribute('aria-hidden', 'true');
      dots.append(document.createElement('i'), document.createElement('i'), document.createElement('i'));
      typingEl.append(who, dots);
      peekMessages.appendChild(typingEl);
      peekMessages.scrollTop = peekMessages.scrollHeight;

      const typeDelay = reduceMotion ? 160 : Math.min(950, Math.max(420, 320 + m.text.length * 7));
      const t1 = setTimeout(() => {
        if (!current || !current.peek || !current.peek.replaying) return;
        typingEl.remove();
        const bubble = createPeekBubbleEl(i, m, rightSender, current.peek.selected.has(i), true);
        peekMessages.appendChild(bubble);
        peekMessages.scrollTop = peekMessages.scrollHeight;
        if (soundEnabled) playSenderNote(m.sender, 0.55);

        const t2 = setTimeout(playNext, reduceMotion ? 180 : 380);
        replayTimers.push(t2);
      }, typeDelay);
      replayTimers.push(t1);
    }

    playNext();
  }

  function wrapCanvasLines(ctx, text, maxW, maxLines) {
    const limit = maxLines == null ? Infinity : maxLines;
    const paragraphs = String(text).split(/\r?\n/);
    const lines = [];
    for (const para of paragraphs) {
      const words = para.split(/\s+/).filter(Boolean);
      if (!words.length) {
        if (lines.length < limit) lines.push('');
        continue;
      }
      let line = '';
      for (const word of words) {
        const test = line ? line + ' ' + word : word;
        if (ctx.measureText(test).width <= maxW) {
          line = test;
        } else {
          if (line) {
            lines.push(line);
            if (lines.length >= limit) break;
          }
          // Handle super long unbreakable tokens (e.g. URLs)
          if (ctx.measureText(word).width > maxW) {
            let chunk = '';
            for (const ch of word) {
              if (ctx.measureText(chunk + ch).width > maxW && chunk) {
                lines.push(chunk);
                if (lines.length >= limit) break;
                chunk = ch;
              } else {
                chunk += ch;
              }
            }
            line = chunk;
          } else {
            line = word;
          }
        }
        if (lines.length >= limit) break;
      }
      if (line && lines.length < limit) lines.push(line);
      if (lines.length >= limit) break;
    }
    if (Number.isFinite(limit) && lines.length === limit && paragraphs.join(' ').length > lines.join(' ').length + 3) {
      lines[limit - 1] = lines[limit - 1].replace(/\s*\S*$/, '') + '…';
    }
    return lines.length ? lines : [' '];
  }

  function saveQuoteCard(msgIndices, feedbackBtn) {
    if (!current) return;
    const indices = (Array.isArray(msgIndices) ? msgIndices : [msgIndices])
      .filter((idx) => idx >= 0 && idx < current.result.messages.length);
    if (!indices.length) return;

    const W = 1080;
    const probe = document.createElement('canvas').getContext('2d');
    if (!probe) return;

    const isMulti = indices.length > 1;
    const rightSender = current.result.senders[0] ? current.result.senders[0].sender : null;
    const totalChars = indices.reduce((sum, i) => sum + (current.result.messages[i].media ? 16 : textFor(current.result.messages[i].text).length), 0);

    // Measure every selected bubble in full (never truncating any message!)
    const padX = 90;
    const contentW = W - padX * 2;
    const fontSize = isMulti
      ? (totalChars > 500 ? 28 : 33)
      : (totalChars > 500 ? 30 : totalChars > 220 ? 35 : totalChars > 90 ? 40 : 48);
    const lineHeight = Math.round(fontSize * 1.4);
    const senderFontSize = isMulti ? 24 : 28;
    const tsFontSize = isMulti ? 19 : 22;

    const blocks = [];
    for (let k = 0; k < indices.length; k++) {
      const idx = indices[k];
      const m = current.result.messages[idx];
      const isRight = isMulti && m.sender === rightSender;
      const body = m.media ? '📎 Media message' : textFor(m.text);
      const senderLabel = labelFor(m.sender);
      const senderColor = isRight ? '#a7f3d0' : (current.colors.get(m.sender) || '#00a884');
      const maxBubbleW = isMulti ? Math.round(contentW * 0.84) : contentW;
      const innerPadX = isMulti ? 34 : 44;
      const innerMaxW = maxBubbleW - innerPadX * 2;

      probe.font = `500 ${fontSize}px "Space Grotesk", system-ui, sans-serif`;
      const lines = wrapCanvasLines(probe, body, innerMaxW, Infinity);

      // Fit bubble width naturally for multi-message exchanges so short replies look crisp
      let bubbleW = maxBubbleW;
      if (isMulti) {
        let widest = 0;
        for (const ln of lines) widest = Math.max(widest, probe.measureText(ln).width);
        probe.font = `700 ${senderFontSize}px "Space Grotesk", system-ui, sans-serif`;
        widest = Math.max(widest, probe.measureText(senderLabel.slice(0, 36)).width);
        probe.font = `400 ${tsFontSize}px "Space Grotesk", system-ui, sans-serif`;
        widest = Math.max(widest, probe.measureText(m.ts).width + (isRight ? 42 : 0));
        bubbleW = Math.min(maxBubbleW, Math.max(300, Math.ceil(widest + innerPadX * 2 + 12)));
      }

      const headerOffset = isMulti ? 52 : 64;
      const bodyStartY = isMulti ? 96 : 118;
      const bottomPad = isMulti ? 54 : 66;
      const bubbleH = Math.max(isMulti ? 140 : 220, bodyStartY + (lines.length - 1) * lineHeight + fontSize * 0.4 + bottomPad);

      const skippedGap = k > 0 && idx - indices[k - 1] > 1;
      const samePrevSender = k > 0 && !skippedGap && current.result.messages[indices[k - 1]].sender === m.sender;
      const gapBefore = k === 0 ? 0 : (skippedGap ? 52 : samePrevSender ? 16 : 26);

      blocks.push({
        idx,
        m,
        isRight,
        senderLabel,
        senderColor,
        lines,
        bubbleW,
        bubbleH,
        innerPadX,
        headerOffset,
        bodyStartY,
        skippedGap,
        gapBefore,
      });
    }

    const totalBubblesH = blocks.reduce((sum, b) => sum + b.gapBefore + b.bubbleH, 0);
    const topChrome = 165;
    const bottomChrome = 135;
    const H = Math.max(640, topChrome + totalBubblesH + bottomChrome);

    const c = document.createElement('canvas');
    c.width = W;
    c.height = H;
    const ctx = c.getContext('2d');
    if (!ctx) return;

    // Dark background + subtle ambient glow
    ctx.fillStyle = '#0b141a';
    ctx.fillRect(0, 0, W, H);
    const glowColor = current.colors.get(blocks[0].m.sender) || '#00a884';
    const grad = ctx.createRadialGradient(W * 0.82, Math.min(260, H * 0.16), 20, W * 0.82, Math.min(260, H * 0.16), 520);
    grad.addColorStop(0, hexToRgba(glowColor, 0.2));
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    // Outer frame
    ctx.strokeStyle = '#2a3942';
    ctx.lineWidth = 3;
    roundRectPath(ctx, 36, 36, W - 72, H - 72, 36);
    ctx.stroke();

    // Header
    ctx.fillStyle = '#00a884';
    ctx.beginPath();
    ctx.arc(96, 102, 8, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#e9edef';
    ctx.font = '600 24px "Space Grotesk", system-ui, sans-serif';
    ctx.fillText('out of context', 118, 111);

    ctx.fillStyle = '#8696a0';
    ctx.font = '400 20px "Space Grotesk", system-ui, sans-serif';
    ctx.textAlign = 'right';
    const countLabel = isMulti
      ? `${indices.length} messages · #${numberFmt.format(indices[0] + 1)}–#${numberFmt.format(indices[indices.length - 1] + 1)}`
      : `message #${numberFmt.format(indices[0] + 1)}`;
    ctx.fillText(countLabel, W - 88, 110);
    ctx.textAlign = 'left';

    // Vertically center the bubbles inside the available stage
    let yCursor = Math.round(topChrome + Math.max(0, (H - topChrome - bottomChrome - totalBubblesH) / 2));

    for (const b of blocks) {
      if (b.skippedGap) {
        const dotY = yCursor + 24;
        ctx.fillStyle = '#8696a0';
        ctx.font = '600 22px "Space Grotesk", system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('•  •  •', W / 2, dotY);
        ctx.textAlign = 'left';
      }
      yCursor += b.gapBefore;

      const bx = b.isRight ? (W - padX - b.bubbleW) : padX;
      const by = yCursor;
      const radius = isMulti ? 24 : 30;

      ctx.fillStyle = b.isRight ? '#005c4b' : '#202c33';
      roundRectPath(ctx, bx, by, b.bubbleW, b.bubbleH, radius);
      ctx.fill();

      // WhatsApp bubble tail
      ctx.beginPath();
      if (b.isRight) {
        ctx.moveTo(bx + b.bubbleW - 12, by + b.bubbleH - 24);
        ctx.lineTo(bx + b.bubbleW + 14, by + b.bubbleH);
        ctx.lineTo(bx + b.bubbleW - 24, by + b.bubbleH);
      } else {
        ctx.moveTo(bx + 12, by + b.bubbleH - 24);
        ctx.lineTo(bx - 14, by + b.bubbleH);
        ctx.lineTo(bx + 24, by + b.bubbleH);
      }
      ctx.closePath();
      ctx.fill();

      // Colored sender name
      ctx.fillStyle = b.senderColor;
      ctx.font = `700 ${senderFontSize}px "Space Grotesk", system-ui, sans-serif`;
      ctx.fillText(b.senderLabel.slice(0, 36), bx + b.innerPadX, by + b.headerOffset);

      // Wrapped full message body
      ctx.fillStyle = '#e9edef';
      ctx.font = `500 ${fontSize}px "Space Grotesk", system-ui, sans-serif`;
      b.lines.forEach((ln, li) => {
        ctx.fillText(ln, bx + b.innerPadX, by + b.bodyStartY + li * lineHeight);
      });

      // Timestamp (+ blue double ticks on single-bubble or right-aligned outgoing bubbles)
      const showTicks = !isMulti || b.isRight;
      ctx.fillStyle = 'rgba(233, 237, 239, 0.58)';
      ctx.font = `400 ${tsFontSize}px "Space Grotesk", system-ui, sans-serif`;
      ctx.textAlign = 'right';
      ctx.fillText(b.m.ts, bx + b.bubbleW - (showTicks ? 72 : 30), by + b.bubbleH - 24);
      ctx.textAlign = 'left';
      if (showTicks) {
        drawDoubleTicks(ctx, bx + b.bubbleW - 60, by + b.bubbleH - 38, isMulti ? 2.6 : 3.2);
      }

      yCursor += b.bubbleH;
    }

    // Footer
    const chatLabel = current.anon ? 'Anonymized chat' : (current.name || 'WhatsApp chat').replace(/\.(txt|zip)$/i, '');
    ctx.fillStyle = '#8696a0';
    ctx.font = '400 20px "Space Grotesk", system-ui, sans-serif';
    ctx.fillText(`${chatLabel.slice(0, 36)} · whatsapp message counter`, 90, H - 72);

    const base = current.anon ? 'anonymized-quote' : (current.name || 'whatsapp-chat').replace(/\.(txt|zip)$/i, '') + '-quote';
    const rangeTag = isMulti ? `${indices[0] + 1}-${indices[indices.length - 1] + 1}` : `${indices[0] + 1}`;
    const filename = `${base}-${rangeTag}.png`;
    const dataUrl = c.toDataURL('image/png');
    const blob = dataUrlToBlob(dataUrl);

    const flashBtn = (label) => {
      if (!feedbackBtn) return;
      feedbackBtn.textContent = label;
      setTimeout(() => {
        if (current && current.peek) syncPeekSelectionUI();
        else feedbackBtn.textContent = '📸 Quote card';
      }, 1600);
    };

    const isTouch = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
    if (isTouch && typeof File === 'function' && navigator.share && navigator.canShare) {
      try {
        const file = new File([blob], filename, { type: 'image/png' });
        if (navigator.canShare({ files: [file] })) {
          flashBtn('Opening share…');
          navigator.share({ files: [file], title: 'Out of Context Quote' }).then(
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
        // Fall through
      }
    }

    triggerDownload(blob, filename);
    flashBtn('Saved ✓');
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
    const { result } = current;
    const insights = activeInsights();
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
      // Slide 1: The Big Picture + Archetype
      addKicker(current.selectedYear ? `the big picture · ${current.selectedYear}` : 'the big picture');
      const baseTitle = current.anon ? 'Your anonymized chat' : (current.name || 'This chat').replace(/\.(txt|zip)$/i, '');
      addTitle(current.selectedYear ? `${baseTitle} (${current.selectedYear})` : baseTitle);
      if (result.first && result.last) addSub(`from ${result.first} to ${result.last}`);

      if (insights.archetype) {
        const arch = document.createElement('div');
        arch.className = 'w-archetype';
        const ic = document.createElement('span');
        ic.className = 'w-archetype-icon';
        ic.textContent = insights.archetype.icon;
        const body = document.createElement('div');
        body.className = 'w-archetype-body';
        const st = document.createElement('strong');
        st.textContent = insights.archetype.title;
        const sp = document.createElement('span');
        sp.textContent = insights.archetype.tagline;
        body.append(st, sp);
        arch.append(ic, body);
        wrappedSlide.appendChild(arch);
      }

      const bub = document.createElement('div');
      bub.className = 'w-bubble';
      const num = document.createElement('span');
      num.className = 'w-bubble-num';
      const isAdj = Boolean(current.adjusted && current.quality);
      const heroCount = isAdj ? current.quality.adjusted : result.total;
      num.textContent = isAdj ? formatAdjustedNum(heroCount) : numberFmt.format(result.total);
      const unit = document.createElement('span');
      unit.className = 'w-bubble-unit';
      unit.textContent = isAdj
        ? `substantive messages (${current.quality.signalPct}% of ${numberFmt.format(result.total)} raw)`
        : (result.total === 1 ? 'message exchanged' : 'messages exchanged');
      bub.append(num, unit);
      wrappedSlide.appendChild(bub);

      const grid = document.createElement('div');
      grid.className = 'w-grid';
      const pages = wAll.totalWords / 250;
      const mins = Math.max(1, Math.round((insights.textChars || activeTextResult().chars) / 200));
      const typingVal = mins >= 60 ? `${(mins / 60).toFixed(1)} hrs` : `${numberFmt.format(mins)} mins`;
      const scrollM = (heroCount * 1.15) / 100;
      const cards = [
        [numberFmt.format(wAll.totalWords), 'words written'],
        [pages >= 10 ? numberFmt.format(Math.round(pages)) : Math.max(0.1, pages).toFixed(1), 'paperback pages'],
        [typingVal, 'estimated typing'],
        [scrollM >= 1 ? `${scrollM >= 100 ? numberFmt.format(Math.round(scrollM)) : scrollM.toFixed(1)} m` : `${Math.round(heroCount * 1.15)} cm`, 'thumb scroll distance'],
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
      // Slide 2: Your Rhythm + Chaos Peak
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
      if (insights.chaosPeak) {
        rhythmCards.push([`⚡ ${numberFmt.format(insights.chaosPeak.count)} in ${insights.chaosPeak.durationMin}m`, `chaos peak (${insights.chaosPeak.startTs})`]);
      } else if (insights.longestStreak) {
        rhythmCards.push([`×${numberFmt.format(insights.longestStreak.count)}`, `longest streak (${labelFor(insights.longestStreak.sender)})`]);
      }
      if (insights.longestSilence) {
        rhythmCards.push([formatDuration(insights.longestSilence.ms), `longest silence (broken by ${labelFor(insights.longestSilence.breaker)})`]);
      } else if (insights.longestStreak && insights.chaosPeak) {
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
      // Slide 3: Cast & Dynamics (+ Power Duo)
      const isAdj = Boolean(current.adjusted && current.quality);
      addKicker(isAdj ? 'the cast · 🧹 spam-adjusted' : 'the cast');
      const castList = isAdj
        ? current.quality.senders.map((s) => ({ sender: s.sender, count: s.adjusted, signalPct: s.signalPct, rankDelta: s.rankDelta }))
        : result.senders;
      const castTotal = Math.max(1, isAdj ? current.quality.adjusted : result.total);
      const leader = castList[0];
      const leadPct = leader ? Math.round((leader.count / castTotal) * 100) : 0;
      addTitle(leader ? `${labelFor(leader.sender)} led with ${leadPct}%` : 'The participants');

      const ul = document.createElement('ul');
      ul.className = 'w-list';
      const medals = ['🥇', '🥈', '🥉'];
      castList.slice(0, 5).forEach((s, i) => {
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
        sm.textContent = isAdj
          ? `${formatAdjustedNum(s.count)} (${Math.round((s.count / castTotal) * 100)}% · ${s.signalPct}% real)`
          : `${numberFmt.format(s.count)} (${Math.round((s.count / castTotal) * 100)}%)`;
        li.append(m, chip, nm, sm);
        ul.appendChild(li);
      });
      wrappedSlide.appendChild(ul);

      const dynGrid = document.createElement('div');
      dynGrid.className = 'w-grid';
      if (result.senders.length >= 3 && insights.pingPong && insights.pingPong.pairs.length) {
        const duo = insights.pingPong.pairs[0];
        const c = document.createElement('div'); c.className = 'w-card';
        const st = document.createElement('strong'); st.textContent = `🏓 ${labelFor(duo.a)} ↔ ${labelFor(duo.b)}`;
        const sp = document.createElement('span'); sp.textContent = `power duo (${duo.pct}% of back-and-forths)`;
        c.append(st, sp); dynGrid.appendChild(c);
      }
      if (insights.fastestReplier) {
        const c = document.createElement('div'); c.className = 'w-card';
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
      if (insights.lastWord && dynGrid.children.length < 4) {
        const c = document.createElement('div'); c.className = 'w-card';
        const st = document.createElement('strong'); st.textContent = `🏁 ${labelFor(insights.lastWord.sender)}`;
        const sp = document.createElement('span'); sp.textContent = `always gets last word (×${insights.lastWord.count})`;
        c.append(st, sp); dynGrid.appendChild(c);
      }
      if (dynGrid.children.length) wrappedSlide.appendChild(dynGrid);
    } else if (idx === 3) {
      // Slide 4: Chat Awards (now starring Comedian!)
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
      // Slide 5: Words, Catchphrases & Eras
      addKicker('words, catchphrases & eras');
      addTitle(books.writable
        ? `Vocab big enough for ${books.writable.title}`
        : `${numberFmt.format(wAll.uniqueWords)} unique words`);
      if (w.topEmoji.length) {
        addSub(`Top emojis: ${w.topEmoji.map((e) => `${e.emoji} ×${numberFmt.format(e.count)}`).join('  ')}`);
      }

      const ul = document.createElement('ul');
      ul.className = 'w-list';
      w.senders.slice(0, 4).forEach((s) => {
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

      const eras = erasFor(current.anon);
      if (eras && (eras.extinct.length || eras.rising.length)) {
        const grid = document.createElement('div');
        grid.className = 'w-grid';
        if (eras.extinct.length) {
          const c = document.createElement('div'); c.className = 'w-card';
          const st = document.createElement('strong'); st.textContent = `🦕 ${eras.extinct.slice(0, 2).map((x) => x.word).join(', ')}`;
          const sp = document.createElement('span'); sp.textContent = `faded since ${eras.thenLabel}`;
          c.append(st, sp); grid.appendChild(c);
        }
        if (eras.rising.length) {
          const c = document.createElement('div'); c.className = 'w-card';
          const st = document.createElement('strong'); st.textContent = `🌱 ${eras.rising.slice(0, 2).map((x) => x.word).join(', ')}`;
          const sp = document.createElement('span'); sp.textContent = `rising in ${eras.nowLabel}`;
          c.append(st, sp); grid.appendChild(c);
        }
        wrappedSlide.appendChild(grid);
      }
    } else if (idx === 5) {
      // Slide 6: Lore & Time Capsule (Day 1, Group Lore, Comedian punchline)
      addKicker('lore & time capsule');
      const lore = insights.groupLore && insights.groupLore.changes ? insights.groupLore.changes : [];
      addTitle(lore.length ? `${lore.length} group name${lore.length === 1 ? '' : 's'} & Day 1 lore` : 'How it all started');

      const firstMsg = result.messages[0];
      if (firstMsg) {
        const q = document.createElement('div');
        q.className = 'w-quote-card';
        const sm = document.createElement('small');
        sm.textContent = `🕰️ Day 1 · ${labelFor(firstMsg.sender)} · ${firstMsg.ts}`;
        const p = document.createElement('p');
        const body = firstMsg.media ? '📎 Media message' : textFor(firstMsg.text).replace(/\s+/g, ' ');
        p.textContent = `“${body.slice(0, 140)}${body.length > 140 ? '…' : ''}”`;
        q.append(sm, p);
        wrappedSlide.appendChild(q);
      }

      if (insights.comedian && insights.comedian.punchlineIdx !== null) {
        const pm = result.messages[insights.comedian.punchlineIdx];
        if (pm && !pm.media) {
          const q = document.createElement('div');
          q.className = 'w-quote-card';
          const sm = document.createElement('small');
          sm.textContent = `🎭 Certified punchline · ${labelFor(pm.sender)} · ${pm.ts}`;
          const p = document.createElement('p');
          const body = textFor(pm.text).replace(/\s+/g, ' ');
          p.textContent = `“${body.slice(0, 140)}${body.length > 140 ? '…' : ''}”`;
          q.append(sm, p);
          wrappedSlide.appendChild(q);
        }
      }

      if (lore.length) {
        const ul = document.createElement('ul');
        ul.className = 'w-list';
        for (const ch of lore.slice(0, 3)) {
          const li = document.createElement('li');
          li.className = 'w-row';
          const icon = document.createElement('span');
          icon.textContent = '📜';
          const subj = document.createElement('strong');
          subj.textContent = `“${textFor(ch.subject)}”`;
          const sm = document.createElement('small');
          const actorLabel = current.map.has(ch.actor) ? labelFor(ch.actor) : textFor(ch.actor);
          sm.textContent = actorLabel;
          li.append(icon, subj, sm);
          ul.appendChild(li);
        }
        wrappedSlide.appendChild(ul);
      }
    } else {
      // Slide 7: Share the Receipt
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

  /* ---------- Copy WhatsApp-formatted text summary ---------- */

  function buildWhatsAppSummary() {
    if (!current) return '';
    const { result } = current;
    const insights = activeInsights();
    const wAll = wordsFor(current.anon, false);
    const baseName = current.anon
      ? 'Anonymized chat'
      : (current.name || 'WhatsApp chat').replace(/\.(txt|zip)$/i, '');
    const title = current.selectedYear ? `${baseName} · ${current.selectedYear}` : baseName;

    const lines = [];
    const isAdj = Boolean(current.adjusted && current.quality);
    lines.push(`💬 *${title}*` + (isAdj ? ' (🧹 spam-adjusted)' : ''));
    const span = result.first && result.last ? ` · ${result.first} → ${result.last}` : '';
    if (isAdj) {
      const q = current.quality;
      const bits = formatQualityBits(q.counts);
      lines.push(`*${formatAdjustedNum(q.adjusted)} substantive messages* (${q.signalPct}% of ${numberFmt.format(q.total)} raw) · ${numberFmt.format(wAll.totalWords)} words${span}`);
      if (bits.length) lines.push(`🧹 Filtered (${q.model.label}): ${bits.join(', ')}`);
    } else {
      lines.push(`*${numberFmt.format(result.total)} message${result.total === 1 ? '' : 's'}* · ${numberFmt.format(wAll.totalWords)} words${span}`);
    }
    if (insights.archetype) {
      lines.push(`${insights.archetype.icon} Archetype: *${insights.archetype.title}*`);
    }

    if (result.senders.length >= 2) {
      lines.push('');
      lines.push(isAdj ? '📊 *Leaderboard (substantive)*' : '📊 *Leaderboard*');
      if (isAdj) {
        const q = current.quality;
        const tot = Math.max(1, q.adjusted);
        q.senders.slice(0, 6).forEach((s, idx) => {
          const pct = Math.round((s.adjusted / tot) * 100);
          const arrow = s.rankDelta > 0 ? ` ▲${s.rankDelta}` : s.rankDelta < 0 ? ` ▼${Math.abs(s.rankDelta)}` : '';
          lines.push(`${idx + 1}. ${labelFor(s.sender)} — ${formatAdjustedNum(s.adjusted)} (${pct}% · ${s.signalPct}% real of ${numberFmt.format(s.raw)})${arrow}`);
        });
        if (q.senders.length > 6) lines.push(`…and ${q.senders.length - 6} more`);
      } else {
        result.senders.slice(0, 6).forEach((s, idx) => {
          const pct = Math.round((s.count / result.total) * 100);
          lines.push(`${idx + 1}. ${labelFor(s.sender)} — ${numberFmt.format(s.count)} (${pct}%)`);
        });
        if (result.senders.length > 6) {
          lines.push(`…and ${result.senders.length - 6} more`);
        }
      }
    }

    const highlights = [];
    if (insights.peakHour) {
      highlights.push(`Peak hour: ${formatHour(insights.peakHour.hour)}`);
    }
    if (insights.peakDay) {
      highlights.push(`Busiest day: ${insights.peakDay.label} (${numberFmt.format(insights.peakDay.count)} msgs)`);
    }
    if (insights.chaosPeak) {
      highlights.push(`⚡ Chaos peak: ${numberFmt.format(insights.chaosPeak.count)} msgs in ${insights.chaosPeak.durationMin}m`);
    }
    if (insights.awards && insights.awards.length) {
      for (const a of insights.awards.slice(0, 3)) {
        highlights.push(`${a.icon} ${a.title}: ${labelFor(a.sender)} (${a.detail})`);
      }
    }
    const books = WhatsAppWords.bookReport(wAll.uniqueWords);
    if (books.writable) {
      highlights.push(`📚 Vocabulary covers *${books.writable.title}* (${numberFmt.format(wAll.uniqueWords)} unique words)`);
    }

    if (highlights.length) {
      lines.push('');
      lines.push('🏆 *Highlights*');
      for (const h of highlights) lines.push(`• ${h}`);
    }

    lines.push('');
    lines.push('_Counted locally in browser · WhatsApp Message Counter_');
    return lines.join('\n');
  }

  let copyResetTimer = null;
  async function copyWhatsAppSummary() {
    if (!current) return;
    const text = buildWhatsAppSummary();
    let ok = false;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      try {
        await navigator.clipboard.writeText(text);
        ok = true;
      } catch {
        ok = false;
      }
    }
    if (!ok) {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      try {
        ok = document.execCommand('copy');
      } catch {
        ok = false;
      }
      ta.remove();
    }
    if (cardBtn) {
      clearTimeout(copyResetTimer);
      cardBtn.textContent = ok ? 'Copied! ✓' : 'Copy failed';
      copyResetTimer = setTimeout(() => {
        cardBtn.textContent = 'Save card ▾';
      }, 1800);
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

    const yearTag = current.selectedYear ? '-' + current.selectedYear : '';
    const base = current.anon ? 'anonymized-chat' : (current.name || 'whatsapp-chat').replace(/\.(txt|zip)$/i, '');
    const filename = base + yearTag + (isStory ? '-story.png' : '-card.png');

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

    const rawTitle = current.anon ? 'Anonymized chat' : (current.name || 'WhatsApp chat');
    const titleText = current.selectedYear ? `${rawTitle} · ${current.selectedYear}` : rawTitle;
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
    const isAdj = Boolean(current.adjusted && current.quality);
    const bx = 60, by = 165, bw = 440, bh = 250;
    ctx.fillStyle = '#005c4b';
    roundRectPath(ctx, bx, by, bw, bh, 26);
    ctx.fill();

    ctx.fillStyle = '#e9edef';
    const numStr = isAdj ? formatAdjustedNum(current.quality.adjusted) : numberFmt.format(current.result.total);
    const numFontSize = numStr.length > 7 ? 78 : numStr.length > 5 ? 96 : 114;
    ctx.font = `700 ${numFontSize}px "Space Grotesk", system-ui, sans-serif`;
    ctx.fillText(numStr, bx + 36, by + 148);

    ctx.fillStyle = 'rgba(233, 237, 239, 0.8)';
    ctx.font = '400 20px "Space Grotesk", system-ui, sans-serif';
    ctx.textAlign = 'right';
    const wideUnit = isAdj
      ? `substantive · ${current.quality.signalPct}% real`
      : (current.result.total === 1 ? 'message' : 'messages');
    ctx.fillText(wideUnit, bx + bw - 68, by + bh - 28);
    ctx.textAlign = 'left';
    drawDoubleTicks(ctx, bx + bw - 56, by + bh - 42, 3);

    // Archetype + Vibe line under bubble
    const cardInsights = activeInsights();
    let vibeY = 456;
    if (cardInsights.archetype) {
      const arch = cardInsights.archetype;
      ctx.fillStyle = '#00a884';
      ctx.font = '600 20px "Space Grotesk", system-ui, sans-serif';
      ctx.fillText(`${arch.icon} ${arch.title}`.slice(0, 36), 60, vibeY);
      vibeY += 34;
    }
    const vibeStrings = Array.from(vibeList ? vibeList.children : []).map((el) => el.textContent);
    if (vibeStrings.length) {
      ctx.fillStyle = '#8696a0';
      ctx.font = '400 17px "Space Grotesk", system-ui, sans-serif';
      vibeStrings.slice(0, 3).forEach((vs, idx) => {
        ctx.fillText(vs.slice(0, 44), 60, vibeY + idx * 30);
      });
    }

    // Right side: mini rhythm strip
    const sx = 555, sy = 165, sw = 585, sh = 96;
    drawMiniStripOnCard(ctx, sx, sy, sw, sh, 190);

    // Right side: top 5 senders
    const cardTotal = Math.max(1, isAdj ? current.quality.adjusted : current.result.total);
    const topSenders = isAdj
      ? current.quality.senders.slice(0, 5).map((s) => ({ sender: s.sender, count: s.adjusted, signalPct: s.signalPct }))
      : current.result.senders.slice(0, 5);
    topSenders.forEach((s, idx) => {
      const y = 312 + idx * 54;
      const color = current.colors.get(s.sender) || '#00a884';
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(sx + 6, y - 6, 5, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#e9edef';
      ctx.font = '500 20px "Space Grotesk", system-ui, sans-serif';
      ctx.fillText(labelFor(s.sender).slice(0, 24), sx + 22, y);

      ctx.fillStyle = '#8696a0';
      ctx.textAlign = 'right';
      ctx.fillText(isAdj ? `${formatAdjustedNum(s.count)} (${s.signalPct}%)` : numberFmt.format(s.count), sx + sw, y);
      ctx.textAlign = 'left';

      ctx.fillStyle = '#1b252c';
      ctx.fillRect(sx, y + 12, sw, 5);
      ctx.fillStyle = color;
      ctx.fillRect(sx, y + 12, sw * (s.count / cardTotal), 5);
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
    ctx.fillText(current.selectedYear ? `chat wrapped · ${current.selectedYear}` : 'chat wrapped', 128, 130);

    const titleText = current.anon ? 'Anonymized chat' : (current.name || 'WhatsApp chat').replace(/\.(txt|zip)$/i, '');
    ctx.fillStyle = '#8696a0';
    ctx.font = '400 24px "Space Grotesk", system-ui, sans-serif';
    ctx.fillText(titleText.slice(0, 42), 92, 184);
    if (current.result.first && current.result.last) {
      ctx.fillText(`from ${current.result.first} to ${current.result.last}`, 92, 222);
    }
    const storyInsights = activeInsights();
    if (storyInsights.archetype) {
      const arch = storyInsights.archetype;
      ctx.fillStyle = '#00a884';
      ctx.font = '600 26px "Space Grotesk", system-ui, sans-serif';
      ctx.fillText(`${arch.icon} ${arch.title}`.slice(0, 38), 92, 264);
    }

    // Hero bubble
    const isAdj = Boolean(current.adjusted && current.quality);
    const bx = 92, by = 295, bw = W - 184, bh = 310;
    ctx.fillStyle = '#005c4b';
    roundRectPath(ctx, bx, by, bw, bh, 36);
    ctx.fill();

    ctx.fillStyle = '#e9edef';
    const numStr = isAdj ? formatAdjustedNum(current.quality.adjusted) : numberFmt.format(current.result.total);
    const numSize = numStr.length > 7 ? 112 : numStr.length > 5 ? 140 : 168;
    ctx.font = `700 ${numSize}px "Space Grotesk", system-ui, sans-serif`;
    ctx.fillText(numStr, bx + 48, by + 195);

    ctx.fillStyle = 'rgba(233, 237, 239, 0.85)';
    ctx.font = '400 28px "Space Grotesk", system-ui, sans-serif';
    ctx.textAlign = 'right';
    const storyUnit = isAdj
      ? `substantive · ${current.quality.signalPct}% real`
      : (current.result.total === 1 ? 'message' : 'messages');
    ctx.fillText(storyUnit, bx + bw - 92, by + bh - 38);
    ctx.textAlign = 'left';
    drawDoubleTicks(ctx, bx + bw - 74, by + bh - 56, 4);

    // Rhythm strip
    drawMiniStripOnCard(ctx, 92, 660, W - 184, 150, 200);

    // Top 5 senders
    ctx.fillStyle = '#8696a0';
    ctx.font = '500 22px "Space Grotesk", system-ui, sans-serif';
    ctx.fillText(isAdj ? 'top participants (spam-adjusted)' : 'top participants', 92, 875);

    const storyTotal = Math.max(1, isAdj ? current.quality.adjusted : current.result.total);
    const topSenders = isAdj
      ? current.quality.senders.slice(0, 5).map((s) => ({ sender: s.sender, count: s.adjusted, signalPct: s.signalPct }))
      : current.result.senders.slice(0, 5);
    topSenders.forEach((s, idx) => {
      const y = 935 + idx * 78;
      const color = current.colors.get(s.sender) || '#00a884';
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(102, y - 8, 8, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#e9edef';
      ctx.font = '500 28px "Space Grotesk", system-ui, sans-serif';
      ctx.fillText(labelFor(s.sender).slice(0, 24), 128, y);

      ctx.fillStyle = '#8696a0';
      ctx.textAlign = 'right';
      const rightTxt = isAdj
        ? `${formatAdjustedNum(s.count)} (${Math.round((s.count / storyTotal) * 100)}% · ${s.signalPct}% real)`
        : `${numberFmt.format(s.count)} (${Math.round((s.count / storyTotal) * 100)}%)`;
      ctx.fillText(rightTxt, W - 92, y);
      ctx.textAlign = 'left';

      ctx.fillStyle = '#1b252c';
      ctx.fillRect(92, y + 18, W - 184, 8);
      ctx.fillStyle = color;
      ctx.fillRect(92, y + 18, (W - 184) * (s.count / storyTotal), 8);
    });

    // Highlights / Awards cards (2x2 grid)
    const wAll = wordsFor(current.anon, false);
    const books = WhatsAppWords.bookReport(wAll.uniqueWords);
    const cards = [];
    if (storyInsights.peakHour) {
      cards.push(['peak hour', formatHour(storyInsights.peakHour.hour)]);
    }
    if (storyInsights.peakDay) {
      cards.push(['busiest day', `${storyInsights.peakDay.label}`]);
    }
    if (storyInsights.awards && storyInsights.awards.length) {
      for (const a of storyInsights.awards.slice(0, 2)) {
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
