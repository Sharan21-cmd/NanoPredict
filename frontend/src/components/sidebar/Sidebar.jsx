import { NavLink } from 'react-router-dom'
import { useTelemetry } from '../../telemetry/useTelemetry'

const NAV_ITEMS = [
  { label: 'Overview', icon: '⌂', path: '/' },
  { label: '3D Digital Twin', icon: '◇', path: '/digital-twin' },
  { label: 'Sensor Data', icon: '▣', path: '/sensors' },
  { label: 'Predictions', icon: '⌁', path: '/predictions' },
  { label: 'Alerts', icon: '⚠', path: '/alerts' },
  { label: 'Reports', icon: '▤', path: '/reports' },
]

export default function Sidebar() {
  const { telemetry } = useTelemetry()

  const alertCount = telemetry.alerts?.length ?? 0

  return (
    <aside className="hidden lg:flex w-48 shrink-0 h-full flex-col border-r border-slate-800 bg-slate-950">

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1">

        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            className={({ isActive }) =>
              `w-full flex items-center gap-3 px-3 py-2.5 rounded-sm text-left transition-colors ${
                isActive
                  ? 'bg-blue-600/20 text-blue-300 border border-blue-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`
            }
          >
            <span className="w-5 text-center text-sm">
              {item.icon}
            </span>

            <span className="text-[11px] font-medium flex-1">
              {item.label}
            </span>

            {/* Dynamic alert count */}
            {item.path === '/alerts' && alertCount > 0 && (
              <span className="min-w-5 h-5 px-1 flex items-center justify-center rounded-full bg-rose-500 text-white text-[9px] font-bold">
                {alertCount}
              </span>
            )}
          </NavLink>
        ))}

      </nav>

      {/* Bottom section */}
      <div className="p-3 border-t border-slate-800">

        {/* Existing Settings icon/button now navigates to Settings */}
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `w-full flex items-center gap-3 px-3 py-2.5 rounded-sm transition-colors ${
              isActive
                ? 'bg-blue-600/20 text-blue-300 border border-blue-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`
          }
        >
          <span className="w-5 text-center text-sm">
            ⚙
          </span>

          <span className="text-[11px] font-medium">
            Settings
          </span>
        </NavLink>

        <div className="mt-4 px-3">
          <p className="text-[10px] font-semibold text-slate-300">
            NanoPredict
          </p>

          <p className="text-[9px] text-slate-600 mt-1">
            Lithography Equipment
          </p>

          <p className="text-[9px] text-slate-600">
            Digital Twin Prototype
          </p>
        </div>

      </div>
    </aside>
  )
}
