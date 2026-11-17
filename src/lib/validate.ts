import type { FabricPiece } from '../types/editor'
import { PATTERNS } from './patterns'
import { CANVAS_HEIGHT, CANVAS_WIDTH, clamp, MAX_SIZE, MIN_SIZE, SHAPES } from './shapes'

const COLOR = /^#[0-9a-fA-F]{6}$/
const SHAPE_IDS: string[] = SHAPES.map((s) => s.id)
const PATTERN_IDS: string[] = PATTERNS.map((p) => p.id)

const isNum = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v)

/** Keeps only well-formed pieces from untrusted JSON, with clamped numbers. */
export function sanitizePieces(input: unknown): FabricPiece[] {
  if (!Array.isArray(input)) return []
  const out: FabricPiece[] = []

  for (const raw of (input as unknown[]).slice(0, 300)) {
    if (typeof raw !== 'object' || raw === null) continue
    const p = raw as Record<string, unknown>

    if (typeof p.shape !== 'string' || !SHAPE_IDS.includes(p.shape)) continue
    if (typeof p.pattern !== 'string' || !PATTERN_IDS.includes(p.pattern)) continue
    if (typeof p.color !== 'string' || !COLOR.test(p.color)) continue
    if (!isNum(p.x) || !isNum(p.y) || !isNum(p.width) || !isNum(p.height) || !isNum(p.rotation)) continue

    out.push({
      id: `p${out.length}`,
      shape: p.shape as FabricPiece['shape'],
      pattern: p.pattern as FabricPiece['pattern'],
      color: p.color,
      x: clamp(p.x, 0, CANVAS_WIDTH),
      y: clamp(p.y, 0, CANVAS_HEIGHT),
      width: clamp(p.width, MIN_SIZE, MAX_SIZE),
      height: clamp(p.height, MIN_SIZE, MAX_SIZE),
      rotation: clamp(p.rotation, -360, 360),
    })
  }
  return out
}