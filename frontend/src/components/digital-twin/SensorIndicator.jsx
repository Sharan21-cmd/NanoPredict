import { useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import { useRef } from 'react'

const STATUS_CONFIG = {
  normal: {
    color: '#22c55e',
    emissive: '#166534',
    intensity: 0.3,
    opacity: 0.22,
  },
  warning: {
    color: '#f59e0b',
    emissive: '#92400e',
    intensity: 0.65,
    opacity: 0.38,
  },
  critical: {
    color: '#ef4444',
    emissive: '#991b1b',
    intensity: 1.0,
    opacity: 0.55,
  },
}

export default function SensorIndicator({
  status = 'normal',
  label = 'SENSOR',
  value = '',
  position = [0, 0, 0],
  size = 0.045,
}) {
  const meshRef = useRef(null)
  const ringRef = useRef(null)

  const config =
    STATUS_CONFIG[status] ?? STATUS_CONFIG.normal

  useFrame(({ clock }) => {
    if (!meshRef.current) return

    const time = clock.getElapsedTime()

    const pulseSpeed =
      status === 'critical'
        ? 5
        : status === 'warning'
          ? 3
          : 1.5

    const pulseAmount =
      status === 'normal' ? 0.04 : 0.12

    const pulse =
      1 + Math.sin(time * pulseSpeed) * pulseAmount

    meshRef.current.scale.setScalar(pulse)

    if (ringRef.current) {
      ringRef.current.rotation.z =
        time * (status === 'critical' ? 1.2 : 0.45)

      ringRef.current.scale.setScalar(
        1 + Math.sin(time * pulseSpeed) * 0.08,
      )
    }
  })

  return (
    <group position={position}>
      {/* Sensor status LED */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[size, 20, 20]} />

        <meshStandardMaterial
          color={config.color}
          emissive={config.emissive}
          emissiveIntensity={config.intensity}
          toneMapped={false}
        />
      </mesh>

      {/* Outer status ring */}
      <mesh
        ref={ringRef}
        rotation={[Math.PI / 2, 0, 0]}
      >
        <ringGeometry
          args={[
            size * 1.35,
            size * 1.65,
            32,
          ]}
        />

        <meshBasicMaterial
          color={config.color}
          transparent
          opacity={config.opacity}
          side={2}
          depthWrite={false}
        />
      </mesh>

      {/* Vertical technical leader */}
      {label && (
        <>
          <mesh
            position={[0, size * 2.0, 0]}
          >
            <boxGeometry
              args={[
                0.006,
                size * 2.8,
                0.006,
              ]}
            />

            <meshBasicMaterial
              color={config.color}
              transparent
              opacity={0.55}
            />
          </mesh>

          {/* Sensor label */}
          <Text
            position={[
              size * 3.2,
              size * 3.25,
              0,
            ]}
            fontSize={0.055}
            color={config.color}
            anchorX="left"
            anchorY="middle"
            outlineWidth={0.004}
            outlineColor="#020617"
          >
            {label.toUpperCase()}
          </Text>

          {/* Live value */}
          {value !== '' && (
            <Text
              position={[
                size * 3.2,
                size * 2.35,
                0,
              ]}
              fontSize={0.042}
              color="#cbd5e1"
              anchorX="left"
              anchorY="middle"
              outlineWidth={0.003}
              outlineColor="#020617"
            >
              {String(value)}
            </Text>
          )}
        </>
      )}
    </group>
  )
}
