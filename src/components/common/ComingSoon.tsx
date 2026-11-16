import { ArrowLeft, type LucideIcon } from 'lucide-react'
import Container from '../layout/Container'
import LinkButton from './LinkButton'

interface ComingSoonProps {
  icon: LucideIcon
  title: string
  description: string
  milestone: number
}

export default function ComingSoon({ icon: Icon, title, description, milestone }: ComingSoonProps) {
  return (
    <Container className="py-24 text-center sm:py-32">
      <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-sage-soft text-forest">
        <Icon size={28} aria-hidden="true" />
      </span>
      <h1 className="mt-6 font-display text-4xl font-semibold text-forest sm:text-5xl">{title}</h1>
      <p className="mx-auto mt-4 max-w-md leading-relaxed text-ink-soft">{description}</p>
      <p className="mt-3 text-xs font-bold uppercase tracking-[0.2em] text-terracotta">
        Arrives in Milestone {milestone}
      </p>
      <LinkButton to="workshop" variant="secondary" className="mt-8">
        <ArrowLeft size={16} aria-hidden="true" />
        Back to Workshop
      </LinkButton>
    </Container>
  )
}