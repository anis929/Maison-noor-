import Link from 'next/link'
import { cn } from '@/lib/utils'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizes = {
  sm: 'text-lg tracking-[0.25em]',
  md: 'text-2xl tracking-[0.3em]',
  lg: 'text-4xl tracking-[0.35em] md:text-5xl',
}

/** Maison Noor wordmark — uppercase, display font, tracked. */
export function Logo({ size = 'md', className }: LogoProps) {
  return (
    <Link
      href="/"
      className={cn(
        'font-display font-black text-creme-os hover:text-creme-pale transition-colors duration-300',
        sizes[size],
        className,
      )}
      aria-label="Maison Noor — Accueil"
    >
      MAISON NOOR
    </Link>
  )
}
