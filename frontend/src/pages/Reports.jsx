import Panel from '../components/layout/Panel'
import { useTelemetry } from '../telemetry/useTelemetry'
import { generatePrediction } from '../analytics/PredictionEngine'

function getStatus(status) {
  if (status === 'critical') {
    return {
      label: 'CRITICAL',
      text: 'text-rose-400',
      bg: 'bg-rose-400/10',
      border: 'border-rose-400/20',
      dot: 'bg-rose-500',
    }
  }

  if (status === 'warning') {
    return {
      label: 'WARNING',
      text: 'text-amber-400',
      bg: 'bg-amber-400/10',
      border: 'border-amber-400/20',
      dot: 'bg-amber-400',
    }
  }

  return {
    label: 'NORMAL',
    text: 'text-emerald-400',
    bg: 'bg-emerald-400/10',
    border: 'border-emerald-400/20',
    dot: 'bg-emerald-400',
  }
}

function MetricRow({ label, value, unit = '' }) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-slate-800 last:border-b-0">
      <span className="text-[10px] text-slate-500">
        {label}
      </span>

      <div className="flex items-baseline gap-1.5">
        <span className="font-mono text-[12px] text-slate-200">
          {value}
        </span>

        {unit && (
          <span className="text-[9px] text-slate-600">
            {unit}
          </span>
        )}
      </div>
    </div>
  )
}

export default function Reports() {
  const { telemetry } = useTelemetry()

  const prediction = generatePrediction(telemetry)

  const riskScore =
    telemetry.risk?.riskScore ?? 0

  const health =
    telemetry.risk?.health ?? 100

  const riskStatus =
    getStatus(telemetry.risk?.status ?? 'normal')

  const alertCount =
    telemetry.alerts?.length ?? 0

  return (
    <main className="flex-1 min-h-0 p-3 overflow-auto">

      {/* Report heading */}
      <div className="mb-3">
        <div className="flex items-start justify-between">

          <div>
            <h1 className="text-base font-semibold text-slate-100">
              Equipment Report
            </h1>

            <p className="mt-1 text-[10px] text-slate-500">
              NanoPredict equipment health and telemetry summary
            </p>
          </div>

          <div className="text-right">
            <p className="text-[9px] text-slate-600">
              EQUIPMENT
            </p>

            <p className="font-mono text-[11px] text-slate-300">
              EQ-04A
            </p>
          </div>

        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">

        <Panel
          title="Overall Health"
          subtitle="Current equipment condition"
        >
          <div className="p-4">
            <div className="flex items-end justify-between">

              <span className="text-4xl font-mono font-semibold text-slate-100">
                {health}%
              </span>

              <span className="text-[10px] text-emerald-400">
                HEALTHY
              </span>

            </div>

            <div className="mt-4 h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-400 transition-all duration-300"
                style={{
                  width: `${health}%`,
                }}
              />
            </div>
          </div>
        </Panel>

        <Panel
          title="Risk Score"
          subtitle="Current anomaly risk"
        >
          <div className="p-4">

            <span className="text-4xl font-mono font-semibold text-slate-100">
              {riskScore}
            </span>

            <span className="ml-1 text-[10px] text-slate-600">
              / 100
            </span>

            <div
              className={`mt-3 inline-flex items-center gap-1.5 px-2 py-1 rounded-full border ${riskStatus.bg} ${riskStatus.border}`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${riskStatus.dot}`}
              />

              <span className={`text-[9px] font-medium ${riskStatus.text}`}>
                {riskStatus.label}
              </span>
            </div>

          </div>
        </Panel>

        <Panel
          title="Prediction"
          subtitle="Forward equipment assessment"
        >
          <div className="p-4">

            <p className="text-2xl font-mono font-semibold text-slate-100">
              {prediction.predictedRisk}%
            </p>

            <p className="mt-1 text-[10px] text-slate-500">
              Predicted risk over {prediction.horizon}
            </p>

            <div className="mt-3 text-[10px] text-cyan-400">
              Drift forecast: {prediction.driftForecast} nm
            </div>

          </div>
        </Panel>

      </div>

      {/* Sensor summary */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-3 mt-3">

        <Panel
          title="Current Measurements"
          subtitle="Latest telemetry snapshot"
        >
          <div className="p-4">

            <MetricRow
              label="Stage Position"
              value={telemetry.stage.positionMm.toFixed(2)}
              unit="mm"
            />

            <MetricRow
              label="VL53L1X Distance"
              value={telemetry.distance.valueMm.toFixed(2)}
              unit="mm"
            />

            <MetricRow
              label="Temperature"
              value={telemetry.temperature.valueC.toFixed(1)}
              unit="°C"
            />

            <MetricRow
              label="MPU6050 Vibration"
              value={telemetry.vibration.rmsG.toFixed(2)}
              unit="g RMS"
            />

            <MetricRow
              label="BMP280 Pressure"
              value={telemetry.vacuum.pressurePa.toExponential(2)}
              unit="Pa"
            />

          </div>
        </Panel>

        <Panel
          title="System Summary"
          subtitle="Current monitoring state"
        >
          <div className="p-4">

            <MetricRow
              label="Stage State"
              value={
                telemetry.stage.moving
                  ? 'MOVING'
                  : 'STOPPED'
              }
            />

            <MetricRow
              label="Prediction Status"
              value={prediction.status.toUpperCase()}
            />

            <MetricRow
              label="Active Alerts"
              value={alertCount}
            />

            <MetricRow
              label="Telemetry Source"
              value="LIVE BACKEND"
            />

            <MetricRow
              label="Equipment"
              value="EQ-04A"
            />

          </div>
        </Panel>

      </div>

      {/* Sensor contribution */}
      <div className="mt-3">
        <Panel
          title="Risk Contribution"
          subtitle="Relative contribution of monitored parameters"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">

            {[
              [
                'Temperature',
                telemetry.risk?.contributions?.temperature ?? 0,
              ],
              [
                'Vibration',
                telemetry.risk?.contributions?.vibration ?? 0,
              ],
              [
                'Vacuum',
                telemetry.risk?.contributions?.vacuum ?? 0,
              ],
            ].map(([label, value]) => (
              <div key={label}>

                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] text-slate-500">
                    {label}
                  </span>

                  <span className="text-[10px] font-mono text-slate-300">
                    {value}%
                  </span>
                </div>

                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-cyan-400 transition-all duration-300"
                    style={{
                      width: `${Math.min(value, 100)}%`,
                    }}
                  />
                </div>

              </div>
            ))}

          </div>
        </Panel>
      </div>

      {/* Report footer */}
      <div className="mt-3 flex items-center justify-between px-1">

        <span className="text-[9px] font-mono text-slate-600">
          REPORT GENERATED FROM CURRENT TELEMETRY
        </span>

        <span className="text-[9px] font-mono text-slate-600">
          NANOPREDICT / EQ-04A
        </span>

      </div>

    </main>
  )
}
