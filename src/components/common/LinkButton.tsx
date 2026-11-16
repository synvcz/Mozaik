import type { ReactNode } from 'react'
import { hrefFor, type RouteId } from '../../store/navigationStore'

type Variant = 'primary' | 'secondary' | 'accent'

interface LinkButtonProps {
  to: RouteId
  variant?: Variant
  className?: string
  children: ReactNode
}

const VARIANTS: Record<Variant, string> = {
  primary: 'bg-forest text-ivory shadow-sm hover:bg-forest-deep hover:shadow-lg',
  secondary:
    'border border-forest/25 text-forest hover:border-forest hover:bg-forest hover:text-ivory',
  accent: 'bg-terracotta text-white shadow-sm hover:bg-terracotta-deep hover:shadow-lg',
}

export default function LinkButton({
  to,
  variant = 'primary',
  className = '',
  children,
}: LinkButtonProps) {
  return (
    <a
      href={hrefFor(to)}
      className={`group inline-flex min-h-11 items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition duration-300 hover:-translate-y-0.5 ${VARIANTS[variant]} ${className}`}
    >
      {children}
    </a>
  )
}