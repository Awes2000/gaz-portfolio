"use client";

import { useEffect, useRef } from "react";
import { T } from "@/components/T";
import { toast } from "@/lib/bus";
import { writeSessionValue } from "@/lib/hooks/useSessionFlag";

/* footer easter-egg truths, ported verbatim from js/app.js */
const TRUTHS = [
  "↳ <b>whoami</b>: a front-end dev learning to secure what he builds.",
  "↳ <b>manila</b>: a placement that reshaped how I see the work.",
  "↳ <b>music</b>: yes, I produce. Ask me for the loop.",
  "↳ <b>faith</b>: the steady anchor under the ambition.",
];

export function Footer() {
  const eggIdx = useRef(0);
  const ref = useRef<HTMLElement>(null);

  /* fill the year (the footer.copy dictionary string re-injects an
     empty #year span, same as the static build) */
  useEffect(() => {
    const fill = () => {
      const y = ref.current?.querySelector("#year");
      if (y) y.textContent = String(new Date().getFullYear());
    };
    fill();
    const obs = new MutationObserver(fill);
    if (ref.current) obs.observe(ref.current, { childList: true, subtree: true, characterData: false });
    return () => obs.disconnect();
  }, []);

  const onEgg = () => {
    toast(TRUTHS[eggIdx.current % TRUTHS.length], 3600);
    eggIdx.current++;
  };

  const onReplay = (e: React.MouseEvent) => {
    e.preventDefault();
    writeSessionValue("aws_unlocked", null);
    // no hash anchor (it scrolls the page); clearing the flag is enough to replay
    try {
      history.replaceState(null, "", location.pathname + location.search);
    } catch {
      /* ignore */
    }
    window.scrollTo(0, 0);
    location.reload();
  };

  return (
    <footer ref={ref}>
      <div className="foot-inner">
        <T k="footer.copy" />
        <button type="button" className="foot-egg" id="foot-egg" onClick={onEgg}>
          <T k="footer.egg" />
        </button>
      </div>
      <div className="foot-session">
        <T k="footer.session" className="fs-line" />
        <a className="foot-replay" href="?" id="foot-replay" onClick={onReplay}>
          <T k="footer.replay" />
        </a>
      </div>
    </footer>
  );
}
