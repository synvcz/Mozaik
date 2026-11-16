import { useMemo, useState } from 'react'
import { Clock, Flame, Plus } from 'lucide-react'
import ArtworkPreviewDialog from '../../components/artwork/ArtworkPreviewDialog'
import LinkButton from '../../components/common/LinkButton'
import Container from '../../components/layout/Container'
import ArtworkCard from '../../components/gallery/ArtworkCard'
import { useGalleryStore } from '../../store/galleryStore'
import { GALLERY_CATEGORIES, type GalleryCategory } from '../../types/gallery'

type Sort = 'newest' | 'popular'
type Filter = 'All' | GalleryCategory

export default function GaleriPage() {
  const items = useGalleryStore((s) => s.items)
  const toggleLike = useGalleryStore((s) => s.toggleLike)
  const [sort, setSort] = useState<Sort>('newest')
  const [filter, setFilter] = useState<Filter>('All')
  const [openId, setOpenId] = useState<string | null>(null)

  const visible = useMemo(() => {
    const filtered = filter === 'All' ? items : items.filter((a) => a.category === filter)
    return [...filtered].sort((a, b) =>
      sort === 'newest' ? b.createdAt - a.createdAt : b.likes - a.likes || b.createdAt - a.createdAt,
    )
  }, [items, sort, filter])

  const opened = items.find((a) => a.id === openId)

  const chip = (active: boolean) =>
    `inline-flex h-10 items-center gap-2 rounded-full px-4 text-sm font-semibold transition ${
      active ? 'bg-forest text-ivory' : 'border border-forest/20 text-forest hover:bg-sage/25'
    }`

  return (
    <Container className="py-14 sm:py-20">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div className="max-w-xl">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-terracotta">Community</p>
          <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-forest sm:text-5xl">
            Galeri
          </h1>
          <p className="mt-3 leading-relaxed text-ink-soft">
            Browse fabric collages made by the community, and like the ones that make you smile.
          </p>
        </div>
        <LinkButton to="create" variant="accent">
          <Plus size={16} aria-hidden="true" />
          Share your artwork
        </LinkButton>
      </div>

      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
          {(['All', ...GALLERY_CATEGORIES] as Filter[]).map((c) => (
            <button key={c} type="button" aria-pressed={filter === c} onClick={() => setFilter(c)} className={chip(filter === c)}>
              {c}
            </button>
          ))}
        </div>
        <div className="flex gap-2" role="group" aria-label="Sort artworks">
          <button type="button" aria-pressed={sort === 'newest'} onClick={() => setSort('newest')} className={chip(sort === 'newest')}>
            <Clock size={15} aria-hidden="true" />
            Newest
          </button>
          <button type="button" aria-pressed={sort === 'popular'} onClick={() => setSort('popular')} className={chip(sort === 'popular')}>
            <Flame size={15} aria-hidden="true" />
            Most popular
          </button>
        </div>
      </div>

      {visible.length === 0 ? (
        <div className="rounded-[32px] border-2 border-dashed border-sage px-6 py-16 text-center">
          <p className="font-display text-2xl font-semibold text-forest">No artwork in this category yet</p>
          <p className="mt-2 text-sm text-ink-soft">Be the first to publish one.</p>
          <LinkButton to="create" variant="primary" className="mt-6">
            Start Creating
          </LinkButton>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((a) => (
            <ArtworkCard
              key={a.id}
              artwork={a}
              onOpen={() => setOpenId(a.id)}
              onToggleLike={() => toggleLike(a.id)}
            />
          ))}
        </div>
      )}

      {opened && <ArtworkPreviewDialog artwork={opened} onClose={() => setOpenId(null)} />}
    </Container>
  )
}