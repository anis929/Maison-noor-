import { ChromeButton } from '@/components/ui/ChromeButton'
import { MonoLabel } from '@/components/ui/MonoLabel'
import { DisplayHeading } from '@/components/ui/DisplayHeading'

export default function NotFound() {
  return (
    <section className="min-h-screen flex items-center justify-center section-pad">
      <div className="text-center">
        <MonoLabel dim className="block mb-6">404</MonoLabel>
        <DisplayHeading as="h1" size="xl" className="mb-6">
          Page introuvable
        </DisplayHeading>
        <p className="text-creme-os/40 mb-10 font-light max-w-[36ch] mx-auto">
          La page que vous cherchez n&apos;existe pas ou a ete deplacee.
        </p>
        <ChromeButton href="/" variant="chrome">Retour a l&apos;accueil</ChromeButton>
      </div>
    </section>
  )
}
