/* ============================================================
   APP — hero intro, telemetry, scanner cursor, section motion,
   case files (declassify + view-transition detail), audio hook.
   ============================================================ */
(function () {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  document.getElementById('year').textContent = new Date().getFullYear();

  /* ---------- HERO: name word-reveal + typewriter ---------- */
  const nameEl = $('.hero-name');
  if (nameEl) {
    const text = nameEl.dataset.text;
    nameEl.innerHTML = text.split(' ').map(w =>
      `<span class="w"><span>${w}</span></span>`
    ).join(' ');
  }

  const TYPE_FALLBACK = "I build clean, fast web apps and I'm learning to secure and run them.";
  function typeStr() { return (window.t && window.t('hero.type')) || TYPE_FALLBACK; }
  let typeTimer = null;
  function typewriter(el) {
    if (!el) return;
    const TYPE = typeStr();
    if (typeTimer) { clearTimeout(typeTimer); typeTimer = null; }
    if (reduce) { el.innerHTML = '<span class="txt"></span>'; el.querySelector('.txt').textContent = TYPE; return; }
    el.innerHTML = '<span class="txt"></span><span class="car"></span>';
    const txt = el.querySelector('.txt');
    let i = 0;
    (function tick() {
      if (i <= TYPE.length) {
        txt.textContent = TYPE.slice(0, i);
        i++;
        typeTimer = setTimeout(tick, 18 + Math.random() * 26);
      }
    })();
  }

  let introFired = false;
  function intro() {
    if (introFired) return; introFired = true;
    if (nameEl) nameEl.classList.add('in');
    $$('#hero .rise').forEach((el, i) => setTimeout(() => el.classList.add('in'), 120 + i * 110));
    setTimeout(() => typewriter($('#hero-type')), reduce ? 0 : 520);
  }
  window.addEventListener('aws:access', intro);
  // re-type the hero line when the language changes (only after intro has run)
  window.addEventListener('aws:lang', () => { if (introFired) typewriter($('#hero-type')); });
  // safety: if the gate never dispatches (e.g. JS error), still reveal the hero
  setTimeout(intro, 9000);

  /* ---------- CURSOR ---------- */
  // The premium spring cursor lives in js/cursor.js now.

  /* ---------- HERO CARD: looping typed command + parallax tilt ---------- */
  (function heroCard() {
    const cmdEl = $('#hc-cmd');
    const card = $('#hero-card');
    const wrap = $('#hero-card-wrap');
    const CMDS = ['whoami', 'cat focus.txt', 'ls ~/skills', 'status --now', './ship.sh'];
    if (cmdEl && !reduce) {
      let ci = 0;
      function typeCmd() {
        const word = CMDS[ci % CMDS.length]; ci++;
        let i = 0;
        (function type() {
          if (i <= word.length) { cmdEl.textContent = word.slice(0, i); i++; setTimeout(type, 70 + Math.random() * 60); }
          else setTimeout(erase, 1700);
        })();
        function erase() {
          let j = word.length;
          (function del() {
            if (j >= 0) { cmdEl.textContent = word.slice(0, j); j--; setTimeout(del, 38); }
            else setTimeout(typeCmd, 420);
          })();
        }
      }
      setTimeout(typeCmd, 1400);
    } else if (cmdEl) { cmdEl.textContent = 'whoami'; }

    // pointer-parallax tilt on the floating card (desktop, motion ok)
    if (card && wrap && !reduce && matchMedia('(hover:hover) and (pointer:fine)').matches) {
      let raf = null;
      wrap.addEventListener('pointermove', (e) => {
        const r = wrap.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        if (raf) return;
        raf = requestAnimationFrame(() => {
          card.style.transform = `rotateY(${px * 7}deg) rotateX(${-py * 7}deg) translateZ(0)`;
          raf = null;
        });
      });
      wrap.addEventListener('pointerleave', () => { card.style.transform = ''; });
    }

    // subtle scroll parallax — the card floats slightly slower than the page
    if (wrap && !reduce) {
      let praf = null;
      window.addEventListener('scroll', () => {
        if (praf) return;
        praf = requestAnimationFrame(() => {
          const y = window.scrollY;
          if (y < window.innerHeight) wrap.style.translate = '0 ' + (y * -0.06).toFixed(1) + 'px';
          praf = null;
        });
      }, { passive: true });
    }
  })();

  /* ---------- MAGNETIC interactive elements (desktop, motion ok) ---------- */
  if (!reduce && matchMedia('(hover:hover) and (pointer:fine)').matches) {
    const mags = $$('.btn-ghost, .contact-cta, .hud-ic, .sb-term, .sb-sfx');
    mags.forEach(el => {
      let raf = null;
      el.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect();
        const mx = e.clientX - (r.left + r.width / 2);
        const my = e.clientY - (r.top + r.height / 2);
        if (raf) return;
        raf = requestAnimationFrame(() => {
          el.style.transform = `translate(${(mx * 0.18).toFixed(1)}px, ${(my * 0.22).toFixed(1)}px)`;
          raf = null;
        });
      });
      el.addEventListener('pointerleave', () => { el.style.transform = ''; });
    });
  }

  /* ---------- TELEMETRY ---------- */
  const teleTime = $('#tele-time'), teleSince = $('#tele-since'),
        telePing = $('#tele-ping'), teleSpark = $('#tele-spark');
  const SINCE = new Date('2021-09-01T00:00:00');   // one honest start: when coding began
  if (teleSpark) for (let i = 0; i < 14; i++) {
    const b = document.createElement('i'); b.style.height = (4 + Math.random() * 10) + 'px';
    teleSpark.appendChild(b);
  }
  function fmt(n) { return String(n).padStart(2, '0'); }
  const hcTime = $('#hc-time');
  function amsTime() {
    try {
      return new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Europe/Amsterdam', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
      }).format(new Date());
    } catch (e) { return new Date().toLocaleTimeString(); }
  }
  function tele() {
    if (teleTime) teleTime.textContent = amsTime();
    if (hcTime) hcTime.textContent = amsTime();
    if (teleSince) {
      const ms = Date.now() - SINCE.getTime();
      const days = ms / 86400000;
      const years = Math.floor(days / 365.25);
      const remDays = Math.floor(days - years * 365.25);
      teleSince.textContent = `2021 · ${years}y ${remDays}d`;
    }
  }
  setInterval(tele, 1000); tele();
  if (!reduce) setInterval(() => {
    const ping = (8 + Math.random() * 22).toFixed(0);
    if (telePing) telePing.textContent = ping + ' ms';
    if (teleSpark && teleSpark.children.length) {
      const b = teleSpark.children[(Math.random() * teleSpark.children.length) | 0];
      b.style.height = (4 + Math.random() * 10) + 'px';
    }
  }, 1400);

  /* ---------- IN-VIEW: rise, word-reveal, underline, scramble, wipes ---------- */
  // staggered reveals: delay each .rise by its order within its section
  if (!reduce) {
    $$('section').forEach(sec => {
      if (sec.id === 'hero') return; // hero runs its own stagger
      const items = $$('.rise', sec);
      items.forEach((el, i) => { el.style.transitionDelay = Math.min(i * 70, 420) + 'ms'; });
    });
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      const el = en.target;
      el.classList.add('in');
      if (el.classList.contains('reveal-words')) el.classList.add('in');
      io.unobserve(el);
    });
  }, { threshold: 0.18 });
  $$('.rise, .reveal-words, .underline-draw').forEach(el => io.observe(el));

  // section number scramble/count-in
  const scrambleIO = new IntersectionObserver((entries) => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      const el = en.target; const final = el.textContent;
      if (reduce) { scrambleIO.unobserve(el); return; }
      let f = 0;
      const id = setInterval(() => {
        f++;
        el.textContent = (f < 8)
          ? (Math.floor(Math.random() * 90) + 10) + '.'
          : final;
        if (f >= 8) clearInterval(id);
      }, 55);
      scrambleIO.unobserve(el);
    });
  }, { threshold: 0.6 });
  $$('[data-scramble]').forEach(el => scrambleIO.observe(el));

  // diagonal wipes
  const wipeIO = new IntersectionObserver((entries) => {
    entries.forEach(en => {
      if (en.isIntersecting) { en.target.classList.add('played'); wipeIO.unobserve(en.target); }
    });
  }, { threshold: 0.12 });
  if (!reduce) $$('.wipe').forEach(el => wipeIO.observe(el));

  /* ---------- HUD hide on scroll down ---------- */
  let lastY = 0;
  const hud = $('#hud');
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (y > 120 && y > lastY) hud.style.transform = 'translateY(-130%)';
    else hud.style.transform = 'translateY(0)';
    lastY = y;
  }, { passive: true });

  /* ---------- AUDIO HOOK (muted by default, never autoplay) ---------- */
  const audioBtn = $('#audio-btn');
  let audioCtx, analyser, srcNode, audioEl, audioData, audioOn = false, rafA;
  // drop your loop here when ready:
  const TRACK_URL = ''; // e.g. 'assets/loop.mp3'
  function startAudio() {
    if (!TRACK_URL) {
      // graceful: no track wired yet — simulate a gentle pulse so the toggle reads as live
      audioOn = true; audioBtn.classList.add('live'); audioBtn.title = 'Ambient audio (demo pulse; drop a track in app.js)';
      let t = 0;
      (function sim() {
        if (!audioOn) return;
        t += 0.05;
        const lvl = (Math.sin(t) * 0.5 + 0.5) * 0.4 + Math.random() * 0.05;
        if (window.RIPPLE) window.RIPPLE.setAudioLevel(lvl);
        rafA = requestAnimationFrame(sim);
      })();
      return;
    }
    audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    if (!audioEl) {
      audioEl = new Audio(TRACK_URL); audioEl.loop = true; audioEl.crossOrigin = 'anonymous';
      srcNode = audioCtx.createMediaElementSource(audioEl);
      analyser = audioCtx.createAnalyser(); analyser.fftSize = 256;
      audioData = new Uint8Array(analyser.frequencyBinCount);
      srcNode.connect(analyser); analyser.connect(audioCtx.destination);
    }
    audioCtx.resume(); audioEl.play(); audioOn = true; audioBtn.classList.add('live');
    (function loop() {
      if (!audioOn) return;
      analyser.getByteFrequencyData(audioData);
      let sum = 0; for (let i = 0; i < 24; i++) sum += audioData[i];
      if (window.RIPPLE) window.RIPPLE.setAudioLevel((sum / 24) / 255);
      rafA = requestAnimationFrame(loop);
    })();
  }
  function stopAudio() {
    audioOn = false; audioBtn.classList.remove('live');
    cancelAnimationFrame(rafA);
    if (audioEl) audioEl.pause();
    if (window.RIPPLE) window.RIPPLE.setAudioLevel(0);
  }
  audioBtn.addEventListener('click', () => audioOn ? stopAudio() : startAudio());

  /* ---------- CASE FILES ---------- */
  const CASES = [
    {
      feature: true, id: 'CF-00 // PRIORITY', cls: 'CLASSIFIED',
      title: 'Flurter',
      tech: ['Flutter', 'Dart', 'Riverpod', 'go_router', 'ML Kit OCR'],
      desc: 'AIxWings team graduation project: an AI-powered study app for students, shipped as an installable PWA. I owned the app architecture, theming and design system, and shipped 5 screens.',
      detail: 'A team graduation project under the AIxWings org, commissioned by a teacher (the client) who is now pitching it for funding. An AI-powered study app: focus sessions, task planning with AI quiz generation, camera text scanning (ML Kit OCR) and a leaderboard. I owned the app architecture and MVC structure, routing and navigation, the theming and design system, and shipped 5 screens. Built in Flutter with Riverpod, go_router and Dio against our own backend.',
      meta: { role: 'Architecture · theming · 5 screens', year: '2025–2026', stack: 'Flutter · Dart · Riverpod', status: 'Live · installable PWA' },
      links: { live: 'https://app.aixwings.nl/' },
      media: 'FLUTTER · PWA',
      mediaUrl: 'app.aixwings.nl · graduation project',
      shots: [
        { src: 'assets/flutter-focus.jpg', alt: 'Focus timer screen with pomodoro sessions' },
        { src: 'assets/flutter-home.jpg', alt: 'Home screen with week planner and study plan' },
        { src: 'assets/flutter-taken.jpg', alt: 'Tasks screen with AI quiz generation' }
      ]
    },
    {
      id: 'CF-01', cls: 'CLASSIFIED', title: 'Property Pulse',
      tech: ['Next.js 16', 'MongoDB', 'Mapbox', 'Cloudinary', 'OAuth'],
      desc: 'A property rental listing platform: image uploads, interactive maps and Google sign-in.',
      detail: 'A full-stack property rental platform built with Next.js 16 and MongoDB. Listings with Cloudinary image uploads, interactive Mapbox maps, a PhotoSwipe gallery, bookmarking and messaging, with Google OAuth via NextAuth. A real end-to-end product: data model, API routes and a polished front end.',
      meta: { role: 'Full-stack developer', year: '2025', stack: 'Next.js · MongoDB · Mapbox', status: 'Live on Vercel' },
      links: { github: 'https://github.com/Awes2000/property-pulse-nextjs', live: 'https://property-pulse-nextjs-phi.vercel.app/' }
    },
    {
      id: 'CF-02', cls: 'CLASSIFIED', title: 'ProStore',
      tech: ['Next.js 16', 'TypeScript', 'Prisma', 'PostgreSQL', 'NextAuth'],
      desc: 'A full-stack e-commerce store with a typed data layer, auth and an admin dashboard.',
      detail: 'A full-stack e-commerce store built with Next.js 16, TypeScript and Prisma against a Neon PostgreSQL database, with NextAuth v5 for auth. Product catalogue, cart and checkout flow, order history and a Recharts admin dashboard, with Radix UI and Tailwind on the front. The project where the back end and the front end finally met for me.',
      meta: { role: 'Full-stack developer', year: '2025', stack: 'Next.js · TypeScript · Prisma', status: 'Live on Vercel' },
      links: { github: 'https://github.com/Awes2000/prostore', live: 'https://prostore-tau-eight.vercel.app/' }
    },
    {
      id: 'CF-03', cls: 'CLASSIFIED', title: 'Colorpicker',
      tech: ['JavaScript', 'OOP', 'SCSS'],
      desc: 'A browser-based HSL palette generator: 99 random swatches, click any one to copy its value.',
      detail: 'Generates 99 random HSL swatches on load; click any one to copy its value to the clipboard and the page title updates to match. Built with three ES6 classes (HSLGenerator, ColorList, ColorCard) and styled in SCSS. This is where object-oriented JavaScript clicked for me: structure, encapsulation and code that scales past one file.',
      meta: { role: 'Front-end developer', year: '2023', stack: 'JS (ES6 classes) · SCSS', status: 'Live demo' },
      links: { github: 'https://github.com/Awes2000/colorpicker', live: 'https://28003.hosts2.ma-cloud.nl/colorpicker/index.html' }
    }
  ];

  const folderSVG = '<svg viewBox="0 0 24 24"><path d="M10 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-8l-2-2Z"/></svg>';
  const ghSVG = '<svg viewBox="0 0 24 24"><path d="M12 .5C5.7.5.5 5.7.5 12c0 5.1 3.3 9.4 7.9 10.9.6.1.8-.2.8-.5v-1.8c-3.2.7-3.9-1.5-3.9-1.5-.5-1.3-1.3-1.7-1.3-1.7-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.7-1.6-2.6-.3-5.3-1.3-5.3-5.7 0-1.3.5-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0C17 4.7 18 5 18 5c.6 1.6.2 2.8.1 3.1.8.8 1.2 1.8 1.2 3.1 0 4.4-2.7 5.4-5.3 5.7.4.4.8 1.1.8 2.2v3.3c0 .3.2.6.8.5 4.6-1.5 7.9-5.8 7.9-10.9C23.5 5.7 18.3.5 12 .5Z"/></svg>';
  const linkSVG = '<svg viewBox="0 0 24 24"><path d="M10.6 13.4a1 1 0 0 0 1.4 0l5-5a3 3 0 0 0-4.2-4.2l-1.3 1.3a1 1 0 1 0 1.4 1.4l1.3-1.3a1 1 0 0 1 1.4 1.4l-5 5a1 1 0 0 0 0 1.4Zm2.8-2.8a1 1 0 0 0-1.4 0l-5 5a3 3 0 0 0 4.2 4.2l1.3-1.3a1 1 0 1 0-1.4-1.4l-1.3 1.3a1 1 0 0 1-1.4-1.4l5-5a1 1 0 0 0 0-1.4Z"/></svg>';
  const playSVG = '<svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>';

  function linksHTML(c) {
    let h = '';
    if (c.links.github) h += `<a href="${c.links.github}" target="_blank" rel="noopener" aria-label="GitHub repo" data-stop>${ghSVG}</a>`;
    if (c.links.live) h += `<a href="${c.links.live}" target="_blank" rel="noopener" aria-label="Live demo" data-stop>${linkSVG}</a>`;
    if (c.links.gallery) h += `<a href="${c.links.gallery}" target="_blank" rel="noopener" aria-label="Gallery" data-stop>${playSVG}</a>`;
    return h;
  }

  const grid = $('#case-grid');
  CASES.forEach((c, idx) => {
    const el = document.createElement('article');
    el.className = 'case rise' + (c.feature ? ' feature' : '');
    el.tabIndex = 0;
    el.dataset.idx = idx;
    const inner = `
      <div class="scan-sweep"></div>
      <span class="case-stamp">${c.cls}</span>
      <div>
        <div class="case-head">
          <span class="case-folder">${folderSVG}</span>
          <div class="case-links">${linksHTML(c)}</div>
        </div>
        <div class="case-body">
          <span class="case-id">${c.id}</span>
          <h3 class="case-title">${c.title}</h3>
          <p class="case-desc">${c.desc}</p>
          <ul class="case-tech">${c.tech.map(t => `<li>${t}</li>`).join('')}</ul>
          <span class="case-cta">▸ open case file</span>
        </div>
      </div>`;
    const media = c.feature ? `<div class="case-media"><div class="ph">
        <div class="cm-bar"><span class="dots"><i></i><i></i><i></i></span><span class="url">${c.mediaUrl || c.media || 'preview'}</span></div>
        <div class="cm-stage${c.shots ? ' has-shots' : ''}">${c.shots ? `
          <div class="cm-shots">${c.shots.map((s, si) => `<img src="${s.src}" alt="${s.alt}" class="cm-shot cm-shot-${si}" />`).join('')}</div>
          <span class="cm-scan"></span>
          <span class="cm-cap">FIELD MEDIA <b>· live capture</b></span>` : `
          <span class="cm-scan"></span>
          <span class="cm-cap">PREVIEW <b>decrypting…</b></span>`}
        </div>
      </div></div>` : '';
    el.innerHTML = inner + media;
    grid.appendChild(el);
    io.observe(el);

    let unlocked = false;
    function unlock() {
      if (unlocked) return; unlocked = true;
      el.classList.add('unlocked', 'unlocking');
      setTimeout(() => el.classList.remove('unlocking'), 650);
    }
    el.addEventListener('pointerenter', unlock);
    el.addEventListener('focus', unlock);
    el.addEventListener('click', (e) => {
      if (e.target.closest('[data-stop]')) return; // let real links work
      unlock(); openDetail(c, el);
    });
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') { unlock(); openDetail(c, el); }
    });
  });

  /* ---------- DETAIL OVERLAY (View Transitions when available) ---------- */
  const detail = $('#detail'), detailBody = $('#detail-body'), detailClose = $('#detail-close');
  function detailHTML(c) {
    const L = [];
    if (c.links.live) L.push(`<a class="btn-ghost" href="${c.links.live}" target="_blank" rel="noopener">Open live ↗</a>`);
    if (c.links.github) L.push(`<a class="link-mono" href="${c.links.github}" target="_blank" rel="noopener">${'</'}> source on GitHub</a>`);
    if (c.links.gallery) L.push(`<a class="link-mono" href="${c.links.gallery}" target="_blank" rel="noopener">▶ View gallery</a>`);
    return `
      <span class="d-id">${c.id}</span>
      <h3>${c.title}</h3>
      <p>${c.detail}</p>
      ${c.shots ? `<div class="detail-shots">${c.shots.map(s => `<img src="${s.src}" alt="${s.alt}" loading="lazy" />`).join('')}</div>` : ''}
      <div class="detail-meta">
        <div><div class="k">Role</div><div class="v">${c.meta.role}</div></div>
        <div><div class="k">Year</div><div class="v">${c.meta.year}</div></div>
        <div><div class="k">Stack</div><div class="v">${c.meta.stack}</div></div>
        <div><div class="k">Status</div><div class="v">${c.meta.status}</div></div>
      </div>
      <div class="detail-actions">${L.join('')}</div>`;
  }
  function reallyOpen(c, el) {
    detailBody.innerHTML = detailHTML(c);
    detail.classList.add('open');
    detail.setAttribute('aria-hidden', 'false');
    detailClose.focus();
  }
  function openDetail(c, el) {
    if (document.startViewTransition && !reduce) {
      const card = el.querySelector('.detail-card') || el;
      el.style.viewTransitionName = 'casemorph';
      detail.querySelector('.detail-card').style.viewTransitionName = 'casemorph';
      document.startViewTransition(() => reallyOpen(c, el)).finished.finally(() => {
        el.style.viewTransitionName = '';
        detail.querySelector('.detail-card').style.viewTransitionName = '';
      });
    } else {
      reallyOpen(c, el);
    }
  }
  function closeDetail() {
    const run = () => { detail.classList.remove('open'); detail.setAttribute('aria-hidden', 'true'); };
    if (document.startViewTransition && !reduce) document.startViewTransition(run);
    else run();
  }
  detailClose.addEventListener('click', closeDetail);
  detail.addEventListener('click', e => { if (e.target === detail) closeDetail(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && detail.classList.contains('open')) closeDetail(); });

  /* ---------- FOOTER easter-egg toast ---------- */
  const egg = $('#foot-egg'), toast = $('#egg-toast');
  const TRUTHS = [
    '↳ <b>whoami</b>: a front-end dev learning to secure what he builds.',
    '↳ <b>manila</b>: a placement that reshaped how I see the work.',
    '↳ <b>music</b>: yes, I produce. Ask me for the loop.',
    '↳ <b>faith</b>: the steady anchor under the ambition.'
  ];
  let ti = 0, tt;
  egg.addEventListener('click', () => {
    toast.innerHTML = TRUTHS[ti % TRUTHS.length]; ti++;
    toast.classList.add('show');
    clearTimeout(tt); tt = setTimeout(() => toast.classList.remove('show'), 3600);
  });

  /* ---------- replay intro ---------- */
  const replay = $('#foot-replay');
  if (replay) replay.addEventListener('click', (e) => {
    e.preventDefault();
    try { sessionStorage.removeItem('aws_unlocked'); } catch (err) {}
    window.__gateUnlocked = false;
    // no hash anchor (it scrolls the page); clearing the flag is enough to replay
    try { history.replaceState(null, '', location.pathname + location.search); } catch (err) {}
    window.scrollTo(0, 0);
    location.reload();
  });

  /* ---------- mobile menu ---------- */
  const hudToggle = $('#hud-toggle');
  const mMenu = $('#m-menu');
  let menuOpen = false, menuLastFocus = null;
  function openMenu() {
    if (!mMenu || menuOpen) return; menuOpen = true;
    menuLastFocus = document.activeElement;
    mMenu.classList.add('open'); mMenu.setAttribute('aria-hidden', 'false');
    hudToggle.setAttribute('aria-expanded', 'true');
    hudToggle.setAttribute('aria-label', 'Close menu');
    document.body.style.overflow = 'hidden';
    window.SFX && window.SFX.click && window.SFX.click();
    const first = mMenu.querySelector('.m-link');
    if (first) setTimeout(() => first.focus(), 60);
  }
  function closeMenu() {
    if (!mMenu || !menuOpen) return; menuOpen = false;
    mMenu.classList.remove('open'); mMenu.setAttribute('aria-hidden', 'true');
    hudToggle.setAttribute('aria-expanded', 'false');
    hudToggle.setAttribute('aria-label', 'Open menu');
    document.body.style.overflow = '';
    if (menuLastFocus && menuLastFocus.focus) menuLastFocus.focus();
  }
  if (hudToggle) hudToggle.addEventListener('click', () => menuOpen ? closeMenu() : openMenu());
  if (mMenu) {
    mMenu.addEventListener('click', (e) => { if (e.target === mMenu) closeMenu(); }); // backdrop
    $$('.m-link', mMenu).forEach(a => a.addEventListener('click', closeMenu));        // link tap
  }
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && menuOpen) closeMenu(); });
  // (the #m-snd sound toggle is wired by js/sound.js to the master SFX engine)
})();
