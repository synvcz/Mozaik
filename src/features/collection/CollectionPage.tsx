import { useState } from 'react'
import { Eye, Pencil, Trash2, Upload } from 'lucide-react'
import ArtworkPreviewDialog from '../../components/artwork/ArtworkPreviewDialog'
import ArtworkThumbnail from '../../components/artwork/ArtworkThumbnail'
import PublishDialog from '../../components/artwork/PublishDialog'
import ActionButton from '../../components/common/ActionButton'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import LinkButton from '../../components/common/LinkButton'
import Container from '../../components/layout/Container'
import { getTemplate } from '../../data/templates'
import { continueEditing } from '../../lib/editorActions'
import { useCollectionStore } from '../../store/collectionStore'
import { useUiStore } from '../../store/uiStore'
import type { Artwork } from '../../types/editor'

const formatDate = (ts: number) =>
  new Date(ts).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })

export default function CollectionPage() {
  const items = useCollectionStore((s) => s.items)
  const removeArtwork = useCollectionStore((s) => s.removeArtwork)
  const [previewing, setPreviewing] = useState<Artwork | null>(null)
  const [publishing, setPublishing] = useState<Artwork | null>(null)
  const [deleting, setDeleting] = useState<Artwork | null>(null)

  const sorted = [...items].sort((a, b) => b.updatedAt - a.updatedAt)

  return (
    <Container className="py-14 sm:py-20">
      <div className="mb-10 max-w-xl">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-terracotta">Session only</p>
        <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-forest sm:text-5xl">
          My Collection
        </h1>
        <p className="mt-3 leading-relaxed text-ink-soft">
          Everything you have saved in this session. Refreshing the page clears it, so publish the
          ones you love.
        </p>
      </div>

      {sorted.length === 0 ? (
        <div className="rounded-[32px] border-2 border-dashed border-sage px-6 py-16 text-center">
          <p className="font-display text-2xl font-semibold text-forest">Your collection is empty</p>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-ink-soft">
            Build a collage in the editor and press Save. It will show up here, ready to preview,
            edit or publish.
          </p>
          <LinkButton to="create" variant="primary" className="mt-6">
            Start Creating
          </LinkButton>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {sorted.map((a) => (
            <article
              key={a.id}
              className="overflow-hidden rounded-3xl border border-forest/10 bg-white transition duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="bg-ivory-deep">
                <ArtworkThumbnail pieces={a.pieces} label={a.title} />
              </div>
              <div className="p-4">
                <h2 className="truncate font-display text-lg font-semibold text-forest">{a.title}</h2>
                <p className="mt-0.5 text-sm text-ink-soft">
                  by {a.author} · {a.pieces.length} {a.pieces.length === 1 ? 'piece' : 'pieces'}
                </p>
                <p className="mt-1 text-xs text-ink-soft">
                  Created {formatDate(a.createdAt)}
                  {getTemplate(a.templateId) ? ` · ${getTemplate(a.templateId)?.name}` : ''}
                </p>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <ActionButton onClick={() => setPreviewing(a)}>
                    <Eye size={15} aria-hidden="true" />
                    Preview
                  </ActionButton>
                  <ActionButton variant="primary" onClick={() => continueEditing(a)}>
                    <Pencil size={15} aria-hidden="true" />
                    Edit
                  </ActionButton>
                  <ActionButton variant="accent" onClick={() => setPublishing(a)}>
                    <Upload size={15} aria-hidden="true" />
                    Publish
                  </ActionButton>
                  <ActionButton onClick={() => setDeleting(a)}>
                    <Trash2 size={15} aria-hidden="true" />
                    Delete
                  </ActionButton>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {previewing && <ArtworkPreviewDialog artwork={previewing} onClose={() => setPreviewing(null)} />}
      {publishing && (
        <PublishDialog
          draft={{
            title: publishing.title,
            author: publishing.author,
            pieces: publishing.pieces,
            templateId: publishing.templateId,
          }}
          onClose={() => setPublishing(null)}
        />
      )}
      {deleting && (
        <ConfirmDialog
          title="Delete this artwork?"
          message={`“${deleting.title}” will be removed from your collection. Anything already published to Galeri stays there.`}
          confirmLabel="Delete"
          onCancel={() => setDeleting(null)}
          onConfirm={() => {
            removeArtwork(deleting.id)
            setDeleting(null)
            useUiStore.getState().pushToast('Artwork deleted.', 'info')
          }}
        />
      )}
    </Container>
  )
}