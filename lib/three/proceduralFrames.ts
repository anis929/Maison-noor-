import * as THREE from 'three'

export type FrameModel = 'round' | 'square' | 'aviator'

// ── Unit system: 1 unit = 1 cm ───────────────────────────────────────────────
// Reference: standard 52-18-140 adult frame
//   lens clear aperture ≈ 52 mm, bridge ≈ 18 mm, temple ≈ 140 mm

const RIM_TUBE_R = 0.22   // tube cross-section radius (2.2 mm)
const PATH_SEGS  = 128    // rim path segments → controls displacement detail
const TUBE_SEGS  = 28     // tube radial segments

// Per-model configuration
export const FRAME_CONFIGS = {
  round: {
    lensX:  3.45,   // center-to-center half-distance
    rimRx:  2.30,   // superellipse horizontal radius
    rimRy:  2.30,   // superellipse vertical radius
    superN: 2,      // n=2 → perfect circle
    bridgeY: 0,
    bridgeRaise: 0.10,
  },
  square: {
    lensX:  3.40,
    rimRx:  2.40,
    rimRy:  1.90,
    superN: 7,      // high exponent → square-ish with rounded corners
    bridgeY: 0.55,
    bridgeRaise: 0.06,
  },
  aviator: {
    lensX:  3.40,
    rimRx:  2.40,
    rimRy:  2.20,
    superN: 2.5,    // between circle and square → slight drop shape
    bridgeY: 0.85,
    bridgeRaise: 0.05,
  },
} as const

// ── Superellipse curve (Lamé curve) in 3D ──────────────────────────────────
// Formula: x = rx * |cos t|^(2/n) * sign(cos t)
//          y = ry * |sin t|^(2/n) * sign(sin t)
// n=2 → ellipse/circle, n→∞ → rectangle
function superellipseCurve(
  cx: number, cy: number,
  rx: number, ry: number,
  n: number,
  N = 200,
  // Aviator distortion: push bottom lobe down
  dropFactor = 0,
): THREE.CatmullRomCurve3 {
  const pts: THREE.Vector3[] = []
  for (let i = 0; i < N; i++) {
    const t = (i / N) * Math.PI * 2
    const ct = Math.cos(t), st = Math.sin(t)
    const x = rx * Math.pow(Math.abs(ct), 2 / n) * Math.sign(ct)
    // Aviator: pull the bottom of the shape further down
    const dropY = dropFactor > 0 ? -dropFactor * Math.max(0, -st) * (1 + Math.abs(ct) * 0.4) : 0
    const y = ry * Math.pow(Math.abs(st), 2 / n) * Math.sign(st) + dropY
    pts.push(new THREE.Vector3(cx + x, cy + y, 0))
  }
  return new THREE.CatmullRomCurve3(pts, true, 'catmullrom', 0)
}

// ── Rim geometry (engraving zone) ──────────────────────────────────────────
export function createRimGeometry(model: FrameModel, side: 'left' | 'right'): THREE.TubeGeometry {
  const cfg = FRAME_CONFIGS[model]
  const cx = side === 'left' ? -cfg.lensX : cfg.lensX
  const curve = superellipseCurve(
    cx, 0,
    cfg.rimRx, cfg.rimRy,
    cfg.superN,
    200,
    model === 'aviator' ? 0.55 : 0,
  )
  return new THREE.TubeGeometry(curve, PATH_SEGS, RIM_TUBE_R, TUBE_SEGS, true)
}

// ── Bridge geometry ─────────────────────────────────────────────────────────
// Connects the inner edges of the two lens rims via a slight arc
export function createBridgeGeometry(model: FrameModel): THREE.TubeGeometry {
  const cfg = FRAME_CONFIGS[model]
  const innerX = cfg.lensX - cfg.rimRx - RIM_TUBE_R * 0.4
  const by = cfg.bridgeY
  const raise = cfg.bridgeRaise

  const pts = [
    new THREE.Vector3(-innerX, by, 0),
    new THREE.Vector3(-innerX * 0.5, by + raise, 0.06),
    new THREE.Vector3(0, by + raise * 1.4, 0.09),
    new THREE.Vector3(innerX * 0.5, by + raise, 0.06),
    new THREE.Vector3(innerX, by, 0),
  ]
  const curve = new THREE.CatmullRomCurve3(pts, false, 'catmullrom', 0.5)
  return new THREE.TubeGeometry(curve, 32, 0.13, 14, false)
}

// ── Temple (branch) geometry ────────────────────────────────────────────────
// Starts at the outer hinge, curves backward behind the ear
export function createTempleGeometry(model: FrameModel, side: 'left' | 'right'): THREE.TubeGeometry {
  const cfg  = FRAME_CONFIGS[model]
  const sign = side === 'left' ? -1 : 1
  const hingeX = sign * (cfg.lensX + cfg.rimRx + RIM_TUBE_R * 0.5)
  const by = cfg.bridgeY * 0.4  // temples start roughly at mid-height

  // Temple path: straight outward then curves back and slightly down
  const pts = [
    new THREE.Vector3(hingeX,                by,      0),
    new THREE.Vector3(hingeX + sign * 0.8,   by,      0.05),
    new THREE.Vector3(hingeX + sign * 4.0,   by - 0.05, -0.3),
    new THREE.Vector3(hingeX + sign * 8.5,   by - 0.25, -2.5),
    new THREE.Vector3(hingeX + sign * 11.5,  by - 0.80, -6.5),
    new THREE.Vector3(hingeX + sign * 13.5,  by - 1.60, -11.0),
  ]
  const curve = new THREE.CatmullRomCurve3(pts, false, 'catmullrom', 0.4)
  return new THREE.TubeGeometry(curve, 56, 0.10, 14, false)
}

// ── Hinge geometry ──────────────────────────────────────────────────────────
export function createHingeGeometry(): THREE.CylinderGeometry {
  return new THREE.CylinderGeometry(0.15, 0.15, 0.38, 14)
}

// ── Nose pad geometry ────────────────────────────────────────────────────────
export function createNosePadGeometry(): THREE.SphereGeometry {
  return new THREE.SphereGeometry(0.09, 8, 6)
}

// ── Hinge + nose pad positions per model ────────────────────────────────────
export function getHingePositions(model: FrameModel): { left: THREE.Vector3; right: THREE.Vector3 } {
  const cfg = FRAME_CONFIGS[model]
  const x = cfg.lensX + cfg.rimRx + RIM_TUBE_R * 0.3
  const y = cfg.bridgeY * 0.4
  return {
    left:  new THREE.Vector3(-x, y, 0),
    right: new THREE.Vector3( x, y, 0),
  }
}

export function getNosePadPositions(model: FrameModel): { left: THREE.Vector3; right: THREE.Vector3 } {
  const cfg = FRAME_CONFIGS[model]
  const x = cfg.lensX - cfg.rimRx
  const y = cfg.bridgeY - 0.55
  return {
    left:  new THREE.Vector3(-x, y, 0.18),
    right: new THREE.Vector3( x, y, 0.18),
  }
}
