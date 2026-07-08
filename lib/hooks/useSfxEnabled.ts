"use client";

import { useSyncExternalStore } from "react";
import { sfx } from "@/lib/sfx";

/** Reactive view of the master SFX enabled state (shared across all toggles). */
export function useSfxEnabled(): boolean {
  return useSyncExternalStore(
    (cb) => sfx.subscribe(cb),
    () => sfx.enabled,
    () => false,
  );
}
