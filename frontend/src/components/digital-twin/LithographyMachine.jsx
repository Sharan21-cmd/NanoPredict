import React, { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { Edges } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'

const MIN_POSITION_MM = 0
const MAX_POSITION_MM = 100

const UV_FRONT_Z = 1.25
const UV_REAR_Z = -1.25

function mapMotorPosition(positionMm) {
  const clamped = THREE.MathUtils.clamp(
    Number(positionMm) || 0,
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

function statusColor(status) {
  if (status === 'critical') return '#ff4d5e'
  if (status === 'warning') return '#ffab3d'
  return '#3ee08a'
}

/* ---------------------------------------------------------
   MACHINE FRAME
--------------------------------------------------------- */

function MachineFrame() {
  const W = 5.6
  const H = 5.6
  const D = 4.6

  const posts = [
    [-W / 2, -D / 2],
    [W / 2, -D / 2],
    [-W / 2, D / 2],
    [W / 2, D / 2],
  ]

  return (
    <group name="machine-frame">
      {posts.map(([x, z], i) => (
        <mesh
          key={`post-${i}`}
          position={[x, H / 2 - 1.2, z]}
          castShadow
        >
          <boxGeometry args={[0.26, H, 0.26]} />
          <meshStandardMaterial
            color="#8b96a4"
            metalness={0.85}
            roughness={0.35}
          />
          <Edges color="#2a3646" />
        </mesh>
      ))}

      <mesh position={[0, H - 1.2, 0]} castShadow>
        <boxGeometry args={[W + 0.26, 0.26, D + 0.26]} />
        <meshStandardMaterial
          color="#454e5c"
          metalness={0.8}
          roughness={0.4}
        />
      </mesh>

      <mesh position={[0, -1.35, 0]} receiveShadow>
        <boxGeometry args={[W + 0.3, 0.3, D + 0.3]} />
        <meshStandardMaterial
          color="#454e5c"
          metalness={0.8}
          roughness={0.4}
        />
      </mesh>

      {/* Left enclosure */}
      <mesh
        position={[-W / 2 + 0.55, H / 2 - 1.2, 0]}
        castShadow
      >
        <boxGeometry args={[1.05, H - 0.5, D - 0.3]} />
        <meshStandardMaterial
          color="#6c7684"
          metalness={0.75}
          roughness={0.42}
        />
        <Edges color="#1c2530" />
      </mesh>

      {/* Right enclosure */}
      <mesh
        position={[W / 2 - 0.55, H / 2 - 1.2, 0]}
        castShadow
      >
        <boxGeometry args={[1.05, H - 0.5, D - 0.3]} />
        <meshStandardMaterial
          color="#6c7684"
          metalness={0.75}
          roughness={0.42}
        />
        <Edges color="#1c2530" />
      </mesh>

      {/* Rear dark panel */}
      <mesh
        position={[0, H / 2 - 1.2, -(D / 2 - 0.1)]}
      >
        <boxGeometry args={[W - 1.9, H - 0.5, 0.12]} />
        <meshStandardMaterial
          color="#141a22"
          metalness={0.4}
          roughness={0.6}
        />
      </mesh>

      {/* Lower cabinet doors */}
      {[-1.5, -0.5, 0.5, 1.5].map((x) => (
        <mesh
          key={`door-${x}`}
          position={[x, -0.95, D / 2 - 0.55]}
          castShadow
        >
          <boxGeometry args={[0.9, 1.1, 0.06]} />
          <meshStandardMaterial
            color="#6c7684"
            metalness={0.75}
            roughness={0.42}
          />
          <Edges color="#1c2530" />
        </mesh>
      ))}
    </group>
  )
}

/* ---------------------------------------------------------
   VACUUM CHAMBER
--------------------------------------------------------- */

function VacuumChamber({ status }) {
  const color = statusColor(status)

  return (
    <group
      name="vacuum-chamber"
      position={[0, 0.55, 0]}
    >
      {/* Transparent chamber */}
      <mesh
        position={[0, 1.425, 0]}
      >
        <boxGeometry args={[3.1, 3.55, 3.1]} />
        <meshPhysicalMaterial
          color={color}
          transparent
          opacity={0.13}
          roughness={0.08}
          metalness={0}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
        <Edges
          color={color}
          threshold={15}
        />
      </mesh>

      {/* Chamber floor */}
      <mesh
        position={[0, -0.32, 0]}
        receiveShadow
      >
        <boxGeometry args={[3.0, 0.06, 3.0]} />
        <meshStandardMaterial
          color="#454e5c"
          metalness={0.8}
          roughness={0.4}
        />
      </mesh>

      {/* Vertical chamber supports */}
      {[
        [1.5, 1.425, 1.5],
        [-1.5, 1.425, 1.5],
        [1.5, 1.425, -1.5],
        [-1.5, 1.425, -1.5],
      ].map((p, i) => (
        <mesh key={i} position={p}>
          <boxGeometry args={[0.07, 3.35, 0.07]} />
          <meshStandardMaterial
            color="#454e5c"
            metalness={0.8}
            roughness={0.4}
          />
        </mesh>
      ))}

      {/* Vacuum port */}
      <mesh position={[1.62, 1.5, 0]}>
        <cylinderGeometry
          args={[0.18, 0.18, 0.35, 24]}
        />
        <meshStandardMaterial
          color="#454e5c"
          metalness={0.85}
          roughness={0.3}
        />
      </mesh>
    </group>
  )
}

/* ---------------------------------------------------------
   WAFER
--------------------------------------------------------- */

function Wafer() {
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 512
    canvas.height = 512

    const ctx = canvas.getContext('2d')

    const gradient = ctx.createRadialGradient(
      256,
      256,
      20,
      256,
      256,
      250
    )

    gradient.addColorStop(0, '#a9b4c2')
    gradient.addColorStop(0.55, '#8c97a6')
    gradient.addColorStop(1, '#6b7684')

    ctx.fillStyle = gradient
    ctx.beginPath()
    ctx.arc(256, 256, 250, 0, Math.PI * 2)
    ctx.fill()

    /* wafer die grid */
    ctx.strokeStyle = 'rgba(20,28,38,0.35)'
    ctx.lineWidth = 1

    for (let x = 30; x <= 480; x += 26) {
      ctx.beginPath()
      ctx.moveTo(x, 10)
      ctx.lineTo(x, 502)
      ctx.stroke()
    }

    for (let y = 30; y <= 480; y += 26) {
      ctx.beginPath()
      ctx.moveTo(10, y)
      ctx.lineTo(502, y)
      ctx.stroke()
    }

    return new THREE.CanvasTexture(canvas)
  }, [])

  return (
    <group position={[0, 0.335, 0]}>
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[0.78, 0.78, 0.022, 96]} />
        <meshStandardMaterial
          map={texture}
          metalness={0.55}
          roughness={0.32}
        />
      </mesh>

      {/* Wafer edge */}
      <mesh>
        <torusGeometry args={[0.78, 0.018, 8, 96]} />
        <meshStandardMaterial
          color="#4fd8ff"
          metalness={0.8}
          roughness={0.3}
        />
      </mesh>

      {/* Center alignment mark */}
      <mesh position={[0, 0.018, 0]}>
        <torusGeometry args={[0.08, 0.012, 8, 32]} />
        <meshBasicMaterial color="#4fd8ff" />
      </mesh>
    </group>
  )
}

