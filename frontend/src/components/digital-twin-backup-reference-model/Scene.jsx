import { Grid, Environment } from '@react-three/drei'

import { useTelemetry } from '../../telemetry/useTelemetry'
import { useSettings } from '../../settings/SettingsContext'

import MachineFrame from './MachineFrame'
import VacuumChamber from './VacuumChamber'
import LinearRail from './LinearRail'
import MotorCarriage from './MotorCarriage'
import OpticalModule from './OpticalModule'
import VibrationIsolation from './VibrationIsolation'

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

export default function Scene({
  selectedSubsystem,
  onSelectSubsystem,
}) {
  const { telemetry } = useTelemetry()
  const { settings } = useSettings()

  const temperatureStatus = getTemperatureStatus(
    telemetry.temperature.valueC
  )

  const vibrationStatus = getVibrationStatus(
    telemetry.vibration.rmsG
  )

  const vacuumStatus = getVacuumStatus(
    telemetry.risk?.status
  )

  const stagePosition = telemetry.stage.positionMm ?? 0

  const temperatureValue =
    Number.isFinite(telemetry.temperature.valueC)
      ? `${telemetry.temperature.valueC.toFixed(1)} °C`
      : '--'

  const vibrationValue =
    Number.isFinite(telemetry.vibration.rmsG)
      ? `${telemetry.vibration.rmsG.toFixed(3)} g`
      : '--'

  const vacuumValue =
    Number.isFinite(telemetry.vacuum.pressurePa)
      ? `${telemetry.vacuum.pressurePa.toFixed(1)} Pa`
      : '--'

  const positionValue =
    Number.isFinite(stagePosition)
      ? `${stagePosition.toFixed(2)} mm`
      : '--'

  return (
    <>
      {/* =====================================================
          INDUSTRIAL ENVIRONMENT
         ===================================================== */}

      <color
        attach="background"
        args={['#070b10']}
      />

      <ambientLight intensity={0.58} />

      <hemisphereLight
        intensity={0.42}
        groundColor="#05070a"
        color="#dff6ff"
      />

      <directionalLight
        position={[5, 8, 6]}
        intensity={1.55}
        color="#f8fafc"
        castShadow
      />

      <directionalLight
        position={[-5, 5, -4]}
        intensity={0.65}
        color="#67e8f9"
      />

      <pointLight
        position={[0, 2.8, 0]}
        intensity={0.35}
        color="#22d3ee"
      />

      {/* =====================================================
          TECHNICAL FLOOR
         ===================================================== */}

      {settings.showGrid && (
        <Grid
          position={[0, -0.205, 0]}
          args={[20, 20]}
          cellSize={0.5}
          cellThickness={0.45}
          cellColor="#1d2a36"
          sectionSize={2.5}
          sectionThickness={0.9}
          sectionColor="#33485a"
          fadeDistance={18}
          fadeStrength={1}
          infiniteGrid
        />
      )}

      {/* =====================================================
          MAIN MACHINE STRUCTURE
         ===================================================== */}

      <MachineFrame
        selected={selectedSubsystem === 'frame'}
        onSelect={onSelectSubsystem}
      />

      {/* =====================================================
          VACUUM CHAMBER
         ===================================================== */}

      <VacuumChamber
        status={vacuumStatus}
        selected={selectedSubsystem === 'vacuum'}
        onSelect={onSelectSubsystem}
      />

      {/* =====================================================
          PRECISION POSITIONING SYSTEM
         ===================================================== */}

      <LinearRail
        selected={selectedSubsystem === 'positioning'}
        onSelect={onSelectSubsystem}
      />

      {/* =====================================================
          MOVING WAFER STAGE
         ===================================================== */}

      <MotorCarriage
        positionMm={stagePosition}
        selected={selectedSubsystem === 'stage'}
        onSelect={onSelectSubsystem}
      >
        <DistanceSensor />

        <VibrationSensor />

        {settings.showSensorIndicators && (
          <SensorIndicator
            status={vibrationStatus}
            label="MPU6050"
            value={vibrationValue}
            position={[0.12, 0.48, -0.13]}
            size={0.055}
          />
        )}
      </MotorCarriage>

      {/* =====================================================
          OPTICAL / LITHOGRAPHY MODULE
         ===================================================== */}

      <OpticalModule
        positionMm={stagePosition}
        selected={selectedSubsystem === 'optical'}
        onSelect={onSelectSubsystem}
      />

      {/* =====================================================
          VIBRATION ISOLATION
         ===================================================== */}

      <VibrationIsolation
        status={vibrationStatus}
        selected={selectedSubsystem === 'vibration'}
        onSelect={onSelectSubsystem}
      />

      {/* =====================================================
          VACUUM / PRESSURE SENSOR
         ===================================================== */}

      <PressureSensor />

      {settings.showSensorIndicators && (
        <SensorIndicator
          status={vacuumStatus}
          label="BMP280"
          value={vacuumValue}
          position={[0.78, 1.25, -0.56]}
          size={0.055}
        />
      )}

      <VacuumTube />

      {/* =====================================================
          ELECTRONICS / DAQ
         ===================================================== */}

      <Electronics
        selected={selectedSubsystem === 'electronics'}
        onSelect={onSelectSubsystem}
      />

      {/* =====================================================
          TEMPERATURE SENSOR
         ===================================================== */}

      {settings.showSensorIndicators && (
        <SensorIndicator
          status={temperatureStatus}
          label="TEMP-01"
          value={temperatureValue}
          position={[0.55, 1.35, -0.92]}
          size={0.055}
        />
      )}

      {/* Existing overlay anchor preserved */}
      <group name="sensor-overlay-anchor" />

      {/* =====================================================
          HDR ENVIRONMENT
         ===================================================== */}

      <Environment
        preset="warehouse"
        environmentIntensity={0.20}
      />
    </>
  )
}
