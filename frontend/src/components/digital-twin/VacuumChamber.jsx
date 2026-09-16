import React from "react";
import { Edges } from "@react-three/drei";
import SubsystemLabel from "./SubsystemLabel";
import { getStatusColor } from "./materials";

export default function VacuumChamber({
  status = "normal",
  selected = false,
  onSelect,
}) {
  const statusColor = getStatusColor(status);

  return (
    <group
      onClick={(event) => {
        event.stopPropagation();
        onSelect?.("vacuum");
      }}
    >
      {/* Heavy lower machine base */}
      <mesh position={[0, -0.12, 0]} receiveShadow castShadow>
        <boxGeometry args={[5.8, 0.28, 3.15]} />
        <meshStandardMaterial
          color="#070a0e"
          metalness={0.82}
          roughness={0.28}
        />
      </mesh>

      {/* Base trim */}
      <mesh position={[0, 0.055, 0]}>
        <boxGeometry args={[5.55, 0.08, 2.92]} />
        <meshStandardMaterial
          color="#1a222a"
          metalness={0.88}
          roughness={0.22}
        />
      </mesh>

      {/* Main vacuum chamber */}
      <mesh position={[-0.65, 1.02, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.42, 1.42, 1.95, 64]} />
        <meshStandardMaterial
          color="#252e37"
          metalness={0.94}
          roughness={0.2}
          emissive={selected ? "#003842" : "#000000"}
          emissiveIntensity={selected ? 0.8 : 0}
        />
        <Edges
          color={selected ? "#00e5ff" : "#607482"}
          threshold={15}
        />
      </mesh>

      {/* Chamber upper flange */}
      <mesh position={[-0.65, 2.02, 0]} castShadow>
        <cylinderGeometry args={[1.58, 1.58, 0.16, 64]} />
        <meshStandardMaterial
          color="#3b4650"
          metalness={0.96}
          roughness={0.18}
        />
      </mesh>

      {/* Chamber lower flange */}
      <mesh position={[-0.65, 0.03, 0]} castShadow>
        <cylinderGeometry args={[1.56, 1.56, 0.14, 64]} />
        <meshStandardMaterial
          color="#303a44"
          metalness={0.95}
          roughness={0.2}
        />
      </mesh>

      {/* Top lid */}
      <mesh position={[-0.65, 2.18, 0]} castShadow>
        <cylinderGeometry args={[1.3, 1.3, 0.22, 64]} />
        <meshStandardMaterial
          color="#151c23"
          metalness={0.94}
          roughness={0.2}
        />
      </mesh>

      {/* Inspection window */}
      <mesh position={[-0.65, 1.08, 1.43]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.48, 0.48, 0.08, 48]} />
        <meshPhysicalMaterial
          color="#5eeaff"
          transmission={0.65}
          transparent
          opacity={0.7}
          roughness={0.08}
          metalness={0.05}
        />
      </mesh>

      {/* Internal vacuum status glow */}
      <mesh position={[-0.65, 0.9, 0]}>
        <cylinderGeometry args={[0.88, 0.88, 0.08, 48]} />
        <meshStandardMaterial
          color={statusColor}
          emissive={statusColor}
          emissiveIntensity={selected ? 2.2 : 0.65}
          transparent
          opacity={0.45}
        />
      </mesh>

      {/* Vacuum side ports */}
      <mesh position={[-2.08, 0.95, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.28, 0.28, 0.5, 32]} />
        <meshStandardMaterial
          color="#343f49"
          metalness={0.9}
          roughness={0.2}
        />
      </mesh>

      <mesh position={[0.78, 0.95, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.22, 0.22, 0.42, 32]} />
        <meshStandardMaterial
          color="#303a44"
          metalness={0.9}
          roughness={0.2}
        />
      </mesh>

      {/* Active vacuum sensor port */}
      <mesh position={[0.82, 1.45, 0.65]} rotation={[0, Math.PI / 2, 0]}>
        <cylinderGeometry args={[0.11, 0.11, 0.35, 24]} />
        <meshStandardMaterial
          color={statusColor}
          metalness={0.75}
          roughness={0.2}
          emissive={statusColor}
          emissiveIntensity={1.8}
        />
      </mesh>

      {/* Chamber support legs */}
      {[
        [-1.55, 0.0, -0.95],
        [0.25, 0.0, -0.95],
        [-1.55, 0.0, 0.95],
        [0.25, 0.0, 0.95],
      ].map((position, index) => (
        <mesh key={index} position={position} castShadow>
          <boxGeometry args={[0.22, 0.75, 0.22]} />
          <meshStandardMaterial
            color="#202932"
            metalness={0.86}
            roughness={0.3}
          />
        </mesh>
      ))}

      {/* Status indicator */}
      <mesh position={[0.9, 2.35, 0.75]}>
        <sphereGeometry args={[0.075, 20, 20]} />
        <meshStandardMaterial
          color={statusColor}
          emissive={statusColor}
          emissiveIntensity={selected ? 3 : 1.5}
        />
      </mesh>

      <SubsystemLabel
        position={[-0.65, 2.55, 0]}
        color={selected ? "#00e5ff" : "#9bdcff"}
        size={0.17}
      >
        Vacuum Chamber
      </SubsystemLabel>
    </group>
  );
}
