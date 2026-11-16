import { FABRIC_COLORS, PATTERNS } from '../../lib/patterns'
import { CANVAS_HEIGHT, CANVAS_WIDTH, clamp, MAX_SIZE, MIN_SIZE, SHAPES } from '../../lib/shapes'
import { useEditorStore } from '../../store/editorStore'
import Panel from './Panel'
import PatternSwatch from './PatternSwatch'
import ShapeIcon from './ShapeIcon'

interface FieldProps {
  id: string
  label: string
  value: number
  min: number
  max: number
  onChange: (value: number) => void
}

function RangeField({ id, label, value, min, max, onChange }: FieldProps) {
  return (
    <div>
      <div className="flex items-center justify-between text-sm">
        <label htmlFor={id} className="font-semibold text-forest">
          {label}
        </label>
        <span className="tabular-nums text-ink-soft">{value}</span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-1 h-6 w-full accent-forest"
      />
    </div>
  )
}

function NumberField({ id, label, value, min, max, onChange }: FieldProps) {
  return (
    <div>
      <label htmlFor={id} className="text-sm font-semibold text-forest">
        {label}
      </label>
      <input
        id={id}
        type="number"
        min={min}
        max={max}
        value={value}
        onChange={(e) => {
          const v = e.target.valueAsNumber
          if (!Number.isNaN(v)) onChange(clamp(Math.round(v), min, max))
        }}
        className="mt-1 h-10 w-full rounded-xl border border-forest/20 bg-ivory px-3 text-sm outline-none focus:border-forest focus:ring-2 focus:ring-sage"
      />
    </div>
  )
}

export default function PropertiesPanel() {
  const piece = useEditorStore((s) => s.pieces.find((p) => p.id === s.selectedId))
  const updatePiece = useEditorStore((s) => s.updatePiece)

  if (!piece) {
    return (
      <Panel title="Selected piece">
        <p className="text-sm leading-relaxed text-ink-soft">
          Select a piece on the canvas or in Layers to change its fabric, color, size and rotation.
        </p>
      </Panel>
    )
  }

  const set = (patch: Partial<typeof piece>, key?: string) => updatePiece(piece.id, patch, key)

  return (
    <Panel title="Selected piece">
      <div className="space-y-5">
        <div>
          <p className="mb-2 text-sm font-semibold text-forest">Shape</p>
          <div className="grid grid-cols-6 gap-1.5">
            {SHAPES.map((s) => (
              <button
                key={s.id}
                type="button"
                title={s.label}
                aria-label={s.label}
                aria-pressed={piece.shape === s.id}
                onClick={() => set({ shape: s.id })}
                className={`grid h-10 place-items-center rounded-xl transition ${
                  piece.shape === s.id ? 'bg-forest text-ivory' : 'bg-ivory-deep text-forest hover:bg-sage/30'
                }`}
              >
                <ShapeIcon shape={s.id} className="h-5 w-5" />
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2 text-sm font-semibold text-forest">Fabric</p>
          <div className="grid grid-cols-6 gap-1.5">
            {PATTERNS.map((p) => (
              <button
                key={p.id}
                type="button"
                title={p.label}
                aria-label={p.label}
                aria-pressed={piece.pattern === p.id}
                onClick={() => set({ pattern: p.id })}
                className={`rounded-xl p-0.5 transition ${
                  piece.pattern === p.id ? 'ring-2 ring-forest ring-offset-1' : 'hover:scale-105'
                }`}
              >
                <PatternSwatch pattern={p.id} color={piece.color} className="h-9 w-full rounded-[10px] border border-forest/15" />
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2 text-sm font-semibold text-forest">Color</p>
          <div className="grid grid-cols-6 gap-1.5">
            {FABRIC_COLORS.map((c) => (
              <button
                key={c.hex}
                type="button"
                title={c.name}
                aria-label={c.name}
                aria-pressed={piece.color === c.hex}
                onClick={() => set({ color: c.hex })}
                className={`h-8 rounded-full border transition ${
                  piece.color === c.hex
                    ? 'border-forest ring-2 ring-forest ring-offset-2'
                    : 'border-forest/20 hover:scale-105'
                }`}
                style={{ backgroundColor: c.hex }}
              />
            ))}
          </div>
        </div>

        <RangeField id="prop-width" label="Width" value={piece.width} min={MIN_SIZE} max={MAX_SIZE} onChange={(v) => set({ width: v }, 'width')} />
        <RangeField id="prop-height" label="Height" value={piece.height} min={MIN_SIZE} max={MAX_SIZE} onChange={(v) => set({ height: v }, 'height')} />
        <RangeField id="prop-rotation" label="Rotation (°)" value={Math.round(piece.rotation)} min={-180} max={180} onChange={(v) => set({ rotation: v }, 'rotation')} />

        <div className="grid grid-cols-2 gap-3">
          <NumberField id="prop-x" label="X" value={Math.round(piece.x)} min={0} max={CANVAS_WIDTH} onChange={(v) => set({ x: v }, 'x')} />
          <NumberField id="prop-y" label="Y" value={Math.round(piece.y)} min={0} max={CANVAS_HEIGHT} onChange={(v) => set({ y: v }, 'y')} />
        </div>
      </div>
    </Panel>
  )
}