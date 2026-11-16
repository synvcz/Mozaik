import { Palette, Scissors } from 'lucide-react'
import FlowerIllustration from './FlowerIllustration'

interface Tile {
  pattern: string
  color: string
  span: string
  caption?: boolean
}

// Laid out for a 4-column grid so tiles pack with no gaps.
const TILES: Tile[] = [
  { pattern: 'fab-parang', color: '#C77D55', span: 'col-span-2 row-span-2' },
  { pattern: 'fab-dots', color: '#E4C98E', span: '' },
  { pattern: 'fab-kawung', color: '#315C48', span: 'row-span-2' },
  { pattern: 'fab-floral', color: '#A7B69A', span: '' },
  { pattern: '', color: '#FFFDF8', span: 'col-span-2', caption: true },
  { pattern: 'fab-parang', color: '#8A4F36', span: 'row-span-2' },
  { pattern: 'fab-dots', color: '#315C48', span: '' },
  { pattern: 'fab-floral', color: '#E1A58A', span: 'col-span-2' },
  { pattern: 'fab-stripes', color: '#A7B69A', span: '' },
]

export default function HeroCollage() {
  return (
    <div className="relative mx-auto w-full max-w-[520px] p-4">
      <div className="animate-float-tilt relative">
        <div className="grid grid-cols-4 auto-rows-[72px] gap-2 rounded-[28px] border border-forest/10 bg-white/80 p-3 shadow-2xl shadow-forest/10 sm:auto-rows-[92px] sm:gap-2.5">
          {TILES.map((tile, i) => (
            <div
              key={i}
              className={`animate-pop ${tile.span}`}
              style={{ animationDelay: `${350 + i * 90}ms` }}
            >
              <div
                className={`h-full w-full rounded-2xl transition-transform duration-300 hover:scale-[1.04] ${tile.pattern} ${
                  tile.caption ? 'flex flex-col justify-center border border-forest/10 px-4' : ''
                }`}
                style={{ backgroundColor: tile.color }}
              >
                {tile.caption && (
                  <>
                    <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-terracotta">
                      No. 01 · Inspiration
                    </span>
                    <span className="font-display text-lg leading-tight text-forest">Ragam Motif</span>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="absolute left-1/2 top-1/2 grid h-16 w-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-ivory p-2 shadow-lg ring-4 ring-white sm:h-24 sm:w-24 sm:p-3">
          <FlowerIllustration id="bunga-sepatu" className="animate-spin-slow h-full w-full" />
        </div>
      </div>

      <div className="animate-float absolute -left-1 top-0 flex items-center gap-2 rounded-full border border-forest/10 bg-ivory px-4 py-2 text-xs font-semibold text-forest shadow-lg">
        <Palette size={15} className="text-terracotta" aria-hidden="true" />
        Batik · Kawung · Parang
      </div>
      <div className="animate-float absolute -right-1 bottom-2 flex items-center gap-2 rounded-full border border-forest/10 bg-ivory px-4 py-2 text-xs font-semibold text-forest shadow-lg [animation-delay:-3s]">
        <Scissors size={15} className="text-terracotta" aria-hidden="true" />
        Made piece by piece
      </div>
    </div>
  )
}