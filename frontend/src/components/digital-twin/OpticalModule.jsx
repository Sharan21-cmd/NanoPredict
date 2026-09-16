import React from "react";
import * as THREE from "three";
import { Line } from "@react-three/drei";
import SubsystemLabel from "./SubsystemLabel";
import { INDUSTRIAL_MATERIALS } from "./materials";

export default function OpticalModule({
  position = [0, 3.35, 0],
  selected = false,
  onSelect,
}) {
  const accent = selected ? "#00e5ff" : "#2489a8";

  return (
    <group
      position={position}
      onClick={(event) => {
        event.stopPropagation();
        onSelect?.("optical");
      }}
    >
      {/* Main optical housing */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[2.8, 1.05, 2.2]} />
        <meshStandardMaterial
          color={INDUSTRIAL_MATERIALS.darkMetal.color}
          metalness={0.9}
          roughness={0.25}
          emissive={selected ? "#00333d" : "#000000"}
          emissiveIntensity={selected ? 0.8 : 0}
        />
      </mesh>

      {/* Front optical barrel */}
      <mesh position={[0, -0.65, 0]} castShadow>
        <cylinderGeometry args={[0.58, 0.72, 0.75, 48]} />
        <meshStandardMaterial
          color="#394550"
          metalness={0.92}
          roughness={0.2}
        />
      </mesh>

      {/* Lens */}
      <mesh position={[0, -1.05, 0]}>
        <cylinderGeometry args={[0.43, 0.43, 0.08, 48]} />
        <meshPhysicalMaterial
          color="#38dfff"
          metalness={0.05}
          roughness={0.08}
          transmission={0.45}
          transparent
          opacity={0.72}
        />
      </mesh>

      {/* Illumination source */}
      <mesh position={[0, -1.52, 0]}>
        <cylinderGeometry args={[0.22, 0.22, 0.55, 32]} />
        <meshStandardMaterial
          color="#0e1d26"
          metalness={0.7}
          roughness={0.22}
          emissive="#006a7d"
          emissiveIntensity={1.5}
        />
      </mesh>

      {/* Optical path */}
      <Line
        points={[
          [0, -1.82, 0],
          [0, -3.15, 0],
        ]}
        color="#27e7ff"
        lineWidth={2}
        transparent
        opacity={selected ? 0.95 : 0.5}
      />

      {/* Alignment arms */}
      <mesh position={[-1.7, -0.05, 0]} castShadow>
        <boxGeometry args={[1.2, 0.16, 0.16]} />
        <meshStandardMaterial
          color={accent}
          metalness={0.75}
          roughness={0.25}
        />
      </mesh>

      <mesh position={[1.7, -0.05, 0]} castShadow>
        <boxGeometry args={[1.2, 0.16, 0.16]} />
        <meshStandardMaterial
          color={accent}
          metalness={0.75}
          roughness={0.25}
        />
      </mesh>

      {/* Status indicator */}
      <mesh position={[1.08, 0.3, 1.12]}>
        <sphereGeometry args={[0.09, 20, 20]} />
        <meshStandardMaterial
          color="#00e5ff"
          emissive="#00e5ff"
          emissiveIntensity={selected ? 3 : 1.2}
        />
      </mesh>

      <SubsystemLabel
        position={[0, 0.72, 0]}
        color={selected ? "#00e5ff" : "#9bdcff"}
        size={0.16}
      >
        Optical Module
      </SubsystemLabel>
    </group>
  );
}
