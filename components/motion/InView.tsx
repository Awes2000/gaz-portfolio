"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "motion/react";
import { useLang } from "@/components/LangProvider";
import type { I18nKey } from "@/lib/i18n";

/* ============================================================
   Scroll-reveal system, rebuilt on motion/react's viewport
   engine (useInView). The ported CSS from Portfolio.html stays
   the single source of truth for the actual transitions — these
   components only decide WHEN the state classes are applied,
   exactly like the IntersectionObservers in js/app.js did.
   ============================================================ */

interface RiseProps {
  as?: "div" | "aside" | "h2" | "p";
  className?: string;
  /** Stagger order within the section: delay = min(i * 70, 420)ms. */
  index?: number;
  amount?: number;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

/** `.rise` → `.in` when scrolled into view (threshold 0.18, once). */
export function Rise({ as = "div", className = "", index, amount = 0.18, children, style }: RiseProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref as React.RefObject<Element>, { once: true, amount });
  const reduce = useReducedMotion();
  const delay = !reduce && index !== undefined ? Math.min(index * 70, 420) : undefined;
  const props = {
    ref,
    className: `${className} rise${inView ? " in" : ""}`.trim(),
    style: delay !== undefined ? { ...style, transitionDelay: `${delay}ms` } : style,
  };
  const Tag = as;
  return <Tag {...(props as React.HTMLAttributes<HTMLDivElement> & { ref: React.RefObject<HTMLDivElement | null> })}>{children}</Tag>;
}

/** `.wipe` sections → `.played` at 12% visibility (diagonal wipe). */
export function Wipe({ id, className = "", children }: { id: string; className?: string; children: React.ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref as React.RefObject<Element>, { once: true, amount: 0.12 });
  const reduce = useReducedMotion();
  const played = reduce || inView;
  return (
    <section id={id} ref={ref} className={`${className} wipe${played ? " played" : ""}`.trim()}>
      {children}
    </section>
  );
}

/** Section number scramble/count-in (data-scramble in the static build). */
export function ScrambleNum({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref as React.RefObject<Element>, { once: true, amount: 0.6 });
  const reduce = useReducedMotion();
  const [text, setText] = useState(value);

  useEffect(() => {
    if (!inView || reduce) return;
    let f = 0;
    const id = setInterval(() => {
      f++;
      setText(f < 8 ? Math.floor(Math.random() * 90) + 10 + "." : value);
      if (f >= 8) clearInterval(id);
    }, 55);
    return () => clearInterval(id);
  }, [inView, reduce, value]);

  return (
    <span className="sec-num" ref={ref}>
      {text}
    </span>
  );
}

/* heading scramble glyphs, same set as js/shell.js */
const GLYPH = "#$%&/<>[]{}=+*01";

/** Section title (real h2 for heading order): i18n text + underline draw + decrypt-scramble on enter. */
export function ScrambleTitle({ k, underline = true }: { k: I18nKey; underline?: boolean }) {
  const { t } = useLang();
  const ref = useRef<HTMLHeadingElement>(null);
  const inView = useInView(ref as React.RefObject<Element>, { once: true, amount: 0.6 });
  const reduce = useReducedMotion();
  const scrambled = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!inView || reduce || scrambled.current || !el) return;
    scrambled.current = true;
    const final = el.textContent ?? "";
    let f = 0;
    const steps = 11;
    const id = setInterval(() => {
      f++;
      let out = "";
      for (let i = 0; i < final.length; i++) {
        if (final[i] === " ") {
          out += " ";
          continue;
        }
        out += i < (f / steps) * final.length ? final[i] : GLYPH[(Math.random() * GLYPH.length) | 0];
      }
      el.textContent = out;
      if (f >= steps) {
        clearInterval(id);
        el.textContent = final;
      }
    }, 32);
    return () => clearInterval(id);
  }, [inView, reduce]);

  return (
    <h2
      ref={ref}
      className={`sec-title${underline ? ` underline-draw${inView ? " in" : ""}` : ""}`}
      dangerouslySetInnerHTML={{ __html: t(k) }}
    />
  );
}
