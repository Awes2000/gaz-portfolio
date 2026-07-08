"use client";

import { useEffect, useState } from "react";

export function amsTime(): string {
  try {
    return new Intl.DateTimeFormat("en-GB", {
      timeZone: "Europe/Amsterdam",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    }).format(new Date());
  } catch {
    return new Date().toLocaleTimeString();
  }
}

/** Amsterdam hour (0-23) for the time-aware gate greeting. */
export function amsHour(): number {
  let h = new Date().getHours();
  try {
    h = parseInt(
      new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Amsterdam", hour: "2-digit", hour12: false }).format(
        new Date(),
      ),
      10,
    );
  } catch {
    /* fall back to local hour */
  }
  return h;
}

/**
 * Live Amsterdam wall clock, ticking every second.
 * Starts as the placeholder so SSR and hydration match.
 */
export function useAmsterdamClock(placeholder = "--:--:--"): string {
  const [time, setTime] = useState(placeholder);
  useEffect(() => {
    const tick = () => setTime(amsTime());
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}
