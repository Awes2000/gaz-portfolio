"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface TypewriterOptions {
  /** Base delay per character in ms (a random jitter is added, like the static build). */
  delay?: number;
  jitter?: number;
  onDone?: () => void;
}

/**
 * Character-by-character typewriter. `start(text)` begins typing;
 * when reduced motion is requested the text lands instantly.
 */
export function useTypewriter(reduce: boolean, opts: TypewriterOptions = {}): {
  typed: string;
  start: (text: string) => void;
  reset: () => void;
} {
  const { delay = 18, jitter = 26, onDone } = opts;
  const [typed, setTyped] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const doneRef = useRef(onDone);
  doneRef.current = onDone;

  const clear = useCallback(() => {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
  }, []);

  const start = useCallback(
    (text: string) => {
      clear();
      if (reduce) {
        setTyped(text);
        doneRef.current?.();
        return;
      }
      let i = 0;
      const tick = () => {
        if (i <= text.length) {
          setTyped(text.slice(0, i));
          i++;
          timer.current = setTimeout(tick, delay + Math.random() * jitter);
        } else {
          doneRef.current?.();
        }
      };
      tick();
    },
    [clear, delay, jitter, reduce],
  );

  const reset = useCallback(() => {
    clear();
    setTyped("");
  }, [clear]);

  useEffect(() => clear, [clear]);

  return { typed, start, reset };
}
