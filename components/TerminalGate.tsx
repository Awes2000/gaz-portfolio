"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { GateOverlays, makeRBars, type RBar } from "@/components/GateOverlays";
import { GateScreen, type LogLine } from "@/components/GateScreen";
import { dispatchAccess, ripple } from "@/lib/bus";
import { buildPost, GATE_COMMANDS, lsProjects, RESUME_PATH, UNLOCK_KEY } from "@/lib/gate";
import { readSessionValue, writeSessionValue } from "@/lib/hooks/useSessionFlag";
import { SESSION_LANG_KEY } from "@/lib/i18n";
import { sfx } from "@/lib/sfx";

const html = () => document.documentElement;

/* ============================================================
   TERMINAL UNLOCK GATE — ported 1:1 from js/boot.js. The real
   portfolio is server-rendered in the DOM, blurred + redacted
   behind this client overlay. A command (or Enter / UNLOCK)
   decrypts it. Reduced motion or an unlocked session skips the
   gate entirely; without JS it never shows.
   ============================================================ */
export function TerminalGate() {
  const [lines, setLines] = useState<LogLine[]>([]);
  const [bar, setBar] = useState<string | null>(null);
  const [typed, setTyped] = useState("");
  const [promptVisible, setPromptVisible] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [gone, setGone] = useState(false);
  const [bars, setBars] = useState<RBar[]>([]);
  const [powering, setPowering] = useState(true);

  const logRef = useRef<HTMLDivElement>(null);
  const crtRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const done = useRef(false);
  const nl = useRef(false);
  const reduce = useRef(false);
  const coarse = useRef(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const intervals = useRef<ReturnType<typeof setInterval>[]>([]);

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

  const enterOrAutoType = useCallback(
    (value: string) => {
      if (done.current) return;
      if (value.trim() === "") autoType("sudo access-portfolio", () => later(() => run("sudo access-portfolio"), 160));
      else run(value);
    },
    [autoType, later, run],
  );

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

    setBars(makeRBars()); // redaction bars (staggered L→R wipe)
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
      <GateOverlays bars={bars} gone={gone} />
      <GateScreen
        powering={powering}
        gone={gone}
        lines={lines}
        bar={bar}
        typed={typed}
        promptVisible={promptVisible}
        crtRef={crtRef}
        logRef={logRef}
        inputRef={inputRef}
        onSkip={skipNow}
        onPromptClick={() => {
          if (!done.current) inputRef.current?.focus();
        }}
        onInput={setTyped}
        onEnter={enterOrAutoType}
        onUnlock={() => enterOrAutoType("")}
      />
    </>
  );
}
