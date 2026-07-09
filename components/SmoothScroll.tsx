"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/* Lenis smooth scroll. It drives the real scroll position (not a
   transform), so the hero beat, the sonar's scroll reactivity and every
   IntersectionObserver reveal keep working unchanged. Disabled under
   reduced motion and on touch, where native scrolling is better and
   expected. In-page anchor links are routed through Lenis with an offset
   for the fixed HUD. */
export function SmoothScroll() {
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (matchMedia("(hover: none), (pointer: coarse)").matches) return;

    const lenis = new Lenis({
      duration: 1.05,
      // easeOutExpo — matches the site's --ease feel (settles, no bounce)
      easing: (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    let rafId = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(loop);
    };
    rafId = requestAnimationFrame(loop);

    const onAnchorClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey) return;
      const a = (e.target as HTMLElement).closest?.('a[href^="#"]') as HTMLAnchorElement | null;
      if (!a) return;
      const hash = a.getAttribute("href");
      if (!hash || hash.length < 2) return;
      const target = document.querySelector(hash);
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target as HTMLElement, { offset: -96 });
    };
    document.addEventListener("click", onAnchorClick);

    return () => {
      cancelAnimationFrame(rafId);
      document.removeEventListener("click", onAnchorClick);
      lenis.destroy();
    };
  }, []);

  return null;
}
