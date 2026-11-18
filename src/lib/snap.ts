import type { FabricPiece, TemplateId } from '../types/editor'
import { CANVAS_HEIGHT, CANVAS_WIDTH, GUIDE_SCALE } from './shapes'
import { getTemplateSlots, type Slot } from './slots'

export interface SnapTarget {
  ref: string
  /** Position, size, rotation and shape that make a piece fill the slot exactly. */
  patch: Partial<FabricPiece>
}

interface Probe {
  x: number
  y: number
  width: number
  height: number
}

/** How far outside a slot (in canvas units) a piece still counts as "near". */
const MARGIN = 36

function toCanvas(slot: Slot) {
  return {
    x: CANVAS_WIDTH / 2 + slot.cx * GUIDE_SCALE,
    y: CANVAS_HEIGHT / 2 + slot.cy * GUIDE_SCALE,
    w: slot.w * GUIDE_SCALE,
    h: slot.h * GUIDE_SCALE,
  }
}

export function findSnapTarget(templateId: TemplateId | null, probe: Probe): SnapTarget | null {
  const probeDiag = Math.hypot(probe.width, probe.height)
  let best: { slot: Slot; score: number } | null = null

  for (const slot of getTemplateSlots(templateId)) {
    const c = toCanvas(slot)

    // Express the piece's center in the slot's own, unrotated frame.
    const a = (-slot.rotation * Math.PI) / 180
    const dx = probe.x - c.x
    const dy = probe.y - c.y
    const lx = dx * Math.cos(a) - dy * Math.sin(a)
    const ly = dx * Math.sin(a) + dy * Math.cos(a)

    const hw = c.w / 2
    const hh = c.h / 2
    const near =
      slot.kind === 'ellipse'
        ? (lx / (hw + MARGIN)) ** 2 + (ly / (hh + MARGIN)) ** 2 <= 1
        : Math.abs(lx) <= hw + MARGIN && Math.abs(ly) <= hh + MARGIN
    if (!near) continue

    // Closer to the slot's center is better; a similar size breaks ties
    // (for example the two concentric circles in the middle of the Rafflesia).
    const distance = Math.hypot(lx / hw, ly / hh)
    const sizePenalty = 0.15 * Math.abs(Math.log(probeDiag / Math.hypot(c.w, c.h)))
    const score = distance + sizePenalty
    if (!best || score < best.score) best = { slot, score }
  }

  if (!best) return null

  const c = toCanvas(best.slot)
  const base = {
    x: Math.round(c.x),
    y: Math.round(c.y),
    width: Math.round(c.w),
    height: Math.round(c.h),
    rotation: best.slot.rotation,
  }
  const patch: Partial<FabricPiece> =
    best.slot.kind === 'ellipse'
      ? { ...base, shape: 'circle', slotRef: undefined }
      : { ...base, shape: 'slot', slotRef: best.slot.ref }

  return { ref: best.slot.ref, patch }
}