import { HaloBackground } from '@/components/ui/HaloBackground'
import { ScrollReveal } from '@/components/ui/ScrollReveal'
import { MonoLabel } from '@/components/ui/MonoLabel'

export function ManifestoSection() {
  return (
    <section className="relative overflow-hidden py-32 md:py-48 bg-noir-profond">
      <HaloBackground position="center" intensity="low" />

      <div className="relative z-10 px-6 md:px-16 max-w-6xl mx-auto">
        <ScrollReveal>
          <MonoLabel className="block mb-10 text-center">Manifeste</MonoLabel>
        </ScrollReveal>

        <ScrollReveal delay={100}>
          <blockquote
            className="font-display font-black leading-[0.92] tracking-tight text-creme-os text-center"
            style={{ fontSize: 'clamp(2.5rem, 6vw, 6rem)' }}
          >
            <span className="block">La corne de buffle est l&apos;une</span>
            <span className="block text-orange-brule/85">des rares matieres</span>
            <span className="block">que le temps embellit.</span>
          </blockquote>
        </ScrollReveal>

        <ScrollReveal delay={200}>
          <p className="text-center text-creme-os/45 text-base md:text-lg leading-relaxed mt-10 max-w-[52ch] mx-auto font-light">
            Chaque paire porte la trace de son origine et de la main qui l&apos;a façonnee.
            Nous ne fabriquons pas des lunettes — nous creeons des objets qui traversent le temps.
          </p>
        </ScrollReveal>
      </div>
    </section>
  )
}
