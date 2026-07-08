"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { bindToast, ripple, shell } from "@/lib/bus";
import { useAmsterdamClock } from "@/lib/hooks/useAmsterdamClock";
import { useIdleSignal } from "@/lib/hooks/useIdleSignal";
import { useSfxEnabled } from "@/lib/hooks/useSfxEnabled";
import { SECTION_PATHS } from "@/lib/shellCommands";
import { sfx, SFX_INTERACTIVE } from "@/lib/sfx";
import { useScreensaver } from "@/lib/hooks/useScreensaver";

const KONAMI = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];
const AFK = ["[afk] gabriel-os", "connection idle...", "> session backgrounded"];

export function Shell() {
  const reduce = !!useReducedMotion();
  const clock = useAmsterdamClock();
  const idle = useIdleSignal(15000);
  const sndOn = useSfxEnabled();
  const [path, setPath] = useState("~");
  const [trail, setTrail] = useState<string[]>([]);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const [toastHtml, setToastHtml] = useState<string | null>(null);
  const sweepRef = useRef<HTMLDivElement>(null);
  const grainRef = useRef<HTMLDivElement>(null);
  const saverRef = useRef<HTMLCanvasElement>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useScreensaver(saverRef, reduce);

  /* egg toast host (footer egg, konami, logo glitch all print here) */
  useEffect(
    () =>
      bindToast((html, ms = 3600) => {
        setToastHtml(html);
        if (toastTimer.current) clearTimeout(toastTimer.current);
        toastTimer.current = setTimeout(() => setToastHtml(null), ms);
      }),
    [],
  );

  /* filesystem-style section path + breadcrumb history + sweep */
  useEffect(() => {
    let active = "hero";
    const history = ["~"];
    const obs = new IntersectionObserver(
      (entries) => {
        let best: Element | null = null;
        let ratio = 0;
        entries.forEach((e) => {
          if (e.intersectionRatio > ratio) {
            ratio = e.intersectionRatio;
            best = e.target;
          }
        });
        if (!best || ratio <= 0.25) return;
        const id = (best as Element).id;
        if (id === active || !SECTION_PATHS[id]) return;
        active = id;
        const p = SECTION_PATHS[id];
        if (history[history.length - 1] !== p) history.push(p);
        if (history.length > 4) history.shift();
        setPath(p);
        setTrail(history.slice(0, -1).slice(-2));
        if (!reduce && sweepRef.current) {
          sweepRef.current.classList.remove("run");
          void sweepRef.current.offsetWidth;
          sweepRef.current.classList.add("run");
        }
        ripple.setAudioLevel(0.5);
        setTimeout(() => ripple.setAudioLevel(0), 130);
        sfx.zap(false);
      },
      { threshold: [0.25, 0.5, 0.75] },
    );
    Object.keys(SECTION_PATHS).forEach((id) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, [reduce]);

  /* grain parallax (very subtle) */
  useEffect(() => {
    if (reduce) return;
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        if (grainRef.current) grainRef.current.style.transform = `translateY(${(window.scrollY * 0.04).toFixed(1)}px)`;
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [reduce]);

  /* konami → CRT demo mode; '?' → shortcuts panel */
  useEffect(() => {
    let kIdx = 0;
    const onKey = (e: KeyboardEvent) => {
      const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      kIdx = k === KONAMI[kIdx] ? kIdx + 1 : k === KONAMI[0] ? 1 : 0;
      if (kIdx === KONAMI.length) {
        kIdx = 0;
        const html = document.documentElement;
        html.classList.toggle("demo");
        sfx.root();
        if (html.classList.contains("pal-open")) {
          shell.print('<span class="ok">// CRT demo mode ' + (html.classList.contains("demo") ? "engaged" : "disengaged") + "</span>");
        } else {
          setToastHtml("<b>CRT demo mode</b> " + (html.classList.contains("demo") ? "engaged ▦" : "off"));
          if (toastTimer.current) clearTimeout(toastTimer.current);
          toastTimer.current = setTimeout(() => setToastHtml(null), 2600);
        }
      }
      const typing = /^(INPUT|TEXTAREA)$/.test((e.target as HTMLElement).tagName || "");
      if (e.key === "?" && !typing && !document.documentElement.classList.contains("pal-open")) {
        e.preventDefault();
        setShortcutsOpen((o) => {
          if (!o) sfx.click();
          return !o;
        });
      } else if (e.key === "Escape") setShortcutsOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  /* living tab title (afk when the tab loses focus) */
  useEffect(() => {
    const REAL_TITLE = document.title;
    let tick: ReturnType<typeof setInterval> | undefined;
    const away = () => {
      let i = 0;
      document.title = AFK[0];
      clearInterval(tick);
      tick = setInterval(() => {
        i = (i + 1) % AFK.length;
        document.title = AFK[i];
      }, 2600);
    };
    const back = () => {
      clearInterval(tick);
      document.title = REAL_TITLE;
    };
    const onVis = () => (document.hidden ? (document.title = AFK[0]) : back());
    window.addEventListener("blur", away);
    window.addEventListener("focus", back);
    document.addEventListener("visibilitychange", onVis);
    return () => {
      clearInterval(tick);
      window.removeEventListener("blur", away);
      window.removeEventListener("focus", back);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  /* magnetic controls + delegated sfx hover/click feedback */
  useEffect(() => {
    const fine = matchMedia("(hover:hover) and (pointer:fine)").matches;
    const cleanups: Array<() => void> = [];
    if (!reduce && fine) {
      document.querySelectorAll<HTMLElement>(".btn-ghost, .contact-cta, .hud-ic, .sb-term, .sb-sfx").forEach((el) => {
        let raf: number | null = null;
        const move = (e: PointerEvent) => {
          const r = el.getBoundingClientRect();
          const mx = e.clientX - (r.left + r.width / 2);
          const my = e.clientY - (r.top + r.height / 2);
          if (raf) return;
          raf = requestAnimationFrame(() => {
            el.style.transform = `translate(${(mx * 0.18).toFixed(1)}px, ${(my * 0.22).toFixed(1)}px)`;
            raf = null;
          });
        };
        const leave = () => {
          el.style.transform = "";
        };
        el.addEventListener("pointermove", move);
        el.addEventListener("pointerleave", leave);
        cleanups.push(() => {
          el.removeEventListener("pointermove", move);
          el.removeEventListener("pointerleave", leave);
        });
      });
    }
    const over = (e: PointerEvent) => {
      if (sfx.enabled && (e.target as HTMLElement).closest(SFX_INTERACTIVE)) sfx.hover();
    };
    const down = (e: PointerEvent) => {
      if (sfx.enabled && (e.target as HTMLElement).closest(SFX_INTERACTIVE)) sfx.click();
    };
    document.addEventListener("pointerover", over, { passive: true });
    document.addEventListener("pointerdown", down, { passive: true });
    return () => {
      cleanups.forEach((fn) => fn());
      document.removeEventListener("pointerover", over);
      document.removeEventListener("pointerdown", down);
    };
  }, [reduce]);

  return (
    <>
      <div id="grain" ref={grainRef} aria-hidden="true" />
      <div id="sweep" ref={sweepRef} aria-hidden="true" />
      <div id="crtmode" aria-hidden="true" />
      <canvas id="screensaver" ref={saverRef} aria-hidden="true" />
      <div id="powerdown" aria-hidden="true">
        <span className="pd-line" />
      </div>

      <div id="shell-bar" className={idle ? "idle" : undefined} role="status" aria-label="System status bar">
        <div className="sb-left">
          <span className="sb-sig" id="sb-sig" title="Connection signal"><i /><i /><i /><i /></span>
          <span className="sb-secure">SECURE</span>
          <span className="sb-sep">::</span>
          <span className="sb-path">
            guest@gabriel-os:
            <span className="sb-trail" id="sb-trail">
              {trail.map((p, i) => (
                <span key={i}>
                  {p}
                  <span className="sep">›</span>
                </span>
              ))}
            </span>
            <b id="sb-path">{path}</b>
            <span className="sb-caret">█</span>
          </span>
        </div>
        <div className="sb-right">
          <button id="sb-help" className="sb-help" aria-label="Keyboard shortcuts" title="Keyboard shortcuts" onClick={() => setShortcutsOpen(true)}>
            [?]
          </button>
          <button id="sb-sfx" className="sb-sfx" aria-pressed={sndOn} title="UI sound" onClick={() => sfx.toggle()}>
            {sndOn ? "◆ snd" : "◇ snd"}
          </button>
          <button id="sb-term" className="sb-term" aria-label="Open command terminal (⌘K)" title="Command terminal (⌘K / Ctrl-K)" onClick={() => shell.open()}>
            {">_"}
          </button>
          <span className="sb-sep">::</span>
          <span className="sb-clock" id="sb-clock">{clock}</span>
        </div>
      </div>

      <div
        id="shortcuts"
        className={shortcutsOpen ? "open" : undefined}
        aria-hidden={!shortcutsOpen}
        onClick={(e) => {
          if (e.target === e.currentTarget) setShortcutsOpen(false);
        }}
      >
        <div className="sc-card" role="dialog" aria-modal="true" aria-label="Keyboard shortcuts">
          <div className="sc-top">
            <span className="sc-title">~/help/shortcuts.txt</span>
            <button className="sc-close" id="sc-close" aria-label="Close" onClick={() => setShortcutsOpen(false)}>
              esc
            </button>
          </div>
          <div className="sc-body">
            <div className="sc-row"><kbd>⌘</kbd><kbd>K</kbd><span>open command terminal</span></div>
            <div className="sc-row"><kbd>Ctrl</kbd><kbd>K</kbd><span>open command terminal (Win/Linux)</span></div>
            <div className="sc-row"><kbd>Esc</kbd><span>close any panel / skip intro</span></div>
            <div className="sc-row"><kbd>?</kbd><span>this panel</span></div>
            <div className="sc-row"><kbd>↑↑↓↓←→←→BA</kbd><span>CRT demo mode</span></div>
            <div className="sc-hint">
              in the terminal: <b>help</b> · <b>ls projects</b> · <b>cd</b> · <b>top</b> · <b>logout</b>
            </div>
          </div>
        </div>
      </div>

      <div id="egg-toast" className={toastHtml ? "show" : undefined} dangerouslySetInnerHTML={{ __html: toastHtml ?? "" }} />
    </>
  );
}
