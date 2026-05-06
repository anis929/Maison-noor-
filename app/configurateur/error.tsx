'use client'

import Link from 'next/link'

export default function ConfigurateurError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="fixed inset-0 z-[1001] bg-noir-profond flex flex-col items-center justify-center gap-6 p-8">
      <p className="font-mono text-[0.6rem] tracking-[0.2em] uppercase text-orange-brule/70">
        Erreur du configurateur
      </p>
      <p className="font-display font-black text-2xl text-creme-os text-center">
        Une erreur est survenue
      </p>
      <p className="font-mono text-xs text-creme-os/40 text-center max-w-sm">
        {error.message}
      </p>
      <div className="flex gap-4">
        <button
          onClick={reset}
          className="px-6 py-3 font-mono text-[0.65rem] tracking-[0.2em] uppercase bg-orange-brule text-white hover:bg-orange-brule/80 transition-colors"
        >
          Réessayer
        </button>
        <Link
          href="/collection"
          className="px-6 py-3 font-mono text-[0.65rem] tracking-[0.2em] uppercase border border-white/15 text-creme-os/60 hover:text-creme-os hover:border-white/30 transition-colors"
        >
          ← Collection
        </Link>
      </div>
    </div>
  )
}
