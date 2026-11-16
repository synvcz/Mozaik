import { Flower2 } from 'lucide-react'

const PATTERNS = ['Batik', 'Kawung', 'Parang', 'Floral', 'Polka dots', 'Plain fabric']

function Row({ hidden = false }: { hidden?: boolean }) {
  return (
    <ul className="flex shrink-0 items-center gap-10 pr-10" aria-hidden={hidden || undefined}>
      {PATTERNS.map((name) => (
        <li key={name} className="flex items-center gap-10">
          <span className="font-display text-2xl italic text-ivory sm:text-3xl">{name}</span>
          <Flower2 size={20} className="text-sage" aria-hidden="true" />
        </li>
      ))}
    </ul>
  )
}

export default function PatternMarquee() {
  return (
    <section aria-label="Fabric patterns" className="marquee overflow-hidden bg-forest py-6">
      <div className="marquee-track">
        <Row />
        <Row hidden />
      </div>
    </section>
  )
}