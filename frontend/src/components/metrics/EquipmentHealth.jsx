import Panel from '../layout/Panel'
import HealthGauge from './HealthGauge'
import { useTelemetry } from '../../telemetry/useTelemetry'

export default function EquipmentHealth() {
  const { telemetry } = useTelemetry()

  const health = telemetry.risk?.health ?? 100

  return (
    <Panel
      title="Equipment Health"
      subtitle="Predictive equipment status"
      className="h-full min-h-0"
    >
      <div className="h-full min-h-0 flex flex-col">

        {/* Gauge area */}
        <div className="flex flex-1 min-h-0 flex-col items-center justify-center px-2 py-1">
          <div className="w-[104px] h-[104px] shrink-0">
            <HealthGauge health={health} />
          </div>
        </div>

        {/* Status footer */}
        <div className="shrink-0 px-3 py-2 border-t border-slate-800">
          <div className="flex items-center justify-between">

            <span className="flex items-center gap-1.5 text-[9px] text-slate-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Normal
            </span>

            <span className="font-mono text-[9px] text-slate-300">
              94%
            </span>

          </div>
        </div>

      </div>
    </Panel>
  )
}
