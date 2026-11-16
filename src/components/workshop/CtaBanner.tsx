import { ArrowRight } from 'lucide-react'
import LinkButton from '../common/LinkButton'
import Reveal from '../common/Reveal'
import Container from '../layout/Container'
import FlowerIllustration from './FlowerIllustration'

export default function CtaBanner() {
  return (
    <section className="pb-20 sm:pb-28">
      <Container>
        <Reveal>
          <div className="relative overflow-hidden rounded-[36px] bg-forest px-6 py-16 text-center sm:px-12 sm:py-20">
            <div aria-hidden="true" className="fab-kawung absolute inset-0 opacity-10" />
            <FlowerIllustration
              id="anggrek-bulan"
              className="animate-spin-slow absolute -left-16 -top-16 h-56 w-56 opacity-20"
            />
            <FlowerIllustration
              id="bunga-melati"
              className="animate-spin-slow absolute -bottom-20 -right-14 h-64 w-64 opacity-20 [animation-direction:reverse]"
            />

            <div className="relative">
              <h2 className="mx-auto max-w-xl font-display text-3xl font-semibold tracking-tight text-ivory sm:text-5xl">
                Ready to cut your first piece?
              </h2>
              <p className="mx-auto mt-4 max-w-md text-ivory/75">
                Your canvas is waiting. Pick a fabric and start arranging.
              </p>
              <LinkButton to="create" variant="accent" className="mt-8">
                Start Creating
                <ArrowRight
                  size={17}
                  aria-hidden="true"
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </LinkButton>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  )
}