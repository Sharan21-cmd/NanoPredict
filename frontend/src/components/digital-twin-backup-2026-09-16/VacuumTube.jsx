import { useMemo } from 'react'
import * as THREE from 'three'

export default function VacuumTube({
  start = [1.00, 0.48, 0.52],
  end = [1.95, 0.13, 0.52],
}) {
  const tubeGeometry = useMemo(() => {
    const mid = new THREE.Vector3(
      (start[0] + end[0]) / 2,
      Math.min(start[1], end[1]) - 0.08,
      (start[2] + end[2]) / 2 + 0.12,
    )

    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(...start),
      mid,
      new THREE.Vector3(...end),
    ])

    return new THREE.TubeGeometry(
      curve,
      28,
      0.028,
      10,
      false,
    )
  }, [start, end])

  return (
    <group>
      {/* Vacuum hose */}
      <mesh geometry={tubeGeometry}>
        <meshStandardMaterial
          color="#475569"
          roughness={0.7}
          metalness={0.12}
        />
      </mesh>

      {/* Hose connector */}
      <mesh position={start}>
        <cylinderGeometry args={[0.045, 0.045, 0.12, 16]} />
        <meshStandardMaterial
          color="#94a3b8"
          metalness={0.7}
          roughness={0.28}
        />
      </mesh>

      {/* Simplified syringe/manual vacuum pump */}
      <group position={end}>
        {/* Main barrel */}
        <mesh position={[0, 0.13, 0]}>
          <cylinderGeometry args={[0.075, 0.075, 0.30, 20]} />
          <meshStandardMaterial
            color="#dbeafe"
            transparent
            opacity={0.62}
            roughness={0.18}
          />
        </mesh>

        {/* Plunger cap */}
        <mesh position={[0, 0.30, 0]}>
          <cylinderGeometry args={[0.058, 0.058, 0.07, 18]} />
          <meshStandardMaterial
            color="#64748b"
            metalness={0.5}
            roughness={0.36}
          />
        </mesh>

        {/* Plunger rod */}
        <mesh position={[0, 0.40, 0]}>
          <cylinderGeometry args={[0.012, 0.012, 0.14, 10]} />
          <meshStandardMaterial
            color="#94a3b8"
            metalness={0.7}
            roughness={0.25}
          />
        </mesh>
      </group>
    </group>
  )
}
