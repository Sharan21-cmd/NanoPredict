import { useMemo } from 'react'
import * as THREE from 'three'

function Cable({
  start,
  end,
  sag = 0.15,
  color = '#111827',
}) {
  const geometry = useMemo(() => {
    const mid = new THREE.Vector3(
      (start[0] + end[0]) / 2,
      Math.min(start[1], end[1]) - sag,
      (start[2] + end[2]) / 2,
    )

    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(...start),
      mid,
      new THREE.Vector3(...end),
    ])

    return new THREE.TubeGeometry(
      curve,
      20,
      0.014,
      7,
      false,
    )
  }, [start, end, sag])

  return (
    <mesh geometry={geometry}>
      <meshStandardMaterial
        color={color}
        roughness={0.82}
      />
    </mesh>
  )
}

export default function Electronics({
  position = [1.65, 0.03, -0.68],
}) {
  return (
    <group position={position}>
      {/* DAQ / microcontroller board */}
      <mesh receiveShadow>
        <boxGeometry args={[0.70, 0.045, 0.48]} />
        <meshStandardMaterial
          color="#0b3b2e"
          roughness={0.58}
          metalness={0.1}
        />
      </mesh>

      {/* Component blocks */}
      <mesh position={[-0.16, 0.045, 0.08]}>
        <boxGeometry args={[0.18, 0.05, 0.13]} />
        <meshStandardMaterial
          color="#1f2937"
          roughness={0.45}
        />
      </mesh>

      <mesh position={[0.05, 0.045, -0.05]}>
        <boxGeometry args={[0.12, 0.05, 0.10]} />
        <meshStandardMaterial
          color="#334155"
          roughness={0.42}
        />
      </mesh>

      {/* OLED module */}
      <mesh position={[0.18, 0.14, -0.19]} rotation={[-0.48, 0, 0]}>
        <boxGeometry args={[0.25, 0.14, 0.018]} />
        <meshStandardMaterial
          color="#020617"
          roughness={0.28}
          metalness={0.25}
        />
      </mesh>

      <mesh
        position={[0.18, 0.145, -0.181]}
        rotation={[-0.48, 0, 0]}
      >
        <planeGeometry args={[0.20, 0.09]} />
        <meshBasicMaterial
          color="#22d3ee"
          transparent
          opacity={0.85}
        />
      </mesh>

      {/* Representative wiring */}
      <Cable
        start={[-0.22, 0.06, 0.16]}
        end={[-0.96, 0.44, -0.28]}
        sag={0.11}
      />

      <Cable
        start={[-0.10, 0.06, 0.12]}
        end={[-0.56, 0.88, -0.48]}
        sag={0.05}
      />

      <Cable
        start={[0.00, 0.06, -0.14]}
        end={[0.65, 1.05, -0.56]}
        sag={0.04}
        color="#1e293b"
      />
    </group>
  )
}
