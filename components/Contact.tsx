"use client";

import { useRef, useState } from "react";
import { Rise, ScrambleNum, ScrambleTitle, Wipe } from "@/components/motion/InView";
import { T } from "@/components/T";
import { useLang } from "@/components/LangProvider";
import { shell } from "@/lib/bus";
import { sfx } from "@/lib/sfx";

const EMAIL = "aweszoretic@hotmail.nl";

/* copy-to-clipboard with execCommand fallback, ported from js/shell.js */
function copyText(text: string, done: () => void) {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done, done);
    } else {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand("copy");
      } catch {
        /* ignore */
      }
      document.body.removeChild(ta);
      done();
    }
  } catch {
    done();
  }
}

export function Contact() {
  const { t } = useLang();
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const onCopy = () => {
    copyText(EMAIL, () => {
      shell.print('<span class="ok">&gt; copied to clipboard:</span> ' + EMAIL);
      sfx.click();
    });
    setCopied(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 1800);
  };

  return (
    <Wipe id="contact">
      <div className="wrap">
        <Rise className="sec-label" style={{ justifyContent: "center" }}>
          <ScrambleNum value="03." />
          <ScrambleTitle k="contact.sectitle" underline={false} />
        </Rise>
        <Rise className="contact-kicker" index={1}>
          <T k="contact.kicker" />
        </Rise>
        <Rise as="h2" className="contact-title" index={2}>
          <T k="contact.title" />
        </Rise>
        <Rise as="p" className="contact-copy" index={3}>
          <T k="contact.copy" />
        </Rise>
        <a className="contact-cta" id="contact-cta" href={`mailto:${EMAIL}`}>
          <T k="contact.cta" />
        </a>
        <button className={`contact-copy-btn${copied ? " copied" : ""}`} id="copy-email" onClick={onCopy}>
          {copied ? "> copied to clipboard" : t("contact.copybtn")}
        </button>
      </div>
    </Wipe>
  );
}
