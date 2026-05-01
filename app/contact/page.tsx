'use client'

import { useState } from 'react'
import type { Metadata } from 'next'
import { DisplayHeading } from '@/components/ui/DisplayHeading'
import { MonoLabel } from '@/components/ui/MonoLabel'
import { ChromeButton } from '@/components/ui/ChromeButton'
import { ScrollReveal } from '@/components/ui/ScrollReveal'

export default function ContactPage() {
  const [sent, setSent] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSent(true)
  }

  if (sent) {
    return (
      <section className="min-h-screen flex items-center justify-center section-pad pt-36">
        <div className="text-center max-w-md">
          <MonoLabel className="block mb-6">Message envoye</MonoLabel>
          <DisplayHeading as="h1" size="lg" className="mb-6">
            Nous vous<br /><span className="text-orange-brule/85">repondons sous 48h.</span>
          </DisplayHeading>
          <ChromeButton href="/" variant="chrome">Retour a l&apos;accueil</ChromeButton>
        </div>
      </section>
    )
  }

  return (
    <>
      <section className="section-pad pt-36">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16">
          {/* Left */}
          <div>
            <ScrollReveal>
              <MonoLabel className="block mb-6">Nous Ecrire</MonoLabel>
              <DisplayHeading as="h1" size="lg" className="mb-8">
                Contact
              </DisplayHeading>
            </ScrollReveal>
            <ScrollReveal delay={80}>
              <div className="space-y-6">
                {[
                  { key: 'Email',    val: 'hello@maisonnoor.com' },
                  { key: 'Atelier', val: 'Paris 10e — Sur rendez-vous' },
                  { key: 'Presse',  val: 'presse@maisonnoor.com' },
                ].map(({ key, val }) => (
                  <div key={key} className="border-b border-white/5 pb-4">
                    <MonoLabel dim className="block mb-1">{key}</MonoLabel>
                    <p className="text-creme-os/70 text-sm">{val}</p>
                  </div>
                ))}
              </div>
            </ScrollReveal>
          </div>

          {/* Right — form */}
          <ScrollReveal delay={100}>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <label>
                  <MonoLabel dim className="block mb-2">Nom</MonoLabel>
                  <input className="input-chrome" type="text" required placeholder="Votre nom" />
                </label>
                <label>
                  <MonoLabel dim className="block mb-2">Email</MonoLabel>
                  <input className="input-chrome" type="email" required placeholder="email@domain.com" />
                </label>
              </div>
              <label>
                <MonoLabel dim className="block mb-2">Sujet</MonoLabel>
                <select className="input-chrome">
                  <option value="">Selectionner</option>
                  <option>Service Couture</option>
                  <option>Collection</option>
                  <option>Presse &amp; Media</option>
                  <option>Autre</option>
                </select>
              </label>
              <label>
                <MonoLabel dim className="block mb-2">Message</MonoLabel>
                <textarea className="input-chrome" rows={5} placeholder="Votre message..." />
              </label>
              <ChromeButton type="submit" variant="filled" size="lg">
                Envoyer
              </ChromeButton>
            </form>
          </ScrollReveal>
        </div>
      </section>
    </>
  )
}
