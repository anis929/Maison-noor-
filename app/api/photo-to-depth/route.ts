import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const maxDuration = 60

// POST /api/photo-to-depth
// Forwards the uploaded image to the Python microservice (Depth Anything V2).
// In Phase 1 this returns a mock grayscale PNG (procedural gradient noise).
// To activate the real service, set PYTHON_SERVICE_URL + PYTHON_SERVICE_API_KEY.

export async function POST(request: NextRequest) {
  const PYTHON_URL = process.env.PYTHON_SERVICE_URL
  const API_KEY    = process.env.PYTHON_SERVICE_API_KEY

  // ── Phase 2: forward to real microservice ─────────────────────────────────
  if (PYTHON_URL) {
    try {
      const formData = await request.formData()
      const response = await fetch(`${PYTHON_URL}/depth`, {
        method: 'POST',
        headers: API_KEY ? { 'X-API-Key': API_KEY } : {},
        body: formData,
      })
      if (!response.ok) throw new Error(`Python service: ${response.status}`)

      const buf = await response.arrayBuffer()
      return new Response(buf, {
        headers: { 'Content-Type': 'image/png' },
      })
    } catch (err) {
      console.error('[photo-to-depth] Python service error:', err)
      // Fall through to mock
    }
  }

  // ── Phase 1 mock: generate a procedural depth map via sharp ──────────────
  // Creates a 512×512 grayscale PNG (radial gradient: bright center → dark edges).
  // Replace by wiring PYTHON_SERVICE_URL to activate Depth Anything V2.
  try {
    const sharp = (await import('sharp')).default
    const SIZE  = 512

    // Build a raw grayscale buffer with a radial gradient
    const raw = new Uint8Array(SIZE * SIZE)
    const cx = SIZE / 2, cy = SIZE / 2
    for (let row = 0; row < SIZE; row++) {
      for (let col = 0; col < SIZE; col++) {
        const dist = Math.sqrt((col - cx) ** 2 + (row - cy) ** 2)
        const v    = Math.max(0, Math.round(255 - (dist / (SIZE * 0.55)) * 255))
        raw[row * SIZE + col] = v
      }
    }

    const pngBuf = await sharp(Buffer.from(raw), {
      raw: { width: SIZE, height: SIZE, channels: 1 },
    }).png().toBuffer()

    return new Response(new Uint8Array(pngBuf), { headers: { 'Content-Type': 'image/png' } })
  } catch {
    // Ultimate fallback: 1×1 mid-grey PNG
    const GREY_1PX = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
      'base64',
    )
    return new Response(new Uint8Array(GREY_1PX), { headers: { 'Content-Type': 'image/png' } })
  }
}
