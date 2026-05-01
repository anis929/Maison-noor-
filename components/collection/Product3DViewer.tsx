'use client'

import { useRef, useState } from 'react'
import { MonoLabel } from '@/components/ui/MonoLabel'

interface Product3DViewerProps {
  productName: string
}

/**
 * CSS 3D perspective viewer — drag to rotate around Y axis.
 * Replace the inner div with a <Canvas> + <Model /> component
 * once .glb files are available.
 */
export function Product3DViewer({ productName }: Product3DViewerProps) {
  const [rotY, setRotY] = useState(0)
  const [rotX, setRotX] = useState(0)
  const [dragging, setDragging] = useState(false)
  const lastPos = useRef({ x: 0, y: 0 })

  const onPointerDown = (e: React.PointerEvent) => {
    setDragging(true)
    lastPos.current = { x: e.clientX, y: e.clientY }
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
  }

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging) return
    const dx = e.clientX - lastPos.current.x
    const dy = e.clientY - lastPos.current.y
    setRotY(r => r + dx * 0.5)
    setRotX(r => Math.max(-30, Math.min(30, r - dy * 0.3)))
    lastPos.current = { x: e.clientX, y: e.clientY }
  }

  const onPointerUp = () => setDragging(false)

  return (
    <div
      className="relative w-full aspect-square flex items-center justify-center bg-noir-doux grain-overlay overflow-hidden select-none"
      style={{ perspective: '800px', cursor: dragging ? 'grabbing' : 'grab' }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
      aria-label={`Vue 3D — ${productName}`}
    >
      {/* Subtle background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_50%_at_50%_50%,rgba(212,84,28,0.06)_0%,transparent_70%)]" />

      {/* 3D object placeholder */}
      <div
        style={{
          transform: `rotateY(${rotY}deg) rotateX(${rotX}deg)`,
          transformStyle: 'preserve-3d',
          transition: dragging ? 'none' : 'transform 0.5s ease-out',
          width:  '60%',
          height: '35%',
          position: 'relative',
        }}
      >
        {/* Front face */}
        <div
          className="absolute inset-0 border border-chrome/20 bg-gradient-to-br from-chrome/10 to-chrome/5 flex items-center justify-center"
          style={{ transform: 'translateZ(12px)' }}
        >
          <span className="font-display font-black text-2xl text-white/10 tracking-widest">
            {productName.toUpperCase()}
          </span>
        </div>
        {/* Back face */}
        <div
          className="absolute inset-0 border border-chrome/10 bg-gradient-to-br from-corne-fonce/40 to-transparent"
          style={{ transform: 'translateZ(-12px) rotateY(180deg)' }}
        />
        {/* Left side */}
        <div
          className="absolute top-0 bottom-0 w-6 border border-chrome/10 bg-chrome/5"
          style={{ left: 0, transform: 'translateX(-12px) rotateY(-90deg)', transformOrigin: 'left' }}
        />
        {/* Right side */}
        <div
          className="absolute top-0 bottom-0 w-6 border border-chrome/10 bg-chrome/5"
          style={{ right: 0, transform: 'translateX(12px) rotateY(90deg)', transformOrigin: 'right' }}
        />
      </div>

      {/* Instruction */}
      <div className="absolute bottom-4 left-0 right-0 text-center">
        <MonoLabel dim>Glisser pour pivoter</MonoLabel>
      </div>
    </div>
  )
}
