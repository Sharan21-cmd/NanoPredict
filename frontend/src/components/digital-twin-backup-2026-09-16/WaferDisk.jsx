import React from 'react'

export default function WaferDisk({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
}) {
  return (
    <group position={position} rotation={rotation}>
      {/* Wafer carrier */}

      <mesh
        position={[0, 0.025, 0]}
        castShadow
      >
        <cylinderGeometry args={[0.62, 0.62, 0.07, 64]} />
        <meshStandardMaterial
          color="#151c25"
          metalness={0.94}
          roughness={0.20}
        />
      </mesh>

      {/* Wafer */}

      <mesh
        position={[0, 0.075, 0]}
        castShadow
      >
        <cylinderGeometry args={[0.54, 0.54, 0.035, 96]} />
        <meshStandardMaterial
          color="#66727e"
          metalness={0.72}
          roughness={0.18}
        />
      </mesh>

      {/* Wafer surface */}

      <mesh
        position={[0, 0.095, 0]}
      >
        <cylinderGeometry args={[0.50, 0.50, 0.008, 96]} />
        <meshStandardMaterial
          color="#73808d"
          metalness={0.55}
          roughness={0.16}
        />
      </mesh>

      {/* Wafer edge ring */}

      <mesh
        position={[0, 0.102, 0]}
      >
        <torusGeometry args={[0.49, 0.012, 10, 96]} />
        <meshStandardMaterial
          color="#b7c4d0"
          metalness={0.88}
          roughness={0.16}
        />
      </mesh>

      {/* Wafer center mark */}

      <mesh
        position={[0.39, 0.101, 0]}
      >
        <boxGeometry args={[0.018, 0.006, 0.11]} />
        <meshBasicMaterial color="#22d3ee" />
      </mesh>
    </group>
  )
}
