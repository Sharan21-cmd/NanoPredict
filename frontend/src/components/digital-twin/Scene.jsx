import { Grid, Environment } from '@react-three/drei'

import { useTelemetry } from '../../telemetry/useTelemetry'
import { useSettings } from '../../settings/SettingsContext'

import LithographyMachine from './LithographyMachine'

function getTemperatureStatus(value) {
  if (!Number.isFinite(value)) return 'normal'

  if (value >= 35) return 'critical'
  if (value >= 30) return 'warning'

  return 'normal'
}

function getVibrationStatus(value) {
  if (!Number.isFinite(value)) return 'normal'

  if (value >= 0.8) return 'critical'
  if (value >= 0.4) return 'warning'

  return 'normal'
}

function getVacuumStatus(pressurePa, riskStatus) {
  /*
   * Keep the existing backend risk state as the primary
   * vacuum-health signal.
   */
  if (riskStatus === 'critical') return 'critical'
  if (riskStatus === 'warning') return 'warning'

  /*
   * Fallback pressure interpretation.
   * Existing telemetry is already converted to Pa.
   */
  if (Number.isFinite(pressurePa)) {
    if (pressurePa >= 20) return 'critical'
    if (pressurePa >= 10) return 'warning'
  }

  return 'normal'
}

function getDisplacementStatus(driftNm) {
  if (!Number.isFinite(driftNm)) return 'normal'

  const absoluteDrift = Math.abs(driftNm)

  if (absoluteDrift >= 9) return 'critical'
  if (absoluteDrift >= 5.5) return 'warning'

  return 'normal'
}

export default function Scene({
  selectedSubsystem,
  onSelectSubsystem,
}) {
  const { telemetry } = useTelemetry()
  const { settings } = useSettings()

  const temperature = telemetry?.temperature?.valueC
  const vibration = telemetry?.vibration?.rmsG
  const pressure = telemetry?.vacuum?.pressurePa
  const driftNm = telemetry?.distance?.driftNm

  const riskStatus =
    telemetry?.risk?.status?.toLowerCase?.() || 'normal'

  /*
   * These statuses are derived from the SAME live telemetry
   * already used by NanoPredict.
   */
  const statuses = {
    temperature: getTemperatureStatus(temperature),

    vibration: getVibrationStatus(vibration),

    vacuum: getVacuumStatus(
      pressure,
      riskStatus,
    ),

    displacement: getDisplacementStatus(driftNm),
  }

  /*
   * IMPORTANT:
   *
   * This is the existing backend motor position.
   *
   * The new LithographyMachine passes this value to the
   * motor-driven UV assembly.
   *
   * No second motor simulation exists here.
   */
  const positionMm =
    Number.isFinite(telemetry?.stage?.positionMm)
      ? telemetry.stage.positionMm
      : 0

  return (
    <>
      {/* =====================================================
          BACKGROUND
         ===================================================== */}

      <color
        attach="background"
        args={['#070b10']}
      />

      {/* =====================================================
          INDUSTRIAL LIGHTING
         ===================================================== */}

      <ambientLight intensity={0.52} />

      <hemisphereLight
        intensity={0.4}
        groundColor="#05070a"
        color="#dff6ff"
      />

      <directionalLight
        position={[5, 8, 6]}
        intensity={1.5}
        color="#f8fafc"
        castShadow
      />

      <pointLight
        position={[0, 4.5, 1]}
        intensity={1.2}
        color="#38bdf8"
        distance={8}
      />

      <pointLight
        position={[0, 2.2, -3]}
        intensity={0.8}
        color="#2563eb"
        distance={7}
      />

      {/* =====================================================
          FLOOR
         ===================================================== */}

      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.25, 0]}
        receiveShadow
      >
        <planeGeometry args={[12, 12]} />

        <meshStandardMaterial
          color="#050a10"
          metalness={0.25}
          roughness={0.65}
        />
      </mesh>

      {/* Engineering grid */}
      {settings?.showGrid !== false && (
        <Grid
          position={[0, -0.23, 0]}
          args={[12, 12]}
          cellSize={0.5}
          cellThickness={0.55}
          cellColor="#123044"
          sectionSize={2}
          sectionThickness={0.8}
          sectionColor="#1b536d"
          fadeDistance={9}
          fadeStrength={1}
          infiniteGrid
        />
      )}

      {/* =====================================================
          LITHOGRAPHY EQUIPMENT
         ===================================================== */}

      <LithographyMachine
        positionMm={positionMm}
        statuses={statuses}
      />

      {/* =====================================================
          ENVIRONMENT
         ===================================================== */}

      <Environment
        preset="warehouse"
        background={false}
        blur={0.7}
      />
    </>
  )
}
