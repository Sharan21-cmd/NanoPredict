import { useEffect, useRef, useState } from 'react'

import Panel from '../layout/Panel'
import SubsystemInfoPanel from './SubsystemInfoPanel'
import { useTelemetryContext } from '../../telemetry/TelemetryContext'

export default function DigitalTwin() {
  const [selectedSubsystem, setSelectedSubsystem] = useState(null)
  const iframeRef = useRef(null)

  const { telemetry, connected } = useTelemetryContext()

  /*
   * Send NanoPredict telemetry into the Claude 3D digital twin.
   *
   * React remains the source of truth for telemetry.
   * The HTML model only receives the values and visualizes them.
   */
  useEffect(() => {
    const iframe = iframeRef.current

    if (!iframe?.contentWindow) {
      return
    }

    const message = {
      type: 'NANOPREDICT_TELEMETRY',

      stage: {
        positionMm: telemetry.stage.positionMm,
        targetPositionMm: telemetry.stage.targetPositionMm,
        moving: telemetry.stage.moving,
        speedMmPerSec: telemetry.stage.speedMmPerSec,
      },

      drift: telemetry.distance.driftNm,

      vibration: telemetry.vibration.rmsG,

      pressure: telemetry.vacuum.pressurePa,

      temperature: telemetry.temperature.valueC,

      risk: telemetry.risk.status?.toUpperCase() || 'NORMAL',

      riskScore: telemetry.risk.riskScore,

      prediction: {
        condition: telemetry.prediction.condition,
        confidence: telemetry.prediction.confidence,
        warnings: telemetry.prediction.warnings,
      },

      connected,
    }

    iframe.contentWindow.postMessage(message, window.location.origin)
  }, [telemetry, connected])

  /*
   * Send the latest telemetry when the iframe finishes loading.
   */
  function handleIframeLoad() {
    const iframe = iframeRef.current

    if (!iframe?.contentWindow) {
      return
    }

    const message = {
      type: 'NANOPREDICT_TELEMETRY',

      stage: {
        positionMm: telemetry.stage.positionMm,
        targetPositionMm: telemetry.stage.targetPositionMm,
        moving: telemetry.stage.moving,
        speedMmPerSec: telemetry.stage.speedMmPerSec,
      },

      drift: telemetry.distance.driftNm,

      vibration: telemetry.vibration.rmsG,

      pressure: telemetry.vacuum.pressurePa,

      temperature: telemetry.temperature.valueC,

      risk: telemetry.risk.status?.toUpperCase() || 'NORMAL',

      riskScore: telemetry.risk.riskScore,

      prediction: {
        condition: telemetry.prediction.condition,
        confidence: telemetry.prediction.confidence,
        warnings: telemetry.prediction.warnings,
      },

      connected,
    }

    iframe.contentWindow.postMessage(message, window.location.origin)
  }

  return (
    <Panel
      title="Digital Twin"
      subtitle="Lithography equipment — live 3D telemetry"
      className="h-full min-h-0"
      actions={
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-slate-500">
            CLAUDE 3D MODEL
          </span>

          <span
            className={`w-1.5 h-1.5 rounded-full ${
              connected
                ? 'bg-emerald-400 animate-pulse'
                : 'bg-red-400'
            }`}
          />

          <span
            className={`text-[10px] font-mono ${
              connected
                ? 'text-emerald-400'
                : 'text-red-400'
            }`}
          >
            {connected ? 'LIVE' : 'OFFLINE'}
          </span>
        </div>
      }
    >
      <div className="relative h-full min-h-0 overflow-hidden">

        {/* =====================================================
            CLAUDE STAGE-1 3D DIGITAL TWIN
           ===================================================== */}

        <iframe
          ref={iframeRef}
          src="/digital-twin/nanopredict-digital-twin-stage1.html"
          title="NanoPredict Lithography Digital Twin"
          className="w-full h-full border-0"
          onLoad={handleIframeLoad}
          allow="fullscreen"
        />

        {/* =====================================================
            TOP LEFT TECHNICAL IDENTIFICATION
           ===================================================== */}

        <div className="pointer-events-none absolute top-2 left-2">
          <div className="px-2 py-1 bg-slate-950/75 border border-slate-800 rounded-sm">
            <p className="text-[10px] font-mono text-cyan-400">
              NANO-PREDICT / DIGITAL TWIN
            </p>

            <p className="text-[9px] font-mono text-slate-500 mt-0.5">
              LITHOGRAPHY EQUIPMENT MODEL
            </p>
          </div>
        </div>

        {/* =====================================================
            TOP RIGHT TELEMETRY CONNECTION STATUS
           ===================================================== */}

        <div className="pointer-events-none absolute top-2 right-2">
          <div className="flex items-center gap-2 px-2 py-1 bg-slate-950/75 border border-slate-800 rounded-sm">
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                connected
                  ? 'bg-emerald-400 animate-pulse'
                  : 'bg-red-400'
              }`}
            />

            <span
              className={`text-[9px] font-mono ${
                connected
                  ? 'text-emerald-400'
                  : 'text-red-400'
              }`}
            >
              {connected ? 'TELEMETRY LINK' : 'TELEMETRY OFFLINE'}
            </span>
          </div>
        </div>

        {/* =====================================================
            BOTTOM LEFT SYSTEM INFORMATION
           ===================================================== */}

        <div className="pointer-events-none absolute bottom-2 left-2">
          <div className="px-2 py-1 bg-slate-950/75 border border-slate-800 rounded-sm">
            <p className="text-[9px] font-mono text-slate-500">
              STAGE: EQ-04A
            </p>

            <p className="text-[9px] font-mono text-slate-500">
              AXIS: X / Y / Z
            </p>

            <p className="text-[9px] font-mono text-slate-500">
              MODE: REAL-TIME
            </p>
          </div>
        </div>

        {/* =====================================================
            SUBSYSTEM INFORMATION PANEL
           ===================================================== */}

        {selectedSubsystem && (
          <SubsystemInfoPanel
            subsystem={selectedSubsystem}
            onClose={() => setSelectedSubsystem(null)}
          />
        )}

      </div>
    </Panel>
  )
}
