import { ArrowRight, Flower2, Palette, Sparkles } from 'lucide-react'
import LinkButton from '../common/LinkButton'
import Container from '../layout/Container'
import FlowerIllustration from './FlowerIllustration'
import HeroCollage from './HeroCollage'

const HIGHLIGHTS = [
  { icon: Palette, label: '6 fabric patterns' },
  { icon: Flower2, label: '5 flower challenges' },
  { icon: Sparkles, label: 'No account needed' },
]

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="animate-drift absolute -left-24 top-8 h-72 w-72 rounded-full bg-sage/35 blur-3xl" />
        <div className="animate-drift absolute -right-16 top-0 h-80 w-80 rounded-full bg-terracotta/20 blur-3xl [animation-delay:-7s]" />
        <FlowerIllustration
          id="bunga-kenanga"
          className="animate-spin-slow absolute -bottom-28 -left-24 h-80 w-80 opacity-[0.08]"
        />
      </div>

      <Container className="relative grid items-center gap-14 py-14 sm:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10 lg:py-24">
        <div>
          <div className="animate-rise">
            <span className="inline-flex items-center gap-2 rounded-full bg-sage-soft px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-forest">
              <Sparkles size={14} aria-hidden="true" />
              Your digital fabric workshop
            </span>
          </div>

          <h1 className="mt-7 font-display text-5xl font-semibold leading-[1.05] tracking-tight text-forest sm:text-6xl lg:text-7xl">
            <span className="animate-rise block" style={{ animationDelay: '120ms' }}>
              Every scrap
            </span>
            <span className="animate-rise block" style={{ animationDelay: '240ms' }}>
              has a{' '}
              <span className="relative inline-block italic text-terracotta">
                story.
                <svg
                  viewBox="0 0 200 12"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                  className="absolute -bottom-2 left-0 h-3 w-full"
                >
                  <path
                    className="draw-line"
                    d="M2 8 C 30 1, 62 13, 96 6 S 160 3, 198 7"
                    fill="none"
                    stroke="#C77D55"
                    strokeWidth={3}
                    strokeLinecap="round"
                    pathLength={1}
                  />
                </svg>
              </span>
            </span>
          </h1>

          <p
            className="animate-rise mt-7 max-w-md text-base leading-relaxed text-ink-soft sm:text-lg"
            style={{ animationDelay: '380ms' }}
          >
            Arrange colorful pieces of batik-inspired fabric into Indonesian flowers and designs of
            your own. No needle, no thread. Just pattern, color, and imagination.
          </p>

          <div
            className="animate-rise mt-9 flex flex-wrap items-center gap-3"
            style={{ animationDelay: '500ms' }}
          >
            <LinkButton to="create" variant="primary">
              Start Creating
              <ArrowRight
                size={17}
                aria-hidden="true"
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </LinkButton>
            <LinkButton to="challenges" variant="secondary">
              Browse Challenges
            </LinkButton>
          </div>

          <ul
            className="animate-rise mt-10 flex flex-wrap gap-x-7 gap-y-3 text-sm text-ink-soft"
            style={{ animationDelay: '620ms' }}
          >
            {HIGHLIGHTS.map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-2">
                <Icon size={16} className="text-terracotta" aria-hidden="true" />
                {label}
              </li>
            ))}
          </ul>
        </div>

        <HeroCollage />
      </Container>
    </section>
  )
}