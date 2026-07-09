"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";
import { ACCESS_EVENT, bindRipple } from "@/lib/bus";

/* ============================================================
   SONAR SWEEP BACKGROUND — a single slow radar line rotating
   from a centre point, leaving a decaying afterglow trail.
   Monochrome mint at very low opacity, near-invisible at rest.
   It drifts toward the cursor and briefly speeds up with scroll
   velocity; the gate unlock triggers a lock-on flare. Cheap 2D
   canvas, capped frame rate, low-res backing store. Reduced
   motion / no-canvas: a still radial glow behind grain + vignette
   (no sweep, no rings, no dots).
   ============================================================ */

const TWO_PI = Math.PI * 2;

export function SonarCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (reduce || !canvas) {
      document.documentElement.classList.add("rm-static");
      return;
    }

    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) {
      document.documentElement.classList.add("rm-static");
      return;
    }

    const lowPower = !!navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4;
    const SCALE = lowPower ? 0.5 : 0.7;
    const FRAME = 1000 / (lowPower ? 30 : 40);

    let W = 0;
    let H = 0;
    let cx = 0;
    let cy = 0; // sweep centre (backing-store px)
    let tcx = 0;
    let tcy = 0; // target centre (drifts toward cursor)
    const resize = () => {
      W = Math.max(2, Math.floor(innerWidth * SCALE));
      H = Math.max(2, Math.floor(innerHeight * SCALE));
      canvas.width = W;
      canvas.height = H;
      cx = tcx = W / 2;
      cy = tcy = H * 0.46;
      ctx.fillStyle = "#0a192f";
      ctx.fillRect(0, 0, W, H); // opaque base so the fade-trail reads
    };
    resize();
    addEventListener("resize", resize);

    /* pointer: the sweep centre eases a little toward the cursor,
       and a faint glow marks it. Mouse only (touch keeps it centred). */
    let hasPointer = false;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType && e.pointerType !== "mouse") return;
      hasPointer = true;
      const nx = e.clientX / innerWidth - 0.5;
      const ny = e.clientY / innerHeight - 0.5;
      tcx = W / 2 + nx * W * 0.22;
      tcy = H * 0.46 + ny * H * 0.22;
      // parallax hook for the grain layer, one plane deeper
      const root = document.documentElement;
      root.style.setProperty("--bg-gx", (nx * -12).toFixed(1) + "px");
      root.style.setProperty("--bg-gy", (ny * -12).toFixed(1) + "px");
    };
    addEventListener("pointermove", onMove, { passive: true });

    /* scroll velocity briefly speeds and brightens the sweep */
    let scrollBoost = 0;
    let lastScroll = scrollY;
    const onScroll = () => {
      const v = Math.min(1, Math.abs(scrollY - lastScroll) / 120);
      lastScroll = scrollY;
      scrollBoost = Math.min(1, scrollBoost + v * 0.6);
    };
    addEventListener("scroll", onScroll, { passive: true });

    /* external intensity (hero scroll beat) + gate-unlock lock-on flare */
    let audio = 0;
    let flare = 0;
    const unbind = bindRipple({
      setAudioLevel(v) {
        audio = Math.max(0, Math.min(1, v));
      },
      burst() {
        flare = 1;
      },
    });
    const onAccess = () => {
      flare = 1;
    };
    window.addEventListener(ACCESS_EVENT, onAccess);

    let angle = -Math.PI / 2; // start sweeping from the top
    const OMEGA = TWO_PI / 13; // one revolution ~13s
    let last = performance.now();
    let acc = 0;
    let rafId = 0;

    const draw = (now: number) => {
      const dt = now - last;
      last = now;
      acc += dt;
      if (acc < FRAME) {
        rafId = requestAnimationFrame(draw);
        return;
      }
      const step = acc / 1000;
      acc = 0;

      scrollBoost *= 0.9;
      flare *= 0.955;
      cx += (tcx - cx) * 0.06;
      cy += (tcy - cy) * 0.06;

      const intensity = Math.min(1, 0.55 + audio * 0.5 + scrollBoost * 0.7 + flare);
      angle = (angle + OMEGA * step * (1 + scrollBoost * 1.4 + flare * 0.8)) % TWO_PI;

      // decay the previous frame toward navy: this is the sweep trail
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = "rgba(10,25,47,0.05)";
      ctx.fillRect(0, 0, W, H);

      const R = Math.hypot(W, H);
      ctx.globalCompositeOperation = "lighter";

      // the sweep beam: a thin wedge with a gradient fading to the rim
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(angle);
      const beam = 0.12 + intensity * 0.1; // peak alpha, still faint
      const g = ctx.createLinearGradient(0, 0, R, 0);
      g.addColorStop(0, `rgba(100,255,218,${(beam * 0.5).toFixed(3)})`);
      g.addColorStop(0.55, `rgba(100,255,218,${beam.toFixed(3)})`);
      g.addColorStop(1, "rgba(100,255,218,0)");
      ctx.fillStyle = g;
      const half = 0.02;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, R, -half, half);
      ctx.closePath();
      ctx.fill();
      // a brighter leading edge line for the "just swept" glint
      const lg = ctx.createLinearGradient(0, 0, R, 0);
      lg.addColorStop(0, `rgba(180,255,238,${(beam * 0.5).toFixed(3)})`);
      lg.addColorStop(1, "rgba(100,255,218,0)");
      ctx.strokeStyle = lg;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(R, 0);
      ctx.stroke();
      ctx.restore();

      // faint glow marking the cursor-driven centre
      if (hasPointer) {
        const cg = ctx.createRadialGradient(cx, cy, 0, cx, cy, R * 0.18);
        cg.addColorStop(0, "rgba(100,255,218,0.05)");
        cg.addColorStop(1, "rgba(100,255,218,0)");
        ctx.fillStyle = cg;
        ctx.fillRect(0, 0, W, H);
      }

      rafId = requestAnimationFrame(draw);
    };
    rafId = requestAnimationFrame(draw);

    const onVis = () => {
      if (!document.hidden) last = performance.now();
    };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      cancelAnimationFrame(rafId);
      removeEventListener("resize", resize);
      removeEventListener("pointermove", onMove);
      removeEventListener("scroll", onScroll);
      window.removeEventListener(ACCESS_EVENT, onAccess);
      document.removeEventListener("visibilitychange", onVis);
      unbind();
    };
  }, [reduce]);

  /* the canvas plus the still depth layers above it: a luminance
     scrim, a vignette, and film grain */
  return (
    <>
      <canvas id="sonar" ref={canvasRef} aria-hidden="true" />
      <div className="bg-scrim" aria-hidden="true" />
      <div className="bg-vignette" aria-hidden="true" />
      <div className="bg-grain" aria-hidden="true" />
    </>
  );
}
