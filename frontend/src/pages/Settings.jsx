import Panel from '../components/layout/Panel'
import { useSettings } from '../settings/SettingsContext'

function Toggle({
  enabled,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={enabled}
      className={`relative w-10 h-5 rounded-full border transition-colors ${
        enabled
          ? 'bg-cyan-400/20 border-cyan-400/30'
          : 'bg-slate-950 border-slate-800'
      }`}
    >
      <span
        className={`absolute top-0.5 w-4 h-4 rounded-full transition-all ${
          enabled
            ? 'left-5 bg-cyan-400'
            : 'left-0.5 bg-slate-600'
        }`}
      />
    </button>
  )
}

export default function Settings() {
  const {
    settings,
    setTheme,
    setShowGrid,
    setShowSensorIndicators,
  } = useSettings()

  return (
    <main className="flex-1 min-w-0 min-h-0 overflow-y-auto p-3">

      {/* Page heading */}
      <div className="mb-3">
        <h1 className="text-base font-semibold text-slate-100">
          Settings
        </h1>

        <p className="mt-1 text-[10px] text-slate-500">
          NanoPredict system and digital-twin configuration
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">

        {/* ================= SYSTEM ================= */}
        <Panel
          title="System Configuration"
          subtitle="Equipment and telemetry settings"
        >
          <div className="p-4 space-y-3">

            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-500">
                Equipment ID
              </span>

              <span className="text-[10px] font-mono text-slate-200">
                EQ-04A
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-500">
                Operating Mode
              </span>

              <span className="text-[10px] font-mono text-cyan-400">
                LIVE BACKEND
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-500">
                Telemetry Rate
              </span>

              <span className="text-[10px] font-mono text-slate-200">
                20 Hz
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-500">
                Connection
              </span>

              <span className="flex items-center gap-1.5 text-[9px] text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                ONLINE
              </span>
            </div>

          </div>
        </Panel>

        {/* ================= APPEARANCE ================= */}
        <Panel
          title="Appearance"
          subtitle="Dashboard visual preferences"
        >
          <div className="p-4 space-y-4">

            {/* Theme */}
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="text-[10px] text-slate-300">
                  Theme
                </p>

                <p className="text-[9px] text-slate-600">
                  Current dashboard theme
                </p>
              </div>

              <div className="flex gap-1 shrink-0">

                <button
                  type="button"
                  onClick={() => setTheme('dark')}
                  className={`px-3 py-1.5 text-[9px] rounded-sm border transition-colors ${
                    settings.theme === 'dark'
                      ? 'border-cyan-400/30 bg-cyan-400/10 text-cyan-400'
                      : 'border-slate-800 text-slate-500 hover:text-slate-300'
                  }`}
                >
                  Dark
                </button>

                <button
                  type="button"
                  onClick={() => setTheme('light')}
                  className={`px-3 py-1.5 text-[9px] rounded-sm border transition-colors ${
                    settings.theme === 'light'
                      ? 'border-cyan-400/30 bg-cyan-400/10 text-cyan-400'
                      : 'border-slate-800 text-slate-500 hover:text-slate-300'
                  }`}
                >
                  Light
                </button>

              </div>
            </div>

            {/* Accent */}
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="text-[10px] text-slate-300">
                  Accent
                </p>

                <p className="text-[9px] text-slate-600">
                  Interface highlight color
                </p>
              </div>

              <div className="flex gap-1.5 shrink-0">
                <span className="w-5 h-5 rounded-full bg-cyan-400 border-2 border-slate-200" />
                <span className="w-5 h-5 rounded-full bg-blue-500" />
                <span className="w-5 h-5 rounded-full bg-emerald-400" />
              </div>
            </div>

          </div>
        </Panel>

        {/* ================= DIGITAL TWIN ================= */}
        <Panel
          title="Digital Twin"
          subtitle="3D visualization controls"
        >
          <div className="p-4 space-y-4">

            {/* Sensor indicators */}
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="text-[10px] text-slate-300">
                  Sensor Indicators
                </p>

                <p className="text-[9px] text-slate-600">
                  Show live sensor status in 3D
                </p>
              </div>

              <Toggle
                enabled={settings.showSensorIndicators}
                onClick={() =>
                  setShowSensorIndicators(
                    !settings.showSensorIndicators
                  )
                }
              />
            </div>

            {/* Technical grid */}
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="text-[10px] text-slate-300">
                  Technical Grid
                </p>

                <p className="text-[9px] text-slate-600">
                  Show engineering reference grid
                </p>
              </div>

              <Toggle
                enabled={settings.showGrid}
                onClick={() =>
                  setShowGrid(!settings.showGrid)
                }
              />
            </div>

            {/* Auto animation */}
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="text-[10px] text-slate-300">
                  Auto Animation
                </p>

                <p className="text-[9px] text-slate-600">
                  Automatic stage movement
                </p>
              </div>

              <span className="px-2 py-1 rounded-full border border-slate-800 bg-slate-950 text-[9px] text-slate-500 shrink-0">
                OFF
              </span>
            </div>

          </div>
        </Panel>

        {/* ================= SENSOR THRESHOLDS ================= */}
        <Panel
          title="Sensor Thresholds"
          subtitle="Current warning and critical limits"
        >
          <div className="p-4">

            <div className="grid grid-cols-3 gap-2 pb-2 border-b border-slate-800">
              <span className="text-[9px] text-slate-600">
                Sensor
              </span>

              <span className="text-[9px] text-slate-600">
                Warning
              </span>

              <span className="text-[9px] text-slate-600">
                Critical
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 py-3 border-b border-slate-800">
              <span className="text-[10px] text-slate-400">
                Temperature
              </span>

              <span className="text-[10px] font-mono text-amber-400">
                30 °C
              </span>

              <span className="text-[10px] font-mono text-rose-400">
                35 °C
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 py-3 border-b border-slate-800">
              <span className="text-[10px] text-slate-400">
                Vibration
              </span>

              <span className="text-[10px] font-mono text-amber-400">
                0.40 g
              </span>

              <span className="text-[10px] font-mono text-rose-400">
                0.80 g
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 py-3">
              <span className="text-[10px] text-slate-400">
                Vacuum
              </span>

              <span className="text-[10px] font-mono text-amber-400">
                4e-6 Pa
              </span>

              <span className="text-[10px] font-mono text-rose-400">
                8e-6 Pa
              </span>
            </div>

          </div>
        </Panel>

        {/* ================= DATA SOURCE ================= */}
        <Panel
          title="Data Source"
          subtitle="Telemetry connection status"
        >
          <div className="p-4">

            <div className="flex items-center gap-2">
              <span className="relative flex w-2 h-2">
                <span className="absolute w-full h-full rounded-full bg-emerald-400 opacity-50 animate-ping" />

                <span className="relative w-2 h-2 rounded-full bg-emerald-400" />
              </span>

              <span className="text-[11px] text-emerald-400">
                BACKEND CONNECTED
              </span>
            </div>

            <p className="mt-3 text-[10px] leading-relaxed text-slate-500">
              NanoPredict is currently receiving live telemetry
              from the backend WebSocket. The same interface can
              later receive data from the physical prototype controller.
            </p>

          </div>
        </Panel>

      </div>

    </main>
  )
}
