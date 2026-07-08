/* ============================================================
   TERMINAL UNLOCK GATE  (CRT / detuned-TV)
   The real portfolio is in the DOM, blurred + redacted behind
   this overlay. A command (or Enter / UNLOCK) decrypts it.
   Progressive enhancement: with no JS the gate never shows.
   ============================================================ */
(function () {
  const $ = (s) => document.querySelector(s);
  const html = document.documentElement;
  const reduce = (() => { try { return matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) { return false; } })();
  const coarse = (() => { try { return matchMedia('(hover:none),(pointer:coarse)').matches; } catch (e) { return false; } })();

  // session flag — sessionStorage may be unavailable in sandboxes
  function isUnlocked() {
    if (window.__gateUnlocked) return true;
    try { return sessionStorage.getItem('aws_unlocked') === '1'; } catch (e) { return false; }
  }
  function markUnlocked() {
    window.__gateUnlocked = true;
    try { sessionStorage.setItem('aws_unlocked', '1'); } catch (e) {}
  }

  const gate = $('#gate'), crt = $('#crt-screen'), log = $('#gate-log'),
        prompt = $('#gate-prompt'), input = $('#gate-cmd'), typed = $('#gate-typed'),
        hint = $('#gate-hint'), unlockBtn = $('#gate-unlock'), skip = $('#gate-skip'),
        soundBtn = $('#gate-sound'), rbars = $('#rbars');

  let done = false;

  /* ---------- helpers ---------- */
  function line(content, cls) {
    const el = document.createElement('div');
    el.className = 'ln' + (cls ? ' ' + cls : '');
    el.innerHTML = content;
    log.appendChild(el);
    log.scrollTop = log.scrollHeight;
    return el;
  }
  function setStatic(v) { html.style.setProperty('--static-op', String(v)); }

  /* ---------- channel zap ---------- */
  function zap(big) {
    if (reduce) return;
    setStatic(big ? 0.72 : 0.45);
    crt.classList.remove('gate-zap'); void crt.offsetWidth; crt.classList.add('gate-zap');
    SFX() && SFX().zap(big);
    setTimeout(() => setStatic(0.07), big ? 240 : 170);
    setTimeout(() => crt.classList.remove('gate-zap'), 260);
  }

  /* ---------- redaction bars (staggered L→R wipe) ---------- */
  (function buildBars() {
    if (!rbars) return;
    const N = 16;
    for (let i = 0; i < N; i++) {
      const b = document.createElement('span');
      b.className = 'rbar';
      const left = Math.random() * 70 + 4;
      const top = Math.random() * 88 + 4;
      const w = Math.random() * 22 + 8;
      b.style.left = left + 'vw';
      b.style.top = top + 'vh';
      b.style.width = w + 'vw';
      b.style.height = (10 + Math.random() * 8) + 'px';
      b.style.transitionDelay = (left / 90 * 0.45).toFixed(3) + 's';
      rbars.appendChild(b);
    }
  })();

  /* ---------- audio routed through the master SFX engine (js/sound.js) ---------- */
  // The #gate-sound button is wired by sound.js to window.SFX.toggle().
  const SFX = () => window.SFX;

  /* (sound toggle handled by js/sound.js) */

  /* ============================================================
     FAST PATH — reduced motion or already unlocked this session
     (a #gate / #replay hash forces the gate to play, for review)
     ============================================================ */
  const forceReplay = /(^|#)(gate|replay|boot)$/i.test(location.hash);
  if (forceReplay) {
    try { sessionStorage.removeItem('aws_unlocked'); } catch (e) {}
    window.__gateUnlocked = false;
    html.classList.remove('unlocked');
    html.classList.add('locked');
    gate.style.display = '';
    // the #gate anchor can scroll the page; the gate is fixed so reset to top
    try { history.replaceState(null, '', location.pathname + location.search); } catch (e) {}
    window.scrollTo(0, 0);
  }
  if (!forceReplay && (reduce || isUnlocked())) {
    html.classList.remove('locked');
    html.classList.add('unlocked');
    gate.style.display = 'none';
    const redact0 = document.getElementById('redact');
    if (redact0) { redact0.style.opacity = '0'; redact0.style.display = 'none'; }
    markUnlocked();
    const fire = () => window.dispatchEvent(new CustomEvent('aws:access'));
    fire(); setTimeout(fire, 60);
    return;
  }

  /* ============================================================
     THE SEQUENCE
     ============================================================ */
  // time-aware greeting + a rotating "fortune" line, chosen per load
  function greeting() {
    const nl = window.LANG === 'nl';
    let h = new Date().getHours();
    try { h = parseInt(new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Amsterdam', hour: '2-digit', hour12: false }).format(new Date()), 10); } catch (e) {}
    if (h >= 5 && h < 12) return nl ? 'goedemorgen. koffie staat klaar.' : "good morning. coffee's on.";
    if (h >= 12 && h < 18) return nl ? 'goedemiddag.' : 'good afternoon.';
    if (h >= 18 && h < 23) return nl ? 'goedenavond.' : 'good evening.';
    return nl ? 'laat nog op? respect.' : 'late night session? respect.';
  }
  const FORTUNES_EN = [
    'ship it, then secure it.',
    'read the system before you change it.',
    'built from scratch beats bought off the shelf.',
    'production is just staging with consequences.',
    'most days i learn more than i break. most.',
    'curiosity is the whole job.',
    'soli deo gloria.',
    'coffee compiling...'
  ];
  const FORTUNES_NL = [
    'lever het op, beveilig het daarna.',
    'lees het systeem voordat je het verandert.',
    'zelf bouwen wint van kant-en-klaar.',
    'productie is gewoon staging met gevolgen.',
    'de meeste dagen leer ik meer dan ik stuk maak. meestal.',
    'nieuwsgierigheid is de hele baan.',
    'soli deo gloria.',
    'koffie aan het compilen...'
  ];
  const FORTUNES = window.LANG === 'nl' ? FORTUNES_NL : FORTUNES_EN;
  const fortune = FORTUNES[(Math.random() * FORTUNES.length) | 0];

  const NLG = window.LANG === 'nl';
  const POST = NLG ? [
    ['> gabriel-os v4.0 opstarten...', 'dim', 120],
    ['> ' + greeting(), 'dim', 280],
    ['> mounten: full-stack <span class="ok">[ok]</span>', '', 460],
    ['> mounten: front-end + design <span class="ok">[ok]</span>', '', 640],
    ['> module: cybersecurity_cloud <span class="warn">[laden...]</span>', '', 840],
    ['> <span class="warn">WAARSCHUWING:</span> portfolio is <span class="crit">GEHEIM</span>', '', 1060],
    ['> <span class="dim">// ' + fortune + '</span>', 'dim', 1240],
    ['> <span class="grant">AUTHENTICATIE VEREIST</span>', '', 1420]
  ] : [
    ['> gabriel-os v4.0 booting...', 'dim', 120],
    ['> ' + greeting(), 'dim', 280],
    ['> mounting: full-stack <span class="ok">[ok]</span>', '', 460],
    ['> mounting: front-end + design <span class="ok">[ok]</span>', '', 640],
    ['> module: cybersecurity_cloud <span class="warn">[loading...]</span>', '', 840],
    ['> <span class="warn">WARNING:</span> portfolio is <span class="crit">CLASSIFIED</span>', '', 1060],
    ['> <span class="dim">// ' + fortune + '</span>', 'dim', 1240],
    ['> <span class="grant">AUTH REQUIRED</span>', '', 1420]
  ];

  // power-on, then POST
  setTimeout(() => crt.classList.remove('powering'), 560);
  POST.forEach((p) => setTimeout(() => { line(p[0], p[1]); }, 420 + p[2]));

  // reveal prompt
  setTimeout(() => {
    zap(false);
    prompt.hidden = false;
    hint.hidden = false;
    unlockBtn.hidden = false;
    if (!coarse) setTimeout(() => input.focus(), 60); // never force the mobile keyboard
  }, 2050);

  /* ---------- typing model ---------- */
  function render() {
    typed.textContent = input.value;
  }
  input.addEventListener('input', render);
  // keep the (transparent) input focused when tapping the prompt
  prompt.addEventListener('click', () => { if (!done) input.focus(); });

  function autoType(text, cb) {
    let i = 0; input.value = ''; render();
    if (reduce) { input.value = text; render(); cb && cb(); return; }
    (function step() {
      if (i <= text.length) { input.value = text.slice(0, i); render(); SFX() && SFX().type(); i++; setTimeout(step, 26 + Math.random() * 22); }
      else { cb && cb(); }
    })();
  }

  /* ---------- command parser ---------- */
  const COMMANDS = {
    help() {
      return [
        'available commands:',
        '  <span class="ok">whoami</span>        about me',
        '  <span class="ok">ls</span>            list sections',
        '  <span class="ok">cv</span>            download my resume',
        '  <span class="ok">contact</span>       reach me',
        '  <span class="ok">sudo access-portfolio</span>  <span class="grant">decrypt &amp; enter</span>',
        '  <span class="dim">(or just press ENTER to unlock)</span>'
      ];
    },
    whoami() {
      return [
        'Gabriël Awes Zoretić. full-stack developer, front-end and design leaning.',
        'building toward <span class="ok">cybersecurity and cloud</span>. based in Amsterdam.',
        '<span class="dim">Sep \'26: Cyber Security &amp; Cloud duaal @ HU + H2B IT Solutions.</span>'
      ];
    },
    contact() {
      return [
        'email     <span class="ok">aweszoretic@hotmail.nl</span>',
        'github    <span class="ok">github.com/Awes2000</span>',
        'linkedin  <span class="ok">/in/gabriël-awes-z</span>',
        '<span class="dim">&gt; say hello any time.</span>'
      ];
    }
  };
  function lsProjects() {
    return [
      'drwx <span class="dim">CF-00</span>  flurter            <span class="ok">★ featured</span>',
      'drwx <span class="dim">CF-01</span>  property-pulse',
      'drwx <span class="dim">CF-02</span>  prostore',
      'drwx <span class="dim">CF-03</span>  colorpicker'
    ];
  }

  function run(raw) {
    const cmd = raw.trim().replace(/\s+/g, ' ').toLowerCase();
    line('<span class="ps1">guest@gabriel-os:~$</span> ' + (raw.replace(/[<>]/g, '') || ''), '');
    input.value = ''; render();

    if (cmd === '' || cmd === 'sudo access-portfolio' || cmd === 'access-portfolio' || cmd === 'unlock' || cmd === 'enter') {
      unlockSequence(); return;
    }
    if (cmd === 'clear') { log.innerHTML = ''; return; }
    if (cmd === 'cv' || cmd === 'resume') {
      line('<span class="dim">&gt; fetching resume... opening awes_resume.pdf</span>');
      try { window.open('files/awes_resume_updated.pdf', '_blank', 'noopener'); } catch (e) {}
      return;
    }
    if (cmd === 'sudo rm -rf /' || cmd === 'rm -rf /' || cmd === 'sudo rm -rf /*') {
      zap(false);
      ['<span class="crit">nice try.</span>', '<span class="dim">i secure systems now, remember?</span>'].forEach((l, i) => setTimeout(() => line(l), i * 220));
      return;
    }
    if (cmd === 'ls projects' || cmd === 'ls' || cmd === 'ls -la' || cmd === 'ls projects/') {
      lsProjects().forEach((l, i) => setTimeout(() => line(l), i * 70)); return;
    }
    const fn = COMMANDS[cmd];
    if (fn) { fn().forEach((l, i) => setTimeout(() => line(l), i * 80)); return; }
    line('command not found: <span class="crit">' + cmd.replace(/[<>]/g, '') + '</span>. try <span class="ok">help</span>', '');
  }

  // ENTER: empty -> theatrical auto-type then unlock; text -> run
  input.addEventListener('keydown', (e) => {
    if (done) return;
    if (e.key === 'Enter') {
      e.preventDefault();
      const v = input.value.trim();
      if (v === '') { autoType('sudo access-portfolio', () => setTimeout(() => run('sudo access-portfolio'), 160)); }
      else { run(input.value); }
    }
  });
  unlockBtn && unlockBtn.addEventListener('click', () => {
    if (done) return;
    autoType('sudo access-portfolio', () => setTimeout(() => run('sudo access-portfolio'), 160));
  });

  /* ---------- unlock + reveal ---------- */
  function unlockSequence() {
    if (done) return; done = true;
    prompt.hidden = true; hint.hidden = true; unlockBtn.hidden = true;
    line(NLG ? '> inloggegevens controleren...' : '> verifying credentials...', 'dim');

    const steps = ['░░░░░░░░░░', '■■■░░░░░░░', '■■■■■■░░░░', '■■■■■■■■░░', '■■■■■■■■■■'];
    const decLabel = NLG ? '> bestanden ontsleutelen... ' : '> decrypting assets... ';
    const bar = line(decLabel + '<span class="gate-bar-progress">' + steps[0] + '</span>');
    let s = 0;
    const tick = setInterval(() => {
      s++;
      if (s < steps.length) {
        bar.innerHTML = decLabel + '<span class="gate-bar-progress">' + steps[s] + '</span> ' + (s * 25) + '%';
        zap(false);
      } else {
        clearInterval(tick);
        bar.innerHTML = decLabel + '<span class="gate-bar-progress">[' + (NLG ? 'klaar' : 'done') + ']</span>';
        setTimeout(grant, 260);
      }
    }, reduce ? 60 : 200);
  }

  function grant() {
    line(NLG ? '> <span class="grant">TOEGANG VERLEEND</span>. welkom.' : '> <span class="grant">ACCESS GRANTED</span>. welcome in.', '');
    zap(true); // the biggest zap
    SFX() && SFX().unlock(); // the one hero sound
    if (window.RIPPLE) window.RIPPLE.burst(window.innerWidth / 2, window.innerHeight / 2);
    setTimeout(reveal, reduce ? 120 : 420);
  }

  function reveal() {
    markUnlocked();
    window.scrollTo(0, 0);              // always land on the hero, not wherever we were
    html.classList.remove('locked');     // blur lifts, color bleeds, hud fades in
    html.classList.add('unlocked');      // redaction wipes, terminal dissolves
    window.dispatchEvent(new CustomEvent('aws:access')); // hero types in
    setStatic(0.07);
    // robustly dismiss the redaction overlay (per-bar transitions don't reliably
    // fire when .unlocked is added post-interaction — fade + remove the container)
    const redact = document.getElementById('redact');
    if (redact) {
      redact.style.opacity = '0';
      redact.style.pointerEvents = 'none';
      setTimeout(() => { redact.style.display = 'none'; }, 700);
    }
    // remove the gate from the a11y tree + move focus into the page
    setTimeout(() => {
      gate.classList.add('gone');
      const heroName = document.querySelector('.hero-name');
      if (heroName) { heroName.setAttribute('tabindex', '-1'); heroName.focus({ preventScroll: true }); }
    }, 700);
    setTimeout(() => { gate.style.display = 'none'; }, 1300);
  }

  /* ---------- always skippable ---------- */
  function skipNow(e) { if (e) e.preventDefault(); if (!done) { line('> skip. entering...', 'dim'); reveal(); done = true; } }
  skip.addEventListener('click', skipNow);
  document.addEventListener('keydown', function onEsc(e) {
    if (e.key === 'Escape') { skipNow(e); document.removeEventListener('keydown', onEsc); }
  });

  /* ---------- rare signal-loss stutter while waiting ---------- */
  if (!reduce) {
    const stutter = setInterval(() => {
      if (done) { clearInterval(stutter); return; }
      if (Math.random() < 0.5) zap(false);
    }, 4200);
  }
})();
