import { ArrowRight } from 'lucide-react'
import { CHALLENGES } from '../../data/challenges'
import LinkButton from '../common/LinkButton'
import Reveal from '../common/Reveal'
import SectionHeading from '../common/SectionHeading'
import Container from '../layout/Container'
import ChallengeCard from './ChallengeCard'

export default function FeaturedChallenges() {
  return (
    <section className="bg-ivory-deep py-20 sm:py-28">
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow="Featured challenges"
            title="Bloom in fabric"
            description="Pick an Indonesian flower and build it from patterned pieces. Use the guide for inspiration, not perfection."
            action={
              <LinkButton to="challenges" variant="secondary">
                View all
                <ArrowRight size={16} aria-hidden="true" />
              </LinkButton>
            }
          />
        </Reveal>
      </Container>

      <Reveal delay={120}>
        <Container>
          <div className="-mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 sm:-mx-8 sm:px-8 lg:mx-0 lg:grid lg:grid-cols-5 lg:overflow-visible lg:px-0 lg:pb-0">
            {CHALLENGES.map((challenge) => (
              <ChallengeCard key={challenge.id} challenge={challenge} />
            ))}
          </div>
        </Container>
      </Reveal>
    </section>
  )
}