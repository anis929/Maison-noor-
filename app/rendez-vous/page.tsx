'use client'

import { useState } from 'react'
import { DisplayHeading } from '@/components/ui/DisplayHeading'
import { MonoLabel } from '@/components/ui/MonoLabel'
import { ChromeButton } from '@/components/ui/ChromeButton'
import { ScrollReveal } from '@/components/ui/ScrollReveal'

const steps = ['Coordonnees', 'Localisation', 'Preferences', 'Disponibilites', 'Message']

export default function RendezVousPage() {
  const [step,      setStep]      = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const [form,      setForm]      = useState({
    nom: '', email: '', tel: '',
    ville: '', deplacement: '',
    style: '', matieres: '', budget: '',
    disponibilites: '',
    message: '',
  })

  const update = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [field]: e.target.value }))

  const next = () => setStep(s => Math.min(s + 1, steps.length - 1))
  const prev = () => setStep(s => Math.max(s - 1, 0))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <section className="min-h-screen flex items-center justify-center section-pad pt-36">
        <div className="text-center max-w-lg">
          <MonoLabel className="block mb-6">Demande reçue</MonoLabel>
          <DisplayHeading as="h1" size="lg" className="mb-6">
            Merci,<br /><span className="text-orange-brule/85">nous vous contactons.</span>
          </DisplayHeading>
          <p className="text-creme-os/50 leading-relaxed mb-10 font-light">
            Notre equipe prendra contact avec vous dans les 48 heures pour confirmer
            votre rendez-vous et repondre a vos questions.
          </p>
          <ChromeButton href="/" variant="chrome">Retour a l&apos;accueil</ChromeButton>
        </div>
      </section>
    )
  }

  return (
    <>
      {/* Header */}
      <section className="section-pad pt-36 pb-0">
        <ScrollReveal>
          <MonoLabel className="block mb-4">Service Couture</MonoLabel>
          <DisplayHeading as="h1" size="xl" className="mb-4">
            Rendez-vous
          </DisplayHeading>
          <p className="text-creme-os/45 text-base max-w-[44ch] font-light leading-relaxed">
            Remplissez ce formulaire pour initier votre consultation.
            <em className="block mt-2 not-italic text-creme-os/30 font-mono text-xs tracking-[0.15em] uppercase">
              Sur consultation — Devis personnalise apres echange.
            </em>
          </p>
        </ScrollReveal>
      </section>

      {/* Progress bar */}
      <div className="px-6 md:px-10 py-8">
        <div className="flex items-center gap-3 max-w-2xl">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center gap-3 flex-1 last:flex-none">
              <div className="flex flex-col items-center gap-1">
                <div className={`w-6 h-6 rounded-full border flex items-center justify-center font-mono text-[0.6rem] transition-colors duration-300 ${i <= step ? 'border-orange-brule text-orange-brule' : 'border-white/15 text-creme-os/20'}`}>
                  {i < step ? '✓' : i + 1}
                </div>
                <MonoLabel dim className="hidden sm:block text-[0.55rem]">{s}</MonoLabel>
              </div>
              {i < steps.length - 1 && (
                <div className="flex-1 h-px mb-5 bg-white/8">
                  <div className={`h-full bg-orange-brule transition-all duration-500 ${i < step ? 'w-full' : 'w-0'}`} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Form */}
      <section className="section-pad pt-0 pb-24">
        <form onSubmit={handleSubmit} className="max-w-2xl space-y-8">

          {/* Step 0 — Coordonnees */}
          {step === 0 && (
            <div className="space-y-4">
              <MonoLabel className="block mb-6">01 — Coordonnees</MonoLabel>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="block">
                  <MonoLabel dim className="block mb-2">Nom complet</MonoLabel>
                  <input className="input-chrome" type="text" required value={form.nom} onChange={update('nom')} placeholder="Votre nom" />
                </label>
                <label className="block">
                  <MonoLabel dim className="block mb-2">Telephone</MonoLabel>
                  <input className="input-chrome" type="tel" value={form.tel} onChange={update('tel')} placeholder="+33 6 00 00 00 00" />
                </label>
              </div>
              <label className="block">
                <MonoLabel dim className="block mb-2">Adresse email</MonoLabel>
                <input className="input-chrome" type="email" required value={form.email} onChange={update('email')} placeholder="votre@email.com" />
              </label>
            </div>
          )}

          {/* Step 1 — Localisation */}
          {step === 1 && (
            <div className="space-y-4">
              <MonoLabel className="block mb-6">02 — Localisation</MonoLabel>
              <label className="block">
                <MonoLabel dim className="block mb-2">Ville / Code postal</MonoLabel>
                <input className="input-chrome" type="text" value={form.ville} onChange={update('ville')} placeholder="Paris, 75010" />
              </label>
              <label className="block">
                <MonoLabel dim className="block mb-2">Deplacement souhaite</MonoLabel>
                <select className="input-chrome" value={form.deplacement} onChange={update('deplacement')}>
                  <option value="">Selectionner</option>
                  <option value="domicile">A mon domicile</option>
                  <option value="bureau">Sur mon lieu de travail</option>
                  <option value="atelier">En atelier (Paris 10e)</option>
                  <option value="autre">Autre</option>
                </select>
              </label>
            </div>
          )}

          {/* Step 2 — Preferences */}
          {step === 2 && (
            <div className="space-y-4">
              <MonoLabel className="block mb-6">03 — Preferences</MonoLabel>
              <label className="block">
                <MonoLabel dim className="block mb-2">Style recherche</MonoLabel>
                <input className="input-chrome" type="text" value={form.style} onChange={update('style')} placeholder="Geometrique, classique, avant-garde..." />
              </label>
              <label className="block">
                <MonoLabel dim className="block mb-2">Matieres souhaitees</MonoLabel>
                <input className="input-chrome" type="text" value={form.matieres} onChange={update('matieres')} placeholder="Corne, acetate, titane..." />
              </label>
              <label className="block">
                <MonoLabel dim className="block mb-2">Budget envisage (optionnel)</MonoLabel>
                <select className="input-chrome" value={form.budget} onChange={update('budget')}>
                  <option value="">Prefere ne pas preciser</option>
                  <option value="3000-5000">3 000 — 5 000 €</option>
                  <option value="5000-8000">5 000 — 8 000 €</option>
                  <option value="8000+">8 000 € et plus</option>
                </select>
              </label>
            </div>
          )}

          {/* Step 3 — Disponibilites */}
          {step === 3 && (
            <div className="space-y-4">
              <MonoLabel className="block mb-6">04 — Disponibilites</MonoLabel>
              <label className="block">
                <MonoLabel dim className="block mb-2">Plages horaires preferees</MonoLabel>
                <textarea className="input-chrome" value={form.disponibilites} onChange={update('disponibilites')} placeholder="Ex : Lundi-Vendredi, 10h-18h" />
              </label>
            </div>
          )}

          {/* Step 4 — Message */}
          {step === 4 && (
            <div className="space-y-4">
              <MonoLabel className="block mb-6">05 — Message libre</MonoLabel>
              <label className="block">
                <MonoLabel dim className="block mb-2">Votre message</MonoLabel>
                <textarea className="input-chrome min-h-[180px]" value={form.message} onChange={update('message')} placeholder="Parlez-nous de votre vision, d'une reference, d'une occasion particuliere..." />
              </label>
            </div>
          )}

          {/* Navigation */}
          <div className="flex gap-4 pt-4">
            {step > 0 && (
              <ChromeButton type="button" variant="ghost" onClick={prev}>
                Precedent
              </ChromeButton>
            )}
            {step < steps.length - 1 ? (
              <ChromeButton type="button" variant="chrome" onClick={next}>
                Suivant →
              </ChromeButton>
            ) : (
              <ChromeButton type="submit" variant="filled" size="lg">
                Envoyer la demande
              </ChromeButton>
            )}
          </div>
        </form>
      </section>
    </>
  )
}
