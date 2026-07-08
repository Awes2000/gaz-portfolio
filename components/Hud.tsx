"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { useLang } from "@/components/LangProvider";
import { T } from "@/components/T";
import { GithubIcon } from "@/components/caseIcons";
import { ripple, toast } from "@/lib/bus";
import { sfx } from "@/lib/sfx";
import { useSfxEnabled } from "@/lib/hooks/useSfxEnabled";

function LinkedinIcon() {
  return (
    <svg viewBox="0 0 24 24">
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33 0-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14ZM7.12 20.45H3.55V9h3.57v11.45ZM22.22 0H1.77C.8 0 0 .78 0 1.74v20.5C0 23.2.8 24 1.77 24h20.45c.98 0 1.78-.8 1.78-1.76V1.74C24 .78 23.2 0 22.22 0Z" />
    </svg>
  );
}

export function LangToggle({ className }: { className: string }) {
  const { lang, setLang } = useLang();
  return (
    <span className={className} data-lang-btn="" aria-label="Language">
      {(["en", "nl"] as const).map((l) => (
        <button
          key={l}
          type="button"
          data-lang={l}
          aria-pressed={lang === l}
          className={lang === l ? "on" : undefined}
          onClick={() => setLang(l)}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </span>
  );
}

const NAV = [
  { href: "#about", n: "01.", k: "nav.about" as const },
  { href: "#projects", n: "02.", k: "nav.projects" as const },
  { href: "#contact", n: "03.", k: "nav.contact" as const },
];

export function Hud() {
  const reduce = !!useReducedMotion();
  const [menuOpen, setMenuOpen] = useState(false);
  const [audioOn, setAudioOn] = useState(false);
  const sndOn = useSfxEnabled();
  const menuRef = useRef<HTMLDivElement>(null);
  const clicks = useRef({ n: 0, t: 0 });
  const audioRaf = useRef(0);

  /* HUD hides on scroll down, returns on scroll up (js/app.js) */
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    let lastY = 0;
    const onScroll = () => {
      const y = window.scrollY;
      setHidden(y > 120 && y > lastY);
      lastY = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* menu open/close side effects */
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    if (menuOpen) {
      sfx.click();
      const first = menuRef.current?.querySelector<HTMLElement>(".m-link");
      const id = setTimeout(() => first?.focus(), 60);
      const onKey = (e: KeyboardEvent) => {
        if (e.key === "Escape") setMenuOpen(false);
      };
      document.addEventListener("keydown", onKey);
      return () => {
        clearTimeout(id);
        document.removeEventListener("keydown", onKey);
      };
    }
  }, [menuOpen]);

  /* ambient audio hook: no track wired — demo pulse drives the ripple */
  const toggleAudio = () => {
    if (audioOn) {
      setAudioOn(false);
      cancelAnimationFrame(audioRaf.current);
      ripple.setAudioLevel(0);
      return;
    }
    setAudioOn(true);
    let t = 0;
    const sim = () => {
      t += 0.05;
      const lvl = (Math.sin(t) * 0.5 + 0.5) * 0.4 + Math.random() * 0.05;
      ripple.setAudioLevel(lvl);
      audioRaf.current = requestAnimationFrame(sim);
    };
    audioRaf.current = requestAnimationFrame(sim);
  };

  /* logo glitch: click the monogram 3x quickly (js/shell.js) */
  const onBrand = () => {
    const now = Date.now();
    clicks.current.n = now - clicks.current.t < 600 ? clicks.current.n + 1 : 1;
    clicks.current.t = now;
    if (clicks.current.n >= 3) {
      clicks.current.n = 0;
      const app = document.getElementById("app");
      if (app && !reduce) {
        app.style.transition = "filter .08s steps(2)";
        app.style.filter =
          "hue-rotate(40deg) drop-shadow(2px 0 0 rgba(255,40,80,.5)) drop-shadow(-2px 0 0 rgba(40,200,255,.5))";
        setTimeout(() => {
          app.style.filter = "";
        }, 160);
      }
      sfx.zap(true);
      toast("<b>signal glitch</b>. you found the seam.", 2400);
    }
  };

  return (
    <>
      <header className="hud" id="hud" style={{ transform: hidden ? "translateY(-130%)" : "translateY(0)" }}>
        <div className="hud-inner">
          <div className="hud-bar">
            <a href="#hero" className="brand" aria-label="Home" onClick={onBrand}>
              <span className="brand-mark" aria-hidden="true">
                <svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
                  <g fill="none" stroke="currentColor" strokeWidth="13" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M 95.23 45.78 A 38 38 0 1 0 95.23 74.22" />
                    <path d="M 60 60 L 82 60" />
                  </g>
                </svg>
              </span>
              <span className="sig">
                AWES&nbsp;ZORETIĆ
                <br />
                <b>{"// full-stack → cybersecurity & cloud"}</b>
              </span>
            </a>
            <nav className="hud-nav" aria-label="Primary">
              {NAV.map((item) => (
                <a key={item.href} href={item.href}>
                  <span className="n">{item.n}</span>
                  <T k={item.k} />
                </a>
              ))}
              <a href="/files/awes_resume_updated.pdf" download>
                <span className="n">04.</span>
                <T k="nav.resume" />
              </a>
            </nav>
            <span className="hud-sep" />
            <div className="hud-soc">
              <LangToggle className="hud-lang" />
              <a className="hud-ic" href="https://github.com/Awes2000" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                <GithubIcon />
              </a>
              <a
                className="hud-ic"
                href="https://www.linkedin.com/in/gabri%C3%ABl-awes-z-8105b5193/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
              >
                <LinkedinIcon />
              </a>
              <button
                className={`hud-ic hud-audio${audioOn ? " live" : ""}`}
                id="audio-btn"
                aria-label="Toggle ambient audio"
                title={audioOn ? "Ambient audio (demo pulse)" : "Ambient audio (off)"}
                onClick={toggleAudio}
              >
                <svg id="audio-icon" viewBox="0 0 24 24">
                  <path d="M4 9v6h4l5 5V4L8 9H4Z" />
                  <path d="M16.5 12a3.5 3.5 0 0 0-1.8-3.06v6.12A3.5 3.5 0 0 0 16.5 12Z" opacity=".0" id="wave1" />
                </svg>
              </button>
            </div>
            <button
              className="hud-ic hud-toggle"
              id="hud-toggle"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              aria-controls="m-menu"
              onClick={() => setMenuOpen((o) => !o)}
            >
              <svg className="ic-open" viewBox="0 0 24 24">
                <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
              </svg>
              <svg className="ic-close" viewBox="0 0 24 24">
                <path d="M5 5l14 14M19 5L5 19" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <div
        id="m-menu"
        className={`m-menu${menuOpen ? " open" : ""}`}
        aria-hidden={!menuOpen}
        ref={menuRef}
        onClick={(e) => {
          if (e.target === e.currentTarget) setMenuOpen(false);
        }}
      >
        <nav className="m-menu-panel" role="dialog" aria-modal="true" aria-label="Navigation menu">
          <div className="m-menu-top">
            <span className="m-menu-cmd">guest@gabriel-os:~$ ls /nav</span>
          </div>
          {NAV.map((item) => (
            <a key={item.href} href={item.href} className="m-link" onClick={() => setMenuOpen(false)}>
              <span className="n">{item.n}</span> <T k={item.k} />
            </a>
          ))}
          <a href="/files/awes_resume_updated.pdf" download className="m-link" onClick={() => setMenuOpen(false)}>
            <span className="n">04.</span> <T k="nav.resume" /> <span className="m-link-tag">.pdf</span>
          </a>
          <div className="m-menu-foot">
            <a className="m-soc" href="https://github.com/Awes2000" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
              <GithubIcon />
              GitHub
            </a>
            <a
              className="m-soc"
              href="https://www.linkedin.com/in/gabri%C3%ABl-awes-z-8105b5193/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
            >
              <LinkedinIcon />
              LinkedIn
            </a>
            <button
              className="m-soc m-snd"
              id="m-snd"
              aria-pressed={sndOn}
              aria-label={`UI sound, ${sndOn ? "on" : "off"}`}
              onClick={() => sfx.toggle()}
            >
              {sndOn ? "◆ sound" : "◇ sound"}
            </button>
            <LangToggle className="m-lang" />
          </div>
        </nav>
      </div>
    </>
  );
}
