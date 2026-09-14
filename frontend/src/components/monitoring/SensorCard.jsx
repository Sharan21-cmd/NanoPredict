import { getStatusStyle } from '../../lib/status'

function formatValue(sensor) {
  if (sensor.isScientific) {
    return sensor.value
      .toExponential(1)
      .replace('e-', ' × 10⁻')
  }

  return sensor.value.toFixed(sensor.precision ?? 1)
}

function formatDelta(sensor) {
  if (sensor.isScientific) {
    return sensor.delta
      .toExponential(1)
      .replace('e-', ' × 10⁻')
  }

  return sensor.delta.toFixed(sensor.precision ?? 2)
}

const TREND_GLYPH = {
  up: '▲',
  down: '▼',
  flat: '—',
}

export default function SensorCard({ sensor }) {
  const style = getStatusStyle(sensor.status)

  const trendColor =
    sensor.trend === 'flat'
      ? 'text-slate-500'
      : style.text

  return (
    <div className="p-3 border border-slate-800 bg-slate-900/40 rounded-sm hover:border-slate-700 transition-colors">

      <div className="flex items-start justify-between mb-2">
        <div>
          <p className="text-[11px] font-medium text-slate-300">
            {sensor.label}
          </p>

          <p className="text-[10px] text-slate-500">
            {sensor.description}
          </p>
        </div>

        <span
          className={`flex items-center gap-1 text-[10px] font-medium ${style.text}`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${style.dot}`}
          />

          {style.label}
        </span>
      </div>

      <div className="flex items-end justify-between">
        <div className="flex items-baseline gap-1">
          <span className="text-xl font-mono font-semibold text-slate-100">
            {formatValue(sensor)}
          </span>

          <span className="text-xs text-slate-400">
            {sensor.unit}
          </span>
        </div>

        <span
          className={`flex items-center gap-1 text-[10px] font-mono ${trendColor}`}
        >
          {TREND_GLYPH[sensor.trend]} {formatDelta(sensor)}
        </span>
      </div>

    </div>
  )
}
