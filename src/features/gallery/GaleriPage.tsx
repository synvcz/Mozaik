import { useEffect, useMemo, useState } from 'react'
import { Clock, Database, Flame, Plus, RefreshCw } from 'lucide-react'
import ArtworkPreviewDialog from '../../components/artwork/ArtworkPreviewDialog'
import ActionButton from '../../components/common/ActionButton'
import LinkButton from '../../components/common/LinkButton'
import ArtworkCard from '../../components/gallery/ArtworkCard'
import Container from '../../components/layout/Container'
import { isSupabaseConfigured } from '../../lib/supabase'
import { useGalleryStore } from '../../store/galleryStore'
import { GALLERY_CATEGORIES, type GalleryCategory } from '../../types/gallery'

type Sort = 'newest' | 'popular'
type Filter = 'All' | GalleryCategory

function Skeleton() {
  return (
    <div
      className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
      aria-busy="true"
      aria-label="Loading artwork"
    >
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="animate-pulse overflow-hidden rounded-3xl border border-forest/10 bg-white"
        >
          <div className="aspect-[4/3] bg-sage-soft" />
          <div className="space-y-2 p-4">
            <div className="h-4 w-2/3 rounded-full bg-sage-soft" />
            <div className="h-3 w-1/3 rounded-full bg-sage-soft" />
          </div>
        </div>
      ))}
    </div>
  )
}

function Notice({
  title,
  text,
  children,
}: {
  title: string
  text: string
  children?: React.ReactNode
}) {
  return (
    <div className="rounded-[32px] border-2 border-dashed border-sage px-6 py-16 text-center">
      <p className="font-display text-2xl font-semibold text-forest">{title}</p>
      <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-ink-soft">{text}</p>
      {children}
    </div>
  )
}

export default function GaleriPage() {
  const items = useGalleryStore((s) => s.items)
  const status = useGalleryStore((s) => s.status)
  const error = useGalleryStore((s) => s.error)
  const fetchArtworks = useGalleryStore((s) => s.fetchArtworks)
  const toggleLike = useGalleryStore((s) => s.toggleLike)
  const [sort, setSort] = useState<Sort>('newest')
  const [filter, setFilter] = useState<Filter>('All')
  const [openId, setOpenId] = useState<string | null>(null)

  useEffect(() => {
    void fetchArtworks()
  }, [fetchArtworks])

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

  let body: React.ReactNode
  if (!isSupabaseConfigured) {
    body = (
      <Notice
        title="Galeri is not connected yet"
        text="Add your Supabase URL and key to .env.local, then restart the dev server. The README explains each step."
      >
        <Database size={28} className="mx-auto mt-5 text-sage" aria-hidden="true" />
      </Notice>
    )
  } else if (status === 'idle' || status === 'loading') {
    body = <Skeleton />
  } else if (status === 'error') {
    body = (
      <Notice title="Galeri could not load" text={error ?? 'Something went wrong.'}>
        <ActionButton variant="primary" className="mt-6" onClick={() => void fetchArtworks()}>
          <RefreshCw size={16} aria-hidden="true" />
          Try again
        </ActionButton>
      </Notice>
    )
  } else if (items.length === 0) {
    body = (
      <Notice
        title="Galeri is waiting for its first artwork"
        text="Nobody has published yet. Make a collage and be the first to share it."
      >
        <LinkButton to="create" variant="primary" className="mt-6">
          Start Creating
        </LinkButton>
      </Notice>
    )
  } else if (visible.length === 0) {
    body = (
      <Notice
        title="No artwork in this category yet"
        text="Try another category, or publish one yourself."
      />
    )
  } else {
    body = (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((a) => (
          <ArtworkCard
            key={a.id}
            artwork={a}
            onOpen={() => setOpenId(a.id)}
            onToggleLike={() => void toggleLike(a.id)}
          />
        ))}
      </div>
    )
  }

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
            <button
              key={c}
              type="button"
              aria-pressed={filter === c}
              onClick={() => setFilter(c)}
              className={chip(filter === c)}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Sort artworks">
          <button type="button" aria-pressed={sort === 'newest'} onClick={() => setSort('newest')} className={chip(sort === 'newest')}>
            <Clock size={15} aria-hidden="true" />
            Newest
          </button>
          <button type="button" aria-pressed={sort === 'popular'} onClick={() => setSort('popular')} className={chip(sort === 'popular')}>
            <Flame size={15} aria-hidden="true" />
            Most popular
          </button>
          {isSupabaseConfigured && (
            <button
              type="button"
              aria-label="Refresh Galeri"
              title="Refresh"
              onClick={() => void fetchArtworks()}
              className="grid h-10 w-10 place-items-center rounded-full border border-forest/20 text-forest transition hover:bg-sage/25"
            >
              <RefreshCw size={15} aria-hidden="true" />
            </button>
          )}
        </div>
      </div>

      {body}

      {opened && <ArtworkPreviewDialog artwork={opened} onClose={() => setOpenId(null)} />}
    </Container>
  )
}