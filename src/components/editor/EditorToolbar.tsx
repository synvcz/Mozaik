import {
  ArrowLeft,
  Copy,
  Eraser,
  Eye,
  Redo2,
  Save,
  Trash2,
  Undo2,
  Upload,
  type LucideIcon,
} from 'lucide-react'
import { saveDraftToCollection } from '../../lib/editorActions'
import { useEditorStore } from '../../store/editorStore'
import { hrefFor } from '../../store/navigationStore'
import { useUiStore } from '../../store/uiStore'

interface ToolButtonProps {
  icon: LucideIcon
  label: string
  onClick: () => void
  disabled?: boolean
  showLabel?: boolean
  tone?: 'default' | 'primary' | 'accent'
}

const TONES = {
  default: 'text-forest hover:bg-sage/25',
  primary: 'bg-forest text-ivory hover:bg-forest-deep',
  accent: 'bg-terracotta text-white hover:bg-terracotta-deep',
}

function ToolButton({ icon: Icon, label, onClick, disabled, showLabel, tone = 'default' }: ToolButtonProps) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex h-11 min-w-11 items-center justify-center gap-2 rounded-full px-3 text-sm font-semibold transition disabled:pointer-events-none disabled:opacity-35 ${TONES[tone]}`}
    >
      <Icon size={18} aria-hidden="true" />
      {showLabel && <span className="hidden sm:inline">{label}</span>}
    </button>
  )
}

const inputClass =
  'h-11 w-full rounded-full border border-forest/20 bg-ivory px-4 text-sm text-ink outline-none transition focus:border-forest focus:ring-2 focus:ring-sage'

interface EditorToolbarProps {
  onPreview: () => void
  onPublish: () => void
  onClear: () => void
}

export default function EditorToolbar({ onPreview, onPublish, onClear }: EditorToolbarProps) {
  const title = useEditorStore((s) => s.title)
  const author = useEditorStore((s) => s.author)
  const selectedId = useEditorStore((s) => s.selectedId)
  const hasPieces = useEditorStore((s) => s.pieces.length > 0)
  const canUndo = useEditorStore((s) => s.past.length > 0)
  const canRedo = useEditorStore((s) => s.future.length > 0)
  const setTitle = useEditorStore((s) => s.setTitle)
  const setAuthor = useEditorStore((s) => s.setAuthor)
  const undo = useEditorStore((s) => s.undo)
  const redo = useEditorStore((s) => s.redo)
  const removePiece = useEditorStore((s) => s.removePiece)
  const duplicatePiece = useEditorStore((s) => s.duplicatePiece)

  const handleSave = () => {
    const saved = saveDraftToCollection()
    if (!saved) {
      useUiStore.getState().pushToast('Add at least one piece before saving.', 'error')
      return
    }
    useUiStore.getState().pushToast('Saved to My Collection.', 'success')
  }

  return (
    <div className="rounded-3xl border border-forest/10 bg-white p-3 shadow-sm">
      <div className="flex flex-wrap items-center gap-3">
        <a
          href={hrefFor('workshop')}
          className="inline-flex h-11 items-center gap-2 rounded-full px-3 text-sm font-semibold text-forest transition-colors hover:bg-sage/25"
        >
          <ArrowLeft size={18} aria-hidden="true" />
          <span className="hidden sm:inline">Workshop</span>
          <span className="sr-only sm:hidden">Back to Workshop</span>
        </a>

        <div className="flex min-w-[240px] flex-1 flex-wrap gap-2">
          <div className="min-w-[140px] flex-[3]">
            <label htmlFor="artwork-title" className="sr-only">
              Artwork title
            </label>
            <input
              id="artwork-title"
              value={title}
              maxLength={60}
              placeholder="Artwork title"
              onChange={(e) => setTitle(e.target.value)}
              className={inputClass}
            />
          </div>
          <div className="min-w-[120px] flex-[2]">
            <label htmlFor="artwork-author" className="sr-only">
              Your display name
            </label>
            <input
              id="artwork-author"
              value={author}
              maxLength={40}
              placeholder="Your name"
              onChange={(e) => setAuthor(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-1">
          <ToolButton icon={Undo2} label="Undo" onClick={undo} disabled={!canUndo} />
          <ToolButton icon={Redo2} label="Redo" onClick={redo} disabled={!canRedo} />
          <ToolButton
            icon={Copy}
            label="Duplicate piece"
            onClick={() => selectedId && duplicatePiece(selectedId)}
            disabled={!selectedId}
          />
          <ToolButton
            icon={Trash2}
            label="Delete piece"
            onClick={() => selectedId && removePiece(selectedId)}
            disabled={!selectedId}
          />
          <ToolButton icon={Eraser} label="Clear canvas" onClick={onClear} disabled={!hasPieces} />
          <ToolButton icon={Eye} label="Preview" onClick={onPreview} showLabel />
          <ToolButton icon={Save} label="Save" onClick={handleSave} showLabel tone="primary" />
          <ToolButton icon={Upload} label="Publish" onClick={onPublish} showLabel tone="accent" />
        </div>
      </div>
    </div>
  )
}