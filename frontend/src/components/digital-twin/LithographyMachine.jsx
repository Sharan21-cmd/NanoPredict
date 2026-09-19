import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useMemo, useRef } from 'react'

/*
 * Motor position:
 *   0 mm   -> front
 *   50 mm  -> center
 *   100 mm -> rear
 *
 * The motor physically drives the UV/optical assembly along Z.
 * The wafer/stage remains fixed.
 */

const MOTOR_MIN = 0
const MOTOR_MAX = 100

const UV_FRONT_Z = 1.15
const UV_REAR_Z = -1.15

export function mapMotorPosition(positionMm) {
  const position = THREE.MathUtils.clamp(
    Number(positionMm) || 0,
    MOTOR_MIN,
    MOTOR_MAX,
  )

  const normalized =
    (position - MOTOR_MIN) / (MOTOR_MAX - MOTOR_MIN)

  return THREE.MathUtils.lerp(
    UV_FRONT_Z,
    UV_REAR_Z,
    normalized,
  )
}

function getStatusColor(status) {
  switch (String(status || '').toLowerCase()) {
    case 'critical':
      return '#ef4444'

    case 'warning':
      return '#f59e0b'

    case 'normal':
    default:
      return '#22c55e'
  }
}

/* ============================================================
   MACHINE FRAME
   ============================================================ */

function MachineFrame() {
  const steel = '#263447'
  const darkSteel = '#151e2a'
  const panel = '#1d2938'

  return (
    <group>
      {/* Main vertical columns */}
      <mesh position={[-2.25, 1.65, 0]} castShadow>
        <boxGeometry args={[0.28, 3.8, 2.9]} />
        <meshStandardMaterial
          color={steel}
          metalness={0.72}
          roughness={0.3}
        />
      </mesh>

      <mesh position={[2.25, 1.65, 0]} castShadow>
        <boxGeometry args={[0.28, 3.8, 2.9]} />
        <meshStandardMaterial
          color={steel}
          metalness={0.72}
          roughness={0.3}
        />
      </mesh>

      {/* Top beam */}
      <mesh position={[0, 3.48, 0]} castShadow>
        <boxGeometry args={[4.8, 0.3, 2.9]} />
        <meshStandardMaterial
          color={darkSteel}
          metalness={0.7}
          roughness={0.32}
        />
      </mesh>

      {/* Lower frame */}
      <mesh position={[0, -0.02, 0]} castShadow>
        <boxGeometry args={[4.8, 0.3, 2.9]} />
        <meshStandardMaterial
          color={darkSteel}
          metalness={0.65}
          roughness={0.35}
        />
      </mesh>

      {/* Side panels */}
      <mesh position={[-1.72, 1.8, 0]} castShadow>
        <boxGeometry args={[0.85, 3.0, 2.45]} />
        <meshStandardMaterial
          color={panel}
          metalness={0.5}
          roughness={0.42}
        />
      </mesh>

      <mesh position={[1.72, 1.8, 0]} castShadow>
        <boxGeometry args={[0.85, 3.0, 2.45]} />
        <meshStandardMaterial
          color={panel}
          metalness={0.5}
          roughness={0.42}
        />
      </mesh>

      {/* Rear enclosure */}
      <mesh position={[0, 1.65, -1.28]} castShadow>
        <boxGeometry args={[3.25, 3.35, 0.16]} />
        <meshStandardMaterial
          color="#111a25"
          metalness={0.55}
          roughness={0.4}
        />
      </mesh>

      {/* Bottom cabinet */}
      <mesh position={[0, 0.42, -0.02]} castShadow>
        <boxGeometry args={[3.55, 0.7, 2.25]} />
        <meshStandardMaterial
          color="#182230"
          metalness={0.55}
          roughness={0.38}
        />
      </mesh>

      {/* Cabinet divisions */}
      {[-1.15, 0, 1.15].map((x) => (
        <mesh
          key={x}
          position={[x, 0.42, 1.12]}
        >
          <boxGeometry args={[0.03, 0.55, 0.02]} />
          <meshStandardMaterial color="#3b4a5c" />
        </mesh>
      ))}
    </group>
  )
}

/* ============================================================
   VACUUM CHAMBER
   ============================================================ */