/* ---------------------------------------------------------
   MOTOR-DRIVEN WAFER STAGE
--------------------------------------------------------- */

function MotorDrivenStage({
  displacementStatus,
}) {
  const status = statusColor(displacementStatus)

  return (
    <group
      name="fixed-wafer-stage"
      position={[0, 0.55, 0]}
    >
      {/* Base */}
      <mesh
        position={[0, 0.11, 0]}
        castShadow
        receiveShadow
      >
        <cylinderGeometry args={[1.05, 1.15, 0.22, 48]} />
        <meshStandardMaterial
          color="#454e5c"
          metalness={0.8}
          roughness={0.4}
        />
        <Edges color="#4fd8ff" />
      </mesh>

      {/* Collar */}
      <mesh
        position={[0, 0.27, 0]}
        castShadow
      >
        <cylinderGeometry args={[0.95, 0.95, 0.1, 48]} />
        <meshStandardMaterial
          color="#6c7684"
          metalness={0.75}
          roughness={0.42}
        />
      </mesh>

      {/* Central support */}
      <mesh
        position={[0, -0.28, 0]}
        castShadow
      >
        <cylinderGeometry args={[0.22, 0.38, 0.55, 24]} />
        <meshStandardMaterial
          color="#8b96a4"
          metalness={0.85}
          roughness={0.35}
        />
      </mesh>

      {/* Wafer */}
      <Wafer />

      {/* Status ring */}
      <mesh
        rotation={[Math.PI / 2, 0, 0]}
        position={[0, 0.28, 0]}
      >
        <torusGeometry args={[0.97, 0.012, 8, 64]} />
        <meshBasicMaterial
          color={status}
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* Motor underneath the fixed wafer stage */}
      <mesh
        position={[0, -0.55, -0.45]}
        rotation={[Math.PI / 2, 0, 0]}
      >
        <cylinderGeometry args={[0.18, 0.18, 0.42, 24]} />
        <meshStandardMaterial
          color="#222831"
          metalness={0.9}
          roughness={0.28}
        />
      </mesh>

      {/* Motor shaft */}
      <mesh
        position={[0, -0.55, -0.72]}
        rotation={[Math.PI / 2, 0, 0]}
      >
        <cylinderGeometry args={[0.06, 0.06, 0.22, 16]} />
        <meshStandardMaterial
          color="#8b96a4"
          metalness={0.9}
          roughness={0.25}
        />
      </mesh>

      {/* Fixed positioning actuators */}
      {[
        [0.82, 0.35],
        [-0.82, 0.35],
        [0.82, -0.35],
        [-0.82, -0.35],
      ].map(([px, pz], i) => (
        <group
          key={i}
          position={[px, 0.35, pz]}
        >
          <mesh>
            <cylinderGeometry
              args={[0.07, 0.07, 0.42, 16]}
            />
            <meshStandardMaterial
              color="#6c7684"
              metalness={0.8}
              roughness={0.4}
            />
          </mesh>

          <mesh position={[0, 0.23, 0]}>
            <sphereGeometry args={[0.035, 12, 12]} />
            <meshBasicMaterial color="#3ee08a" />
          </mesh>
        </group>
      ))}
    </group>
  )
}
/* ---------------------------------------------------------
   VIBRATION ISOLATION
--------------------------------------------------------- */

