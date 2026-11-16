import type { Difficulty } from '../../types/challenge'

const LEVELS: Record<Difficulty, number> = { Easy: 1, Medium: 2, Hard: 3 }

export default function DifficultyBadge({ difficulty }: { difficulty: Difficulty }) {
  const filled = LEVELS[difficulty]

  return (
    <span className="inline-flex items-center gap-2 text-xs font-semibold text-ink-soft">
      <span className="flex gap-1" aria-hidden="true">
        {[1, 2, 3].map((n) => (
          <span
            key={n}
            className={`h-2 w-2 rounded-full ${n <= filled ? 'bg-terracotta' : 'bg-forest/15'}`}
          />
        ))}
      </span>
      {difficulty}
    </span>
  )
}