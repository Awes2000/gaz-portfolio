/* ============================================================
   Session-scoped language store. The stored session language is
   adopted on the client via useSyncExternalStore (server snapshot
   is always "en", so SSR output is stable and React reconciles
   the stored language right after hydration).
   ============================================================ */

import { type Lang, SESSION_LANG_KEY } from "@/lib/i18n";
import { readSessionValue, writeSessionValue } from "@/lib/hooks/useSessionFlag";

let current: Lang = "en";
let hydrated = false;
const listeners = new Set<() => void>();

function adoptStored(): void {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  const stored = readSessionValue(SESSION_LANG_KEY);
  if (stored === "nl" || stored === "en") current = stored;
}

export const langStore = {
  subscribe(listener: () => void): () => void {
    adoptStored();
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  getSnapshot(): Lang {
    adoptStored();
    return current;
  },
  getServerSnapshot(): Lang {
    return "en";
  },
  set(l: Lang): void {
    if (l !== "en" && l !== "nl") return;
    if (l === current) return;
    current = l;
    writeSessionValue(SESSION_LANG_KEY, l);
    listeners.forEach((fn) => fn());
  },
};
