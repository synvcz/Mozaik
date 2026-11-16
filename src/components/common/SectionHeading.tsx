import type { ReactNode } from 'react'

interface SectionHeadingProps {
  eyebrow: string
  title: string
  description?: string
  action?: ReactNode
}

export default function SectionHeading({
  eyebrow,
  title,
  description,
  action,
}: SectionHeadingProps) {
  return (
    <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
      <div className="max-w-xl">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-terracotta">{eyebrow}</p>
        <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-forest sm:text-4xl">
          {title}
        </h2>
        {description && <p className="mt-3 leading-relaxed text-ink-soft">{description}</p>}
      </div>
      {action}
    </div>
  )
}