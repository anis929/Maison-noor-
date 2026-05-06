'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

// ── Procedural heightmap generator ───────────────────────────────────────────
// Each texture is defined by a function that fills a Float32Array[size*size] 0-1

type GeneratorFn = (x: number, y: number, size: number) => number

function perlin2D(x: number, y: number): number {
  // Simple value noise for demo (real Perlin would need a gradient table)
  const fade = (t: number) => t * t * t * (t * (t * 6 - 15) + 10)
  const ix = Math.floor(x), iy = Math.floor(y)
  const fx = x - ix, fy = y - iy
  const hash = (n: number) => {
    let h = n
    h = ((h >> 16) ^ h) * 0x45d9f3b
    h = ((h >> 16) ^ h) * 0x45d9f3b
    return ((h >> 16) ^ h) & 0xFFFF
  }
  const v = (nx: number, ny: number) => ((hash(nx * 1000 + ny) / 0xFFFF) * 2 - 1)
  const dot = (nx: number, ny: number, px: number, py: number) => v(nx, ny) * px + v(nx, ny + 1) * py
  const ux = fade(fx), uy = fade(fy)
  return (
    (1 - ux) * (1 - uy) * dot(ix, iy, fx, fy) +
    ux * (1 - uy) * dot(ix + 1, iy, fx - 1, fy) +
    (1 - ux) * uy * dot(ix, iy + 1, fx, fy - 1) +
    ux * uy * dot(ix + 1, iy + 1, fx - 1, fy - 1)
  )
}

function fbm(x: number, y: number, octaves = 5): number {
  let v = 0, amp = 0.5, freq = 1, max = 0
  for (let i = 0; i < octaves; i++) {
    v += amp * Math.abs(perlin2D(x * freq, y * freq))
    max += amp; amp *= 0.5; freq *= 2.1
  }
  return v / max
}

const TEXTURES: { id: string; label: string; gen: GeneratorFn }[] = [
  {
    id: 'mountains',
    label: 'Montagnes',
    gen: (x, y) => fbm(x * 3, y * 3, 6),
  },
  {
    id: 'waves',
    label: 'Vagues',
    gen: (x, y) => 0.5 + 0.5 * Math.sin(x * Math.PI * 8 + Math.sin(y * Math.PI * 3) * 1.2),
  },
  {
    id: 'ripples',
    label: 'Ondulations',
    gen: (x, y) => {
      const cx = x - 0.5, cy = y - 0.5
      const r = Math.sqrt(cx * cx + cy * cy) * 12
      return 0.5 + 0.5 * Math.sin(r)
    },
  },
  {
    id: 'bark',
    label: 'Écorce',
    gen: (x, y) => {
      const base = fbm(x * 4, y * 12, 4)
      return Math.pow(base, 0.6)
    },
  },
  {
    id: 'sand',
    label: 'Sable',
    gen: (x, y) => {
      const n1 = fbm(x * 8, y * 8, 3)
      const n2 = fbm(x * 20 + 5, y * 20 + 5, 2) * 0.2
      return n1 * 0.8 + n2
    },
  },
  {
    id: 'scales',
    label: 'Écailles',
    gen: (x, y) => {
      const gx = (x * 10) % 1, gy = (y * 10 + (Math.floor(x * 10) % 2) * 0.5) % 1
      const cx = gx - 0.5, cy = gy - 0.5
      const r = Math.sqrt(cx * cx + cy * cy)
      return Math.max(0, 1 - r * 2.5)
    },
  },
  {
    id: 'grid',
    label: 'Quadrillage',
    gen: (x, y) => {
      const gx = (x * 8) % 1, gy = (y * 8) % 1
      const lineW = 0.08
      return (gx < lineW || gx > 1 - lineW || gy < lineW || gy > 1 - lineW) ? 1 : 0.15
  },
  },
  {
    id: 'hexagons',
    label: 'Hexagones',
    gen: (x, y) => {
      // Approximate hex grid
      const hx = x * 8, hy = y * 8 * 0.866
      const row = Math.floor(hy), col = Math.floor(hx + (row % 2) * 0.5)
      const fx = (hx + (row % 2) * 0.5) % 1 - 0.5
      const fy = hy % 1 - 0.5
      const d = Math.sqrt(fx * fx + fy * fy)
      return Math.max(0, 1 - d * 3.5) > 0.15 ? 0.9 : 0.1
    },
  },
  {
    id: 'noise-fine',
    label: 'Granit',
    gen: (x, y) => fbm(x * 12, y * 12, 8),
  },
  {
    id: 'diagonal',
    label: 'Chevrons',
    gen: (x, y) => {
      const d = ((x + y) * 6) % 1
      return d < 0.15 ? 1 : d < 0.3 ? 0.5 : 0.1
    },
  },
]

