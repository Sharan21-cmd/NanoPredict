import React from 'react'
import { Edges } from '@react-three/drei'

const PANEL = '#27313d'
const PANEL_DARK = '#151c25'
const METAL = '#667382'
const EDGE = '#8ea0b2'
const INNER = '#0d151e'

function Panel({
  position,
  scale,
  color = PANEL,
  bevel = false,
}) {
  return (
    <mesh position={position} scale={scale} castShadow receiveShadow>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial
        color={color}
        metalness={0.82}
        roughness={0.28}
      />
      {bevel && (
        <Edges
          color={EDGE}
          threshold={18}
          scale={1.003}
        />
      )}
    </mesh>
  )
}

export default function MachineFrame({
  selected = false,
  onSelect,
}) {
  const edgeColor = selected ? '#22d3ee' : EDGE

  return (
    <group
      name="machine-frame"
      onClick={(event) => {
        event.stopPropagation()
        onSelect?.('machine')
      }}
    >
      {/* =========================
          LOWER MACHINE BASE
         ========================= */}

      <Panel
        position={[0, 0.12, 0]}
        scale={[4.8, 0.24, 3.35]}
        color={PANEL_DARK}
        bevel
      />

      <Panel
        position={[0, 0.29, 0]}
        scale={[4.55, 0.12, 3.08]}
        color="#35414e"
        bevel
      />

      {/* Front lower equipment fascia */}

      <Panel
        position={[0, 0.48, 1.48]}
        scale={[4.35, 0.40, 0.16]}
        color="#303b47"
        bevel
      />

      {/* Front access panels */}

      {[-1.55, -0.52, 0.52, 1.55].map((x) => (
        <group key={x}>
          <mesh
            position={[x, 0.50, 1.575]}
            castShadow
          >
            <boxGeometry args={[0.88, 0.34, 0.035]} />
            <meshStandardMaterial
              color="#202a35"
              metalness={0.72}
              roughness={0.32}
            />
          </mesh>

          <mesh
            position={[x, 0.50, 1.598]}
          >
            <boxGeometry args={[0.72, 0.018, 0.012]} />
            <meshStandardMaterial
              color="#536272"
              metalness={0.8}
              roughness={0.24}
            />
          </mesh>
        </group>
      ))}

      {/* =========================
          LEFT / RIGHT ENCLOSURE
         ========================= */}

      <Panel
        position={[-2.18, 1.55, 0]}
        scale={[0.30, 2.65, 3.0]}
        color="#303b47"
        bevel
      />

      <Panel
        position={[2.18, 1.55, 0]}
        scale={[0.30, 2.65, 3.0]}
        color="#303b47"
        bevel
      />

      {/* Outer side silver strips */}

      <Panel
        position={[-2.37, 1.58, 0]}
        scale={[0.07, 2.50, 2.82]}
        color="#7c8997"
      />

      <Panel
        position={[2.37, 1.58, 0]}
        scale={[0.07, 2.50, 2.82]}
        color="#7c8997"
      />

      {/* =========================
          REAR STRUCTURE
         ========================= */}

      <Panel
        position={[0, 1.62, -1.38]}
        scale={[4.25, 2.65, 0.20]}
        color={INNER}
        bevel
      />

      {/* Rear vertical ribs */}

      {[-1.55, -0.75, 0, 0.75, 1.55].map((x) => (
        <Panel
          key={x}
          position={[x, 1.70, -1.50]}
          scale={[0.055, 2.35, 0.06]}
          color="#3f4d5b"
        />
      ))}

      {/* =========================
          TOP HOUSING
         ========================= */}

      <Panel
        position={[0, 2.92, 0]}
        scale={[4.55, 0.28, 3.05]}
        color="#303b47"
        bevel
      />

      <Panel
        position={[0, 3.10, 0]}
        scale={[4.18, 0.10, 2.72]}
        color="#141b23"
      />

      {/* Top front rail */}

      <Panel
        position={[0, 2.78, 1.42]}
        scale={[4.15, 0.24, 0.18]}
        color="#687787"
        bevel
      />

      {/* Top rear rail */}

      <Panel
        position={[0, 2.78, -1.42]}
        scale={[4.15, 0.24, 0.18]}
        color="#596877"
        bevel
      />

      {/* =========================
          INTERNAL STRUCTURAL POSTS
         ========================= */}

      {[-1.78, 1.78].map((x) => (
        <group key={x}>
          <Panel
            position={[x, 1.65, 1.22]}
            scale={[0.20, 2.20, 0.18]}
            color="#536170"
            bevel
          />

          <Panel
            position={[x, 1.65, -1.18]}
            scale={[0.16, 2.20, 0.16]}
            color="#465462"
          />
        </group>
      ))}

      {/* =========================
          INNER PROCESS BAY
         ========================= */}

      <mesh
        position={[0, 1.55, 0]}
        receiveShadow
      >
        <boxGeometry args={[3.65, 2.25, 2.30]} />
        <meshStandardMaterial
          color="#0a1118"
          metalness={0.35}
          roughness={0.52}
        />
      </mesh>

      {/* Internal ceiling */}

      <Panel
        position={[0, 2.62, 0]}
        scale={[3.65, 0.08, 2.30]}
        color="#1c2732"
      />

      {/* Cyan technical edge around process bay */}

      <mesh position={[0, 2.56, 1.17]}>
        <boxGeometry args={[3.55, 0.025, 0.025]} />
        <meshBasicMaterial
          color={edgeColor}
          transparent
          opacity={selected ? 0.9 : 0.28}
        />
      </mesh>

      {/* Side internal rails */}

      {[-1.55, 1.55].map((x) => (
        <group key={x}>
          <mesh position={[x, 1.55, 0]}>
            <boxGeometry args={[0.055, 1.95, 2.05]} />
            <meshStandardMaterial
              color="#68798a"
              metalness={0.9}
              roughness={0.24}
            />
          </mesh>

          {[0.72, 1.25, 1.78, 2.25].map((y) => (
            <mesh
              key={y}
              position={[x, y, 0]}
            >
              <boxGeometry args={[0.10, 0.035, 1.85]} />
              <meshStandardMaterial
                color="#344250"
                metalness={0.78}
                roughness={0.30}
              />
            </mesh>
          ))}
        </group>
      ))}

      {/* =========================
          FRONT INTERNAL DOOR FRAME
         ========================= */}

      <Panel
        position={[-1.82, 1.62, 1.23]}
        scale={[0.16, 2.15, 0.18]}
        color="#667686"
        bevel
      />

      <Panel
        position={[1.82, 1.62, 1.23]}
        scale={[0.16, 2.15, 0.18]}
        color="#667686"
        bevel
      />

      {/* Lower front corner blocks */}

      <Panel
        position={[-1.82, 0.72, 1.30]}
        scale={[0.38, 0.42, 0.22]}
        color="#202a35"
      />

      <Panel
        position={[1.82, 0.72, 1.30]}
        scale={[0.38, 0.42, 0.22]}
        color="#202a35"
      />
    </group>
  )
}
