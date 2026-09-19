import { useEffect, useRef, useState } from 'react'
import { Line } from '@react-three/drei'
import * as THREE from 'three'
import { RAIL_CONFIG, mapPositionToRail } from './LinearRail'

// Wafer surface radius from WaferDisk.jsx (`<cylinderGeometry args={[0.50, ...]}>`).
const WAFER_RADIUS = 0.50
const TRACE_MARGIN = 0.08
const TRACE_HALF_RANGE = WAFER_RADIUS - TRACE_MARGIN

// Same denominator used inside mapPositionToRail's clamp range, so the
// scan trace always fits within the wafer regardless of rail length.
const RAIL_HALF_RANGE = RAIL_CONFIG.length / 2 - 0.30
const TRACE_SCALE = TRACE_HALF_RANGE / RAIL_HALF_RANGE

const ROW_STEP = 0.05
const MAX_ROWS = Math.max(1, Math.floor(TRACE_HALF_RANGE / ROW_STEP))
const REVERSAL_THRESHOLD = 0.05 // local trace-space units
const MIN_POINT_SPACING = 0.004 // ignore telemetry noise / no-op updates
const MAX_TRACE_POINTS = 420
const TRACE_Y = 0.004 // just above the wafer surface mesh, below the edge ring

function railXToLocalTraceX(positionMm) {
  return mapPositionToRail(positionMm) * TRACE_SCALE
}

function computeTraceZ(rowIndex) {
  const cycle = MAX_ROWS * 2
  const rowSlot = ((rowIndex % cycle) + cycle) % cycle
  const foldedRow = rowSlot < MAX_ROWS ? rowSlot : cycle - rowSlot
  return (foldedRow - MAX_ROWS / 2) * ROW_STEP
}

export default function WaferTrace({
  positionMm = 0,
  position = [0, 0, 0],
}) {
  const [points, setPoints] = useState(() => {
    const startX = railXToLocalTraceX(positionMm)
    return [new THREE.Vector3(startX, TRACE_Y, computeTraceZ(0))]
  })

  const lastTraceXRef = useRef(railXToLocalTraceX(positionMm))
  const lastDirectionRef = useRef(0)
  const lastReversalXRef = useRef(railXToLocalTraceX(positionMm))
  const rowIndexRef = useRef(0)

  useEffect(() => {
    const traceX = railXToLocalTraceX(positionMm)
    const delta = traceX - lastTraceXRef.current

    // Stage hasn't meaningfully moved (or telemetry re-sent the same
    // value) — don't grow the trace or the point history.
    if (Math.abs(delta) < MIN_POINT_SPACING) {
      return
    }

    const direction = Math.sign(delta)

    if (lastDirectionRef.current === 0) {
      lastReversalXRef.current = traceX
    } else if (
      direction !== 0 &&
      direction !== lastDirectionRef.current &&
      Math.abs(traceX - lastReversalXRef.current) > REVERSAL_THRESHOLD
    ) {
      // The stage reversed direction and travelled far enough since the
      // last reversal to count as a new scan row (avoids jitter-triggered
      // row changes when the motor is essentially holding position).
      rowIndexRef.current += 1
      lastReversalXRef.current = traceX
    }

    lastDirectionRef.current = direction
    lastTraceXRef.current = traceX

    const nextPoint = new THREE.Vector3(
      traceX,
      TRACE_Y,
      computeTraceZ(rowIndexRef.current)
    )

    setPoints((prev) => {
      const updated = [...prev, nextPoint]

      if (updated.length > MAX_TRACE_POINTS) {
        return updated.slice(updated.length - MAX_TRACE_POINTS)
      }

      return updated
    })
  }, [positionMm])

  if (points.length < 2) {
    return null
  }

  return (
    <group position={position}>
      <Line
        points={points}
        color="#5eead4"
        lineWidth={1.6}
        transparent
        opacity={0.85}
        toneMapped={false}
      />
    </group>
  )
}
