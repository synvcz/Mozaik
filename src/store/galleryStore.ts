import { create } from 'zustand'
import { categoryFor } from '../data/templates'
import { supabase } from '../lib/supabase'
import { sanitizePieces } from '../lib/validate'
import type { FabricPiece, TemplateId } from '../types/editor'
import {
  GALLERY_CATEGORIES,
  type GalleryArtwork,
  type GalleryCategory,
} from '../types/gallery'
import { useUiStore } from './uiStore'

const LIKES_KEY = 'mozaik.liked'

export interface PublishInput {
  title: string
  author: string
  description: string
  pieces: FabricPiece[]
  templateId: TemplateId | null
}

interface ArtworkRow {
  id: string
  title: string
  author: string
  description: string | null
  category: string
  pieces: unknown
  likes: number
  created_at: string
}

export type GalleryStatus = 'idle' | 'loading' | 'ready' | 'error'

interface GalleryState {
  items: GalleryArtwork[]
  status: GalleryStatus
  error: string | null
  fetchArtworks: () => Promise<void>
  publish: (input: PublishInput) => Promise<void>
  toggleLike: (id: string) => Promise<void>
}

/** Which artworks this browser has liked, so a like can't be repeated after a refresh. */
function loadLiked(): Set<string> {
  try {
    const raw = window.localStorage.getItem(LIKES_KEY)
    const parsed: unknown = raw ? JSON.parse(raw) : []
    return new Set(
      Array.isArray(parsed) ? parsed.filter((v): v is string => typeof v === 'string') : [],
    )
  } catch {
    return new Set()
  }
}

function saveLiked(ids: Set<string>) {
  try {
    window.localStorage.setItem(LIKES_KEY, JSON.stringify([...ids]))
  } catch {
    // Storage can be unavailable (private mode); likes then last for this tab only.
  }
}

function isCategory(value: string): value is GalleryCategory {
  return (GALLERY_CATEGORIES as readonly string[]).includes(value)
}

function toArtwork(row: ArtworkRow, liked: Set<string>): GalleryArtwork {
  return {
    id: row.id,
    title: row.title,
    author: row.author,
    description: row.description ?? '',
    pieces: sanitizePieces(row.pieces),
    category: isCategory(row.category) ? row.category : 'Freeform',
    likes: Math.max(0, Number(row.likes) || 0),
    likedByMe: liked.has(row.id),
    createdAt: new Date(row.created_at).getTime(),
  }
}

export const useGalleryStore = create<GalleryState>((set, get) => ({
  items: [],
  status: 'idle',
  error: null,

  fetchArtworks: async () => {
    if (!supabase) return
    set((s) => ({ status: s.status === 'ready' ? 'ready' : 'loading', error: null }))

    try {
      const { data, error } = await supabase
        .from('artworks')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100)
      if (error) throw error

      const liked = loadLiked()
      set({
        items: (data as ArtworkRow[]).map((row) => toArtwork(row, liked)),
        status: 'ready',
        error: null,
      })
    } catch {
      set({
        status: get().items.length > 0 ? 'ready' : 'error',
        error: 'We could not load Galeri. Check your connection and try again.',
      })
    }
  },

  publish: async (input) => {
    if (!supabase) throw new Error('The gallery database is not connected yet.')

    const { data, error } = await supabase
      .from('artworks')
      .insert({
        title: input.title,
        author: input.author,
        description: input.description,
        category: categoryFor(input.templateId),
        pieces: input.pieces,
      })
      .select('*')
      .single()

    if (error || !data) throw new Error('Publishing failed. Please try again.')

    set((s) => ({
      items: [toArtwork(data as ArtworkRow, loadLiked()), ...s.items],
      status: 'ready',
    }))
  },

  toggleLike: async (id) => {
    const target = get().items.find((a) => a.id === id)
    if (!target || !supabase) return

    const delta = target.likedByMe ? -1 : 1
    const apply = (likedByMe: boolean, likes: number) =>
      set((s) => ({
        items: s.items.map((a) => (a.id === id ? { ...a, likedByMe, likes } : a)),
      }))

    const liked = loadLiked()
    if (delta === 1) liked.add(id)
    else liked.delete(id)
    saveLiked(liked)

    // Optimistic update, rolled back if the database call fails.
    apply(delta === 1, Math.max(0, target.likes + delta))

    const { data, error } = await supabase.rpc('change_likes', { p_id: id, p_delta: delta })
    if (error) {
      const restored = loadLiked()
      if (target.likedByMe) restored.add(id)
      else restored.delete(id)
      saveLiked(restored)
      apply(target.likedByMe, target.likes)
      useUiStore.getState().pushToast('Could not save your like. Please try again.', 'error')
    } else if (typeof data === 'number') {
      apply(delta === 1, data)
    }
  },
}))