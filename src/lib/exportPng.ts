import type { FabricPiece } from '../types/editor'
import { getPatternTile, PATTERN_RES } from './patterns'
import { CANVAS_HEIGHT, CANVAS_WIDTH, shapePath } from './shapes'

/** Draws the artwork onto an offscreen canvas. Outline guides are never included. */
export function renderArtworkToCanvas(pieces: FabricPiece[], scale = 2): HTMLCanvasElement {
  const canvas = document.createElement('canvas')
  canvas.width = CANVAS_WIDTH * scale
  canvas.height = CANVAS_HEIGHT * scale
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas is not supported in this browser.')

  ctx.fillStyle = '#FFFDF8'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  for (const p of pieces) {
    ctx.save()
    ctx.scale(scale, scale)
    ctx.translate(p.x, p.y)
    ctx.rotate((p.rotation * Math.PI) / 180)
    ctx.translate(-p.width / 2, -p.height / 2)

    const path = new Path2D(shapePath(p.shape, p.width, p.height, p.slotRef))

    ctx.fillStyle = p.color
    if (p.pattern !== 'plain') {
      const tile = getPatternTile(p.pattern, p.color)
      const pattern = ctx.createPattern(tile.canvas, 'repeat')
      if (pattern) {
        pattern.setTransform(new DOMMatrix().scale(1 / PATTERN_RES))
        ctx.fillStyle = pattern
      }
    }
    ctx.fill(path)

    ctx.strokeStyle = 'rgba(43,42,38,0.25)'
    ctx.lineWidth = 1
    ctx.lineJoin = 'round'
    ctx.stroke(path)
    ctx.restore()
  }
  return canvas
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40)
}

export async function downloadArtworkPng(pieces: FabricPiece[], title: string): Promise<void> {
  const canvas = renderArtworkToCanvas(pieces)
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png'))
  if (!blob) throw new Error('Could not create the image.')

  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${slugify(title) || 'mozaik-artwork'}.png`
  document.body.appendChild(link)
  link.click()
  link.remove()
  window.setTimeout(() => URL.revokeObjectURL(url), 1000)
}