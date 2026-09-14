import DigitalTwin from '../components/digital-twin/DigitalTwin'
import MotorControl from '../components/controls/MotorControl'
import EnvironmentControl from '../components/controls/EnvironmentControl'

export default function DigitalTwinPage() {
  return (
    <main className="flex-1 min-h-0 p-2 overflow-hidden">
      <div className="h-full grid grid-cols-[minmax(0,1fr)_280px] gap-2">

        {/* 3D Digital Twin */}
        <div className="min-w-0 min-h-0">
          <DigitalTwin />
        </div>

        {/* Controls */}
        <div className="min-w-0 min-h-0 overflow-y-auto">
          <div className="space-y-2">

            {/* Motor */}
            <MotorControl />

            {/* Environment immediately below */}
            <EnvironmentControl />

          </div>
        </div>

      </div>
    </main>
  )
}
