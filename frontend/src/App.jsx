import { BrowserRouter, Routes, Route } from 'react-router-dom'

import { TelemetryProvider } from './telemetry/TelemetryContext'
import { SettingsProvider } from './settings/SettingsContext'

import Sidebar from './components/sidebar/Sidebar'
import DashboardHeader from './components/header/DashboardHeader'

import Overview from './pages/Overview'
import DigitalTwinPage from './pages/DigitalTwinPage'
import SensorData from './pages/SensorData'
import Predictions from './pages/Predictions'
import Alerts from './pages/Alerts'
import Reports from './pages/Reports'
import Settings from './pages/Settings'

export default function App() {
  return (
    <SettingsProvider>
      <TelemetryProvider>
        <BrowserRouter>
          <div className="h-screen w-screen overflow-hidden bg-slate-950 text-slate-200 flex">

            <Sidebar />

            <div className="flex-1 min-w-0 min-h-0 flex flex-col overflow-hidden">

              <DashboardHeader />

              <Routes>
                <Route path="/" element={<Overview />} />
                <Route path="/digital-twin" element={<DigitalTwinPage />} />
                <Route path="/sensors" element={<SensorData />} />
                <Route path="/predictions" element={<Predictions />} />
                <Route path="/alerts" element={<Alerts />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/settings" element={<Settings />} />
              </Routes>

            </div>
          </div>
        </BrowserRouter>
      </TelemetryProvider>
    </SettingsProvider>
  )
}
