import * as THREE from "three";

export const INDUSTRIAL_MATERIALS = {
  frame: {
    color: "#151b22",
    metalness: 0.85,
    roughness: 0.28,
  },

  frameDark: {
    color: "#0b1016",
    metalness: 0.9,
    roughness: 0.22,
  },

  steel: {
    color: "#59636d",
    metalness: 0.92,
    roughness: 0.24,
  },

  stainless: {
    color: "#8b949e",
    metalness: 0.95,
    roughness: 0.18,
  },

  darkMetal: {
    color: "#242c35",
    metalness: 0.88,
    roughness: 0.3,
  },

  electronics: {
    color: "#111820",
    metalness: 0.55,
    roughness: 0.38,
  },

  pcb: {
    color: "#123b35",
    metalness: 0.25,
    roughness: 0.5,
  },

  wafer: {
    color: "#202936",
    metalness: 0.72,
    roughness: 0.2,
  },

  rubber: {
    color: "#090b0e",
    metalness: 0.05,
    roughness: 0.72,
  },
};

export const STATUS_COLORS = {
  normal: "#00e676",
  warning: "#ffb020",
  critical: "#ff3b30",
  neutral: "#39bdf8",
};

export function createIndustrialMaterial(type = "frame") {
  const config =
    INDUSTRIAL_MATERIALS[type] || INDUSTRIAL_MATERIALS.frame;

  return new THREE.MeshStandardMaterial({
    color: config.color,
    metalness: config.metalness,
    roughness: config.roughness,
  });
}

export function createGlassMaterial(color = "#39bdf8", opacity = 0.22) {
  return new THREE.MeshPhysicalMaterial({
    color,
    metalness: 0.05,
    roughness: 0.08,
    transmission: 0.35,
    transparent: true,
    opacity,
    side: THREE.DoubleSide,
  });
}

export function getStatusColor(status = "normal") {
  return STATUS_COLORS[status] || STATUS_COLORS.neutral;
}
