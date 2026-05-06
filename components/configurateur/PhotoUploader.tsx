'use client'

import { useRef, useState, useCallback } from 'react'

interface PhotoUploaderProps {
  onHeightmapReady: (url: string) => void
}

export function PhotoUploader({ onHeightmapReady }: PhotoUploaderProps) {
  const inputRef     = useRef<HTMLInputElement>(null)
  const [preview, setPreview]   = useState<string | null>(null)
  const [filename, setFilename] = useState<string | null>(null)
  const [loading, setLoading]   = useState(false)
  const [dragging, setDragging] = useState(false)

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) return
    if (file.size > 10 * 1024 * 1024) {
      alert('Image trop lourde (max 10 Mo)')
      return
    }
    setFilename(file.name)
    const reader = new FileReader()
    reader.onload = e => setPreview(e.target?.result as string)
    reader.readAsDataURL(file)
  }, [])

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }, [handleFile])

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }

  const generateDepth = async () => {
    if (!preview) return
    setLoading(true)

    try {
      // Convert data URL to blob
      const res   = await fetch(preview)
      const blob  = await res.blob()
      const form  = new FormData()
      form.append('file', blob, filename ?? 'photo.jpg')

      const resp = await fetch('/api/photo-to-depth', { method: 'POST', body: form })
      if (!resp.ok) throw new Error(await resp.text())

      const depthBlob = await resp.blob()
      const url       = URL.createObjectURL(depthBlob)
      onHeightmapReady(url)
    } catch (err) {
      console.error('[PhotoUploader]', err)
      alert('Erreur lors de la génération du relief.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-4 h-full">
      {/* Drop zone */}
      <div
        onClick={() => inputRef.current?.click()}
        onDrop={onDrop}
        onDragOver={e => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        className={[
          'relative border-2 border-dashed transition-all duration-200 cursor-pointer overflow-hidden',
          dragging ? 'border-orange-brule bg-orange-brule/5' : 'border-white/15 hover:border-white/30',
          preview ? 'h-40' : 'h-48',
        ].join(' ')}
      >
        {preview ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={preview} alt="Aperçu" className="w-full h-full object-cover opacity-70" />
            <div className="absolute inset-0 flex items-center justify-center bg-noir-profond/40">
              <p className="font-mono text-[0.6rem] tracking-widest uppercase text-creme-os/60">
                Cliquer pour changer
              </p>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full gap-3 p-6">
            <svg className="w-8 h-8 text-creme-os/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <div className="text-center">
              <p className="text-sm text-creme-os/50 font-light">
                Glisser une photo ici
              </p>
              <p className="font-mono text-[0.55rem] tracking-widest uppercase text-creme-os/25 mt-1">
                PNG · JPG · max 10 Mo
              </p>
            </div>
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        onChange={onInputChange}
        className="hidden"
      />

      {/* Examples */}
      {!preview && (
        <div className="grid grid-cols-3 gap-2">
          {[
            'Main d\'enfant',
            'Signature',
            'Empreinte digitale',
            'Dessin',
            'Carte postale',
            'Visage de profil',
          ].map(label => (
            <div
              key={label}
              className="border border-white/6 p-2 text-center"
            >
              <p className="font-mono text-[0.5rem] tracking-wide text-creme-os/25 leading-tight">{label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Generation info */}
      {preview && (
        <div className="bg-corne-fonce/15 border border-corne-medium/15 p-3">
          <p className="font-mono text-[0.55rem] tracking-[0.1em] uppercase text-creme-os/35 mb-1">
            Conversion par IA
          </p>
          <p className="text-creme-os/45 text-xs leading-relaxed font-light">
            Votre photo est analysée par Depth Anything V2 pour générer une carte de profondeur 3D.
            Durée estimée : 5–15 secondes.
          </p>
        </div>
      )}

      {/* CTA */}
      {preview && (
        <button
          onClick={generateDepth}
          disabled={loading}
          className="w-full py-3 font-mono text-[0.65rem] tracking-[0.2em] uppercase border border-orange-brule text-orange-brule hover:bg-orange-brule hover:text-white transition-all duration-200 disabled:opacity-40"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="inline-block w-3 h-3 border border-orange-brule border-t-transparent rounded-full animate-spin" />
              Génération du relief…
            </span>
          ) : 'Générer le relief →'}
        </button>
      )}
    </div>
  )
}
