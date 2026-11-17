import { Download } from 'lucide-react'
import { downloadArtworkPng } from '../../lib/exportPng'
import { useUiStore } from '../../store/uiStore'
import type { FabricPiece } from '../../types/editor'
import ActionButton from '../common/ActionButton'
import Modal from '../common/Modal'
import ArtworkThumbnail from './ArtworkThumbnail'

export interface PreviewableArtwork {
  title: string
  author: string
  description?: string
  pieces: FabricPiece[]
}

export default function ArtworkPreviewDialog({
  artwork,
  onClose,
}: {
  artwork: PreviewableArtwork
  onClose: () => void
}) {
  const handleDownload = async () => {
    try {
      await downloadArtworkPng(artwork.pieces, artwork.title)
      useUiStore.getState().pushToast('PNG downloaded.', 'success')
    } catch {
      useUiStore.getState().pushToast('Could not create the PNG.', 'error')
    }
  }

  return (
    <Modal title={artwork.title || 'Untitled Artwork'} onClose={onClose} size="lg">
      <div className="overflow-hidden rounded-2xl border border-forest/10 bg-white">
        <ArtworkThumbnail pieces={artwork.pieces} label={`${artwork.title} by ${artwork.author}`} />
      </div>
      <p className="mt-4 text-sm text-ink-soft">
        by <span className="font-semibold text-forest">{artwork.author || 'Anonymous'}</span>
      </p>
      {artwork.description && (
        <p className="mt-2 leading-relaxed text-ink-soft">{artwork.description}</p>
      )}
      <div className="mt-6 flex flex-wrap justify-end gap-3">
        <ActionButton onClick={() => void handleDownload()} disabled={artwork.pieces.length === 0}>
          <Download size={16} aria-hidden="true" />
          Download PNG
        </ActionButton>
        <ActionButton variant="primary" onClick={onClose}>
          Close
        </ActionButton>
      </div>
    </Modal>
  )
}