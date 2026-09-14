import Panel from '../components/layout/Panel'
import { useTelemetry } from '../telemetry/useTelemetry'
import { generatePrediction } from '../analytics/PredictionEngine'

function getStatusStyle(status) {
  if (status === 'critical') {
    return {
      text: 'text-rose-400',
      bg: 'bg-rose-400/10',
      border: 'border-rose-400/20',
      dot: 'bg-rose-500',
    }
  }

  if (status === 'warning') {
    return {
      text: 'text-amber-400',
      bg: 'bg-amber-400/10',
      border: 'border-amber-400/20',
      dot: 'bg-amber-400',
    }
  }

  return {
    text: 'text-emerald-400',
    bg: 'bg-emerald-400/10',
    border: 'border-emerald-400/20',
    dot: 'bg-emerald-400',
  }
}

export default function Predictions() {
  const { telemetry } = useTelemetry()

  const prediction = generatePrediction(telemetry)
  const status = getStatusStyle(prediction.status)

  return (
    <main className="flex-1 min-h-0 p-3 overflow-auto">

      {/* Header */}
      <div className="mb-3">
        <h1 className="text-base font-semibold text-slate-100">
          Predictions
        </h1>

        <p className="mt-1 text-[10px] text-slate-500">
          Equipment drift and anomaly forecast
        </p>
      </div>

      {/* Prediction summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">

        <Panel
          title="Current Risk"
          subtitle="Present anomaly risk"
        >
          <div className="p-4">
            <span className="text-3xl font-mono font-semibold text-slate-100">
              {prediction.currentRisk}%
            </span>

            <p className="mt-2 text-[10px] text-slate-500">
              Calculated from current telemetry
            </p>
          </div>
        </Panel>

        <Panel
          title="Predicted Risk"
          subtitle={`Forecast horizon: ${prediction.horizon}`}
        >
          <div className="p-4">
            <span className={`text-3xl font-mono font-semibold ${status.text}`}>
              {prediction.predictedRisk}%
            </span>

            <div className={`mt-2 inline-flex items-center gap-1.5 px-2 py-1 border rounded-full ${status.bg} ${status.border}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />

              <span className={`text-[9px] ${status.text}`}>
                {prediction.status.toUpperCase()}
              </span>
            </div>
          </div>
        </Panel>

        <Panel
          title="Drift Forecast"
          subtitle="Estimated positional deviation"
        >
          <div className="p-4">
            <span className="text-3xl font-mono font-semibold text-slate-100">
              {prediction.driftForecast}
            </span>

            <span className="ml-1 text-[10px] text-slate-500">
              nm
            </span>

            <p className="mt-2 text-[10px] text-slate-500">
              Estimated 24h drift
            </p>
          </div>
        </Panel>

        <Panel
          title="Anomaly Probability"
          subtitle="Multisensor assessment"
        >
          <div className="p-4">
            <span className="text-3xl font-mono font-semibold text-slate-100">
              {prediction.anomalyProbability}%
            </span>

            <p className="mt-2 text-[10px] text-slate-500">
              Based on current conditions
            </p>
          </div>
        </Panel>

      </div>

      {/* Sensor contribution */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-3 mt-3">

        <Panel
          title="Prediction Inputs"
          subtitle="Current sensor conditions"
        >
          <div className="p-4 space-y-3">

            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-500">
                Temperature
              </span>

              <span className="font-mono text-[11px] text-slate-200">
                {telemetry.temperature.valueC.toFixed(1)} °C
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-500">
                Vibration
              </span>

              <span className="font-mono text-[11px] text-slate-200">
                {telemetry.vibration.rmsG.toFixed(2)} g
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-500">
                Vacuum
              </span>

              <span className="font-mono text-[11px] text-slate-200">
                {telemetry.vacuum.pressurePa.toExponential(2)} Pa
              </span>
            </div>

          </div>
        </Panel>

        <Panel
          title="Risk Contribution"
          subtitle="Contribution of each parameter"
        >
          <div className="p-4 space-y-4">

            {[
              ['Temperature', telemetry.risk.contributions.temperature],
              ['Vibration', telemetry.risk.contributions.vibration],
              ['Vacuum', telemetry.risk.contributions.vacuum],
            ].map(([label, value]) => (
              <div key={label}>

                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] text-slate-400">
                    {label}
                  </span>

                  <span className="text-[10px] font-mono text-slate-300">
                    {value}%
                  </span>
                </div>

                <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-cyan-400 transition-all duration-300"
                    style={{ width: `${value}%` }}
                  />
                </div>

              </div>
            ))}

          </div>
        </Panel>

        <Panel
          title="Prediction Status"
          subtitle="Model assessment"
        >
          <div className="p-4">

            <div className={`flex items-center gap-2 ${status.text}`}>
              <span className={`w-2 h-2 rounded-full ${status.dot}`} />

              <span className="text-[11px] font-medium">
                {prediction.status === 'critical'
                  ? 'Immediate attention required'
                  : prediction.status === 'warning'
                    ? 'Monitor equipment condition'
                    : 'Equipment operating normally'}
              </span>
            </div>

            <p className="mt-4 text-[10px] leading-relaxed text-slate-500">
              Prediction is currently generated from live
              multisensor telemetry. A trained ML model can
              replace this engine later without changing the page.
            </p>

          </div>
        </Panel>

      </div>

    </main>
  )
}
