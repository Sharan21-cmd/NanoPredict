import React from "react";
import { INDUSTRIAL_MATERIALS } from "./materials";

function Beam({ position, scale }) {
  return (
    <mesh
      position={position}
      scale={scale}
      castShadow
      receiveShadow
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial
        color={INDUSTRIAL_MATERIALS.frame.color}
        metalness={0.85}
        roughness={0.28}
      />
    </mesh>
  );
}

export default function MachineFrame() {
  return (
    <group>
      {/* Main machine base */}
      <Beam
        position={[0, -0.45, 0]}
        scale={[10, 0.45, 7]}
      />

      {/* Raised inner platform */}
      <Beam
        position={[0, -0.15, 0]}
        scale={[8.4, 0.18, 5.8]}
      />

      {/* Front vertical pillars */}
      <Beam
        position={[-4.35, 2.0, 2.65]}
        scale={[0.42, 4.9, 0.42]}
      />

      <Beam
        position={[4.35, 2.0, 2.65]}
        scale={[0.42, 4.9, 0.42]}
      />

      {/* Rear vertical pillars */}
      <Beam
        position={[-4.35, 2.0, -2.65]}
        scale={[0.42, 4.9, 0.42]}
      />

      <Beam
        position={[4.35, 2.0, -2.65]}
        scale={[0.42, 4.9, 0.42]}
      />

      {/* Top front/rear beams */}
      <Beam
        position={[0, 4.25, 2.65]}
        scale={[9.1, 0.42, 0.42]}
      />

      <Beam
        position={[0, 4.25, -2.65]}
        scale={[9.1, 0.42, 0.42]}
      />

      {/* Top side beams */}
      <Beam
        position={[-4.35, 4.25, 0]}
        scale={[0.42, 0.42, 5.7]}
      />

      <Beam
        position={[4.35, 4.25, 0]}
        scale={[0.42, 0.42, 5.7]}
      />

      {/* Rear equipment enclosure */}
      <mesh
        position={[0, 1.7, -2.45]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[7.6, 3.4, 0.32]} />
        <meshStandardMaterial
          color={INDUSTRIAL_MATERIALS.frameDark.color}
          metalness={0.72}
          roughness={0.34}
        />
      </mesh>

      {/* Side equipment housings */}
      <Beam
        position={[-4.05, 1.0, 0]}
        scale={[0.6, 2.0, 3.8]}
      />

      <Beam
        position={[4.05, 1.0, 0]}
        scale={[0.6, 2.0, 3.8]}
      />
    </group>
  );
}
