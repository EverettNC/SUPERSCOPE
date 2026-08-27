export function Reticle({
  progress,
  live = true,
}: {
  progress: number;
  live?: boolean;
}) {
  const pct = Math.max(0, Math.min(100, progress));
  return (
    <div className="relative mx-auto size-52 sm:size-64" aria-hidden="true">
      <svg viewBox="0 0 200 200" className="size-full text-primary">
        <circle
          cx="100"
          cy="100"
          r="88"
          fill="none"
          stroke="currentColor"
          strokeOpacity="0.18"
          strokeWidth="1"
        />
        <circle
          cx="100"
          cy="100"
          r="62"
          fill="none"
          stroke="currentColor"
          strokeOpacity="0.28"
          strokeWidth="1"
        />
        <circle
          cx="100"
          cy="100"
          r="18"
          fill="none"
          stroke="currentColor"
          strokeOpacity="0.7"
          strokeWidth="1.4"
        />
        <path
          d="M100 8 v28 M100 164 v28 M8 100 h28 M164 100 h28"
          stroke="currentColor"
          strokeOpacity="0.7"
          strokeWidth="1.4"
        />
        {live ? (
          <g className="scan-ring origin-center" style={{ transformBox: "fill-box" }}>
            <circle
              cx="100"
              cy="100"
              r="70"
              fill="none"
              stroke="currentColor"
              strokeOpacity="0.35"
              strokeWidth="1"
            />
          </g>
        ) : null}
        <circle
          cx="100"
          cy="100"
          r="88"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeDasharray={`${(pct / 100) * 552} 552`}
          strokeLinecap="butt"
          transform="rotate(-90 100 100)"
        />
        {live ? (
          <g className="scan-sweep origin-center" style={{ transformBox: "fill-box", transformOrigin: "100px 100px" }}>
            <path d="M100 100 L100 14" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.85" />
          </g>
        ) : null}
      </svg>
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-mono text-2xl tabular-nums text-fg">{Math.round(pct)}</span>
        <span className="font-mono text-[10px] tracking-[0.18em] text-muted uppercase">
          {live ? "probing" : "locked"}
        </span>
      </div>
    </div>
  );
}
