"use client";

import { useCallback, useState } from "react";

/* In-memory fallback for sandboxes where sessionStorage throws
   (same behavior as the static build). */
const memory = new Map<string, string>();

export function readSessionValue(key: string): string | null {
  try {
    return sessionStorage.getItem(key);
  } catch {
    return memory.get(key) ?? null;
  }
}

export function writeSessionValue(key: string, value: string | null): void {
  try {
    if (value === null) sessionStorage.removeItem(key);
    else sessionStorage.setItem(key, value);
  } catch {
    if (value === null) memory.delete(key);
    else memory.set(key, value);
  }
}

/**
 * Session-scoped boolean flag ("1" in sessionStorage) with an
 * in-memory fallback. Initial state is always `false` so server
 * and client HTML match; call `sync()` in an effect to adopt the
 * stored value after mount.
 */
export function useSessionFlag(key: string): {
  value: boolean;
  set: (v: boolean) => void;
  sync: () => boolean;
} {
  const [value, setValue] = useState(false);

  const set = useCallback(
    (v: boolean) => {
      writeSessionValue(key, v ? "1" : null);
      setValue(v);
    },
    [key],
  );

  const sync = useCallback(() => {
    const stored = readSessionValue(key) === "1";
    setValue(stored);
    return stored;
  }, [key]);

  return { value, set, sync };
}
