'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { MonoLabel } from '@/components/ui/MonoLabel'
import { DisplayHeading } from '@/components/ui/DisplayHeading'

gsap.registerPlugin(ScrollTrigger)

const steps = [
  {
    number:  '01',
    title:   'La Rencontre',
    body:    'Un premier echange par correspondance ou par telephone. Nous apprenons a vous connaitre — votre style, vos habitudes, la lumiere dans laquelle vous vivez. Chaque paire commence par une conversation.',
    keyword: 'Echange',
    detail:  'Consultation initiale · Gratuite',
  },
  {
    number:  '02',
    title:   'La Visite',
    body:    'Notre designer 3D se deplace a votre domicile. Scan morphologique du visage, prise de mesures milimetriques, observation de votre environnement. Le design commence par le lieu de vie.',
    keyword: 'Deplacement',
    detail:  'Paris et region parisienne · Sur accord elargi',
  },
  {
    number:  '03',
    title:   'Le Dessin',
    body:    'Trois propositions de forme, rendues en modélisation 3D photorealiste. Vous les portez virtuellement. Nous affinons ensemble jusqu\'a l\'exactitude.',
    keyword: 'Modelisation',
    detail:  'Livraison des propositions sous 10 jours',
  },
  {
    number:  '04',
    title:   'La Main',
    body:    'Un artisan façonne la corne brute selon vos specifications. Decoupage, chauffage, pliage, polissage — chaque geste transmis depuis des generations. La matiere resiste, puis cede, puis chante.',
    keyword: 'Façonnage',
    detail:  'Atelier Paris 10e · 6 a 8 semaines',
  },
  {
    number:  '05',
    title:   'La Livraison',
    body:    'La paire vous est remise en main propre, accompagnee de son certificat d\'authenticite numerote, d\'un etui en cuir pleine fleur et d\'une notice de soin gravee.',
    keyword: 'Remise',
    detail:  'Certificat numerote · Garantie 5 ans',
  },
]

export function StickyRitual() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const ctx = gsap.context(() => {
      steps.forEach((_, i) => {
        // Highlight active step number
        ScrollTrigger.create({
          trigger: `#step-${i}`,
          start:   'top 55%',
          end:     'bottom 45%',
          onEnter:     () => activateStep(i),
          onLeaveBack: () => deactivateStep(i),
        })

        // Image crossfade
        ScrollTrigger.create({
          trigger: `#step-${i}`,
          start:   'top 60%',
          end:     'bottom 40%',
          onEnter:     () => gsap.to(`#img-${i}`, { opacity: 1, duration: 0.5 }),
          onLeave:     () => gsap.to(`#img-${i}`, { opacity: 0, duration: 0.5 }),
          onEnterBack: () => gsap.to(`#img-${i}`, { opacity: 1, duration: 0.5 }),
          onLeaveBack: () => gsap.to(`#img-${i}`, { opacity: 0, duration: 0.5 }),
        })
      })

      function activateStep(i: number) {
        gsap.to(`#step-num-${i}`, { color: 'var(--orange-brule)', duration: 0.3 })
        gsap.to(`#step-bar-${i}`, { scaleX: 1, duration: 0.6, ease: 'expo.out' })
      }
      function deactivateStep(i: number) {
        gsap.to(`#step-num-${i}`, { color: 'rgba(232,220,196,0.2)', duration: 0.3 })
        gsap.to(`#step-bar-${i}`, { scaleX: 0, duration: 0.4 })
      }
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={containerRef} className="relative">
      <div className="flex flex-col md:flex-row">

        {/* Sticky image panel */}
        <div className="hidden md:block md:w-1/2 self-start sticky top-0 h-screen overflow-hidden">
          {/* Base gradient */}
          <div className="absolute inset-0 bg-[linear-gradient(135deg,#2B1810,#141414)]" />

          {/* Step images (cross-fade) */}
          {steps.map((step, i) => (
            <div
              key={step.number}
              id={`img-${i}`}
              className="absolute inset-0 flex items-center justify-center transition-none"
              style={{ opacity: i === 0 ? 1 : 0 }}
            >
              {/* Placeholder gradient — replace with <MacroImage> when photos available */}
              <div
                className="absolute inset-0"
                style={{
                  background: `radial-gradient(ellipse 60% 60% at ${30 + i * 10}% ${40 + i * 8}%, rgba(212,84,28,${0.08 + i * 0.03}) 0%, transparent 65%)`,
                }}
              />
              <div className="relative z-10 text-center px-12">
                <span className="font-display font-black text-[8rem] leading-none text-white/5 select-none">
                  {step.number}
                </span>
                <MonoLabel className="block mt-4 text-orange-brule/60">{step.keyword}</MonoLabel>
              </div>
            </div>
          ))}
        </div>

        {/* Scrolling steps */}
        <div className="md:w-1/2">
          {steps.map((step, i) => (
            <div
              key={step.number}
              id={`step-${i}`}
              className="min-h-screen flex flex-col justify-center px-10 md:px-16 py-24 border-b border-white/5 last:border-0"
            >
              {/* Number */}
              <span
                id={`step-num-${i}`}
                className="font-mono text-6xl font-bold leading-none mb-6 transition-none select-none"
                style={{ color: i === 0 ? 'var(--orange-brule)' : 'rgba(232,220,196,0.12)' }}
              >
                {step.number}
              </span>

              {/* Progress bar */}
              <div className="w-full h-px bg-white/5 mb-8 overflow-hidden">
                <div
                  id={`step-bar-${i}`}
                  className="h-full bg-orange-brule origin-left"
                  style={{ transform: i === 0 ? 'scaleX(1)' : 'scaleX(0)' }}
                />
              </div>

              <DisplayHeading as="h3" size="md" className="mb-6">
                {step.title}
              </DisplayHeading>

              <p className="text-creme-os/55 leading-relaxed text-base md:text-lg max-w-[42ch] mb-8 font-light">
                {step.body}
              </p>

              <MonoLabel dim>{step.detail}</MonoLabel>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
