import { FABRIC_COLORS, PATTERNS } from '../../lib/patterns'
import { SHAPES } from '../../lib/shapes'
import { useEditorStore } from '../../store/editorStore'
import Panel from './Panel'
import PatternSwatch from './PatternSwatch'
import ShapeIcon from './ShapeIcon'

export default function PiecePalette() {
  const brushColor = useEditorStore((s) => s.brushColor)
  const brushShape = useEditorStore((s) => s.brushShape)
  const setBrushColor = useEditorStore((s) => s.setBrushColor)
  const setBrushShape = useEditorStore((s) => s.setBrushShape)
  const addPiece = useEditorStore((s) => s.addPiece)

  return (
    <Panel title="Fabric palette">
      <p className="mb-2 text-xs font-bold uppercase tracking-[0.15em] text-ink-soft">1 · Shape</p>
      <div className="grid grid-cols-6 gap-1.5">
        {SHAPES.map((s) => (
          <button
            key={s.id}
            type="button"
            title={s.label}
            aria-label={s.label}
            aria-pressed={brushShape === s.id}
            onClick={() => setBrushShape(s.id)}
            className={`grid h-11 place-items-center rounded-xl transition ${
              brushShape === s.id
                ? 'bg-forest text-ivory'
                : 'bg-ivory-deep text-forest hover:bg-sage/30'
            }`}
          >
            <ShapeIcon shape={s.id} className="h-6 w-6" />
          </button>
        ))}
      </div>

      <p className="mb-2 mt-5 text-xs font-bold uppercase tracking-[0.15em] text-ink-soft">2 · Color</p>
      <div className="grid grid-cols-6 gap-1.5">
        {FABRIC_COLORS.map((c) => (
          <button
            key={c.hex}
            type="button"
            title={c.name}
            aria-label={c.name}
            aria-pressed={brushColor === c.hex}
            onClick={() => setBrushColor(c.hex)}
            className={`h-9 rounded-full border transition ${
              brushColor === c.hex
                ? 'scale-110 border-forest ring-2 ring-forest ring-offset-2'
                : 'border-forest/20 hover:scale-105'
            }`}
            style={{ backgroundColor: c.hex }}
          />
        ))}
      </div>

      <p className="mb-1 mt-5 text-xs font-bold uppercase tracking-[0.15em] text-ink-soft">3 · Fabric</p>
      <p className="mb-2 text-xs text-ink-soft">
        Click or tap to add. On desktop you can also drag onto the canvas.
      </p>
      <div className="grid grid-cols-3 gap-1.5">
        {PATTERNS.map((p) => (
          // A div (not a button): Firefox does not start drags from <button draggable>.
          <div
            key={p.id}
            role="button"
            tabIndex={0}
            draggable
            aria-label={`Add ${p.label} fabric`}
            onDragStart={(e) => {
              e.dataTransfer.setData('application/x-mozaik-pattern', p.id)
              e.dataTransfer.effectAllowed = 'copy'
            }}
            onClick={() => addPiece(p.id)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                addPiece(p.id)
              }
            }}
            className="group flex cursor-grab select-none flex-col items-center gap-1.5 rounded-2xl p-1.5 text-xs font-semibold text-ink-soft transition hover:bg-sage/20 active:cursor-grabbing"
          >
            <PatternSwatch
              pattern={p.id}
              color={brushColor}
              className="h-16 w-full rounded-xl border border-forest/15 transition group-hover:scale-105"
            />
            {p.label}
          </div>
        ))}
      </div>
    </Panel>
  )
}