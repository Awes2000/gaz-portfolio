"use client";

import { useRef } from "react";
import { useReducedMotion } from "motion/react";
import type { CaseVideo } from "@/lib/cases";

/**
 * Hover-play project capture: muted, looped, playsInline, preload=none.
 * Plays on pointer-enter / keyboard focus, pauses on leave. Touch and
 * reduced-motion visitors get the static poster (zero surprise motion).
 * Locked aspect ratio via intrinsic width/height (zero CLS).
 */
export function HoverVideo({ video, className }: { video: CaseVideo; className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const reduce = !!useReducedMotion();

  const play = () => {
    /* fine-pointer only, and never under reduced motion */
    if (reduce || !matchMedia("(hover:hover) and (pointer:fine)").matches) return;
    void ref.current?.play().catch(() => {});
  };
  const pause = () => {
    ref.current?.pause();
  };

  return (
    <video
      ref={ref}
      className={className}
      muted
      loop
      playsInline
      preload="none"
      poster={video.poster}
      width={video.width}
      height={video.height}
      aria-label={video.label}
      onPointerEnter={play}
      onPointerLeave={pause}
      onFocus={play}
      onBlur={pause}
      tabIndex={-1}
    >
      <source src={video.src} type="video/mp4" />
    </video>
  );
}
