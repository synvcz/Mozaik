import { create } from 'zustand'
import { getTemplate } from '../data/templates'
import { createId } from '../lib/id'
import { CANVAS_HEIGHT, CANVAS_WIDTH, SHAPES } from '../lib/shapes'
import type { Artwork, FabricPattern, FabricPiece, PieceShape, TemplateId } from '../types/editor'

const HISTORY_LIMIT = 100
const COALESCE_MS = 700

export type LayerMove = 'forward' | 'backward' | 'front' | 'back'

interface DraftState {
  artworkId: string
  createdAt: number | null
  title: string
  author: string
  pieces: FabricPiece[]
  selectedId: string | null
  templateId: TemplateId | null
  guideVisible: boolean
  past: FabricPiece[][]
  future: FabricPiece[][]
  lastKey: string | null
  lastTime: number
}

interface EditorState extends DraftState {
  brushColor: string
  brushShape: PieceShape

  select: (id: string | null) => void
  addPiece: (pattern: FabricPattern, at?: { x: number; y: number }) => void
  /** Pass a coalesceKey for slider-style edits so rapid changes become one undo step. */
  updatePiece: (id: string, patch: Partial<FabricPiece>, coalesceKey?: string) => void
  removePiece: (id: string) => void
  duplicatePiece: (id: string) => void
  moveLayer: (id: string, move: LayerMove) => void
  clearCanvas: () => void
  undo: () => void
  redo: () => void

  setTitle: (title: string) => void
  setAuthor: (author: string) => void
  setBrushColor: (color: string) => void
  setBrushShape: (shape: PieceShape) => void
  setTemplate: (id: TemplateId | null) => void
  toggleGuide: () => void
  markSaved: (createdAt: number) => void

  startFromTemplate: (id: TemplateId | null) => void
  loadArtwork: (artwork: Artwork) => void
}

function blankDraft(author = ''): DraftState {
  return {
    artworkId: createId(),
    createdAt: null,
    title: 'Untitled Artwork',
    author,
    pieces: [],
    selectedId: null,
    templateId: null,
    guideVisible: true,
    past: [],
    future: [],
    lastKey: null,
    lastTime: 0,
  }
}

function withHistory(s: DraftState, pieces: FabricPiece[], key?: string): Partial<DraftState> {
  const now = Date.now()
  const merge = key !== undefined && key === s.lastKey && now - s.lastTime < COALESCE_MS
  return {
    pieces,
    past: merge ? s.past : [...s.past, s.pieces].slice(-HISTORY_LIMIT),
    future: merge ? s.future : [],
    lastKey: key ?? null,
    lastTime: now,
  }
}

function reorder(pieces: FabricPiece[], id: string, move: LayerMove): FabricPiece[] | null {
  const from = pieces.findIndex((p) => p.id === id)
  if (from === -1) return null
  const last = pieces.length - 1
  const to =
    move === 'forward' ? Math.min(from + 1, last)
    : move === 'backward' ? Math.max(from - 1, 0)
    : move === 'front' ? last
    : 0
  if (to === from) return null
  const next = pieces.slice()
  const [item] = next.splice(from, 1)
  next.splice(to, 0, item)
  return next
}

export const useEditorStore = create<EditorState>((set) => ({
  ...blankDraft(),
  brushColor: '#C77D55',
  brushShape: 'petal',

  select: (id) => set({ selectedId: id }),

  addPiece: (pattern, at) =>
    set((s) => {
      const def = SHAPES.find((sh) => sh.id === s.brushShape) ?? SHAPES[0]
      const offset = (s.pieces.length % 6) * 18
      const piece: FabricPiece = {
        id: createId(),
        shape: def.id,
        pattern,
        color: s.brushColor,
        x: at?.x ?? CANVAS_WIDTH / 2 + offset - 45,
        y: at?.y ?? CANVAS_HEIGHT / 2 + offset - 45,
        width: def.width,
        height: def.height,
        rotation: 0,
      }
      return { ...withHistory(s, [...s.pieces, piece]), selectedId: piece.id }
    }),

  updatePiece: (id, patch, coalesceKey) =>
    set((s) => {
      if (!s.pieces.some((p) => p.id === id)) return s
      return withHistory(
        s,
        s.pieces.map((p) => (p.id === id ? { ...p, ...patch } : p)),
        coalesceKey ? `${id}:${coalesceKey}` : undefined,
      )
    }),

  removePiece: (id) =>
    set((s) => {
      if (!s.pieces.some((p) => p.id === id)) return s
      return {
        ...withHistory(s, s.pieces.filter((p) => p.id !== id)),
        selectedId: s.selectedId === id ? null : s.selectedId,
      }
    }),

  duplicatePiece: (id) =>
    set((s) => {
      const source = s.pieces.find((p) => p.id === id)
      if (!source) return s
      const copy: FabricPiece = { ...source, id: createId(), x: source.x + 24, y: source.y + 24 }
      return { ...withHistory(s, [...s.pieces, copy]), selectedId: copy.id }
    }),

  moveLayer: (id, move) =>
    set((s) => {
      const next = reorder(s.pieces, id, move)
      return next ? withHistory(s, next) : s
    }),

  clearCanvas: () =>
    set((s) => (s.pieces.length === 0 ? s : { ...withHistory(s, []), selectedId: null })),

  undo: () =>
    set((s) => {
      const prev = s.past[s.past.length - 1]
      if (!prev) return s
      return {
        pieces: prev,
        past: s.past.slice(0, -1),
        future: [s.pieces, ...s.future],
        selectedId: prev.some((p) => p.id === s.selectedId) ? s.selectedId : null,
        lastKey: null,
      }
    }),

  redo: () =>
    set((s) => {
      const next = s.future[0]
      if (!next) return s
      return {
        pieces: next,
        past: [...s.past, s.pieces],
        future: s.future.slice(1),
        selectedId: next.some((p) => p.id === s.selectedId) ? s.selectedId : null,
        lastKey: null,
      }
    }),

  setTitle: (title) => set({ title }),
  setAuthor: (author) => set({ author }),
  setBrushColor: (brushColor) => set({ brushColor }),
  setBrushShape: (brushShape) => set({ brushShape }),
  setTemplate: (templateId) => set({ templateId, guideVisible: true }),
  toggleGuide: () => set((s) => ({ guideVisible: !s.guideVisible })),
  markSaved: (createdAt) => set({ createdAt }),

  startFromTemplate: (id) =>
    set((s) => ({
      ...blankDraft(s.author),
      templateId: id,
      title: getTemplate(id)?.name ?? 'Untitled Artwork',
    })),

  loadArtwork: (artwork) =>
    set({
      artworkId: artwork.id,
      createdAt: artwork.createdAt,
      title: artwork.title,
      author: artwork.author,
      pieces: artwork.pieces,
      selectedId: null,
      templateId: artwork.templateId,
      guideVisible: true,
      past: [],
      future: [],
      lastKey: null,
      lastTime: 0,
    }),
}))