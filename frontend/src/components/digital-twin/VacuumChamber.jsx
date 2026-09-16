import React from 'react'
import { Edges } from '@react-three/drei'

const NORMAL = '#22c55e'
const WARNING = '#f59e0b'
const CRITICAL = '#ef4444'

function statusColor(status) {
  if (status === 'critical') return CRITICAL
  if (status === 'warning') return WARNING
  return NORMAL
}

export default function VacuumChamber({
  status = 'normal',
  selected = false,
  onSelect,
}) {
  const accent = selected ? '#22d3ee' : statusColor(status)

  return (
    <group
      name="vacuum-chamber"
      onClick={(event) => {
        event.stopPropagation()
        onSelect?.('vacuum')
      }}
    >
      {/* =========================
          CHAMBER LOWER MOUNT
         ========================= */}

      <mesh
        position={[0, 0.62, 0]}
        castShadow
      >
        <boxGeometry args={[1.85, 0.16, 1.65]} />
        <meshStandardMaterial
          color="#384552"
          metalness={0.88}
          roughness={0.25}
        />
        <Edges
          color="#7d8d9d"
          threshold={20}
        />
      </mesh>

      {/* =========================
          MAIN VACUUM BODY
         ========================= */}

      <mesh
        position={[0, 1.24, 0]}
        castShadow
      >
        <cylinderGeometry args={[0.76, 0.82, 1.12, 48]} />
        <meshStandardMaterial
          color="#313d49"
          metalness={0.91}
          roughness={0.22}
        />
        <Edges
          color="#8999a9"
          threshold={25}
        />
      </mesh>

      {/* Chamber lower flange */}

      <mesh
        position={[0, 0.70, 0]}
        castShadow
      >
        <cylinderGeometry args={[0.90, 0.90, 0.12, 48]} />
        <meshStandardMaterial
          color="#657483"
          metalness={0.94}
          roughness={0.20}
        />
      </mesh>

      {/* Chamber upper flange */}

      <mesh
        position={[0, 1.82, 0]}
        castShadow
      >
        <cylinderGeometry args={[0.88, 0.88, 0.12, 48]} />
        <meshStandardMaterial
          color="#657483"
          metalness={0.94}
          roughness={0.20}
        />
      </mesh>

      {/* =========================
          TRANSPARENT PROCESS WINDOW
         ========================= */}

      <mesh
        position={[0, 1.28, 0.735]}
      >
        <boxGeometry args={[1.25, 1.05, 0.045]} />
        <meshPhysicalMaterial
          color="#9edcf0"
          transparent
          opacity={0.18}
          transmission={0.72}
          roughness={0.10}
          thickness={0.08}
          ior={1.45}
        />
        <Edges
          color={selected ? '#22d3ee' : '#4b8ba2'}
          threshold={10}
        />
      </mesh>

      {/* Viewport surround */}

      <mesh
        position={[0, 1.28, 0.77]}
      >
        <boxGeometry args={[1.43, 1.22, 0.06]} />
        <meshStandardMaterial
          color="#17212b"
          metalness={0.78}
          roughness={0.25}
        />
      </mesh>

      {/* Re-add glass in front */}

      <mesh
        position={[0, 1.28, 0.81]}
      >
        <boxGeometry args={[1.25, 1.05, 0.035]} />
        <meshPhysicalMaterial
          color="#b7e8f7"
          transparent
          opacity={0.12}
          transmission={0.8}
          roughness={0.06}
          thickness={0.05}
        />
      </mesh>

      {/* =========================
          CHAMBER LID
         ========================= */}

      <mesh
        position={[0, 1.94, 0]}
        castShadow
      >
        <cylinderGeometry args={[0.72, 0.72, 0.18, 48]} />
        <meshStandardMaterial
          color="#202b36"
          metalness={0.93}
          roughness={0.19}
        />
      </mesh>

      {/* Lid actuator collar */}

      <mesh
        position={[0, 2.09, 0]}
      >
        <cylinderGeometry args={[0.29, 0.34, 0.24, 32]} />
        <meshStandardMaterial
          color="#566574"
          metalness={0.91}
          roughness={0.22}
        />
      </mesh>

      {/* =========================
          INTERNAL STAGE SUPPORT
         ========================= */}

      <mesh
        position={[0, 0.92, 0]}
      >
        <cylinderGeometry args={[0.48, 0.48, 0.10, 48]} />
        <meshStandardMaterial
          color="#161e27"
          metalness={0.88}
          roughness={0.20}
        />
      </mesh>

      {/* Subtle internal chamber glow */}

      <mesh
        position={[0, 1.32, 0]}
      >
        <cylinderGeometry args={[0.57, 0.57, 0.72, 48]} />
        <meshBasicMaterial
          color="#164e63"
          transparent
          opacity={0.035}
          side={2}
          depthWrite={false}
        />
      </mesh>

      {/* =========================
          SIDE VACUUM PORTS
         ========================= */}

      <group position={[0.80, 1.30, 0]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.16, 0.16, 0.28, 32]} />
          <meshStandardMaterial
            color="#536271"
            metalness={0.92}
            roughness={0.22}
          />
        </mesh>

        <mesh position={[0.15, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.09, 0.09, 0.08, 24]} />
          <meshStandardMaterial
            color={accent}
            emissive={accent}
            emissiveIntensity={selected ? 0.5 : 0.08}
            metalness={0.55}
            roughness={0.25}
          />
        </mesh>
      </group>

      <group position={[-0.80, 1.30, 0]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.13, 0.13, 0.22, 28]} />
          <meshStandardMaterial
            color="#536271"
            metalness={0.92}
            roughness={0.22}
          />
        </mesh>
      </group>

      {/* =========================
          STATUS INDICATOR
         ========================= */}

      <mesh position={[0.57, 1.92, 0.30]}>
        <sphereGeometry args={[0.045, 16, 16]} />
        <meshStandardMaterial
          color={accent}
          emissive={accent}
          emissiveIntensity={0.75}
          toneMapped={false}
        />
      </mesh>

      {/* Label plate */}

      <mesh position={[0, 2.18, 0.10]}>
        <boxGeometry args={[0.88, 0.045, 0.03]} />
        <meshBasicMaterial
          color={selected ? '#22d3ee' : '#385466'}
          transparent
          opacity={selected ? 0.9 : 0.45}
        />
      </mesh>
    </group>
  )
}
