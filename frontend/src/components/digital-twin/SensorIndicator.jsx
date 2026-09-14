import { useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'

const STATUS_CONFIG = {
  normal: {
    color: '#22c55e',
    emissive: '#166534',
    intensity: 0.25,
  },
  warning: {
    color: '#f59e0b',
    emissive: '#92400e',
    intensity: 0.55,
  },
  critical: {
    color: '#ef4444',
    emissive: '#991b1b',
    intensity: 0.9,
  },
}

/*
 * Small 3D sensor status indicator.
 *
 * status:
 *   normal   -> green
 *   warning  -> amber
 *   critical -> red
 *
 * position is local to the parent sensor/component.
 */
export default function SensorIndicator({
  status = 'normal',
  label = 'SENSOR',
  value = '',
  position = [0, 0, 0],
  size = 0.045,
}) {
  const meshRef = useRef(null)

  const config =
    STATUS_CONFIG[status] ?? STATUS_CONFIG.normal

  useEffect(() => {
    if (!meshRef.current) return

    meshRef.current.material.color.set(config.color)
    meshRef.current.material.emissive.set(config.emissive)
    meshRef.current.material.emissiveIntensity =
      config.intensity
  }, [config.color, config.emissive, config.intensity])

  useFrame(({ clock }) => {
    if (!meshRef.current) return

    const pulseSpeed =
      status === 'critical'
        ? 5
        : status === 'warning'
          ? 3
          : 1.5

    const pulse =
      1 +
      Math.sin(clock.getElapsedTime() * pulseSpeed) *
        (status === 'normal' ? 0.04 : 0.12)

    meshRef.current.scale.setScalar(pulse)
  })

  return (
    <group position={position}>
      {/* Glowing status LED */}
      <mesh ref={meshRef}>
        <sphereGeometry
          args={[size, 16, 16]}
        />

        <meshStandardMaterial
          color={config.color}
          emissive={config.emissive}
          emissiveIntensity={config.intensity}
          toneMapped={false}
        />
      </mesh>

      {/* Small outer ring */}
      <mesh scale={1.8}>
        <ringGeometry
          args={[size * 1.15, size * 1.35, 24]}
        />

        <meshBasicMaterial
          color={config.color}
          transparent
          opacity={
            status === 'normal'
              ? 0.20
              : status === 'warning'
                ? 0.35
                : 0.50
          }
          side={2}
          depthWrite={false}
        />
      </mesh>

      {/* Information attached to the sensor */}
      {label && (
        <group position={[0, size * 2.8, 0]}>
          {/* Small vertical anchor */}
          <mesh>
            <boxGeometry
              args={[0.008, size * 1.8, 0.008]}
            />

            <meshBasicMaterial
              color={config.color}
              transparent
              opacity={0.55}
            />
          </mesh>
        </group>
      )}
    </group>
  )
}
