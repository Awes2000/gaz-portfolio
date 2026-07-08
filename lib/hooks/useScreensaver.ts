"use client";

import { useEffect, type RefObject } from "react";
import { ACCESS_EVENT } from "@/lib/bus";

const IDLE_MS = 20000;
const ACTIVITY = ["pointermove", "pointerdown", "keydown", "scroll", "wheel", "touchstart"] as const;

interface Star {
  x: number;
  y: number;
  z: number;
  s: number;
}

/**
 * Idle terminal screensaver (starfield drift), ported 1:1 from
 * js/shell.js. Arms 20s after the last activity, never while the
 * gate is locked or the palette is open, never under reduced motion.
 */
export function useScreensaver(saverRef: RefObject<HTMLCanvasElement | null>, reduce: boolean): void {
  useEffect(() => {
    const saver = saverRef.current;
    if (!saver) return;
    let idleTimer: ReturnType<typeof setTimeout>;
    let saverOn = false;
    let saverRAF = 0;
    let stars: Star[] = [];

    const startSaver = () => {
      const html = document.documentElement;
      if (saverOn || reduce || html.classList.contains("pal-open") || html.classList.contains("locked")) return;
      saverOn = true;
      saver.classList.add("on");
      const ctx = saver.getContext("2d");
      if (!ctx) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      saver.width = innerWidth * dpr;
      saver.height = innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      stars = Array.from({ length: 120 }, () => ({
        x: Math.random() * innerWidth,
        y: Math.random() * innerHeight,
        z: Math.random() * 1 + 0.2,
        s: Math.random() * 1.4 + 0.3,
      }));
      const cx = innerWidth / 2;
      const cy = innerHeight / 2;
      const loop = () => {
        if (!saverOn) return;
        ctx.fillStyle = "rgba(4,8,16,0.35)";
        ctx.fillRect(0, 0, innerWidth, innerHeight);
        stars.forEach((st) => {
          st.x += (st.x - cx) * 0.004 * st.z;
          st.y += (st.y - cy) * 0.004 * st.z;
          st.z += 0.003;
          if (st.x < -20 || st.x > innerWidth + 20 || st.y < -20 || st.y > innerHeight + 20) {
            st.x = Math.random() * innerWidth;
            st.y = Math.random() * innerHeight;
            st.z = Math.random() * 0.4 + 0.2;
          }
          ctx.beginPath();
          ctx.arc(st.x, st.y, st.s * st.z, 0, 6.28);
          ctx.fillStyle = "rgba(100,255,218," + Math.min(0.8, st.z * 0.6) + ")";
          ctx.fill();
        });
        ctx.font = '12px "Roboto Mono",monospace';
        ctx.fillStyle = "rgba(143,166,200,.5)";
        ctx.fillText("// signal idle. move to resume", 24, innerHeight - 28);
        saverRAF = requestAnimationFrame(loop);
      };
      loop();
    };

    const stopSaver = () => {
      if (!saverOn) return;
      saverOn = false;
      saver.classList.remove("on");
      cancelAnimationFrame(saverRAF);
    };

    const resetIdle = () => {
      stopSaver();
      clearTimeout(idleTimer);
      if (!reduce) idleTimer = setTimeout(startSaver, IDLE_MS);
    };

    ACTIVITY.forEach((ev) => window.addEventListener(ev, resetIdle, { passive: true }));
    window.addEventListener(ACCESS_EVENT, resetIdle); // only start arming once unlocked
    resetIdle();

    return () => {
      stopSaver();
      clearTimeout(idleTimer);
      ACTIVITY.forEach((ev) => window.removeEventListener(ev, resetIdle));
      window.removeEventListener(ACCESS_EVENT, resetIdle);
    };
  }, [saverRef, reduce]);
}
