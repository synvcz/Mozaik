import { memo, useCallback, useEffect, useRef, useState, type DragEvent } from 'react'
import { Ellipse, Group, Layer, Path, Rect, Stage, Transformer } from 'react-konva'
import type Konva from 'konva'
import { getTemplate } from '../../data/templates'
import { asPatternImage, getPatternTile, PATTERN_RES, PATTERNS } from '../../lib/patterns'
import {
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  clamp,
  MAX_SIZE,
  MIN_SIZE,
  normalizeRotation,
  shapePath,
} from '../../lib/shapes'
import { useEditorStore } from '../../store/editorStore'
import type { FabricPattern, FabricPiece, GuideShape } from '../../types/editor'

const GUIDE_SCALE = 5.6
const GUIDE_STROKE = '#C77D55'

interface PieceNodeProps {
  piece: FabricPiece
  onSelect: (id: string) => void
  onChange: (id: string, patch: Partial<FabricPiece>) => void
  registerNode: (id: string, node: Konva.Path | null) => void
}

const PieceNode = memo(function PieceNode({ piece, onSelect, onChange, registerNode }: PieceNodeProps) {
  const tile = piece.pattern === 'plain' ? null : getPatternTile(piece.pattern, piece.color)

  return (
    <Path
      ref={(node) => registerNode(piece.id, node)}
      x={piece.x}
      y={piece.y}
      offsetX={piece.width / 2}
      offsetY={piece.height / 2}
      rotation={piece.rotation}
      data={shapePath(piece.shape, piece.width, piece.height)}
      fill={tile ? undefined : piece.color}
      fillPriority={tile ? 'pattern' : 'color'}
      fillPatternImage={tile ? asPatternImage(tile.canvas) : undefined}
      fillPatternScale={tile ? { x: 1 / PATTERN_RES, y: 1 / PATTERN_RES } : undefined}
      fillPatternRepeat="repeat"
      stroke="rgba(43,42,38,0.25)"
      strokeWidth={1}
      strokeScaleEnabled={false}
      lineJoin="round"
      draggable
      onMouseDown={() => onSelect(piece.id)}
      onTouchStart={() => onSelect(piece.id)}
      onDragStart={() => onSelect(piece.id)}
      onDragEnd={(e) => {
        const x = clamp(Math.round(e.target.x()), 0, CANVAS_WIDTH)
        const y = clamp(Math.round(e.target.y()), 0, CANVAS_HEIGHT)
        e.target.position({ x, y })
        onChange(piece.id, { x, y })
      }}
      onTransformEnd={(e) => {
        const node = e.target
        const sx = Math.abs(node.scaleX())
        const sy = Math.abs(node.scaleY())
        node.scaleX(1)
        node.scaleY(1)
        onChange(piece.id, {
          x: clamp(Math.round(node.x()), 0, CANVAS_WIDTH),
          y: clamp(Math.round(node.y()), 0, CANVAS_HEIGHT),
          width: clamp(Math.round(piece.width * sx), MIN_SIZE, MAX_SIZE),
          height: clamp(Math.round(piece.height * sy), MIN_SIZE, MAX_SIZE),
          rotation: normalizeRotation(node.rotation()),
        })
      }}
    />
  )
})

function GuideLayer({ guide }: { guide: GuideShape[] }) {
  return (
    <Group
      x={CANVAS_WIDTH / 2}
      y={CANVAS_HEIGHT / 2}
      scaleX={GUIDE_SCALE}
      scaleY={GUIDE_SCALE}
      opacity={0.6}
      listening={false}
    >
      {guide.map((g, i) =>
        g.kind === 'ellipse' ? (
          <Ellipse
            key={i}
            x={g.cx}
            y={g.cy}
            radiusX={g.rx}
            radiusY={g.ry}
            rotation={g.rotation}
            stroke={GUIDE_STROKE}
            strokeWidth={1.4}
            strokeScaleEnabled={false}
            dash={[7, 6]}
          />
        ) : (
          <Path
            key={i}
            data={g.d}
            stroke={GUIDE_STROKE}
            strokeWidth={1.4}
            strokeScaleEnabled={false}
            dash={[7, 6]}
          />
        ),
      )}
    </Group>
  )
}

