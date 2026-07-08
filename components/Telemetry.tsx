"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";
import { T } from "@/components/T";
import { useAmsterdamClock } from "@/lib/hooks/useAmsterdamClock";

/* one honest start: when coding began (same as the static build) */
const SINCE = new Date("2021-09-01T00:00:00");

function sinceLabel(): string {
  const ms = Date.now() - SINCE.getTime();
  const days = ms / 86400000;
  const years = Math.floor(days / 365.25);
  const remDays = Math.floor(days - years * 365.25);
  return `2021 · ${years}y ${remDays}d`;
}

export function Telemetry() {
  const reduce = !!useReducedMotion();
  const time = useAmsterdamClock();
  const [since, setSince] = useState("2021");
  const [ping, setPing] = useState("·· ms");
  const [spark, setSpark] = useState<number[]>([]);

  useEffect(() => {
    const tick = () => setSince(sinceLabel());
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  /* sparkline bars + jittering ping, exactly like js/app.js */
  useEffect(() => {
    setSpark(Array.from({ length: 14 }, () => 4 + Math.random() * 10));
    if (reduce) return;
    const id = setInterval(() => {
      setPing((8 + Math.random() * 22).toFixed(0) + " ms");
      setSpark((prev) => {
        const next = [...prev];
        const i = (Math.random() * next.length) | 0;
        next[i] = 4 + Math.random() * 10;
        return next;
      });
    }, 1400);
    return () => clearInterval(id);
  }, [reduce]);

  return (
    <div className="telemetry" aria-label="Live system status">
      <div className="tele-head">
        <T k="tele.head" />
        <span className="live-dot">
          <i />
          ONLINE
        </span>
      </div>
      <div className="tele-rows">
        <div className="tele-row"><T k="tele.k.status" className="k" /><T k="tele.v.status" className="v mint" /></div>
        <div className="tele-row"><T k="tele.k.employed" className="k" /><T k="tele.v.employed" className="v" /></div>
        <div className="tele-row"><T k="tele.k.enrolled" className="k" /><T k="tele.v.enrolled" className="v" /></div>
        <div className="tele-row"><T k="tele.k.stack" className="k" /><T k="tele.v.stack" className="v" /></div>
        <div className="tele-row"><T k="tele.k.focus" className="k" /><T k="tele.v.focus" className="v" /></div>
        <div className="tele-row"><T k="tele.k.open" className="k" /><T k="tele.v.open" className="v mint" /></div>
        <div className="tele-row"><T k="tele.k.time" className="k" /><span className="v" id="tele-time">{time}</span></div>
        <div className="tele-row"><T k="tele.k.since" className="k" /><span className="v mint" id="tele-since">{since}</span></div>
        <div className="tele-row">
          <T k="tele.k.latency" className="k" />
          <span className="v">
            <span className="tele-spark" id="tele-spark">
              {spark.map((h, i) => (
                <i key={i} style={{ height: `${h}px` }} />
              ))}
            </span>{" "}
            <span id="tele-ping">{ping}</span>
          </span>
        </div>
      </div>
    </div>
  );
}
