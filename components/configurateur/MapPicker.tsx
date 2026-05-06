'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import 'mapbox-gl/dist/mapbox-gl.css'

const TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN ?? ''

// Bbox selector state (in % of container dimensions)
interface BboxPct { x: number; y: number; w: number; h: number }

type DragType = 'move' | 'resize-nw' | 'resize-ne' | 'resize-sw' | 'resize-se' | null

interface GeocodingFeature {
  id: string
  place_name: string
  center: [number, number]
}

interface MapPickerProps {
  onHeightmapReady: (url: string) => void
}

export function MapPicker({ onHeightmapReady }: MapPickerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef       = useRef<mapboxgl.Map | null>(null)
  const [mapLoaded, setMapLoaded]     = useState(false)
  const [loading, setLoading]         = useState(false)
  const [query, setQuery]             = useState('')
  const [suggestions, setSuggestions] = useState<GeocodingFeature[]>([])
  const [bbox, setBbox]               = useState<BboxPct>({ x: 25, y: 20, w: 50, h: 60 })
  const dragState = useRef<{
    type: DragType
    startX: number; startY: number
    startBbox: BboxPct
  } | null>(null)

  // ── Initialize Mapbox ─────────────────────────────────────────────────────
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return

    // Dynamic import to avoid SSR issues
    import('mapbox-gl').then(({ default: mapboxgl }) => {
      mapboxgl.accessToken = TOKEN
      const map = new mapboxgl.Map({
        container: containerRef.current!,
        style:     'mapbox://styles/mapbox/satellite-streets-v12',
        center:    [2.3522, 48.8566],  // Paris default
        zoom:      10,
      })
      map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), 'bottom-right')
      map.on('load', () => setMapLoaded(true))
      mapRef.current = map
    })

    return () => {
      mapRef.current?.remove()
      mapRef.current = null
    }
  }, [])

  // ── Geocoding ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!query || query.length < 2) { setSuggestions([]); return }
    const timer = setTimeout(async () => {
      const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${TOKEN}&language=fr&limit=5`
      const res = await fetch(url)
      if (!res.ok) return
      const data = await res.json()
      setSuggestions(data.features ?? [])
    }, 280)
    return () => clearTimeout(timer)
  }, [query])

  const flyTo = (feature: GeocodingFeature) => {
    mapRef.current?.flyTo({ center: feature.center, zoom: 12, duration: 1200 })
    setQuery(feature.place_name)
    setSuggestions([])
  }

  // ── Bbox drag handling ────────────────────────────────────────────────────
  const getContainerRect = () => containerRef.current!.getBoundingClientRect()

  const onMouseDown = useCallback((e: React.MouseEvent, type: DragType) => {
    e.preventDefault()
    e.stopPropagation()
    dragState.current = {
      type,
      startX: e.clientX,
      startY: e.clientY,
      startBbox: { ...bbox },
    }
  }, [bbox])

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!dragState.current) return
      const { type, startX, startY, startBbox } = dragState.current
      const rect = getContainerRect()
      const dx = ((e.clientX - startX) / rect.width)  * 100
      const dy = ((e.clientY - startY) / rect.height) * 100
      const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v))
      const MIN_SIZE = 10

      setBbox(prev => {
        if (type === 'move') {
          return {
            ...prev,
            x: clamp(startBbox.x + dx, 0, 100 - startBbox.w),
            y: clamp(startBbox.y + dy, 0, 100 - startBbox.h),
          }
        }
        if (type === 'resize-se') {
          return {
            ...prev,
            w: clamp(startBbox.w + dx, MIN_SIZE, 100 - startBbox.x),
            h: clamp(startBbox.h + dy, MIN_SIZE, 100 - startBbox.y),
          }
        }
        if (type === 'resize-ne') {
          const newH = clamp(startBbox.h - dy, MIN_SIZE, startBbox.y + startBbox.h)
          return { ...prev, y: startBbox.y + startBbox.h - newH, h: newH, w: clamp(startBbox.w + dx, MIN_SIZE, 100 - startBbox.x) }
        }
        if (type === 'resize-sw') {
          const newW = clamp(startBbox.w - dx, MIN_SIZE, startBbox.x + startBbox.w)
          return { ...prev, x: startBbox.x + startBbox.w - newW, w: newW, h: clamp(startBbox.h + dy, MIN_SIZE, 100 - startBbox.y) }
        }
        if (type === 'resize-nw') {
          const newW = clamp(startBbox.w - dx, MIN_SIZE, startBbox.x + startBbox.w)
          const newH = clamp(startBbox.h - dy, MIN_SIZE, startBbox.y + startBbox.h)
          return { ...prev, x: startBbox.x + startBbox.w - newW, y: startBbox.y + startBbox.h - newH, w: newW, h: newH }
        }
        return prev
      })
    }
    const onMouseUp = () => { dragState.current = null }
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
    return () => { window.removeEventListener('mousemove', onMouseMove); window.removeEventListener('mouseup', onMouseUp) }
  }, [])

  // ── Fetch heightmap ───────────────────────────────────────────────────────
  const handleValidate = async () => {
    if (!mapRef.current || !mapLoaded) return
    setLoading(true)

    try {
      const rect   = getContainerRect()
      const map    = mapRef.current

      // Convert bbox % positions to screen pixels, then unproject to lng/lat
      const pxNW = { x: rect.width  * (bbox.x / 100),          y: rect.height * (bbox.y / 100) }
      const pxSE = { x: rect.width  * ((bbox.x + bbox.w) / 100), y: rect.height * ((bbox.y + bbox.h) / 100) }

      const lngLatNW = map.unproject([pxNW.x, pxNW.y])
      const lngLatSE = map.unproject([pxSE.x, pxSE.y])

      const lngMin = Math.min(lngLatNW.lng, lngLatSE.lng)
      const lngMax = Math.max(lngLatNW.lng, lngLatSE.lng)
      const latMin = Math.min(lngLatNW.lat, lngLatSE.lat)
      const latMax = Math.max(lngLatNW.lat, lngLatSE.lat)

      const res = await fetch(
        `/api/heightmap?bbox=${lngMin},${latMin},${lngMax},${latMax}&size=512`,
      )
      if (!res.ok) throw new Error(await res.text())

      const blob = await res.blob()
      const url  = URL.createObjectURL(blob)
      onHeightmapReady(url)
    } catch (err) {
      console.error('[MapPicker]', err)
      alert('Erreur lors du chargement du terrain. Veuillez réessayer.')
    } finally {
      setLoading(false)
    }
  }

  // ── Handle styles ─────────────────────────────────────────────────────────
  const HANDLE_SIZE = 10
  const handleStyle: React.CSSProperties = {
    width:  HANDLE_SIZE, height: HANDLE_SIZE,
    background: '#D4541C',
    border: '2px solid white',
    borderRadius: '50%',
    position: 'absolute',
    transform: 'translate(-50%, -50%)',
    cursor: 'pointer',
    pointerEvents: 'all',
    zIndex: 10,
  }

  return (
    <div className="flex flex-col gap-3 h-full">
      {/* Search */}
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Rechercher un lieu, une montagne, une ville…"
          className="input-chrome text-sm pr-10"
        />
        {suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 z-50 bg-noir-doux border border-white/10 shadow-2xl">
            {suggestions.map(f => (
              <button
                key={f.id}
                onClick={() => flyTo(f)}
                className="w-full text-left px-4 py-2.5 text-xs text-creme-os/70 hover:text-creme-os hover:bg-white/5 transition-colors border-b border-white/5 last:border-0 truncate"
              >
                {f.place_name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Map container */}
      <div className="relative flex-1 min-h-[320px] overflow-hidden">
        <div ref={containerRef} className="absolute inset-0" />

        {/* Selection overlay */}
        <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 5 }}>
          {/* Dark vignette outside selection */}
          <svg className="absolute inset-0 w-full h-full" style={{ pointerEvents: 'none' }}>
            <defs>
              <mask id="bbox-mask">
                <rect width="100%" height="100%" fill="white" />
                <rect
                  x={`${bbox.x}%`} y={`${bbox.y}%`}
                  width={`${bbox.w}%`} height={`${bbox.h}%`}
                  fill="black"
                />
              </mask>
            </defs>
            <rect width="100%" height="100%" fill="rgba(10,10,10,0.55)" mask="url(#bbox-mask)" />
          </svg>

          {/* Selection box border + handles */}
          <div
            style={{
              position: 'absolute',
              left: `${bbox.x}%`, top: `${bbox.y}%`,
              width: `${bbox.w}%`, height: `${bbox.h}%`,
              border: '2px solid rgba(212,84,28,0.9)',
              boxSizing: 'border-box',
              pointerEvents: 'all',
              cursor: 'move',
            }}
            onMouseDown={e => onMouseDown(e, 'move')}
          >
            {/* Label */}
            <div className="absolute top-1 left-1/2 -translate-x-1/2 bg-noir-profond/80 px-2 py-0.5 font-mono text-[0.5rem] tracking-widest uppercase text-orange-brule whitespace-nowrap select-none">
              Zone sélectionnée
            </div>

            {/* Corner handles */}
            <div style={{ ...handleStyle, top: 0, left: 0 }} onMouseDown={e => onMouseDown(e, 'resize-nw')} />
            <div style={{ ...handleStyle, top: 0, right: 0 }} onMouseDown={e => onMouseDown(e, 'resize-ne')} />
            <div style={{ ...handleStyle, bottom: 0, left: 0 }} onMouseDown={e => onMouseDown(e, 'resize-sw')} />
            <div style={{ ...handleStyle, bottom: 0, right: 0 }} onMouseDown={e => onMouseDown(e, 'resize-se')} />
          </div>
        </div>
      </div>

      {/* Validate */}
      <button
        onClick={handleValidate}
        disabled={loading || !mapLoaded}
        className="w-full py-3 font-mono text-[0.65rem] tracking-[0.2em] uppercase border border-orange-brule text-orange-brule hover:bg-orange-brule hover:text-white transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {loading ? '⟳ Chargement du terrain…' : 'Valider cette zone →'}
      </button>
    </div>
  )
}