export default function EditorCanvas() {
  const pieces = useEditorStore((s) => s.pieces)
  const selectedId = useEditorStore((s) => s.selectedId)
  const templateId = useEditorStore((s) => s.templateId)
  const guideVisible = useEditorStore((s) => s.guideVisible)
  const select = useEditorStore((s) => s.select)
  const updatePiece = useEditorStore((s) => s.updatePiece)
  const addPiece = useEditorStore((s) => s.addPiece)

  const wrapRef = useRef<HTMLDivElement>(null)
  const hostRef = useRef<HTMLDivElement>(null)
  const trRef = useRef<Konva.Transformer>(null)
  const nodeRefs = useRef(new Map<string, Konva.Path>())
  const [scale, setScale] = useState(1)
  // Touch screens need much bigger resize/rotate handles than a mouse.
  const [coarse] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches,
  )

  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const observer = new ResizeObserver(([entry]) => {
      setScale(Math.min(entry.contentRect.width / CANVAS_WIDTH, 1.2))
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const registerNode = useCallback((id: string, node: Konva.Path | null) => {
    if (node) nodeRefs.current.set(id, node)
    else nodeRefs.current.delete(id)
  }, [])

  useEffect(() => {
    const tr = trRef.current
    if (!tr) return
    const node = selectedId ? nodeRefs.current.get(selectedId) : undefined
    tr.nodes(node ? [node] : [])
    tr.getLayer()?.batchDraw()
  }, [selectedId, pieces])

  const handleStagePointer = (e: Konva.KonvaEventObject<MouseEvent | TouchEvent>) => {
    if (e.target === e.target.getStage() || e.target.name() === 'bg') select(null)
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const raw = e.dataTransfer.getData('application/x-mozaik-pattern')
    if (!PATTERNS.some((p) => p.id === raw)) return
    const rect = hostRef.current?.getBoundingClientRect()
    if (!rect) return
    addPiece(raw as FabricPattern, {
      x: clamp(Math.round((e.clientX - rect.left) / scale), 0, CANVAS_WIDTH),
      y: clamp(Math.round((e.clientY - rect.top) / scale), 0, CANVAS_HEIGHT),
    })
  }

  const guide = templateId && guideVisible ? getTemplate(templateId)?.guide : undefined

  return (
    <div ref={wrapRef} className="w-full">
      <div
        ref={hostRef}
        // touch-none: finger drags move pieces instead of scrolling the page.
        className="mx-auto touch-none overflow-hidden rounded-2xl border border-forest/15 bg-[#FFFDF8] shadow-inner"
        style={{ width: CANVAS_WIDTH * scale, height: CANVAS_HEIGHT * scale }}
        onDragOver={(e) => {
          e.preventDefault()
          e.dataTransfer.dropEffect = 'copy'
        }}
        onDrop={handleDrop}
      >
        <Stage
          width={CANVAS_WIDTH * scale}
          height={CANVAS_HEIGHT * scale}
          scaleX={scale}
          scaleY={scale}
          onMouseDown={handleStagePointer}
          onTouchStart={handleStagePointer}
        >
          <Layer>
            <Rect name="bg" width={CANVAS_WIDTH} height={CANVAS_HEIGHT} fill="#FFFDF8" />
            {guide && <GuideLayer guide={guide} />}
            {pieces.map((piece) => (
              <PieceNode
                key={piece.id}
                piece={piece}
                onSelect={select}
                onChange={updatePiece}
                registerNode={registerNode}
              />
            ))}
            <Transformer
              ref={trRef}
              keepRatio={false}
              rotationSnaps={[0, 45, 90, 135, 180, -135, -90, -45]}
              rotationSnapTolerance={4}
              anchorSize={coarse ? 26 : 10}
              rotateAnchorOffset={coarse ? 36 : 50}
              anchorCornerRadius={coarse ? 8 : 3}
              anchorStroke="#315C48"
              anchorFill="#F8F6F0"
              borderStroke="#315C48"
              borderDash={[4, 3]}
              boundBoxFunc={(oldBox, newBox) =>
                Math.abs(newBox.width) < MIN_SIZE * scale || Math.abs(newBox.height) < MIN_SIZE * scale
                  ? oldBox
                  : newBox
              }
            />
          </Layer>
        </Stage>
      </div>
      {pieces.length === 0 && (
        <p className="mt-3 hidden text-center text-sm text-ink-soft sm:block">
          Your canvas is empty. Pick a fabric on the left to add your first piece.
        </p>
      )}
    </div>
  )
}