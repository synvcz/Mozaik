import TemplateCard from '../../components/challenges/TemplateCard'
import Reveal from '../../components/common/Reveal'
import SectionHeading from '../../components/common/SectionHeading'
import Container from '../../components/layout/Container'
import { FLOWER_TEMPLATES, ICON_TEMPLATES } from '../../data/templates'

export default function ChallengesPage() {
  return (
    <Container className="py-14 sm:py-20">
      <SectionHeading
        eyebrow="Challenges"
        title="Bloom in fabric"
        description="Pick an Indonesian flower. A dashed outline will guide you in the editor, but this is a creative activity, not a test. Make it your own."
      />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {FLOWER_TEMPLATES.map((t, i) => (
          <Reveal key={t.id} delay={(i % 3) * 100}>
            <TemplateCard template={t} />
          </Reveal>
        ))}
      </div>

      <div className="mt-20">
        <SectionHeading
          eyebrow="More outlines"
          title="Icons of Indonesia"
          description="Wayang, Minangkabau architecture, Java's great temple and a festive feast. Build them from patterned pieces."
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {ICON_TEMPLATES.map((t, i) => (
            <Reveal key={t.id} delay={i * 100}>
              <TemplateCard template={t} />
            </Reveal>
          ))}
        </div>
      </div>
    </Container>
  )
}