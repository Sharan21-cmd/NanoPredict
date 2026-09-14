const PARAMETER_STYLES = {
  stable: {
    badge:
      'bg-emerald-400/10 text-emerald-400 border-emerald-400/20',
  },

  warning: {
    badge:
      'bg-amber-400/10 text-amber-400 border-amber-400/20',
  },

  critical: {
    badge:
      'bg-rose-400/10 text-rose-400 border-rose-400/20',
  },
}

function Sparkline({
  points = '0,16 8,12 16,15 24,8 32,13 40,6 48,10 56,5',
}) {
  return (
    <svg
      viewBox="0 0 56 20"
      className="w-16 h-5 shrink-0"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <polyline
        points={points}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-cyan-400"
      />
    </svg>
  )
}

export default function ParameterCard({
  label,
  value,
  unit,
  status = 'stable',
  icon = '◉',
  trendPoints,
}) {
  const style =
    PARAMETER_STYLES[status] ??
    PARAMETER_STYLES.stable

  return (
    <div className="h-full min-h-0 min-w-0 flex items-center border-b border-slate-800 last:border-b-0">
      <div className="w-full min-w-0 flex items-center gap-2.5 py-2">

        {/* Icon */}
        <div className="w-8 h-8 shrink-0 flex items-center justify-center rounded-md border border-blue-400/20 bg-blue-500/10 text-blue-300 text-sm">
          {icon}
        </div>

        {/* Parameter */}
        <div className="min-w-0 flex-1">
          <p className="text-[10px] text-slate-300 truncate">
            {label}
          </p>

          <div className="flex items-baseline gap-1 mt-0.5 min-w-0">
            <span className="font-mono text-sm font-semibold text-slate-100 truncate">
              {value}
            </span>

            <span className="text-[9px] text-slate-500 shrink-0">
              {unit}
            </span>
          </div>
        </div>

        {/* Trend */}
        <div className="hidden xl:block text-cyan-400 shrink-0">
          <Sparkline points={trendPoints} />
        </div>

        {/* Status */}
        <span
          className={`shrink-0 px-1.5 py-0.5 text-[8px] font-medium rounded-full border ${style.badge}`}
        >
          ● {status === 'stable'
            ? 'Stable'
            : status.charAt(0).toUpperCase() + status.slice(1)}
        </span>

      </div>
    </div>
  )
}
