import Link from 'next/link'
import { cn } from '@/lib/utils'

interface ChromeButtonProps {
  href?:      string
  onClick?:   () => void
  children:   React.ReactNode
  variant?:   'chrome' | 'filled' | 'ghost'
  size?:      'sm' | 'md' | 'lg'
  className?: string
  type?:      'button' | 'submit' | 'reset'
  disabled?:  boolean
}

const variants = {
  chrome: 'border border-chrome/40 text-creme-os hover:border-orange-brule hover:text-orange-brule bg-transparent',
  filled: 'bg-creme-os text-noir-profond hover:bg-creme-pale border border-transparent',
  ghost:  'border border-white/15 text-creme-os/70 hover:border-chrome/50 hover:text-creme-os bg-transparent',
}

const sizes = {
  sm: 'px-6 py-2.5 text-xs tracking-[0.15em]',
  md: 'px-8 py-3.5 text-xs tracking-[0.18em]',
  lg: 'px-12 py-5 text-sm tracking-[0.18em]',
}

const base = 'inline-flex items-center justify-center font-mono uppercase transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(212,84,28,0.2)] disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none'

/** Luxury chrome-style button. Renders as <a> when href is provided. */
export function ChromeButton({
  href, onClick, children, variant = 'chrome', size = 'md', className, type = 'button', disabled,
}: ChromeButtonProps) {
  const classes = cn(base, variants[variant], sizes[size], className)

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    )
  }

  return (
    <button type={type} onClick={onClick} className={classes} disabled={disabled}>
      {children}
    </button>
  )
}
