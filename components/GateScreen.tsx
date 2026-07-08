"use client";

import type { RefObject } from "react";
import { T } from "@/components/T";
import { sfx } from "@/lib/sfx";
import { useSfxEnabled } from "@/lib/hooks/useSfxEnabled";

export interface LogLine {
  html: string;
  cls: string;
}

interface GateScreenProps {
  powering: boolean;
  gone: boolean;
  lines: LogLine[];
  bar: string | null;
  typed: string;
  promptVisible: boolean;
  crtRef: RefObject<HTMLDivElement | null>;
  logRef: RefObject<HTMLDivElement | null>;
  inputRef: RefObject<HTMLInputElement | null>;
  onSkip: () => void;
  onPromptClick: () => void;
  onInput: (value: string) => void;
  onEnter: (value: string) => void;
  onUnlock: () => void;
}

/* CRT terminal markup, 1:1 with Portfolio.html. All log strings are
   our own authored HTML; user-typed input is <>-stripped before echo. */
export function GateScreen(props: GateScreenProps) {
  const { powering, gone, lines, bar, typed, promptVisible, crtRef, logRef, inputRef } = props;
  const sndOn = useSfxEnabled();

  return (
    <div id="gate" className={gone ? "gone" : undefined} role="dialog" aria-label="Terminal access gate" aria-modal="true">
      <div className={`crt-screen${powering ? " powering" : ""}`} id="crt-screen" ref={crtRef}>
        <div className="crt-poweron" />
        <div className="crt-content">
          <a
            href="#hero"
            className="gate-skip"
            id="gate-skip"
            onClick={(e) => {
              e.preventDefault();
              props.onSkip();
            }}
          >
            <T k="gate.skip" />
          </a>
          <div className="gate-bar">
            <span>GABRIEL-OS</span>
            <span>SECURE TERMINAL v4.0</span>
          </div>
          <div className="gate-log" id="gate-log" aria-live="polite" ref={logRef}>
            {lines.map((l, i) => (
              <div key={i} className={`ln${l.cls ? " " + l.cls : ""}`} dangerouslySetInnerHTML={{ __html: l.html }} />
            ))}
            {bar !== null && <div className="ln" dangerouslySetInnerHTML={{ __html: bar }} />}
          </div>
          <div className="gate-prompt" id="gate-prompt" hidden={!promptVisible} onClick={props.onPromptClick}>
            <span className="ps1">guest@gabriel-os:~$</span>
            <span className="gate-input-wrap">
              <span id="gate-typed">{typed}</span>
              <span className="caret" id="gate-caret">█</span>
            </span>
            <input
              id="gate-cmd"
              ref={inputRef}
              autoComplete="off"
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck={false}
              aria-label="Type a terminal command"
              onInput={(e) => props.onInput((e.target as HTMLInputElement).value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  props.onEnter((e.target as HTMLInputElement).value);
                }
              }}
            />
          </div>
          <T as="p" className="gate-hint" k="gate.hint" hidden={!promptVisible} />
          <button className="gate-unlock" id="gate-unlock" hidden={!promptVisible} onClick={props.onUnlock}>
            <T k="gate.unlock" />
          </button>
        </div>
        <div className="zap-tear" />
        <div className="crt-scanlines" />
        <div className="crt-vignette" />
        <div className="crt-flicker" />
      </div>
      <button className="gate-sound" id="gate-sound" aria-pressed={sndOn} onClick={() => sfx.toggle()}>
        {sndOn ? "◆ snd: on" : "◇ snd: off"}
      </button>
    </div>
  );
}
