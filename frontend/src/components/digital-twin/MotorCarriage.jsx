import { useMemo } from 'react'
import { RAIL_CONFIG } from './LinearRail'

const MIN_POSITION_MM = 0
const MAX_POSITION_MM = 100

function mapPositionToRail(positionMm) {
  const clamped = Math.max(
    MIN_POSITION_MM,
    Math.min(MAX_POSITION_MM, positionMm)
  )

  const normalized =
    (clamped - MIN_POSITION_MM) /
    (MAX_POSITION_MM - MIN_POSITION_MM)

  return (
    -RAIL_CONFIG.length / 2 +
    0.30 +
    normalized *
      (RAIL_CONFIG.length - 0.60)
  )
}

export default function MotorCarriage({
  positionMm = 0,
  children,
}) {
  const xPosition = useMemo(
    () => mapPositionToRail(positionMm),
    [positionMm]
  )

  return (
    <group
      position={[
        RAIL_CONFIG.xOffset,
        RAIL_CONFIG.y,
        RAIL_CONFIG.z,
      ]}
    >
      <group position={[xPosition, 0, 0]}>
        {/* Main carriage body */}
        <mesh position={[0, 0.14, 0]} castShadow>
          <boxGeometry args={[0.42, 0.27, 0.46]} />
          <meshStandardMaterial
            color="#59616b"
            metalness={0.88}
            roughness={0.25}
          />
        </mesh>

        {/* Motor cylinder */}
        <mesh
          position={[0, 0.30, -0.04]}
          rotation={[Math.PI / 2, 0, 0]}
          castShadow
        >
          <cylinderGeometry
            args={[0.115, 0.115, 0.30, 24]}
          />
          <meshStandardMaterial
            color="#313740"
            metalness={0.92}
            roughness={0.23}
          />
        </mesh>

        {/* Front coupler */}
        <mesh position={[0, 0.15, 0.24]}>
          <cylinderGeometry
            args={[0.08, 0.08, 0.08, 20]}
          />
          <meshStandardMaterial
            color="#a1a9b2"
            metalness={0.95}
            roughness={0.18}
          />
        </mesh>

        {/* Mounting brackets */}
        <mesh position={[0.15, 0.015, 0.17]}>
          <boxGeometry args={[0.07, 0.07, 0.08]} />
          <meshStandardMaterial
            color="#262b32"
            metalness={0.78}
            roughness={0.34}
          />
        </mesh>

        <mesh position={[-0.15, 0.015, 0.17]}>
          <boxGeometry args={[0.07, 0.07, 0.08]} />
          <meshStandardMaterial
            color="#262b32"
            metalness={0.78}
            roughness={0.34}
          />
        </mesh>

        {children}
      </group>
    </group>
  )
}
