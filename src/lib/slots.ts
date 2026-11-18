import { ALL_TEMPLATES } from '../data/templates'
import type { TemplateId } from '../types/editor'
import { pathBounds, transformPath } from './pathTools'

/** A fillable part of a template outline, in guide space (-50..50). */
export interface Slot {
  /** `${templateId}:${index of the shape in the template's guide}` */
  ref: string
  index: number
  kind: 'ellipse' | 'path'
  cx: number
  cy: number
  w: number
  h: number
  rotation: number
}

const unitPaths = new Map<string, string>()
const slotsByTemplate = new Map<TemplateId, Slot[]>()

for (const template of ALL_TEMPLATES) {
  const slots: Slot[] = []

  template.guide.forEach((shape, index) => {
    const ref = `${template.id}:${index}`

    if (shape.kind === 'ellipse') {
      slots.push({
        ref,
        index,
        kind: 'ellipse',
        cx: shape.cx,
        cy: shape.cy,
        w: shape.rx * 2,
        h: shape.ry * 2,
        rotation: shape.rotation,
      })
      return
    }

    // Open lines have no inside to fill, so they stay decorative.
    if (!/Z\s*$/.test(shape.d.trim())) return

    const b = pathBounds(shape.d)
    if (!b) return
    const w = b.maxX - b.minX
    const h = b.maxY - b.minY
    if (w <= 0 || h <= 0) return

    // Stored in a 0..1 box so a piece can scale it to any width and height.
    unitPaths.set(
      ref,
      transformPath(shape.d, (x) => (x - b.minX) / w, (y) => (y - b.minY) / h, 5),
    )
    slots.push({
      ref,
      index,
      kind: 'path',
      cx: (b.minX + b.maxX) / 2,
      cy: (b.minY + b.maxY) / 2,
      w,
      h,
      rotation: 0,
    })
  })

  slotsByTemplate.set(template.id, slots)
}

export function getTemplateSlots(id: TemplateId | null): Slot[] {
  return id ? (slotsByTemplate.get(id) ?? []) : []
}

export function getSlotUnitPath(ref: string): string | undefined {
  return unitPaths.get(ref)
}

export function hasSlot(ref: string): boolean {
  return unitPaths.has(ref)
}