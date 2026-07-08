"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { CaseCard } from "@/components/CaseCard";
import { Rise, ScrambleNum, ScrambleTitle, Wipe } from "@/components/motion/InView";
import { CASES, type CaseFile } from "@/lib/cases";

function DetailBody({ c }: { c: CaseFile }) {
  return (
    <>
      <span className="d-id">{c.id}</span>
      <h3>{c.title}</h3>
      <p>{c.detail}</p>
      {c.shots && (
        <div className="detail-shots">
          {c.shots.map((s) => (
            <Image key={s.src} src={s.src} alt={s.alt} width={s.width} height={s.height} sizes="240px" loading="lazy" />
          ))}
        </div>
      )}
      <div className="detail-meta">
        <div><div className="k">Role</div><div className="v">{c.meta.role}</div></div>
        <div><div className="k">Year</div><div className="v">{c.meta.year}</div></div>
        <div><div className="k">Stack</div><div className="v">{c.meta.stack}</div></div>
        <div><div className="k">Status</div><div className="v">{c.meta.status}</div></div>
      </div>
      <div className="detail-actions">
        {c.links.live && (
          <a className="btn-ghost" href={c.links.live} target="_blank" rel="noopener noreferrer">
            Open live ↗
          </a>
        )}
        {c.links.github && (
          <a className="link-mono" href={c.links.github} target="_blank" rel="noopener noreferrer">
            {"</>"} source on GitHub
          </a>
        )}
        {c.links.gallery && (
          <a className="link-mono" href={c.links.gallery} target="_blank" rel="noopener noreferrer">
            ▶ View gallery
          </a>
        )}
      </div>
    </>
  );
}

export function CaseFiles() {
  const reduce = !!useReducedMotion();
  const [active, setActive] = useState<number | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const open = active !== null;

  /* Esc closes; focus moves to the close button on open */
  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActive(null);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <Wipe id="projects">
      <div className="wrap">
        <Rise className="sec-label">
          <ScrambleNum value="02." />
          <ScrambleTitle k="projects.title" />
          <span className="sec-rule" />
        </Rise>

        <div className="case-grid" id="case-grid">
          {CASES.map((c, idx) => (
            <CaseCard key={c.id} c={c} onOpen={() => setActive(idx)} />
          ))}
        </div>
      </div>

      {/* detail overlay — motion/react layout morph replaces the
          static build's View Transitions API usage */}
      <div
        id="detail"
        className={open ? "open" : undefined}
        aria-hidden={!open}
        onClick={(e) => {
          if (e.target === e.currentTarget) setActive(null);
        }}
      >
        <AnimatePresence>
          {open && (
            <motion.div
              className="detail-card"
              role="dialog"
              aria-modal="true"
              aria-label="Case file detail"
              initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.92, y: 24 }}
              animate={reduce ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.95, y: 12 }}
              transition={{ duration: reduce ? 0.12 : 0.32, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="detail-top">
                <span id="d-class">{"// DECLASSIFIED"}</span>
                <button className="detail-close" id="detail-close" ref={closeRef} onClick={() => setActive(null)}>
                  close ✕
                </button>
              </div>
              <div className="detail-body" id="detail-body">
                <DetailBody c={CASES[active]} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Wipe>
  );
}
