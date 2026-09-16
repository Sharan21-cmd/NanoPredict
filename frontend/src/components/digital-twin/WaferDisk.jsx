import React from "react";
import * as THREE from "three";
import { INDUSTRIAL_MATERIALS } from "./materials";

export default function WaferDisk({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
}) {
  return (
    <group position={position} rotation={rotation}>
      {/* Main silicon wafer */}
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[1.55, 1.55, 0.055, 96]} />
        <meshStandardMaterial
          color={INDUSTRIAL_MATERIALS.wafer.color}
          metalness={0.72}
          roughness={0.2}
        />
      </mesh>

      {/* Outer wafer rim */}
      <mesh position={[0, 0.035, 0]} rotation={[0, 0, 0]}>
        <torusGeometry args={[1.48, 0.035, 16, 96]} />
        <meshStandardMaterial
          color="#64707c"
          metalness={0.9}
          roughness={0.18}
        />
      </mesh>

      {/* Inner process ring */}
      <mesh position={[0, 0.038, 0]}>
        <torusGeometry args={[1.18, 0.012, 12, 96]} />
        <meshStandardMaterial
          color="#465564"
          metalness={0.7}
          roughness={0.24}
        />
      </mesh>

      {/* Center alignment mark */}
      <mesh position={[0, 0.041, 0]}>
        <ringGeometry args={[0.16, 0.175, 48]} />
        <meshStandardMaterial
          color="#6e7f8e"
          metalness={0.8}
          roughness={0.2}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Wafer notch */}
      <mesh position={[0, 0.05, -1.49]}>
        <boxGeometry args={[0.18, 0.025, 0.12]} />
        <meshStandardMaterial
          color="#090d12"
          metalness={0.45}
          roughness={0.35}
        />
      </mesh>
    </group>
  );
}
