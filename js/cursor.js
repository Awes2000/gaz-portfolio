/* ============================================================
   PREMIUM CURSOR — exact dot + spring-trailing ring.
   mix-blend-mode:difference so it integrates with anything
   beneath. Context-aware: link → grow + magnetic pull;
   case file → corner brackets; text → caret. Desktop only.
   ============================================================ */
(function () {
  const fine = (() => { try { return matchMedia('(hover:hover) and (pointer:fine)').matches; } catch (e) { return false; } })();
  if (!fine) return; // touch/coarse: no custom cursor at all

  const reduce = (() => { try { return matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) { return false; } })();
  const html = document.documentElement;
  const cur = document.getElementById('cur');
  const dot = document.getElementById('cur-dot');
  const ring = document.getElementById('cur-ring');
  if (!cur || !dot || !ring) return;

  html.classList.add('cursor-custom');

  const LINK = 'a,button,[role=button],.hud-ic,.sb-term,.sb-sfx,.pal-close,.detail-close,.contact-cta,.btn-ghost,.foot-replay,.case-links a,summary,label';
  const CASE = '.case';
  const TEXT = 'p,h1,h2,h3,h4,h5,h6,li,input,textarea,.hero-type,.case-desc,.about-copy,.detail-body';

  // target (exact pointer) + spring ring state
  let tx = innerWidth / 2, ty = innerHeight / 2;
  let rx = tx, ry = ty, vx = 0, vy = 0;
  let magX = tx, magY = ty;          // magnetic target (may be pulled to an element center)
  let mode = '';                      // '', 'link', 'case', 'text'
  let shown = false;

  function show() { if (!shown) { shown = true; cur.classList.remove('hidden'); } }
  function hide() { shown = false; cur.classList.add('hidden'); }

  document.addEventListener('pointermove', (e) => {
    if (e.pointerType && e.pointerType !== 'mouse') return;
    tx = e.clientX; ty = e.clientY; show();

    const t = e.target;
    let next = '', pull = null;
    if (t.closest(CASE)) next = 'case';
    else if (t.closest(LINK)) {
      next = 'link';
      const el = t.closest(LINK);
      const r = el.getBoundingClientRect();
      // magnetic: pull the ring toward the element centre (only for compact controls)
      if (r.width < 240 && r.height < 90) pull = { x: r.left + r.width / 2, y: r.top + r.height / 2 };
    }
    else if (t.closest(TEXT)) next = 'text';

    magX = pull ? pull.x : tx;
    magY = pull ? pull.y : ty;

    if (next !== mode) {
      mode = next;
      cur.classList.toggle('is-link', mode === 'link');
      cur.classList.toggle('is-case', mode === 'case');
      cur.classList.toggle('is-text', mode === 'text');
    }
  }, { passive: true });

  document.addEventListener('pointerdown', () => cur.classList.add('down'));
  document.addEventListener('pointerup', () => cur.classList.remove('down'));
  document.addEventListener('mouseleave', hide);
  document.addEventListener('mouseenter', show);
  window.addEventListener('blur', hide);

  if (reduce) {
    // no spring — ring snaps to pointer, still context-aware
    (function frame() {
      dot.style.transform = `translate(${tx}px,${ty}px)`;
      ring.style.transform = `translate(${tx}px,${ty}px)`;
      requestAnimationFrame(frame);
    })();
    return;
  }

  // spring physics: ring trails the (possibly magnetic) target with weight
  const STIFF = 0.18, DAMP = 0.72;
  let last = performance.now(), acc = 0; const FRAME = 1000 / 60;
  (function frame(now) {
    const elapsed = now - last; last = now; acc += elapsed;
    if (acc >= FRAME) {
      acc = 0;
      // ring eases toward magnetic target with spring; pull strength blends toward magX/Y
      const targX = mode === 'link' ? rx + (magX - rx) * 0.55 + (tx - rx) * 0.0 : tx;
      const targY = mode === 'link' ? ry + (magY - ry) * 0.55 + (ty - ry) * 0.0 : ty;
      const ax = (targX - rx) * STIFF - vx * (1 - DAMP);
      const ay = (targY - ry) * STIFF - vy * (1 - DAMP);
      vx = (vx + ax) * DAMP; vy = (vy + ay) * DAMP;
      rx += vx; ry += vy;
    }
    dot.style.transform = `translate(${tx}px,${ty}px)`;
    ring.style.transform = `translate(${rx}px,${ry}px)`;
    requestAnimationFrame(frame);
  })(last);
})();
