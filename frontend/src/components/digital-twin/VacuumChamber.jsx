import { Edges } from '@react-three/drei'

export default function VacuumChamber() {
  return (
    <group>
      {/* Main black prototype base */}
      <mesh position={[0, -0.10, 0]} receiveShadow>
        <boxGeometry args={[5.2, 0.2, 2.7]} />
        <meshStandardMaterial
          color="#07090c"
          metalness={0.55}
          roughness={0.28}
        />
      </mesh>

      {/* Upper trim */}
      <mesh position={[0, 0.02, 0]}>
        <boxGeometry args={[5.0, 0.06, 2.5]} />
        <meshStandardMaterial
          color="#151a20"
          metalness={0.65}
          roughness={0.25}
        />
      </mesh>

      {/* Transparent acrylic chamber */}
      <mesh position={[-0.7, 0.88, 0]} castShadow>
        <boxGeometry args={[3.4, 1.75, 1.95]} />

        <meshPhysicalMaterial
          color="#d9f4ff"
          transparent
          opacity={0.18}
          transmission={0.92}
          thickness={0.18}
          roughness={0.08}
          ior={1.49}
          metalness={0}
        />

        <Edges
          color="#67e8f9"
          threshold={15}
          scale={1.002}
        />
      </mesh>

      {/* Acrylic top edge */}
      <mesh position={[-0.7, 1.77, 0]}>
        <boxGeometry args={[3.4, 0.035, 1.95]} />
        <meshStandardMaterial
          color="#bae6fd"
          transparent
          opacity={0.28}
          roughness={0.15}
        />
      </mesh>
    </group>
  )
}
