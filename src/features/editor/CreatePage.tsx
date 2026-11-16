import { useEffect, useState } from 'react'
import { Eye, EyeOff, X } from 'lucide-react'
import ArtworkPreviewDialog, { type PreviewableArtwork } from '../../components/artwork/ArtworkPreviewDialog'
import PublishDialog, { type PublishDraft } from '../../components/artwork/PublishDialog'
import ActionButton from '../../components/common/ActionButton'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import EditorCanvas from '../../components/editor/EditorCanvas'
import EditorToolbar from '../../components/editor/EditorToolbar'
import LayersPanel from '../../components/editor/LayersPanel'
import PiecePalette from '../../components/editor/PiecePalette'
import PropertiesPanel from '../../components/editor/PropertiesPanel'
import TemplatePicker from '../../components/editor/TemplatePicker'
import { getTemplate } from '../../data/templates'
import { saveDraftToCollection } from '../../lib/editorActions'
import { useEditorStore } from '../../store/editorStore'
import { useUiStore } from '../../store/uiStore'

function TemplateBanner() {
  const templateId = useEditorStore((s) => s.templateId)
  const guideVisible = useEditorStore((s) => s.guideVisible)
  const toggleGuide = useEditorStore((s) => s.toggleGuide)
  const setTemplate = useEditorStore((s) => s.setTemplate)
  const template = getTemplate(templateId)
  if (!template) return null

  return (
    <div className="mt-4 flex flex-wrap items-center gap-3 rounded-3xl border border-terracotta/30 bg-terracotta/10 p-4">
      <div className="min-w-0 flex-1">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-terracotta-deep">
          {template.kind === 'flower' ? 'Flower challenge' : 'Indonesian icon'}
        </p>
        <p className="font-display text-xl font-semibold text-forest">{template.name}</p>
        <p className="text-sm text-ink-soft">{template.objective}</p>
      </div>
      <ActionButton onClick={toggleGuide}>
        {guideVisible ? <EyeOff size={16} aria-hidden="true" /> : <Eye size={16} aria-hidden="true" />}
        {guideVisible ? 'Hide outline' : 'Show outline'}
      </ActionButton>
      <ActionButton onClick={() => setTemplate(null)}>
        <X size={16} aria-hidden="true" />
        Remove
      </ActionButton>
    </div>
  )
}

export default function CreatePage() {
  const [preview, setPreview] = useState<PreviewableArtwork | null>(null)
  const [publishDraft, setPublishDraft] = useState<PublishDraft | null>(null)
  const [confirmClear, setConfirmClear] = useState(false)

  // Keyboard shortcuts: undo/redo and delete.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement | null
      if (el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.tagName === 'SELECT' || el.isContentEditable)) return
      if (document.querySelector('[role="dialog"]')) return
      const state = useEditorStore.getState()
      const mod = e.ctrlKey || e.metaKey
      const key = e.key.toLowerCase()
      if (mod && key === 'z') {
        e.preventDefault()
        if (e.shiftKey) state.redo()
        else state.undo()
      } else if (mod && key === 'y') {
        e.preventDefault()
        state.redo()
      } else if ((e.key === 'Delete' || e.key === 'Backspace') && state.selectedId) {
        e.preventDefault()
        state.removePiece(state.selectedId)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const handlePreview = () => {
    const s = useEditorStore.getState()
    if (s.pieces.length === 0) {
      useUiStore.getState().pushToast('Add some pieces to preview your artwork.', 'error')
      return
    }
    setPreview({ title: s.title, author: s.author, pieces: s.pieces })
  }

  const handlePublish = () => {
    const saved = saveDraftToCollection()
    if (!saved) {
      useUiStore.getState().pushToast('Add some pieces before publishing.', 'error')
      return
    }
    const s = useEditorStore.getState()
    setPublishDraft({ title: s.title, author: s.author, pieces: s.pieces, templateId: s.templateId })
  }

  return (
    <div className="mx-auto w-full max-w-[1400px] px-4 py-5 sm:px-6">
      <EditorToolbar
        onPreview={handlePreview}
        onPublish={handlePublish}
        onClear={() => setConfirmClear(true)}
      />
      <TemplateBanner />

      <div className="mt-4 grid gap-4 lg:grid-cols-[280px_minmax(0,1fr)_300px]">
        <div className="order-2 space-y-4 lg:order-1">
          <PiecePalette />
          <TemplatePicker />
        </div>
        <div className="order-1 lg:order-2">
          <EditorCanvas />
        </div>
        <div className="order-3 space-y-4">
          <PropertiesPanel />
          <LayersPanel />
        </div>
      </div>

      {preview && <ArtworkPreviewDialog artwork={preview} onClose={() => setPreview(null)} />}
      {publishDraft && <PublishDialog draft={publishDraft} onClose={() => setPublishDraft(null)} />}
      {confirmClear && (
        <ConfirmDialog
          title="Clear the canvas?"
          message="All pieces will be removed. You can still bring them back with Undo."
          confirmLabel="Clear canvas"
          onCancel={() => setConfirmClear(false)}
          onConfirm={() => {
            useEditorStore.getState().clearCanvas()
            setConfirmClear(false)
            useUiStore.getState().pushToast('Canvas cleared.', 'info')
          }}
        />
      )}
    </div>
  )
}