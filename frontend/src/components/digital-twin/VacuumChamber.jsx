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

function MetalPanel({
  position,
  scale,
  color = '#465463',
  edge = '#8291a0',
}) {
  return (
    <mesh
      position={position}
      scale={scale}
      castShadow
      receiveShadow
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial
        color={color}
        metalness={0.9}
        roughness={0.23}
      />
      <Edges
        color={edge}
        threshold={20}
        scale={1.002}
      />
    </mesh>
  )
}

export default function VacuumChamber({
  status = 'normal',
  selected = false,
  onSelect,
}) {
  const statusAccent = statusColor(status)
  const accent = selected ? '#22d3ee' : statusAccent

  return (
    <group
      name="vacuum-chamber"
      onClick={(event) => {
        event.stopPropagation()
        onSelect?.('vacuum')
      }}
    >
      {/* =====================================================
          MAIN CHAMBER BODY
         ===================================================== */}

      <MetalPanel
        position={[0, 1.43, 0]}
        scale={[2.15, 1.55, 1.70]}
        color="#26313c"
      />

      {/* Dark internal process cavity */}

      <mesh
        position={[0, 1.43, -0.03]}
        receiveShadow
      >
        <boxGeometry args={[1.72, 1.20, 1.35]} />
        <meshStandardMaterial
          color="#081018"
          metalness={0.28}
          roughness={0.55}
        />
      </mesh>

      {/* =====================================================
          FRONT VIEWPORT FRAME
         ===================================================== */}

      {/* Outer viewport surround */}

      <mesh
        position={[0, 1.43, 0.885]}
        castShadow
      >
        <boxGeometry args={[1.72, 1.30, 0.14]} />
        <meshStandardMaterial
          color="#111a23"
          metalness={0.82}
          roughness={0.25}
        />
      </mesh>

      {/* Upper viewport frame */}

      <MetalPanel
        position={[0, 2.055, 0.965]}
        scale={[1.78, 0.13, 0.16]}
        color="#596979"
      />

      {/* Lower viewport frame */}

      <MetalPanel
        position={[0, 0.805, 0.965]}
        scale={[1.78, 0.13, 0.16]}
        color="#596979"
      />

      {/* Left viewport frame */}

      <MetalPanel
        position={[-0.82, 1.43, 0.965]}
        scale={[0.13, 1.16, 0.16]}
        color="#596979"
      />

      {/* Right viewport frame */}

      <MetalPanel
        position={[0.82, 1.43, 0.965]}
        scale={[0.13, 1.16, 0.16]}
        color="#596979"
      />

      {/* =====================================================
          LARGE FRONT PROCESS WINDOW
         ===================================================== */}

      <mesh
        position={[0, 1.43, 0.91]}
        castShadow
      >
        <boxGeometry args={[1.52, 1.08, 0.055]} />

        <meshPhysicalMaterial
          color="#75b8cc"
          transparent
          opacity={0.16}
          transmission={0.72}
          roughness={0.12}
          thickness={0.06}
          ior={1.45}
        />

        <Edges
          color={selected ? '#22d3ee' : '#477080'}
          threshold={12}
        />
      </mesh>

      {/* Inner glass reflection strip */}

      <mesh position={[-0.47, 1.68, 0.945]}>
        <boxGeometry args={[0.035, 0.72, 0.012]} />
        <meshBasicMaterial
          color="#b9edf7"
          transparent
          opacity={0.18}
        />
      </mesh>

      {/* =====================================================
          LOWER CHAMBER PLATFORM
         ===================================================== */}

      <MetalPanel
        position={[0, 0.64, 0]}
        scale={[2.30, 0.18, 1.86]}
        color="#354250"
      />

      <mesh
        position={[0, 0.75, 0]}
        castShadow
      >
        <boxGeometry args={[1.72, 0.08, 1.40]} />
        <meshStandardMaterial
          color="#171f28"
          metalness={0.82}
          roughness={0.24}
        />
      </mesh>

      {/* =====================================================
          UPPER CHAMBER LID
         ===================================================== */}

      <MetalPanel
        position={[0, 2.23, 0]}
        scale={[2.28, 0.20, 1.82]}
        color="#394755"
      />

      <MetalPanel
        position={[0, 2.35, 0]}
        scale={[1.86, 0.10, 1.48]}
        color="#202a34"
        edge="#687786"
      />

      {/* =====================================================
          OPTICAL ENTRY PORT
         ===================================================== */}

      <mesh
        position={[0, 2.43, 0]}
        castShadow
      >
        <cylinderGeometry args={[0.27, 0.31, 0.18, 40]} />
        <meshStandardMaterial
          color="#667584"
          metalness={0.94}
          roughness={0.18}
        />
      </mesh>

      <mesh
        position={[0, 2.55, 0]}
      >
        <cylinderGeometry args={[0.20, 0.20, 0.08, 40]} />
        <meshStandardMaterial
          color="#171f27"
          metalness={0.90}
          roughness={0.18}
        />
      </mesh>

      {/* =====================================================
          INTERNAL PROCESS PLATFORM
         ===================================================== */}

      <mesh
        position={[0, 0.91, 0]}
        castShadow
      >
        <cylinderGeometry args={[0.55, 0.55, 0.12, 48]} />
        <meshStandardMaterial
          color="#202932"
          metalness={0.91}
          roughness={0.21}
        />
      </mesh>

      <mesh
        position={[0, 0.98, 0]}
      >
        <cylinderGeometry args={[0.43, 0.43, 0.045, 48]} />
        <meshStandardMaterial
          color="#0e151c"
          metalness={0.88}
          roughness={0.18}
        />
      </mesh>

      {/* =====================================================
          SIDE VACUUM PORT — RIGHT
         ===================================================== */}

      <group position={[1.12, 1.45, 0]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.16, 0.16, 0.30, 32]} />
          <meshStandardMaterial
            color="#687887"
            metalness={0.94}
            roughness={0.20}
          />
        </mesh>

        <mesh
          position={[0.17, 0, 0]}
          rotation={[0, 0, Math.PI / 2]}
        >
          <cylinderGeometry args={[0.095, 0.095, 0.07, 24]} />
          <meshStandardMaterial
            color={accent}
            emissive={accent}
            emissiveIntensity={selected ? 0.65 : 0.10}
            metalness={0.55}
            roughness={0.24}
            toneMapped={false}
          />
        </mesh>
      </group>

      {/* =====================================================
          SIDE VACUUM PORT — LEFT
         ===================================================== */}

      <group position={[-1.12, 1.45, 0]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.13, 0.13, 0.24, 28]} />
          <meshStandardMaterial
            color="#586877"
            metalness={0.94}
            roughness={0.20}
          />
        </mesh>

        <mesh
          position={[-0.14, 0, 0]}
          rotation={[0, 0, Math.PI / 2]}
        >
          <cylinderGeometry args={[0.075, 0.075, 0.06, 24]} />
          <meshStandardMaterial
            color="#303c48"
            metalness={0.9}
            roughness={0.22}
          />
        </mesh>
      </group>

      {/* =====================================================
          REAR SERVICE CONNECTIONS
         ===================================================== */}

      {[-0.52, 0, 0.52].map((x) => (
        <group key={x} position={[x, 1.30, -0.88]}>
          <mesh
            rotation={[Math.PI / 2, 0, 0]}
          >
            <cylinderGeometry args={[0.075, 0.075, 0.18, 24]} />
            <meshStandardMaterial
              color="#566674"
              metalness={0.93}
              roughness={0.20}
            />
          </mesh>
        </group>
      ))}

      {/* =====================================================
          STATUS INDICATOR
         ===================================================== */}

      <mesh position={[0.70, 2.12, 0.91]}>
        <sphereGeometry args={[0.045, 18, 18]} />

        <meshStandardMaterial
          color={accent}
          emissive={accent}
          emissiveIntensity={selected ? 1.0 : 0.72}
          toneMapped={false}
        />
      </mesh>

      {/* Small status light bar */}

      <mesh position={[0.40, 2.12, 0.91]}>
        <boxGeometry args={[0.20, 0.025, 0.018]} />

        <meshBasicMaterial
          color={accent}
          transparent
          opacity={selected ? 0.9 : 0.48}
        />
      </mesh>

      {/* =====================================================
          SUBTLE TECHNICAL EDGE
         ===================================================== */}

      <mesh position={[0, 2.12, 0.975]}>
        <boxGeometry args={[1.40, 0.018, 0.012]} />

        <meshBasicMaterial
          color={selected ? '#22d3ee' : '#315364'}
          transparent
          opacity={selected ? 0.8 : 0.28}
        />
      </mesh>
    </group>
  )
}
