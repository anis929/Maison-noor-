import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Configurateur 3D | Maison Noor',
  description: 'Personnalisez votre monture avec un relief unique — géographique, photo ou texture.',
  robots: { index: false },
}

// Full-screen layout — wraps the global layout (nav/footer are hidden by the
// configurator's fixed overlay with z-[1000])
export default function ConfigurateurLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
