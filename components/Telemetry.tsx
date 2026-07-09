"use client";

import { T } from "@/components/T";
import { useAmsterdamClock } from "@/lib/hooks/useAmsterdamClock";

/* Live status panel. Only honest signals here: LOCAL_TIME is a real
   Amsterdam wall clock that hydrates on the client; CODING_SINCE is a
   single fixed year. The old LATENCY row was a fabricated random ping
   (and froze on its placeholder under reduced motion), so it is gone. */
export function Telemetry() {
  const time = useAmsterdamClock();

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
        <div className="tele-row"><T k="tele.k.since" className="k" /><span className="v mint">2022</span></div>
      </div>
    </div>
  );
}
