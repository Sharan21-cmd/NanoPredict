import { useMemo } from 'react'
import * as THREE from 'three'
import SubsystemLabel from './SubsystemLabel'

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
  selected = false,
  onSelect,
}) {
  const handleSelect = (event) => {
    event.stopPropagation()
    onSelect?.('electronics')
  }

  return (
    <group
      position={position}
      onClick={handleSelect}
    >
      {/* DAQ / controller enclosure */}
      <mesh position={[0, 0.12, 0]} castShadow>
        <boxGeometry args={[0.82, 0.24, 0.58]} />
        <meshStandardMaterial
          color={selected ? '#18343d' : '#151a20'}
          metalness={0.72}
          roughness={0.3}
        />
      </mesh>

      {/* Upper electronics plate */}
      <mesh position={[0, 0.255, 0]} castShadow>
        <boxGeometry args={[0.72, 0.035, 0.48]} />
        <meshStandardMaterial
          color="#26313a"
          metalness={0.82}
          roughness={0.24}
        />
      </mesh>

      {/* PCB */}
      <mesh position={[0, 0.28, 0]}>
        <boxGeometry args={[0.62, 0.025, 0.38]} />
        <meshStandardMaterial
          color="#0b3b2e"
          roughness={0.52}
          metalness={0.12}
        />
      </mesh>

      {/* Main IC */}
      <mesh position={[-0.08, 0.31, 0.02]}>
        <boxGeometry args={[0.17, 0.045, 0.13]} />
        <meshStandardMaterial
          color="#10151a"
          roughness={0.4}
          metalness={0.25}
        />
      </mesh>

      {/* Supporting components */}
      <mesh position={[0.16, 0.31, 0.08]}>
        <boxGeometry args={[0.10, 0.04, 0.07]} />
        <meshStandardMaterial
          color="#64707b"
          roughness={0.35}
          metalness={0.55}
        />
      </mesh>

      <mesh position={[0.20, 0.31, -0.08]}>
        <boxGeometry args={[0.08, 0.04, 0.06]} />
        <meshStandardMaterial
          color="#47515b"
          roughness={0.38}
          metalness={0.5}
        />
      </mesh>

      {/* Connector bank */}
      {[-0.23, -0.08, 0.07, 0.22].map((x) => (
        <mesh key={x} position={[x, 0.325, -0.17]}>
          <boxGeometry args={[0.055, 0.045, 0.035]} />
          <meshStandardMaterial
            color="#a1a9b2"
            metalness={0.92}
            roughness={0.18}
          />
        </mesh>
      ))}

      {/* Status/display panel */}
      <mesh
        position={[0.20, 0.39, -0.21]}
        rotation={[-0.42, 0, 0]}
      >
        <boxGeometry args={[0.30, 0.16, 0.018]} />
        <meshStandardMaterial
          color="#020617"
          roughness={0.25}
          metalness={0.3}
        />
      </mesh>

      <mesh
        position={[0.20, 0.395, -0.202]}
        rotation={[-0.42, 0, 0]}
      >
        <planeGeometry args={[0.24, 0.10]} />
        <meshBasicMaterial
          color="#22d3ee"
          transparent
          opacity={0.82}
        />
      </mesh>

      {/* Indicator LEDs */}
      {[0, 0.055, 0.11].map((x) => (
        <mesh key={x} position={[-0.27 + x, 0.34, 0.16]}>
          <sphereGeometry args={[0.012, 12, 12]} />
          <meshBasicMaterial color="#67e8f9" />
        </mesh>
      ))}

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

      {/* Technical label */}
      <SubsystemLabel
        text="DAQ / CONTROL"
        position={[0, 0.72, 0]}
        selected={selected}
      />
    </group>
  )
}
