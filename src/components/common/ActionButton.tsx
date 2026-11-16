import type { ButtonHTMLAttributes } from 'react'

type Variant = 'primary' | 'secondary' | 'accent' | 'danger'

interface ActionButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
}

const VARIANTS: Record<Variant, string> = {
  primary: 'bg-forest text-ivory shadow-sm hover:bg-forest-deep',
  secondary: 'border border-forest/25 text-forest hover:border-forest hover:bg-forest hover:text-ivory',
  accent: 'bg-terracotta text-white shadow-sm hover:bg-terracotta-deep',
  danger: 'bg-terracotta-deep text-white hover:bg-[#8c4d2c]',
}

export default function ActionButton({
  variant = 'secondary',
  className = '',
  type = 'button',
  ...rest
}: ActionButtonProps) {
  return (
    <button
      type={type}
      className={`group inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition duration-200 disabled:pointer-events-none disabled:opacity-40 ${VARIANTS[variant]} ${className}`}
      {...rest}
    />
  )
}