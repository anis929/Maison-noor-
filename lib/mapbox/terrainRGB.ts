// Utilities for decoding Mapbox Terrain-RGB tiles into elevation data
// Terrain-RGB format: elevation = -10000 + (R*256*256 + G*256 + B) * 0.1

// ── Tile math (Web Mercator / Slippy Map) ────────────────────────────────────

export function lngLatToTile(
  lng: number,
  lat: number,
  zoom: number,
): { x: number; y: number } {
  const n = Math.pow(2, zoom)
  const x = Math.floor(((lng + 180) / 360) * n)
  const latRad = (lat * Math.PI) / 180
  const y = Math.floor(
    ((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) * n,
  )
  return { x: Math.max(0, Math.min(n - 1, x)), y: Math.max(0, Math.min(n - 1, y)) }
}

// Global pixel position for a lng/lat at a given zoom
// (0,0) is the NW corner of the world; each tile = 256 pixels
export function lngLatToGlobalPixel(
  lng: number,
  lat: number,
  zoom: number,
): { px: number; py: number } {
  const n = Math.pow(2, zoom) * 256
  const px = ((lng + 180) / 360) * n
  const latRad = (lat * Math.PI) / 180
  const py =
    ((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) * n
  return { px, py }
}

// Choose an appropriate zoom level so the bbox spans roughly 3-6 tiles wide
export function chooseZoom(lngMin: number, lngMax: number): number {
  const lngSpan = Math.abs(lngMax - lngMin)
  // We want ~4 tiles wide → zoom = log2(360 * 4 / lngSpan) - but clamped
  const raw = Math.round(Math.log2(360 / lngSpan) + 1.5)
  return Math.max(5, Math.min(13, raw))
}

// Tile list covering a bbox at a given zoom
export interface TileCoord { x: number; y: number; z: number }

export function getTilesForBbox(
  lngMin: number, latMin: number,
  lngMax: number, latMax: number,
  zoom: number,
): TileCoord[] {
  const nw = lngLatToTile(lngMin, latMax, zoom) // NW corner → smallest x, smallest y
  const se = lngLatToTile(lngMax, latMin, zoom) // SE corner → largest x, largest y
  const tiles: TileCoord[] = []
  for (let x = nw.x; x <= se.x; x++) {
    for (let y = nw.y; y <= se.y; y++) {
      tiles.push({ x, y, z: zoom })
    }
  }
  return tiles
}

// Build the Mapbox Terrain-RGB tile URL
export function terrainRGBUrl(tile: TileCoord, token: string): string {
  return `https://api.mapbox.com/v4/mapbox.terrain-rgb/${tile.z}/${tile.x}/${tile.y}.pngraw?access_token=${token}`
}

// Decode a 4-channel RGBA raw Buffer (256*256*4) into an elevation Float32Array
// rawBuf: output of sharp(...).raw().toBuffer() on a terrain-rgb tile
export function decodeTileElevation(rawBuf: Buffer): Float32Array {
  const pixels = 256 * 256
  const elevation = new Float32Array(pixels)
  for (let i = 0; i < pixels; i++) {
    const r = rawBuf[i * 4]
    const g = rawBuf[i * 4 + 1]
    const b = rawBuf[i * 4 + 2]
    elevation[i] = -10000 + (r * 256 * 256 + g * 256 + b) * 0.1
  }
  return elevation
}

// Stitch tile elevations into a single Float32Array grid
// Returns { elevation, gridW, gridH, tileMinX, tileMinY }
export function stitchTiles(
  tiles: TileCoord[],
  tileData: Map<string, Float32Array>,
): { elevation: Float32Array; gridW: number; gridH: number; tileMinX: number; tileMinY: number } {
  if (tiles.length === 0) throw new Error('No tiles')

  const minX = Math.min(...tiles.map(t => t.x))
  const maxX = Math.max(...tiles.map(t => t.x))
  const minY = Math.min(...tiles.map(t => t.y))
  const maxY = Math.max(...tiles.map(t => t.y))

  const tilesW = maxX - minX + 1
  const tilesH = maxY - minY + 1
  const gridW  = tilesW * 256
  const gridH  = tilesH * 256

  const elevation = new Float32Array(gridW * gridH)

  for (const tile of tiles) {
    const key  = `${tile.x}-${tile.y}`
    const data = tileData.get(key)
    if (!data) continue

    const offsetX = (tile.x - minX) * 256
    const offsetY = (tile.y - minY) * 256

    for (let row = 0; row < 256; row++) {
      for (let col = 0; col < 256; col++) {
        const srcIdx  = row * 256 + col
        const dstIdx  = (offsetY + row) * gridW + (offsetX + col)
        elevation[dstIdx] = data[srcIdx]
      }
    }
  }

  return { elevation, gridW, gridH, tileMinX: minX, tileMinY: minY }
}

// Crop a Float32Array grid to a pixel sub-rectangle and normalize to Uint8Array 0-255
export function cropAndNormalize(
  elevation: Float32Array,
  gridW: number,
  gridH: number,
  cropX: number, cropY: number,
  cropW: number, cropH: number,
): Uint8Array {
  // Clamp crop bounds
  const x0 = Math.max(0, Math.round(cropX))
  const y0 = Math.max(0, Math.round(cropY))
  const x1 = Math.min(gridW, Math.round(cropX + cropW))
  const y1 = Math.min(gridH, Math.round(cropY + cropH))
  const w  = x1 - x0
  const h  = y1 - y0

  if (w <= 0 || h <= 0) return new Uint8Array(4)

  // Find min/max elevation in crop area (ignore -10000 ocean floor sentinels)
  let eMin =  Infinity
  let eMax = -Infinity
  for (let row = y0; row < y1; row++) {
    for (let col = x0; col < x1; col++) {
      const v = elevation[row * gridW + col]
      if (v > -9000) {
        if (v < eMin) eMin = v
        if (v > eMax) eMax = v
      }
    }
  }
  if (!isFinite(eMin)) { eMin = 0; eMax = 1 }
  const range = eMax - eMin || 1

  const out = new Uint8Array(w * h)
  for (let row = y0; row < y1; row++) {
    for (let col = x0; col < x1; col++) {
      const v     = elevation[row * gridW + col]
      const norm  = Math.max(0, Math.min(1, (v - eMin) / range))
      const dstI  = (row - y0) * w + (col - x0)
      out[dstI]   = Math.round(norm * 255)
    }
  }
  return out
}
