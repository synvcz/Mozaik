import { Heart } from 'lucide-react'
import type { GalleryArtwork } from '../../types/gallery'
import ArtworkThumbnail from '../artwork/ArtworkThumbnail'

interface ArtworkCardProps {
  artwork: GalleryArtwork
  onOpen: () => void
  onToggleLike: () => void
}

export default function ArtworkCard({ artwork, onOpen, onToggleLike }: ArtworkCardProps) {
  return (
    <article className="group overflow-hidden rounded-3xl border border-forest/10 bg-white transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      <button
        type="button"
        onClick={onOpen}
        aria-label={`Open ${artwork.title}`}
        className="block w-full overflow-hidden bg-ivory-deep"
      >
        <ArtworkThumbnail
          pieces={artwork.pieces}
          label={`${artwork.title} by ${artwork.author}`}
          className="transition-transform duration-500 group-hover:scale-[1.03]"
        />
      </button>
      <div className="flex items-center justify-between gap-3 p-4">
        <div className="min-w-0">
          <h3 className="truncate font-display text-lg font-semibold text-forest">{artwork.title}</h3>
          <p className="truncate text-sm text-ink-soft">by {artwork.author}</p>
        </div>
        <button
          type="button"
          onClick={onToggleLike}
          aria-pressed={artwork.likedByMe}
          aria-label={artwork.likedByMe ? `Unlike ${artwork.title}` : `Like ${artwork.title}`}
          className={`inline-flex h-11 shrink-0 items-center gap-1.5 rounded-full px-4 text-sm font-semibold transition active:scale-90 ${
            artwork.likedByMe
              ? 'bg-terracotta text-white'
              : 'border border-forest/20 text-forest hover:bg-sage/25'
          }`}
        >
          <Heart size={16} aria-hidden="true" className={artwork.likedByMe ? 'fill-current' : ''} />
          <span className="tabular-nums">{artwork.likes}</span>
        </button>
      </div>
    </article>
  )
}