import type { Metadata } from 'next'
import { MonoLabel } from '@/components/ui/MonoLabel'
import { DisplayHeading } from '@/components/ui/DisplayHeading'

export const metadata: Metadata = {
  title:  'Mentions legales',
  robots: { index: false },
}

export default function LegalPage() {
  return (
    <section className="section-pad pt-36 max-w-3xl">
      <MonoLabel className="block mb-6">Documents legaux</MonoLabel>
      <DisplayHeading as="h1" size="md" className="mb-12">
        Mentions Legales
      </DisplayHeading>

      {[
        {
          title: 'Editeur du site',
          body: 'Maison Noor SAS — Capital social 10 000 € — RCS Paris 000 000 000\nSiege social : Paris 10e, France\nDirectrice de la publication : Yasmine Noor\nContact : hello@maisonnoor.com',
        },
        {
          title: 'Hebergement',
          body: 'Vercel Inc. — 340 Pine Street, Suite 1202, San Francisco CA 94104, USA.',
        },
        {
          title: 'Propriete intellectuelle',
          body: 'L\'ensemble du contenu de ce site (textes, photographies, maquettes, logos) est la propriete exclusive de Maison Noor SAS et est protege par le droit d\'auteur. Toute reproduction, meme partielle, est interdite sans autorisation ecrite prealable.',
        },
        {
          title: 'Donnees personnelles',
          body: 'Conformement au RGPD, vous disposez d\'un droit d\'acces, de rectification et de suppression de vos donnees. Pour exercer ce droit : hello@maisonnoor.com. Responsable de traitement : Maison Noor SAS.',
        },
        {
          title: 'Cookies',
          body: 'Ce site utilise des cookies strictement necessaires a son fonctionnement. Aucun cookie publicitaire ou de tracking tiers n\'est utilise.',
        },
      ].map(section => (
        <div key={section.title} className="border-t border-white/8 py-8">
          <MonoLabel className="block mb-4">{section.title}</MonoLabel>
          <p className="text-creme-os/50 text-sm leading-relaxed font-light whitespace-pre-line">
            {section.body}
          </p>
        </div>
      ))}
    </section>
  )
}
