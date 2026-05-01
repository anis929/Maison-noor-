'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

/**
 * Small chrome circle cursor for desktop (pointer: fine).
 * Grows on interactive elements via GSAP lerp.
 */
export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const dotRef    = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return

    const cursor = cursorRef.current!
    const dot    = dotRef.current!

    let mouseX = 0, mouseY = 0

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
      gsap.to(cursor, { x: mouseX, y: mouseY, duration: 0.45, ease: 'power2.out' })
      gsap.to(dot,    { x: mouseX, y: mouseY, duration: 0.05 })
    }

    const onEnterInteractive = () => {
      gsap.to(cursor, { scale: 2.2, borderColor: 'var(--orange-brule)', duration: 0.25 })
    }
    const onLeaveInteractive = () => {
      gsap.to(cursor, { scale: 1, borderColor: 'var(--chrome)', duration: 0.25 })
    }

    const addListeners = () => {
      document.querySelectorAll('a, button, [role="button"], label, input, textarea, select').forEach(el => {
        el.addEventListener('mouseenter', onEnterInteractive)
        el.addEventListener('mouseleave', onLeaveInteractive)
      })
    }

    window.addEventListener('mousemove', onMouseMove)
    addListeners()

    // Re-attach on DOM changes (lazy-loaded content)
    const observer = new MutationObserver(addListeners)
    observer.observe(document.body, { childList: true, subtree: true })

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      observer.disconnect()
    }
  }, [])

  return (
    <>
      {/* Main circle */}
      <div
        ref={cursorRef}
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 z-[9999] -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full border border-chrome/60 mix-blend-difference hidden md:block"
        style={{ willChange: 'transform' }}
      />
      {/* Centre dot */}
      <div
        ref={dotRef}
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 z-[9999] -translate-x-1/2 -translate-y-1/2 w-1 h-1 rounded-full bg-chrome hidden md:block"
        style={{ willChange: 'transform' }}
      />
    </>
  )
}
