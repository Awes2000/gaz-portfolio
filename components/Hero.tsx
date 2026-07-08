"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useLang } from "@/components/LangProvider";
import { ProofStrip } from "@/components/ProofStrip";
import { T } from "@/components/T";
import { ACCESS_EVENT, ripple } from "@/lib/bus";
import { useAmsterdamClock } from "@/lib/hooks/useAmsterdamClock";
import { useTypewriter } from "@/lib/hooks/useTypewriter";

const HERO_NAME = "Gabriël Awes Zoretić.";
const CMDS = ["whoami", "cat focus.txt", "ls ~/skills", "status --now", "./ship.sh"];

/* looping typed command in the hero card footer */
function useCardCommand(reduce: boolean): string {
  const [cmd, setCmd] = useState("");
  useEffect(() => {
    if (reduce) return;
    let timer: ReturnType<typeof setTimeout>;
    let ci = 0;
    const typeCmd = () => {
      const word = CMDS[ci % CMDS.length];
      ci++;
      let i = 0;
      const type = () => {
        if (i <= word.length) {
          setCmd(word.slice(0, i));
          i++;
          timer = setTimeout(type, 70 + Math.random() * 60);
        } else timer = setTimeout(erase, 1700);
      };
      const erase = () => {
        let j = word.length;
        const del = () => {
          if (j >= 0) {
            setCmd(word.slice(0, j));
            j--;
            timer = setTimeout(del, 38);
          } else timer = setTimeout(typeCmd, 420);
        };
        del();
      };
      type();
    };
    timer = setTimeout(typeCmd, 1400);
    return () => clearTimeout(timer);
  }, [reduce]);
  return reduce ? "whoami" : cmd;
}

