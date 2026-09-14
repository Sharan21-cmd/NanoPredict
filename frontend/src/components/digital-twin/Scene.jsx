import { Grid, Environment } from '@react-three/drei'

import { useTelemetry } from '../../telemetry/useTelemetry'
import { useSettings } from '../../settings/SettingsContext'

import VacuumChamber from './VacuumChamber'
import LinearRail from './LinearRail'
import MotorCarriage from './MotorCarriage'
import DistanceSensor from './DistanceSensor'
import VibrationSensor from './VibrationSensor'
import PressureSensor from './PressureSensor'
import VacuumTube from './VacuumTube'
import Electronics from './Electronics'
import SensorIndicator from './SensorIndicator'

function getTemperatureStatus(value) {
  if (value >= 35) return 'critical'
  if (value >= 30) return 'warning'
  return 'normal'
}

function getVibrationStatus(value) {
  if (value >= 0.8) return 'critical'
  if (value >= 0.4) return 'warning'
  return 'normal'
}

function getVacuumStatus(riskStatus) {
  if (riskStatus === 'critical') return 'critical'
  if (riskStatus === 'warning') return 'warning'
  return 'normal'
}

export default function Scene() {
  const { telemetry } = useTelemetry()
  const { settings } = useSettings()

  const temperatureStatus = getTemperatureStatus(
    telemetry.temperature.valueC
  )

  const vibrationStatus = getVibrationStatus(
    telemetry.vibration.rmsG
  )

  const vacuumStatus = getVacuumStatus(telemetry.risk?.status)

  return (
    <>
      {/* Background */}
      <color attach="background" args={['#10141b']} />

      {/* Lighting */}
      <ambientLight intensity={0.62} />

      <hemisphereLight
        intensity={0.45}
        groundColor="#080b10"
        color="#e0f2fe"
      />

      <directionalLight
        position={[4, 7, 5]}
        intensity={1.45}
        color="#f8fafc"
        castShadow
      />

      <directionalLight
        position={[-4, 4, -3]}
        intensity={0.55}
        color="#67e8f9"
      />

      {/* Technical floor grid */}
      {settings.showGrid && (
        <Grid
          position={[0, -0.205, 0]}
          args={[20, 20]}
          cellSize={0.5}
          cellThickness={0.45}
          cellColor="#263342"
          sectionSize={2.5}
          sectionThickness={0.9}
          sectionColor="#425468"
          fadeDistance={18}
          fadeStrength={1}
          infiniteGrid
        />
      )}

      {/* Physical prototype */}
      <VacuumChamber />

      <LinearRail />

      {/* Moving carriage */}
      <MotorCarriage
        positionMm={telemetry.stage.positionMm}
      >
        <DistanceSensor />

        <VibrationSensor />

        {settings.showSensorIndicators && (
          <SensorIndicator
            status={vibrationStatus}
            label="MPU6050"
            value={telemetry.vibration.rmsG}
            position={[0.12, 0.48, -0.13]}
            size={0.055}
          />
        )}
      </MotorCarriage>

      {/* BMP280 */}
      <PressureSensor />

      {settings.showSensorIndicators && (
        <SensorIndicator
          status={vacuumStatus}
          label="BMP280"
          value={telemetry.vacuum.pressurePa}
          position={[0.78, 1.25, -0.56]}
          size={0.055}
        />
      )}

      {/* Vacuum */}
      <VacuumTube />

      {/* Electronics */}
      <Electronics />

      {/* Temperature */}
      {settings.showSensorIndicators && (
        <SensorIndicator
          status={temperatureStatus}
          label="TEMP-01"
          value={telemetry.temperature.valueC}
          position={[0.55, 1.35, -0.92]}
          size={0.055}
        />
      )}

      <group name="sensor-overlay-anchor" />

      <Environment
        preset="warehouse"
        environmentIntensity={0.20}
      />
    </>
  )
}
