"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { bindShell } from "@/lib/bus";
import { RESUME_PATH, UNLOCK_KEY } from "@/lib/gate";
import { writeSessionValue } from "@/lib/hooks/useSessionFlag";
import { lsProjectsShell, OUT, ROOT_LINES, topProcesses } from "@/lib/shellCommands";
import { sfx } from "@/lib/sfx";

interface LogLine {
  html: string;
  cls: string;
}

export function CommandPalette() {
  const reduce = !!useReducedMotion();
  const [open, setOpen] = useState(false);
  const [lines, setLines] = useState<LogLine[]>([]);
  const logRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const lastFocus = useRef<Element | null>(null);
  const greeted = useRef(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const pline = useCallback((content: string, cls = "") => {
    setLines((prev) => [...prev, { html: content, cls }]);
  }, []);

  const later = useCallback((fn: () => void, ms: number) => {
    timers.current.push(setTimeout(fn, ms));
  }, []);

  const openPalette = useCallback(() => {
    setOpen((was) => {
      if (was) return was;
      lastFocus.current = document.activeElement;
      if (!greeted.current) {
        greeted.current = true;
        pline('<span class="dim">gabriel-os shell. type</span> <span class="ok">help</span> <span class="dim">for commands. esc to close.</span>');
      }
      sfx.click();
      return true;
    });
  }, [pline]);

  const closePalette = useCallback(() => {
    setOpen((was) => {
      if (!was) return was;
      sfx.click();
      const lf = lastFocus.current as HTMLElement | null;
      if (lf?.focus) setTimeout(() => lf.focus(), 0);
      return false;
    });
  }, []);

  /* focus + html flag (screensaver / '?' key coordination) */
  useEffect(() => {
    document.documentElement.classList.toggle("pal-open", open);
    if (open && !matchMedia("(hover:none),(pointer:coarse)").matches) {
      const id = setTimeout(() => inputRef.current?.focus(), 30); // no forced keyboard on touch
      return () => clearTimeout(id);
    }
  }, [open]);

  const cd = useCallback(
    (arg: string): string[] | null => {
      const map: Record<string, string> = { about: "about", projects: "projects", contact: "contact", "~": "hero", "": "hero", home: "hero" };
      const target = map[(arg || "").replace(/^~\/?/, "") || arg];
      const id = map[arg] || target;
      if (id && document.getElementById(id)) {
        closePalette();
        document.getElementById(id)!.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
        return null;
      }
      return ['cd: no such section: <span class="crit">' + (arg || "") + "</span>"];
    },
    [closePalette, reduce],
  );

  const logout = useCallback(() => {
    pline('<span class="warn">&gt; closing secure channel...</span>');
    later(() => pline('<span class="dim">&gt; session ended. see you around.</span>'), 320);
    sfx.zap(true);
    const pd = document.getElementById("powerdown");
    const reset = () => {
      writeSessionValue(UNLOCK_KEY, null);
      try {
        history.replaceState(null, "", location.pathname);
      } catch {
        /* ignore */
      }
      window.scrollTo(0, 0);
      location.reload();
    };
    closePalette();
    if (pd && !reduce) {
      pd.classList.add("run");
      setTimeout(reset, 900);
    } else reset();
  }, [pline, later, closePalette, reduce]);

  const runCmd = useCallback(
    (raw: string) => {
      const cmd = raw.trim().replace(/\s+/g, " ");
      const low = cmd.toLowerCase();
      pline('<span class="ps1">guest@gabriel-os:~$</span> ' + raw.replace(/[<>]/g, ""));
      if (inputRef.current) inputRef.current.value = "";
      if (low === "") return;
      sfx.click();

      if (low === "cv" || low === "resume") {
        pline('<span class="dim">&gt; fetching resume... opening awes_resume.pdf</span>');
        try {
          window.open(RESUME_PATH, "_blank", "noopener");
        } catch {
          /* ignore */
        }
        return;
      }
      if (low === "clear") {
        setLines([]);
        return;
      }
      if (low === "sfx" || low === "sound") {
        const on = sfx.toggle();
        pline("ui sound: " + (on ? '<span class="ok">on</span>' : '<span class="dim">off</span>'));
        return;
      }
      if (low.startsWith("cd")) {
        const r = cd(low.slice(2).trim());
        if (r) r.forEach((l) => pline(l));
        return;
      }
      if (low === "ls" || low === "ls projects" || low === "ls -la" || low === "ll") {
        lsProjectsShell().forEach((l, i) => later(() => pline(l), i * 55));
        return;
      }
      if (low === "top" || low === "htop" || low === "ps") {
        topProcesses().forEach((l, i) => later(() => pline(l), i * 60));
        return;
      }
      if (low === "sudo rm -rf /" || low === "rm -rf /") {
        pline('<span class="crit">nice try.</span> this system is read-only.');
        return;
      }
      if (low === "sudo unlock --root" || low === "sudo su" || low === "root") {
        sfx.root();
        ROOT_LINES.forEach((l, i) => later(() => pline(l), i * 130));
        return;
      }
      if (low === "logout" || low === "exit --session" || low === "shutdown") {
        logout();
        return;
      }
      if (low === "exit" || low === "q") {
        closePalette();
        return;
      }
      if (low === "help" || low === "man" || low === "?") {
        OUT.help().forEach((l) => pline(l));
        return;
      }
      const fn = OUT[low];
      if (fn) {
        fn().forEach((l, i) => later(() => pline(l), i * 70));
        return;
      }
      pline('command not found: <span class="crit">' + low.replace(/[<>]/g, "") + '</span>. try <span class="ok">help</span>');
    },
    [pline, cd, logout, closePalette, later],
  );

  /* window-level bindings: bus + Cmd-K / Ctrl-K + Esc */
  useEffect(() => {
    const unbind = bindShell({ print: (l, c) => pline(l, c), open: openPalette, close: closePalette });
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((was) => {
          if (was) {
            closePalette();
            return false;
          }
          openPalette();
          return true;
        });
      } else if (e.key === "Escape") closePalette();
    };
    document.addEventListener("keydown", onKey);
    const pending = timers.current;
    return () => {
      unbind();
      document.removeEventListener("keydown", onKey);
      pending.forEach(clearTimeout);
    };
  }, [pline, openPalette, closePalette]);

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [lines]);

  return (
    <div
      id="palette"
      className={open ? "open" : undefined}
      aria-hidden={!open}
      onClick={(e) => {
        if (e.target === e.currentTarget) closePalette();
      }}
    >
      <div className="pal-card" role="dialog" aria-modal="true" aria-label="Command terminal">
        <div className="pal-top">
          <span className="pal-dot" />
          <span className="pal-title">guest@gabriel-os · /bin/sh</span>
          <button className="pal-close" id="pal-close" aria-label="Close terminal" onClick={closePalette}>
            esc
          </button>
        </div>
        <div className="pal-log" id="pal-log" ref={logRef}>
          {lines.map((l, i) => (
            <div key={i} className={`ln${l.cls ? " " + l.cls : ""}`} dangerouslySetInnerHTML={{ __html: l.html }} />
          ))}
        </div>
        <div className="pal-prompt">
          <span className="pal-ps1">guest@gabriel-os:~$</span>
          <input
            id="pal-cmd"
            ref={inputRef}
            autoComplete="off"
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
            aria-label="Type a command"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                runCmd((e.target as HTMLInputElement).value);
              } else if (e.key.length === 1) sfx.type();
            }}
          />
        </div>
      </div>
    </div>
  );
}
