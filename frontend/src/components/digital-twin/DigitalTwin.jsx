import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { Suspense } from 'react'

import Panel from '../layout/Panel'
import Scene from './Scene'

export default function DigitalTwin() {
  return (
    <Panel
      title="Digital Twin"
      subtitle="Prototype assembly — live viewport"
      className="h-full min-h-0"
      actions={
        <span className="text-[10px] font-mono text-slate-500">
          drag to orbit
        </span>
      }
    >
      <div className="relative h-full min-h-0">

        <Canvas
          camera={{
            position: [4.2, 2.7, 4.2],
            fov: 46,
          }}
          shadows
          dpr={[1, 1.5]}
        >
          <Suspense fallback={null}>
            <Scene />

            <OrbitControls
              target={[0, 0.55, 0]}
              enableDamping
              dampingFactor={0.08}
              minDistance={2.8}
              maxDistance={12}
              maxPolarAngle={Math.PI / 2.05}
            />
          </Suspense>
        </Canvas>

        {/* Technical viewport information */}
        <div className="pointer-events-none absolute top-2 left-2 text-[10px] font-mono text-slate-500 space-y-0.5">
          <p>Stage: EQ-04A</p>
          <p>Axis: X / Y / Z</p>
        </div>

        {/* Small viewport status indicator */}
        <div className="pointer-events-none absolute bottom-2 left-2 flex items-center gap-2 px-2 py-1 bg-slate-950/70 border border-slate-800 rounded-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />

          <span className="text-[9px] font-mono text-slate-500">
            LIVE TELEMETRY
          </span>
        </div>

      </div>
    </Panel>
  )
}