export function Hero() {
  const reduce = !!useReducedMotion();
  const { t, lang } = useLang();
  const [introd, setIntrod] = useState(false);
  const time = useAmsterdamClock();
  const cardCmd = useCardCommand(reduce);
  const { typed, start } = useTypewriter(reduce);
  const wrapRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  /* ONE scroll-driven beat: while the pinned hero scrolls out, the
     shader swells then settles and the hero eases back. Desktop +
     motion-ok only; the rest of the page scrolls normally. */
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const beatOpacity = useTransform(scrollYProgress, [0, 0.72, 1], [1, 1, 0.3]);
  const beatScale = useTransform(scrollYProgress, [0, 1], [1, 0.965]);
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (reduce || v <= 0 || v >= 1) return;
    ripple.setAudioLevel(Math.sin(v * Math.PI) * 0.55);
  });

  /* intro on gate unlock (aws:access) + 9s safety fallback */
  useEffect(() => {
    const intro = () => setIntrod(true);
    window.addEventListener(ACCESS_EVENT, intro);
    const safety = setTimeout(intro, 9000);
    return () => {
      window.removeEventListener(ACCESS_EVENT, intro);
      clearTimeout(safety);
    };
  }, []);

  /* typewriter starts after intro; re-types when the language changes */
  useEffect(() => {
    if (!introd) return;
    const id = setTimeout(() => start(t("hero.type")), reduce ? 0 : 520);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [introd, lang]);

  /* pointer-parallax tilt + scroll parallax on the floating card */
  useEffect(() => {
    const wrap = wrapRef.current;
    const card = cardRef.current;
    if (!wrap || !card || reduce || !matchMedia("(hover:hover) and (pointer:fine)").matches) return;
    let raf: number | null = null;
    const move = (e: PointerEvent) => {
      const r = wrap.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      if (raf) return;
      raf = requestAnimationFrame(() => {
        card.style.transform = `rotateY(${px * 7}deg) rotateX(${-py * 7}deg) translateZ(0)`;
        raf = null;
      });
    };
    const leave = () => {
      card.style.transform = "";
    };
    let praf: number | null = null;
    const scroll = () => {
      if (praf) return;
      praf = requestAnimationFrame(() => {
        const y = window.scrollY;
        if (y < window.innerHeight) wrap.style.translate = "0 " + (y * -0.06).toFixed(1) + "px";
        praf = null;
      });
    };
    wrap.addEventListener("pointermove", move);
    wrap.addEventListener("pointerleave", leave);
    window.addEventListener("scroll", scroll, { passive: true });
    return () => {
      wrap.removeEventListener("pointermove", move);
      wrap.removeEventListener("pointerleave", leave);
      window.removeEventListener("scroll", scroll);
    };
  }, [reduce]);

  const riseDelay = (i: number) => (introd && !reduce ? { transitionDelay: `${120 + i * 110}ms` } : undefined);
  const riseClass = (base: string) => `${base} rise${introd ? " in" : ""}`;

  return (
    <section id="hero" ref={sectionRef}>
      <motion.div className="hero-sticky" style={reduce ? undefined : { opacity: beatOpacity, scale: beatScale }}>
        <div className="wrap hero-grid">
        <div className="hero-main">
          <div className={riseClass("hero-kicker")} style={riseDelay(0)}>
            <T k="hero.kicker" />
          </div>
          <h1 className={`hero-name reveal-words${introd ? " in" : ""}`} data-text={HERO_NAME}>
            {HERO_NAME.split(" ").map((w, i, arr) => (
              <span key={i}>
                <span className="w">
                  <span>{w}</span>
                </span>
                {i < arr.length - 1 ? " " : null}
              </span>
            ))}
          </h1>
          <p className="hero-type" id="hero-type">
            <span className="txt">{typed}</span>
            {!reduce && <span className="car" />}
          </p>
          <div className={riseClass("hero-cta-row")} style={riseDelay(1)}>
            <a className="link-mono" href="https://github.com/Awes2000" target="_blank" rel="noopener noreferrer">
              <T k="hero.viewgh" />
            </a>
          </div>
          <div className={riseClass("")} style={riseDelay(2)}>
            <ProofStrip />
          </div>
        </div>

        <aside className={riseClass("hero-card-wrap")} style={riseDelay(2)} id="hero-card-wrap" ref={wrapRef}>
          <div className="hero-card" id="hero-card" ref={cardRef}>
            <div className="hc-top">
              <span className="hc-dot" />
              <span className="hc-title">whoami.sh</span>
              <span className="hc-live">
                <i />
                LIVE
              </span>
            </div>
            <div className="hc-body">
              <div className="hc-portrait">
                <Image src="/headshot.jpg" alt="Gabriël Awes Zoretić" width={1365} height={2048} sizes="140px" priority />
                <span className="hc-scan" />
                <span className="hc-pframe" />
              </div>
              <div className="hc-rows">
                <div className="hc-row"><span className="k">user</span><span className="v">gabriël_awes_zoretić</span></div>
                <div className="hc-row"><span className="k">role</span><T k="hc.role" as="span" className="v mint" /></div>
                <div className="hc-row"><span className="k">loc</span><span className="v">Amsterdam, NL</span></div>
                <div className="hc-row"><span className="k">time</span><span className="v mint" id="hc-time">{time}</span></div>
                <div className="hc-row"><span className="k">focus</span><T k="hc.focus" as="span" className="v" /></div>
                <div className="hc-row">
                  <span className="k">status</span>
                  <span className="v"><T k="hc.status" as="span" className="hc-badge" /></span>
                </div>
              </div>
            </div>
            <div className="hc-foot">
              <span className="hc-prompt">
                guest@gabriel-os:~$ <span id="hc-cmd">{cardCmd}</span>
                <span className="hc-caret">█</span>
              </span>
            </div>
          </div>
        </aside>
      </div>

        <a href="#about" className="scroll-cue" id="scroll-cue" aria-label="Scroll to about">
          <span>scroll</span>
          <span className="sc-arrow">▾</span>
        </a>
      </motion.div>
    </section>
  );
}
