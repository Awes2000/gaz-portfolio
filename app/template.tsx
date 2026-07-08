"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";

/* Remounts on every route change: a brief in-concept "decrypting
   next file" curtain, content settling blur→sharp. The very first
   load renders statically (zero LCP cost); reduced motion gets an
   opacity-only fade. */
let hasNavigated = false;

export default function Template({ children }: { children: React.ReactNode }) {
  const reduce = !!useReducedMotion();
  /* captured once at mount: false on the very first page load,
     true for every subsequent client navigation */
  const [animate] = useState(() => hasNavigated);
  const [curtain, setCurtain] = useState(animate);

  useEffect(() => {
    hasNavigated = true;
    if (!curtain) return;
    const id = setTimeout(() => setCurtain(false), reduce ? 120 : 460);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!animate) return <>{children}</>;

  return (
    <>
      <motion.div
        initial={reduce ? { opacity: 0 } : { opacity: 0, filter: "blur(9px)" }}
        animate={reduce ? { opacity: 1 } : { opacity: 1, filter: "blur(0px)" }}
        transition={{ duration: reduce ? 0.15 : 0.42, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
      {curtain && (
        <motion.div
          className="route-curtain"
          aria-hidden="true"
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: reduce ? 0.12 : 0.4, ease: "easeOut", delay: reduce ? 0 : 0.06 }}
        >
          <span className="route-curtain-line">&gt; re-authenticating... decrypting next file</span>
        </motion.div>
      )}
    </>
  );
}
