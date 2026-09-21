export default function DistanceSensor({ beamLength = 0.72 }) {
  return (
    <group position={[0, 0.34, 0.16]}>
      {/* Sensor PCB */}
      <mesh castShadow>
        <boxGeometry args={[0.13, 0.055, 0.09]} />
        <meshStandardMaterial
          color="#0f1720"
          metalness={0.48}
          roughness={0.42}
        />
      </mesh>

      {/* Sensor lens */}
      <mesh position={[0.045, 0, 0.048]}>
        <cylinderGeometry args={[0.026, 0.026, 0.018, 20]} />
        <meshStandardMaterial
          color="#111827"
          metalness={0.7}
          roughness={0.18}
          emissive="#164e63"
          emissiveIntensity={0.45}
        />
      </mesh>

      {/* Measurement beam */}
      <mesh
        position={[beamLength / 2, 0, 0]}
        rotation={[0, 0, Math.PI / 2]}
      >
        <cylinderGeometry args={[0.007, 0.007, beamLength, 10]} />
        <meshBasicMaterial
          color="#22d3ee"
          transparent
          opacity={0.30}
        />
      </mesh>
    </group>
  )
}
