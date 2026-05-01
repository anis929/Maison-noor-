'use client'

import Image from 'next/image'
import { useRef } from 'react'
import { cn } from '@/lib/utils'

interface MacroImageProps {
  src:        string
  alt:        string
  className?: string
  priority?:  boolean
  grain?:     boolean
}

/**
 * Full-bleed image with optional grain overlay.
 * Uses next/image for AVIF/WebP optimisation.
 */
export function MacroImage({ src, alt, className, priority = false, grain = true }: MacroImageProps) {
  const ref = useRef<HTMLDivElement>(null)

  return (
    <div ref={ref} className={cn('relative overflow-hidden', grain && 'grain-overlay', className)}>
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
        priority={priority}
        sizes="(max-width: 768px) 100vw, 50vw"
      />
    </div>
  )
}
