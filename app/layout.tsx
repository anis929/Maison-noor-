import type { Metadata } from 'next'
import { Bricolage_Grotesque, Inter, Space_Mono } from 'next/font/google'
import { Navigation } from '@/components/navigation/Navigation'
import { Footer } from '@/components/footer/Footer'
import { CustomCursor } from '@/components/ui/CustomCursor'
import { PageTransition } from '@/components/ui/PageTransition'
import './globals.css'

const displayFont = Bricolage_Grotesque({
  subsets:  ['latin'],
  weight:   ['400', '500', '600', '700', '800'],
  variable: '--font-display',
  display:  'swap',
  preload:  true,
})

const sansFont = Inter({
  subsets:  ['latin'],
  weight:   ['300', '400', '500'],
  variable: '--font-sans',
  display:  'swap',
})

const monoFont = Space_Mono({
  subsets:  ['latin'],
  weight:   ['400', '700'],
  variable: '--font-mono',
  display:  'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://maisonnoor.com'),
  title: {
    default:  'Maison Noor — Lunetterie de Luxe sur Mesure',
    template: '%s | Maison Noor',
  },
  description:
    'Maison Noor cree des lunettes en corne de buffle facon nees a la main a Paris. Service Couture sur mesure et Collection en edition limitee.',
  openGraph: {
    type:        'website',
    locale:      'fr_FR',
    url:         'https://maisonnoor.com',
    siteName:    'Maison Noor',
    title:       'Maison Noor — Lunetterie de Luxe sur Mesure',
    description: 'Lunettes en corne de buffle façonnees a la main. Service Couture et Collection en edition limitee.',
  },
  twitter: {
    card:  'summary_large_image',
    title: 'Maison Noor — Lunetterie de Luxe',
  },
  robots: {
    index:  true,
    follow: true,
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="fr"
      className={`${displayFont.variable} ${sansFont.variable} ${monoFont.variable}`}
    >
      <body>
        <CustomCursor />
        <Navigation />
        <PageTransition>
          <main>{children}</main>
        </PageTransition>
        <Footer />
      </body>
    </html>
  )
}
