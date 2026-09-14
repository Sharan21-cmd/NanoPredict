const RAIL_LENGTH = 2.35
const RAIL_Y = 0.42
const RAIL_Z = -0.28
const RAIL_X_OFFSET = -0.7

export default function LinearRail() {
  return (
    <group position={[RAIL_X_OFFSET, 0, RAIL_Z]}>
      {/* Mounting track */}
      <mesh position={[0, 0.14, 0]} receiveShadow>
        <boxGeometry args={[2.75, 0.08, 0.48]} />
        <meshStandardMaterial
          color="#20252d"
          metalness={0.85}
          roughness={0.26}
        />
      </mesh>

      {/* End supports */}
      {[-RAIL_LENGTH / 2, RAIL_LENGTH / 2].map((x) => (
        <group key={x} position={[x, RAIL_Y / 2, 0]}>
          <mesh>
            <boxGeometry args={[0.14, RAIL_Y, 0.24]} />
            <meshStandardMaterial
              color="#11151a"
              metalness={0.8}
              roughness={0.32}
            />
          </mesh>

          <mesh position={[0, RAIL_Y / 2 + 0.025, 0]}>
            <boxGeometry args={[0.22, 0.05, 0.32]} />
            <meshStandardMaterial
              color="#2b313a"
              metalness={0.85}
              roughness={0.25}
            />
          </mesh>
        </group>
      ))}

      {/* Main linear rod */}
      <mesh
        position={[0, RAIL_Y, 0]}
        rotation={[0, 0, Math.PI / 2]}
      >
        <cylinderGeometry args={[0.055, 0.055, RAIL_LENGTH, 20]} />
        <meshStandardMaterial
          color="#737b86"
          metalness={0.95}
          roughness={0.2}
        />
      </mesh>

      {/* Secondary guide rail — also horizontal */}
      <mesh
        position={[0, RAIL_Y - 0.07, 0.16]}
        rotation={[0, 0, Math.PI / 2]}
      >
        <cylinderGeometry args={[0.035, 0.035, RAIL_LENGTH, 16]} />
        <meshStandardMaterial
          color="#4b5563"
          metalness={0.9}
          roughness={0.22}
        />
      </mesh>
    </group>
  )
}

export const RAIL_CONFIG = {
  length: RAIL_LENGTH,
  y: RAIL_Y,
  z: RAIL_Z,
  xOffset: RAIL_X_OFFSET,
}
