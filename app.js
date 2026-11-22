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

  const wrappedModal = $('wrappedModal');
  const wrappedBars = $('wrappedBars');
  const wrappedCounter = $('wrappedCounter');
  const wrappedSlide = $('wrappedSlide');
  const wrappedCloseBtn = $('wrappedCloseBtn');
  const wrappedPrevBtn = $('wrappedPrevBtn');
  const wrappedNextBtn = $('wrappedNextBtn');

  // Anonymize & Export Studio modal
  const anonModal = $('anonModal');
  const anonModalSub = $('anonModalSub');
  const anonCloseBtn = $('anonCloseBtn');
  const anonModeTyped = $('anonModeTyped');
  const anonModeRealistic = $('anonModeRealistic');
  const anonRerollBtn = $('anonRerollBtn');
  const anonCatToggles = $('anonCatToggles');
  const anonTabEntities = $('anonTabEntities');
  const anonTabSuspects = $('anonTabSuspects');
  const anonTabPreview = $('anonTabPreview');
  const anonSuspectsBadge = $('anonSuspectsBadge');
  const anonEntitiesPane = $('anonEntitiesPane');
  const anonSuspectsPane = $('anonSuspectsPane');
  const anonPreviewPane = $('anonPreviewPane');
  const anonAddForm = $('anonAddForm');
  const anonAddInput = $('anonAddInput');
  const anonAddTarget = $('anonAddTarget');
  const anonEntityFilter = $('anonEntityFilter');
  const anonFilterCats = $('anonFilterCats');
  const anonEntityList = $('anonEntityList');
  const anonSuspectsList = $('anonSuspectsList');
  const anonAuditCard = $('anonAuditCard');
  const anonVerifyInput = $('anonVerifyInput');
  const anonVerifyResult = $('anonVerifyResult');
  const anonPreviewCount = $('anonPreviewCount');
  const anonDiffOnlyToggle = $('anonDiffOnlyToggle');
  const anonDiffList = $('anonDiffList');
  const anonDiffMoreBtn = $('anonDiffMoreBtn');
  const anonStatusPill = $('anonStatusPill');
  const anonCopyBtn = $('anonCopyBtn');
  const anonDownloadBtn = $('anonDownloadBtn');

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
    '14/05/2024, 23:41 - Alex: lmao guess you live in Lisbon now 💀',
    '14/05/2024, 23:42 - Priya changed the subject to "Priya Lives In Lisbon Now"',
    '14/05/2024, 23:42 - Sam: wait can you still cancel within 24 hours?',
    '14/05/2024, 23:43 - Priya: omg yes fixed it! crisis averted 😅',
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
    if (current.anon) ensureAnonPlan();
    syncAnonUI();
    refreshAnonViews();
  });

  if (exportBtn) {
    exportBtn.addEventListener('click', () => {
      if (!current) return;
      if (typeof WhatsAppAnonymizer !== 'undefined' && anonModal) {
        if (!current.anon) {
          current.anon = true;
          anonToggle.checked = true;
          syncAnonUI();
          refreshAnonViews();
        }
        openAnonStudio();
        return;
      }
      downloadAnonymizedExport();
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
      if (anonModal && !anonModal.hidden) closeAnonStudio();
      if (peekModal && !peekModal.hidden) closePeek();
      if (archModal && !archModal.hidden) closeArchetypeModal();
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
    closeWrapped();
    closeAnonStudio();
    closeCardMenu();
    if (typingStatus) typingStatus.hidden = true;
    errorSection.hidden = true;
    resultSection.hidden = true;
    dropSection.hidden = false;
    anonToggle.checked = false;
    wordsToggle.checked = false;
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

  function ensureAnonPlan() {
    if (!current) return null;
    if (typeof WhatsAppAnonymizer === 'undefined') return null;
    if (!current.anonPlan) {
      current.anonPlan = WhatsAppAnonymizer.createPlan(current.fullResult || current.result, {
        extraNames: readExtraNames(),
      });
    }
    return current.anonPlan;
  }

  function activeSenderMap() {
    if (!current) return new Map();
    if (current.anon && typeof WhatsAppAnonymizer !== 'undefined') {
      const plan = ensureAnonPlan();
      if (plan) return WhatsAppAnonymizer.senderLabelMap(plan);
    }
    return current.map;
  }

  function labelFor(sender) {
    if (!current || !current.anon) return sender;
    const sMap = activeSenderMap();
    return sMap.get(sender) || sender;
  }

  function textFor(rawText) {
    if (!current || !current.anon) return rawText;
    if (typeof WhatsAppAnonymizer !== 'undefined') {
      const plan = ensureAnonPlan();
      if (plan) return WhatsAppAnonymizer.anonymizeString(rawText, plan);
    }
    if (WhatsAppParser.replaceNames) {
      return WhatsAppParser.replaceNames(rawText, current.map, ensureDetected());
    }
    return rawText;
  }

  function syncAnonUI() {
    const on = Boolean(current && current.anon);
    if (extraNamesInput) extraNamesInput.hidden = !on;
    if (exportBtn) {
      exportBtn.hidden = false;
      exportBtn.classList.toggle('accent-btn', on);
      exportBtn.textContent = on ? '🛡️ Anonymize Studio & Export' : '🛡️ Anonymize & Export';
    }
  }

  function readExtraNames() {
    if (!extraNamesInput) return [];
    return extraNamesInput.value.split(/[,;\n]/).map((s) => s.trim()).filter(Boolean);
  }

  function ensureDetected() {
    if (typeof WhatsAppAnonymizer !== 'undefined') {
      const plan = ensureAnonPlan();
      if (plan) return WhatsAppAnonymizer.wordTokenMap(plan);
    }
    if (!current.detected) {
      current.detected = WhatsAppParser.detectNames(current.result, {
        senderMap: current.map,
        extraNames: readExtraNames(),
      });
    }
    return current.detected;
  }

  function refreshAnonViews() {
    if (!current) return;
    current.anonVersion = (current.anonVersion || 0) + 1;
    current.detected = null;
    current.wordsCache = {};
    current.erasCache = {};
    current.quiz = null;
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
    if (wrappedModal && !wrappedModal.hidden) renderWrappedSlide();
    hideTooltip();
  }

  function wordsFor(anon, filterStopWords) {
    const skip = filterStopWords !== false;
    const ver = current.anonVersion || 0;
    const key = (anon ? `anon|v${ver}|` : 'plain|') + (skip ? '1|' : '0|') + readExtraNames().join(',');
    if (!current.wordsCache[key]) {
      current.wordsCache[key] = WhatsAppWords.analyze(
        current.result.messages,
        Object.assign(
          { filterStopWords: skip },
          anon ? { senderMap: activeSenderMap(), nameMap: ensureDetected() } : {}
        )
      );
    }
    return current.wordsCache[key];
  }

  if (extraNamesInput) {
    extraNamesInput.addEventListener('input', () => {
      if (!current) return;
      if (typeof WhatsAppAnonymizer !== 'undefined' && current.anonPlan) {
        for (const extra of readExtraNames()) {
          if (extra.length >= 2) {
            WhatsAppAnonymizer.addCustomEntity(current.anonPlan, extra, 'person');
          }
        }
      }
      if (current.anon) refreshAnonViews();
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
    const keepWordsOpen = Boolean(wordsToggle && wordsToggle.checked);
    const keepStripMode = current.stripMode || 'timeline';
    render(current.name, current.size, sliced, current.rawText, {
      fullResult: current.fullResult,
      years: current.years,
      selectedYear: year,
      colors: current.colors,
      map: current.map,
      anonPlan: current.anonPlan,
      anon: keepAnon,
      wordsOpen: keepWordsOpen,
      stripMode: keepStripMode,
      skipScroll: true,
    });
  }

  function render(name, size, result, rawText, opts) {
    opts = opts || {};
    cancelAnimationFrame(countRaf);
    stopLensAuto();
    stopRace(false);
    closePeek();
    closeArchetypeModal();
    closeWrapped();
    closeAnonStudio();
    closeCardMenu();

    const fullResult = opts.fullResult || result;
    const years = opts.years || (WhatsAppParser.availableYears ? WhatsAppParser.availableYears(fullResult) : []);
    const selectedYear = opts.selectedYear || null;

    const insights = WhatsAppParser.insights
      ? WhatsAppParser.insights(result)
      : { hours: new Array(24).fill(0), weekdays: new Array(7).fill(0), dayList: [], hourSenders: [], totalParsedTs: 0, textChars: result.chars || 0, avgChars: 0, senderStats: {}, awards: [] };
    const timestamps = WhatsAppParser.parseTimestamps ? WhatsAppParser.parseTimestamps(result.messages) : [];
    const onThisDay = WhatsAppParser.findOnThisDay ? WhatsAppParser.findOnThisDay(result) : { total: 0, years: [] };

    const colors = opts.colors ? new Map(opts.colors) : new Map();
    if (!opts.colors) {
      fullResult.senders.forEach((s, i) => colors.set(s.sender, PALETTE[i % PALETTE.length]));
    }
    const map = opts.map || WhatsAppParser.senderMap(fullResult);
    const anon = Boolean(opts.anon);
    const stripMode = opts.stripMode || 'timeline';

    current = {
      result,
      fullResult,
      years,
      selectedYear,
      size,
      insights,
      timestamps,
      onThisDay,
      colors,
      map,
      anonPlan: opts.anonPlan || null,
      anonVersion: 0,
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

    const parts = [];
    if (result.media) parts.push(`${numberFmt.format(result.media)} media message${result.media === 1 ? '' : 's'}`);
    if (result.deleted) parts.push(`${numberFmt.format(result.deleted)} deleted`);
    if (result.edited) parts.push(`${numberFmt.format(result.edited)} edited`);
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
        || (wrappedModal && !wrappedModal.hidden)
        || (anonModal && !anonModal.hidden);
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
    const arch = current.insights.archetype;
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
    const arch = current.insights.archetype;
    if (!arch) return;

    if (archModalTitle) archModalTitle.textContent = `${arch.icon} ${arch.title}`;
    if (archModalSub) archModalSub.textContent = 'Why your chat earned this archetype';

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

  function renderVibes() {
    if (!vibeList || !current) return;
    const { insights, onThisDay } = current;
    const items = [];

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
    for (const item of items.slice(0, 7)) {
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
    const { result, insights } = current;
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

    // If spotlighting an anonymized label (Person A, Place 1, Jordan, Riverton, etc.), match its real terms.
    let personTerms = null;
    if (current.anon) {
      const plan = ensureAnonPlan();
      if (plan) {
        const matchedEnt = plan.entities.find((ent) =>
          WhatsAppAnonymizer.isEntityActive(plan, ent) &&
          WhatsAppAnonymizer.getLabel(plan, ent).toLowerCase() === word.toLowerCase()
        );
        if (matchedEnt) {
          const senderMatches = new Set(matchedEnt.senderKeys || []);
          const textTerms = matchedEnt.terms.map((t) => t.text).filter((t) => t.length >= 2);
          const re = textTerms.length
            ? new RegExp('(?<![\\p{L}\\p{N}_])(' + textTerms.map(escapeRegExp).join('|') + ')(?![\\p{L}\\p{N}_])', 'iu')
            : null;
          personTerms = { senderMatches, re };
        }
      } else if (/^Person [A-Z]+$/.test(word)) {
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
    const ver = current.anonVersion || 0;
    const key = (anon ? `anon|v${ver}|` : 'plain|') + readExtraNames().join(',');
    if (!Object.prototype.hasOwnProperty.call(current.erasCache, key)) {
      current.erasCache[key] = WhatsAppWords.chatEras(
        current.result.messages,
        current.timestamps,
        anon ? { senderMap: activeSenderMap(), nameMap: ensureDetected() } : {}
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
          senderMap: activeSenderMap(),
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

    row.append(senderEl, textEl, tsEl);
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
    const { result, insights } = current;
    const wAll = wordsFor(current.anon, false);
    const baseName = current.anon
      ? 'Anonymized chat'
      : (current.name || 'WhatsApp chat').replace(/\.(txt|zip)$/i, '');
    const title = current.selectedYear ? `${baseName} · ${current.selectedYear}` : baseName;

    const lines = [];
    lines.push(`💬 *${title}*`);
    const span = result.first && result.last ? ` · ${result.first} → ${result.last}` : '';
    lines.push(`*${numberFmt.format(result.total)} message${result.total === 1 ? '' : 's'}* · ${numberFmt.format(wAll.totalWords)} words${span}`);
    if (insights.archetype) {
      lines.push(`${insights.archetype.icon} Archetype: *${insights.archetype.title}*`);
    }

    if (result.senders.length >= 2) {
      lines.push('');
      lines.push('📊 *Leaderboard*');
      result.senders.slice(0, 6).forEach((s, idx) => {
        const pct = Math.round((s.count / result.total) * 100);
        lines.push(`${idx + 1}. ${labelFor(s.sender)} — ${numberFmt.format(s.count)} (${pct}%)`);
      });
      if (result.senders.length > 6) {
        lines.push(`…and ${result.senders.length - 6} more`);
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

    // Archetype + Vibe line under bubble
    let vibeY = 456;
    if (current.insights.archetype) {
      const arch = current.insights.archetype;
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
    ctx.fillText(current.selectedYear ? `chat wrapped · ${current.selectedYear}` : 'chat wrapped', 128, 130);

    const titleText = current.anon ? 'Anonymized chat' : (current.name || 'WhatsApp chat').replace(/\.(txt|zip)$/i, '');
    ctx.fillStyle = '#8696a0';
    ctx.font = '400 24px "Space Grotesk", system-ui, sans-serif';
    ctx.fillText(titleText.slice(0, 42), 92, 184);
    if (current.result.first && current.result.last) {
      ctx.fillText(`from ${current.result.first} to ${current.result.last}`, 92, 222);
    }
    if (current.insights.archetype) {
      const arch = current.insights.archetype;
      ctx.fillStyle = '#00a884';
      ctx.font = '600 26px "Space Grotesk", system-ui, sans-serif';
      ctx.fillText(`${arch.icon} ${arch.title}`.slice(0, 38), 92, 264);
    }

    // Hero bubble
    const bx = 92, by = 295, bw = W - 184, bh = 310;
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

  /* ========================================================================
   * Anonymize & Export Studio Modal Controller
   * ======================================================================== */

  const ANON_CATS = [
    { key: 'person',  label: 'People',   icon: '👤' },
    { key: 'place',   label: 'Places',   icon: '📍' },
    { key: 'org',     label: 'Orgs',     icon: '🏢' },
    { key: 'contact', label: 'Contacts', icon: '📱' },
    { key: 'file',    label: 'Files',    icon: '📎' },
    { key: 'group',   label: 'Groups',   icon: '💬' },
  ];

  const anonStudio = {
    tab: 'entities',       // 'entities' | 'suspects' | 'preview'
    filterCat: 'all',
    filterQuery: '',
    diffLimit: 40,
    diffOnly: true,
    verifyQuery: '',
    lastAudit: null,
    editingAliasId: null,
  };

  function getAnonymizedExportText() {
    if (!current) return '';
    if (typeof WhatsAppAnonymizer !== 'undefined') {
      const plan = ensureAnonPlan();
      if (plan) return WhatsAppAnonymizer.exportText(current.result, plan);
    }
    const opts = current.anon ? { senderMap: current.map, nameMap: ensureDetected() } : {};
    return WhatsAppParser.toText(current.result, opts);
  }

  function downloadAnonymizedExport() {
    if (!current) return;
    const text = getAnonymizedExportText();
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
  }

  function openAnonStudio(initialTab) {
    if (!current || !anonModal || typeof WhatsAppAnonymizer === 'undefined') return;
    ensureAnonPlan();
    if (initialTab) anonStudio.tab = initialTab;
    anonStudio.diffLimit = 40;
    anonStudio.editingAliasId = null;
    anonModal.hidden = false;
    renderAnonStudio(true);
  }

  function closeAnonStudio() {
    if (anonModal) anonModal.hidden = true;
  }

  function setAnonTab(tab) {
    anonStudio.tab = tab;
    if (anonTabEntities) {
      anonTabEntities.classList.toggle('active', tab === 'entities');
      anonTabEntities.setAttribute('aria-selected', String(tab === 'entities'));
    }
    if (anonTabSuspects) {
      anonTabSuspects.classList.toggle('active', tab === 'suspects');
      anonTabSuspects.setAttribute('aria-selected', String(tab === 'suspects'));
    }
    if (anonTabPreview) {
      anonTabPreview.classList.toggle('active', tab === 'preview');
      anonTabPreview.setAttribute('aria-selected', String(tab === 'preview'));
    }
    if (anonEntitiesPane) anonEntitiesPane.hidden = tab !== 'entities';
    if (anonSuspectsPane) anonSuspectsPane.hidden = tab !== 'suspects';
    if (anonPreviewPane) anonPreviewPane.hidden = tab !== 'preview';
    renderAnonActivePane();
  }

  function onAnonPlanMutated(reAudit) {
    if (reAudit !== false) anonStudio.lastAudit = null;
    if (current && current.anon) refreshAnonViews();
    renderAnonStudio(reAudit !== false);
  }

  function ensureStudioAudit() {
    if (!current) return null;
    const plan = ensureAnonPlan();
    if (!plan) return null;
    if (!anonStudio.lastAudit) {
      anonStudio.lastAudit = WhatsAppAnonymizer.auditLeaks(current.result, plan);
    }
    return anonStudio.lastAudit;
  }

  function renderAnonStudio(refreshAudit) {
    if (!current || !anonModal || anonModal.hidden) return;
    const plan = ensureAnonPlan();
    if (!plan) return;
    if (refreshAudit) anonStudio.lastAudit = null;
    const audit = ensureStudioAudit();

    // Header subtitle
    if (anonModalSub && audit) {
      const s = audit.stats;
      const scope = current.selectedYear ? ` (${current.selectedYear})` : '';
      anonModalSub.textContent = `${s.activeEntities} active rules · ${numberFmt.format(s.totalReplacements)} replacements across ${numberFmt.format(s.messagesChanged)} messages${scope} · 100% local`;
    }

    // Mode toggle buttons
    const isReal = plan.mode === 'realistic';
    if (anonModeTyped) {
      anonModeTyped.classList.toggle('active', !isReal);
      anonModeTyped.setAttribute('aria-selected', String(!isReal));
    }
    if (anonModeRealistic) {
      anonModeRealistic.classList.toggle('active', isReal);
      anonModeRealistic.setAttribute('aria-selected', String(isReal));
    }
    if (anonRerollBtn) anonRerollBtn.hidden = !isReal;

    // Category master toggle pills
    if (anonCatToggles) {
      anonCatToggles.textContent = '';
      const counts = {};
      for (const ent of plan.entities) counts[ent.type] = (counts[ent.type] || 0) + 1;
      for (const c of ANON_CATS) {
        const cnt = counts[c.key] || 0;
        const on = plan.categories[c.key] !== false;
        const lbl = document.createElement('label');
        lbl.className = `anon-cat-pill cat-${c.key}` + (on ? '' : ' off');
        const cb = document.createElement('input');
        cb.type = 'checkbox';
        cb.checked = on;
        cb.addEventListener('change', () => {
          WhatsAppAnonymizer.setCategoryEnabled(plan, c.key, cb.checked);
          onAnonPlanMutated(true);
        });
        const dot = document.createElement('span');
        dot.className = 'cat-dot';
        const txt = document.createElement('span');
        txt.textContent = `${c.icon} ${c.label}`;
        const num = document.createElement('span');
        num.className = 'cat-cnt';
        num.textContent = `(${cnt})`;
        lbl.append(cb, dot, txt, num);
        anonCatToggles.appendChild(lbl);
      }
    }

    // Suspects badge
    const unreviewed = plan.suspects.filter((s) => !s.dismissed).length;
    if (anonSuspectsBadge) {
      anonSuspectsBadge.hidden = unreviewed === 0;
      anonSuspectsBadge.textContent = String(unreviewed);
    }

    // Footer privacy status pill
    if (anonStatusPill && audit) {
      anonStatusPill.className = `anon-status-pill ${audit.status}`;
      const highCnt = audit.findings.filter((f) => f.severity === 'high').length;
      if (highCnt > 0) {
        anonStatusPill.textContent = `⚠️ ${highCnt} potential leak${highCnt === 1 ? '' : 's'} detected · Score ${audit.score}/100`;
      } else if (unreviewed > 0) {
        anonStatusPill.textContent = `👀 ${unreviewed} proper noun${unreviewed === 1 ? '' : 's'} to review · Score ${audit.score}/100`;
      } else {
        anonStatusPill.textContent = `✅ Leak check clean · Score ${audit.score}/100 · saves as anonymized-chat.txt`;
      }
    }

    setAnonTab(anonStudio.tab);
  }

  function renderAnonActivePane() {
    if (anonStudio.tab === 'entities') renderAnonEntities();
    else if (anonStudio.tab === 'suspects') renderAnonSuspects();
    else renderAnonPreview();
  }

  function renderAnonAddTargets(plan) {
    if (!anonAddTarget) return;
    const prev = anonAddTarget.value;
    anonAddTarget.textContent = '';

    const grpNew = document.createElement('optgroup');
    grpNew.label = 'Add as new entity';
    for (const c of ANON_CATS) {
      const opt = document.createElement('option');
      opt.value = 'new:' + c.key;
      opt.textContent = `${c.icon} New ${c.label.replace(/s$/, '')}`;
      grpNew.appendChild(opt);
    }
    anonAddTarget.appendChild(grpNew);

    const people = plan.entities.filter((e) => e.type === 'person' && !e.patternRe);
    if (people.length) {
      const grpMerge = document.createElement('optgroup');
      grpMerge.label = 'Add as nickname / alias of…';
      for (const p of people) {
        const opt = document.createElement('option');
        opt.value = 'alias:' + p.id;
        opt.textContent = `↳ ${WhatsAppAnonymizer.getLabel(plan, p)} (${p.primary})`;
        grpMerge.appendChild(opt);
      }
      anonAddTarget.appendChild(grpMerge);
    }

    if (prev && Array.from(anonAddTarget.options).some((o) => o.value === prev)) {
      anonAddTarget.value = prev;
    }
  }

  function renderAnonEntities() {
    const plan = ensureAnonPlan();
    if (!plan || !anonEntityList) return;

    renderAnonAddTargets(plan);

    // Filter category pills
    if (anonFilterCats) {
      anonFilterCats.textContent = '';
      const opts = [{ key: 'all', label: 'All' }].concat(ANON_CATS.map((c) => ({ key: c.key, label: c.label })));
      for (const o of opts) {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'pill-btn' + (anonStudio.filterCat === o.key ? ' active' : '');
        btn.textContent = o.label;
        btn.addEventListener('click', () => {
          anonStudio.filterCat = o.key;
          renderAnonEntities();
        });
        anonFilterCats.appendChild(btn);
      }
    }

    const q = anonStudio.filterQuery.trim().toLowerCase();
    const list = plan.entities.filter((ent) => {
      if (anonStudio.filterCat !== 'all' && ent.type !== anonStudio.filterCat) return false;
      if (!q) return true;
      const lbl = WhatsAppAnonymizer.getLabel(plan, ent).toLowerCase();
      return ent.primary.toLowerCase().includes(q)
        || lbl.includes(q)
        || ent.terms.some((t) => t.text.toLowerCase().includes(q));
    });

    anonEntityList.textContent = '';
    if (!list.length) {
      const empty = document.createElement('div');
      empty.className = 'anon-empty';
      empty.textContent = q
        ? `No detected entities match “${anonStudio.filterQuery}”. Add it above to scrub it!`
        : 'No detected entities in this category yet.';
      anonEntityList.appendChild(empty);
      return;
    }

    const mergeTargets = plan.entities.filter((e) => !e.patternRe);

    for (const ent of list) {
      const active = WhatsAppAnonymizer.isEntityActive(plan, ent);
      const row = document.createElement('div');
      row.className = `anon-entity cat-${ent.type}` + (active ? '' : ' disabled');

      // Top line: checkbox, terms/aliases, arrow, label input, count
      const top = document.createElement('div');
      top.className = 'anon-entity-top';

      const cb = document.createElement('input');
      cb.type = 'checkbox';
      cb.className = 'anon-entity-check';
      cb.checked = ent.enabled;
      cb.title = ent.enabled ? 'Scrubbing enabled' : 'Disabled (will NOT be replaced)';
      cb.addEventListener('change', () => {
        WhatsAppAnonymizer.toggleEntity(plan, ent.id, cb.checked);
        onAnonPlanMutated(true);
      });

      const termsWrap = document.createElement('div');
      termsWrap.className = 'anon-terms';

      if (ent.patternRe) {
        const chip = document.createElement('span');
        chip.className = 'anon-term-chip';
        chip.textContent = ent.primary;
        termsWrap.appendChild(chip);
      } else {
        for (const t of ent.terms) {
          const chip = document.createElement('span');
          chip.className = 'anon-term-chip' + (ent.isSender && t.text === ent.primary ? ' sender-chip' : '');
          chip.textContent = t.text;
          if (ent.terms.length > 1 || ent.isSender) {
            const rm = document.createElement('button');
            rm.type = 'button';
            rm.className = 'anon-term-remove';
            rm.textContent = '×';
            rm.title = `Stop matching “${t.text}”`;
            rm.addEventListener('click', () => {
              WhatsAppAnonymizer.removeAlias(plan, ent.id, t.text);
              onAnonPlanMutated(true);
            });
            chip.appendChild(rm);
          }
          termsWrap.appendChild(chip);
        }

        if (anonStudio.editingAliasId === ent.id) {
          const inlineForm = document.createElement('form');
          inlineForm.className = 'anon-alias-inline';
          const inp = document.createElement('input');
          inp.type = 'text';
          inp.placeholder = 'nickname…';
          inp.autocomplete = 'off';
          const okBtn = document.createElement('button');
          okBtn.type = 'submit';
          okBtn.className = 'pill-action';
          okBtn.textContent = 'Add';
          inlineForm.addEventListener('submit', (ev) => {
            ev.preventDefault();
            const val = inp.value.trim();
            anonStudio.editingAliasId = null;
            if (val.length >= 2) {
              WhatsAppAnonymizer.addAlias(plan, ent.id, val);
              onAnonPlanMutated(true);
            } else {
              renderAnonEntities();
            }
          });
          inlineForm.append(inp, okBtn);
          termsWrap.appendChild(inlineForm);
          setTimeout(() => inp.focus(), 0);
        } else {
          const addBtn = document.createElement('button');
          addBtn.type = 'button';
          addBtn.className = 'anon-alias-btn';
          addBtn.textContent = '+ alias';
          addBtn.title = 'Add a nickname or alternate spelling that maps to this same label';
          addBtn.addEventListener('click', () => {
            anonStudio.editingAliasId = ent.id;
            renderAnonEntities();
          });
          termsWrap.appendChild(addBtn);
        }
      }

      const arrow = document.createElement('span');
      arrow.className = 'anon-arrow';
      arrow.textContent = '→';

      const labelInp = document.createElement('input');
      labelInp.type = 'text';
      labelInp.className = 'anon-label-input';
      labelInp.value = ent.customLabel || '';
      labelInp.placeholder = plan.mode === 'realistic' ? ent.fakeLabel : ent.typedLabel;
      labelInp.title = 'Custom replacement label (leave blank for automatic)';
      labelInp.addEventListener('change', () => {
        WhatsAppAnonymizer.setEntityCustomLabel(plan, ent.id, labelInp.value);
        onAnonPlanMutated(true);
      });

      const countPill = document.createElement('span');
      countPill.className = 'anon-count-pill';
      countPill.textContent = `×${numberFmt.format(ent.count)}`;

      top.append(cb, termsWrap, arrow, labelInp, countPill);

      // Meta line: sample snippet + category selector + merge selector
      const meta = document.createElement('div');
      meta.className = 'anon-entity-meta';

      const sample = document.createElement('span');
      sample.className = 'anon-sample';
      if (ent.samples && ent.samples.length) {
        const s0 = ent.samples[0];
        sample.textContent = s0.sender ? `${s0.sender}: “${s0.text}”` : `“${s0.text}”`;
        sample.title = sample.textContent;
      } else {
        sample.textContent = ent.isSender ? 'Chat participant' : `Detected via ${ent.source}`;
      }

      const controls = document.createElement('div');
      controls.className = 'anon-entity-controls';

      if (!ent.patternRe) {
        // Category dropdown
        const catSel = document.createElement('select');
        catSel.className = 'anon-select anon-select-xs';
        catSel.title = 'Entity category';
        for (const c of ANON_CATS) {
          const opt = document.createElement('option');
          opt.value = c.key;
          opt.textContent = `${c.icon} ${c.label.replace(/s$/, '')}`;
          if (c.key === ent.type) opt.selected = true;
          catSel.appendChild(opt);
        }
        catSel.addEventListener('change', () => {
          WhatsAppAnonymizer.setEntityType(plan, ent.id, catSel.value);
          onAnonPlanMutated(true);
        });
        controls.appendChild(catSel);

        // Merge into another entity (great for folding nicknames or @handles into a Person)
        const candidates = mergeTargets.filter((m) => m.id !== ent.id && (m.type === ent.type || m.type === 'person'));
        if (candidates.length) {
          const mergeSel = document.createElement('select');
          mergeSel.className = 'anon-select anon-select-xs';
          mergeSel.title = 'Merge this entity into another entity so they share one label';
          const defOpt = document.createElement('option');
          defOpt.value = '';
          defOpt.textContent = 'Merge into…';
          mergeSel.appendChild(defOpt);
          for (const m of candidates.slice(0, 40)) {
            const opt = document.createElement('option');
            opt.value = m.id;
            opt.textContent = `${WhatsAppAnonymizer.getLabel(plan, m)} (${m.primary})`;
            mergeSel.appendChild(opt);
          }
          mergeSel.addEventListener('change', () => {
            if (!mergeSel.value) return;
            WhatsAppAnonymizer.mergeEntities(plan, ent.id, mergeSel.value);
            onAnonPlanMutated(true);
          });
          controls.appendChild(mergeSel);
        }
      }

      meta.append(sample, controls);
      row.append(top, meta);
      anonEntityList.appendChild(row);
    }
  }

  function renderAnonSuspects() {
    const plan = ensureAnonPlan();
    if (!plan || !anonSuspectsList) return;
    anonSuspectsList.textContent = '';

    const active = plan.suspects.filter((s) => !s.dismissed);
    if (!active.length) {
      const empty = document.createElement('div');
      empty.className = 'anon-empty';
      empty.textContent = '✅ All clear! No unrecognised mid-sentence proper nouns left to review.';
      anonSuspectsList.appendChild(empty);
      return;
    }

    const people = plan.entities.filter((e) => e.type === 'person' && !e.patternRe);

    for (const s of active) {
      const row = document.createElement('div');
      row.className = 'anon-suspect-row';

      const info = document.createElement('div');
      info.className = 'anon-suspect-info';

      const title = document.createElement('div');
      title.className = 'anon-suspect-term';
      const termSpan = document.createElement('span');
      termSpan.textContent = s.term;
      const cnt = document.createElement('span');
      cnt.className = 'anon-count-pill';
      cnt.textContent = `×${s.count}`;
      title.append(termSpan, cnt);

      const sample = document.createElement('span');
      sample.className = 'anon-sample';
      if (s.samples && s.samples.length) {
        const s0 = s.samples[0];
        sample.textContent = s0.sender ? `${s0.sender}: “${s0.text}”` : `“${s0.text}”`;
        sample.title = sample.textContent;
      }

      info.append(title, sample);

      const actions = document.createElement('div');
      actions.className = 'anon-suspect-actions';

      const mkBtn = (label, cat) => {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'pill-action' + (s.suggestedType === cat ? ' accent-pill' : '');
        b.textContent = label;
        b.addEventListener('click', () => {
          WhatsAppAnonymizer.promoteSuspect(plan, s.term, cat);
          onAnonPlanMutated(true);
        });
        return b;
      };

      actions.append(mkBtn('+ Person', 'person'), mkBtn('+ Place', 'place'), mkBtn('+ Org', 'org'));

      if (people.length) {
        const sel = document.createElement('select');
        sel.className = 'anon-select anon-select-xs';
        const def = document.createElement('option');
        def.value = '';
        def.textContent = 'Alias of…';
        sel.appendChild(def);
        for (const p of people.slice(0, 30)) {
          const opt = document.createElement('option');
          opt.value = p.id;
          opt.textContent = `${WhatsAppAnonymizer.getLabel(plan, p)} (${p.primary})`;
          sel.appendChild(opt);
        }
        sel.addEventListener('change', () => {
          if (!sel.value) return;
          WhatsAppAnonymizer.promoteSuspect(plan, s.term, { mergeInto: sel.value });
          onAnonPlanMutated(true);
        });
        actions.appendChild(sel);
      }

      const ign = document.createElement('button');
      ign.type = 'button';
      ign.className = 'text-btn';
      ign.textContent = 'Ignore';
      ign.addEventListener('click', () => {
        WhatsAppAnonymizer.promoteSuspect(plan, s.term, 'dismiss');
        onAnonPlanMutated(true);
      });
      actions.appendChild(ign);

      row.append(info, actions);
      anonSuspectsList.appendChild(row);
    }
  }

  function renderAnonPreview() {
    const plan = ensureAnonPlan();
    if (!plan || !current) return;
    const audit = ensureStudioAudit();

    // 1. Privacy Shield audit card
    if (anonAuditCard && audit) {
      anonAuditCard.textContent = '';
      const top = document.createElement('div');
      top.className = 'anon-audit-top';

      const ring = document.createElement('div');
      ring.className = `anon-score-ring ${audit.status}`;
      ring.textContent = `${audit.score}/100`;

      const sum = document.createElement('div');
      sum.className = 'anon-audit-summary';
      const t = document.createElement('div');
      t.className = 'anon-audit-title';
      if (audit.status === 'clean') t.textContent = '✅ Strong anonymization — no obvious PII leaks found';
      else if (audit.status === 'review') t.textContent = '👀 Almost spotless — a few unreviewed proper nouns remain';
      else t.textContent = '⚠️ Potential leaks detected in the anonymized output';

      const st = document.createElement('div');
      st.className = 'anon-audit-stats';
      const b = audit.stats.byType;
      const parts = [];
      if (b.person) parts.push(`${numberFmt.format(b.person)} people`);
      if (b.place) parts.push(`${numberFmt.format(b.place)} places`);
      if (b.org) parts.push(`${numberFmt.format(b.org)} orgs`);
      if (b.contact) parts.push(`${numberFmt.format(b.contact)} contacts`);
      if (b.file) parts.push(`${numberFmt.format(b.file)} files`);
      if (b.group) parts.push(`${numberFmt.format(b.group)} group names`);
      st.textContent = parts.length
        ? `Scrubbed: ${parts.join(' · ')}`
        : 'No replacements active yet.';

      sum.append(t, st);
      top.append(ring, sum);
      anonAuditCard.appendChild(top);

      if (audit.findings.length) {
        const fWrap = document.createElement('div');
        fWrap.className = 'anon-findings';
        for (const f of audit.findings.slice(0, 10)) {
          const row = document.createElement('div');
          row.className = 'anon-finding-row';
          const txt = document.createElement('span');
          txt.textContent = `Residual ${f.kind.replace('_', ' ')}: “${f.term}” (×${f.count})`;
          const btn = document.createElement('button');
          btn.type = 'button';
          btn.className = 'pill-action accent-pill';
          btn.textContent = '+ Scrub now';
          btn.addEventListener('click', () => {
            const cat = f.kind === 'postcode' ? 'place' : f.kind === 'sender_fragment' ? 'person' : 'contact';
            WhatsAppAnonymizer.addCustomEntity(plan, f.term, cat);
            onAnonPlanMutated(true);
          });
          row.append(txt, btn);
          fWrap.appendChild(row);
        }
        anonAuditCard.appendChild(fWrap);
      }
    }

    // 2. Verify-a-word search result
    renderAnonVerifyResult(plan);

    // 3. Before / After message diff list
    if (!anonDiffList) return;
    anonDiffList.textContent = '';

    const entries = current.result.entries;
    const sMap = WhatsAppAnonymizer.senderLabelMap(plan);
    const matches = [];
    const maxScan = entries.length;
    const targetCount = anonStudio.diffLimit + 1;

    for (let i = 0; i < maxScan && matches.length < targetCount; i++) {
      const e = entries[i];
      const diff = WhatsAppAnonymizer.anonymizeStringWithDiff(e.text, plan);
      const hasBodyChange = diff.segments.some((seg) => seg.replaced);
      const anonSender = e.kind === 'message' ? (sMap.get(e.sender) || e.sender) : null;
      const hasSenderChange = e.kind === 'message' && anonSender !== e.sender;
      if (anonStudio.diffOnly && !hasBodyChange && !hasSenderChange) continue;
      matches.push({ entry: e, diff, anonSender });
    }

    const hasMore = matches.length > anonStudio.diffLimit;
    const shown = matches.slice(0, anonStudio.diffLimit);

    if (anonPreviewCount) {
      anonPreviewCount.textContent = anonStudio.diffOnly
        ? `Showing ${shown.length}${hasMore ? '+' : ''} redacted lines (Before → After)`
        : `Showing first ${shown.length} lines (Before → After)`;
    }
    if (anonDiffMoreBtn) anonDiffMoreBtn.hidden = !hasMore;

    if (!shown.length) {
      const empty = document.createElement('div');
      empty.className = 'anon-empty';
      empty.textContent = 'No redacted messages match this filter.';
      anonDiffList.appendChild(empty);
      return;
    }

    for (const item of shown) {
      const e = item.entry;
      const card = document.createElement('div');
      card.className = 'anon-diff-card';

      const before = document.createElement('div');
      before.className = 'anon-diff-col before';
      const bHead = document.createElement('span');
      bHead.className = 'anon-diff-sender';
      bHead.textContent = e.kind === 'message' ? `${e.sender} · ${e.ts}` : `System · ${e.ts}`;
      before.appendChild(bHead);

      const after = document.createElement('div');
      after.className = 'anon-diff-col after';
      const aHead = document.createElement('span');
      aHead.className = 'anon-diff-sender';
      aHead.textContent = e.kind === 'message' ? `${item.anonSender} · ${e.ts}` : `System · ${e.ts}`;
      after.appendChild(aHead);

      for (const seg of item.diff.segments) {
        if (seg.replaced) {
          const origMark = document.createElement('span');
          origMark.className = 'anon-mark-orig';
          origMark.textContent = seg.original;
          before.appendChild(origMark);

          const newMark = document.createElement('span');
          newMark.className = `anon-mark cat-${seg.type}`;
          newMark.textContent = seg.text;
          newMark.title = `Replaced “${seg.original}” (${seg.type})`;
          after.appendChild(newMark);
        } else {
          before.appendChild(document.createTextNode(seg.text));
          after.appendChild(document.createTextNode(seg.text));
        }
      }

      card.append(before, after);
      anonDiffList.appendChild(card);
    }
  }

  function renderAnonVerifyResult(plan) {
    if (!anonVerifyResult || !current) return;
    const q = anonStudio.verifyQuery.trim();
    if (q.length < 2) {
      anonVerifyResult.hidden = true;
      return;
    }
    const qLo = q.toLowerCase();
    const sMap = WhatsAppAnonymizer.senderLabelMap(plan);
    let hits = 0;
    const snippets = [];
    for (const e of current.result.entries) {
      const line = e.kind === 'message'
        ? `${sMap.get(e.sender) || e.sender}: ${WhatsAppAnonymizer.anonymizeString(e.text, plan)}`
        : WhatsAppAnonymizer.anonymizeString(e.text, plan);
      if (line.toLowerCase().includes(qLo)) {
        hits++;
        if (snippets.length < 3) snippets.push(line.slice(0, 140));
      }
    }

    anonVerifyResult.hidden = false;
    anonVerifyResult.className = 'anon-verify-result ' + (hits === 0 ? 'ok' : 'found');
    anonVerifyResult.textContent = '';

    const head = document.createElement('div');
    head.className = 'anon-verify-head';
    const msg = document.createElement('span');
    if (hits === 0) {
      msg.textContent = `✅ 0 mentions of “${q}” remain in the anonymized export!`;
      head.appendChild(msg);
      anonVerifyResult.appendChild(head);
    } else {
      msg.textContent = `⚠️ “${q}” still appears in ${numberFmt.format(hits)} anonymized line${hits === 1 ? '' : 's'}`;
      const btns = document.createElement('div');
      btns.className = 'anon-suspect-actions';
      for (const [lbl, cat] of [['+ Scrub as Person', 'person'], ['+ Place', 'place'], ['+ Org', 'org']]) {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'pill-action accent-pill';
        b.textContent = lbl;
        b.addEventListener('click', () => {
          WhatsAppAnonymizer.addCustomEntity(plan, q, cat);
          onAnonPlanMutated(true);
        });
        btns.appendChild(b);
      }
      head.append(msg, btns);
      anonVerifyResult.appendChild(head);
      for (const sn of snippets) {
        const p = document.createElement('div');
        p.className = 'anon-sample';
        p.textContent = sn;
        anonVerifyResult.appendChild(p);
      }
    }
  }

  // Bind Studio modal events
  if (anonCloseBtn) anonCloseBtn.addEventListener('click', closeAnonStudio);
  if (anonModal) {
    anonModal.addEventListener('click', (e) => {
      if (e.target === anonModal) closeAnonStudio();
    });
  }
  if (anonModeTyped) {
    anonModeTyped.addEventListener('click', () => {
      const plan = ensureAnonPlan();
      if (!plan) return;
      WhatsAppAnonymizer.setMode(plan, 'typed');
      onAnonPlanMutated(true);
    });
  }
  if (anonModeRealistic) {
    anonModeRealistic.addEventListener('click', () => {
      const plan = ensureAnonPlan();
      if (!plan) return;
      WhatsAppAnonymizer.setMode(plan, 'realistic');
      onAnonPlanMutated(true);
    });
  }
  if (anonRerollBtn) {
    anonRerollBtn.addEventListener('click', () => {
      const plan = ensureAnonPlan();
      if (!plan) return;
      WhatsAppAnonymizer.rerollFakeNames(plan);
      onAnonPlanMutated(true);
    });
  }
  if (anonTabEntities) anonTabEntities.addEventListener('click', () => setAnonTab('entities'));
  if (anonTabSuspects) anonTabSuspects.addEventListener('click', () => setAnonTab('suspects'));
  if (anonTabPreview) anonTabPreview.addEventListener('click', () => setAnonTab('preview'));
  if (anonStatusPill) {
    anonStatusPill.addEventListener('click', () => {
      const plan = ensureAnonPlan();
      const unrev = plan ? plan.suspects.filter((s) => !s.dismissed).length : 0;
      const audit = ensureStudioAudit();
      const hasHigh = audit && audit.findings.some((f) => f.severity === 'high');
      setAnonTab(hasHigh ? 'preview' : (unrev > 0 ? 'suspects' : 'preview'));
    });
  }
  if (anonAddForm) {
    anonAddForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const plan = ensureAnonPlan();
      if (!plan || !anonAddInput) return;
      const raw = anonAddInput.value.trim();
      if (raw.length < 2) return;
      const target = anonAddTarget ? anonAddTarget.value : 'new:person';
      const items = raw.split(/[,;\n]/).map((s) => s.trim()).filter((s) => s.length >= 2);
      for (const item of items) {
        if (target.startsWith('alias:')) {
          WhatsAppAnonymizer.addAlias(plan, target.slice(6), item);
        } else {
          const cat = target.startsWith('new:') ? target.slice(4) : 'person';
          WhatsAppAnonymizer.addCustomEntity(plan, item, cat);
        }
      }
      anonAddInput.value = '';
      onAnonPlanMutated(true);
    });
  }
  if (anonEntityFilter) {
    anonEntityFilter.addEventListener('input', () => {
      anonStudio.filterQuery = anonEntityFilter.value;
      renderAnonEntities();
    });
  }
  if (anonVerifyInput) {
    anonVerifyInput.addEventListener('input', () => {
      anonStudio.verifyQuery = anonVerifyInput.value;
      const plan = ensureAnonPlan();
      if (plan) renderAnonVerifyResult(plan);
    });
  }
  if (anonDiffOnlyToggle) {
    anonDiffOnlyToggle.addEventListener('change', () => {
      anonStudio.diffOnly = anonDiffOnlyToggle.checked;
      anonStudio.diffLimit = 40;
      renderAnonPreview();
    });
  }
  if (anonDiffMoreBtn) {
    anonDiffMoreBtn.addEventListener('click', () => {
      anonStudio.diffLimit += 50;
      renderAnonPreview();
    });
  }
  if (anonDownloadBtn) {
    anonDownloadBtn.addEventListener('click', () => {
      downloadAnonymizedExport();
      const orig = anonDownloadBtn.textContent;
      anonDownloadBtn.textContent = '✓ Downloaded anonymized-chat.txt';
      setTimeout(() => { anonDownloadBtn.textContent = orig; }, 2000);
    });
  }
  if (anonCopyBtn) {
    anonCopyBtn.addEventListener('click', async () => {
      const text = getAnonymizedExportText();
      const orig = anonCopyBtn.textContent;
      try {
        await navigator.clipboard.writeText(text);
        anonCopyBtn.textContent = 'Copied ✓';
      } catch (_) {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        ta.remove();
        anonCopyBtn.textContent = 'Copied ✓';
      }
      setTimeout(() => { anonCopyBtn.textContent = orig; }, 1800);
    });
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
