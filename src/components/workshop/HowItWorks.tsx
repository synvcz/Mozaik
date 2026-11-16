import { Images, Layers3, Palette } from 'lucide-react'
import Reveal from '../common/Reveal'
import SectionHeading from '../common/SectionHeading'
import Container from '../layout/Container'

const STEPS = [
  {
    icon: Palette,
    title: 'Pick your fabric',
    text: 'Choose from batik, kawung, parang, floral, polka dot and plain fabrics in a warm palette.',
  },
  {
    icon: Layers3,
    title: 'Arrange the pieces',
    text: 'Drag, rotate, resize and layer each piece until your collage feels just right.',
  },
  {
    icon: Images,
    title: 'Share to Galeri',
    text: 'Give your artwork a title and publish it for everyone to admire and like.',
  },
]

export default function HowItWorks() {
  return (
    <section className="py-20 sm:py-28">
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow="How it works"
            title="From scraps to a finished artwork"
            description="Three simple steps, no experience required."
          />
        </Reveal>

        <div className="grid gap-5 md:grid-cols-3">
          {STEPS.map(({ icon: Icon, title, text }, i) => (
            <Reveal key={title} delay={i * 120}>
              <article className="group h-full rounded-3xl border border-forest/10 bg-white p-7 transition duration-300 hover:-translate-y-1.5 hover:shadow-xl">
                <div className="flex items-center justify-between">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-sage-soft text-forest transition-colors duration-300 group-hover:bg-forest group-hover:text-ivory">
                    <Icon size={22} aria-hidden="true" />
                  </span>
                  <span className="font-display text-4xl font-semibold text-forest/15">
                    0{i + 1}
                  </span>
                </div>
                <h3 className="mt-6 font-display text-xl font-semibold text-forest">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{text}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  )
}