import type { Metadata } from 'next'
import { DisplayHeading } from '@/components/ui/DisplayHeading'
import { MonoLabel } from '@/components/ui/MonoLabel'
import { ScrollReveal } from '@/components/ui/ScrollReveal'
import { HaloBackground } from '@/components/ui/HaloBackground'

export const metadata: Metadata = {
  title:       'La Maison — Notre Histoire',
  description: 'L\'histoire de Maison Noor, notre philosophie de la matiere, notre engagement pour l\'artisanat et la transmission.',
}

const team = [
  { name: 'Yasmine Noor',     role: 'Fondatrice & Directrice Artistique' },
  { name: 'Karim El Masri',   role: 'Designer 3D & Responsable Atelier' },
  { name: 'Claire Beaumont',  role: 'Relations Clientele & Couture' },
  { name: 'Hamid Aït Oufella', role: 'Artisan Lenticulaire, Corne' },
]

export default function MaisonPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[70vh] flex flex-col justify-end section-pad pt-36 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(160deg,#1a0a04_0%,#0A0A0A_70%)]" />
        <HaloBackground position="top-right" intensity="low" />
        <div className="relative z-10">
          <ScrollReveal>
            <MonoLabel className="block mb-6">Est. 2024 — Paris</MonoLabel>
          </ScrollReveal>
          <DisplayHeading as="h1" size="monument" className="mb-0">
            LA MAISON
          </DisplayHeading>
        </div>
      </section>

      {/* Origin story */}
      <section className="section-pad border-t border-white/5">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
          <ScrollReveal>
            <MonoLabel className="block mb-6">Notre Histoire</MonoLabel>
            <h2 className="font-display font-black text-4xl md:text-5xl text-creme-os mb-8 leading-none">
              Nee d&apos;une<br />conviction
            </h2>
          </ScrollReveal>

          <ScrollReveal delay={100}>
            <p className="text-creme-os/55 text-base md:text-lg leading-relaxed mb-6 font-light">
              Maison Noor est nee de la conviction qu&apos;une paire de lunettes peut etre
              un objet de toute une vie — pas une accessoire de saison, mais une piece
              qui se bonifie avec le temps, comme la corne dont elle est faite.
            </p>
            <p className="text-creme-os/40 text-base leading-relaxed mb-6 font-light">
              Fondee en 2024 par Yasmine Noor, ancienne directrice de creation pour
              plusieurs maisons de haute joaillerie parisiennes, Maison Noor reunit
              trois metiers rarement associes : le design 3D de precision, l&apos;artisanat
              de la corne, et la couture du regard.
            </p>
            <p className="text-creme-os/40 text-base leading-relaxed font-light">
              Nous ne vendons pas des lunettes. Nous créeons des instruments optiques
              d&apos;une generation a l&apos;autre.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Values */}
      <section className="section-pad bg-noir-doux border-t border-white/5" id="manifeste">
        <div className="max-w-6xl mx-auto">
          <ScrollReveal>
            <MonoLabel className="block mb-12 text-center">Nos Engagements</MonoLabel>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                num:   '01',
                title: 'La Matiere d\'abord',
                body:  'Chaque matiere que nous utilisons a une origine traçable, une ethique d\'approvisionnement et une durabilite prouvee.',
              },
              {
                num:   '02',
                title: 'Le Geste avant la Serie',
                body:  'Nous limitons nos editions parce que la main humaine a ses limites — et que ces limites sont une qualite, pas un defaut.',
              },
              {
                num:   '03',
                title: 'La Transmission',
                body:  'Nous formons un apprenti lenticulaire par an. Le savoir-faire de la corne ne doit pas disparaitre avec notre generation.',
              },
            ].map(v => (
              <ScrollReveal key={v.num} delay={parseInt(v.num) * 80}>
                <div className="border-t border-white/8 pt-6">
                  <MonoLabel dim className="block mb-4">{v.num}</MonoLabel>
                  <h3 className="font-display font-black text-2xl text-creme-os mb-4 leading-tight">{v.title}</h3>
                  <p className="text-creme-os/45 text-sm leading-relaxed font-light">{v.body}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Atelier photos */}
      <section className="section-pad">
        <ScrollReveal>
          <MonoLabel className="block mb-8">L&apos;Atelier</MonoLabel>
        </ScrollReveal>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            'bg-[linear-gradient(135deg,#2B1810,#6B4423)]',
            'bg-[linear-gradient(145deg,#141414,#2B1810)]',
            'bg-[linear-gradient(120deg,#6B4423,#A67C52)]',
            'bg-[linear-gradient(160deg,#0A0A0A,#2B1810)]',
          ].map((bg, i) => (
            <ScrollReveal key={i} delay={i * 60}>
              <div className={`aspect-square ${bg} grain-overlay`} />
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* Team */}
      <section className="section-pad bg-noir-doux border-t border-white/5" id="equipe">
        <div className="max-w-4xl mx-auto">
          <ScrollReveal>
            <MonoLabel className="block mb-12">L&apos;Equipe</MonoLabel>
          </ScrollReveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {team.map((member, i) => (
              <ScrollReveal key={member.name} delay={i * 70}>
                <div className="flex items-center gap-6 border border-white/6 p-6 hover:border-white/12 transition-colors duration-200">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-corne-medium to-corne-fonce flex-shrink-0" />
                  <div>
                    <p className="font-display font-black text-xl text-creme-os leading-tight">{member.name}</p>
                    <MonoLabel dim className="block mt-1">{member.role}</MonoLabel>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
