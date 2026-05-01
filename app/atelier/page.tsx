import type { Metadata } from 'next'
import { StickyRitual } from '@/components/atelier/StickyRitual'
import { MaterialSection } from '@/components/atelier/MaterialSection'
import { PiecesGallery } from '@/components/atelier/PiecesGallery'
import { HaloBackground } from '@/components/ui/HaloBackground'
import { ChromeButton } from '@/components/ui/ChromeButton'
import { ScrollReveal } from '@/components/ui/ScrollReveal'
import { MonoLabel } from '@/components/ui/MonoLabel'

export const metadata: Metadata = {
  title:       'L\'Atelier — Le Service Couture',
  description: 'Un designer 3D se deplace a votre domicile pour creer une paire de lunettes unique en corne de buffle. Experience ultra-premium sur mesure.',
}

export default function AtelierPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative min-h-screen flex flex-col justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(160deg,#2B1810_0%,#141414_50%,#0A0A0A_100%)]" />
        <HaloBackground position="top" intensity="medium" />

        <div className="relative z-10 section-pad pt-36">
          <ScrollReveal>
            <MonoLabel className="block mb-8">Service Couture · Sur mesure</MonoLabel>
          </ScrollReveal>

          <h1
            className="font-display font-black leading-[0.92] tracking-tight text-creme-os mb-10"
            style={{ fontSize: 'clamp(3.5rem, 10vw, 9rem)' }}
          >
            <span className="block">UNE PAIRE.</span>
            <span className="block text-orange-brule/85">UNE VIE.</span>
          </h1>

          <ScrollReveal delay={100}>
            <p className="text-creme-os/50 text-lg leading-relaxed max-w-[44ch] mb-12 font-light">
              Le designer vient a vous. La corne devient vous.
              Chaque paire est une pièce unique, façonnee autour de votre morphologie
              et de l&apos;histoire de votre regard.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={150}>
            <ChromeButton href="/rendez-vous" variant="chrome" size="lg">
              Prendre rendez-vous →
            </ChromeButton>
          </ScrollReveal>
        </div>

        {/* Scroll cue */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3">
          <MonoLabel dim>Le rituel</MonoLabel>
          <div className="w-px h-16 bg-gradient-to-b from-chrome/30 to-transparent" />
        </div>
      </section>

      {/* Sticky 5-step ritual */}
      <StickyRitual />

      {/* Material section */}
      <MaterialSection />

      {/* Pieces gallery */}
      <PiecesGallery />

      {/* Testimonial */}
      <section className="section-pad bg-noir-profond border-t border-white/5">
        <div className="max-w-4xl mx-auto text-center">
          <ScrollReveal>
            <MonoLabel dim className="block mb-10">Temoignage</MonoLabel>
            <blockquote
              className="font-display font-black text-creme-os leading-[0.95] mb-10"
              style={{ fontSize: 'clamp(2rem, 5vw, 4.5rem)' }}
            >
              &ldquo;La seule paire que j&apos;aie jamais oubliee de porter —
              parce qu&apos;elle fait partie de moi.&rdquo;
            </blockquote>
            <MonoLabel dim>Client anonyme · Paris · 2024</MonoLabel>
          </ScrollReveal>
        </div>
      </section>

      {/* Final CTA */}
      <section className="section-pad relative overflow-hidden bg-noir-doux">
        <HaloBackground position="center" intensity="low" />
        <div className="relative z-10 text-center">
          <ScrollReveal>
            <h2 className="font-display font-black text-4xl md:text-6xl text-creme-os mb-8 leading-none">
              Commencez<br />Votre Histoire
            </h2>
            <p className="text-creme-os/45 mb-10 text-base max-w-[36ch] mx-auto font-light">
              Sur consultation. Devis personnalise apres echange.
              Deplacement inclus en Ile-de-France.
            </p>
            <ChromeButton href="/rendez-vous" variant="filled" size="lg">
              Reserver une consultation
            </ChromeButton>
          </ScrollReveal>
        </div>
      </section>
    </>
  )
}
