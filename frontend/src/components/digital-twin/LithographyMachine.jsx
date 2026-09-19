import React, { useRef } from 'react'
import * as THREE from 'three'
import { Edges, Html } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'

const NORMAL = '#3ee08a'
const WARNING = '#ffab3d'
const CRITICAL = '#ff4d5e'

const MIN_POSITION_MM = 0
const MAX_POSITION_MM = 100

const UV_FRONT_Z = 1.25
const UV_REAR_Z = -1.25

function statusColor(status) {
  if (status === 'critical') return CRITICAL
  if (status === 'warning') return WARNING
  return NORMAL
}

function mapMotorPosition(positionMm) {
  const numeric = Number(positionMm)

  const clamped = THREE.MathUtils.clamp(
    Number.isFinite(numeric) ? numeric : 0,
    MIN_POSITION_MM,
    MAX_POSITION_MM
  )

  const normalized =
    (clamped - MIN_POSITION_MM) /
    (MAX_POSITION_MM - MIN_POSITION_MM)

  return THREE.MathUtils.lerp(
    UV_FRONT_Z,
    UV_REAR_Z,
    normalized
  )
}

/* ============================================================
   MACHINE FRAME
   ============================================================ */

function MachineFrame() {
  return (
    <group name="machine-frame">

      {/* Base */}
      <mesh
        position={[0, 0.05, 0]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[5.0, 0.35, 3.6]} />
        <meshStandardMaterial
          color="#151d26"
          metalness={0.8}
          roughness={0.35}
        />
        <Edges
          color="#41515f"
          threshold={15}
        />
      </mesh>

      {/* Upper base plate */}
      <mesh
        position={[0, 0.28, 0]}
        castShadow
      >
        <boxGeometry args={[4.7, 0.18, 3.3]} />
        <meshStandardMaterial
          color="#303b46"
          metalness={0.82}
          roughness={0.28}
        />
      </mesh>

      {/* Left vertical column */}
      <mesh
        position={[-2.15, 2.35, 0]}
        castShadow
      >
        <boxGeometry args={[0.30, 4.35, 0.32]} />
        <meshStandardMaterial
          color="#293640"
          metalness={0.82}
          roughness={0.30}
        />
        <Edges color="#526574" />
      </mesh>

      {/* Right vertical column */}
      <mesh
        position={[2.15, 2.35, 0]}
        castShadow
      >
        <boxGeometry args={[0.30, 4.35, 0.32]} />
        <meshStandardMaterial
          color="#293640"
          metalness={0.82}
          roughness={0.30}
        />
        <Edges color="#526574" />
      </mesh>

      {/* Top beam */}
      <mesh
        position={[0, 4.48, 0]}
        castShadow
      >
        <boxGeometry args={[4.6, 0.35, 0.34]} />
        <meshStandardMaterial
          color="#364550"
          metalness={0.84}
          roughness={0.28}
        />
        <Edges color="#607481" />
      </mesh>

      {/* Rear enclosure */}
      <mesh
        position={[0, 2.35, -1.55]}
        receiveShadow
      >
        <boxGeometry args={[4.25, 3.95, 0.14]} />
        <meshStandardMaterial
          color="#111a22"
          metalness={0.55}
          roughness={0.55}
        />
      </mesh>

      {/* Lower cabinet */}
      <mesh
        position={[0, 0.72, 1.48]}
        castShadow
      >
        <boxGeometry args={[4.35, 0.72, 0.22]} />
        <meshStandardMaterial
          color="#202a33"
          metalness={0.72}
          roughness={0.35}
        />
        <Edges color="#455764" />
      </mesh>

      {/* Cabinet doors */}
      {[-1.35, -0.45, 0.45, 1.35].map((x) => (
        <mesh
          key={x}
          position={[x, 0.72, 1.605]}
        >
          <boxGeometry args={[0.78, 0.52, 0.025]} />
          <meshStandardMaterial
            color="#182129"
            metalness={0.65}
            roughness={0.38}
          />
          <Edges color="#354652" />
        </mesh>
      ))}

      {/* Feet */}
      {[
        [-1.9, -1.25],
        [1.9, -1.25],
        [-1.9, 1.25],
        [1.9, 1.25],
      ].map(([x, z]) => (
        <group
          key={`${x}-${z}`}
          position={[x, -0.16, z]}
        >
          <mesh>
            <cylinderGeometry
              args={[0.16, 0.20, 0.18, 24]}
            />
            <meshStandardMaterial
              color="#0b1117"
              metalness={0.75}
              roughness={0.30}
            />
          </mesh>

          <mesh position={[0, -0.10, 0]}>
            <cylinderGeometry
              args={[0.13, 0.13, 0.04, 24]}
            />
            <meshStandardMaterial
              color="#53616d"
              metalness={0.85}
              roughness={0.25}
            />
          </mesh>
        </group>
      ))}
    </group>
  )
}

