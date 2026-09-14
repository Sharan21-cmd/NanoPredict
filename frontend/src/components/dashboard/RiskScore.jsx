import { getStatusStyle } from '../../lib/status'

export default function RiskScore({ score, status }) {
  const style = getStatusStyle(status)

  const radius = 34
  const circumference = 2 * Math.PI * radius
  const offset = circumference * (1 - score / 100)

  return (
    <div className="flex items-center gap-4 p-3">
      <svg
        width="84"
        height="84"
        viewBox="0 0 84 84"
        className="shrink-0 -rotate-90"
      >
        <circle
          cx="42"
          cy="42"
          r={radius}
          fill="none"
          stroke="#1e293b"
          strokeWidth="7"
        />

        <circle
          cx="42"
          cy="42"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="7"
          strokeLinecap="round"
          className={style.text}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>

      <div>
        <p className="text-[10px] text-slate-500">
          Risk Score
        </p>

        <p className="text-2xl font-mono font-semibold text-slate-100">
          {score}%
        </p>

        <p className={`text-[10px] font-medium ${style.text}`}>
          {style.label}
        </p>
      </div>
    </div>
  )
}
