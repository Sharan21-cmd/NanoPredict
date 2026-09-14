export default function PressureSensor({
  position = [0.78, 1.12, -0.56],
}) {
  return (
    <group position={position}>
      {/* BMP280 board */}
      <mesh castShadow>
        <boxGeometry args={[0.14, 0.10, 0.022]} />
        <meshStandardMaterial
          color="#164b78"
          roughness={0.48}
          metalness={0.16}
        />
      </mesh>

      {/* Sensor package */}
      <mesh position={[0, 0.012, 0]}>
        <boxGeometry args={[0.035, 0.018, 0.035]} />
        <meshStandardMaterial
          color="#0f172a"
          roughness={0.36}
        />
      </mesh>

      {/* Pin/header strip */}
      <mesh position={[-0.045, 0.014, 0]}>
        <boxGeometry args={[0.012, 0.014, 0.065]} />
        <meshStandardMaterial
          color="#cbd5e1"
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
    </group>
  )
}
