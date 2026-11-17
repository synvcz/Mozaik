import { Copy, Redo2, Trash2, Undo2, type LucideIcon } from 'lucide-react'
import { useEditorStore } from '../../store/editorStore'

function BarButton({
  icon: Icon,
  label,
  onClick,
  disabled,
}: {
  icon: LucideIcon
  label: string
  onClick: () => void
  disabled?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="flex min-h-12 flex-1 flex-col items-center justify-center gap-0.5 rounded-2xl text-[11px] font-semibold text-forest transition active:bg-sage/30 disabled:pointer-events-none disabled:opacity-35"
    >
      <Icon size={20} aria-hidden="true" />
      {label}
    </button>
  )
}

/** Fixed bottom bar with the most-used editing actions. Hidden on large screens. */
export default function MobileActionBar() {
  const selectedId = useEditorStore((s) => s.selectedId)
  const canUndo = useEditorStore((s) => s.past.length > 0)
  const canRedo = useEditorStore((s) => s.future.length > 0)
  const undo = useEditorStore((s) => s.undo)
  const redo = useEditorStore((s) => s.redo)
  const removePiece = useEditorStore((s) => s.removePiece)
  const duplicatePiece = useEditorStore((s) => s.duplicatePiece)

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-forest/10 bg-ivory/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden">
      <div className="mx-auto flex max-w-md items-center gap-1 px-2 py-1.5">
        <BarButton icon={Undo2} label="Undo" onClick={undo} disabled={!canUndo} />
        <BarButton icon={Redo2} label="Redo" onClick={redo} disabled={!canRedo} />
        <BarButton
          icon={Copy}
          label="Duplicate"
          onClick={() => selectedId && duplicatePiece(selectedId)}
          disabled={!selectedId}
        />
        <BarButton
          icon={Trash2}
          label="Delete"
          onClick={() => selectedId && removePiece(selectedId)}
          disabled={!selectedId}
        />
      </div>
    </div>
  )
}