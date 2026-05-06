import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { getProductBySlug, getRelatedProducts, materialLabels } from '@/data/products'
import { ChromeButton } from '@/components/ui/ChromeButton'
import { MonoLabel } from '@/components/ui/MonoLabel'
import { DisplayHeading } from '@/components/ui/DisplayHeading'
import { ProductCard } from '@/components/collection/ProductCard'
import { ScrollReveal } from '@/components/ui/ScrollReveal'
import { formatPrice } from '@/lib/utils'

const Product3DViewer = dynamic(
  () => import('@/components/collection/Product3DViewer').then(m => m.Product3DViewer),
  { ssr: false, loading: () => <div className="aspect-square bg-noir-doux animate-pulse" /> },
)

interface ProductPageProps {
  params: { slug: string }
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const product = getProductBySlug(params.slug)
  if (!product) return {}
  return {
    title:       product.name,
    description: product.description,
    openGraph: {
      title:       `${product.name} | Maison Noor`,
      description: product.description,
      type:        'website',
    },
  }
}

export function generateStaticParams() {
  const { products } = require('@/data/products')
  return products.map((p: { slug: string }) => ({ slug: p.slug }))
}

const specKeys: Record<string, string> = {
  dimensions: 'Dimensions',
  weight:     'Poids',
  origin:     'Origine',
}

export default function ProductPage({ params }: ProductPageProps) {
  const product = getProductBySlug(params.slug)
  if (!product) notFound()

  const related = getRelatedProducts(params.slug, 3)

  return (
    <>
      {/* Breadcrumb */}
      <div className="pt-28 pb-0 px-6 md:px-10">
        <nav className="flex items-center gap-2" aria-label="Fil d'ariane">
          {[
            { href: '/',            label: 'Maison Noor' },
            { href: '/collection',  label: 'Collection' },
            { href: '#',            label: product.name },
          ].map((crumb, i, arr) => (
            <span key={crumb.href} className="flex items-center gap-2">
              {i < arr.length - 1 ? (
                <Link href={crumb.href} className="font-mono text-[0.65rem] tracking-widest uppercase text-creme-os/30 hover:text-creme-os/60 transition-colors">
                  {crumb.label}
                </Link>
              ) : (
                <MonoLabel>{crumb.label}</MonoLabel>
              )}
              {i < arr.length - 1 && <span className="text-creme-os/20 text-xs">·</span>}
            </span>
          ))}
        </nav>
      </div>

      {/* Main layout */}
      <section className="section-pad pt-8 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
        {/* Left — gallery */}
        <div className="sticky top-24 space-y-4">
          {/* Main image / 3D viewer */}
          <Product3DViewer productName={product.name} />

          {/* Thumbnail strip */}
          <div className="flex gap-2">
            {[0, 1].map(i => (
              <div
                key={i}
                className="w-20 aspect-square bg-noir-doux border border-white/8 hover:border-chrome/30 cursor-pointer transition-colors duration-200"
              />
            ))}
          </div>
        </div>

        {/* Right — product info */}
        <div>
          {/* Category + edition */}
          <div className="flex items-center gap-4 mb-6">
            <span className="font-mono text-[0.65rem] tracking-[0.18em] uppercase border border-white/10 px-2.5 py-1 text-creme-os/40">
              {product.category}
            </span>
            <MonoLabel dim>Edition {product.edition} exemplaires</MonoLabel>
          </div>

          {/* Name + price */}
          <DisplayHeading as="h1" size="xl" className="mb-2">
            {product.name}
          </DisplayHeading>
          <MonoLabel className="text-base block mb-8">{formatPrice(product.price)}</MonoLabel>

          {/* Color */}
          <p className="text-creme-os/50 text-sm mb-6 font-light">{product.color}</p>

          {/* Description */}
          <p className="text-creme-os/65 leading-relaxed text-base mb-10 font-light max-w-[44ch]">
            {product.description}
          </p>

          {/* Specs table */}
          <div className="border-t border-white/8 mb-10">
            <div className="grid grid-cols-2 gap-0">
              {/* Material */}
              <div className="py-3 border-b border-white/5">
                <MonoLabel dim className="block mb-1">Matiere</MonoLabel>
                <span className="text-sm text-creme-os/70">
                  {materialLabels[product.material] ?? product.material}
                </span>
              </div>
              {Object.entries(product.specs).map(([key, val]) => (
                <div key={key} className="py-3 border-b border-white/5">
                  <MonoLabel dim className="block mb-1">{specKeys[key] ?? key}</MonoLabel>
                  <span className="text-sm text-creme-os/70">{val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <ChromeButton variant="filled" size="lg" className="flex-1 justify-center">
              Acquerir
            </ChromeButton>
            <ChromeButton href="/rendez-vous" variant="chrome" size="lg" className="flex-1 justify-center">
              Demander une consultation
            </ChromeButton>
          </div>

          {/* Configurator CTA */}
          <Link
            href="/configurateur"
            className="flex items-center justify-center gap-2 w-full py-3 border border-dashed border-orange-brule/40 text-orange-brule/70 hover:text-orange-brule hover:border-orange-brule/70 transition-all duration-200 group mb-8"
          >
            <svg className="w-4 h-4 opacity-70 group-hover:opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
            </svg>
            <span className="font-mono text-[0.65rem] tracking-[0.18em] uppercase">
              Personnaliser ce modèle
            </span>
          </Link>

          <p className="text-creme-os/25 font-mono text-[0.65rem] tracking-[0.15em] uppercase">
            Façonnee a la main · Certificat numerote inclus · Garantie 5 ans
          </p>
        </div>
      </section>

      {/* Story section */}
      <section className="section-pad border-t border-white/5 bg-noir-doux">
        <div className="max-w-3xl">
          <ScrollReveal>
            <MonoLabel className="block mb-6">L&apos;histoire de ce modele</MonoLabel>
            <h2 className="font-display font-black text-4xl md:text-5xl text-creme-os mb-8 leading-none">
              {product.name}
            </h2>
            <p className="text-creme-os/55 text-base md:text-lg leading-relaxed font-light">
              {product.story}
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Related products */}
      {related.length > 0 && (
        <section className="section-pad">
          <ScrollReveal>
            <MonoLabel className="block mb-8">Pieces apparentees</MonoLabel>
          </ScrollReveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
            {related.map((p, i) => (
              <ScrollReveal key={p.slug} delay={i * 80}>
                <ProductCard product={p} />
              </ScrollReveal>
            ))}
          </div>
        </section>
      )}
    </>
  )
}
