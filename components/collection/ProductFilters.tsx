'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { MonoLabel } from '@/components/ui/MonoLabel'

const filters: { key: string; label: string; options: { value: string; label: string }[] }[] = [
  {
    key:     'forme',
    label:   'Forme',
    options: [
      { value: 'rond',        label: 'Rond' },
      { value: 'carre',       label: 'Carre' },
      { value: 'aviateur',    label: 'Aviateur' },
      { value: 'pantos',      label: 'Pantos' },
      { value: 'geometrique', label: 'Geometrique' },
    ],
  },
  {
    key:     'm',
    label:   'Matiere',
    options: [
      { value: 'corne-buffle', label: 'Corne de buffle' },
      { value: 'acetate',      label: 'Acetate' },
      { value: 'metal-or',     label: 'Metal dore' },
      { value: 'metal-titane', label: 'Titane' },
      { value: 'mixte',        label: 'Mixte' },
    ],
  },
  {
    key:     'genre',
    label:   'Genre',
    options: [
      { value: 'homme', label: 'Homme' },
      { value: 'femme', label: 'Femme' },
      { value: 'mixte', label: 'Mixte' },
    ],
  },
  {
    key:     'cat',
    label:   'Categorie',
    options: [
      { value: 'solaire', label: 'Solaire' },
      { value: 'optique', label: 'Optique' },
    ],
  },
]

export function ProductFilters() {
  const router      = useRouter()
  const pathname    = usePathname()
  const searchParams = useSearchParams()

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (params.get(key) === value) {
      params.delete(key)
    } else {
      params.set(key, value)
    }
    router.push(`${pathname}?${params.toString()}`, { scroll: false })
  }

  const clearAll = () => router.push(pathname, { scroll: false })

  const hasFilters = filters.some(f => searchParams.has(f.key))

  return (
    <div className="border-b border-white/8 pb-6 mb-12">
      <div className="flex flex-wrap items-center gap-8">
        {filters.map(filter => (
          <div key={filter.key} className="relative group">
            <button className="flex items-center gap-2 font-mono text-[0.7rem] tracking-[0.18em] uppercase text-creme-os/50 hover:text-creme-os transition-colors duration-200">
              {filter.label}
              <span className="text-chrome/40">▾</span>
            </button>

            {/* Dropdown */}
            <div className="absolute top-full left-0 mt-2 min-w-[180px] bg-noir-doux border border-white/8 z-20 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity duration-200">
              {filter.options.map(opt => {
                const active = searchParams.get(filter.key) === opt.value
                return (
                  <button
                    key={opt.value}
                    onClick={() => updateFilter(filter.key, opt.value)}
                    className={`block w-full text-left px-4 py-3 font-mono text-[0.65rem] tracking-[0.15em] uppercase transition-colors duration-150 border-b border-white/5 last:border-0 ${
                      active ? 'text-orange-brule bg-orange-brule/5' : 'text-creme-os/50 hover:text-creme-os'
                    }`}
                  >
                    {opt.label}
                  </button>
                )
              })}
            </div>
          </div>
        ))}

        {/* Separator */}
        <div className="h-4 w-px bg-white/10" />

        {hasFilters && (
          <button
            onClick={clearAll}
            className="font-mono text-[0.65rem] tracking-[0.18em] uppercase text-creme-os/30 hover:text-creme-os/60 transition-colors duration-200"
          >
            Effacer
          </button>
        )}

        <MonoLabel dim className="ml-auto hidden md:block">
          {/* Active filter summary */}
          {filters
            .filter(f => searchParams.has(f.key))
            .map(f => {
              const opt = f.options.find(o => o.value === searchParams.get(f.key))
              return opt?.label
            })
            .filter(Boolean)
            .join(' · ') || 'Tous les modeles'}
        </MonoLabel>
      </div>
    </div>
  )
}
