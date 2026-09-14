function getRiskStatus(score) {
  if (score >= 70) {
    return {
      label: 'Critical Risk',
      color: '#ef4444',
      dot: 'bg-rose-500',
      text: 'text-rose-400',
    }
  }

  if (score >= 35) {
    return {
      label: 'Elevated Risk',
      color: '#f59e0b',
      dot: 'bg-amber-400',
      text: 'text-amber-400',
    }
  }

  return {
    label: 'Low Risk',
    color: '#10b981',
    dot: 'bg-emerald-400',
    text: 'text-emerald-400',
  }
}

export default function RiskGauge({
  score = 0,
}) {
  const radius = 42
  const circumference = 2 * Math.PI * radius
  const progress = circumference * (score / 100)

  const status = getRiskStatus(score)

  return (
    <div className="flex flex-col items-center py-3">
      <div className="relative w-28 h-28">

        <svg
          viewBox="0 0 120 120"
          className="w-full h-full -rotate-90"
        >
          {/* Background ring */}
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke="#172033"
            strokeWidth="9"
          />

          {/* Risk ring */}
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke={status.color}
            strokeWidth="9"
            strokeLinecap="round"
            strokeDasharray={`${progress} ${circumference}`}
          />
        </svg>

        {/* Score */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-mono text-xl font-semibold text-slate-100">
            {score}
          </span>

          <span className="text-[9px] text-slate-500">
            / 100
          </span>
        </div>
      </div>

      {/* Status */}
      <div className="mt-2 flex items-center gap-1.5">
        <span
          className={`w-2 h-2 rounded-full ${status.dot}`}
        />

        <span
          className={`text-[10px] font-medium ${status.text}`}
        >
          {status.label}
        </span>
      </div>
    </div>
  )
}
