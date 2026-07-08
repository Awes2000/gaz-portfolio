"use client";

/* Redaction layer + TV static, split out of TerminalGate for size.
   Markup is 1:1 with Portfolio.html. */

export interface RBar {
  left: number;
  top: number;
  width: number;
  height: number;
  delay: string;
}

export function makeRBars(): RBar[] {
  return Array.from({ length: 16 }, () => {
    const left = Math.random() * 70 + 4;
    return {
      left,
      top: Math.random() * 88 + 4,
      width: Math.random() * 22 + 8,
      height: 10 + Math.random() * 8,
      delay: ((left / 90) * 0.45).toFixed(3) + "s",
    };
  });
}

export function GateOverlays({ bars, gone }: { bars: RBar[]; gone: boolean }) {
  return (
    <>
      {/* redaction layer over the blurred portfolio */}
      <div id="redact" aria-hidden="true" style={gone ? { opacity: 0, pointerEvents: "none", display: "none" } : undefined}>
        <div className="rbars" id="rbars">
          {bars.map((b, i) => (
            <span
              key={i}
              className="rbar"
              style={{
                left: b.left + "vw",
                top: b.top + "vh",
                width: b.width + "vw",
                height: b.height + "px",
                transitionDelay: b.delay,
              }}
            />
          ))}
        </div>
        <span className="stamp s1">Classified</span>
        <span className="stamp s2">Redacted</span>
        <span className="stamp s3">Eyes Only</span>
      </div>

      {/* TV static (cheap animated SVG turbulence, tinted steel) */}
      <div id="static-noise" aria-hidden="true">
        <svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <filter id="tvnoise" x="0" y="0" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.82" numOctaves="2" stitchTiles="stitch" seed="3" result="n">
              <animate attributeName="seed" values="3;19;7;26;3" dur="0.7s" repeatCount="indefinite" calcMode="discrete" />
            </feTurbulence>
            <feColorMatrix in="n" type="matrix" values="0 0 0 0 0.56  0 0 0 0 0.65  0 0 0 0 0.78  0 0 0 0.9 0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#tvnoise)" />
        </svg>
      </div>
    </>
  );
}
