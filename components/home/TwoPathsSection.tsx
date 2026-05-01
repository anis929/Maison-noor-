'use client'

import Link from 'next/link'
import { useState } from 'react'
import { DisplayHeading } from '@/components/ui/DisplayHeading'
import { MonoLabel } from '@/components/ui/MonoLabel'
import { cn } from '@/lib/utils'

export function TwoPathsSection() {
  const [hovered, setHovered] = useState<'atelier' | 'collection' | null>(null)

  return (
    <section className="relative flex flex-col md:flex-row min-h-screen">
      {/* Left — Atelier */}
      <Link
        href="/atelier"
        className={cn(
          'group relative flex-1 flex flex-col justify-end p-10 md:p-16 min-h-[50vh] md:min-h-screen overflow-hidden transition-all duration-700',
          hovered === 'collection' ? 'md:flex-[0.4]' : 'md:flex-1',
        )}
        onMouseEnter={() => setHovered('atelier')}
        onMouseLeave={() => setHovered(null)}
      >
        {/* Background */}
        <div className="absolute inset-0 bg-[linear-gradient(145deg,#2B1810_0%,#1a0e08_100%)] transition-all duration-700 group-hover:brightness-110" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_70%_at_80%_20%,rgba(212,84,28,0.18)_0%,transparent_65%)]" />

        {/* Content */}
        <div className="relative z-10">
          <MonoLabel className="block mb-4 opacity-70">01</MonoLabel>
          <DisplayHeading as="h2" size="lg" className="mb-4 group-hover:text-creme-pale transition-colors duration-300">
            LE SERVICE<br />COUTURE
          </DisplayHeading>
          <p className="text-creme-os/50 text-sm max-w-[32ch] leading-relaxed mb-8">
            Un designer 3D se deplace chez vous. La corne de buffle prend votre forme. Une seule paire au monde.
          </p>
          <div className="flex items-center gap-3 text-orange-brule font-mono text-xs tracking-[0.2em] uppercase">
            <span>Decouvrir l&apos;atelier</span>
            <span className="transition-transform duration-300 group-hover:translate-x-2">→</span>
          </div>
        </div>

        {/* Bottom line */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-white/5" />
        <div className="absolute bottom-0 left-0 h-px bg-orange-brule transition-all duration-700 group-hover:right-0 right-full" />
      </Link>

      {/* Divider */}
      <div className="hidden md:block w-px bg-white/8 flex-shrink-0" />

      {/* Right — Collection */}
      <Link
        href="/collection"
        className={cn(
          'group relative flex-1 flex flex-col justify-end p-10 md:p-16 min-h-[50vh] md:min-h-screen overflow-hidden transition-all duration-700',
          hovered === 'atelier' ? 'md:flex-[0.4]' : 'md:flex-1',
        )}
        onMouseEnter={() => setHovered('collection')}
        onMouseLeave={() => setHovered(null)}
      >
        {/* Background */}
        <div className="absolute inset-0 bg-[linear-gradient(145deg,#141414_0%,#0d0d0d_100%)] transition-all duration-700 group-hover:brightness-110" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_30%_70%,rgba(200,200,204,0.04)_0%,transparent_65%)]" />

        {/* Placeholder product visual */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-36 opacity-20 group-hover:opacity-35 transition-opacity duration-700">
          <div className="w-full h-full border border-chrome/20 rounded-sm bg-gradient-to-br from-chrome/5 to-transparent" />
        </div>

        {/* Content */}
        <div className="relative z-10">
          <MonoLabel className="block mb-4 opacity-70">02</MonoLabel>
          <DisplayHeading as="h2" size="lg" className="mb-4 group-hover:text-creme-pale transition-colors duration-300">
            LA<br />COLLECTION
          </DisplayHeading>
          <p className="text-creme-os/50 text-sm max-w-[32ch] leading-relaxed mb-8">
            Editions limitees en acétate, corne et metaux precieux. Façonnees a la main, numérotees et certifiées.
          </p>
          <div className="flex items-center gap-3 text-chrome font-mono text-xs tracking-[0.2em] uppercase">
            <span>Explorer la collection</span>
            <span className="transition-transform duration-300 group-hover:translate-x-2">→</span>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-px bg-white/5" />
        <div className="absolute bottom-0 left-0 h-px bg-chrome/40 transition-all duration-700 group-hover:right-0 right-full" />
      </Link>
    </section>
  )
}
