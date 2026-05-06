'use client'

import { Suspense, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei'
import { Frame, FrameProps } from '@/components/three/Frame'

interface Preview3DProps extends FrameProps {
  className?: string
}

function Lights() {
  return (
    <>
      {/* Key light — warm from upper left */}
      <directionalLight
        position={[-6, 8, 6]}
        intensity={2.2}
        color="#FFF5E8"
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      {/* Fill light — cool from right */}
      <directionalLight position={[8, 2, 4]}  intensity={0.8} color="#D0E4FF" />
      {/* Rim light — from behind */}
      <directionalLight position={[0, -3, -8]} intensity={0.6} color="#E8D0FF" />
      {/* Ambient */}
      <ambientLight intensity={0.35} />
    </>
  )
}

function FrameScene(props: FrameProps) {
  return (
    <>
      <Lights />
      {/* Environment map for PBR reflections */}
      <Environment preset="studio" />

      {/* Ground shadow */}
      <ContactShadows
        position={[0, -3.5, 0]}
        opacity={0.35}
        scale={20}
        blur={2.5}
        far={6}
        color="#0A0A0A"
      />

      <Frame {...props} />
    </>
  )
}

export function Preview3D({ className = '', ...frameProps }: Preview3DProps) {
  return (
    <div className={`relative w-full h-full ${className}`}>
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ position: [0, 1.5, 18], fov: 42, near: 0.1, far: 200 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          <FrameScene {...frameProps} />
        </Suspense>

        <OrbitControls
          enablePan={false}
          minDistance={8}
          maxDistance={30}
          minPolarAngle={Math.PI * 0.25}
          maxPolarAngle={Math.PI * 0.75}
          autoRotate
          autoRotateSpeed={0.6}
          // Stop auto-rotate on user interaction
          makeDefault
        />
      </Canvas>

      {/* Subtle vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 80% 80% at 50% 50%, transparent 55%, rgba(10,10,10,0.45) 100%)',
        }}
      />
    </div>
  )
}
