'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { HaloBackground } from '@/components/ui/HaloBackground'
import { ChromeButton } from '@/components/ui/ChromeButton'
import { MonoLabel } from '@/components/ui/MonoLabel'

export function HeroSection() {
  const titleRef    = useRef<HTMLHeadingElement>(null)
  const contentRef  = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'expo.out' } })

      tl.from('.hero-eyebrow', { opacity: 0, y: 20, duration: 0.8 }, 0.3)
        .from('.hero-line', {
          y: '110%',
          opacity: 0,
          duration: 1.1,
          stagger: 0.1,
        }, 0.5)
        .from('.hero-sub', { opacity: 0, y: 16, duration: 0.8 }, 1.0)
        .from('.hero-ctas', { opacity: 0, y: 16, duration: 0.8 }, 1.2)
        .from('.hero-scroll', { opacity: 0, duration: 0.6 }, 1.6)
    }, contentRef)

    return () => ctx.revert()
  }, [])

  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden">
      {/* Macro background — placeholder colour, replace with next/image */}
      <div className="absolute inset-0 bg-[linear-gradient(135deg,#1a0f08_0%,#0A0A0A_60%)]" />

      {/* Halo */}
      <HaloBackground position="top-right" intensity="high" />
      <HaloBackground position="bottom-left" intensity="low" />

      {/* Content */}
      <div ref={contentRef} className="relative z-10 section-pad pt-36">
        <MonoLabel className="hero-eyebrow block mb-8">Est. 2024 — Paris</MonoLabel>

        <h1
          ref={titleRef}
          className="font-display font-black leading-[0.92] tracking-tight text-creme-os mb-10 overflow-hidden"
          style={{ fontSize: 'clamp(4rem, 11vw, 10rem)' }}
        >
          <span className="hero-line block overflow-hidden">L'ART</span>
          <span className="hero-line block overflow-hidden pl-[12vw] text-orange-brule/90">DE VOIR</span>
          <span className="hero-line block overflow-hidden">AUTREMENT</span>
        </h1>

        <p className="hero-sub text-creme-os/55 text-base md:text-lg max-w-[46ch] leading-relaxed mb-10 font-light">
          Maison Noor cree des lunettes comme on compose un poeme —
          avec patience, matieres rares et la conviction que chaque detail compte.
        </p>

        <div className="hero-ctas flex flex-wrap gap-4">
          <ChromeButton href="/atelier" variant="filled" size="lg">
            Decouvrir l&apos;Atelier
          </ChromeButton>
          <ChromeButton href="/collection" variant="chrome" size="lg">
            La Collection
          </ChromeButton>
        </div>

        {/* Scroll hint */}
        <div className="hero-scroll absolute bottom-10 left-[5vw] flex items-center gap-4">
          <MonoLabel dim>Scroll</MonoLabel>
          <div className="w-12 h-px bg-chrome/30" />
        </div>
      </div>
    </section>
  )
}
