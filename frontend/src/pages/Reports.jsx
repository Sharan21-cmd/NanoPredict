import { useState } from 'react'
import Panel from '../components/layout/Panel'
import { useTelemetry } from '../telemetry/useTelemetry'
import { generatePrediction } from '../analytics/PredictionEngine'

const REPORT_PERIODS = [
  { value: '1h', label: 'Last 1 Hour' },
  { value: '12h', label: 'Last 12 Hours' },
  { value: '24h', label: 'Last 24 Hours' },
  { value: '7d', label: 'Last 7 Days' },
  { value: '30d', label: 'Last 30 Days' },
  { value: '1y', label: 'Last 1 Year' },
]

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

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')
}

function formatDateTime(date) {
  return new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'medium',
    timeZone: 'Asia/Kolkata',
  }).format(date)
}

function buildReportHtml({
  telemetry,
  prediction,
  riskScore,
  health,
  riskStatus,
  alertCount,
  periodLabel,
}) {
  const generatedAt = formatDateTime(new Date())

  const alerts = telemetry.alerts ?? []

  const alertRows = alerts.length
    ? alerts
        .map(
          (alert) => `
            <tr>
              <td>${escapeHtml(alert.timestamp ?? generatedAt)}</td>
              <td>${escapeHtml(alert.status ?? 'UNKNOWN')}</td>
              <td>${escapeHtml(alert.message ?? '')}</td>
            </tr>
          `,
        )
        .join('')
    : `
        <tr>
          <td colspan="3">No active alerts at report generation time.</td>
        </tr>
      `

  const riskContributions = [
    ['Temperature', telemetry.risk?.contributions?.temperature ?? 0],
    ['Vibration', telemetry.risk?.contributions?.vibration ?? 0],
    ['Vacuum', telemetry.risk?.contributions?.vacuum ?? 0],
    ['Displacement', telemetry.risk?.contributions?.displacement ?? 0],
  ]

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>NanoPredict Equipment Report - EQ-04A</title>
<style>
  * { box-sizing: border-box; }
  body {
    margin: 0;
    padding: 40px;
    background: #f5f7fa;
    color: #172033;
    font-family: Arial, Helvetica, sans-serif;
    line-height: 1.5;
  }
  .page {
    max-width: 900px;
    margin: 0 auto;
    background: white;
    padding: 42px;
    box-shadow: 0 4px 20px rgba(0,0,0,.08);
  }
  .header {
    display: flex;
    justify-content: space-between;
    border-bottom: 2px solid #172033;
    padding-bottom: 20px;
    margin-bottom: 28px;
  }
  h1 { margin: 0; font-size: 28px; }
  h2 {
    margin: 32px 0 14px;
    font-size: 17px;
    border-bottom: 1px solid #d9dee8;
    padding-bottom: 8px;
  }
  .muted { color: #657084; font-size: 12px; }
  .grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
  }
  .card {
    border: 1px solid #d9dee8;
    border-radius: 8px;
    padding: 16px;
  }
  .label {
    color: #657084;
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: .04em;
  }
  .value {
    margin-top: 5px;
    font-size: 24px;
    font-weight: 700;
    font-family: monospace;
  }
  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 12px;
  }
  th, td {
    border: 1px solid #d9dee8;
    padding: 9px;
    text-align: left;
  }
  th { background: #f0f3f7; }
  .note {
    margin-top: 18px;
    padding: 12px;
    background: #f6f8fb;
    border-left: 3px solid #64748b;
    font-size: 11px;
    color: #596579;
  }
  .footer {
    margin-top: 35px;
    padding-top: 15px;
    border-top: 1px solid #d9dee8;
    color: #7b8494;
    font-size: 10px;
  }
  @media print {
    body { background: white; padding: 0; }
    .page { box-shadow: none; max-width: none; }
  }
</style>
</head>
<body>
<div class="page">

  <div class="header">
    <div>
      <h1>NanoPredict</h1>
      <div class="muted">Lithography Equipment Monitoring Report</div>
    </div>
    <div style="text-align:right">
      <div class="label">Equipment</div>
      <strong>EQ-04A</strong>
    </div>
  </div>

  <table>
    <tr>
      <th>Report Period</th>
      <td>${escapeHtml(periodLabel)}</td>
    </tr>
    <tr>
      <th>Generated</th>
      <td>${escapeHtml(generatedAt)} IST</td>
    </tr>
    <tr>
      <th>Telemetry Source</th>
      <td>Live NanoPredict backend</td>
    </tr>
    <tr>
      <th>Data Coverage</th>
      <td>Latest available telemetry snapshot</td>
    </tr>
  </table>

  <h2>1. Equipment Health Summary</h2>

  <div class="grid">
    <div class="card">
      <div class="label">Overall Health</div>
      <div class="value">${escapeHtml(health)}%</div>
    </div>

    <div class="card">
      <div class="label">Risk Score</div>
      <div class="value">${escapeHtml(riskScore)} / 100</div>
    </div>

    <div class="card">
      <div class="label">Risk Level</div>
      <div class="value">${escapeHtml(riskStatus.label)}</div>
    </div>
  </div>

  <h2>2. Current Telemetry</h2>

  <table>
    <tr><th>Parameter</th><th>Value</th></tr>
    <tr><td>Stage Position</td><td>${telemetry.stage.positionMm.toFixed(4)} mm</td></tr>
    <tr><td>Target Position</td><td>${telemetry.stage.targetPositionMm.toFixed(4)} mm</td></tr>
    <tr><td>Stage State</td><td>${telemetry.stage.moving ? 'MOVING' : 'STOPPED'}</td></tr>
    <tr><td>Stage Speed</td><td>${telemetry.stage.speedMmPerSec.toFixed(2)} mm/s</td></tr>
    <tr><td>Laser Distance</td><td>${telemetry.distance.valueMm.toFixed(4)} mm</td></tr>
    <tr><td>Position Drift</td><td>${telemetry.distance.driftNm.toFixed(3)} nm</td></tr>
    <tr><td>Temperature</td><td>${telemetry.temperature.valueC.toFixed(2)} °C</td></tr>
    <tr><td>Vibration</td><td>${telemetry.vibration.rmsG.toFixed(3)} g RMS</td></tr>
    <tr><td>Vacuum Pressure</td><td>${telemetry.vacuum.pressurePa.toExponential(3)} Pa</td></tr>
  </table>

  <h2>3. Prediction</h2>

  <table>
    <tr><th>Parameter</th><th>Value</th></tr>
    <tr><td>Predicted Risk</td><td>${escapeHtml(prediction.predictedRisk)}%</td></tr>
    <tr><td>Prediction Horizon</td><td>${escapeHtml(prediction.horizon)}</td></tr>
    <tr><td>Prediction Status</td><td>${escapeHtml(prediction.status).toUpperCase()}</td></tr>
    <tr><td>Drift Forecast</td><td>${escapeHtml(prediction.driftForecast)} nm</td></tr>
  </table>

  <h2>4. Risk Contribution</h2>

  <table>
    <tr><th>Parameter</th><th>Contribution</th></tr>
    ${riskContributions
      .map(
        ([label, value]) =>
          `<tr><td>${escapeHtml(label)}</td><td>${escapeHtml(value)}%</td></tr>`,
      )
      .join('')}
  </table>

  <h2>5. Active Alerts</h2>

  <table>
    <tr>
      <th>Timestamp</th>
      <th>Severity</th>
      <th>Message</th>
    </tr>
    ${alertRows}
  </table>

  <h2>6. System Assessment</h2>

  <table>
    <tr><th>Metric</th><th>Value</th></tr>
    <tr><td>Equipment</td><td>EQ-04A</td></tr>
    <tr><td>Health</td><td>${escapeHtml(health)}%</td></tr>
    <tr><td>Risk</td><td>${escapeHtml(riskStatus.label)}</td></tr>
    <tr><td>Prediction</td><td>${escapeHtml(prediction.status).toUpperCase()}</td></tr>
    <tr><td>Active Alerts</td><td>${escapeHtml(alertCount)}</td></tr>
  </table>

  <div class="note">
    This report reflects the telemetry available to NanoPredict at generation
    time. Historical periods are represented as the requested reporting window;
    persistent historical telemetry storage is required for complete
    long-range historical charts and measurements.
  </div>

  <div class="footer">
    NanoPredict / EQ-04A<br>
    Automated equipment monitoring report
  </div>

</div>
</body>
</html>`
}

function downloadReport({
  telemetry,
  prediction,
  riskScore,
  health,
  riskStatus,
  alertCount,
  periodLabel,
}) {
  const html = buildReportHtml({
    telemetry,
    prediction,
    riskScore,
    health,
    riskStatus,
    alertCount,
    periodLabel,
  })

  const blob = new Blob([html], {
    type: 'text/html;charset=utf-8',
  })

  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')

  const safePeriod = periodLabel
    .toLowerCase()
    .replaceAll(' ', '-')

  link.href = url
  link.download = `nanopredict-EQ-04A-${safePeriod}-report.html`

  document.body.appendChild(link)
  link.click()
  link.remove()

  URL.revokeObjectURL(url)
}

export default function Reports() {
  const { telemetry } = useTelemetry()

  const [reportPeriod, setReportPeriod] = useState('24h')
  const [reportGenerated, setReportGenerated] = useState(false)

  const prediction = generatePrediction(telemetry)

  const riskScore =
    telemetry.risk?.riskScore ?? 0

  const health =
    telemetry.risk?.health ?? 100

  const riskStatus =
    getStatus(telemetry.risk?.status ?? 'normal')

  const alertCount =
    telemetry.alerts?.length ?? 0

  const selectedPeriod =
    REPORT_PERIODS.find((period) => period.value === reportPeriod) ??
    REPORT_PERIODS[2]

  function handleGenerateReport() {
    setReportGenerated(true)
  }

  function handleDownloadReport() {
    downloadReport({
      telemetry,
      prediction,
      riskScore,
      health,
      riskStatus,
      alertCount,
      periodLabel: selectedPeriod.label,
    })
  }

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

      {/* Report generator */}
      <div className="mb-3">
        <Panel
          title="Generate Equipment Report"
          subtitle="Select a reporting period and generate a downloadable monitoring report"
        >
          <div className="p-4">

            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-3 items-end">

              <div>
                <label
                  htmlFor="report-period"
                  className="block text-[10px] text-slate-500 mb-1.5"
                >
                  REPORT PERIOD
                </label>

                <select
                  id="report-period"
                  value={reportPeriod}
                  onChange={(event) => {
                    setReportPeriod(event.target.value)
                    setReportGenerated(false)
                  }}
                  className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-[11px] text-slate-200 outline-none focus:border-cyan-400/50"
                >
                  {REPORT_PERIODS.map((period) => (
                    <option
                      key={period.value}
                      value={period.value}
                    >
                      {period.label}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                onClick={handleGenerateReport}
                className="px-4 py-2 rounded-md border border-cyan-400/30 bg-cyan-400/10 text-cyan-300 text-[11px] font-medium hover:bg-cyan-400/15 transition"
              >
                Generate Report
              </button>

            </div>

            {reportGenerated && (
              <div className="mt-3 flex flex-col md:flex-row md:items-center md:justify-between gap-3 rounded-md border border-emerald-400/20 bg-emerald-400/5 px-3 py-2.5">

                <div>
                  <p className="text-[10px] text-emerald-300">
                    REPORT READY
                  </p>

                  <p className="mt-0.5 text-[10px] text-slate-500">
                    {selectedPeriod.label} report generated from the latest available telemetry.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleDownloadReport}
                  className="px-4 py-2 rounded-md bg-slate-100 text-slate-900 text-[11px] font-medium hover:bg-white transition"
                >
                  Download Report
                </button>

              </div>
            )}

          </div>
        </Panel>
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
