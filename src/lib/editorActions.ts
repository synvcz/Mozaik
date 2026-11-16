import { useCollectionStore } from '../store/collectionStore'
import { useEditorStore } from '../store/editorStore'
import { useNavigationStore } from '../store/navigationStore'
import { useUiStore } from '../store/uiStore'
import type { Artwork, TemplateId } from '../types/editor'

/** Saves the current canvas to My Collection. Returns null when the canvas is empty. */
export function saveDraftToCollection(): Artwork | null {
  const editor = useEditorStore.getState()
  if (editor.pieces.length === 0) return null

  const now = Date.now()
  const artwork: Artwork = {
    id: editor.artworkId,
    title: editor.title.trim() || 'Untitled Artwork',
    author: editor.author.trim() || 'Anonymous',
    pieces: editor.pieces,
    templateId: editor.templateId,
    createdAt: editor.createdAt ?? now,
    updatedAt: now,
  }
  useCollectionStore.getState().saveArtwork(artwork)
  editor.markSaved(artwork.createdAt)
  return artwork
}

function keepPreviousDraft() {
  if (saveDraftToCollection()) {
    useUiStore.getState().pushToast('Your previous canvas was saved to My Collection.', 'info')
  }
}

export function startTemplate(id: TemplateId | null) {
  keepPreviousDraft()
  useEditorStore.getState().startFromTemplate(id)
  useNavigationStore.getState().navigate('create')
}

export function continueEditing(artwork: Artwork) {
  if (useEditorStore.getState().artworkId !== artwork.id) keepPreviousDraft()
  useEditorStore.getState().loadArtwork(artwork)
  useNavigationStore.getState().navigate('create')
}