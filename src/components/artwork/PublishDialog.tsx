import { useState, type FormEvent } from 'react'
import { Upload } from 'lucide-react'
import { isSupabaseConfigured } from '../../lib/supabase'
import { useGalleryStore } from '../../store/galleryStore'
import { useNavigationStore } from '../../store/navigationStore'
import { useUiStore } from '../../store/uiStore'
import type { FabricPiece, TemplateId } from '../../types/editor'
import ActionButton from '../common/ActionButton'
import Modal from '../common/Modal'
import ArtworkThumbnail from './ArtworkThumbnail'

export interface PublishDraft {
  title: string
  author: string
  pieces: FabricPiece[]
  templateId: TemplateId | null
}

interface Errors {
  title?: string
  author?: string
}

const inputClass =
  'mt-1.5 w-full rounded-2xl border border-forest/20 bg-white px-4 py-3 text-sm text-ink outline-none transition focus:border-forest focus:ring-2 focus:ring-sage'

export default function PublishDialog({
  draft,
  onClose,
}: {
  draft: PublishDraft
  onClose: () => void
}) {
  const publish = useGalleryStore((s) => s.publish)
  const [title, setTitle] = useState(draft.title === 'Untitled Artwork' ? '' : draft.title)
  const [author, setAuthor] = useState(draft.author)
  const [description, setDescription] = useState('')
  const [errors, setErrors] = useState<Errors>({})
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (submitting) return

    const t = title.trim()
    const a = author.trim()
    const next: Errors = {}
    if (!t) next.title = 'Give your artwork a title.'
    if (!a) next.author = 'Enter the name you want shown as the creator.'
    if (next.title || next.author) {
      setErrors(next)
      return
    }

    setSubmitting(true)
    try {
      await publish({
        title: t,
        author: a,
        description: description.trim(),
        pieces: draft.pieces,
        templateId: draft.templateId,
      })
      useUiStore.getState().pushToast(`“${t}” is now live in Galeri.`, 'success')
      onClose()
      useNavigationStore.getState().navigate('galeri')
    } catch (err) {
      useUiStore
        .getState()
        .pushToast(err instanceof Error ? err.message : 'Publishing failed. Please try again.', 'error')
      setSubmitting(false)
    }
  }

  return (
    <Modal title="Publish to Galeri" onClose={onClose} size="md">
      <form onSubmit={handleSubmit} noValidate className="grid gap-5 sm:grid-cols-[180px_1fr]">
        <div className="self-start overflow-hidden rounded-2xl border border-forest/10 bg-white">
          <ArtworkThumbnail pieces={draft.pieces} />
        </div>

        <div className="space-y-4">
          {!isSupabaseConfigured && (
            <p className="rounded-2xl bg-terracotta/10 p-3 text-sm text-terracotta-deep">
              Galeri is not connected to its database yet, so publishing will not work. See the
              README to set it up.
            </p>
          )}

          <div>
            <label htmlFor="pub-title" className="text-sm font-semibold text-forest">
              Artwork title <span className="text-terracotta">*</span>
            </label>
            <input
              id="pub-title"
              value={title}
              maxLength={60}
              onChange={(e) => setTitle(e.target.value)}
              aria-invalid={Boolean(errors.title)}
              aria-describedby={errors.title ? 'pub-title-error' : undefined}
              className={inputClass}
            />
            {errors.title && (
              <p id="pub-title-error" className="mt-1 text-sm font-medium text-terracotta-deep">
                {errors.title}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="pub-author" className="text-sm font-semibold text-forest">
              Creator name <span className="text-terracotta">*</span>
            </label>
            <input
              id="pub-author"
              value={author}
              maxLength={40}
              onChange={(e) => setAuthor(e.target.value)}
              aria-invalid={Boolean(errors.author)}
              aria-describedby={errors.author ? 'pub-author-error' : undefined}
              className={inputClass}
            />
            {errors.author && (
              <p id="pub-author-error" className="mt-1 text-sm font-medium text-terracotta-deep">
                {errors.author}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="pub-desc" className="text-sm font-semibold text-forest">
              Description <span className="font-normal text-ink-soft">(optional)</span>
            </label>
            <textarea
              id="pub-desc"
              rows={3}
              maxLength={200}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={inputClass}
            />
          </div>

          <div className="flex justify-end gap-3 pt-1">
            <ActionButton onClick={onClose} disabled={submitting}>
              Cancel
            </ActionButton>
            <ActionButton type="submit" variant="primary" disabled={submitting}>
              <Upload size={16} aria-hidden="true" />
              {submitting ? 'Publishing…' : 'Publish'}
            </ActionButton>
          </div>
        </div>
      </form>
    </Modal>
  )
}