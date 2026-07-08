/* ============================================================
   SYSTEM SHELL — persistent status bar, filesystem-style section
   nav, docked command terminal (⌘K), idle screensaver, konami
   CRT mode, logo glitch. Carries the gate's immersion through
   the whole site. All effects are progressive enhancement.
   ============================================================ */
(function () {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const html = document.documentElement;
  const reduce = (() => { try { return matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) { return false; } })();
  const coarse = (() => { try { return matchMedia('(hover:none),(pointer:coarse)').matches; } catch (e) { return false; } })();
  const sfx = () => window.SFX;

  /* ---------- live clock ---------- */
  const clock = $('#sb-clock');
  function tick() {
    if (!clock) return;
    try {
      clock.textContent = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Europe/Amsterdam', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
      }).format(new Date());
    } catch (e) { clock.textContent = new Date().toLocaleTimeString(); }
  }
  setInterval(tick, 1000); tick();

  /* ---------- filesystem-style section path + breadcrumb history + sweep ---------- */
  const pathEl = $('#sb-path');
  const trailEl = $('#sb-trail');
  const sweep = $('#sweep');
  const PATHS = { hero: '~', about: '~/about', projects: '~/projects', contact: '~/contact' };
  let activeSection = 'hero';
  const history = ['~'];

  function renderTrail() {
    if (!trailEl) return;
    // show up to the last 2 visited (excluding current), as a dim breadcrumb
    const prev = history.slice(0, -1).slice(-2);
    trailEl.innerHTML = prev.length
      ? prev.map(p => p).join('<span class="sep">&rsaquo;</span>') + '<span class="sep">&rsaquo;</span>'
      : '';
  }

  function setSection(id) {
    if (id === activeSection || !PATHS[id]) return;
    activeSection = id;
    const path = PATHS[id];
    if (history[history.length - 1] !== path) history.push(path);
    if (history.length > 4) history.shift();
    if (pathEl) pathEl.textContent = path;
    renderTrail();
    if (!reduce && sweep) { sweep.classList.remove('run'); void sweep.offsetWidth; sweep.classList.add('run'); }
    if (window.RIPPLE) { window.RIPPLE.setAudioLevel(0.5); setTimeout(() => window.RIPPLE.setAudioLevel(0), 130); }
    sfx() && sfx().zap(false);
  }
  const secObserver = new IntersectionObserver((entries) => {
    // pick the most-visible section
    let best = null, ratio = 0;
    entries.forEach(e => { if (e.intersectionRatio > ratio) { ratio = e.intersectionRatio; best = e.target; } });
    if (best && ratio > 0.25) setSection(best.id);
  }, { threshold: [0.25, 0.5, 0.75] });
  ['hero', 'about', 'projects', 'contact'].forEach(id => { const el = document.getElementById(id); if (el) secObserver.observe(el); });

  /* ---------- heading scramble on enter (scroll = signal) ---------- */
  const GLYPH = '#$%&/<>[]{}=+*01';
  function scramble(el) {
    if (reduce) return;
    const final = el.dataset.finalText || el.textContent;
    el.dataset.finalText = final;
    let f = 0; const steps = 11;
    const id = setInterval(() => {
      f++;
      let out = '';
      for (let i = 0; i < final.length; i++) {
        if (final[i] === ' ') { out += ' '; continue; }
        out += (i < (f / steps) * final.length) ? final[i] : GLYPH[(Math.random() * GLYPH.length) | 0];
      }
      el.textContent = out;
      if (f >= steps) { clearInterval(id); el.textContent = final; }
    }, 32);
  }
  const headObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      if (!el.dataset.scrambled) { el.dataset.scrambled = '1'; scramble(el); }
      headObserver.unobserve(el);
    });
  }, { threshold: 0.6 });
  // section titles (not the hero name — that has its own reveal)
  $$('.sec-title').forEach(el => headObserver.observe(el));

  /* ---------- parallax (very subtle) ---------- */
  if (!reduce) {
    const grain = $('#grain');
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (ticking) return; ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        if (grain) grain.style.transform = `translateY(${(y * 0.04).toFixed(1)}px)`;
        ticking = false;
      });
    }, { passive: true });
  }

  /* ============================================================
     DOCKED COMMAND TERMINAL  (⌘K / Ctrl-K / >_ button)
     ============================================================ */
  const palette = $('#palette'), palLog = $('#pal-log'), palInput = $('#pal-cmd'),
        palClose = $('#pal-close'), termBtn = $('#sb-term');
  let palOpen = false, lastFocus = null;

  function pline(content, cls) {
    const el = document.createElement('div');
    el.className = 'ln' + (cls ? ' ' + cls : '');
    el.innerHTML = content;
    palLog.appendChild(el); palLog.scrollTop = palLog.scrollHeight;
    return el;
  }
  function openPalette(seed) {
    if (palOpen) return; palOpen = true;
    lastFocus = document.activeElement;
    palette.classList.add('open'); palette.setAttribute('aria-hidden', 'false');
    if (!palLog.dataset.greeted) {
      palLog.dataset.greeted = '1';
      pline('<span class="dim">gabriel-os shell. type</span> <span class="ok">help</span> <span class="dim">for commands. esc to close.</span>');
    }
    sfx() && sfx().click();
    if (!coarse) setTimeout(() => palInput.focus(), 30); // no forced keyboard on touch
    if (seed) { palInput.value = seed; }
  }
  function closePalette() {
    if (!palOpen) return; palOpen = false;
    palette.classList.remove('open'); palette.setAttribute('aria-hidden', 'true');
    sfx() && sfx().click();
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  termBtn && termBtn.addEventListener('click', () => palOpen ? closePalette() : openPalette());
  palClose && palClose.addEventListener('click', closePalette);
  palette && palette.addEventListener('click', e => { if (e.target === palette) closePalette(); });

  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); palOpen ? closePalette() : openPalette(); }
    else if (e.key === 'Escape' && palOpen) { closePalette(); }
  });

  /* ---------- command registry ---------- */
  const OUT = {
    help: () => [
      'COMMANDS',
      '  <span class="ok">whoami</span>          about me',
      '  <span class="ok">ls</span>              list sections',
      '  <span class="ok">top</span>             what i\'m focused on',
      '  <span class="ok">cv</span>              download my resume',
      '  <span class="ok">contact</span>         reach me',
      '  <span class="ok">now</span>             what i\'m on right now',
      '  <span class="ok">neofetch</span>        system summary',
      '  <span class="ok">sfx</span>             toggle UI sound',
      '  <span class="ok">logout</span>          end the session',
      '  <span class="ok">clear</span>           clear the screen',
      '  <span class="dim">some commands are hidden. go look.</span>'
    ],
    whoami: () => [
      'Gabriël Awes Zoretić. full-stack developer, front-end and design leaning.',
      'building toward <span class="ok">cybersecurity and cloud</span>. based in Amsterdam.',
      '<span class="dim">Sep \'26: Cyber Security &amp; Cloud duaal at HU + H2B IT Solutions.</span>'
    ],
    stack: () => [
      'build:   <span class="ok">Next.js · React · TypeScript · Node · Tailwind</span>',
      'data:    <span class="ok">Prisma · PostgreSQL · MongoDB · REST</span>',
      'ai:      <span class="warn">Claude Code · Claude Design · context engineering</span>',
      'secure:  <span class="dim">Linux · networking · cloud infra · hardening (learning)</span>'
    ],
    now: () => [
      '<span class="ok">// now</span> (updated May 2026)',
      'Prepping for the Cyber Security &amp; Cloud duaal at HU.',
      'Building Next.js side projects and learning Linux daily.',
      'Open to freelance front-end and good conversations.'
    ],
    contact: () => [
      'email     <span class="ok">aweszoretic@hotmail.nl</span>',
      'github    <span class="ok">github.com/Awes2000</span>',
      'linkedin  <span class="ok">/in/gabriël-awes-z</span>',
      '<span class="dim">&gt; say hello any time.</span>'
    ],
    neofetch: () => [
      '<span class="ok">guest</span>@<span class="ok">gabriel-os</span>',
      '-----------------',
      'OS        gabriel-os v4.0 (navy/steel)',
      'Host      Amsterdam, NL',
      'Shell     /bin/sh · ⌘K',
      'Uptime    coding since 2021',
      'Stack     Next.js · TypeScript · Node',
      'Focus     cybersecurity · cloud · Linux'
    ]
  };
  function lsProjects() {
    return [
      'total 4',
      'drwx <span class="dim">CF-00</span>  flurter            <span class="ok">★ featured</span>',
      'drwx <span class="dim">CF-01</span>  property-pulse',
      'drwx <span class="dim">CF-02</span>  prostore',
      'drwx <span class="dim">CF-03</span>  colorpicker',
      '<span class="dim">tip: scroll to ~/projects or run</span> <span class="ok">cd projects</span>'
    ];
  }
  function topProcesses() {
    const procs = [
      ['cybersecurity_cloud', 38], ['linux_engineering', 22], ['nextjs_builds', 16],
      ['devsecops_grc', 9], ['ai_orchestration', 8], ['music_production', 4], ['kernel_sleep', 3]
    ];
    const out = ['  PID  PROCESS                CPU%  STATE',
      '<span class="dim">  ───────────────────────────────────────</span>'];
    procs.forEach((p, i) => {
      const cpu = Math.max(1, p[1] + (Math.random() * 6 - 3)).toFixed(1);
      const state = i < 3 ? '<span class="ok">RUN</span>' : '<span class="dim">idle</span>';
      out.push('  ' + String(1000 + i * 7).padStart(4) + '  ' + p[0].padEnd(22) + String(cpu).padStart(5) + '  ' + state);
    });
    return out;
  }

  function cd(arg) {
    const map = { about: 'about', projects: 'projects', contact: 'contact', '~': 'hero', '': 'hero', home: 'hero' };
    const target = map[(arg || '').replace(/^~\/?/, '') || arg];
    const id = map[arg] || target;
    if (id && document.getElementById(id)) {
      closePalette();
      document.getElementById(id).scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
      return null;
    }
    return ['cd: no such section: <span class="crit">' + (arg || '') + '</span>'];
  }

  let rootUnlocked = false;
  function runCmd(raw) {
    const cmd = raw.trim().replace(/\s+/g, ' ');
    const low = cmd.toLowerCase();
    pline('<span class="ps1">guest@gabriel-os:~$</span> ' + raw.replace(/[<>]/g, ''));
    palInput.value = '';
    if (low === '') return;
    sfx() && sfx().click();

    if (low === 'cv' || low === 'resume') {
      pline('<span class="dim">&gt; fetching resume... opening awes_resume.pdf</span>');
      try { window.open('files/awes_resume_updated.pdf', '_blank', 'noopener'); } catch (e) {}
      return;
    }
    if (low === 'clear') { palLog.innerHTML = ''; return; }
    if (low === 'sfx' || low === 'sound') { const on = window.SFX && window.SFX.toggle(); pline('ui sound: ' + (on ? '<span class="ok">on</span>' : '<span class="dim">off</span>')); return; }
    if (low.startsWith('cd')) { const r = cd(low.slice(2).trim()); if (r) r.forEach(l => pline(l)); return; }
    if (low === 'ls' || low === 'ls projects' || low === 'ls -la' || low === 'll') { lsProjects().forEach((l, i) => setTimeout(() => pline(l), i * 55)); return; }
    if (low === 'top' || low === 'htop' || low === 'ps') { topProcesses().forEach((l, i) => setTimeout(() => pline(l), i * 60)); return; }
    if (low === 'sudo rm -rf /' || low === 'rm -rf /') { pline('<span class="crit">nice try.</span> this system is read-only.', ''); return; }
    if (low === 'sudo unlock --root' || low === 'sudo su' || low === 'root') {
      rootUnlocked = true;
      sfx() && sfx().root();
      [ '<span class="ok">&gt; root access granted.</span>',
        '&gt; off the clock: i make music, drum &amp; bass to hyperpop. i lift.',
        '&gt; and i lead prayer for me and mine. faith first, then everything else.',
        '<span class="dim">&gt; thanks for digging this deep.</span>'
      ].forEach((l, i) => setTimeout(() => pline(l), i * 130));
      return;
    }
    if (low === 'logout' || low === 'exit --session' || low === 'shutdown') { logout(); return; }
    if (low === 'exit' || low === 'q') { closePalette(); return; }
    if (low === 'help' || low === 'man' || low === '?') { OUT.help().forEach(l => pline(l)); return; }
    const fn = OUT[low];
    if (fn) { fn().forEach((l, i) => setTimeout(() => pline(l), i * 70)); return; }
    pline('command not found: <span class="crit">' + low.replace(/[<>]/g, '') + '</span>. try <span class="ok">help</span>');
  }
  // expose a way for other UI (copy buttons) to print into the shell
  window.SHELL = {
    print(line, cls) { pline(line, cls); },
    open: openPalette, close: closePalette
  };
  palInput && palInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') { e.preventDefault(); runCmd(palInput.value); }
    else if (e.key.length === 1) { sfx() && sfx().type(); }
  });

  /* ============================================================
     IDLE TERMINAL SCREENSAVER  (starfield drift)
     ============================================================ */
  const saver = $('#screensaver');
  let idleTimer = null, saverOn = false, saverRAF = null, stars = [];
  const IDLE_MS = 20000;
  function startSaver() {
    if (saverOn || reduce || palOpen || html.classList.contains('locked')) return;
    saverOn = true; saver.classList.add('on');
    const ctx = saver.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    function size() { saver.width = innerWidth * dpr; saver.height = innerHeight * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); }
    size();
    stars = Array.from({ length: 120 }, () => ({ x: Math.random() * innerWidth, y: Math.random() * innerHeight, z: Math.random() * 1 + .2, s: Math.random() * 1.4 + .3 }));
    const cx = innerWidth / 2, cy = innerHeight / 2;
    (function loop() {
      if (!saverOn) return;
      ctx.fillStyle = 'rgba(4,8,16,0.35)'; ctx.fillRect(0, 0, innerWidth, innerHeight);
      stars.forEach(st => {
        st.x += (st.x - cx) * 0.004 * st.z; st.y += (st.y - cy) * 0.004 * st.z;
        st.z += 0.003;
        if (st.x < -20 || st.x > innerWidth + 20 || st.y < -20 || st.y > innerHeight + 20) {
          st.x = Math.random() * innerWidth; st.y = Math.random() * innerHeight; st.z = Math.random() * .4 + .2;
        }
        ctx.beginPath(); ctx.arc(st.x, st.y, st.s * st.z, 0, 6.28);
        ctx.fillStyle = 'rgba(100,255,218,' + Math.min(.8, st.z * .6) + ')'; ctx.fill();
      });
      ctx.font = '12px "Roboto Mono",monospace'; ctx.fillStyle = 'rgba(143,166,200,.5)';
      ctx.fillText('// signal idle. move to resume', 24, innerHeight - 28);
      saverRAF = requestAnimationFrame(loop);
    })();
  }
  function stopSaver() {
    if (!saverOn) return; saverOn = false; saver.classList.remove('on');
    cancelAnimationFrame(saverRAF);
  }
  function resetIdle() { stopSaver(); clearTimeout(idleTimer); if (!reduce) idleTimer = setTimeout(startSaver, IDLE_MS); }
  ['pointermove', 'pointerdown', 'keydown', 'scroll', 'wheel', 'touchstart'].forEach(ev =>
    window.addEventListener(ev, resetIdle, { passive: true }));
  // only start arming once unlocked
  window.addEventListener('aws:access', resetIdle);
  resetIdle();

  /* ============================================================
     KONAMI → CRT DEMO MODE
     ============================================================ */
  const KONAMI = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
  let kIdx = 0;
  document.addEventListener('keydown', (e) => {
    const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    kIdx = (k === KONAMI[kIdx]) ? kIdx + 1 : (k === KONAMI[0] ? 1 : 0);
    if (kIdx === KONAMI.length) {
      kIdx = 0;
      html.classList.toggle('demo');
      sfx() && sfx().root();
      if (palOpen) pline('<span class="ok">// CRT demo mode ' + (html.classList.contains('demo') ? 'engaged' : 'disengaged') + '</span>');
      else { const t = $('#egg-toast'); if (t) { t.innerHTML = '<b>CRT demo mode</b> ' + (html.classList.contains('demo') ? 'engaged ▦' : 'off'); t.classList.add('show'); setTimeout(() => t.classList.remove('show'), 2600); } }
    }
  });

  /* ============================================================
     LOGO GLITCH — click the monogram a few times
     ============================================================ */
  const brand = $('.brand'); let clicks = 0, clickT = 0;
  brand && brand.addEventListener('click', (e) => {
    const now = Date.now();
    clicks = (now - clickT < 600) ? clicks + 1 : 1; clickT = now;
    if (clicks >= 3) {
      clicks = 0;
      if (!reduce) {
        const app = $('#app');
        app.style.transition = 'filter .08s steps(2)';
        app.style.filter = 'hue-rotate(40deg) drop-shadow(2px 0 0 rgba(255,40,80,.5)) drop-shadow(-2px 0 0 rgba(40,200,255,.5))';
        setTimeout(() => { app.style.filter = ''; }, 160);
      }
      sfx() && sfx().zap(true);
      const t = $('#egg-toast'); if (t) { t.innerHTML = '<b>signal glitch</b>. you found the seam.'; t.classList.add('show'); setTimeout(() => t.classList.remove('show'), 2400); }
    }
  });

  /* ============================================================
     REACTIVE SIGNAL METER  (full on activity, idle after ~15s)
     ============================================================ */
  const bar = $('#shell-bar');
  let sigTimer = null;
  function activity() {
    if (!bar) return;
    bar.classList.remove('idle');
    clearTimeout(sigTimer);
    sigTimer = setTimeout(() => bar.classList.add('idle'), 15000);
  }
  ['pointermove', 'pointerdown', 'keydown', 'scroll', 'wheel', 'touchstart'].forEach(ev =>
    window.addEventListener(ev, activity, { passive: true }));
  activity();

  /* ============================================================
     LIVING TAB TITLE  (afk when the tab loses focus)
     ============================================================ */
  const REAL_TITLE = document.title;
  const AFK = ['[afk] gabriel-os', 'connection idle...', '> session backgrounded'];
  let titleTick = null;
  window.addEventListener('blur', () => {
    let i = 0;
    document.title = AFK[0];
    clearInterval(titleTick);
    titleTick = setInterval(() => { i = (i + 1) % AFK.length; document.title = AFK[i]; }, 2600);
  });
  window.addEventListener('focus', () => { clearInterval(titleTick); document.title = REAL_TITLE; });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { document.title = AFK[0]; }
    else { clearInterval(titleTick); document.title = REAL_TITLE; }
  });

  /* ============================================================
     KEYBOARD SHORTCUTS PANEL  ([?] button or '?')
     ============================================================ */
  const shortcuts = $('#shortcuts'), scClose = $('#sc-close'), helpBtn = $('#sb-help');
  function openShortcuts() { if (!shortcuts) return; shortcuts.classList.add('open'); shortcuts.setAttribute('aria-hidden', 'false'); sfx() && sfx().click(); }
  function closeShortcuts() { if (!shortcuts) return; shortcuts.classList.remove('open'); shortcuts.setAttribute('aria-hidden', 'true'); }
  helpBtn && helpBtn.addEventListener('click', openShortcuts);
  scClose && scClose.addEventListener('click', closeShortcuts);
  shortcuts && shortcuts.addEventListener('click', (e) => { if (e.target === shortcuts) closeShortcuts(); });
  document.addEventListener('keydown', (e) => {
    const typing = /^(INPUT|TEXTAREA)$/.test((e.target.tagName || ''));
    if (e.key === '?' && !typing && !palOpen) { e.preventDefault(); shortcuts.classList.contains('open') ? closeShortcuts() : openShortcuts(); }
    else if (e.key === 'Escape' && shortcuts.classList.contains('open')) { closeShortcuts(); }
  });

  /* ============================================================
     COPY-TO-CLIPBOARD  -> terminal feedback
     ============================================================ */
  function copyText(text, label) {
    const done = () => {
      window.SHELL && window.SHELL.print('<span class="ok">&gt; copied to clipboard:</span> ' + text);
      sfx() && sfx().click();
    };
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, done);
      } else {
        const ta = document.createElement('textarea'); ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
        document.body.appendChild(ta); ta.select(); try { document.execCommand('copy'); } catch (e) {} document.body.removeChild(ta); done();
      }
    } catch (e) { done(); }
    return label;
  }
  const copyEmail = $('#copy-email');
  if (copyEmail) copyEmail.addEventListener('click', () => {
    copyText('aweszoretic@hotmail.nl');
    const old = copyEmail.textContent;
    copyEmail.classList.add('copied'); copyEmail.textContent = '> copied to clipboard';
    setTimeout(() => { copyEmail.classList.remove('copied'); copyEmail.textContent = old; }, 1800);
  });

  /* ============================================================
     LOGOUT  -> power-down flourish -> reset to gate
     ============================================================ */
  function logout() {
    if (window.SHELL) {
      window.SHELL.print('<span class="warn">&gt; closing secure channel...</span>');
      setTimeout(() => window.SHELL.print('<span class="dim">&gt; session ended. see you around.</span>'), 320);
    }
    sfx() && sfx().zap(true);
    const pd = $('#powerdown');
    const reset = () => {
      try { sessionStorage.removeItem('aws_unlocked'); } catch (e) {}
      window.__gateUnlocked = false;
      try { history.replaceState(null, '', location.pathname); } catch (e) {}
      window.scrollTo(0, 0);
      location.reload();
    };
    closePalette();
    if (pd && !reduce) { pd.classList.add('run'); setTimeout(reset, 900); }
    else { reset(); }
  }
})();
