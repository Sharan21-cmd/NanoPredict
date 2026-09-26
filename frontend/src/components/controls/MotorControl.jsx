import { useEffect, useState } from 'react'
import Panel from '../layout/Panel'
import { useTelemetry } from '../../telemetry/useTelemetry'

const MIN_POSITION = 0
const MAX_POSITION = 100

const MIN_SPEED = 1
const MAX_SPEED = 100

export default function MotorControl() {
  const {
    telemetry,
    setTargetPosition,
    stopMotor,
    setMotorSpeed,
  } = useTelemetry()

  const [target, setTarget] = useState(
    telemetry.stage.targetPositionMm
  )

  const [speed, setSpeed] = useState(
    telemetry.stage.speedMmPerSec
  )

  const currentPosition =
    telemetry.stage.positionMm

  const isMoving =
    telemetry.stage.moving

  // Keep the local slider synchronized with
  // the shared motor-speed state.
  useEffect(() => {
    setSpeed(
      telemetry.stage.speedMmPerSec
    )
  }, [
    telemetry.stage.speedMmPerSec,
  ])

  function moveTo(position) {
    const safePosition =
      Math.max(
        MIN_POSITION,
        Math.min(
          MAX_POSITION,
          position
        )
      )

    setTarget(safePosition)

    setTargetPosition(
      safePosition
    )
  }

  function handleTargetChange(event) {
    const value =
      Number(event.target.value)

    setTarget(value)

    setTargetPosition(value)
  }

  function handleSpeedChange(event) {
    const value =
      Number(event.target.value)

    setSpeed(value)

    setMotorSpeed(value)
  }

  function handleStop() {
    stopMotor()

    setTarget(currentPosition)
  }

  return (
    <Panel
      title="Motor Control"
      subtitle="Live linear stage"
      className="h-auto"
    >
      <div className="p-3 space-y-4">

        {/* Current position */}
        <div>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-[9px] text-slate-600">
                CURRENT POSITION
              </p>

              <div className="flex items-baseline gap-1.5 mt-1">
                <span className="text-2xl font-mono font-semibold text-slate-100">
                  {currentPosition.toFixed(2)}
                </span>

                <span className="text-[10px] text-slate-500">
                  mm
                </span>
              </div>
            </div>

            <span
              className={`px-2 py-1 text-[9px] font-medium border rounded-sm ${
                isMoving
                  ? 'text-cyan-400 bg-cyan-400/10 border-cyan-400/20'
                  : 'text-slate-500 bg-slate-900 border-slate-800'
              }`}
            >
              {isMoving
                ? 'MOVING'
                : 'STOPPED'}
            </span>
          </div>
        </div>

        {/* Position slider */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] text-slate-500">
              TARGET POSITION
            </span>

            <span className="text-[10px] font-mono text-cyan-400">
              {target.toFixed(0)} mm
            </span>
          </div>

          <input
            type="range"
            min={MIN_POSITION}
            max={MAX_POSITION}
            step="1"
            value={target}
            onChange={
              handleTargetChange
            }
            className="w-full accent-cyan-400 cursor-pointer"
          />

          <div className="flex justify-between mt-1 text-[8px] font-mono text-slate-600">
            <span>0 mm</span>
            <span>50 mm</span>
            <span>100 mm</span>
          </div>
        </div>

        {/* Quick position controls */}
        <div>
          <p className="text-[10px] text-slate-500 mb-2">
            QUICK POSITION
          </p>

          <div className="grid grid-cols-4 gap-1.5">
            {[0, 25, 50, 75].map(
              (position) => (
                <button
                  key={position}
                  type="button"
                  onClick={() =>
                    moveTo(position)
                  }
                  className="py-2 border border-slate-800 bg-slate-950 text-[9px] font-mono text-slate-400 hover:text-slate-200 hover:border-slate-600 transition-colors rounded-sm"
                >
                  {position}
                </button>
              )
            )}
          </div>

          <button
            type="button"
            onClick={() =>
              moveTo(100)
            }
            className="w-full mt-1.5 py-2 border border-cyan-400/20 bg-cyan-400/5 text-[9px] font-mono text-cyan-400 hover:bg-cyan-400/10 transition-colors rounded-sm"
          >
            MOVE TO 100 mm
          </button>
        </div>

        {/* Motor speed */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] text-slate-500">
              MOTOR SPEED
            </span>

            <span className="text-[10px] font-mono text-slate-300">
              {speed} mm/s
            </span>
          </div>

          <input
            type="range"
            min={MIN_SPEED}
            max={MAX_SPEED}
            step="1"
            value={speed}
            onChange={
              handleSpeedChange
            }
            className="w-full accent-cyan-400 cursor-pointer"
          />

          <div className="flex justify-between mt-1 text-[8px] font-mono text-slate-600">
            <span>1 mm/s</span>
            <span>50 mm/s</span>
            <span>100 mm/s</span>
          </div>
        </div>

        {/* Stop */}
        <button
          type="button"
          onClick={handleStop}
          className="w-full py-2.5 bg-rose-500/10 border border-rose-500/25 text-rose-400 text-[10px] font-medium hover:bg-rose-500/15 transition-colors rounded-sm"
        >
          STOP MOTOR
        </button>

      </div>
    </Panel>
  )
}
