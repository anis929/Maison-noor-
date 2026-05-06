import { NextRequest, NextResponse } from 'next/server'
import sharp from 'sharp'
import {
  chooseZoom,
  getTilesForBbox,
  lngLatToGlobalPixel,
  terrainRGBUrl,
  decodeTileElevation,
  stitchTiles,
  cropAndNormalize,
} from '@/lib/mapbox/terrainRGB'

export const runtime = 'nodejs'
export const maxDuration = 30

// GET /api/heightmap?bbox=lngMin,latMin,lngMax,latMax&size=512
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const bboxParam = searchParams.get('bbox')
  const outputSize = Math.min(1024, Math.max(64, parseInt(searchParams.get('size') ?? '512', 10)))

  if (!bboxParam) {
    return NextResponse.json({ error: 'bbox required (lngMin,latMin,lngMax,latMax)' }, { status: 400 })
  }

  const parts = bboxParam.split(',').map(Number)
  if (parts.length !== 4 || parts.some(isNaN)) {
    return NextResponse.json({ error: 'Invalid bbox format' }, { status: 400 })
  }

  const [lngMin, latMin, lngMax, latMax] = parts
  const TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN
  if (!TOKEN) {
    return NextResponse.json({ error: 'Mapbox token not configured' }, { status: 500 })
  }

  try {
    const zoom  = chooseZoom(lngMin, lngMax)
    const tiles = getTilesForBbox(lngMin, latMin, lngMax, latMax, zoom)

    // Safety: cap at 25 tiles to avoid excessive API calls
    if (tiles.length > 25) {
      return NextResponse.json({ error: 'Area too large, zoom in' }, { status: 400 })
    }

    // Fetch all tiles in parallel
    const fetches = tiles.map(async (tile) => {
      const url  = terrainRGBUrl(tile, TOKEN)
      const resp = await fetch(url)
      if (!resp.ok) throw new Error(`Tile ${tile.z}/${tile.x}/${tile.y} failed: ${resp.status}`)
      const buf  = Buffer.from(await resp.arrayBuffer())
      // Decode PNG → raw RGBA (256×256×4)
      const raw  = await sharp(buf).raw().toBuffer()
      const elev = decodeTileElevation(raw)
      return { key: `${tile.x}-${tile.y}`, elev }
    })

    const results = await Promise.all(fetches)
    const tileData = new Map(results.map(r => [r.key, r.elev]))

    // Stitch into composite elevation grid
    const { elevation, gridW, gridH, tileMinX, tileMinY } = stitchTiles(tiles, tileData)

    // Compute crop rect: which pixels in the composite grid correspond to our bbox
    const nwPixel = lngLatToGlobalPixel(lngMin, latMax, zoom)
    const sePixel = lngLatToGlobalPixel(lngMax, latMin, zoom)

    const originPixelX = tileMinX * 256
    const originPixelY = tileMinY * 256

    const cropX = nwPixel.px - originPixelX
    const cropY = nwPixel.py - originPixelY
    const cropW = sePixel.px - nwPixel.px
    const cropH = sePixel.py - nwPixel.py

    const grayscale = cropAndNormalize(elevation, gridW, gridH, cropX, cropY, cropW, cropH)
    const croppedW  = Math.max(1, Math.min(gridW, Math.round(cropW)))
    const croppedH  = Math.max(1, Math.min(gridH, Math.round(cropH)))

    // Resize to outputSize×outputSize and return as PNG
    const pngBuf = await sharp(Buffer.from(grayscale), {
      raw: { width: croppedW, height: croppedH, channels: 1 },
    })
      .resize(outputSize, outputSize, { fit: 'fill', kernel: 'lanczos3' })
      .sharpen({ sigma: 0.8 })  // light sharpening enhances terrain detail
      .png()
      .toBuffer()

    return new Response(new Uint8Array(pngBuf), {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=86400', // cache 24h — terrain doesn't change
      },
    })
  } catch (err) {
    console.error('[heightmap]', err)
    return NextResponse.json({ error: 'Failed to generate heightmap' }, { status: 500 })
  }
}
