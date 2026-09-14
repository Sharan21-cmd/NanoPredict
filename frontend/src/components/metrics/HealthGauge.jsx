export default function HealthGauge({
  health = 100,
}) {
  const radius = 44
  const circumference = 2 * Math.PI * radius
  const progress =
    circumference * (health / 100)

  return (
    <div className="w-full h-full min-h-0 flex items-center justify-center">
      <div className="relative w-[104px] h-[104px] shrink-0">

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

          {/* Health ring */}
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke="#10e89b"
            strokeWidth="9"
            strokeLinecap="round"
            strokeDasharray={`${progress} ${circumference}`}
          />
        </svg>

        {/* Center value */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-mono text-2xl font-semibold text-slate-100">
            {health}%
          </span>

          <span className="text-[10px] text-emerald-400">
            Healthy
          </span>
        </div>

      </div>
    </div>
  )
}
