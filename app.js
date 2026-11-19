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
  const fileName = $('fileName');
  const fileSub = $('fileSub');
  const bigNumber = $('bigNumber');
  const strip = $('strip');
  const sendersEl = $('senders');
  const extras = $('extras');
  const againBtn = $('againBtn');

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const numberFmt = new Intl.NumberFormat();

  // WhatsApp-ish participant colors, assigned in order of message count.
  const PALETTE = ['#00a884', '#53bdeb', '#f0b429', '#e56399', '#a78bfa', '#f47c48', '#7cd4c0', '#ff8a65'];

  const SAMPLE = [
    '12/05/2025, 18:42 - Messages and calls are end-to-end encrypted. No one outside of this chat, not even WhatsApp, can read or listen to them.',
    '12/05/2025, 18:43 - Alex: are we still on for tomorrow?',
    '12/05/2025, 18:43 - Sam: yes! train at 8',
    '12/05/2025, 18:44 - Alex: perfect, I will bring the tickets',
    '12/05/2025, 18:45 - Sam: IMG-20250512-WA0004.jpg (file attached)',
    '12/05/2025, 18:45 - Alex: haha, nice one',
    '12/05/2025, 18:46 - Sam: look at this\nand this\nand this',
    '12/05/2025, 18:47 - Alex: <Media omitted>',
    '12/05/2025, 18:49 - Sam: wait until you see the view from the top',
    '13/05/2025, 08:12 - Alex: morning! coffee at 9?',
    '13/05/2025, 08:13 - Sam: 9 works',
    '13/05/2025, 08:14 - Alex: great, see you there',
    '13/05/2025, 09:02 - Sam: on my way now',
    '13/05/2025, 09:15 - Sam changed the subject to "Trip plans"',
    '13/05/2025, 09:20 - Alex: booking the hotel tonight',
    '13/05/2025, 09:21 - Sam: I can look at flights',
    '13/05/2025, 09:22 - Alex: deal',
    '13/05/2025, 09:25 - Sam: VID-20250513-WA0001.mp4 (file attached)',
    '13/05/2025, 09:26 - Alex: that shortcut is unreal',
    '13/05/2025, 09:27 - Sam: adding it to the doc\nsecond line of the doc link',
    '14/05/2025, 19:40 - Alex: hotel booked',
    '14/05/2025, 19:41 - Sam: flights at 10:15',
    '14/05/2025, 19:42 - Alex: we are actually doing this',
    '14/05/2025, 19:43 - Sam: we are',
    '15/05/2025, 07:55 - Alex: gate closes in 20',
    '15/05/2025, 07:56 - Sam: running',
    '',
  ].join('\n');

  /* ---------- file intake ---------- */

  dropZone.addEventListener('click', () => fileInput.click());
  fileInput.addEventListener('change', () => {
    if (fileInput.files.length) handleFile(fileInput.files[0]);
    fileInput.value = '';
  });
  sampleBtn.addEventListener('click', () => {
    const result = WhatsAppParser.parse(SAMPLE);
    render('Sample chat.txt', new Blob([SAMPLE]).size, result);
  });
  errorSampleBtn.addEventListener('click', () => {
    const result = WhatsAppParser.parse(SAMPLE);
    render('Sample chat.txt', new Blob([SAMPLE]).size, result);
  });
  againBtn.addEventListener('click', reset);

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
    // .zip exports ("Include media") can't be read as text — say so plainly.
    const head = new Uint8Array(await file.slice(0, 4).arrayBuffer());
    const isZip = head[0] === 0x50 && head[1] === 0x4b;
    if (isZip || /\.zip$/i.test(file.name)) {
      showError('That file is a .zip archive. When exporting in WhatsApp, choose Without media — you will get a plain .txt you can drop here.');
      return;
    }
    let text;
    try {
      text = await file.text();
    } catch {
      showError('Could not read that file. Try again with the .txt from Export chat.');
      return;
    }
    const result = WhatsAppParser.parse(text);
    if (!result.total) {
      showError('No messages found in that file. A WhatsApp export has one message per line, like: 12/05/2025, 18:42 - Alex: hi. Make sure you exported the chat as a .txt (Without media).');
      return;
    }
    render(file.name, file.size, result);
  }

  function showError(message) {
    dropSection.hidden = true;
    resultSection.hidden = true;
    errorText.textContent = message;
    errorSection.hidden = false;
  }

  function reset() {
    errorSection.hidden = true;
    resultSection.hidden = true;
    dropSection.hidden = false;
    dropZone.focus();
  }

  /* ---------- rendering ---------- */

  let current = null; // { result, colors: Map<sender, color> }

  function render(name, size, result) {
    current = { result, colors: new Map() };
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

    countUp(bigNumber, result.total);
    buildSenderRows(result);
    drawStrip(1); // full reveal; animated below if motion allowed
    if (!reduceMotion) animateStrip();

    const parts = [];
    if (result.media) parts.push(`${numberFmt.format(result.media)} media message${result.media === 1 ? '' : 's'}`);
    if (result.systemNotes) parts.push(`${numberFmt.format(result.systemNotes)} system note${result.systemNotes === 1 ? '' : 's'} skipped`);
    extras.textContent = parts.join(', ');

    resultSection.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'nearest' });
  }

  function formatSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  }

  function countUp(el, target) {
    if (reduceMotion || target < 1) {
      el.textContent = numberFmt.format(target);
      return;
    }
    const duration = 900;
    const start = performance.now();
    function frame(now) {
      const t = Math.min(1, (now - start) / duration);
      const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
      el.textContent = numberFmt.format(Math.round(target * eased));
      if (t < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  function buildSenderRows(result) {
    sendersEl.textContent = '';
    for (const s of result.senders) {
      const li = document.createElement('li');
      li.className = 'sender';
      li.dataset.sender = s.sender;

      const chip = document.createElement('span');
      chip.className = 'chip';
      chip.style.background = current.colors.get(s.sender);

      const nameEl = document.createElement('span');
      nameEl.className = 'name';
      nameEl.textContent = s.sender;
      nameEl.title = s.sender;

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
      li.addEventListener('click', () => highlight(li.classList.contains('active') ? null : s.sender));
      sendersEl.appendChild(li);
    }
  }

  function highlight(sender) {
    for (const li of sendersEl.children) {
      li.classList.toggle('active', li.dataset.sender === sender);
    }
    drawStrip(1, sender);
  }

  /* ---------- rhythm strip ---------- */

  function drawStrip(progress, highlightSender) {
    if (!current) return;
    const { result, colors } = current;
    const dpr = window.devicePixelRatio || 1;
    const cssW = strip.clientWidth || strip.parentElement.clientWidth;
    const cssH = strip.clientHeight || 72;
    if (strip.width !== Math.round(cssW * dpr) || strip.height !== Math.round(cssH * dpr)) {
      strip.width = Math.round(cssW * dpr);
      strip.height = Math.round(cssH * dpr);
    }
    const ctx = strip.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, cssW, cssH);

    const msgs = result.messages;
    const n = msgs.length;
    if (!n) return;

    let maxLen = 1;
    for (const m of msgs) maxLen = Math.max(maxLen, m.text.length);
    const maxLog = Math.log(1 + maxLen);

    // Bucket messages so there are never more ticks than ~2px slots —
    // a 100k-message export still draws fast and stays legible.
    const maxTicks = Math.max(1, Math.floor(cssW / 2));
    const bucketSize = Math.max(1, Math.ceil(n / maxTicks));
    const buckets = Math.ceil(n / bucketSize);
    const slot = cssW / buckets;
    const gap = slot > 3 ? 1 : slot > 1.5 ? 0.5 : 0;
    const tickW = Math.max(0.6, slot - gap);
    const minH = 5;
    const visible = Math.max(1, Math.floor(buckets * progress));

    for (let b = 0; b < visible; b++) {
      const start = b * bucketSize;
      const end = Math.min(start + bucketSize, n);
      let best = null;
      for (let j = start; j < end; j++) {
        const m = msgs[j];
        if (highlightSender && m.sender !== highlightSender) continue;
        if (!best || m.text.length > best.text.length) best = m;
      }
      const dimmed = highlightSender && !best;
      if (!best) best = msgs[start]; // dimmed bucket keeps a representative shape
      const h = minH + (cssH - minH - 4) * (Math.log(1 + best.text.length) / maxLog);
      ctx.globalAlpha = dimmed ? 0.15 : 1;
      ctx.fillStyle = colors.get(best.sender) || '#8696a0';
      const x = b * slot + gap / 2;
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

  function animateStrip() {
    const duration = 700;
    const start = performance.now();
    function frame(now) {
      const t = Math.min(1, (now - start) / duration);
      drawStrip(t * t * (3 - 2 * t)); // smoothstep
      if (t < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  let resizeTimer = null;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => drawStrip(1), 100);
  });

  // ?sample loads the bundled demo chat (also handy for sharing a preview).
  if (/[?&]sample\b/.test(location.search)) {
    const result = WhatsAppParser.parse(SAMPLE);
    render('Sample chat.txt', new Blob([SAMPLE]).size, result);
  }

  // Tiny hook so tests (and the curious) can feed text straight in:
  // window.__countText('name.txt', rawText)
  window.__countText = (name, text) => {
    const result = WhatsAppParser.parse(text);
    if (!result.total) { showError('No messages found in that text.'); return; }
    render(name, new Blob([text]).size, result);
  };
})();
