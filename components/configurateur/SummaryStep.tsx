'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { FrameModel } from '@/lib/three/proceduralFrames'
import { MaterialType, MATERIAL_CONFIGS } from '@/components/three/Frame'

type ReliefSource = 'map' | 'photo' | 'texture'
type SizeType = 'S' | 'M' | 'L'

const SIZE_LABELS: Record<SizeType, string> = {
  S: 'S — Étroit (48–50 mm)',
  M: 'M — Standard (52–54 mm)',
  L: 'L — Large (56–58 mm)',
}

const RELIEF_LABELS: Record<ReliefSource, string> = {
  map:     'Relief géographique',
  photo:   'Photo personnelle',
  texture: 'Texture pré-définie',
}

const FRAME_LABELS: Record<FrameModel, string> = {
  round:   'Ronde Classique',
  square:  'Carrée Architecture',
  aviator: 'Aviateur Icônique',
}

const PRICES: Record<MaterialType, number> = {
  acetate:  2800,
  walnut:   3200,
  ebony:    3600,
  titanium: 4200,
}

function formatPrice(cents: number) {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(cents)
}

interface SummaryStepProps {
  frameModel: FrameModel
  material: MaterialType
  reliefSource: ReliefSource | null
  heightmapUrl: string | null
  displacementScale: number
  onBack: () => void
  onOrder: (size: SizeType) => void
}

export function SummaryStep({
  frameModel,
  material,
  reliefSource,
  heightmapUrl,
  displacementScale,
  onBack,
  onOrder,
}: SummaryStepProps) {
  const [size, setSize] = useState<SizeType>('M')
  const [ordering, setOrdering] = useState(false)

  const matCfg = MATERIAL_CONFIGS[material]
  const price  = PRICES[material]

  const handleOrder = async () => {
    setOrdering(true)
    // Stripe integration will be wired here (Phase 2)
    await new Promise(r => setTimeout(r, 1200))
    onOrder(size)
    setOrdering(false)
  }

  return (
    <div className="flex flex-col h-full">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <p className="font-mono text-[0.6rem] tracking-[0.2em] uppercase text-creme-os/35 mb-2">Étape 04</p>
        <h2 className="font-display font-black text-2xl md:text-3xl text-creme-os leading-none mb-6">
          Votre paire unique
        </h2>
      </motion.div>

      <div className="flex-1 overflow-y-auto pr-1 space-y-4">
        {/* Summary card */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="border border-white/8 p-4 space-y-3"
        >
          {[
            { label: 'Modèle',  value: FRAME_LABELS[frameModel] },
            { label: 'Matière', value: matCfg.name },
            { label: 'Relief',  value: reliefSource ? RELIEF_LABELS[reliefSource] : '—' },
            { label: 'Intensité', value: `${Math.round(displacementScale * 100)}%` },
          ].map(({ label, value }) => (
            <div key={label} className="flex justify-between items-baseline">
              <span className="font-mono text-[0.6rem] tracking-[0.15em] uppercase text-creme-os/35">{label}</span>
              <span className="text-sm text-creme-os/80 font-light">{value}</span>
            </div>
          ))}
        </motion.div>

        {/* Size selection */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.18 }}
        >
          <p className="font-mono text-[0.6rem] tracking-[0.2em] uppercase text-creme-os/35 mb-3">
            Taille de la monture
          </p>
          <div className="grid grid-cols-3 gap-2">
            {(['S', 'M', 'L'] as SizeType[]).map(s => (
              <button
                key={s}
                onClick={() => setSize(s)}
                className={[
                  'py-2.5 text-center font-mono text-xs border transition-all duration-200',
                  size === s
                    ? 'border-orange-brule text-orange-brule bg-orange-brule/5'
                    : 'border-white/10 text-creme-os/40 hover:border-white/25',
                ].join(' ')}
              >
                {s}
              </button>
            ))}
          </div>
          <p className="mt-1.5 font-mono text-[0.55rem] tracking-wide text-creme-os/30">
            {SIZE_LABELS[size]}
          </p>
        </motion.div>

        {/* Delivery note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
          className="bg-corne-fonce/20 border border-corne-medium/20 p-3"
        >
          <p className="font-mono text-[0.55rem] tracking-[0.1em] uppercase text-creme-os/40 mb-1">
            Fabrication sur mesure
          </p>
          <p className="text-creme-os/55 text-xs leading-relaxed font-light">
            Chaque paire est façonnée à la main dans notre atelier parisien. Délai de fabrication : 6 à 8 semaines.
            Un fichier STL vous sera transmis pour validation avant production.
          </p>
        </motion.div>

        {/* Price */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex items-baseline justify-between py-3 border-t border-b border-white/8"
        >
          <span className="font-mono text-[0.65rem] tracking-[0.2em] uppercase text-creme-os/35">Total</span>
          <span className="font-display font-black text-2xl text-creme-os">{formatPrice(price)}</span>
        </motion.div>
      </div>

      {/* Actions */}
      <div className="mt-6 pt-4 border-t border-white/8 flex gap-3">
        <button
          onClick={onBack}
          className="px-5 py-3.5 font-mono text-[0.65rem] tracking-[0.2em] uppercase border border-creme-os/20 text-creme-os/50 hover:border-creme-os/35 hover:text-creme-os/80 transition-colors duration-200"
        >
          ← Retour
        </button>
        <button
          onClick={handleOrder}
          disabled={ordering}
          className="flex-1 py-3.5 font-mono text-[0.7rem] tracking-[0.2em] uppercase bg-orange-brule text-white hover:bg-orange-lumiere transition-colors duration-200 disabled:opacity-60"
        >
          {ordering ? 'Redirection...' : `Commander · ${formatPrice(price)}`}
        </button>
      </div>

      <p className="mt-3 text-center font-mono text-[0.55rem] tracking-wide text-creme-os/20">
        Paiement sécurisé · Stripe · SSL/TLS
      </p>
    </div>
  )
}
