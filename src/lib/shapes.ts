import type { FabricPattern, FabricPiece, PieceShape } from '../types/editor'

export const CANVAS_WIDTH = 800
export const CANVAS_HEIGHT = 600
export const MIN_SIZE = 24
export const MAX_SIZE = 800

const n = (v: number) => Math.round(v * 100) / 100
const K = 0.5523

/** SVG path for a shape inside a 0..w by 0..h box. Shared by Konva (editor) and SVG (thumbnails). */
export function shapePath(shape: PieceShape, w: number, h: number): string {
  const rx = w / 2
  const ry = h / 2
  switch (shape) {
    case 'rect':
      return `M0 0H${n(w)}V${n(h)}H0Z`
    case 'circle':
      return (
        `M${n(rx)} 0C${n(rx + K * rx)} 0 ${n(w)} ${n(ry - K * ry)} ${n(w)} ${n(ry)}` +
        `C${n(w)} ${n(ry + K * ry)} ${n(rx + K * rx)} ${n(h)} ${n(rx)} ${n(h)}` +
        `C${n(rx - K * rx)} ${n(h)} 0 ${n(ry + K * ry)} 0 ${n(ry)}` +
        `C0 ${n(ry - K * ry)} ${n(rx - K * rx)} 0 ${n(rx)} 0Z`
      )
    case 'petal':
      return `M${n(rx)} 0C${n(w)} ${n(h * 0.25)} ${n(w)} ${n(h * 0.75)} ${n(rx)} ${n(h)}C0 ${n(h * 0.75)} 0 ${n(h * 0.25)} ${n(rx)} 0Z`
    case 'leaf':
      return `M0 ${n(h)}C0 ${n(h * 0.35)} ${n(w * 0.35)} 0 ${n(w)} 0C${n(w)} ${n(h * 0.65)} ${n(w * 0.65)} ${n(h)} 0 ${n(h)}Z`
    case 'triangle':
      return `M${n(rx)} 0L${n(w)} ${n(h)}L0 ${n(h)}Z`
    case 'diamond':
      return `M${n(rx)} 0L${n(w)} ${n(ry)}L${n(rx)} ${n(h)}L0 ${n(ry)}Z`
  }
}

/** SVG transform that places a piece (x, y = center) exactly like the Konva node. */
export function pieceTransform(p: FabricPiece): string {
  return `translate(${p.x} ${p.y}) rotate(${p.rotation}) translate(${-p.width / 2} ${-p.height / 2})`
}

export const SHAPES: { id: PieceShape; label: string; width: number; height: number }[] = [
  { id: 'rect', label: 'Square', width: 140, height: 140 },
  { id: 'circle', label: 'Circle', width: 130, height: 130 },
  { id: 'petal', label: 'Petal', width: 90, height: 170 },
  { id: 'leaf', label: 'Leaf', width: 150, height: 110 },
  { id: 'triangle', label: 'Triangle', width: 150, height: 130 },
  { id: 'diamond', label: 'Diamond', width: 120, height: 160 },
]

export function shapeLabel(id: PieceShape): string {
  return SHAPES.find((s) => s.id === id)?.label ?? id
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

export function normalizeRotation(deg: number): number {
  let r = ((deg % 360) + 360) % 360
  if (r > 180) r -= 360
  return Math.round(r * 10) / 10
}

export function patternIsPlain(pattern: FabricPattern): boolean {
  return pattern === 'plain'
}