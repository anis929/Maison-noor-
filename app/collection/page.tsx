import type { Metadata } from 'next'
import { Suspense } from 'react'
import { ProductCard } from '@/components/collection/ProductCard'
import { ProductFilters } from '@/components/collection/ProductFilters'
import { ChromeButton } from '@/components/ui/ChromeButton'
import { ScrollReveal } from '@/components/ui/ScrollReveal'
import { MonoLabel } from '@/components/ui/MonoLabel'
import { products } from '@/data/products'
import type { ProductCategory, ProductGender, ProductMaterial, ProductShape } from '@/types'

export const metadata: Metadata = {
  title:       'La Collection',
  description: 'Editions limitees en corne de buffle, acetate haut de gamme et metaux precieux. Chaque modele est façonne a la main et numerote.',
}

interface CollectionPageProps {
  searchParams: {
    m?:     string
    forme?: string
    genre?: string
    cat?:   string
  }
}

export default function CollectionPage({ searchParams }: CollectionPageProps) {
  const filtered = products.filter(p => {
    if (searchParams.m     && p.material !== searchParams.m)  return false
    if (searchParams.forme && p.shape    !== searchParams.forme) return false
    if (searchParams.genre && p.gender   !== searchParams.genre) return false
    if (searchParams.cat   && p.category !== searchParams.cat)   return false
    return true
  })

  return (
    <>
      {/* Header */}
      <section className="section-pad pt-36 pb-0">
        <ScrollReveal>
          <MonoLabel className="block mb-4">{filtered.length} modeles</MonoLabel>
          <h1 className="font-display font-black leading-none text-creme-os mb-4"
            style={{ fontSize: 'clamp(4rem, 10vw, 8rem)' }}>
            LA COLLECTION
          </h1>
          <p className="text-creme-os/45 text-base md:text-lg max-w-[52ch] font-light leading-relaxed">
            Editions limitees, façonnees a la main. Chaque piece est numerotee
            et accompagnee de son certificat d&apos;authenticite.
          </p>
        </ScrollReveal>
      </section>

      {/* Filters + Grid */}
      <section className="section-pad pt-12">
        <Suspense>
          <ProductFilters />
        </Suspense>

        {filtered.length === 0 ? (
          <div className="py-32 text-center">
            <p className="text-creme-os/30 font-mono text-sm tracking-widest uppercase mb-6">
              Aucun modele ne correspond aux filtres selectionnes
            </p>
            <ChromeButton href="/collection" variant="ghost" size="sm">
              Effacer les filtres
            </ChromeButton>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
            {filtered.map((product, i) => (
              <ScrollReveal key={product.slug} delay={i * 60}>
                <ProductCard product={product} />
              </ScrollReveal>
            ))}
          </div>
        )}
      </section>

      {/* Sur-mesure banner */}
      <section className="section-pad bg-corne-fonce/20 border-t border-b border-white/5">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
            <MonoLabel className="block mb-3">Au-dela de la collection</MonoLabel>
            <h2 className="font-display font-black text-3xl md:text-4xl text-creme-os leading-tight">
              Une paire unique,<br />
              <span className="text-orange-brule/80">façonnee pour vous.</span>
            </h2>
          </div>
          <ChromeButton href="/atelier" variant="chrome">
            Decouvrir le Service Couture →
          </ChromeButton>
        </div>
      </section>
    </>
  )
}
