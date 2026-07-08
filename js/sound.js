/* ============================================================
   SFX — synthesized game-UI sound layer (Web Audio, no files).
   Cohesive synth family: sine/triangle blips, filtered-noise
   zaps, a low ambient drone, a sonar sweep for unlock.
   MUTED BY DEFAULT. Lazy-inits on first opt-in (zero cost when
   off). Session-only state. window.SFX is the single master.
   ============================================================ */
(function () {
  const reduce = (() => { try { return matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) { return false; } })();

  let ctx = null, master = null, drone = null, droneGain = null, ready = false;
  let on = false;
  let lastHover = 0;

  function init() {
    if (ready) return;
    ready = true;
    ctx = new (window.AudioContext || window.webkitAudioContext)();
    master = ctx.createGain();
    master.gain.value = 0.0; // ramp up on enable
    // gentle master lowpass so nothing is harsh
    const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 6500;
    master.connect(lp); lp.connect(ctx.destination);

    // ambient bed: two detuned low sines + faint filtered noise
    droneGain = ctx.createGain(); droneGain.gain.value = 0.0;
    const o1 = ctx.createOscillator(); o1.type = 'sine'; o1.frequency.value = 55;
    const o2 = ctx.createOscillator(); o2.type = 'sine'; o2.frequency.value = 55.4;
    const dGain = ctx.createGain(); dGain.gain.value = 0.5;
    o1.connect(dGain); o2.connect(dGain); dGain.connect(droneGain);
    // slow LFO shimmer on the drone
    const lfo = ctx.createOscillator(); lfo.type = 'sine'; lfo.frequency.value = 0.08;
    const lfoGain = ctx.createGain(); lfoGain.gain.value = 0.18;
    lfo.connect(lfoGain); lfoGain.connect(droneGain.gain);
    droneGain.connect(master);
    o1.start(); o2.start(); lfo.start();
    drone = droneGain;
  }

  // shared short noise buffer
  let noiseBuf = null;
  function noise() {
    if (!noiseBuf) {
      noiseBuf = ctx.createBuffer(1, ctx.sampleRate * 0.4, ctx.sampleRate);
      const d = noiseBuf.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    }
    const s = ctx.createBufferSource(); s.buffer = noiseBuf; return s;
  }

  // a tonal blip: osc + quick env, tiny random detune
  function blip(freq, dur, type, vol, glideTo) {
    if (!on || !ctx) return;
    const t = ctx.currentTime;
    const o = ctx.createOscillator(); o.type = type || 'sine';
    const detune = (Math.random() * 2 - 1) * 12;
    o.frequency.setValueAtTime(freq, t); o.detune.value = detune;
    if (glideTo) o.frequency.exponentialRampToValueAtTime(glideTo, t + dur);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(vol, t + 0.006);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(master);
    o.start(t); o.stop(t + dur + 0.02);
  }

  function zapSound(big) {
    if (!on || !ctx) return;
    const t = ctx.currentTime;
    const s = noise();
    const bp = ctx.createBiquadFilter(); bp.type = 'bandpass';
    bp.frequency.setValueAtTime(big ? 800 : 1400, t);
    bp.frequency.exponentialRampToValueAtTime(big ? 220 : 600, t + (big ? 0.22 : 0.12));
    bp.Q.value = 0.8;
    const g = ctx.createGain();
    const amp = big ? 0.16 : 0.06;
    g.gain.setValueAtTime(amp, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + (big ? 0.24 : 0.13));
    s.connect(bp); bp.connect(g); g.connect(master);
    s.start(t); s.stop(t + 0.3);
  }

  const API = {
    get enabled() { return on; },
    toggle() { return this.set(!on); },
    set(v) {
      if (v && !ready) init();
      on = !!v;
      if (ctx) {
        ctx.resume();
        const t = ctx.currentTime;
        master.gain.cancelScheduledValues(t);
        master.gain.linearRampToValueAtTime(on ? 0.5 : 0.0, t + 0.25);
        droneGain.gain.cancelScheduledValues(t);
        droneGain.gain.linearRampToValueAtTime(on ? 0.05 : 0.0, t + 0.6);
      }
      reflect();
      if (on) this.click();
      return on;
    },
    hover() {
      const now = performance.now();
      if (now - lastHover < 70) return;     // throttle machine-gun blips
      lastHover = now;
      blip(2100 + Math.random() * 120, 0.05, 'sine', 0.018);
    },
    click() { blip(880, 0.07, 'triangle', 0.05, 1320); },
    type() { blip(1500 + Math.random() * 300, 0.022, 'square', 0.012); },
    zap(big) { zapSound(big); },
    unlock() { // the one "hero" sound — a smooth sonar/confirm sweep
      if (!on || !ctx) return;
      blip(330, 0.5, 'sine', 0.10, 990);
      setTimeout(() => blip(660, 0.55, 'sine', 0.08, 1320), 90);
      setTimeout(() => zapSound(true), 40);
    },
    root() { // rare, distinct
      if (!on || !ctx) return;
      [523, 659, 784, 1047].forEach((f, i) => setTimeout(() => blip(f, 0.22, 'triangle', 0.06), i * 70));
    }
  };
  window.SFX = API;

  /* ---------- toggles reflect shared state ---------- */
  const toggles = [];
  function reflect() {
    toggles.forEach(btn => {
      btn.setAttribute('aria-pressed', on ? 'true' : 'false');
      btn.setAttribute('aria-label', 'UI sound, ' + (on ? 'on' : 'off'));
      if (btn.classList.contains('sb-sfx')) btn.textContent = on ? '◆ snd' : '◇ snd';
      if (btn.classList.contains('gate-sound')) btn.textContent = on ? '◆ snd: on' : '◇ snd: off';
      if (btn.classList.contains('m-snd')) btn.textContent = on ? '◆ sound' : '◇ sound';
    });
  }
  function wireToggle(sel) {
    const btn = document.querySelector(sel);
    if (!btn) return;
    toggles.push(btn);
    btn.addEventListener('click', () => API.toggle());
  }
  wireToggle('#sb-sfx');
  wireToggle('#gate-sound');
  wireToggle('#m-snd');
  reflect();

  /* ---------- global hover / click feedback (delegated, cheap) ---------- */
  const INTERACTIVE = 'a,button,.case,.hud-ic,.sb-term,.sb-sfx,.cap,.contact-cta,.btn-ghost,.foot-replay';
  document.addEventListener('pointerover', (e) => {
    if (!on) return;
    if (e.target.closest(INTERACTIVE)) API.hover();
  }, { passive: true });
  document.addEventListener('pointerdown', (e) => {
    if (!on) return;
    if (e.target.closest(INTERACTIVE)) API.click();
  }, { passive: true });

  // expose for boot.js gate (unlock hero sound + typing)
  window.addEventListener('aws:zap', (e) => API.zap(e.detail && e.detail.big));
})();
