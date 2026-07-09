"use client";

import { useRef } from "react";
import { T } from "@/components/T";
import { useLang } from "@/components/LangProvider";
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
  const { t } = useLang();
  const eggIdx = useRef(0);
  /* Real year in the SSR HTML (no-JS / SEO safe). It resolves to the
     build year on the server and the current year on the client;
     suppressHydrationWarning covers the rare New-Year-boundary diff. */
  const year = new Date().getFullYear();

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
    <footer>
      <div className="foot-inner">
        <span className="foot-copy">
          © <span suppressHydrationWarning>{year}</span> Gabriël Awes Zoretić · {t("footer.builtline")}
        </span>
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