function VibrationIsolation({ status }) {
  const color = statusColor(status)

  return (
    <group
      name="vibration-isolation"
      position={[0, 0.55, 0]}
    >
      <mesh position={[0, -0.62, 0]}>
        <cylinderGeometry args={[1.5, 1.5, 0.1, 48]} />
        <meshStandardMaterial
          color="#454e5c"
          metalness={0.8}
          roughness={0.4}
        />
      </mesh>

      {[
        [1.05, 1.05],
        [-1.05, 1.05],
        [1.05, -1.05],
        [-1.05, -1.05],
      ].map(([x, z], i) => (
        <group key={i}>
          <mesh position={[x, -0.85, z]}>
            <cylinderGeometry
              args={[0.12, 0.12, 0.5, 16, 6, true]}
            />
            <meshStandardMaterial
              color="#394252"
              metalness={0.7}
              roughness={0.4}
            />
          </mesh>

          <mesh position={[x, -1.12, z]}>
            <cylinderGeometry
              args={[0.17, 0.17, 0.08, 16]}
            />
            <meshStandardMaterial
              color="#8b96a4"
              metalness={0.85}
              roughness={0.35}
            />
          </mesh>
        </group>
      ))}

      <mesh
        rotation={[Math.PI / 2, 0, 0]}
        position={[0, -0.57, 0]}
      >
        <torusGeometry args={[1.5, 0.02, 8, 48]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.9}
        />
      </mesh>
    </group>
  )
}

/* ---------------------------------------------------------
   OPTICAL / LASER MODULE
--------------------------------------------------------- */

