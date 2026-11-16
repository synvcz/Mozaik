import type { FabricPiece } from './editor'

export const GALLERY_CATEGORIES = ['Flowers', 'Landmarks', 'Culture', 'Freeform'] as const
export type GalleryCategory = (typeof GALLERY_CATEGORIES)[number]

export interface GalleryArtwork {
  id: string
  title: string
  author: string
  description: string
  pieces: FabricPiece[]
  category: GalleryCategory
  likes: number
  likedByMe: boolean
  createdAt: number
}