function VacuumChamber() {
  return (
    <group>
      {/* Chamber floor */}
      <mesh
        position={[0, 1.15, 0]}
        receiveShadow
      >
        <boxGeometry args={[3.2, 0.08, 2.45]} />
        <meshStandardMaterial
          color="#152535"
          metalness={0.35}
          roughness={0.48}
        />
      </mesh>

      {/* Transparent chamber walls */}
      <mesh position={[0, 2.25, 1.22]}>
        <boxGeometry args={[3.2, 2.25, 0.055]} />
        <meshPhysicalMaterial
          color="#67e8f9"
          transparent
          opacity={0.14}
          transmission={0.5}
          roughness={0.08}
          metalness={0.05}
          side={THREE.DoubleSide}
        />
      </mesh>

      <mesh position={[0, 2.25, -1.22]}>
        <boxGeometry args={[3.2, 2.25, 0.055]} />
        <meshPhysicalMaterial
          color="#67e8f9"
          transparent
          opacity={0.11}
          transmission={0.5}
          roughness={0.08}
          side={THREE.DoubleSide}
        />
      </mesh>

      <mesh position={[-1.58, 2.25, 0]}>
        <boxGeometry args={[0.055, 2.25, 2.45]} />
        <meshPhysicalMaterial
          color="#67e8f9"
          transparent
          opacity={0.12}
          transmission={0.5}
          roughness={0.08}
          side={THREE.DoubleSide}
        />
      </mesh>

      <mesh position={[1.58, 2.25, 0]}>
        <boxGeometry args={[0.055, 2.25, 2.45]} />
        <meshPhysicalMaterial
          color="#67e8f9"
          transparent
          opacity={0.12}
          transmission={0.5}
          roughness={0.08}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Chamber top */}
      <mesh position={[0, 3.39, 0]}>
        <boxGeometry args={[3.25, 0.08, 2.5]} />
        <meshStandardMaterial
          color="#314154"
          metalness={0.65}
          roughness={0.28}
        />
      </mesh>

      {/* Vacuum port */}
      <mesh position={[1.32, 2.55, -1.25]}>
        <cylinderGeometry args={[0.12, 0.12, 0.3, 24]} />
        <meshStandardMaterial
          color="#64748b"
          metalness={0.8}
          roughness={0.22}
        />
      </mesh>
    </group>
  )
}

/* ============================================================
   WAFER
   ============================================================ */

function Wafer() {
  const waferTexture = useMemo(() => {
    const canvas = document.createElement('canvas')

    canvas.width = 512
    canvas.height = 512

    const ctx = canvas.getContext('2d')

    ctx.fillStyle = '#07111d'
    ctx.fillRect(0, 0, 512, 512)

    ctx.strokeStyle = '#1e5266'
    ctx.lineWidth = 1

    for (let i = 32; i < 512; i += 32) {
      ctx.beginPath()
      ctx.moveTo(i, 0)
      ctx.lineTo(i, 512)
      ctx.stroke()

      ctx.beginPath()
      ctx.moveTo(0, i)
      ctx.lineTo(512, i)
      ctx.stroke()
    }

    ctx.strokeStyle = '#38bdf8'
    ctx.lineWidth = 3

    ctx.beginPath()
    ctx.arc(256, 256, 210, 0, Math.PI * 2)
    ctx.stroke()

    const texture = new THREE.CanvasTexture(canvas)
    texture.colorSpace = THREE.SRGBColorSpace

    return texture
  }, [])

  return (
    <group>
      {/* Wafer body */}
      <mesh
        rotation={[Math.PI / 2, 0, 0]}
        castShadow
        receiveShadow
      >
        <cylinderGeometry args={[0.82, 0.82, 0.075, 96]} />
        <meshStandardMaterial
          map={waferTexture}
          color="#d8e5ef"
          metalness={0.35}
          roughness={0.25}
        />
      </mesh>

      {/* Wafer edge */}
      <mesh
        rotation={[Math.PI / 2, 0, 0]}
        position={[0, 0.045, 0]}
      >
        <torusGeometry args={[0.77, 0.018, 12, 96]} />
        <meshStandardMaterial
          color="#67e8f9"
          emissive="#083344"
          emissiveIntensity={0.5}
          metalness={0.6}
          roughness={0.22}
        />
      </mesh>

      {/* Center marker */}
      <mesh position={[0, 0.052, 0]}>
        <cylinderGeometry args={[0.025, 0.025, 0.012, 24]} />
        <meshStandardMaterial
          color="#f8fafc"
          emissive="#67e8f9"
          emissiveIntensity={0.5}
        />
      </mesh>
    </group>
  )
}

/* ============================================================
   FIXED WAFER STAGE
   ============================================================ */

