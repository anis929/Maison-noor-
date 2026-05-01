import type { Metadata } from 'next'
import { HeroSection } from '@/components/home/HeroSection'
import { TwoPathsSection } from '@/components/home/TwoPathsSection'
import { ManifestoSection } from '@/components/home/ManifestoSection'
import { ScrollReveal } from '@/components/ui/ScrollReveal'
import { ChromeButton } from '@/components/ui/ChromeButton'
import { MonoLabel } from '@/components/ui/MonoLabel'

export const metadata: Metadata = {
  title:       'Maison Noor — L\'Art de Voir Autrement',
  description: 'Lunetterie de luxe française. Service Couture sur mesure et Collection en corne de buffle, acetate et metaux precieux.',
}

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <TwoPathsSection />
      <ManifestoSection />

      {/* Featured collection teaser */}
      <section className="section-pad bg-noir-doux border-t border-white/5">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-start md:items-end justify-between gap-8">
          <div>
            <ScrollReveal>
              <MonoLabel className="block mb-4">Nouveautes</MonoLabel>
              <h2 className="font-display font-black text-5xl md:text-6xl text-creme-os leading-none">
                La Collection<br /><span className="text-orange-brule/80">2024</span>
              </h2>
            </ScrollReveal>
          </div>
          <ScrollReveal delay={100}>
            <ChromeButton href="/collection" variant="chrome" size="lg">
              Explorer →
            </ChromeButton>
          </ScrollReveal>
        </div>

        {/* Horizontal scrolling preview strip */}
        <div className="mt-12 flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
          {[1, 2, 3, 4].map(i => (
            <div
              key={i}
              className="flex-shrink-0 w-64 aspect-square bg-gradient-to-br from-corne-fonce to-noir-profond grain-overlay relative"
            >
              <div className="absolute inset-0 flex items-end p-5">
                <MonoLabel dim>NOOR {String(i).padStart(2, '0')}</MonoLabel>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Service couture teaser */}
      <section className="section-pad relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_20%_50%,rgba(43,24,16,0.8)_0%,transparent_70%)]" />
        <div className="relative z-10 max-w-3xl">
          <ScrollReveal>
            <MonoLabel className="block mb-6">Service Couture</MonoLabel>
            <h2 className="font-display font-black leading-[0.93] tracking-tight text-creme-os mb-8"
              style={{ fontSize: 'clamp(3rem, 7vw, 6rem)' }}>
              UNE PAIRE.<br />
              <span className="text-orange-brule/85">UNE VIE.</span>
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <p className="text-creme-os/50 text-base md:text-lg leading-relaxed mb-10 max-w-[44ch] font-light">
              Le designer vient a vous. La corne devient vous. Une seule paire au monde,
              façonnee selon la morphologie de votre visage et l&apos;histoire de votre regard.
            </p>
            <ChromeButton href="/atelier" variant="chrome">Decouvrir le service →</ChromeButton>
          </ScrollReveal>
        </div>
      </section>
    </>
  )
}