/* ============================================================
   VACUUM CHAMBER
   ============================================================ */

function VacuumChamber({ status = 'normal' }) {
  const accent = statusColor(status)

  return (
    <group name="vacuum-chamber">

      {/* Chamber back wall */}
      <mesh
        position={[0, 2.45, -1.15]}
        castShadow
      >
        <boxGeometry args={[3.55, 3.15, 0.18]} />
        <meshStandardMaterial
          color="#31404b"
          metalness={0.65}
          roughness={0.32}
        />
        <Edges color="#627582" />
      </mesh>

      {/* Left chamber wall */}
      <mesh
        position={[-1.72, 2.45, 0]}
        castShadow
      >
        <boxGeometry args={[0.18, 3.15, 2.55]} />
        <meshStandardMaterial
          color="#364650"
          metalness={0.62}
          roughness={0.30}
        />
        <Edges color="#687c88" />
      </mesh>

      {/* Right chamber wall */}
      <mesh
        position={[1.72, 2.45, 0]}
        castShadow
      >
        <boxGeometry args={[0.18, 3.15, 2.55]} />
        <meshStandardMaterial
          color="#364650"
          metalness={0.62}
          roughness={0.30}
        />
        <Edges color="#687c88" />
      </mesh>

      {/* Chamber roof */}
      <mesh
        position={[0, 4.0, 0]}
        castShadow
      >
        <boxGeometry args={[3.55, 0.18, 2.55]} />
        <meshStandardMaterial
          color="#3b4a55"
          metalness={0.72}
          roughness={0.28}
        />
        <Edges color="#71838e" />
      </mesh>

      {/* Transparent front window */}
      <mesh
        position={[0, 2.45, 1.22]}
      >
        <boxGeometry args={[3.25, 2.85, 0.045]} />
        <meshPhysicalMaterial
          color="#6b8790"
          transparent
          opacity={0.16}
          roughness={0.12}
          metalness={0.18}
          transmission={0.35}
          thickness={0.04}
        />
      </mesh>

      {/* Chamber status strips */}
      <mesh
        position={[-1.82, 2.45, 1.30]}
      >
        <boxGeometry args={[0.035, 2.65, 0.035]} />
        <meshStandardMaterial
          color={accent}
          emissive={accent}
          emissiveIntensity={1.4}
        />
      </mesh>

      <mesh
        position={[1.82, 2.45, 1.30]}
      >
        <boxGeometry args={[0.035, 2.65, 0.035]} />
        <meshStandardMaterial
          color={accent}
          emissive={accent}
          emissiveIntensity={1.4}
        />
      </mesh>

      {/* Chamber top status light */}
      <mesh
        position={[0, 4.08, 1.08]}
      >
        <sphereGeometry args={[0.08, 20, 20]} />
        <meshStandardMaterial
          color={accent}
          emissive={accent}
          emissiveIntensity={2}
        />
      </mesh>

      {/* Vacuum port */}
      <group position={[1.35, 3.65, 1.30]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry
            args={[0.16, 0.16, 0.12, 32]}
          />
          <meshStandardMaterial
            color="#687781"
            metalness={0.9}
            roughness={0.20}
          />
        </mesh>

        <mesh position={[0, 0, 0.08]}>
          <torusGeometry
            args={[0.12, 0.025, 12, 32]}
          />
          <meshStandardMaterial
            color={accent}
            emissive={accent}
            emissiveIntensity={0.8}
          />
        </mesh>
      </group>
    </group>
  )
}

/* ============================================================
   VIBRATION ISOLATION
   ============================================================ */

function VibrationIsolation({ status = 'normal' }) {
  const accent = statusColor(status)

  return (
    <group name="vibration-isolation">

      {[-1.15, 1.15].map((x) => (
        <group
          key={x}
          position={[x, 0.48, 0]}
        >
          <mesh castShadow>
            <cylinderGeometry
              args={[0.20, 0.20, 0.22, 32]}
            />
            <meshStandardMaterial
              color="#1b242c"
              metalness={0.86}
              roughness={0.24}
            />
          </mesh>

          <mesh position={[0, 0.14, 0]}>
            <cylinderGeometry
              args={[0.15, 0.15, 0.10, 32]}
            />
            <meshStandardMaterial
              color="#53616d"
              metalness={0.9}
              roughness={0.2}
            />
          </mesh>

          <mesh position={[0, 0.22, 0]}>
            <torusGeometry
              args={[0.14, 0.018, 10, 32]}
            />
            <meshStandardMaterial
              color={accent}
              emissive={accent}
              emissiveIntensity={0.8}
            />
          </mesh>
        </group>
      ))}

      <mesh position={[0, 0.58, 0]}>
        <boxGeometry args={[2.75, 0.12, 1.55]} />
        <meshStandardMaterial
          color="#202a33"
          metalness={0.82}
          roughness={0.25}
        />
      </mesh>
    </group>
  )
}

/* ============================================================
   WAFER
   ============================================================ */

function Wafer() {
  return (
    <group
      name="wafer"
      position={[0, 1.08, 0]}
    >

      {/* Main wafer disk
          Cylinder axis = Y
          Therefore the wafer is horizontal. */}
      <mesh
        castShadow
        receiveShadow
      >
        <cylinderGeometry
          args={[0.92, 0.92, 0.065, 96]}
        />
        <meshStandardMaterial
          color="#aebbc5"
          metalness={0.82}
          roughness={0.23}
        />
      </mesh>

      {/* Wafer outer rim */}
      <mesh position={[0, 0.038, 0]}>
        <torusGeometry
          args={[0.865, 0.025, 12, 96]}
        />
        <meshStandardMaterial
          color="#657580"
          metalness={0.9}
          roughness={0.18}
        />
      </mesh>

      {/* Wafer inner processing area */}
      <mesh position={[0, 0.039, 0]}>
        <cylinderGeometry
          args={[0.78, 0.78, 0.008, 96]}
        />
        <meshStandardMaterial
          color="#d0d9df"
          metalness={0.65}
          roughness={0.20}
        />
      </mesh>

      {/* Wafer center mark */}
      <mesh position={[0, 0.045, 0]}>
        <torusGeometry
          args={[0.12, 0.012, 10, 32]}
        />
        <meshStandardMaterial
          color="#73828c"
          metalness={0.65}
          roughness={0.25}
        />
      </mesh>

      {/* Wafer notch */}
      <mesh
        position={[0, 0.045, -0.895]}
        rotation={[0, 0, 0]}
      >
        <boxGeometry args={[0.10, 0.012, 0.08]} />
        <meshStandardMaterial
          color="#39454e"
          metalness={0.5}
          roughness={0.35}
        />
      </mesh>
    </group>
  )
}

/* ============================================================
   WAFER STAGE
   ============================================================ */

function MotorDrivenStage({
  displacementStatus = 'normal',
}) {
  const accent = statusColor(displacementStatus)

  return (
    <group
      name="wafer-stage"
      position={[0, 0, 0]}
    >

      {/* Precision stage body */}
      <mesh
        position={[0, 0.78, 0]}
        castShadow
      >
        <boxGeometry args={[2.65, 0.28, 1.65]} />
        <meshStandardMaterial
          color="#252f38"
          metalness={0.88}
          roughness={0.22}
        />
        <Edges color="#566975" />
      </mesh>

      {/* Stage top */}
      <mesh
        position={[0, 0.96, 0]}
        castShadow
      >
        <boxGeometry args={[2.25, 0.10, 1.35]} />
        <meshStandardMaterial
          color="#414e58"
          metalness={0.90}
          roughness={0.20}
        />
      </mesh>

      {/* Circular wafer support */}
      <mesh
        position={[0, 1.00, 0]}
        castShadow
      >
        <cylinderGeometry
          args={[1.03, 1.03, 0.10, 64]}
        />
        <meshStandardMaterial
          color="#171e25"
          metalness={0.88}
          roughness={0.23}
        />
      </mesh>

      {/* Stage status ring */}
      <mesh
        position={[0, 1.055, 0]}
      >
        <torusGeometry
          args={[1.01, 0.025, 12, 64]}
        />
        <meshStandardMaterial
          color={accent}
          emissive={accent}
          emissiveIntensity={0.7}
          metalness={0.7}
          roughness={0.2}
        />
      </mesh>

      <Wafer />

      {/* Linear actuator underneath */}
      <group position={[0, 0.47, 0]}>
        <mesh
          rotation={[Math.PI / 2, 0, 0]}
          castShadow
        >
          <cylinderGeometry
            args={[0.13, 0.13, 1.25, 32]}
          />
          <meshStandardMaterial
            color="#333e47"
            metalness={0.92}
            roughness={0.20}
          />
        </mesh>

        <mesh
          position={[0, 0, 0.65]}
          rotation={[Math.PI / 2, 0, 0]}
        >
          <cylinderGeometry
            args={[0.09, 0.09, 0.08, 24]}
          />
          <meshStandardMaterial
            color="#98a5ae"
            metalness={0.96}
            roughness={0.15}
          />
        </mesh>
      </group>

      {/* Positioning actuators */}
      {[
        [-1.10, 0.60],
        [1.10, 0.60],
        [-1.10, -0.60],
        [1.10, -0.60],
      ].map(([x, z]) => (
        <group
          key={`${x}-${z}`}
          position={[x, 0.96, z]}
        >
          <mesh>
            <cylinderGeometry
              args={[0.055, 0.055, 0.20, 20]}
            />
            <meshStandardMaterial
              color="#8996a0"
              metalness={0.92}
              roughness={0.18}
            />
          </mesh>
        </group>
      ))}
    </group>
  )
}

/* ============================================================
   OPTICAL / UV MODULE
   ============================================================ */

function OpticalModule({
  positionMm = 0,
  temperatureStatus = 'normal',
}) {
  const groupRef = useRef(null)
  const accent = statusColor(temperatureStatus)

  useFrame(() => {
    if (!groupRef.current) return

    const targetZ = mapMotorPosition(positionMm)

    groupRef.current.position.z = THREE.MathUtils.lerp(
      groupRef.current.position.z,
      targetZ,
      0.08
    )
  })

  return (
    <group
      name="optical-module"
      ref={groupRef}
      position={[0, 0, mapMotorPosition(positionMm)]}
    >

      {/* Optical support arm */}
      <mesh
        position={[0, 4.10, 0]}
        castShadow
      >
        <boxGeometry args={[0.62, 0.24, 0.62]} />
        <meshStandardMaterial
          color="#35434d"
          metalness={0.86}
          roughness={0.22}
        />
        <Edges color="#60737e" />
      </mesh>

      {/* Main optical housing */}
      <mesh
        position={[0, 3.62, 0]}
        castShadow
      >
        <cylinderGeometry
          args={[0.38, 0.48, 0.72, 48]}
        />
        <meshStandardMaterial
          color="#697781"
          metalness={0.90}
          roughness={0.18}
        />
      </mesh>

      {/* Housing upper collar */}
      <mesh
        position={[0, 4.00, 0]}
      >
        <torusGeometry
          args={[0.31, 0.045, 12, 48]}
        />
        <meshStandardMaterial
          color={accent}
          emissive={accent}
          emissiveIntensity={1.0}
          metalness={0.75}
          roughness={0.18}
        />
      </mesh>

      {/* Lower lens housing */}
      <mesh
        position={[0, 3.18, 0]}
        castShadow
      >
        <cylinderGeometry
          args={[0.27, 0.21, 0.30, 40]}
        />
        <meshStandardMaterial
          color="#c2ccd2"
          metalness={0.88}
          roughness={0.12}
        />
      </mesh>

      {/* Lens */}
      <mesh
        position={[0, 3.00, 0]}
      >
        <cylinderGeometry
          args={[0.18, 0.18, 0.07, 40]}
        />
        <meshPhysicalMaterial
          color="#74d9ff"
          emissive="#176b9a"
          emissiveIntensity={0.55}
          transmission={0.65}
          transparent
          opacity={0.85}
          roughness={0.08}
          metalness={0.15}
        />
      </mesh>

      {/* UV beam */}
      <mesh
        position={[0, 2.03, 0]}
      >
        <cylinderGeometry
          args={[0.055, 0.12, 1.85, 32]}
        />
        <meshBasicMaterial
          color="#38bdf8"
          transparent
          opacity={0.16}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Beam core */}
      <mesh
        position={[0, 2.03, 0]}
      >
        <cylinderGeometry
          args={[0.018, 0.030, 1.85, 24]}
        />
        <meshBasicMaterial
          color="#9be7ff"
          transparent
          opacity={0.72}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Beam spot on wafer */}
      <mesh
        position={[0, 1.10, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <circleGeometry args={[0.16, 48]} />
        <meshBasicMaterial
          color="#55dfff"
          transparent
          opacity={0.38}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Support struts */}
      {[-0.25, 0.25].map((x) => (
        <mesh
          key={x}
          position={[x, 4.05, 0]}
          castShadow
        >
          <boxGeometry args={[0.07, 0.38, 0.07]} />
          <meshStandardMaterial
            color="#53636e"
            metalness={0.86}
            roughness={0.22}
          />
        </mesh>
      ))}
    </group>
  )
}

