import { ChevronDown, ChevronsDown, ChevronsUp, ChevronUp, Trash2 } from 'lucide-react'
import { patternLabel } from '../../lib/patterns'
import { shapeLabel } from '../../lib/shapes'
import { useEditorStore } from '../../store/editorStore'
import Panel from './Panel'
import PatternSwatch from './PatternSwatch'

const iconButton =
  'grid h-9 w-9 shrink-0 place-items-center rounded-full text-forest transition hover:bg-sage/30 disabled:pointer-events-none disabled:opacity-30'

export default function LayersPanel() {
  const pieces = useEditorStore((s) => s.pieces)
  const selectedId = useEditorStore((s) => s.selectedId)
  const select = useEditorStore((s) => s.select)
  const moveLayer = useEditorStore((s) => s.moveLayer)
  const removePiece = useEditorStore((s) => s.removePiece)

  const selectedIndex = pieces.findIndex((p) => p.id === selectedId)
  const top = pieces.length - 1

  return (
    <Panel
      title="Layers"
      action={
        <div className="flex">
          <button
            type="button"
            title="Send to back"
            aria-label="Send selected piece to back"
            disabled={selectedIndex <= 0}
            onClick={() => selectedId && moveLayer(selectedId, 'back')}
            className={iconButton}
          >
            <ChevronsDown size={18} aria-hidden="true" />
          </button>
          <button
            type="button"
            title="Bring to front"
            aria-label="Bring selected piece to front"
            disabled={selectedIndex === -1 || selectedIndex === top}
            onClick={() => selectedId && moveLayer(selectedId, 'front')}
            className={iconButton}
          >
            <ChevronsUp size={18} aria-hidden="true" />
          </button>
        </div>
      }
    >
      {pieces.length === 0 ? (
        <p className="text-sm text-ink-soft">No pieces yet. Add fabric from the palette.</p>
      ) : (
        <ul className="max-h-72 space-y-1 overflow-y-auto pr-1">
          {[...pieces].reverse().map((piece, i) => {
            const index = top - i
            const active = piece.id === selectedId
            return (
              <li
                key={piece.id}
                className={`flex items-center gap-1 rounded-2xl pr-1 transition ${
                  active ? 'bg-sage-soft' : 'hover:bg-ivory-deep'
                }`}
              >
                <button
                  type="button"
                  onClick={() => select(piece.id)}
                  aria-pressed={active}
                  className="flex min-w-0 flex-1 items-center gap-3 rounded-2xl p-2 text-left"
                >
                  <PatternSwatch
                    pattern={piece.pattern}
                    color={piece.color}
                    className="h-8 w-8 shrink-0 rounded-lg border border-forest/15"
                  />
                  <span className="truncate text-sm font-medium text-forest">
                    {shapeLabel(piece.shape)} · {patternLabel(piece.pattern)}
                  </span>
                </button>
                <button
                  type="button"
                  aria-label="Move layer up"
                  disabled={index === top}
                  onClick={() => moveLayer(piece.id, 'forward')}
                  className={iconButton}
                >
                  <ChevronUp size={16} aria-hidden="true" />
                </button>
                <button
                  type="button"
                  aria-label="Move layer down"
                  disabled={index === 0}
                  onClick={() => moveLayer(piece.id, 'backward')}
                  className={iconButton}
                >
                  <ChevronDown size={16} aria-hidden="true" />
                </button>
                <button
                  type="button"
                  aria-label="Remove layer"
                  onClick={() => removePiece(piece.id)}
                  className={iconButton}
                >
                  <Trash2 size={16} aria-hidden="true" />
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </Panel>
  )
}