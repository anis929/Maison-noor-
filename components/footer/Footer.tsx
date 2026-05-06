'use client'

import Link from 'next/link'
import { Logo } from '@/components/ui/Logo'
import { MonoLabel } from '@/components/ui/MonoLabel'

const columns = [
  {
    heading: 'Maison',
    links:   [
      { href: '/maison',           label: 'Notre histoire' },
      { href: '/maison#manifeste', label: 'Le manifeste' },
      { href: '/maison#equipe',    label: 'Equipe' },
    ],
  },
  {
    heading: 'Service',
    links:   [
      { href: '/atelier',      label: 'Le service couture' },
      { href: '/rendez-vous',  label: 'Prendre rendez-vous' },
      { href: '/atelier#faq',  label: 'Questions frequentes' },
    ],
  },
  {
    heading: 'Collection',
    links:   [
      { href: '/collection',              label: 'Tous les modeles' },
      { href: '/collection?m=corne-buffle', label: 'Corne de buffle' },
      { href: '/collection?m=acetate',    label: 'Acetate' },
    ],
  },
  {
    heading: 'Contact',
    links:   [
      { href: '/contact',         label: 'Nous ecrire' },
      { href: '/rendez-vous',     label: 'Consultation' },
      { href: '/legal/mentions',  label: 'Mentions legales' },
    ],
  },
]

export function Footer() {
  return (
    <footer className="relative bg-noir-profond border-t border-white/5 overflow-hidden">
      {/* Watermark logo */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 font-display font-black text-[20vw] leading-none text-white/[0.03] whitespace-nowrap select-none"
      >
        MAISON NOOR
      </div>

      <div className="relative section-pad">
        {/* Top row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Logo size="sm" className="mb-4 block" />
            <p className="text-creme-os/50 text-sm leading-relaxed max-w-[22ch]">
              Une lunetterie de luxe, curatee pour l'exigence.
            </p>
            <MonoLabel className="block mt-6">Paris — Est. 2024</MonoLabel>
          </div>

          {/* Link columns */}
          {columns.map(col => (
            <div key={col.heading}>
              <MonoLabel className="block mb-5">{col.heading}</MonoLabel>
              <ul className="flex flex-col gap-3">
                {col.links.map(link => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-creme-os/50 hover:text-creme-os transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter */}
        <div className="border-t border-white/5 pt-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <MonoLabel className="block mb-1">Correspondance</MonoLabel>
            <p className="text-sm text-creme-os/40">Nouvelles de la maison, parutions, evenements.</p>
          </div>
          <form
            onSubmit={e => e.preventDefault()}
            className="flex gap-0 w-full md:w-auto"
          >
            <input
              type="email"
              placeholder="Votre adresse email"
              className="input-chrome flex-1 md:w-64"
              aria-label="Adresse email pour la newsletter"
            />
            <button
              type="submit"
              className="border border-l-0 border-chrome/25 px-6 py-3 font-mono text-[0.65rem] tracking-[0.18em] uppercase text-creme-os/60 hover:text-creme-os hover:border-orange-brule transition-colors duration-200 whitespace-nowrap"
            >
              S&apos;inscrire
            </button>
          </form>
        </div>

        {/* Bottom row */}
        <div className="border-t border-white/5 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <MonoLabel dim>© 2024 Maison Noor — Tous droits reserves</MonoLabel>
          <div className="flex gap-6">
            {[
              { href: '/legal/mentions',       label: 'Mentions legales' },
              { href: '/legal/confidentialite', label: 'Confidentialite' },
              { href: '/legal/cgv',            label: 'CGV' },
            ].map(link => (
              <Link key={link.href} href={link.href} className="text-[0.65rem] font-mono tracking-widest uppercase text-creme-os/30 hover:text-creme-os/60 transition-colors duration-200">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
