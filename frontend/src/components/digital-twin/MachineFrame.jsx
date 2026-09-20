import React from 'react'
import { Edges } from '@react-three/drei'

const BODY = '#252d36'
const BODY_LIGHT = '#303a45'
const BODY_DARK = '#151c24'
const METAL = '#657382'
const METAL_DARK = '#3d4955'
const BLACK = '#080d12'
const GLASS = '#111b23'

function SolidPanel({
  position,
  scale,
  color = BODY,
  metalness = 0.78,
  roughness = 0.30,
  edges = true,
}) {
  return (
    <mesh
      position={position}
      scale={scale}
      castShadow
      receiveShadow
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial
        color={color}
        metalness={metalness}
        roughness={roughness}
      />

      {edges && (
        <Edges
          color={METAL}
          threshold={20}
          scale={1.002}
        />
      )}
    </mesh>
  )
}

function DarkPanel({
  position,
  scale,
}) {
  return (
    <mesh
      position={position}
      scale={scale}
      castShadow
      receiveShadow
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial
        color={BLACK}
        metalness={0.35}
        roughness={0.48}
      />
    </mesh>
  )
}

function Vent({
  position,
  rotation = [0, 0, 0],
  count = 7,
}) {
  return (
    <group
      position={position}
      rotation={rotation}
    >
      {Array.from({ length: count }).map((_, index) => (
        <mesh
          key={index}
          position={[(index - (count - 1) / 2) * 0.11, 0, 0]}
        >
          <boxGeometry args={[0.045, 0.28, 0.018]} />
          <meshStandardMaterial
            color="#0a1016"
            metalness={0.45}
            roughness={0.42}
          />
        </mesh>
      ))}
    </group>
  )
}

function StatusLight({ position }) {
  return (
    <group position={position}>
      <mesh>
        <cylinderGeometry args={[0.035, 0.035, 0.018, 20]} />
        <meshStandardMaterial
          color="#18343b"
          emissive="#0b5963"
          emissiveIntensity={0.55}
          metalness={0.4}
          roughness={0.28}
        />
      </mesh>
    </group>
  )
}