function OpticalModule({
  positionMm,
  temperatureStatus,
}) {
  const groupRef = useRef(null)
  const beamRef = useRef(null)

  const targetZ = mapMotorPosition(positionMm)
  const housingColor = statusColor(temperatureStatus)

  useFrame(({ clock }, delta) => {
    if (groupRef.current) {
      /*
       * The existing backend motor telemetry drives the UV head.
       *
       * The wafer/stage remains fixed.
       * Only the optical/UV assembly moves front <-> rear.
       */
      const smoothing = 1 - Math.exp(-12 * delta)

      groupRef.current.position.z = THREE.MathUtils.lerp(
        groupRef.current.position.z,
        targetZ,
        smoothing
      )
    }

    if (beamRef.current) {
      beamRef.current.material.opacity =
        0.35 + Math.sin(clock.getElapsedTime() * 2.2) * 0.12
    }
  })

  return (
    <group
      ref={groupRef}
      name="motor-driven-uv-optical-module"
      position={[0, 0.55, targetZ]}
    >
      {/* Housing */}
      <mesh
        position={[0, 3.55, 0]}
        castShadow
      >
        <cylinderGeometry args={[0.5, 0.62, 0.9, 24]} />
        <meshStandardMaterial
          color={housingColor}
          metalness={0.75}
          roughness={0.42}
          emissive={housingColor}
          emissiveIntensity={
            temperatureStatus === 'critical'
              ? 0.30
              : temperatureStatus === 'warning'
                ? 0.15
                : 0.02
          }
        />
      </mesh>

      {/* Lens stack */}
      {[0, 1, 2].map((i) => (
        <mesh
          key={i}
          position={[0, 3.05 - i * 0.16, 0]}
        >
          <cylinderGeometry
            args={[
              0.34 - i * 0.05,
              0.34 - i * 0.05,
              0.1,
              24,
            ]}
          />
          <meshPhysicalMaterial
            color="#4fd8ff"
            transparent
            opacity={0.45}
            roughness={0.1}
            metalness={0.1}
            emissive="#1c6fa0"
            emissiveIntensity={0.4}
          />
        </mesh>
      ))}

      {/* Collar */}
      <mesh
        rotation={[Math.PI / 2, 0, 0]}
        position={[0, 2.6, 0]}
      >
        <torusGeometry args={[0.28, 0.05, 10, 24]} />
        <meshStandardMaterial
          color="#454e5c"
          metalness={0.85}
          roughness={0.3}
        />
      </mesh>

      {/* Support struts */}
      {[-0.42, 0.42].map((x) => (
        <mesh
          key={x}
          position={[x, 3.15, 0]}
        >
          <boxGeometry args={[0.06, 0.9, 0.06]} />
          <meshStandardMaterial
            color="#8b96a4"
            metalness={0.85}
            roughness={0.35}
          />
        </mesh>
      ))}

      {/* Laser beam */}
      <mesh
        ref={beamRef}
        position={[0, 1.6, 0]}
      >
        <cylinderGeometry
          args={[0.05, 0.13, 2.55, 16, 1, true]}
        />
        <meshBasicMaterial
          color="#6fe4ff"
          transparent
          opacity={0.5}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Beam core */}
      <mesh position={[0, 1.6, 0]}>
        <cylinderGeometry
          args={[0.012, 0.012, 2.6, 8, 1, true]}
        />
        <meshBasicMaterial
          color="#dff8ff"
          transparent
          opacity={0.85}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Beam spot */}
      <mesh
        rotation={[Math.PI / 2, 0, 0]}
        position={[0, 0.335, 0]}
      >
        <circleGeometry args={[0.12, 32]} />
        <meshBasicMaterial
          color="#6fe4ff"
          transparent
          opacity={0.7}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  )
}
/* ---------------------------------------------------------
   SENSOR NODE
--------------------------------------------------------- */

function SensorNode({
  position,
  status,
}) {
  const haloRef = useRef(null)
  const color = statusColor(status)

  useFrame(({ clock }) => {
    if (!haloRef.current) return

    const scale =
      1 + Math.sin(clock.getElapsedTime() * 3) * 0.18

    haloRef.current.scale.setScalar(scale)
  })

  return (
    <group position={position}>
      <mesh>
        <sphereGeometry args={[0.055, 12, 12]} />
        <meshBasicMaterial color={color} />
      </mesh>

      <mesh ref={haloRef}>
        <sphereGeometry args={[0.09, 12, 12]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.35}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  )
}

/* ---------------------------------------------------------
   MAIN MACHINE
--------------------------------------------------------- */

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
      <MachineFrame />

      <VacuumChamber
        status={statuses.pressure}
      />

      <VibrationIsolation
        status={statuses.vibration}
      />

      <MotorDrivenStage
        positionMm={positionMm}
        displacementStatus={statuses.displacement}
      />

      <OpticalModule
        positionMm={positionMm}
        temperatureStatus={statuses.temperature}
      />

      {/* Sensor markers */}
      <SensorNode
        position={[1.35, 3.45, 1.35]}
        status={statuses.pressure}
      />

      <SensorNode
        position={[1.05, -0.07, 1.05]}
        status={statuses.vibration}
      />

      <SensorNode
        position={[0.55, 4.10, 0]}
        status={statuses.temperature}
      />

      <SensorNode
        position={[0.95, 0.95, -0.6]}
        status={statuses.displacement}
      />
    </group>
  )
}

export { mapMotorPosition }
