'use client'

import { motion } from 'framer-motion'

export const STEPS = [
  { id: 0, code: '01', label: 'Modèle' },
  { id: 1, code: '02', label: 'Relief' },
  { id: 2, code: '03', label: 'Matière' },
  { id: 3, code: '04', label: 'Récapitulatif' },
] as const

interface StepperProps {
  current: number
  onNavigate?: (step: number) => void
}

export function Stepper({ current, onNavigate }: StepperProps) {
  return (
    <nav className="flex items-center gap-0" aria-label="Étapes du configurateur">
      {STEPS.map((step, i) => {
        const done   = step.id < current
        const active = step.id === current

        return (
          <button
            key={step.id}
            onClick={() => done && onNavigate?.(step.id)}
            disabled={!done}
            className={[
              'flex items-center gap-2 px-3 py-1.5 transition-all duration-300',
              'font-mono text-[0.6rem] tracking-[0.18em] uppercase',
              done   ? 'cursor-pointer text-creme-os/60 hover:text-creme-os/90' : 'cursor-default',
              active ? 'text-creme-os' : '',
              !done && !active ? 'text-creme-os/25' : '',
            ].join(' ')}
          >
            {/* Step number pill */}
            <span
              className={[
                'w-5 h-5 flex items-center justify-center rounded-full border text-[0.55rem] transition-all duration-300',
                active ? 'border-orange-brule bg-orange-brule text-white' : '',
                done   ? 'border-creme-os/40 text-creme-os/60' : '',
                !done && !active ? 'border-creme-os/15 text-creme-os/25' : '',
              ].join(' ')}
            >
              {done ? '✓' : step.code}
            </span>
            <span className="hidden sm:inline">{step.label}</span>

            {/* Separator */}
            {i < STEPS.length - 1 && (
              <span className="ml-2 text-creme-os/15">·</span>
            )}
          </button>
        )
      })}
    </nav>
  )
}
