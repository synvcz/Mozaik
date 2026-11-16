import { useEffect, useState } from 'react'
import {
  Bookmark,
  Images,
  Layers3,
  Menu,
  Scissors,
  Sparkles,
  Trophy,
  X,
  type LucideIcon,
} from 'lucide-react'
import {
  hrefFor,
  ROUTES,
  useNavigationStore,
  type RouteId,
} from '../../store/navigationStore'

const ICONS: Record<RouteId, LucideIcon> = {
  workshop: Sparkles,
  create: Scissors,
  challenges: Trophy,
  galeri: Images,
  collection: Bookmark,
}

export default function NavBar() {
  const route = useNavigationStore((s) => s.route)
  const [scrolled, setScrolled] = useState(false)
  // Storing the route the menu was opened on means it closes automatically when the route changes.
  const [openOnRoute, setOpenOnRoute] = useState<RouteId | null>(null)
  const menuOpen = openOnRoute === route

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`sticky top-0 z-40 border-b transition-colors duration-300 ${
        scrolled ? 'border-forest/10 bg-ivory/90 backdrop-blur' : 'border-transparent bg-ivory'
      }`}
    >
      <div className="mx-auto flex h-18 w-full max-w-6xl items-center justify-between px-5 sm:px-8">
        <a href={hrefFor('workshop')} className="group flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-forest text-ivory transition-transform duration-500 group-hover:rotate-12">
            <Layers3 size={20} aria-hidden="true" />
          </span>
          <span className="font-display text-lg font-semibold text-forest">Mozaik Kain Perca</span>
        </a>

        <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
          {ROUTES.map((r) => {
            const Icon = ICONS[r.id]
            const active = r.id === route
            return (
              <a
                key={r.id}
                href={hrefFor(r.id)}
                aria-current={active ? 'page' : undefined}
                className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium transition-colors lg:px-4 ${
                  active
                    ? 'bg-forest text-ivory'
                    : 'text-ink-soft hover:bg-sage/25 hover:text-forest'
                }`}
              >
                <Icon size={16} aria-hidden="true" className="hidden lg:block" />
                {r.label}
              </a>
            )
          })}
        </nav>

        <button
          type="button"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          onClick={() => setOpenOnRoute(menuOpen ? null : route)}
          className="grid h-11 w-11 place-items-center rounded-full text-forest transition-colors hover:bg-sage/25 md:hidden"
        >
          {menuOpen ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
        </button>
      </div>

      {menuOpen && (
        <nav
          id="mobile-menu"
          aria-label="Mobile"
          className="animate-page border-t border-forest/10 bg-ivory px-5 pb-5 pt-3 md:hidden"
        >
          <ul className="flex flex-col gap-1">
            {ROUTES.map((r) => {
              const Icon = ICONS[r.id]
              const active = r.id === route
              return (
                <li key={r.id}>
                  <a
                    href={hrefFor(r.id)}
                    onClick={() => setOpenOnRoute(null)}
                    aria-current={active ? 'page' : undefined}
                    className={`flex min-h-12 items-center gap-3 rounded-2xl px-4 text-base font-medium ${
                      active ? 'bg-forest text-ivory' : 'text-forest hover:bg-sage/25'
                    }`}
                  >
                    <Icon size={18} aria-hidden="true" />
                    {r.label}
                  </a>
                </li>
              )
            })}
          </ul>
        </nav>
      )}
    </header>
  )
}