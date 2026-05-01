import { ScrollReveal } from '@/components/ui/ScrollReveal'
import { MonoLabel } from '@/components/ui/MonoLabel'
import { DisplayHeading } from '@/components/ui/DisplayHeading'
import { HaloBackground } from '@/components/ui/HaloBackground'

const specs = [
  { key: 'Origine',    value: 'Inde du Sud · Elevage certifie' },
  { key: 'Epaisseur',  value: '4 a 6mm selon le modele' },
  { key: 'Finition',   value: 'Poli main · 12 etapes' },
  { key: 'Entretien',  value: 'Huile de noix · 1 fois par an' },
  { key: 'Longévite',  value: '20 a 30 ans minimum' },
]

export function MaterialSection() {
  return (
    <section className="relative overflow-hidden bg-corne-fonce/30 section-pad">
      <HaloBackground position="top-right" intensity="low" />

      <div className="relative z-10 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        {/* Image area */}
        <ScrollReveal>
          <div className="aspect-[3/4] relative overflow-hidden grain-overlay">
            {/* Placeholder gradient — replace with macro photo of horn */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_80%_at_40%_50%,#6B4423_0%,#2B1810_60%,#0A0A0A_100%)]" />
            <div className="absolute bottom-6 left-6">
              <MonoLabel dim>Corne de buffle brute — detail de veinage</MonoLabel>
            </div>
          </div>
        </ScrollReveal>

        {/* Text */}
        <div>
          <ScrollReveal>
            <MonoLabel className="block mb-6">La Matiere</MonoLabel>
            <DisplayHeading as="h2" size="lg" className="mb-8">
              La Corne<br /><span className="text-orange-brule/80">de Buffle</span>
            </DisplayHeading>
          </ScrollReveal>

          <ScrollReveal delay={100}>
            <p className="text-creme-os/55 leading-relaxed mb-8 text-base md:text-lg font-light">
              La corne de buffle est l&apos;une des rares matieres que le temps embellit.
              Chaque plaque est unique — ses veines, ses nuances, ses imperfections nobles
              racontent l&apos;histoire d&apos;un animal et d&apos;un terroir.
            </p>
            <p className="text-creme-os/40 leading-relaxed mb-10 text-sm font-light">
              Nous travaillons exclusivement avec des fournisseurs certifies par l&apos;UICN.
              La corne utilisee est un sous-produit de l&apos;elevage alimentaire — aucun abattage
              specifique n&apos;est pratique pour notre filiere.
            </p>
          </ScrollReveal>

          {/* Specs table */}
          <ScrollReveal delay={150}>
            <div className="border-t border-white/8">
              {specs.map(({ key, value }) => (
                <div key={key} className="flex justify-between items-center py-4 border-b border-white/5">
                  <MonoLabel dim>{key}</MonoLabel>
                  <span className="font-mono text-xs text-creme-os/70 text-right">{value}</span>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  )
}