export default function MachineFrame({
  selected = false,
  onSelect,
}) {
  const accent = selected ? '#22d3ee' : '#58717d'

  return (
    <group
      name="machine-frame"
      onClick={(event) => {
        event.stopPropagation()
        onSelect?.('machine')
      }}
    >

      {/* =====================================================
          MACHINE FOOTPRINT
         ===================================================== */}

      <SolidPanel
        position={[0, 0.16, 0]}
        scale={[5.15, 0.32, 3.55]}
        color={BODY_DARK}
        metalness={0.72}
        roughness={0.36}
      />

      <SolidPanel
        position={[0, 0.37, 0]}
        scale={[4.82, 0.12, 3.28]}
        color="#39444f"
        metalness={0.82}
        roughness={0.28}
      />

      {/* Small mechanical feet */}

      {[
        [-2.05, 0.02, -1.25],
        [2.05, 0.02, -1.25],
        [-2.05, 0.02, 1.25],
        [2.05, 0.02, 1.25],
      ].map(([x, y, z], index) => (
        <group key={index} position={[x, y, z]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.16, 0.19, 0.18, 24]} />
            <meshStandardMaterial
              color="#11171d"
              metalness={0.75}
              roughness={0.30}
            />
          </mesh>

          <mesh position={[0, -0.095, 0]}>
            <cylinderGeometry args={[0.13, 0.13, 0.035, 24]} />
            <meshStandardMaterial
              color="#56636f"
              metalness={0.85}
              roughness={0.26}
            />
          </mesh>
        </group>
      ))}


      {/* =====================================================
          LOWER FRONT EQUIPMENT CABINET
         ===================================================== */}

      <SolidPanel
        position={[0, 0.67, 1.49]}
        scale={[4.55, 0.52, 0.22]}
        color={BODY_LIGHT}
      />

      {/* Service doors */}

      {[-1.55, -0.52, 0.52, 1.55].map((x) => (
        <group key={x}>
          <mesh
            position={[x, 0.67, 1.615]}
            castShadow
          >
            <boxGeometry args={[0.91, 0.38, 0.035]} />
            <meshStandardMaterial
              color="#202932"
              metalness={0.72}
              roughness={0.34}
            />

            <Edges
              color="#53616e"
              threshold={20}
            />
          </mesh>

          {/* Door handle */}

          <mesh
            position={[x, 0.67, 1.642]}
          >
            <boxGeometry args={[0.38, 0.025, 0.018]} />
            <meshStandardMaterial
              color="#687887"
              metalness={0.88}
              roughness={0.22}
            />
          </mesh>
        </group>
      ))}


      {/* =====================================================
          LEFT / RIGHT MAIN ENCLOSURE
         ===================================================== */}

      <SolidPanel
        position={[-2.30, 1.78, 0]}
        scale={[0.42, 2.55, 3.20]}
        color={BODY}
      />

      <SolidPanel
        position={[2.30, 1.78, 0]}
        scale={[0.42, 2.55, 3.20]}
        color={BODY}
      />

      {/* Outer vertical metal rails */}

      <SolidPanel
        position={[-2.53, 1.80, 0]}
        scale={[0.075, 2.38, 3.00]}
        color={METAL}
        metalness={0.92}
        roughness={0.22}
        edges={false}
      />

      <SolidPanel
        position={[2.53, 1.80, 0]}
        scale={[0.075, 2.38, 3.00]}
        color={METAL}
        metalness={0.92}
        roughness={0.22}
        edges={false}
      />


      {/* =====================================================
          FRONT PROCESS DOOR / VIEWING AREA
         ===================================================== */}

      {/* Left front vertical housing */}

      <SolidPanel
        position={[-2.00, 1.78, 1.48]}
        scale={[0.46, 2.48, 0.24]}
        color={BODY_LIGHT}
      />

      {/* Right front vertical housing */}

      <SolidPanel
        position={[2.00, 1.78, 1.48]}
        scale={[0.46, 2.48, 0.24]}
        color={BODY_LIGHT}
      />

      {/* Lower front beam */}

      <SolidPanel
        position={[0, 0.91, 1.48]}
        scale={[3.55, 0.40, 0.24]}
        color={BODY_LIGHT}
      />

      {/* Upper front beam */}

      <SolidPanel
        position={[0, 2.78, 1.48]}
        scale={[3.55, 0.38, 0.24]}
        color={BODY_LIGHT}
      />

      {/* Dark process-door interior */}

      <DarkPanel
        position={[0, 1.82, 1.34]}
        scale={[3.55, 1.78, 0.08]}
      />

      {/* Viewing window */}

      <mesh
        position={[0, 1.78, 1.405]}
      >
        <boxGeometry args={[3.12, 1.52, 0.035]} />
        <meshStandardMaterial
          color={GLASS}
          metalness={0.25}
          roughness={0.18}
          transparent
          opacity={0.82}
        />

        <Edges
          color="#607b88"
          threshold={15}
        />
      </mesh>

      {/* Window inner border */}

      <SolidPanel
        position={[0, 2.56, 1.435]}
        scale={[3.18, 0.055, 0.055]}
        color="#60727f"
        metalness={0.90}
        roughness={0.24}
        edges={false}
      />

      <SolidPanel
        position={[0, 1.00, 1.435]}
        scale={[3.18, 0.055, 0.055]}
        color="#60727f"
        metalness={0.90}
        roughness={0.24}
        edges={false}
      />

      <SolidPanel
        position={[-1.56, 1.78, 1.435]}
        scale={[0.055, 1.58, 0.055]}
        color="#60727f"
        metalness={0.90}
        roughness={0.24}
        edges={false}
      />

      <SolidPanel
        position={[1.56, 1.78, 1.435]}
        scale={[0.055, 1.58, 0.055]}
        color="#60727f"
        metalness={0.90}
        roughness={0.24}
        edges={false}
      />


      {/* =====================================================
          TOP EQUIPMENT HOUSING
         ===================================================== */}

      <SolidPanel
        position={[0, 3.00, 0]}
        scale={[4.85, 0.48, 3.28]}
        color={BODY}
      />

      {/* Slightly raised top service cover */}

      <SolidPanel
        position={[0, 3.29, -0.02]}
        scale={[4.45, 0.12, 2.88]}
        color="#1b232c"
        metalness={0.72}
        roughness={0.32}
      />

      {/* Top front lip */}

      <SolidPanel
        position={[0, 2.77, 1.50]}
        scale={[4.50, 0.16, 0.24]}
        color={METAL_DARK}
      />

      {/* Top side covers */}

      <SolidPanel
        position={[-2.20, 3.00, 0]}
        scale={[0.20, 0.44, 2.85]}
        color="#596774"
        metalness={0.90}
        roughness={0.25}
        edges={false}
      />

      <SolidPanel
        position={[2.20, 3.00, 0]}
        scale={[0.20, 0.44, 2.85]}
        color="#596774"
        metalness={0.90}
        roughness={0.25}
        edges={false}
      />


      {/* =====================================================
          TOP SERVICE DETAILS
         ===================================================== */}

      <Vent
        position={[-1.18, 3.365, -0.62]}
      />

      <Vent
        position={[1.18, 3.365, -0.62]}
      />

      {/* Small service blocks */}

      <SolidPanel
        position={[-1.55, 3.39, 0.55]}
        scale={[0.72, 0.08, 0.42]}
        color="#252f39"
      />

      <SolidPanel
        position={[1.55, 3.39, 0.55]}
        scale={[0.72, 0.08, 0.42]}
        color="#252f39"
      />


      {/* =====================================================
          REAR ENCLOSURE
         ===================================================== */}

      <SolidPanel
        position={[0, 1.72, -1.47]}
        scale={[4.38, 2.55, 0.22]}
        color={BODY_DARK}
      />

      {/* Rear access panel */}

      <SolidPanel
        position={[0, 1.72, -1.595]}
        scale={[2.85, 1.82, 0.035]}
        color="#1b242d"
        metalness={0.58}
        roughness={0.38}
      />

      {/* Rear panel divisions */}

      <SolidPanel
        position={[-1.42, 1.72, -1.625]}
        scale={[0.035, 1.82, 0.025]}
        color="#566572"
        metalness={0.8}
        roughness={0.28}
        edges={false}
      />

      <SolidPanel
        position={[1.42, 1.72, -1.625]}
        scale={[0.035, 1.82, 0.025]}
        color="#566572"
        metalness={0.8}
        roughness={0.28}
        edges={false}
      />


      {/* =====================================================
          SIDE VENTILATION / SERVICE DETAILS
         ===================================================== */}

      <Vent
        position={[-2.54, 1.82, -0.58]}
        rotation={[0, Math.PI / 2, 0]}
        count={9}
      />

      <Vent
        position={[2.54, 1.82, -0.58]}
        rotation={[0, Math.PI / 2, 0]}
        count={9}
      />


      {/* =====================================================
          SMALL INDUSTRIAL STATUS DETAILS
         ===================================================== */}

      <StatusLight
        position={[-1.78, 2.82, 1.61]}
      />

      <StatusLight
        position={[1.78, 2.82, 1.61]}
      />

      {/* Technical accent strips */}

      <mesh
        position={[0, 2.69, 1.615]}
      >
        <boxGeometry args={[3.18, 0.018, 0.018]} />
        <meshBasicMaterial
          color={accent}
          transparent
          opacity={selected ? 0.90 : 0.30}
        />
      </mesh>

      <mesh
        position={[0, 0.92, 1.615]}
      >
        <boxGeometry args={[3.18, 0.018, 0.018]} />
        <meshBasicMaterial
          color={accent}
          transparent
          opacity={selected ? 0.80 : 0.20}
        />
      </mesh>


      {/* =====================================================
          SMALL FRONT CONTROL PANEL
         ===================================================== */}

      <group position={[1.62, 1.05, 1.62]}>
        <mesh>
          <boxGeometry args={[0.48, 0.32, 0.045]} />
          <meshStandardMaterial
            color="#111820"
            metalness={0.55}
            roughness={0.35}
          />
        </mesh>

        <mesh position={[0, 0.07, 0.028]}>
          <boxGeometry args={[0.28, 0.035, 0.012]} />
          <meshBasicMaterial
            color="#58717d"
          />
        </mesh>

        <mesh position={[-0.15, -0.075, 0.03]}>
          <cylinderGeometry args={[0.022, 0.022, 0.012, 16]} />
          <meshStandardMaterial
            color="#6b7c88"
            metalness={0.8}
            roughness={0.25}
          />
        </mesh>

        <mesh position={[0, -0.075, 0.03]}>
          <cylinderGeometry args={[0.022, 0.022, 0.012, 16]} />
          <meshStandardMaterial
            color="#6b7c88"
            metalness={0.8}
            roughness={0.25}
          />
        </mesh>

        <mesh position={[0.15, -0.075, 0.03]}>
          <cylinderGeometry args={[0.022, 0.022, 0.012, 16]} />
          <meshStandardMaterial
            color="#6b7c88"
            metalness={0.8}
            roughness={0.25}
          />
        </mesh>
      </group>

    </group>
  )
}
