'use client'

import { useRef, useEffect, useMemo } from 'react'
import * as THREE from 'three'
import {
  FrameModel,
  createRimGeometry,
  createBridgeGeometry,
  createTempleGeometry,
  createHingeGeometry,
  createNosePadGeometry,
  getHingePositions,
  getNosePadPositions,
} from '@/lib/three/proceduralFrames'

// ── Material presets (PBR) ───────────────────────────────────────────────────
export type MaterialType = 'acetate' | 'walnut' | 'ebony' | 'titanium'

export const MATERIAL_CONFIGS: Record<MaterialType, {
  name: string
  color: string
  roughness: number
  metalness: number
  envMapIntensity: number
}> = {
  acetate:  { name: 'Acétate Mazzucchelli', color: '#7A4F32', roughness: 0.82, metalness: 0.02, envMapIntensity: 0.6 },
  walnut:   { name: 'Bois de noyer',        color: '#5C3218', roughness: 0.72, metalness: 0.00, envMapIntensity: 0.4 },
  ebony:    { name: "Bois d'ébène",          color: '#1A0D07', roughness: 0.60, metalness: 0.00, envMapIntensity: 0.5 },
  titanium: { name: 'Titane grade 5',        color: '#8A8A96', roughness: 0.22, metalness: 0.95, envMapIntensity: 1.2 },
}

export interface FrameProps {
  model: FrameModel
  material: MaterialType
  heightmapUrl: string | null
  displacementScale: number   // 0.0–1.0 (maps to 0–0.18 Three.js cm)
  displacementRotation: number // degrees
  displacementInverted: boolean
}

// Shared standard material factory (for non-engraving parts)
function makeStdMat(cfg: typeof MATERIAL_CONFIGS[MaterialType]): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({
    color: cfg.color,
    roughness: cfg.roughness,
    metalness: cfg.metalness,
    envMapIntensity: cfg.envMapIntensity,
  })
}

export function Frame({
  model,
  material,
  heightmapUrl,
  displacementScale,
  displacementRotation,
  displacementInverted,
}: FrameProps) {
  const leftEngravingRef  = useRef<THREE.MeshStandardMaterial>(null)
  const rightEngravingRef = useRef<THREE.MeshStandardMaterial>(null)

  const cfg     = MATERIAL_CONFIGS[material]
  const matColor = cfg.color
  const matRough = cfg.roughness
  const matMetal = cfg.metalness
  const matEnv   = cfg.envMapIntensity

  // ── Reactive displacement map ─────────────────────────────────────────────
  useEffect(() => {
    const mats = [leftEngravingRef.current, rightEngravingRef.current].filter(
      (m): m is THREE.MeshStandardMaterial => m !== null,
    )

    if (!heightmapUrl) {
      mats.forEach(m => {
        m.displacementMap  = null
        m.displacementScale = 0
        m.needsUpdate      = true
      })
      return
    }

    const loader = new THREE.TextureLoader()
    loader.load(heightmapUrl, (tex) => {
      tex.wrapS = tex.wrapT = THREE.RepeatWrapping
      tex.rotation = (displacementRotation * Math.PI) / 180
      tex.center.set(0.5, 0.5)
      tex.needsUpdate = true

      // displacementScale 0→1 maps to 0→0.18 cm (≈ 0–1.8 mm engraving depth)
      const rawScale = (displacementInverted ? -1 : 1) * displacementScale * 0.18
      const bias     = -rawScale * 0.5 // center around 0 so grey = no displacement

      mats.forEach(m => {
        m.displacementMap   = tex
        m.displacementScale = rawScale
        m.displacementBias  = bias
        m.needsUpdate       = true
      })
    })
  }, [heightmapUrl, displacementScale, displacementRotation, displacementInverted])

  // ── Geometry (rebuilt only when model changes) ────────────────────────────
  const geos = useMemo(() => ({
    leftRim:       createRimGeometry(model, 'left'),
    rightRim:      createRimGeometry(model, 'right'),
    bridge:        createBridgeGeometry(model),
    leftTemple:    createTempleGeometry(model, 'left'),
    rightTemple:   createTempleGeometry(model, 'right'),
    hinge:         createHingeGeometry(),
    nosePad:       createNosePadGeometry(),
  }), [model])

  const hingePos   = useMemo(() => getHingePositions(model), [model])
  const nosePadPos = useMemo(() => getNosePadPositions(model), [model])

  return (
    <group>
      {/* ── Left rim — primary engraving zone ─────────────────────────── */}
      <mesh name="engraving_zone_left" geometry={geos.leftRim}>
        <meshStandardMaterial
          ref={leftEngravingRef}
          color={matColor}
          roughness={matRough}
          metalness={matMetal}
          envMapIntensity={matEnv}
        />
      </mesh>

      {/* ── Right rim — primary engraving zone ────────────────────────── */}
      <mesh name="engraving_zone_right" geometry={geos.rightRim}>
        <meshStandardMaterial
          ref={rightEngravingRef}
          color={matColor}
          roughness={matRough}
          metalness={matMetal}
          envMapIntensity={matEnv}
        />
      </mesh>

      {/* ── Bridge ────────────────────────────────────────────────────── */}
      <mesh name="frame_bridge" geometry={geos.bridge}>
        <meshStandardMaterial color={matColor} roughness={matRough} metalness={matMetal} envMapIntensity={matEnv} />
      </mesh>

      {/* ── Left temple ───────────────────────────────────────────────── */}
      <mesh name="frame_temple_left" geometry={geos.leftTemple}>
        <meshStandardMaterial color={matColor} roughness={matRough} metalness={matMetal} envMapIntensity={matEnv} />
      </mesh>

      {/* ── Right temple ──────────────────────────────────────────────── */}
      <mesh name="frame_temple_right" geometry={geos.rightTemple}>
        <meshStandardMaterial color={matColor} roughness={matRough} metalness={matMetal} envMapIntensity={matEnv} />
      </mesh>

      {/* ── Hinges ────────────────────────────────────────────────────── */}
      <mesh
        name="frame_hinge_left"
        geometry={geos.hinge}
        position={[hingePos.left.x, hingePos.left.y, 0]}
        rotation={[Math.PI / 2, 0, 0]}
      >
        <meshStandardMaterial color={material === 'titanium' ? '#C0C0C8' : '#888'} roughness={0.15} metalness={0.98} />
      </mesh>

      <mesh
        name="frame_hinge_right"
        geometry={geos.hinge}
        position={[hingePos.right.x, hingePos.right.y, 0]}
        rotation={[Math.PI / 2, 0, 0]}
      >
        <meshStandardMaterial color={material === 'titanium' ? '#C0C0C8' : '#888'} roughness={0.15} metalness={0.98} />
      </mesh>

      {/* ── Nose pads (for non-titanium: acetate pad; titanium: metal arm) */}
      {['left', 'right'].map(side => {
        const pos = side === 'left' ? nosePadPos.left : nosePadPos.right
        return (
          <mesh key={side} name={`frame_nosepad_${side}`} geometry={geos.nosePad} position={[pos.x, pos.y, pos.z]}>
            <meshStandardMaterial
              color={material === 'titanium' ? '#ABABBA' : '#E8DCC4'}
              roughness={material === 'titanium' ? 0.1 : 0.9}
              metalness={material === 'titanium' ? 0.9 : 0.0}
              transparent
              opacity={0.85}
            />
          </mesh>
        )
      })}
    </group>
  )
}
