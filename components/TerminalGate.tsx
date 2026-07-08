"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { T } from "@/components/T";
import { dispatchAccess, ripple } from "@/lib/bus";
import { buildPost, GATE_COMMANDS, lsProjects, RESUME_PATH, UNLOCK_KEY } from "@/lib/gate";
import { readSessionValue, writeSessionValue } from "@/lib/hooks/useSessionFlag";
import { SESSION_LANG_KEY } from "@/lib/i18n";
import { sfx } from "@/lib/sfx";
import { useSfxEnabled } from "@/lib/hooks/useSfxEnabled";

interface LogLine {
  html: string;
  cls: string;
}

interface RBar {
  left: number; top: number; width: number; height: number; delay: string;
}

const html = () => document.documentElement;

export function TerminalGate() {
  const [lines, setLines] = useState<LogLine[]>([]);
  const [bar, setBar] = useState<string | null>(null);
  const [typed, setTyped] = useState("");
  const [promptVisible, setPromptVisible] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [gone, setGone] = useState(false);
  const [bars, setBars] = useState<RBar[]>([]);
  const sndOn = useSfxEnabled();

  const logRef = useRef<HTMLDivElement>(null);
  const crtRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const done = useRef(false);
  const nl = useRef(false);
  const reduce = useRef(false);
  const coarse = useRef(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const intervals = useRef<ReturnType<typeof setInterval>[]>([]);
  const [powering, setPowering] = useState(true);

  const later = useCallback((fn: () => void, ms: number) => {
    timers.current.push(setTimeout(fn, ms));
  }, []);

  const line = useCallback((content: string, cls = "") => {
    setLines((prev) => [...prev, { html: content, cls }]);
  }, []);

  const setStatic = (v: number) => html().style.setProperty("--static-op", String(v));

  const zap = useCallback((big: boolean) => {
    if (reduce.current) return;
    const crt = crtRef.current;
    setStatic(big ? 0.72 : 0.45);
    if (crt) {
      crt.classList.remove("gate-zap");
      void crt.offsetWidth;
      crt.classList.add("gate-zap");
    }
    sfx.zap(big);
    setTimeout(() => setStatic(0.07), big ? 240 : 170);
    setTimeout(() => crt?.classList.remove("gate-zap"), 260);
  }, []);

  const reveal = useCallback(() => {
    writeSessionValue(UNLOCK_KEY, "1");
    window.scrollTo(0, 0); // always land on the hero, not wherever we were
    html().classList.remove("locked"); // blur lifts, color bleeds, hud fades in
    html().classList.add("unlocked"); // redaction wipes, terminal dissolves
    dispatchAccess(); // hero types in
    setStatic(0.07);
    // move the gate out of the a11y tree + focus into the page
    setTimeout(() => {
      setGone(true);
      const heroName = document.querySelector<HTMLElement>(".hero-name");
      if (heroName) {
        heroName.setAttribute("tabindex", "-1");
        heroName.focus({ preventScroll: true });
      }
    }, 700);
    setTimeout(() => setHidden(true), 1300);
  }, []);

  const grant = useCallback(() => {
    line(nl.current ? '> <span class="grant">TOEGANG VERLEEND</span>. welkom.' : '> <span class="grant">ACCESS GRANTED</span>. welcome in.');
    zap(true); // the biggest zap
    sfx.unlock(); // the one hero sound
    ripple.burst(window.innerWidth / 2, window.innerHeight / 2);
    later(reveal, reduce.current ? 120 : 420);
  }, [line, zap, reveal, later]);

  const unlockSequence = useCallback(() => {
    if (done.current) return;
    done.current = true;
    setPromptVisible(false);
    line(nl.current ? "> inloggegevens controleren..." : "> verifying credentials...", "dim");
    const steps = ["░░░░░░░░░░", "■■■░░░░░░░", "■■■■■■░░░░", "■■■■■■■■░░", "■■■■■■■■■■"];
    const decLabel = nl.current ? "> bestanden ontsleutelen... " : "> decrypting assets... ";
    setBar(decLabel + '<span class="gate-bar-progress">' + steps[0] + "</span>");
    let s = 0;
    const tick = setInterval(() => {
      s++;
      if (s < steps.length) {
        setBar(decLabel + '<span class="gate-bar-progress">' + steps[s] + "</span> " + s * 25 + "%");
        zap(false);
      } else {
        clearInterval(tick);
        setBar(null);
        line(decLabel + '<span class="gate-bar-progress">[' + (nl.current ? "klaar" : "done") + "]</span>");
        later(grant, 260);
      }
    }, reduce.current ? 60 : 200);
    intervals.current.push(tick);
  }, [line, zap, grant, later]);

  const autoType = useCallback((text: string, cb: () => void) => {
    setTyped("");
    if (reduce.current) {
      setTyped(text);
      cb();
      return;
    }
    let i = 0;
    const step = () => {
      if (i <= text.length) {
        setTyped(text.slice(0, i));
        if (inputRef.current) inputRef.current.value = text.slice(0, i);
        sfx.type();
        i++;
        timers.current.push(setTimeout(step, 26 + Math.random() * 22));
      } else cb();
    };
    step();
  }, []);

  const run = useCallback(
    (raw: string) => {
      const cmd = raw.trim().replace(/\s+/g, " ").toLowerCase();
      line('<span class="ps1">guest@gabriel-os:~$</span> ' + (raw.replace(/[<>]/g, "") || ""));
      setTyped("");
      if (inputRef.current) inputRef.current.value = "";

      if (cmd === "" || cmd === "sudo access-portfolio" || cmd === "access-portfolio" || cmd === "unlock" || cmd === "enter") {
        unlockSequence();
        return;
      }
      if (cmd === "clear") {
        setLines([]);
        return;
      }
      if (cmd === "cv" || cmd === "resume") {
        line('<span class="dim">&gt; fetching resume... opening awes_resume.pdf</span>');
        try {
          window.open(RESUME_PATH, "_blank", "noopener");
        } catch {
          /* ignore */
        }
        return;
      }
      if (cmd === "sudo rm -rf /" || cmd === "rm -rf /" || cmd === "sudo rm -rf /*") {
        zap(false);
        ['<span class="crit">nice try.</span>', '<span class="dim">i secure systems now, remember?</span>'].forEach((l, i) =>
          later(() => line(l), i * 220),
        );
        return;
      }
      if (cmd === "ls projects" || cmd === "ls" || cmd === "ls -la" || cmd === "ls projects/") {
        lsProjects().forEach((l, i) => later(() => line(l), i * 70));
        return;
      }
      const fn = GATE_COMMANDS[cmd];
      if (fn) {
        fn().forEach((l, i) => later(() => line(l), i * 80));
        return;
      }
      line('command not found: <span class="crit">' + cmd.replace(/[<>]/g, "") + '</span>. try <span class="ok">help</span>');
    },
    [line, unlockSequence, zap, later],
  );

  const skipNow = useCallback(() => {
    if (!done.current) {
      line("> skip. entering...", "dim");
      reveal();
      done.current = true;
    }
  }, [line, reveal]);

  /* ---------- boot sequence (runs once, mirrors js/boot.js) ---------- */
  useEffect(() => {
    reduce.current = matchMedia("(prefers-reduced-motion: reduce)").matches;
    coarse.current = matchMedia("(hover:none),(pointer:coarse)").matches;
    nl.current = readSessionValue(SESSION_LANG_KEY) === "nl";

    const forceReplay = /(^|#)(gate|replay|boot)$/i.test(location.hash);
    if (forceReplay) {
      writeSessionValue(UNLOCK_KEY, null);
      html().classList.remove("unlocked");
      html().classList.add("locked");
      try {
        history.replaceState(null, "", location.pathname + location.search);
      } catch {
        /* ignore */
      }
      window.scrollTo(0, 0);
    }
    const unlocked = readSessionValue(UNLOCK_KEY) === "1";
    if (!forceReplay && (reduce.current || unlocked)) {
      /* fast path: no gate, clean state, content revealed */
      html().classList.remove("locked");
      html().classList.add("unlocked");
      setHidden(true);
      writeSessionValue(UNLOCK_KEY, "1");
      dispatchAccess();
      setTimeout(dispatchAccess, 60);
      return;
    }

    /* redaction bars (staggered L→R wipe) */
    setBars(
      Array.from({ length: 16 }, () => {
        const left = Math.random() * 70 + 4;
        return {
          left,
          top: Math.random() * 88 + 4,
          width: Math.random() * 22 + 8,
          height: 10 + Math.random() * 8,
          delay: ((left / 90) * 0.45).toFixed(3) + "s",
        };
      }),
    );

    later(() => setPowering(false), 560);
    buildPost(nl.current).forEach(([content, cls, delay]) => later(() => line(content, cls), 420 + delay));
    later(() => {
      zap(false);
      setPromptVisible(true);
      if (!coarse.current) setTimeout(() => inputRef.current?.focus(), 60); // never force the mobile keyboard
    }, 2050);

    /* always skippable via Esc */
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        skipNow();
        document.removeEventListener("keydown", onEsc);
      }
    };
    document.addEventListener("keydown", onEsc);

    /* rare signal-loss stutter while waiting */
    const stutter = setInterval(() => {
      if (done.current) {
        clearInterval(stutter);
        return;
      }
      if (Math.random() < 0.5) zap(false);
    }, 4200);

    const pendingTimers = timers.current;
    const pendingIntervals = intervals.current;
    return () => {
      document.removeEventListener("keydown", onEsc);
      clearInterval(stutter);
      pendingTimers.forEach(clearTimeout);
      pendingIntervals.forEach(clearInterval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* keep the log scrolled to the newest line */
  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [lines, bar]);

  if (hidden) return null;

  return (
    <>
      {/* redaction layer over the blurred portfolio */}
      <div id="redact" aria-hidden="true" style={gone ? { opacity: 0, pointerEvents: "none", display: "none" } : undefined}>
        <div className="rbars" id="rbars">
          {bars.map((b, i) => (
            <span
              key={i}
              className="rbar"
              style={{
                left: b.left + "vw",
                top: b.top + "vh",
                width: b.width + "vw",
                height: b.height + "px",
                transitionDelay: b.delay,
              }}
            />
          ))}
        </div>
        <span className="stamp s1">Classified</span>
        <span className="stamp s2">Redacted</span>
        <span className="stamp s3">Eyes Only</span>
      </div>

      {/* TV static (cheap animated SVG turbulence, tinted steel) */}
      <div id="static-noise" aria-hidden="true">
        <svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <filter id="tvnoise" x="0" y="0" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.82" numOctaves="2" stitchTiles="stitch" seed="3" result="n">
              <animate attributeName="seed" values="3;19;7;26;3" dur="0.7s" repeatCount="indefinite" calcMode="discrete" />
            </feTurbulence>
            <feColorMatrix in="n" type="matrix" values="0 0 0 0 0.56  0 0 0 0 0.65  0 0 0 0 0.78  0 0 0 0.9 0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#tvnoise)" />
        </svg>
      </div>

      {/* CRT terminal */}
      <div id="gate" className={gone ? "gone" : undefined} role="dialog" aria-label="Terminal access gate" aria-modal="true">
        <div className={`crt-screen${powering ? " powering" : ""}`} id="crt-screen" ref={crtRef}>
          <div className="crt-poweron" />
          <div className="crt-content">
            <a
              href="#hero"
              className="gate-skip"
              id="gate-skip"
              onClick={(e) => {
                e.preventDefault();
                skipNow();
              }}
            >
              <T k="gate.skip" />
            </a>
            <div className="gate-bar">
              <span>GABRIEL-OS</span>
              <span>SECURE TERMINAL v4.0</span>
            </div>
            <div className="gate-log" id="gate-log" aria-live="polite" ref={logRef}>
              {lines.map((l, i) => (
                <div key={i} className={`ln${l.cls ? " " + l.cls : ""}`} dangerouslySetInnerHTML={{ __html: l.html }} />
              ))}
              {bar !== null && <div className="ln" dangerouslySetInnerHTML={{ __html: bar }} />}
            </div>
            <div
              className="gate-prompt"
              id="gate-prompt"
              hidden={!promptVisible}
              onClick={() => {
                if (!done.current) inputRef.current?.focus();
              }}
            >
              <span className="ps1">guest@gabriel-os:~$</span>
              <span className="gate-input-wrap">
                <span id="gate-typed">{typed}</span>
                <span className="caret" id="gate-caret">█</span>
              </span>
              <input
                id="gate-cmd"
                ref={inputRef}
                autoComplete="off"
                autoCapitalize="off"
                autoCorrect="off"
                spellCheck={false}
                aria-label="Type a terminal command"
                onInput={(e) => setTyped((e.target as HTMLInputElement).value)}
                onKeyDown={(e) => {
                  if (done.current) return;
                  if (e.key === "Enter") {
                    e.preventDefault();
                    const v = (e.target as HTMLInputElement).value.trim();
                    if (v === "") autoType("sudo access-portfolio", () => later(() => run("sudo access-portfolio"), 160));
                    else run((e.target as HTMLInputElement).value);
                  }
                }}
              />
            </div>
            <T as="p" className="gate-hint" k="gate.hint" hidden={!promptVisible} />
            <button
              className="gate-unlock"
              id="gate-unlock"
              hidden={!promptVisible}
              onClick={() => {
                if (done.current) return;
                autoType("sudo access-portfolio", () => later(() => run("sudo access-portfolio"), 160));
              }}
            >
              <T k="gate.unlock" />
            </button>
          </div>
          <div className="zap-tear" />
          <div className="crt-scanlines" />
          <div className="crt-vignette" />
          <div className="crt-flicker" />
        </div>
        <button
          className="gate-sound"
          id="gate-sound"
          aria-pressed={sndOn}
          aria-label={`Terminal sound, ${sndOn ? "on" : "off"}`}
          onClick={() => sfx.toggle()}
        >
          {sndOn ? "◆ snd: on" : "◇ snd: off"}
        </button>
      </div>
    </>
  );
}
