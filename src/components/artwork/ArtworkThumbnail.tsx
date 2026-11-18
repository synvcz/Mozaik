import { useId } from 'react'
import { getPatternTile } from '../../lib/patterns'
import { CANVAS_HEIGHT, CANVAS_WIDTH, pieceTransform, shapePath } from '../../lib/shapes'
import type { FabricPiece } from '../../types/editor'

interface ArtworkThumbnailProps {
  pieces: FabricPiece[]
  className?: string
  label?: string
}

const patternKey = (p: FabricPiece) => `${p.pattern}-${p.color.slice(1)}`

export default function ArtworkThumbnail({ pieces, className = '', label }: ArtworkThumbnailProps) {
  const uid = useId().replace(/:/g, '')

  const defs = new Map<string, ReturnType<typeof getPatternTile>>()
  for (const p of pieces) {
    if (p.pattern !== 'plain') {
      const key = patternKey(p)
      if (!defs.has(key)) defs.set(key, getPatternTile(p.pattern, p.color))
    }
  }

  return (
    <svg
      viewBox={`0 0 ${CANVAS_WIDTH} ${CANVAS_HEIGHT}`}
      role="img"
      aria-label={label ?? 'Fabric collage artwork'}
      className={`block aspect-[4/3] h-auto w-full ${className}`}
    >
      <defs>
        {[...defs.entries()].map(([key, tile]) => (
          <pattern
            key={key}
            id={`${uid}-${key}`}
            patternUnits="userSpaceOnUse"
            width={tile.size}
            height={tile.size}
          >
            <image href={tile.url} width={tile.size} height={tile.size} />
          </pattern>
        ))}
      </defs>
      <rect width={CANVAS_WIDTH} height={CANVAS_HEIGHT} fill="#FFFDF8" />
      {pieces.map((p) => (
        <path
          key={p.id}
          d={shapePath(p.shape, p.width, p.height, p.slotRef)}
          transform={pieceTransform(p)}
          fill={p.pattern === 'plain' ? p.color : `url(#${uid}-${patternKey(p)})`}
          stroke="rgba(43,42,38,0.22)"
          strokeWidth={1}
          strokeLinejoin="round"
        />
      ))}
    </svg>
  )
}