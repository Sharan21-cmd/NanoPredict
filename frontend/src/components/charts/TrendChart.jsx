function buildPath(points, width = 280, height = 80) {
  const max = Math.max(...points)
  const min = Math.min(...points)
  const range = max - min || 1

  return points
    .map((value, index) => {
      const x =
        (index / (points.length - 1)) * width

      const y =
        height -
        ((value - min) / range) *
          (height - 10) -
        5

      return `${index === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`
    })
    .join(' ')
}

export default function TrendChart({
  label,
  value,
  unit,
  status = 'stable',
  points,
}) {
  const path = buildPath(points)

  const statusStyle = {
    stable: {
      dot: 'bg-emerald-400',
      text: 'text-emerald-400',
    },

    warning: {
      dot: 'bg-amber-400',
      text: 'text-amber-400',
    },

    critical: {
      dot: 'bg-rose-500',
      text: 'text-rose-500',
    },
  }

  const style =
    statusStyle[status] ??
    statusStyle.stable

  return (
    <div className="w-full h-full min-w-0 min-h-0 border border-slate-800 bg-slate-950/60 rounded-sm p-2.5 flex flex-col overflow-hidden">

      <div className="flex items-start justify-between min-w-0 shrink-0">
        <div className="min-w-0">
          <p className="text-[9px] text-slate-500 truncate">
            {label}
          </p>

          <div className="flex items-baseline gap-1 mt-0.5 min-w-0">
            <span className="text-sm font-mono font-semibold text-slate-100 truncate">
              {value}
            </span>

            <span className="text-[8px] text-slate-600 shrink-0">
              {unit}
            </span>
          </div>
        </div>

        <span
          className={`shrink-0 flex items-center gap-1 text-[8px] ${style.text}`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${style.dot}`}
          />

          {status}
        </span>
      </div>

      <div className="flex-1 min-h-0 mt-2">
        <svg
          viewBox="0 0 280 80"
          preserveAspectRatio="none"
          className="w-full h-full"
        >
          <path
            d={path}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            vectorEffect="non-scaling-stroke"
            className="text-cyan-400"
          />
        </svg>
      </div>

    </div>
  )
}
