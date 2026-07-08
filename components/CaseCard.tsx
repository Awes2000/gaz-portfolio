"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { useInView, useReducedMotion } from "motion/react";
import { FolderIcon, GithubIcon, LinkIcon, PlayIcon } from "@/components/caseIcons";
import { HoverVideo } from "@/components/HoverVideo";
import { T } from "@/components/T";
import type { CaseFile } from "@/lib/cases";

interface CaseCardProps {
  c: CaseFile;
  onOpen: () => void;
}

function CaseLinks({ c }: { c: CaseFile }) {
  return (
    <div className="case-links">
      {c.links.github && (
        <a href={c.links.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub repo" data-stop>
          <GithubIcon />
        </a>
      )}
      {c.links.live && (
        <a href={c.links.live} target="_blank" rel="noopener noreferrer" aria-label="Live demo" data-stop>
          <LinkIcon />
        </a>
      )}
      {c.links.gallery && (
        <a href={c.links.gallery} target="_blank" rel="noopener noreferrer" aria-label="Gallery" data-stop>
          <PlayIcon />
        </a>
      )}
    </div>
  );
}

export function CaseCard({ c, onOpen }: CaseCardProps) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref as React.RefObject<Element>, { once: true, amount: 0.18 });
  const reduce = !!useReducedMotion();
  const [unlocked, setUnlocked] = useState(false);
  const [unlocking, setUnlocking] = useState(false);

  const unlock = () => {
    if (unlocked) return;
    setUnlocked(true);
    if (!reduce) {
      setUnlocking(true);
      setTimeout(() => setUnlocking(false), 650);
    }
  };

  const open = (e: React.MouseEvent | React.KeyboardEvent) => {
    if ((e.target as HTMLElement).closest("[data-stop]")) return; // let real links work
    unlock();
    onOpen();
  };

  const cls = [
    "case",
    "rise",
    c.feature ? "feature" : "",
    inView ? "in" : "",
    unlocked ? "unlocked" : "",
    unlocking ? "unlocking" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <article
      ref={ref}
      className={cls}
      tabIndex={0}
      onPointerEnter={unlock}
      onFocus={unlock}
      onClick={open}
      onKeyDown={(e) => {
        if (e.key === "Enter") open(e);
      }}
    >
      <div className="scan-sweep" />
      <span className="case-stamp">{c.cls}</span>
      <div>
        <div className="case-head">
          <span className="case-folder">
            <FolderIcon />
          </span>
          <CaseLinks c={c} />
        </div>
        <div className="case-body">
          <span className="case-id">{c.id}</span>
          <h3 className="case-title">{c.title}</h3>
          <p className="case-desc">{c.desc}</p>
          <ul className="case-tech">
            {c.tech.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
          {/* real deep link — crawlable path to the full dossier;
              clicking the card body still opens the quick-view morph */}
          <Link href={`/work/${c.slug}`} data-stop aria-label={`Open full case file: ${c.title}`}>
            <T k="case.cta" className="case-cta" />
          </Link>
        </div>
      </div>
      {c.feature && (
        <div className="case-media">
          <div className="ph">
            <div className="cm-bar">
              <span className="dots">
                <i />
                <i />
                <i />
              </span>
              <span className="url">{c.mediaUrl || c.media || "preview"}</span>
            </div>
            <div className={`cm-stage${c.shots || c.video ? " has-shots" : ""}`}>
              {c.video ? (
                <>
                  <HoverVideo video={c.video} className="cm-video" />
                  <span className="cm-scan" />
                  <span className="cm-cap">
                    FIELD MEDIA <b>· live capture</b>
                  </span>
                </>
              ) : c.shots ? (
                <>
                  <div className="cm-shots">
                    {c.shots.map((s, si) => (
                      <Image
                        key={s.src}
                        src={s.src}
                        alt={s.alt}
                        width={s.width}
                        height={s.height}
                        sizes="150px"
                        className={`cm-shot cm-shot-${si}`}
                      />
                    ))}
                  </div>
                  <span className="cm-scan" />
                  <span className="cm-cap">
                    FIELD MEDIA <b>· live capture</b>
                  </span>
                </>
              ) : (
                <>
                  <span className="cm-scan" />
                  <span className="cm-cap">
                    PREVIEW <b>decrypting…</b>
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </article>
  );
}
