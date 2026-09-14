export default function VibrationSensor() {
  return (
    <group position={[0, 0.37, -0.13]}>
      {/* MPU6050 PCB */}
      <mesh castShadow>
        <boxGeometry args={[0.13, 0.018, 0.10]} />
        <meshStandardMaterial
          color="#116149"
          roughness={0.52}
          metalness={0.12}
        />
      </mesh>

      {/* Central sensor package */}
      <mesh position={[0, 0.014, 0]}>
        <boxGeometry args={[0.042, 0.018, 0.042]} />
        <meshStandardMaterial
          color="#111827"
          roughness={0.35}
          metalness={0.25}
        />
      </mesh>

      {/* Small connector */}
      <mesh position={[0.05, 0.014, 0]}>
        <boxGeometry args={[0.025, 0.018, 0.035]} />
        <meshStandardMaterial
          color="#94a3b8"
          roughness={0.35}
        />
      </mesh>
    </group>
  )
}
