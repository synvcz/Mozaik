import type { GuideShape } from '../../types/editor'

interface GuidePreviewProps {
  guide: GuideShape[]
  className?: string
  stroke?: string
}

export default function GuidePreview({ guide, className, stroke = '#315C48' }: GuidePreviewProps) {
  return (
    <svg
      viewBox="-50 -50 100 100"
      aria-hidden="true"
      className={className}
      fill="none"
      stroke={stroke}
      strokeWidth={1.1}
      strokeDasharray="3 2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {guide.map((g, i) =>
        g.kind === 'ellipse' ? (
          <ellipse
            key={i}
            cx={g.cx}
            cy={g.cy}
            rx={g.rx}
            ry={g.ry}
            transform={`rotate(${g.rotation} ${g.cx} ${g.cy})`}
          />
        ) : (
          <path key={i} d={g.d} />
        ),
      )}
    </svg>
  )
}