function WaferStage() {
  return (
    <group position={[0, 1.35, 0]}>
      {/* Main stage */}
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[1.0, 1.0, 0.18, 64]} />
        <meshStandardMaterial
          color="#596979"
          metalness={0.82}
          roughness={0.22}
        />
      </mesh>

      {/* Stage top */}
      <mesh position={[0, 0.105, 0]}>
        <cylinderGeometry args={[0.9, 0.9, 0.04, 64]} />
        <meshStandardMaterial
          color="#a9b8c5"
          metalness={0.7}
          roughness={0.22}
        />
      </mesh>

      {/* Wafer */}
      <group position={[0, 0.14, 0]}>
        <Wafer />
      </group>

      {/* Support columns */}
      {[
        [-0.72, -0.28],
        [0.72, -0.28],
        [-0.72, 0.28],
        [0.72, 0.28],
      ].map(([x, z]) => (
        <mesh
          key={`${x}-${z}`}
          position={[x, -0.18, z]}
          castShadow
        >
          <cylinderGeometry args={[0.075, 0.075, 0.45, 20]} />
          <meshStandardMaterial
            color="#263747"
            metalness={0.75}
            roughness={0.3}
          />
        </mesh>
      ))}
    </group>
  )
}

/* ============================================================
   VIBRATION ISOLATION
   ============================================================ */

function VibrationIsolation({ status = 'normal' }) {
  const color = getStatusColor(status)

  return (
    <group position={[0, 0.78, 0]}>
      <mesh castShadow>
        <boxGeometry args={[2.45, 0.14, 2.05]} />
        <meshStandardMaterial
          color="#1b2836"
          metalness={0.65}
          roughness={0.35}
        />
      </mesh>

      {[
        [-0.9, 0.75],
        [0.9, 0.75],
        [-0.9, -0.75],
        [0.9, -0.75],
      ].map(([x, z]) => (
        <group key={`${x}-${z}`}>
          <mesh position={[x, -0.16, z]}>
            <cylinderGeometry args={[0.13, 0.13, 0.28, 24]} />
            <meshStandardMaterial
              color="#475569"
              metalness={0.75}
              roughness={0.25}
            />
          </mesh>

          <mesh position={[x, -0.32, z]}>
            <cylinderGeometry args={[0.09, 0.09, 0.08, 24]} />
            <meshStandardMaterial
              color={color}
              emissive={color}
              emissiveIntensity={1.5}
            />
          </mesh>
        </group>
      ))}
    </group>
  )
}

/* ============================================================
   MOTOR-DRIVEN UV ASSEMBLY
   ============================================================ */

