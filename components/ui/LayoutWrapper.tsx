'use client'

import { usePathname } from 'next/navigation'
import { PageTransition } from './PageTransition'

// Routes that render full-screen overlays must NOT be wrapped in PageTransition.
// The transition uses opacity, which creates a CSS stacking context — any
// position:fixed child inherits that opacity and becomes invisible during
// the transition (and permanently if a JS error stops the animation).
const BYPASS_TRANSITION = new Set(['/configurateur'])

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  if (BYPASS_TRANSITION.has(pathname)) {
    return <main>{children}</main>
  }

  return (
    <PageTransition>
      <main>{children}</main>
    </PageTransition>
  )
}
