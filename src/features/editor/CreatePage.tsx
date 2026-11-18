import { useEffect, useState } from 'react'
import { Eye, EyeOff, Magnet, X } from 'lucide-react'
import ArtworkPreviewDialog, { type PreviewableArtwork } from '../../components/artwork/ArtworkPreviewDialog'
import PublishDialog, { type PublishDraft } from '../../components/artwork/PublishDialog'
import ActionButton from '../../components/common/ActionButton'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import EditorCanvas from '../../components/editor/EditorCanvas'
import EditorToolbar from '../../components/editor/EditorToolbar'
import LayersPanel from '../../components/editor/LayersPanel'
import MobileActionBar from '../../components/editor/MobileActionBar'
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
  const snapEnabled = useEditorStore((s) => s.snapEnabled)
  const toggleGuide = useEditorStore((s) => s.toggleGuide)
  const toggleSnap = useEditorStore((s) => s.toggleSnap)
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
        {snapEnabled && guideVisible && (
          <p className="mt-1 text-sm font-medium text-forest">
            Drag a piece onto the outline. It snaps to that part and takes its exact shape.
          </p>
        )}
      </div>
      <ActionButton onClick={toggleSnap} aria-pressed={snapEnabled}>
        <Magnet size={16} aria-hidden="true" />
        Snap: {snapEnabled ? 'On' : 'Off'}
      </ActionButton>
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
    <div className="mx-auto w-full max-w-[1400px] px-4 pb-24 pt-5 sm:px-6 lg:pb-8">
      <EditorToolbar
        onPreview={handlePreview}
        onPublish={handlePublish}
        onClear={() => setConfirmClear(true)}
      />
      <TemplateBanner />

      {/* Flex column on phones so the canvas can stay pinned while the panels scroll;
          three-column grid on large screens. */}
      <div className="mt-4 flex flex-col gap-4 lg:grid lg:grid-cols-[280px_minmax(0,1fr)_300px]">
        <div className="sticky top-[76px] z-20 order-1 -mx-4 bg-ivory px-4 pb-2 pt-1 shadow-[0_10px_10px_-10px_rgba(43,42,38,0.25)] sm:-mx-6 sm:px-6 lg:static lg:z-auto lg:order-2 lg:mx-0 lg:bg-transparent lg:p-0 lg:shadow-none">
          <EditorCanvas />
        </div>
        <div className="order-2 space-y-4 lg:order-1">
          <PiecePalette />
          <TemplatePicker />
        </div>
        <div className="order-3 space-y-4">
          <PropertiesPanel />
          <LayersPanel />
        </div>
      </div>

      <MobileActionBar />

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