import type { ChallengeId } from './challenge'

export type FabricPattern = 'batik' | 'kawung' | 'parang' | 'floral' | 'polka' | 'plain'
export type PieceShape = 'rect' | 'circle' | 'petal' | 'leaf' | 'triangle' | 'diamond'

export interface FabricPiece {
  id: string
  shape: PieceShape
  pattern: FabricPattern
  color: string
  /** Center of the piece on the canvas. */
  x: number
  y: number
  width: number
  height: number
  rotation: number
}

export type IconTemplateId = 'gunungan' | 'rumah-gadang' | 'borobudur' | 'tumpeng'
export type TemplateId = ChallengeId | IconTemplateId

export interface Artwork {
  id: string
  title: string
  author: string
  pieces: FabricPiece[]
  templateId: TemplateId | null
  createdAt: number
  updatedAt: number
}

/** Outline shapes in a -50..50 coordinate space, used as dashed guides. */
export type GuideShape =
  | { kind: 'ellipse'; cx: number; cy: number; rx: number; ry: number; rotation: number }
  | { kind: 'path'; d: string }