function UVOpticalAssembly({
  positionMm,
  status = 'normal',
}) {
  const groupRef = useRef(null)
  const beamRef = useRef(null)
  const beamCoreRef = useRef(null)
  const spotRef = useRef(null)

  const targetZ = mapMotorPosition(positionMm)

  useFrame((_, delta) => {
    if (!groupRef.current) return

    const smoothing = 1 - Math.exp(-12 * delta)

    groupRef.current.position.z = THREE.MathUtils.lerp(
      groupRef.current.position.z,
      targetZ,
      smoothing,
    )

    if (beamRef.current) {
      beamRef.current.material.opacity =
        0.26 + Math.sin(performance.now() * 0.004) * 0.06
    }

    if (beamCoreRef.current) {
      beamCoreRef.current.material.opacity =
        0.7 + Math.sin(performance.now() * 0.006) * 0.15
    }

    if (spotRef.current) {
      const pulse =
        1 + Math.sin(performance.now() * 0.006) * 0.08

      spotRef.current.scale.set(pulse, pulse, pulse)
    }
  })

  const statusColor = getStatusColor(status)

  return (
    <group
      ref={groupRef}
      position={[0, 3.02, UV_FRONT_Z]}
    >
      {/* Motor rail / guide */}
      <mesh position={[0, 0.15, 0]}>
        <boxGeometry args={[1.25, 0.12, 0.22]} />
        <meshStandardMaterial
          color="#475569"
          metalness={0.75}
          roughness={0.25}
        />
      </mesh>

      {/* Optical housing */}
      <mesh castShadow>
        <cylinderGeometry args={[0.38, 0.46, 0.42, 48]} />
        <meshStandardMaterial
          color="#6b7d8f"
          metalness={0.82}
          roughness={0.2}
        />
      </mesh>

      {/* Upper green/cyan housing */}
      <mesh position={[0, 0.27, 0]}>
        <cylinderGeometry args={[0.43, 0.35, 0.28, 48]} />
        <meshStandardMaterial
          color="#159c79"
          emissive="#064e3b"
          emissiveIntensity={0.45}
          metalness={0.6}
          roughness={0.24}
        />
      </mesh>

      {/* Lens mount */}
      <mesh position={[0, -0.27, 0]}>
        <cylinderGeometry args={[0.18, 0.18, 0.11, 36]} />
        <meshStandardMaterial
          color="#cbd5e1"
          metalness={0.9}
          roughness={0.12}
        />
      </mesh>

      {/* UV lens */}
      <mesh position={[0, -0.34, 0]}>
        <cylinderGeometry args={[0.115, 0.14, 0.08, 36]} />
        <meshStandardMaterial
          color="#e0f2fe"
          emissive="#22d3ee"
          emissiveIntensity={1.8}
          transparent
          opacity={0.9}
          metalness={0.15}
          roughness={0.05}
        />
      </mesh>

      {/* Status indicator on optical head */}
      <mesh position={[0.38, 0.03, 0]}>
        <sphereGeometry args={[0.045, 20, 20]} />
        <meshStandardMaterial
          color={statusColor}
          emissive={statusColor}
          emissiveIntensity={2}
        />
      </mesh>

      {/* ======================================================
          UV BEAM
          The beam is CHILD OF the motor-driven UV assembly.
          Therefore it physically moves with the motor.
         ====================================================== */}

      <mesh
        ref={beamRef}
        position={[0, -0.82, 0]}
      >
        <cylinderGeometry
          args={[0.075, 0.13, 1.65, 32, 1, true]}
        />

        <meshBasicMaterial
          color="#67e8f9"
          transparent
          opacity={0.28}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Bright beam core */}
      <mesh
        ref={beamCoreRef}
        position={[0, -0.82, 0]}
      >
        <cylinderGeometry
          args={[0.022, 0.045, 1.62, 20, 1, true]}
        />

        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={0.82}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Beam spot on wafer */}
      <mesh
        ref={spotRef}
        position={[0, -1.64, 0]}
        rotation={[0, 0, 0]}
      >
        <circleGeometry args={[0.105, 40]} />

        <meshBasicMaterial
          color="#a5f3fc"
          transparent
          opacity={0.75}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Small scan head collar */}
      <mesh position={[0, -0.43, 0]}>
        <torusGeometry args={[0.16, 0.025, 12, 32]} />
        <meshStandardMaterial
          color="#94a3b8"
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
    </group>
  )
}

/* ============================================================
   SENSOR INDICATOR
   ============================================================ */

function SensorIndicator({
  position,
  status,
}) {
  const ref = useRef(null)
  const color = getStatusColor(status)

  useFrame(() => {
    if (!ref.current) return

    const pulse =
      1 + Math.sin(performance.now() * 0.004) * 0.08

    ref.current.scale.setScalar(pulse)
  })

  return (
    <group position={position}>
      <mesh ref={ref}>
        <sphereGeometry args={[0.065, 20, 20]} />

        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={2.2}
          transparent
          opacity={0.95}
        />
      </mesh>

      <mesh>
        <sphereGeometry args={[0.11, 20, 20]} />

        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.09}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  )
}

/* ============================================================
   MAIN LITHOGRAPHY MACHINE
   ============================================================ */

export default function LithographyMachine({
  positionMm = 0,
  statuses = {},
}) {
  return (
    <group>
      {/* Fixed machine structure */}
      <MachineFrame />

      {/* Fixed vacuum chamber */}
      <VacuumChamber />

      {/* Fixed vibration isolation */}
      <VibrationIsolation
        status={statuses.vibration}
      />

      {/* Fixed wafer / stage */}
      <WaferStage />

      {/* ======================================================
          MOTOR-DRIVEN OPTICAL SYSTEM
         ====================================================== */}

      <UVOpticalAssembly
        positionMm={positionMm}
        status={statuses.temperature}
      />

      {/* ======================================================
          SENSOR INDICATORS
         ====================================================== */}

      {/* Vacuum */}
      <SensorIndicator
        position={[1.45, 2.95, -1.15]}
        status={statuses.vacuum}
      />

      {/* Vibration */}
      <SensorIndicator
        position={[-1.25, 0.95, 0.95]}
        status={statuses.vibration}
      />

      {/* Temperature / optical */}
      <SensorIndicator
        position={[1.28, 2.72, 0.95]}
        status={statuses.temperature}
      />

      {/* Displacement */}
      <SensorIndicator
        position={[1.28, 1.65, 0.95]}
        status={statuses.displacement}
      />
    </group>
  )
}
