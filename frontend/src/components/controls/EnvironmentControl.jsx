import Panel from '../layout/Panel'
import { useTelemetry } from '../../telemetry/useTelemetry'

export default function EnvironmentControl() {
  const {
    telemetry,
    setTemperatureMode,
    setVibrationMode,
    setVacuumMode,
    normalizeSensors,
  } = useTelemetry()

  return (
    <Panel
      title="Environment Control"
      subtitle="Live sensor conditions"
      className="h-auto"
    >
      <div className="p-3 space-y-4">

        {/* Temperature */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-[10px] font-medium text-slate-300">
                Temperature
              </p>

              <p className="text-[9px] text-slate-600">
                TEMP-01
              </p>
            </div>

            <span className="font-mono text-[11px] text-slate-200">
              {telemetry.temperature.valueC.toFixed(1)} °C
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setTemperatureMode('normal')}
              className="py-2 border border-slate-800 bg-slate-950 text-[9px] text-slate-400 hover:text-slate-200 hover:border-slate-600 rounded-sm"
            >
              NORMAL
            </button>

            <button
              type="button"
              onClick={() => setTemperatureMode('heat')}
              className="py-2 border border-amber-400/20 bg-amber-400/5 text-[9px] text-amber-400 hover:bg-amber-400/10 rounded-sm"
            >
              HEAT SENSOR
            </button>
          </div>
        </div>

        {/* Vibration */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-[10px] font-medium text-slate-300">
                Vibration
              </p>

              <p className="text-[9px] text-slate-600">
                MPU6050
              </p>
            </div>

            <span className="font-mono text-[11px] text-slate-200">
              {telemetry.vibration.rmsG.toFixed(2)} g
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setVibrationMode('normal')}
              className="py-2 border border-slate-800 bg-slate-950 text-[9px] text-slate-400 hover:text-slate-200 hover:border-slate-600 rounded-sm"
            >
              NORMAL
            </button>

            <button
              type="button"
              onClick={() => setVibrationMode('shake')}
              className="py-2 border border-rose-400/20 bg-rose-400/5 text-[9px] text-rose-400 hover:bg-rose-400/10 rounded-sm"
            >
              SHAKE MOTOR
            </button>
          </div>
        </div>

        {/* Vacuum */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-[10px] font-medium text-slate-300">
                Vacuum
              </p>

              <p className="text-[9px] text-slate-600">
                BMP280
              </p>
            </div>

            <span className="font-mono text-[11px] text-slate-200">
              {telemetry.vacuum.pressurePa.toExponential(2)} Pa
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setVacuumMode('normal')}
              className="py-2 border border-slate-800 bg-slate-950 text-[9px] text-slate-400 hover:text-slate-200 hover:border-slate-600 rounded-sm"
            >
              NORMAL
            </button>

            <button
              type="button"
              onClick={() => setVacuumMode('leak')}
              className="py-2 border border-amber-400/20 bg-amber-400/5 text-[9px] text-amber-400 hover:bg-amber-400/10 rounded-sm"
            >
              VACUUM LEAK
            </button>
          </div>
        </div>

        {/* Normalize */}
        <button
          type="button"
          onClick={normalizeSensors}
          className="w-full py-2.5 border border-cyan-400/20 bg-cyan-400/5 text-[9px] font-medium text-cyan-400 hover:bg-cyan-400/10 rounded-sm"
        >
          RESTORE NORMAL CONDITIONS
        </button>

      </div>
    </Panel>
  )
}
