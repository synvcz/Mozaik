import { getPatternTile } from '../../lib/patterns'
import type { FabricPattern } from '../../types/editor'

export default function PatternSwatch({
  pattern,
  color,
  className = '',
}: {
  pattern: FabricPattern
  color: string
  className?: string
}) {
  if (pattern === 'plain') {
    return <div className={className} style={{ backgroundColor: color }} />
  }
  const tile = getPatternTile(pattern, color)
  return (
    <div
      className={className}
      style={{
        backgroundColor: color,
        backgroundImage: `url(${tile.url})`,
        backgroundSize: `${tile.size}px ${tile.size}px`,
      }}
    />
  )
}