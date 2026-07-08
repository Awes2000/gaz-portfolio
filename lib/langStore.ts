/* ============================================================
   Session-scoped language store. Each route provides its own
   default language (/ → en, /nl → nl); a language chosen via the
   in-page toggle is session-persisted and wins over the route
   default on the client (adopted via useSyncExternalStore, so
   SSR output stays stable per route).
   ============================================================ */

import { type Lang, SESSION_LANG_KEY } from "@/lib/i18n";
import { readSessionValue, writeSessionValue } from "@/lib/hooks/useSessionFlag";

let stored: Lang | null = null;
let adopted = false;
const listeners = new Set<() => void>();

function adopt(): void {
  if (adopted || typeof window === "undefined") return;
  adopted = true;
  const s = readSessionValue(SESSION_LANG_KEY);
  if (s === "nl" || s === "en") stored = s;
}

export const langStore = {
  subscribe(listener: () => void): () => void {
    adopt();
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  /** Session-chosen language, or null when the visitor never toggled. */
  getStored(): Lang | null {
    adopt();
    return stored;
  },
  set(l: Lang): void {
    if (l !== "en" && l !== "nl") return;
    if (l === stored) return;
    stored = l;
    writeSessionValue(SESSION_LANG_KEY, l);
    listeners.forEach((fn) => fn());
  },
};
