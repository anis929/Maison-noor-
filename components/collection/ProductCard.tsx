'use client'

import Link from 'next/link'
import { useState } from 'react'
import { MonoLabel } from '@/components/ui/MonoLabel'
import { formatPrice } from '@/lib/utils'
import type { Product } from '@/types'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const [hover, setHover] = useState(false)

  return (
    <Link
      href={`/collection/${product.slug}`}
      className="group block"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {/* Image area */}
      <div className="relative aspect-square overflow-hidden bg-noir-doux mb-4 grain-overlay">
        {/* Primary placeholder — replace with <Image> using product.images[0] */}
        <div
          className={`absolute inset-0 bg-[linear-gradient(135deg,#1e1410_0%,#141414_100%)] transition-opacity duration-500 ${hover ? 'opacity-0' : 'opacity-100'}`}
        />
        {/* Hover placeholder — replace with product.images[1] */}
        <div
          className={`absolute inset-0 bg-[linear-gradient(315deg,#2B1810_0%,#141414_100%)] transition-opacity duration-500 ${hover ? 'opacity-100' : 'opacity-0'}`}
        />

        {/* Edition badge */}
        <div className="absolute top-4 right-4">
          <MonoLabel dim>Ed. {product.edition}</MonoLabel>
        </div>

        {/* Category badge */}
        <div className="absolute top-4 left-4">
          <span className="font-mono text-[0.6rem] tracking-[0.18em] uppercase text-creme-os/30 border border-white/10 px-2 py-1">
            {product.category}
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-display font-black text-xl text-creme-os group-hover:text-creme-pale transition-colors duration-200 leading-tight">
            {product.name}
          </h3>
          <p className="text-creme-os/40 text-sm mt-1 font-light">{product.color}</p>
        </div>
        <MonoLabel className="mt-1 shrink-0">{formatPrice(product.price)}</MonoLabel>
      </div>
    </Link>
  )
}
