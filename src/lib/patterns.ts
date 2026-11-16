import type { FabricPattern } from '../types/editor'

export const PATTERNS: { id: FabricPattern; label: string }[] = [
  { id: 'batik', label: 'Batik' },
  { id: 'kawung', label: 'Kawung' },
  { id: 'parang', label: 'Parang' },
  { id: 'floral', label: 'Floral' },
  { id: 'polka', label: 'Polka dots' },
  { id: 'plain', label: 'Plain' },
]

export function patternLabel(id: FabricPattern): string {
  return PATTERNS.find((p) => p.id === id)?.label ?? id
}

export const FABRIC_COLORS: { name: string; hex: string }[] = [
  { name: 'Forest', hex: '#315C48' },
  { name: 'Sage', hex: '#A7B69A' },
  { name: 'Terracotta', hex: '#C77D55' },
  { name: 'Sogan brown', hex: '#8A4F36' },
  { name: 'Ivory', hex: '#F8F6F0' },
  { name: 'Mustard', hex: '#E4C98E' },
  { name: 'Clay rose', hex: '#E1A58A' },
  { name: 'Brick red', hex: '#B5472E' },
  { name: 'Indigo', hex: '#2F4B6E' },
  { name: 'Teal', hex: '#3E7C7B' },
  { name: 'Plum', hex: '#6B3F5E' },
  { name: 'Charcoal', hex: '#2B2A26' },
]

/** Tiles are drawn at this multiple of their logical size for crisp rendering. */
export const PATTERN_RES = 2

export interface PatternTile {
  canvas: HTMLCanvasElement
  url: string
  /** Logical tile size in canvas units. */
  size: number
}

type TiledPattern = Exclude<FabricPattern, 'plain'>

const SIZES: Record<TiledPattern, number> = {
  batik: 48,
  kawung: 40,
  parang: 24,
  floral: 40,
  polka: 32,
}

const cache = new Map<string, PatternTile>()

export function isLight(hex: string): boolean {
  const v = hex.replace('#', '')
  const r = parseInt(v.slice(0, 2), 16)
  const g = parseInt(v.slice(2, 4), 16)
  const b = parseInt(v.slice(4, 6), 16)
  return 0.299 * r + 0.587 * g + 0.114 * b > 170
}

function drawTile(
  pattern: TiledPattern,
  ctx: CanvasRenderingContext2D,
  ink: (alpha: number) => string,
) {
  const dot = (x: number, y: number, r: number, fill: string) => {
    ctx.beginPath()
    ctx.arc(x, y, r, 0, Math.PI * 2)
    ctx.fillStyle = fill
    ctx.fill()
  }
  const line = (x1: number, y1: number, x2: number, y2: number) => {
    ctx.beginPath()
    ctx.moveTo(x1, y1)
    ctx.lineTo(x2, y2)
    ctx.stroke()
  }

  switch (pattern) {
    case 'polka': {
      dot(8, 8, 4, ink(0.7))
      dot(24, 24, 4, ink(0.7))
      break
    }
    case 'batik': {
      ctx.strokeStyle = ink(0.55)
      ctx.lineWidth = 1.6
      for (const r of [15, 9]) {
        ctx.beginPath()
        ctx.arc(24, 24, r, 0, Math.PI * 2)
        ctx.stroke()
      }
      dot(24, 24, 3.5, ink(0.7))
      for (const [x, y] of [[0, 0], [48, 0], [0, 48], [48, 48]]) dot(x, y, 5, ink(0.45))
      for (const [x, y] of [[24, 2], [24, 46], [2, 24], [46, 24]]) dot(x, y, 2, ink(0.55))
      break
    }
    case 'kawung': {
      ctx.strokeStyle = ink(0.6)
      ctx.lineWidth = 1.6
      ctx.fillStyle = ink(0.14)
      for (const [cx, cy, rx, ry] of [[20, 10, 6, 10], [20, 30, 6, 10], [10, 20, 10, 6], [30, 20, 10, 6]]) {
        ctx.beginPath()
        ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2)
        ctx.fill()
        ctx.stroke()
      }
      dot(20, 20, 2, ink(0.7))
      break
    }
    case 'parang': {
      ctx.lineCap = 'round'
      ctx.strokeStyle = ink(0.38)
      ctx.lineWidth = 4
      line(-2, 26, 26, -2)
      ctx.strokeStyle = ink(0.3)
      ctx.lineWidth = 1.6
      line(0, 12, 12, 0)
      line(12, 24, 24, 12)
      dot(6, 6, 1.6, ink(0.4))
      dot(18, 18, 1.6, ink(0.4))
      break
    }
    case 'floral': {
      for (let i = 0; i < 5; i++) {
        const a = (i * 72 - 90) * (Math.PI / 180)
        dot(20 + 6 * Math.cos(a), 20 + 6 * Math.sin(a), 3.2, ink(0.85))
      }
      dot(20, 20, 2.6, 'rgba(199,125,85,0.95)')
      for (const [x, y] of [[0, 0], [40, 0], [0, 40], [40, 40]]) dot(x, y, 2, ink(0.5))
      break
    }
  }
}

export function getPatternTile(pattern: TiledPattern, color: string): PatternTile {
  const key = `${pattern}|${color}`
  const hit = cache.get(key)
  if (hit) return hit

  const size = SIZES[pattern]
  const canvas = document.createElement('canvas')
  canvas.width = size * PATTERN_RES
  canvas.height = size * PATTERN_RES
  const ctx = canvas.getContext('2d')
  if (ctx) {
    ctx.scale(PATTERN_RES, PATTERN_RES)
    ctx.fillStyle = color
    ctx.fillRect(0, 0, size, size)
    const rgb = isLight(color) ? '43,42,38' : '255,255,255'
    drawTile(pattern, ctx, (a) => `rgba(${rgb},${a})`)
  }
  const tile: PatternTile = { canvas, url: canvas.toDataURL(), size }
  cache.set(key, tile)
  return tile
}

/** Konva accepts canvases for patterns at runtime; its typings only list images. */
export function asPatternImage(canvas: HTMLCanvasElement): HTMLImageElement {
  return canvas as unknown as HTMLImageElement
}