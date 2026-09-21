import React from "react";
import SubsystemLabel from "./SubsystemLabel";
import { getStatusColor } from "./materials";

function IsolationMount({ position, color }) {
  return (
    <group position={position}>
      {/* Rubber isolator */}
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[0.3, 0.34, 0.28, 32]} />
        <meshStandardMaterial
          color="#080a0d"
          metalness={0.08}
          roughness={0.7}
        />
      </mesh>

      {/* Metal cap */}
      <mesh position={[0, 0.17, 0]} castShadow>
        <cylinderGeometry args={[0.23, 0.23, 0.08, 32]} />
        <meshStandardMaterial
          color={color}
          metalness={0.82}
          roughness={0.22}
          emissive={color}
          emissiveIntensity={0.35}
        />
      </mesh>
    </group>
  );
}

export default function VibrationIsolation({
  status = "normal",
  selected = false,
  onSelect,
}) {
  const color = getStatusColor(status);

  return (
    <group
      onClick={(event) => {
        event.stopPropagation();
        onSelect?.("vibration");
      }}
    >
      <IsolationMount position={[-2.9, -0.05, -1.65]} color={color} />
      <IsolationMount position={[2.9, -0.05, -1.65]} color={color} />
      <IsolationMount position={[-2.9, -0.05, 1.65]} color={color} />
      <IsolationMount position={[2.9, -0.05, 1.65]} color={color} />

      {/* Isolation platform */}
      <mesh
        position={[0, 0.22, 0]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[7.2, 0.16, 4.3]} />
        <meshStandardMaterial
          color="#303943"
          metalness={0.82}
          roughness={0.28}
          emissive={selected ? color : "#000000"}
          emissiveIntensity={selected ? 0.18 : 0}
        />
      </mesh>

      <SubsystemLabel
        position={[0, 0.5, 2.0]}
        color={selected ? color : "#9bdcff"}
        size={0.15}
      >
        Vibration Isolation
      </SubsystemLabel>
    </group>
  );
}
