export interface PathBounds {
  minX: number
  minY: number
  maxX: number
  maxY: number
}

const SEGMENT = /[MLHVCQZ][^MLHVCQZ]*/g
const NUMBER = /-?\d*\.?\d+/g

/**
 * Maps every coordinate of an absolute SVG path.
 * Supports M, L, H, V, C, Q and Z only (all outline data uses just these).
 */
export function transformPath(
  d: string,
  fx: (x: number) => number,
  fy: (y: number) => number,
  precision = 2,
): string {
  const factor = 10 ** precision
  const round = (v: number) => Math.round(v * factor) / factor
  const segments = d.match(SEGMENT) ?? []

  return segments
    .map((segment) => {
      const cmd = segment[0]
      if (cmd === 'Z') return 'Z'
      const nums = (segment.slice(1).match(NUMBER) ?? []).map(Number)
      const mapped = nums.map((value, i) => {
        if (cmd === 'H') return fx(value)
        if (cmd === 'V') return fy(value)
        return i % 2 === 0 ? fx(value) : fy(value)
      })
      return cmd + mapped.map(round).join(' ')
    })
    .join('')
}

/** Bounding box of a path's points (control points included). */
export function pathBounds(d: string): PathBounds | null {
  let minX = Infinity
  let minY = Infinity
  let maxX = -Infinity
  let maxY = -Infinity

  transformPath(
    d,
    (x) => {
      minX = Math.min(minX, x)
      maxX = Math.max(maxX, x)
      return x
    },
    (y) => {
      minY = Math.min(minY, y)
      maxY = Math.max(maxY, y)
      return y
    },
  )

  return Number.isFinite(minX) && Number.isFinite(minY) ? { minX, minY, maxX, maxY } : null
}