/* ============================================================
   SENSOR NODE
   ============================================================ */

function SensorNode({
  position,
  status,
  label,
  value,
}) {
  const color = statusColor(status)

  return (
    <group
      position={position}
      name={`sensor-${label}`}
    >

      {/* Mount */}
      <mesh
        rotation={[Math.PI / 2, 0, 0]}
      >
        <cylinderGeometry
          args={[0.11, 0.11, 0.08, 24]}
        />
        <meshStandardMaterial
          color="#18222a"
          metalness={0.88}
          roughness={0.22}
        />
      </mesh>

      {/* Indicator */}
      <mesh position={[0, 0, 0.07]}>
        <sphereGeometry args={[0.075, 24, 24]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={2.5}
        />
      </mesh>

      {/* Outer ring */}
      <mesh
        position={[0, 0, 0.075]}
        rotation={[Math.PI / 2, 0, 0]}
      >
        <torusGeometry
          args={[0.10, 0.012, 10, 32]}
        />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={1.2}
        />
      </mesh>

      {/* Visible technical label */}
      <Html
        position={[0.14, 0.02, 0.08]}
        center={false}
        distanceFactor={7}
        transform
        sprite
      >
        <div
          style={{
            pointerEvents: 'none',
            minWidth: '92px',
            padding: '5px 7px',
            background: 'rgba(4, 8, 13, 0.88)',
            border: `1px solid ${color}`,
            borderRadius: '3px',
            color: '#dbeafe',
            fontFamily: 'monospace',
            fontSize: '9px',
            lineHeight: '1.35',
            whiteSpace: 'nowrap',
            boxShadow: `0 0 10px ${color}33`,
          }}
        >
          <div
            style={{
              color,
              fontWeight: 700,
            }}
          >
            ● {label}
          </div>

          <div
            style={{
              color: '#94a3b8',
              marginTop: '2px',
            }}
          >
            {value}
          </div>
        </div>
      </Html>
    </group>
  )
}

/* ============================================================
   MAIN LITHOGRAPHY MACHINE
   ============================================================ */

export default function LithographyMachine({
  positionMm = 0,

  statuses = {
    pressure: 'normal',
    vibration: 'normal',
    temperature: 'normal',
    displacement: 'normal',
  },
}) {
  return (
    <group name="LithographyMachine">

      {/* Main machine */}
      <MachineFrame />

      {/* Vacuum chamber */}
      <VacuumChamber
        status={statuses.pressure}
      />

      {/* Vibration isolation */}
      <VibrationIsolation
        status={statuses.vibration}
      />

      {/* Fixed wafer stage */}
      <MotorDrivenStage
        displacementStatus={
          statuses.displacement
        }
      />

      {/* Moving optical / UV module */}
      <OpticalModule
        positionMm={positionMm}
        temperatureStatus={
          statuses.temperature
        }
      />

      {/* ======================================================
          FOUR VISIBLE SENSOR INDICATORS

          Pressure      → Vacuum chamber
          Vibration     → Isolation system
          Temperature   → Optical module
          Displacement  → Wafer stage
         ====================================================== */}

      <SensorNode
        position={[1.95, 3.55, 1.42]}
        status={statuses.pressure}
        label="PRESSURE"
        value={statuses.pressure.toUpperCase()}
      />

      <SensorNode
        position={[-1.95, 1.05, 1.42]}
        status={statuses.vibration}
        label="VIBRATION"
        value={statuses.vibration.toUpperCase()}
      />

      <SensorNode
        position={[1.25, 4.32, 1.40]}
        status={statuses.temperature}
        label="TEMPERATURE"
        value={statuses.temperature.toUpperCase()}
      />

      <SensorNode
        position={[-1.25, 1.10, 1.42]}
        status={statuses.displacement}
        label="DISPLACEMENT"
        value={statuses.displacement.toUpperCase()}
      />

    </group>
  )
}
