import DigitalTwin from '../components/digital-twin/DigitalTwin'
import EquipmentHealth from '../components/metrics/EquipmentHealth'
import RiskScorePanel from '../components/metrics/RiskScorePanel'
import KeyParameters from '../components/metrics/KeyParameters'
import ActiveAlerts from '../components/system/ActiveAlerts'
import SystemLog from '../components/system/SystemLog'
import LiveSensorReadings from '../components/charts/LiveSensorReadings'
import TrendAnalysis from '../components/charts/TrendAnalysis'

export default function Overview() {
  return (
    <main className="flex-1 min-w-0 min-h-0 overflow-y-auto p-2.5">

      {/* ================= TOP AREA ================= */}
      <section
        className="
          w-full
          min-w-0
          h-[650px]
          shrink-0
          grid
          grid-cols-1
          xl:grid-cols-[minmax(0,1.65fr)_430px]
          gap-2.5
        "
      >

        {/* DIGITAL TWIN */}
        <div className="min-w-0 min-h-0 h-full">
          <DigitalTwin />
        </div>

        {/* RIGHT INFORMATION COLUMN */}
        <div
          className="
            min-w-0
            min-h-0
            h-full
            grid
            grid-rows-[170px_310px_150px]
            gap-2.5
          "
        >

          {/* Health + Risk */}
          <div className="min-w-0 min-h-0 grid grid-cols-2 gap-2.5">
            <div className="min-w-0 min-h-0">
              <EquipmentHealth />
            </div>

            <div className="min-w-0 min-h-0">
              <RiskScorePanel />
            </div>
          </div>

          {/* Key Parameters */}
          <div className="min-w-0 min-h-0">
            <KeyParameters />
          </div>

          {/* Active Alerts */}
          <div className="min-w-0 min-h-0">
            <ActiveAlerts />
          </div>

        </div>
      </section>

      {/* ================= LIVE SENSOR READINGS ================= */}
      <section className="w-full min-w-0 h-[180px] mt-2.5 shrink-0">
        <LiveSensorReadings />
      </section>

      {/* ================= TREND ANALYSIS ================= */}
      <section className="w-full min-w-0 h-[320px] mt-2.5 shrink-0">
        <TrendAnalysis />
      </section>

      {/* ================= SYSTEM LOG ================= */}
      <section className="w-full min-w-0 h-[220px] mt-2.5 shrink-0">
        <SystemLog />
      </section>

    </main>
  )
}