const SIZE = 128  // preview thumbnail resolution

function generateTexture(gen: GeneratorFn): string {
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = SIZE
  const ctx = canvas.getContext('2d')!
  const img = ctx.createImageData(SIZE, SIZE)

  for (let row = 0; row < SIZE; row++) {
    for (let col = 0; col < SIZE; col++) {
      const v   = Math.max(0, Math.min(1, gen(col / SIZE, row / SIZE, SIZE)))
      const g   = Math.round(v * 255)
      const idx = (row * SIZE + col) * 4
      img.data[idx]     = g
      img.data[idx + 1] = g
      img.data[idx + 2] = g
      img.data[idx + 3] = 255
    }
  }
  ctx.putImageData(img, 0, 0)
  return canvas.toDataURL('image/png')
}

// Generate at higher res for the actual heightmap
function generateFullRes(gen: GeneratorFn): string {
  const FULL = 512
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = FULL
  const ctx = canvas.getContext('2d')!
  const img = ctx.createImageData(FULL, FULL)

  for (let row = 0; row < FULL; row++) {
    for (let col = 0; col < FULL; col++) {
      const v   = Math.max(0, Math.min(1, gen(col / FULL, row / FULL, FULL)))
      const g   = Math.round(v * 255)
      const idx = (row * FULL + col) * 4
      img.data[idx] = img.data[idx+1] = img.data[idx+2] = g
      img.data[idx + 3] = 255
    }
  }
  ctx.putImageData(img, 0, 0)
  return canvas.toDataURL('image/png')
}

interface TextureLibraryProps {
  selected: string | null
  onSelect: (id: string, url: string) => void
}

export function TextureLibrary({ selected, onSelect }: TextureLibraryProps) {
  const [previews, setPreviews] = useState<Record<string, string>>({})

  // Generate thumbnail previews on mount (client only)
  useEffect(() => {
    const entries: Record<string, string> = {}
    TEXTURES.forEach(t => { entries[t.id] = generateTexture(t.gen) })
    setPreviews(entries)
  }, [])

  const handleSelect = useCallback((id: string) => {
    const tex = TEXTURES.find(t => t.id === id)
    if (!tex) return
    const fullUrl = generateFullRes(tex.gen)
    onSelect(id, fullUrl)
  }, [onSelect])

  return (
    <div className="flex flex-col gap-4 h-full">
      <p className="text-creme-os/40 text-xs font-light leading-relaxed">
        Sélectionnez une texture. Elle sera gravée sur la monture selon l'intensité choisie.
      </p>

      <div className="grid grid-cols-2 gap-2 overflow-y-auto flex-1 pr-1">
        {TEXTURES.map(tex => (
          <button
            key={tex.id}
            onClick={() => handleSelect(tex.id)}
            className={[
              'relative overflow-hidden aspect-square border-2 transition-all duration-200',
              selected === tex.id
                ? 'border-orange-brule shadow-[0_0_0_2px_rgba(212,84,28,0.3)]'
                : 'border-transparent hover:border-white/25',
            ].join(' ')}
          >
            {previews[tex.id] ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={previews[tex.id]} alt={tex.label} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-noir-doux animate-pulse" />
            )}
            {/* Label */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-noir-profond/80 to-transparent px-2 py-1.5">
              <span className="font-mono text-[0.5rem] tracking-widest uppercase text-creme-os/70">
                {tex.label}
              </span>
            </div>
            {/* Selected checkmark */}
            {selected === tex.id && (
              <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-orange-brule flex items-center justify-center">
                <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
