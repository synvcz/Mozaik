import { ArrowRight } from 'lucide-react'
import LinkButton from '../common/LinkButton'
import Reveal from '../common/Reveal'
import SectionHeading from '../common/SectionHeading'
import Container from '../layout/Container'

export default function RecentCreations() {
  // Wired to saved artwork in Milestone 2; until then there is nothing to show.
  return (
    <section className="py-20 sm:py-28">
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow="Recent creations"
            title="Your latest work"
            description="Artwork you create in this session will show up here."
          />
        </Reveal>

        <Reveal delay={120}>
          <div className="group flex flex-col items-center rounded-[32px] border-2 border-dashed border-sage px-6 py-14 text-center">
            <div className="animate-float relative mb-8 h-24 w-32" aria-hidden="true">
              <div
                className="fab-stripes absolute left-0 top-4 h-16 w-16 -rotate-6 rounded-xl shadow-md transition-transform duration-500 group-hover:-translate-x-3 group-hover:-rotate-12"
                style={{ backgroundColor: '#C77D55' }}
              />
              <div
                className="fab-kawung absolute left-8 top-0 h-16 w-16 rotate-3 rounded-xl shadow-md transition-transform duration-500 group-hover:-translate-y-2"
                style={{ backgroundColor: '#315C48' }}
              />
              <div
                className="fab-dots absolute left-16 top-5 h-16 w-16 rotate-12 rounded-xl shadow-md transition-transform duration-500 group-hover:translate-x-3 group-hover:rotate-[18deg]"
                style={{ backgroundColor: '#E4C98E' }}
              />
            </div>
            <h3 className="font-display text-2xl font-semibold text-forest">
              Nothing here yet, and that&rsquo;s the fun part
            </h3>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-ink-soft">
              Start a blank canvas or pick a flower challenge. Creations are kept for this session
              only, so publish your favorites to Galeri.
            </p>
            <LinkButton to="create" variant="primary" className="mt-7">
              Open the editor
              <ArrowRight
                size={16}
                aria-hidden="true"
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </LinkButton>
          </div>
        </Reveal>
      </Container>
    </section>
  )
}