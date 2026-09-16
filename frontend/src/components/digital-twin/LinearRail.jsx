import SubsystemLabel from './SubsystemLabel'

const RAIL_LENGTH = 2.35
const RAIL_Y = 0.42
const RAIL_Z = -0.28
const RAIL_X_OFFSET = -0.7

export default function LinearRail({
  selected = false,
  onSelect,
}) {
  const handleSelect = (event) => {
    event.stopPropagation()
    onSelect?.('positioning')
  }

  return (
    <group
      position={[RAIL_X_OFFSET, 0, RAIL_Z]}
      onClick={handleSelect}
    >
      {/* Precision mounting track */}
      <mesh position={[0, 0.14, 0]} receiveShadow>
        <boxGeometry args={[2.75, 0.08, 0.48]} />
        <meshStandardMaterial
          color={selected ? '#172f3a' : '#20252d'}
          metalness={0.88}
          roughness={0.24}
        />
      </mesh>

      {/* Precision end supports */}
      {[-RAIL_LENGTH / 2, RAIL_LENGTH / 2].map((x) => (
        <group key={x} position={[x, RAIL_Y / 2, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.14, RAIL_Y, 0.24]} />
            <meshStandardMaterial
              color="#11151a"
              metalness={0.82}
              roughness={0.3}
            />
          </mesh>

          <mesh position={[0, RAIL_Y / 2 + 0.025, 0]}>
            <boxGeometry args={[0.22, 0.05, 0.32]} />
            <meshStandardMaterial
              color="#2b313a"
              metalness={0.88}
              roughness={0.22}
            />
          </mesh>
        </group>
      ))}

      {/* Main precision guide rod */}
      <mesh
        position={[0, RAIL_Y, 0]}
        rotation={[0, 0, Math.PI / 2]}
        castShadow
      >
        <cylinderGeometry args={[0.055, 0.055, RAIL_LENGTH, 24]} />
        <meshStandardMaterial
          color="#8b949e"
          metalness={0.97}
          roughness={0.16}
        />
      </mesh>

      {/* Secondary guide rail */}
      <mesh
        position={[0, RAIL_Y - 0.07, 0.16]}
        rotation={[0, 0, Math.PI / 2]}
      >
        <cylinderGeometry args={[0.035, 0.035, RAIL_LENGTH, 20]} />
        <meshStandardMaterial
          color="#4b5563"
          metalness={0.92}
          roughness={0.2}
        />
      </mesh>

      {/* Y-axis cross rail */}
      <group position={[0, RAIL_Y + 0.08, 0]}>
        <mesh>
          <boxGeometry args={[0.72, 0.07, 0.16]} />
          <meshStandardMaterial
            color="#252c34"
            metalness={0.86}
            roughness={0.25}
          />
        </mesh>

        <mesh position={[0, 0.055, 0]}>
          <boxGeometry args={[0.5, 0.025, 0.2]} />
          <meshStandardMaterial
            color="#39424d"
            metalness={0.9}
            roughness={0.2}
          />
        </mesh>
      </group>

      {/* Z-axis precision actuator tower */}
      <group position={[0.38, 0.62, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.16, 0.5, 0.22]} />
          <meshStandardMaterial
            color="#151a20"
            metalness={0.85}
            roughness={0.28}
          />
        </mesh>

        <mesh position={[0, 0.17, 0]}>
          <cylinderGeometry args={[0.045, 0.045, 0.28, 16]} />
          <meshStandardMaterial
            color="#7d8792"
            metalness={0.96}
            roughness={0.15}
          />
        </mesh>
      </group>

      {/* Technical label */}
      <SubsystemLabel
        text="PRECISION POSITIONING"
        position={[0, 1.02, 0.04]}
        selected={selected}
      />
    </group>
  )
}

export const RAIL_CONFIG = {
  length: RAIL_LENGTH,
  y: RAIL_Y,
  z: RAIL_Z,
  xOffset: RAIL_X_OFFSET,
}
