import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const maxDuration = 120

// POST /api/generate-stl
// Phase 1: mock — logs the spec and returns a placeholder response.
// Phase 2: forward to Python/Blender microservice, store STL in Supabase.

interface FrameSpec {
  orderId:          string
  frameModel:       'round' | 'square' | 'aviator'
  material:         'acetate' | 'walnut' | 'ebony' | 'titanium'
  size:             'S' | 'M' | 'L'
  heightmapUrl:     string
  displacementScale: number
  displacementRotation: number
  displacementInverted: boolean
}

export async function POST(request: NextRequest) {
  let spec: FrameSpec
  try {
    spec = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const PYTHON_URL = process.env.PYTHON_SERVICE_URL
  const API_KEY    = process.env.PYTHON_SERVICE_API_KEY

  // ── Phase 2: forward to Python / Blender ─────────────────────────────────
  if (PYTHON_URL) {
    try {
      const resp = await fetch(`${PYTHON_URL}/stl`, {
        method:  'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(API_KEY ? { 'X-API-Key': API_KEY } : {}),
        },
        body: JSON.stringify(spec),
      })
      if (!resp.ok) throw new Error(`Python service: ${resp.status}`)
      return NextResponse.json(await resp.json())
    } catch (err) {
      console.error('[generate-stl] Python service error:', err)
    }
  }

  // ── Phase 1 mock ──────────────────────────────────────────────────────────
  console.log('[generate-stl] Mock — spec received:', spec)

  // Simulate processing delay
  await new Promise(r => setTimeout(r, 800))

  return NextResponse.json({
    status:   'mock',
    message:  'STL generation is mocked in Phase 1. Wire PYTHON_SERVICE_URL to activate.',
    stlUrl:   null,
    orderId:  spec.orderId,
    spec,
  })
}
