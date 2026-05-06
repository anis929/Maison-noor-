'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import dynamic from 'next/dynamic'
import { PhotoUploader } from './PhotoUploader'
import { TextureLibrary } from './TextureLibrary'

// Mapbox is entirely client-side (uses canvas, navigator, etc.)
const MapPicker = dynamic(() => import('./MapPicker').then(m => m.MapPicker), {
  ssr:     false,
  loading: () => (
    <div className="flex-1 flex items-center justify-center">
      <div className="font-mono text-[0.6rem] tracking-widest uppercase text-creme-os/30 animate-pulse">
        Chargement de la carte…
      </div>
    </div>
  ),
})

type TabType = 'map' | 'photo' | 'texture'

interface InputStepProps {
  heightmapUrl: string | null
  heightmapLoading: boolean
  reliefSource: TabType | null
  onHeightmapReady: (url: string, source: TabType) => void
  onNext: () => void
  onBack: () => void
  // Displacement controls
  displacementScale: number
  displacementRotation: number
  displacementInverted: boolean
  onDisplacementChange: (key: 'scale' | 'rotation' | 'inverted', value: number | boolean) => void
}

const TABS: { id: TabType; label: string; icon: string }[] = [
  { id: 'map',     label: 'Carte',    icon: '⛰' },
  { id: 'photo',   label: 'Photo',    icon: '📷' },
  { id: 'texture', label: 'Texture',  icon: '◈' },
]

export function InputStep({
  heightmapUrl,
  reliefSource,
  onHeightmapReady,
  onNext,
  onBack,
  displacementScale,
  displacementRotation,
  displacementInverted,
  onDisplacementChange,
}: InputStepProps) {
  const [activeTab, setActiveTab] = useState<TabType>('map')
  const [selectedTexture, setSelectedTexture] = useState<string | null>(null)

  const handleHeightmap = (url: string) => {
    onHeightmapReady(url, activeTab)
  }

  const handleTextureSelect = (id: string, url: string) => {
    setSelectedTexture(id)
    onHeightmapReady(url, 'texture')
  }

  return (
    <div className="flex flex-col h-full">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <p className="font-mono text-[0.6rem] tracking-[0.2em] uppercase text-creme-os/35 mb-2">Étape 02</p>
        <h2 className="font-display font-black text-2xl md:text-3xl text-creme-os leading-none mb-1">
          Votre relief unique
        </h2>
        <p className="text-creme-os/45 text-sm font-light mb-5">
          Choisissez l'origine de votre gravure.
        </p>
      </motion.div>

      {/* Tab selector */}
      <div className="flex border-b border-white/8 mb-5">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={[
              'flex items-center gap-1.5 px-4 py-2.5 font-mono text-[0.6rem] tracking-[0.15em] uppercase transition-all duration-200 border-b-2 -mb-px',
              activeTab === tab.id
                ? 'border-orange-brule text-creme-os'
                : 'border-transparent text-creme-os/35 hover:text-creme-os/60',
            ].join(' ')}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-hidden flex flex-col">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="flex-1 overflow-hidden flex flex-col"
          >
            {activeTab === 'map'     && <MapPicker     onHeightmapReady={handleHeightmap} />}
            {activeTab === 'photo'   && <PhotoUploader onHeightmapReady={handleHeightmap} />}
            {activeTab === 'texture' && (
              <TextureLibrary selected={selectedTexture} onSelect={handleTextureSelect} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Displacement controls — appear when a heightmap is loaded */}
      <AnimatePresence>
        {heightmapUrl && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="pt-4 pb-2 border-t border-white/8 mt-4 space-y-3">
              <p className="font-mono text-[0.55rem] tracking-[0.2em] uppercase text-creme-os/35">
                Paramètres du relief
              </p>

              {/* Scale */}
              <div>
                <div className="flex justify-between mb-1.5">
                  <span className="font-mono text-[0.55rem] tracking-wide text-creme-os/40 uppercase">Intensité</span>
                  <span className="font-mono text-[0.55rem] text-creme-os/60">
                    {(displacementScale * 1.8).toFixed(1)} mm
                  </span>
                </div>
                <input
                  type="range" min="0" max="1" step="0.01"
                  value={displacementScale}
                  onChange={e => onDisplacementChange('scale', parseFloat(e.target.value))}
                  className="w-full accent-orange-brule"
                />
              </div>

              {/* Rotation + Invert in one row */}
              <div className="flex gap-4 items-end">
                <div className="flex-1">
                  <div className="flex justify-between mb-1.5">
                    <span className="font-mono text-[0.55rem] tracking-wide text-creme-os/40 uppercase">Rotation</span>
                    <span className="font-mono text-[0.55rem] text-creme-os/60">{displacementRotation}°</span>
                  </div>
                  <input
                    type="range" min="0" max="360" step="1"
                    value={displacementRotation}
                    onChange={e => onDisplacementChange('rotation', parseInt(e.target.value))}
                    className="w-full accent-orange-brule"
                  />
                </div>
                <button
                  onClick={() => onDisplacementChange('inverted', !displacementInverted)}
                  className={[
                    'flex-shrink-0 px-3 py-1.5 font-mono text-[0.55rem] tracking-wide uppercase border transition-colors duration-200 mb-0.5',
                    displacementInverted
                      ? 'border-orange-brule text-orange-brule bg-orange-brule/5'
                      : 'border-white/15 text-creme-os/35 hover:border-white/30',
                  ].join(' ')}
                >
                  {displacementInverted ? 'Creux ↓' : 'Bosse ↑'}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation */}
      <div className="mt-4 flex gap-3 border-t border-white/8 pt-4">
        <button
          onClick={onBack}
          className="px-5 py-3 font-mono text-[0.65rem] tracking-[0.2em] uppercase border border-creme-os/20 text-creme-os/50 hover:text-creme-os/80 hover:border-creme-os/35 transition-colors duration-200"
        >
          ← Retour
        </button>
        <button
          onClick={onNext}
          disabled={!heightmapUrl}
          className="flex-1 py-3 font-mono text-[0.7rem] tracking-[0.2em] uppercase bg-orange-brule text-white hover:bg-orange-lumiere transition-colors duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Choisir la matière →
        </button>
      </div>
    </div>
  )
}
