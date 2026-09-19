import React from 'react'
import { Environment, Grid } from '@react-three/drei'

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
  if (riskStatus === 'critical') return 'critical'
  if (riskStatus === 'warning') return 'warning'

  if (Number.isFinite(pressurePa)) {
    if (pressurePa >= 20) return 'critical'
    if (pressurePa >= 10) return 'warning'
  }

  return 'normal'
}

function getDisplacementStatus(driftNm) {
  const value = Math.abs(Number(driftNm) || 0)

  if (value >= 9) return 'critical'
  if (value >= 5.5) return 'warning'

  return 'normal'
}

export default function Scene({
  selectedSubsystem,
  onSelectSubsystem,
}) {
  const telemetry = useTelemetry()
  const { showGrid } = useSettings()

  const positionMm =
    telemetry?.stage?.positionMm ?? 0

  const temperature =
    telemetry?.temperature?.valueC ?? 0

  const vibration =
    telemetry?.vibration?.rmsG ?? 0

  const vacuumPressurePa =
    telemetry?.vacuum?.pressurePa ?? 0

  const vacuumRiskStatus =
    telemetry?.risk?.status ?? 'normal'

  const driftNm =
    telemetry?.distance?.driftNm ?? 0

  const statuses = {
    pressure: getVacuumStatus(
      vacuumPressurePa,
      vacuumRiskStatus
    ),
    vibration: getVibrationStatus(vibration),
    temperature: getTemperatureStatus(temperature),
    displacement: getDisplacementStatus(driftNm),
  }

  return (
    <>
      <color
        attach="background"
        args={['#05080d']}
      />

      <fog
        attach="fog"
        args={['#05080d', 16, 46]}
      />

      {/* Main industrial lighting */}
      <ambientLight
        intensity={0.55}
        color="#2a3550"
      />

      <directionalLight
        position={[8, 11, 6]}
        intensity={1.15}
        color="#dce8ff"
        castShadow
      />

      <directionalLight
        position={[-7, 5, -6]}
        intensity={0.7}
        color="#4fd8ff"
      />

      <pointLight
        position={[0, 3.5, 4]}
        intensity={0.6}
        distance={18}
        color="#3d7fff"
      />

      {/* Floor */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -1.42, 0]}
        receiveShadow
      >
        <planeGeometry args={[60, 60]} />

        <meshStandardMaterial
          color="#070b12"
          roughness={0.85}
          metalness={0.15}
        />
      </mesh>

      {/* Engineering grid */}
      {showGrid !== false && (
        <Grid
          position={[0, -1.40, 0]}
          args={[30, 30]}
          cellSize={0.5}
          cellThickness={0.5}
          cellColor="#173047"
          sectionSize={2.5}
          sectionThickness={1}
          sectionColor="#24506d"
          fadeDistance={18}
          fadeStrength={1.2}
          infiniteGrid
        />
      )}

      {/* =====================================================
          ACTUAL LITHOGRAPHY DIGITAL TWIN

          Live data flow:

          Backend
              ↓
          WebSocket
              ↓
          TelemetryContext
              ↓
          Scene.jsx
              ↓
          LithographyMachine
          ===================================================== */}
      <LithographyMachine
        positionMm={positionMm}
        statuses={statuses}
      />

      <Environment
        preset="warehouse"
        environmentIntensity={0.2}
      />
    </>
  )
}
