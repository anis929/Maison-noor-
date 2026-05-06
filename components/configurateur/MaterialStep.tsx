'use client'

import { motion } from 'framer-motion'
import { MaterialType, MATERIAL_CONFIGS } from '@/components/three/Frame'

const PRICES: Record<MaterialType, number> = {
  acetate:  2800,
  walnut:   3200,
  ebony:    3600,
  titanium: 4200,
}

const ORIGINS: Record<MaterialType, string> = {
  acetate:  'Italie · Mazzucchelli 1849',
  walnut:   'France · Massif Central',
  ebony:    'Afrique · Commerce équitable',
  titanium: 'Japon · Grade 5 aéronautique',
}

const DESCRIPTIONS: Record<MaterialType, string> = {
  acetate:
    "L'acétate de cellulose Mazzucchelli est la référence absolue de la lunetterie de luxe. Translucide, léger, et d'une richesse chromatique inégalée.",
  walnut:
    "Noyer français sélectionné pour ses veines expressives. Chaud en main, léger en port, chaque paire est unique par définition.",
  ebony:
    "L'ébène de Macassar, l'un des bois les plus denses au monde. Noir profond strié d'or. Un matériau d'exception pour une pièce définitive.",
  titanium:
    "Titane grade 5 (Ti-6Al-4V), l'alliage de l'aéronautique. Résistance maximale pour un poids minimal. Pour ceux qui ne veulent rien sentir.",
}

interface MaterialStepProps {
  selected: MaterialType | null
  onSelect: (mat: MaterialType) => void
  onNext: () => void
  onBack: () => void
}

const SWATCH_COLORS: Record<MaterialType, string> = {
  acetate:  'linear-gradient(135deg, #8B5E3C 0%, #C4874A 40%, #7A4F32 100%)',
  walnut:   'linear-gradient(135deg, #5C3218 0%, #8B5233 40%, #3E1E0A 100%)',
  ebony:    'linear-gradient(135deg, #1A0D07 0%, #3D2010 35%, #0D0603 100%)',
  titanium: 'linear-gradient(135deg, #7C7C8A 0%, #C0C0CC 40%, #8A8A96 100%)',
}

function formatPrice(cents: number) {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(cents)
}

export function MaterialStep({ selected, onSelect, onNext, onBack }: MaterialStepProps) {
  const materials = Object.keys(MATERIAL_CONFIGS) as MaterialType[]

  return (
    <div className="flex flex-col h-full">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <p className="font-mono text-[0.6rem] tracking-[0.2em] uppercase text-creme-os/35 mb-2">Étape 03</p>
        <h2 className="font-display font-black text-2xl md:text-3xl text-creme-os leading-none mb-1">
          Choisissez la matière
        </h2>
        <p className="text-creme-os/45 text-sm font-light mb-8">
          Chaque matériau interagit différemment avec la lumière et le relief.
        </p>
      </motion.div>

      <div className="flex flex-col gap-3 flex-1 overflow-y-auto pr-1">
        {materials.map((mat, i) => {
          const cfg = MATERIAL_CONFIGS[mat]
          const isSelected = selected === mat

          return (
            <motion.button
              key={mat}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}
              onClick={() => onSelect(mat)}
              className={[
                'text-left p-4 border transition-all duration-300 group',
                isSelected
                  ? 'border-orange-brule bg-orange-brule/5'
                  : 'border-white/8 hover:border-white/20',
              ].join(' ')}
            >
              <div className="flex items-start gap-4">
                {/* Color swatch */}
                <div
                  className="w-12 h-12 flex-shrink-0 rounded-sm shadow-inner"
                  style={{ background: SWATCH_COLORS[mat] }}
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between mb-0.5">
                    <span className="font-display font-black text-base text-creme-os">{cfg.name}</span>
                    <span className="font-mono text-xs text-creme-os/60 ml-2">{formatPrice(PRICES[mat])}</span>
                  </div>
                  <p className="font-mono text-[0.55rem] tracking-widest uppercase text-orange-brule/70 mb-1.5">
                    {ORIGINS[mat]}
                  </p>
                  <p className="text-creme-os/40 text-xs leading-relaxed font-light line-clamp-2">
                    {DESCRIPTIONS[mat]}
                  </p>
                </div>

                <div
                  className={[
                    'w-4 h-4 rounded-full border-2 flex-shrink-0 mt-1 transition-all duration-200',
                    isSelected ? 'border-orange-brule bg-orange-brule' : 'border-creme-os/20',
                  ].join(' ')}
                />
              </div>
            </motion.button>
          )
        })}
      </div>

      <div className="mt-6 pt-4 border-t border-white/8 flex gap-3">
        <button
          onClick={onBack}
          className="px-5 py-3 font-mono text-[0.65rem] tracking-[0.2em] uppercase border border-creme-os/20 text-creme-os/50 hover:text-creme-os/80 hover:border-creme-os/35 transition-colors duration-200"
        >
          ← Retour
        </button>
        <button
          onClick={onNext}
          disabled={!selected}
          className="flex-1 py-3 font-mono text-[0.7rem] tracking-[0.2em] uppercase bg-orange-brule text-white hover:bg-orange-lumiere transition-colors duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Récapitulatif →
        </button>
      </div>
    </div>
  )
}
