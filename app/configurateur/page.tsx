'use client'

import { useState, Suspense } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

import { Stepper }       from '@/components/configurateur/Stepper'
import { StyleStep }     from '@/components/configurateur/StyleStep'
import { InputStep }     from '@/components/configurateur/InputStep'
import { MaterialStep }  from '@/components/configurateur/MaterialStep'
import { SummaryStep }   from '@/components/configurateur/SummaryStep'
import { FrameModel }    from '@/lib/three/proceduralFrames'
import { MaterialType }  from '@/components/three/Frame'

// Preview3D is heavy — load client-side only with a graceful placeholder
const Preview3D = dynamic(
  () => import('@/components/configurateur/Preview3D').then(m => m.Preview3D),
  { ssr: false, loading: () => <PreviewPlaceholder /> },
)

type ReliefSource = 'map' | 'photo' | 'texture'
type SizeType     = 'S' | 'M' | 'L'

interface ConfigState {
  step:                number
  frameModel:          FrameModel | null
  material:            MaterialType
  reliefSource:        ReliefSource | null
  heightmapUrl:        string | null
  displacementScale:   number
  displacementRotation: number
  displacementInverted: boolean
}

function PreviewPlaceholder() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="font-mono text-[0.6rem] tracking-widest uppercase text-creme-os/20 animate-pulse">
        Chargement 3D…
      </div>
    </div>
  )
}

function Logo() {
  return (
    <span className="font-display font-black text-lg tracking-tight text-creme-os">
      Maison <span className="text-orange-brule">Noor</span>
    </span>
  )
}

export default function ConfigurateurPage() {
  const [state, setState] = useState<ConfigState>({
    step:                 0,
    frameModel:           null,
    material:             'acetate',
    reliefSource:         null,
    heightmapUrl:         null,
    displacementScale:    0.5,
    displacementRotation: 0,
    displacementInverted: false,
  })

  const update = (patch: Partial<ConfigState>) =>
    setState(prev => ({ ...prev, ...patch }))

  const goTo = (step: number) => update({ step })

  // ── Step handlers ──────────────────────────────────────────────────────────
  const handleFrameSelect = (model: FrameModel) => update({ frameModel: model })
  const handleMaterialSelect = (mat: MaterialType) => update({ material: mat })
  const handleHeightmapReady = (url: string, source: ReliefSource) =>
    update({ heightmapUrl: url, reliefSource: source })
  const handleDisplacementChange = (
    key: 'scale' | 'rotation' | 'inverted',
    value: number | boolean,
  ) => update({ [`displacement${key.charAt(0).toUpperCase() + key.slice(1)}`]: value } as Partial<ConfigState>)

  const handleOrder = (size: SizeType) => {
    // Phase 2: wire Stripe here
    console.log('Order:', { ...state, size })
    alert(`Commande enregistrée ! (Paiement Stripe — Phase 2)\nTaille : ${size}`)
  }

  // ── Shared Preview3D props ─────────────────────────────────────────────────
  const previewProps = {
    model:                state.frameModel ?? 'round',
    material:             state.material,
    heightmapUrl:         state.heightmapUrl,
    displacementScale:    state.displacementScale,
    displacementRotation: state.displacementRotation,
    displacementInverted: state.displacementInverted,
  }

  return (
    // Fixed overlay sits on top of the root layout's nav/footer (z-[1000])
    <div className="fixed inset-0 z-[1000] bg-noir-profond flex flex-col overflow-hidden">

      {/* ── Top bar ───────────────────────────────────────────────────────── */}
      <header className="flex-shrink-0 flex items-center justify-between px-5 py-3 border-b border-white/6">
        <Link href="/" className="opacity-70 hover:opacity-100 transition-opacity">
          <Logo />
        </Link>

        <Stepper current={state.step} onNavigate={goTo} />

        <Link
          href="/collection"
          className="font-mono text-[0.6rem] tracking-[0.18em] uppercase text-creme-os/35 hover:text-creme-os/70 transition-colors flex items-center gap-1.5"
        >
          <span>←</span> Fermer
        </Link>
      </header>

      {/* ── Main split layout ─────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">

        {/* ── Left — 3D Preview ─────────────────────────────────────────── */}
        <div className="relative md:flex-1 h-[45vw] md:h-auto bg-noir-doux">
          {state.frameModel ? (
            <Preview3D {...previewProps} className="absolute inset-0" />
          ) : (
            // Empty state before a model is selected
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
              <div className="text-creme-os/10">
                <svg viewBox="0 0 200 80" fill="none" className="w-48">
                  <circle cx="55" cy="40" r="28" stroke="currentColor" strokeWidth="4" />
                  <circle cx="145" cy="40" r="28" stroke="currentColor" strokeWidth="4" />
                  <path d="M83 40 Q100 36 117 40" stroke="currentColor" strokeWidth="3" strokeLinecap="round" fill="none" />
                  <line x1="27" y1="39" x2="5" y2="41" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                  <line x1="173" y1="39" x2="195" y2="41" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                </svg>
              </div>
              <p className="font-mono text-[0.6rem] tracking-[0.2em] uppercase text-creme-os/20">
                Choisissez un modèle
              </p>
            </div>
          )}

          {/* Watermark */}
          <div className="absolute bottom-3 left-3 pointer-events-none">
            <span className="font-mono text-[0.5rem] tracking-[0.2em] uppercase text-creme-os/15">
              Maison Noor · Configurateur 3D · Beta
            </span>
          </div>
        </div>

        {/* ── Right — Controls ──────────────────────────────────────────── */}
        <div className="w-full md:w-[380px] lg:w-[420px] flex-shrink-0 flex flex-col overflow-hidden border-t md:border-t-0 md:border-l border-white/6">
          <div className="flex-1 overflow-y-auto p-6">
            <AnimatePresence mode="wait">
              {state.step === 0 && (
                <motion.div
                  key="step-0"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="h-full"
                >
                  <StyleStep
                    selected={state.frameModel}
                    onSelect={handleFrameSelect}
                    onNext={() => goTo(1)}
                  />
                </motion.div>
              )}

              {state.step === 1 && (
                <motion.div
                  key="step-1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="h-full flex flex-col"
                >
                  <InputStep
                    heightmapUrl={state.heightmapUrl}
                    heightmapLoading={false}
                    reliefSource={state.reliefSource}
                    onHeightmapReady={handleHeightmapReady}
                    onNext={() => goTo(2)}
                    onBack={() => goTo(0)}
                    displacementScale={state.displacementScale}
                    displacementRotation={state.displacementRotation}
                    displacementInverted={state.displacementInverted}
                    onDisplacementChange={handleDisplacementChange}
                  />
                </motion.div>
              )}

              {state.step === 2 && (
                <motion.div
                  key="step-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="h-full"
                >
                  <MaterialStep
                    selected={state.material}
                    onSelect={handleMaterialSelect}
                    onNext={() => goTo(3)}
                    onBack={() => goTo(1)}
                  />
                </motion.div>
              )}

              {state.step === 3 && (
                <motion.div
                  key="step-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="h-full"
                >
                  <SummaryStep
                    frameModel={state.frameModel ?? 'round'}
                    material={state.material}
                    reliefSource={state.reliefSource}
                    heightmapUrl={state.heightmapUrl}
                    displacementScale={state.displacementScale}
                    onBack={() => goTo(2)}
                    onOrder={handleOrder}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}
