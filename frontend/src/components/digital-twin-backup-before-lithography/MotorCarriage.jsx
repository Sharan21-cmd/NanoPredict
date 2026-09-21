import { useMemo } from 'react'
import { RAIL_CONFIG } from './LinearRail'
import SubsystemLabel from './SubsystemLabel'
import WaferDisk from './WaferDisk'

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
    normalized * (RAIL_CONFIG.length - 0.60)
  )
}

export default function MotorCarriage({
  positionMm = 0,
  children,
  selected = false,
  onSelect,
}) {
  const xPosition = useMemo(
    () => mapPositionToRail(positionMm),
    [positionMm]
  )

  const handleSelect = (event) => {
    event.stopPropagation()
    onSelect?.('stage')
  }

  return (
    <group
      position={[
        RAIL_CONFIG.xOffset,
        RAIL_CONFIG.y,
        RAIL_CONFIG.z,
      ]}
    >
      <group
        position={[xPosition, 0, 0]}
        onClick={handleSelect}
      >
        {/* Main precision carriage */}
        <mesh position={[0, 0.14, 0]} castShadow>
          <boxGeometry args={[0.46, 0.27, 0.50]} />
          <meshStandardMaterial
            color={selected ? '#243d47' : '#59616b'}
            metalness={0.9}
            roughness={0.23}
          />
        </mesh>

        {/* Carriage top plate */}
        <mesh position={[0, 0.295, 0]} castShadow>
          <boxGeometry args={[0.52, 0.055, 0.54]} />
          <meshStandardMaterial
            color="#303841"
            metalness={0.92}
            roughness={0.2}
          />
        </mesh>

        {/* Motor / linear actuator */}
        <mesh
          position={[0, 0.39, -0.04]}
          rotation={[Math.PI / 2, 0, 0]}
          castShadow
        >
          <cylinderGeometry args={[0.115, 0.115, 0.30, 28]} />
          <meshStandardMaterial
            color="#313740"
            metalness={0.94}
            roughness={0.2}
          />
        </mesh>

        {/* Motor end cap */}
        <mesh
          position={[0, 0.39, 0.115]}
          rotation={[Math.PI / 2, 0, 0]}
        >
          <cylinderGeometry args={[0.075, 0.075, 0.018, 24]} />
          <meshStandardMaterial
            color="#8d96a0"
            metalness={0.96}
            roughness={0.16}
          />
        </mesh>

        {/* Wafer-stage support */}
        <mesh position={[0, 0.36, 0]} castShadow>
          <cylinderGeometry args={[0.31, 0.31, 0.08, 48]} />
          <meshStandardMaterial
            color="#151a20"
            metalness={0.9}
            roughness={0.24}
          />
        </mesh>

        {/* Wafer carrier ring */}
        <mesh position={[0, 0.425, 0]} castShadow>
          <torusGeometry args={[0.27, 0.035, 12, 48]} />
          <meshStandardMaterial
            color={selected ? '#67e8f9' : '#59636e'}
            metalness={0.92}
            roughness={0.18}
            emissive={selected ? '#164e63' : '#000000'}
            emissiveIntensity={selected ? 0.7 : 0}
          />
        </mesh>

        {/* Wafer */}
        <WaferDisk
          position={[0, 0.46, 0]}
          selected={selected}
        />

        {/* Z-axis actuator */}
        <group position={[0, 0.60, 0]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.055, 0.055, 0.30, 20]} />
            <meshStandardMaterial
              color="#68727d"
              metalness={0.96}
              roughness={0.16}
            />
          </mesh>

          <mesh position={[0, 0.155, 0]}>
            <cylinderGeometry args={[0.075, 0.075, 0.035, 20]} />
            <meshStandardMaterial
              color="#222931"
              metalness={0.9}
              roughness={0.2}
            />
          </mesh>
        </group>

        {/* Side precision housings */}
        <mesh position={[0.25, 0.16, 0]} castShadow>
          <boxGeometry args={[0.075, 0.20, 0.34]} />
          <meshStandardMaterial
            color="#20262d"
            metalness={0.84}
            roughness={0.27}
          />
        </mesh>

        <mesh position={[-0.25, 0.16, 0]} castShadow>
          <boxGeometry args={[0.075, 0.20, 0.34]} />
          <meshStandardMaterial
            color="#20262d"
            metalness={0.84}
            roughness={0.27}
          />
        </mesh>

        {/* Front coupler */}
        <mesh position={[0, 0.15, 0.27]}>
          <cylinderGeometry args={[0.08, 0.08, 0.08, 24]} />
          <meshStandardMaterial
            color="#a1a9b2"
            metalness={0.96}
            roughness={0.16}
          />
        </mesh>

        {/* Mounting brackets */}
        <mesh position={[0.16, 0.015, 0.18]}>
          <boxGeometry args={[0.07, 0.07, 0.08]} />
          <meshStandardMaterial
            color="#262b32"
            metalness={0.8}
            roughness={0.32}
          />
        </mesh>

        <mesh position={[-0.16, 0.015, 0.18]}>
          <boxGeometry args={[0.07, 0.07, 0.08]} />
          <meshStandardMaterial
            color="#262b32"
            metalness={0.8}
            roughness={0.32}
          />
        </mesh>

        {/* Technical label */}
        <SubsystemLabel
          text="WAFER STAGE"
          position={[0, 1.08, 0]}
          selected={selected}
        />

        {/* Preserve existing child sensors */}
        {children}
      </group>
    </group>
  )
}
