import type { ChallengeId } from '../../types/challenge'

interface PetalRingProps {
  count: number
  rx: number
  ry: number
  distance: number
  fill: string
  stroke?: string
  offset?: number
  opacity?: number
}

function PetalRing({
  count,
  rx,
  ry,
  distance,
  fill,
  stroke = 'none',
  offset = 0,
  opacity = 1,
}: PetalRingProps) {
  return (
    <g>
      {Array.from({ length: count }, (_, i) => (
        <ellipse
          key={i}
          cx={0}
          cy={-distance}
          rx={rx}
          ry={ry}
          fill={fill}
          stroke={stroke}
          strokeWidth={0.8}
          opacity={opacity}
          transform={`rotate(${offset + (i * 360) / count})`}
        />
      ))}
    </g>
  )
}

function polar(radius: number, degrees: number): [number, number] {
  const rad = (degrees * Math.PI) / 180
  return [radius * Math.sin(rad), -radius * Math.cos(rad)]
}

function FlowerParts({ id }: { id: ChallengeId }) {
  switch (id) {
    case 'anggrek-bulan':
      return (
        <>
          <ellipse cx={0} cy={-27} rx={7} ry={16} fill="#FBF3F6" stroke="#E3BACB" strokeWidth={0.8} />
          <ellipse cx={-14} cy={17} rx={9} ry={17} fill="#FBF3F6" stroke="#E3BACB" strokeWidth={0.8} transform="rotate(35 -14 17)" />
          <ellipse cx={14} cy={17} rx={9} ry={17} fill="#FBF3F6" stroke="#E3BACB" strokeWidth={0.8} transform="rotate(-35 14 17)" />
          <ellipse cx={-19} cy={-6} rx={21} ry={17} fill="#FFFFFF" stroke="#E3BACB" strokeWidth={0.8} transform="rotate(-18 -19 -6)" />
          <ellipse cx={19} cy={-6} rx={21} ry={17} fill="#FFFFFF" stroke="#E3BACB" strokeWidth={0.8} transform="rotate(18 19 -6)" />
          <ellipse cx={0} cy={9} rx={7} ry={10} fill="#D98BAA" />
          <circle cx={0} cy={-3} r={3.5} fill="#F3D36B" />
        </>
      )

    case 'rafflesia-arnoldii':
      return (
        <>
          <PetalRing count={5} rx={19} ry={21} distance={20} fill="#B5472E" stroke="#8C3420" />
          {Array.from({ length: 5 }, (_, i) =>
            [
              [22, 10],
              [31, -8],
              [15, -12],
            ].map(([radius, spread]) => {
              const [x, y] = polar(radius, i * 72 + spread)
              return <circle key={`${i}-${radius}`} cx={x} cy={y} r={2.2} fill="#EBA784" />
            }),
          )}
          <circle cx={0} cy={0} r={12} fill="#6E2A1D" />
          <circle cx={0} cy={0} r={8} fill="#3D1710" />
        </>
      )

    case 'bunga-melati':
      return (
        <>
          <PetalRing count={8} rx={7} ry={18} distance={18} fill="#FFFDF7" stroke="#E3D9C4" />
          <PetalRing count={8} rx={5} ry={12} distance={12} fill="#FFFFFF" stroke="#E3D9C4" offset={22.5} />
          <circle cx={0} cy={0} r={5} fill="#EBCB7A" />
        </>
      )

    case 'bunga-sepatu':
      return (
        <>
          <PetalRing count={5} rx={16} ry={20} distance={17} fill="#D94B3B" stroke="#B0352A" />
          <PetalRing count={5} rx={9} ry={12} distance={11} fill="#EC6F55" offset={36} opacity={0.55} />
          <circle cx={0} cy={0} r={4} fill="#8E1F2A" />
          <line x1={0} y1={0} x2={16} y2={-24} stroke="#F2C14E" strokeWidth={2} strokeLinecap="round" />
          <circle cx={16} cy={-24} r={2.4} fill="#F2C14E" />
          <circle cx={13} cy={-21} r={1.6} fill="#8E1F2A" />
          <circle cx={19} cy={-21} r={1.6} fill="#8E1F2A" />
        </>
      )

    case 'bunga-kenanga':
      return (
        <>
          <PetalRing count={6} rx={5} ry={22} distance={21} fill="#D8C34C" stroke="#B7A235" />
          <PetalRing count={6} rx={4} ry={18} distance={17} fill="#C4B03A" offset={30} opacity={0.9} />
          <circle cx={0} cy={0} r={4} fill="#7C6B1F" />
        </>
      )
  }
}

interface FlowerIllustrationProps {
  id: ChallengeId
  className?: string
}

export default function FlowerIllustration({ id, className }: FlowerIllustrationProps) {
  return (
    <svg viewBox="-50 -50 100 100" aria-hidden="true" className={className}>
      <FlowerParts id={id} />
    </svg>
  )
}