import { memo, useCallback, useEffect, useRef, useState, type DragEvent } from 'react'
import { Ellipse, Group, Layer, Path, Rect, Stage, Transformer } from 'react-konva'
import type Konva from 'konva'
import { getTemplate } from '../../data/templates'
import { asPatternImage, getPatternTile, PATTERN_RES, PATTERNS } from '../../lib/patterns'
import {
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  clamp,
  GUIDE_SCALE,
  MAX_SIZE,
  MIN_SIZE,
  normalizeRotation,
  shapePath,
  SHAPES,
} from '../../lib/shapes'
import { findSnapTarget } from '../../lib/snap'
import { useEditorStore } from '../../store/editorStore'
import type { FabricPattern, FabricPiece, GuideShape, TemplateId } from '../../types/editor'

const GUIDE_STROKE = '#C77D55'
const GUIDE_ACTIVE = '#A9613B'

interface PieceNodeProps {
  piece: FabricPiece
  onSelect: (id: string) => void
  onChange: (id: string, patch: Partial<FabricPiece>) => void
  onDragMove: (x: number, y: number, width: number, height: number) => void
  onDragFinish: (
    id: string,
    x: number,
    y: number,
    width: number,
    height: number,
  ) => Partial<FabricPiece>
  registerNode: (id: string, node: Konva.Path | null) => void
}

const PieceNode = memo(function PieceNode({
  piece,
  onSelect,
  onChange,
  onDragMove,
  onDragFinish,
  registerNode,
}: PieceNodeProps) {
  const tile = piece.pattern === 'plain' ? null : getPatternTile(piece.pattern, piece.color)

  return (
    <Path
      ref={(node) => registerNode(piece.id, node)}
      x={piece.x}
      y={piece.y}
      offsetX={piece.width / 2}
      offsetY={piece.height / 2}
      rotation={piece.rotation}
      data={shapePath(piece.shape, piece.width, piece.height, piece.slotRef)}
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
      onDragMove={(e) => onDragMove(e.target.x(), e.target.y(), piece.width, piece.height)}
      onDragEnd={(e) => {
        const x = clamp(Math.round(e.target.x()), 0, CANVAS_WIDTH)
        const y = clamp(Math.round(e.target.y()), 0, CANVAS_HEIGHT)
        const patch = onDragFinish(piece.id, x, y, piece.width, piece.height)
        // Set the node position directly: if a snap lands on the same values as before,
        // React sees no change and would leave the node where it was dropped.
        e.target.position({ x: patch.x ?? x, y: patch.y ?? y })
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

interface GuideLayerProps {
  guide: GuideShape[]
  templateId: TemplateId
  highlight: string | null
}

function GuideLayer({ guide, templateId, highlight }: GuideLayerProps) {
  return (
    <Group
      x={CANVAS_WIDTH / 2}
      y={CANVAS_HEIGHT / 2}
      scaleX={GUIDE_SCALE}
      scaleY={GUIDE_SCALE}
      opacity={0.75}
      listening={false}
    >
      {guide.map((g, i) => {
        const active = highlight === `${templateId}:${i}`
        const style = {
          stroke: active ? GUIDE_ACTIVE : GUIDE_STROKE,
          strokeWidth: active ? 2.6 : 1.4,
          strokeScaleEnabled: false,
          dash: active ? undefined : [7, 6],
          fill: active ? 'rgba(199,125,85,0.3)' : undefined,
        }
        return g.kind === 'ellipse' ? (
          <Ellipse
            key={i}
            x={g.cx}
            y={g.cy}
            radiusX={g.rx}
            radiusY={g.ry}
            rotation={g.rotation}
            {...style}
          />
        ) : (
          <Path key={i} data={g.d} {...style} />
        )
      })}
    </Group>
  )
}

function brushSize() {
  const brush = useEditorStore.getState().brushShape
  return SHAPES.find((s) => s.id === brush) ?? SHAPES[0]
}

export default function EditorCanvas() {
  const pieces = useEditorStore((s) => s.pieces)
  const selectedId = useEditorStore((s) => s.selectedId)
  const templateId = useEditorStore((s) => s.templateId)
  const guideVisible = useEditorStore((s) => s.guideVisible)
  const snapEnabled = useEditorStore((s) => s.snapEnabled)
  const select = useEditorStore((s) => s.select)
  const updatePiece = useEditorStore((s) => s.updatePiece)
  const addPiece = useEditorStore((s) => s.addPiece)

  const wrapRef = useRef<HTMLDivElement>(null)
  const hostRef = useRef<HTMLDivElement>(null)
  const trRef = useRef<Konva.Transformer>(null)
  const nodeRefs = useRef(new Map<string, Konva.Path>())
  const [scale, setScale] = useState(1)
  const [hover, setHover] = useState<string | null>(null)
  // Touch screens need much bigger resize/rotate handles than a mouse.
  const [coarse] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches,
  )

  const snapActive = Boolean(templateId && guideVisible && snapEnabled)

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

  const probe = useCallback(
    (x: number, y: number, width: number, height: number) =>
      snapActive ? findSnapTarget(templateId, { x, y, width, height }) : null,
    [snapActive, templateId],
  )

  const handleDragMove = useCallback(
    (x: number, y: number, width: number, height: number) => {
      setHover(probe(x, y, width, height)?.ref ?? null)
    },
    [probe],
  )

  const handleDragFinish = useCallback(
    (id: string, x: number, y: number, width: number, height: number): Partial<FabricPiece> => {
      const target = probe(x, y, width, height)
      const patch: Partial<FabricPiece> = target ? target.patch : { x, y }
      setHover(null)
      updatePiece(id, patch)
      return patch
    },
    [probe, updatePiece],
  )

  const toCanvasPoint = (clientX: number, clientY: number) => {
    const rect = hostRef.current?.getBoundingClientRect()
    if (!rect) return null
    return {
      x: clamp(Math.round((clientX - rect.left) / scale), 0, CANVAS_WIDTH),
      y: clamp(Math.round((clientY - rect.top) / scale), 0, CANVAS_HEIGHT),
    }
  }

  const handleStagePointer = (e: Konva.KonvaEventObject<MouseEvent | TouchEvent>) => {
    if (e.target === e.target.getStage() || e.target.name() === 'bg') select(null)
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setHover(null)
    const raw = e.dataTransfer.getData('application/x-mozaik-pattern')
    if (!PATTERNS.some((p) => p.id === raw)) return
    const point = toCanvasPoint(e.clientX, e.clientY)
    if (!point) return
    const def = brushSize()
    const target = probe(point.x, point.y, def.width, def.height)
    addPiece(raw as FabricPattern, point, target?.patch)
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
          if (!snapActive) return
          const point = toCanvasPoint(e.clientX, e.clientY)
          if (!point) return
          const def = brushSize()
          setHover(probe(point.x, point.y, def.width, def.height)?.ref ?? null)
        }}
        onDragLeave={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setHover(null)
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
            {guide && templateId && (
              <GuideLayer
                guide={guide}
                templateId={templateId}
                highlight={snapActive ? hover : null}
              />
            )}
            {pieces.map((piece) => (
              <PieceNode
                key={piece.id}
                piece={piece}
                onSelect={select}
                onChange={updatePiece}
                onDragMove={handleDragMove}
                onDragFinish={handleDragFinish}
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