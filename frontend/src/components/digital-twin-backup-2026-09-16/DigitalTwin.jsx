import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { Suspense, useState } from 'react'

import Panel from '../layout/Panel'
import Scene from './Scene'
import SubsystemInfoPanel from './SubsystemInfoPanel'

export default function DigitalTwin() {
  const [selectedSubsystem, setSelectedSubsystem] =
    useState(null)

  return (
    <Panel
      title="Digital Twin"
      subtitle="Lithography equipment — live 3D telemetry"
      className="h-full min-h-0"
      actions={
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-slate-500">
            CLICK SUBSYSTEM
          </span>

          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />

          <span className="text-[10px] font-mono text-emerald-400">
            LIVE
          </span>
        </div>
      }
    >
      <div className="relative h-full min-h-0">

        {/* =====================================================
            3D VIEWPORT
           ===================================================== */}

        <Canvas
          camera={{
            position: [4.8, 3.0, 5.2],
            fov: 45,
          }}
          shadows
          dpr={[1, 1.5]}
        >
          <Suspense fallback={null}>

            <Scene
              selectedSubsystem={selectedSubsystem}
              onSelectSubsystem={setSelectedSubsystem}
            />

            <OrbitControls
              target={[0, 0.65, 0]}
              enableDamping
              dampingFactor={0.08}
              minDistance={2.8}
              maxDistance={12}
              maxPolarAngle={Math.PI / 2.05}
            />

          </Suspense>
        </Canvas>

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
            TOP RIGHT VIEWPORT STATUS
           ===================================================== */}

        <div className="pointer-events-none absolute top-2 right-2">
          <div className="flex items-center gap-2 px-2 py-1 bg-slate-950/75 border border-slate-800 rounded-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />

            <span className="text-[9px] font-mono text-emerald-400">
              TELEMETRY LINK
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
