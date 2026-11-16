import { create } from 'zustand'
import type { Artwork } from '../types/editor'

interface CollectionState {
  items: Artwork[]
  saveArtwork: (artwork: Artwork) => void
  removeArtwork: (id: string) => void
}

export const useCollectionStore = create<CollectionState>((set) => ({
  items: [],

  saveArtwork: (artwork) =>
    set((s) =>
      s.items.some((i) => i.id === artwork.id)
        ? { items: s.items.map((i) => (i.id === artwork.id ? artwork : i)) }
        : { items: [artwork, ...s.items] },
    ),

  removeArtwork: (id) => set((s) => ({ items: s.items.filter((i) => i.id !== id) })),
}))