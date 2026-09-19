import React, { useMemo } from 'react'
import { Edges } from '@react-three/drei'
import { RAIL_CONFIG, mapPositionToRail } from './LinearRail'
import { WAFER_SURFACE_LOCAL_Y } from './MotorCarriage'

const HEAD_Y = 2.30
const WAFER_SURFACE_WORLD_Y = RAIL_CONFIG.y + WAFER_SURFACE_LOCAL_Y
const BEAM_DROP = HEAD_Y - WAFER_SURFACE_WORLD_Y

// The module's existing internal optics already terminate at local y = -0.88
// (see "Optical path termination" ring below). We extend the beam from
// there down to the wafer surface. This length is constant because the
// head and the wafer stage share the same fixed vertical offset — only
// their shared X position (driven by telemetry) ever changes.
const INNER_BEAM_END = 0.88
const OUTER_BEAM_LENGTH = Math.max(BEAM_DROP - INNER_BEAM_END, 0.05)
const OUTER_BEAM_MID_Y = -(INNER_BEAM_END + BEAM_DROP) / 2
const BEAM_SPOT_Y = -BEAM_DROP

export default function OpticalModule({
  positionMm = 0,
  selected = false,
  onSelect,
}) {
  const accent = selected ? '#67e8f9' : '#22d3ee'

  const xPosition = useMemo(
    () => mapPositionToRail(positionMm),
    [positionMm]
  )

  // Head moves with the stage's exact X/Z, using the same source-of-truth
  // mapping as MotorCarriage, so the two can never drift apart.
  const headPosition = useMemo(
    () => [RAIL_CONFIG.xOffset + xPosition, HEAD_Y, RAIL_CONFIG.z],
    [xPosition]
  )

  return (
    <group
      name="optical-module"
      position={headPosition}
      onClick={(event) => {
        event.stopPropagation()
        onSelect?.('optical')
      }}
    >
      {/* =========================
          MAIN OPTICAL HOUSING
         ========================= */}

      <mesh
        position={[0, 0.25, 0]}
        castShadow
      >
        <boxGeometry args={[0.82, 0.46, 0.72]} />
        <meshStandardMaterial
          color="#465462"
          metalness={0.88}
          roughness={0.22}
        />
        <Edges
          color={selected ? '#67e8f9' : '#8a9aaa'}
          threshold={18}
        />
      </mesh>

      {/* Upper optical housing */}

      <mesh
        position={[0, 0.54, 0]}
      >
        <boxGeometry args={[0.58, 0.14, 0.52]} />
        <meshStandardMaterial
          color="#252f3a"
          metalness={0.90}
          roughness={0.20}
        />
      </mesh>

      {/* =========================
          LENS BARREL
         ========================= */}

      <mesh
        position={[0, -0.08, 0]}
        castShadow
      >
        <cylinderGeometry args={[0.25, 0.20, 0.42, 40]} />
        <meshStandardMaterial
          color="#697987"
          metalness={0.95}
          roughness={0.18}
        />
      </mesh>

      {/* Objective ring */}

      <mesh
        position={[0, -0.31, 0]}
      >
        <torusGeometry args={[0.19, 0.035, 12, 40]} />
        <meshStandardMaterial
          color="#a7b5c2"
          metalness={0.96}
          roughness={0.14}
        />
      </mesh>

      {/* Optical glass */}

      <mesh
        position={[0, -0.34, 0]}
        rotation={[Math.PI / 2, 0, 0]}
      >
        <cylinderGeometry args={[0.14, 0.14, 0.035, 40]} />
        <meshPhysicalMaterial
          color="#b9f3ff"
          transparent
          opacity={0.55}
          transmission={0.75}
          roughness={0.05}
          metalness={0.05}
        />
      </mesh>

      {/* =========================
          OPTICAL PATH
         ========================= */}

      <mesh
        position={[0, -0.62, 0]}
      >
        <cylinderGeometry args={[0.018, 0.018, 0.52, 12]} />
        <meshBasicMaterial
          color={accent}
          transparent
          opacity={selected ? 0.65 : 0.30}
          depthWrite={false}
        />
      </mesh>

      {/* Optical path termination */}

      <mesh
        position={[0, -0.88, 0]}
        rotation={[Math.PI / 2, 0, 0]}
      >
        <ringGeometry args={[0.05, 0.085, 32]} />
        <meshBasicMaterial
          color={accent}
          transparent
          opacity={selected ? 0.55 : 0.20}
          side={2}
          depthWrite={false}
        />
      </mesh>

      {/* =========================
          BEAM EXTENSION TO WAFER
         ========================= */}

      <mesh position={[0, OUTER_BEAM_MID_Y, 0]}>
        <cylinderGeometry args={[0.012, 0.02, OUTER_BEAM_LENGTH, 16]} />
        <meshBasicMaterial
          color={accent}
          transparent
          opacity={selected ? 0.75 : 0.4}
          depthWrite={false}
        />
      </mesh>

      {/* Beam spot on the wafer surface */}

      <mesh
        position={[0, BEAM_SPOT_Y, 0]}
        rotation={[Math.PI / 2, 0, 0]}
      >
        <circleGeometry args={[0.055, 32]} />
        <meshBasicMaterial
          color={accent}
          transparent
          opacity={selected ? 0.85 : 0.55}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>

      {/* =========================
          ALIGNMENT ARMS
         ========================= */}

      {[-1, 1].map((side) => (
        <group
          key={side}
          position={[side * 0.52, 0.18, 0]}
        >
          <mesh>
            <boxGeometry args={[0.30, 0.08, 0.10]} />
            <meshStandardMaterial
              color="#566675"
              metalness={0.90}
              roughness={0.22}
            />
          </mesh>

          <mesh position={[side * 0.14, -0.08, 0]}>
            <cylinderGeometry args={[0.045, 0.045, 0.18, 16]} />
            <meshStandardMaterial
              color="#8796a5"
              metalness={0.94}
              roughness={0.18}
            />
          </mesh>
        </group>
      ))}

      {/* =========================
          STATUS / SERVICE DETAIL
         ========================= */}

      <mesh position={[0.30, 0.48, 0.37]}>
        <sphereGeometry args={[0.035, 16, 16]} />
        <meshStandardMaterial
          color={accent}
          emissive={accent}
          emissiveIntensity={0.8}
          toneMapped={false}
        />
      </mesh>

      {/* Mounting plate */}

      <mesh
        position={[0, 0.73, 0]}
      >
        <boxGeometry args={[1.18, 0.08, 0.90]} />
        <meshStandardMaterial
          color="#252f39"
          metalness={0.82}
          roughness={0.26}
        />
        <Edges
          color="#697887"
          threshold={20}
        />
      </mesh>

      {/* Vertical support */}

      <mesh
        position={[0, 0.95, 0]}
      >
        <boxGeometry args={[0.16, 0.38, 0.16]} />
        <meshStandardMaterial
          color="#596a79"
          metalness={0.88}
          roughness={0.23}
        />
      </mesh>
    </group>
  )
}
