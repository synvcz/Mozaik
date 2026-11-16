import { shapePath } from '../../lib/shapes'
import type { PieceShape } from '../../types/editor'

export default function ShapeIcon({ shape, className }: { shape: PieceShape; className?: string }) {
  return (
    <svg viewBox="0 0 40 40" aria-hidden="true" className={className}>
      <path d={shapePath(shape, 30, 30)} transform="translate(5 5)" fill="currentColor" />
    </svg>
  )
}