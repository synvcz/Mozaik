import { create } from 'zustand'
import { categoryFor } from '../data/templates'
import { createSeedGallery } from '../data/seedGallery'
import { createId } from '../lib/id'
import type { FabricPiece, TemplateId } from '../types/editor'
import type { GalleryArtwork } from '../types/gallery'

export interface PublishInput {
  title: string
  author: string
  description: string
  pieces: FabricPiece[]
  templateId: TemplateId | null
}

interface GalleryState {
  items: GalleryArtwork[]
  publish: (input: PublishInput) => string
  toggleLike: (id: string) => void
}

export const useGalleryStore = create<GalleryState>((set) => ({
  items: createSeedGallery(),

  publish: (input) => {
    const id = createId()
    const artwork: GalleryArtwork = {
      id,
      title: input.title,
      author: input.author,
      description: input.description,
      pieces: input.pieces,
      category: categoryFor(input.templateId),
      likes: 0,
      likedByMe: false,
      createdAt: Date.now(),
    }
    set((s) => ({ items: [artwork, ...s.items] }))
    return id
  },

  toggleLike: (id) =>
    set((s) => ({
      items: s.items.map((a) =>
        a.id === id
          ? { ...a, likedByMe: !a.likedByMe, likes: a.likes + (a.likedByMe ? -1 : 1) }
          : a,
      ),
    })),
}))