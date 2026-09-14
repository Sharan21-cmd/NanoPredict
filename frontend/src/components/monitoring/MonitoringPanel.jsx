import Panel from '../layout/Panel'
import SensorCard from './SensorCard'
import { useTelemetryContext } from '../../telemetry/TelemetryContext'

export default function MonitoringPanel() {
  const { telemetry } = useTelemetryContext()

  const sensors = [
    {
      id: 'position-drift',
      label: 'Position Drift',
      value: telemetry.distance?.driftNm ?? 0,
      unit: 'nm',
      precision: 3,
      status: telemetry.risk?.status ?? 'normal',
      trend: 'stable',
      delta: 0,
      description: 'Sub-nanometer laser displacement drift',
    },
    {
      id: 'vibration',
      label: 'Vibration',
      value: telemetry.vibration?.rmsG ?? 0,
      unit: 'g',
      precision: 3,
      status:
        (telemetry.vibration?.rmsG ?? 0) > 0.5
          ? 'critical'
          : 'normal',
      trend: 'stable',
      delta: 0,
      description: 'Motor vibration acceleration',
    },
    {
      id: 'temperature',
      label: 'Temperature',
      value: telemetry.temperature?.valueC ?? 0,
      unit: '°C',
      precision: 2,
      status:
        (telemetry.temperature?.valueC ?? 0) > 30
          ? 'warning'
          : 'normal',
      trend: 'stable',
      delta: 0,
      description: 'Equipment operating temperature',
    },
    {
      id: 'vacuum',
      label: 'Vacuum Pressure',
      value: telemetry.vacuum?.pressurePa ?? 0,
      unit: 'Pa',
      precision: 2,
      status:
        (telemetry.vacuum?.pressurePa ?? 0) > 0.05
          ? 'critical'
          : 'normal',
      trend: 'stable',
      delta: 0,
      description: 'Chamber vacuum pressure',
      isScientific: true,
    },
  ]

  return (
    <Panel
      title="Sensor Telemetry"
      subtitle="Live process parameters"
      className="h-full"
    >
      <div className="p-3 space-y-2.5 overflow-y-auto h-full">
        {sensors.map((sensor) => (
          <SensorCard
            key={sensor.id}
            sensor={sensor}
          />
        ))}
      </div>
    </Panel>
  )
}
