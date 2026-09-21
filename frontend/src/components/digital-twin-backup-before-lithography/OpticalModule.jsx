import React from 'react'
import { Edges } from '@react-three/drei'

export default function OpticalModule({
  selected = false,
  onSelect,
}) {
  const accent = selected ? '#67e8f9' : '#22d3ee'

  return (
    <group
      name="optical-module"
      position={[0, 2.30, 0]}
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
