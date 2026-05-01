'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Logo } from '@/components/ui/Logo'
import { cn } from '@/lib/utils'

const links = [
  { href: '/atelier',    label: 'Atelier' },
  { href: '/collection', label: 'Collection' },
  { href: '/maison',     label: 'La Maison' },
  { href: '/contact',    label: 'Contact' },
]

export function Navigation() {
  const [scrolled,    setScrolled]    = useState(false)
  const [menuOpen,    setMenuOpen]    = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close menu on route change
  useEffect(() => { setMenuOpen(false) }, [pathname])

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-10 transition-all duration-500',
          scrolled
            ? 'py-4 bg-noir-profond/90 backdrop-blur-md border-b border-white/5'
            : 'py-6 bg-transparent',
        )}
      >
        <Logo size="sm" />

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-10" aria-label="Navigation principale">
          {links.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'font-mono text-[0.7rem] tracking-[0.2em] uppercase transition-colors duration-200',
                pathname === link.href
                  ? 'text-creme-os'
                  : 'text-creme-os/50 hover:text-creme-os',
              )}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/rendez-vous"
            className="font-mono text-[0.7rem] tracking-[0.2em] uppercase border border-chrome/30 px-5 py-2.5 text-creme-os/70 hover:border-orange-brule hover:text-orange-brule transition-colors duration-200"
          >
            Rendez-vous
          </Link>
        </nav>

        {/* Mobile burger */}
        <button
          aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(v => !v)}
          className="md:hidden flex flex-col gap-1.5 p-2"
        >
          <span className={cn('block w-6 h-px bg-creme-os transition-all duration-300', menuOpen && 'rotate-45 translate-y-2')} />
          <span className={cn('block w-4 h-px bg-creme-os transition-all duration-300', menuOpen && 'opacity-0')} />
          <span className={cn('block w-6 h-px bg-creme-os transition-all duration-300', menuOpen && '-rotate-45 -translate-y-2')} />
        </button>
      </header>

      {/* Mobile drawer */}
      <div
        className={cn(
          'fixed inset-0 z-40 bg-noir-profond flex flex-col justify-center items-center gap-10 transition-all duration-500 md:hidden',
          menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
        )}
        aria-hidden={!menuOpen}
      >
        {[...links, { href: '/rendez-vous', label: 'Rendez-vous' }].map((link, i) => (
          <Link
            key={link.href}
            href={link.href}
            className="font-display text-4xl font-black text-creme-os hover:text-orange-brule transition-colors duration-200"
            style={{ transitionDelay: menuOpen ? `${i * 60}ms` : '0ms' }}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </>
  )
}
