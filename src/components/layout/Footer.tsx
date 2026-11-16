import { Layers3 } from 'lucide-react'
import { hrefFor, ROUTES } from '../../store/navigationStore'
import Container from './Container'

export default function Footer() {
  return (
    <footer className="border-t border-forest/10 bg-ivory-deep">
      <Container className="flex flex-col gap-8 py-10 sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-xs">
          <div className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-forest text-ivory">
              <Layers3 size={18} aria-hidden="true" />
            </span>
            <span className="font-display text-lg font-semibold text-forest">Mozaik Kain Perca</span>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-ink-soft">
            A fabric collage workshop inspired by Indonesian textiles and flowers. Creations last for
            this session only.
          </p>
        </div>

        <nav aria-label="Footer">
          <ul className="grid grid-cols-2 gap-x-10 gap-y-2 text-sm">
            {ROUTES.map((r) => (
              <li key={r.id}>
                <a
                  href={hrefFor(r.id)}
                  className="inline-block py-1 text-ink-soft transition-colors hover:text-forest"
                >
                  {r.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </Container>
    </footer>
  )
}