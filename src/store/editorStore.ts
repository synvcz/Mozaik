import { create } from "zustand";
import { createId } from "../lib/id";
import type { Artwork, FabricPattern, FabricPiece } from "../types/editor";

interface EditorStore {
  artwork: Artwork;
  selectedPieceId: string | null;

  addPiece: (pattern: FabricPattern, color: string) => void;
  updatePiece: (id: string, updates: Partial<FabricPiece>) => void;
  removePiece: (id: string) => void;
  selectPiece: (id: string | null) => void;
  setArtworkName: (name: string) => void;
  setAuthor: (author: string) => void;
}

export const useEditorStore = create<EditorStore>((set) => ({
  artwork: {
    name: "Untitled Artwork",
    author: "Anonymous",
    pieces: [],
  },

  selectedPieceId: null,

  addPiece: (pattern, color) =>
    set((state) => ({
      artwork: {
        ...state.artwork,
        pieces: [
          ...state.artwork.pieces,
          {
            id: createId(),
            pattern,
            color,
            x: 150,
            y: 120,
            width: 120,
            height: 120,
            rotation: 0,
          },
        ],
      },
    })),

  updatePiece: (id, updates) =>
    set((state) => ({
      artwork: {
        ...state.artwork,
        pieces: state.artwork.pieces.map((piece) =>
          piece.id === id ? { ...piece, ...updates } : piece
        ),
      },
    })),

  removePiece: (id) =>
    set((state) => ({
      artwork: {
        ...state.artwork,
        pieces: state.artwork.pieces.filter((piece) => piece.id !== id),
      },
      selectedPieceId:
        state.selectedPieceId === id ? null : state.selectedPieceId,
    })),

  selectPiece: (id) => set({ selectedPieceId: id }),

  setArtworkName: (name) =>
    set((state) => ({
      artwork: { ...state.artwork, name },
    })),

  setAuthor: (author) =>
    set((state) => ({
      artwork: { ...state.artwork, author },
    })),
}));