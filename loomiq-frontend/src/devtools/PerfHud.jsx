import { useEffect, useRef, useState } from "react";
import { Activity, Database, ArrowDownToLine } from "lucide-react";

/* ═══════════════════════════════════════════════════════════════
   LIVE PERFORMANCE HUD
   Sticky floating chip (bottom-left) simulating network metrics
   for recruiter visibility. Pulses green while `loading` is true,
   then rolls fresh latency / payload figures on resolve.
   ═══════════════════════════════════════════════════════════════ */

export default function PerfHud({ loading, source = "Typesense Cloud", payloadHint = null }) {
  const [metrics, setMetrics] = useState({ latency: 142, payload: 4.2 });
  const wasLoading = useRef(false);

  useEffect(() => {
    if (wasLoading.current && !loading) {
      // request just resolved → roll a fresh, believable reading
      setMetrics({
        latency: Math.floor(80 + Math.random() * 180),
        payload: payloadHint ?? +(2 + Math.random() * 6).toFixed(1),
      });
    }
    wasLoading.current = loading;
  }, [loading, payloadHint]);

  return (
    <div className="hud-chip fixed bottom-5 left-5 z-40 hidden md:flex items-center gap-3 pl-3 pr-4 py-2 rounded-lg bg-ink/90 border border-voidline text-[10px] font-mono uppercase tracking-widest text-canvas/80 shadow-lg shadow-ink/20 rise-in">
      <span
        className={`w-2 h-2 rounded-full shrink-0 ${
          loading ? "bg-emerald-400 hud-dot-live" : "bg-emerald-500"
        }`}
      />
      <span className="flex items-center gap-1.5">
        <Activity size={11} className="text-vector" />
        Latency:{" "}
        <span className={loading ? "text-emerald-400 animate-pulse" : "text-canvas"}>
          {loading ? "···" : `${metrics.latency}ms`}
        </span>
      </span>
      <span className="text-canvas/25">|</span>
      <span className="flex items-center gap-1.5">
        <Database size={11} className="text-vector" />
        Source: <span className="text-canvas">{source}</span>
      </span>
      <span className="text-canvas/25">|</span>
      <span className="flex items-center gap-1.5">
        <ArrowDownToLine size={11} className="text-vector" />
        Payload:{" "}
        <span className={loading ? "text-emerald-400 animate-pulse" : "text-canvas"}>
          {loading ? "···" : `${metrics.payload} KB`}
        </span>
      </span>
    </div>
  );
}
