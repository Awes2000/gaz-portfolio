/* ============================================================
   Tiny cross-component buses. The static build coordinated
   modules through window globals (RIPPLE, SHELL) and custom
   events (aws:access). The port keeps the same contracts but
   typed and module-scoped instead of window-scoped.
   ============================================================ */

/* ---------- ripple background (bound by RippleCanvas) ---------- */
export interface RippleApi {
  setAudioLevel(v: number): void;
  burst(x?: number, y?: number): void;
}

let rippleImpl: RippleApi = { setAudioLevel() {}, burst() {} };

export const ripple: RippleApi = {
  setAudioLevel: (v) => rippleImpl.setAudioLevel(v),
  burst: (x, y) => rippleImpl.burst(x, y),
};

export function bindRipple(impl: RippleApi): () => void {
  rippleImpl = impl;
  return () => {
    rippleImpl = { setAudioLevel() {}, burst() {} };
  };
}

/* ---------- shell terminal (bound by CommandPalette) ---------- */
export interface ShellApi {
  print(line: string, cls?: string): void;
  open(): void;
  close(): void;
}

let shellImpl: ShellApi | null = null;

export const shell: ShellApi = {
  print: (line, cls) => shellImpl?.print(line, cls),
  open: () => shellImpl?.open(),
  close: () => shellImpl?.close(),
};

export function bindShell(impl: ShellApi): () => void {
  shellImpl = impl;
  return () => {
    shellImpl = null;
  };
}

/* ---------- egg toast (bound by Shell) ---------- */
let toastImpl: ((html: string, ms?: number) => void) | null = null;

export function toast(html: string, ms?: number): void {
  toastImpl?.(html, ms);
}

export function bindToast(impl: (html: string, ms?: number) => void): () => void {
  toastImpl = impl;
  return () => {
    toastImpl = null;
  };
}

/* ---------- session events (same names as the static build) ---------- */
export const ACCESS_EVENT = "aws:access";
export const LANG_EVENT = "aws:lang";

export function dispatchAccess(): void {
  window.dispatchEvent(new CustomEvent(ACCESS_EVENT));
}
