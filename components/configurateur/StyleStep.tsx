'use client'

import { motion } from 'framer-motion'
import { FrameModel } from '@/lib/three/proceduralFrames'

const FRAME_OPTIONS: { id: FrameModel; label: string; subtitle: string; description: string }[] = [
  {
    id: 'round',
    label: 'Ronde',
    subtitle: 'Classique',
    description: 'Cercles parfaits. La monture intemporelle qui convient à tous les visages.',
  },
  {
    id: 'square',
    label: 'Carrée',
    subtitle: 'Architecture',
    description: 'Lignes affirmées. Pour les visages ronds et ovales qui cherchent du caractère.',
  },
  {
    id: 'aviator',
    label: 'Aviateur',
    subtitle: 'Icônique',
    description: "Goutte d'eau. Le classique né de l'aviation, réinterprété en matières nobles.",
  },
]

// Minimal SVG silhouettes for the frame cards
const FrameSilhouette = ({ model }: { model: FrameModel }) => {
  if (model === 'round') return (
    <svg viewBox="0 0 120 50" fill="none" className="w-full h-12">
      <circle cx="32" cy="25" r="18" stroke="currentColor" strokeWidth="3.5" />
      <circle cx="88" cy="25" r="18" stroke="currentColor" strokeWidth="3.5" />
      <path d="M50 25 Q60 22 70 25" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <line x1="14" y1="24" x2="2" y2="26" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="106" y1="24" x2="118" y2="26" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  )
  if (model === 'square') return (
    <svg viewBox="0 0 120 50" fill="none" className="w-full h-12">
      <rect x="12" y="10" width="38" height="30" rx="5" stroke="currentColor" strokeWidth="3.5" />
      <rect x="70" y="10" width="38" height="30" rx="5" stroke="currentColor" strokeWidth="3.5" />
      <path d="M50 20 Q60 17 70 20" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <line x1="12" y1="24" x2="2" y2="26" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="108" y1="24" x2="118" y2="26" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  )
  return (
    <svg viewBox="0 0 120 54" fill="none" className="w-full h-12">
      <path d="M14 20 Q14 10 24 10 Q42 10 50 24 Q42 42 24 38 Q14 34 14 20Z" stroke="currentColor" strokeWidth="3.5" fill="none" />
      <path d="M106 20 Q106 10 96 10 Q78 10 70 24 Q78 42 96 38 Q106 34 106 20Z" stroke="currentColor" strokeWidth="3.5" fill="none" />
      <path d="M50 20 Q60 17 70 20" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <line x1="14" y1="20" x2="2" y2="22" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="106" y1="20" x2="118" y2="22" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  )
}

interface StyleStepProps {
  selected: FrameModel | null
  onSelect: (model: FrameModel) => void
  onNext: () => void
}

export function StyleStep({ selected, onSelect, onNext }: StyleStepProps) {
  return (
    <div className="flex flex-col h-full">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <p className="font-mono text-[0.6rem] tracking-[0.2em] uppercase text-creme-os/35 mb-2">
          Étape 01
        </p>
        <h2 className="font-display font-black text-2xl md:text-3xl text-creme-os leading-none mb-1">
          Choisissez votre modèle
        </h2>
        <p className="text-creme-os/45 text-sm font-light mb-8">
          Chaque forme sera personnalisée avec votre relief unique.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 gap-3 flex-1 overflow-y-auto pr-1">
        {FRAME_OPTIONS.map((option, i) => (
          <motion.button
            key={option.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
            onClick={() => onSelect(option.id)}
            className={[
              'text-left p-4 border transition-all duration-300 group',
              selected === option.id
                ? 'border-orange-brule bg-orange-brule/5'
                : 'border-white/8 hover:border-white/20 bg-transparent',
            ].join(' ')}
          >
            <div className="flex items-start gap-4">
              {/* Frame silhouette */}
              <div
                className={[
                  'flex-1 transition-colors duration-300',
                  selected === option.id ? 'text-orange-brule' : 'text-creme-os/30 group-hover:text-creme-os/50',
                ].join(' ')}
              >
                <FrameSilhouette model={option.id} />
              </div>
              {/* Info */}
              <div className="flex-1">
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="font-display font-black text-lg text-creme-os">{option.label}</span>
                  <span className="font-mono text-[0.55rem] tracking-widest uppercase text-creme-os/35">
                    {option.subtitle}
                  </span>
                </div>
                <p className="text-creme-os/45 text-xs leading-relaxed font-light">{option.description}</p>
              </div>
              {/* Selection indicator */}
              <div
                className={[
                  'w-4 h-4 rounded-full border-2 flex-shrink-0 mt-1 transition-all duration-200',
                  selected === option.id
                    ? 'border-orange-brule bg-orange-brule'
                    : 'border-creme-os/20',
                ].join(' ')}
              />
            </div>
          </motion.button>
        ))}
      </div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: selected ? 1 : 0 }}
        className="mt-6 pt-4 border-t border-white/8"
      >
        <button
          onClick={onNext}
          disabled={!selected}
          className="w-full py-3.5 font-mono text-[0.7rem] tracking-[0.2em] uppercase bg-orange-brule text-white hover:bg-orange-lumiere transition-colors duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Choisir le relief →
        </button>
      </motion.div>
    </div>
  )
}
