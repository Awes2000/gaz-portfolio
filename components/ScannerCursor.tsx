"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";

/* ============================================================
   PREMIUM CURSOR — exact dot + spring-trailing ring, ported
   1:1 from js/cursor.js. mix-blend-mode:difference so it
   integrates with anything beneath. Context-aware: link →
   grow + magnetic pull; case file → corner brackets; text →
   caret. Desktop (fine pointer) only.
   ============================================================ */

const LINK =
  "a,button,[role=button],.hud-ic,.sb-term,.sb-sfx,.pal-close,.detail-close,.contact-cta,.btn-ghost,.foot-replay,.case-links a,summary,label";
const CASE = ".case";
const TEXT = "p,h1,h2,h3,h4,h5,h6,li,input,textarea,.hero-type,.case-desc,.about-copy,.detail-body";

export function ScannerCursor() {
  const curRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const fine = matchMedia("(hover:hover) and (pointer:fine)").matches;
    if (!fine) return; // touch/coarse: no custom cursor at all

    const cur = curRef.current, dot = dotRef.current, ring = ringRef.current;
    if (!cur || !dot || !ring) return;

    document.documentElement.classList.add("cursor-custom");

    // target (exact pointer) + spring ring state
    let tx = innerWidth / 2, ty = innerHeight / 2;
    let rx = tx, ry = ty, vx = 0, vy = 0;
    let magX = tx, magY = ty; // magnetic target (may be pulled to an element center)
    let mode = ""; // '', 'link', 'case', 'text'
    let shown = false;
    let rafId = 0;

    const show = () => {
      if (!shown) {
        shown = true;
        cur.classList.remove("hidden");
      }
    };
    const hide = () => {
      shown = false;
      cur.classList.add("hidden");
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType && e.pointerType !== "mouse") return;
      tx = e.clientX;
      ty = e.clientY;
      show();

      const t = e.target as HTMLElement;
      let next = "";
      let pull: { x: number; y: number } | null = null;
      if (t.closest(CASE)) next = "case";
      else if (t.closest(LINK)) {
        next = "link";
        const el = t.closest(LINK) as HTMLElement;
        const r = el.getBoundingClientRect();
        // magnetic: pull the ring toward the element centre (only for compact controls)
        if (r.width < 240 && r.height < 90) pull = { x: r.left + r.width / 2, y: r.top + r.height / 2 };
      } else if (t.closest(TEXT)) next = "text";

      magX = pull ? pull.x : tx;
      magY = pull ? pull.y : ty;

      if (next !== mode) {
        mode = next;
        cur.classList.toggle("is-link", mode === "link");
        cur.classList.toggle("is-case", mode === "case");
        cur.classList.toggle("is-text", mode === "text");
      }
    };
    const onDown = () => cur.classList.add("down");
    const onUp = () => cur.classList.remove("down");

    document.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("pointerup", onUp);
    document.addEventListener("mouseleave", hide);
    document.addEventListener("mouseenter", show);
    window.addEventListener("blur", hide);

    if (reduce) {
      // no spring — ring snaps to pointer, still context-aware
      const frame = () => {
        dot.style.transform = `translate(${tx}px,${ty}px)`;
        ring.style.transform = `translate(${tx}px,${ty}px)`;
        rafId = requestAnimationFrame(frame);
      };
      rafId = requestAnimationFrame(frame);
    } else {
      // spring physics: ring trails the (possibly magnetic) target with weight
      const STIFF = 0.18, DAMP = 0.72;
      let last = performance.now(), acc = 0;
      const FRAME = 1000 / 60;
      const frame = (now: number) => {
        const elapsed = now - last;
        last = now;
        acc += elapsed;
        if (acc >= FRAME) {
          acc = 0;
          const targX = mode === "link" ? rx + (magX - rx) * 0.55 : tx;
          const targY = mode === "link" ? ry + (magY - ry) * 0.55 : ty;
          const ax = (targX - rx) * STIFF - vx * (1 - DAMP);
          const ay = (targY - ry) * STIFF - vy * (1 - DAMP);
          vx = (vx + ax) * DAMP;
          vy = (vy + ay) * DAMP;
          rx += vx;
          ry += vy;
        }
        dot.style.transform = `translate(${tx}px,${ty}px)`;
        ring.style.transform = `translate(${rx}px,${ry}px)`;
        rafId = requestAnimationFrame(frame);
      };
      rafId = requestAnimationFrame(frame);
    }

    return () => {
      cancelAnimationFrame(rafId);
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("pointerup", onUp);
      document.removeEventListener("mouseleave", hide);
      document.removeEventListener("mouseenter", show);
      window.removeEventListener("blur", hide);
      document.documentElement.classList.remove("cursor-custom");
    };
  }, [reduce]);

  return (
    <div className="cur hidden" id="cur" ref={curRef} aria-hidden="true">
      <div className="cur-ring" id="cur-ring" ref={ringRef} />
      <div className="cur-dot" id="cur-dot" ref={dotRef} />
    </div>
  );
}
