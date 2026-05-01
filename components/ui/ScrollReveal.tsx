'use client'

import { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

interface ScrollRevealProps {
  children:   React.ReactNode
  className?: string
  delay?:     number
  as?:        keyof JSX.IntrinsicElements
}

/**
 * Wraps children in a container that fades up when scrolled into view.
 * Respects prefers-reduced-motion via CSS (see globals.css).
 */
export function ScrollReveal({ children, className, delay = 0, as: Tag = 'div' }: ScrollRevealProps) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.classList.add('is-visible')
      return
    }

    el.style.transitionDelay = delay ? `${delay}ms` : ''

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('is-visible')
          observer.unobserve(el)
        }
      },
      { threshold: 0.15 },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [delay])

  const Comp = Tag as React.ElementType
  return (
    <Comp ref={ref} className={cn('reveal', className)}>
      {children}
    </Comp>
  )
}
