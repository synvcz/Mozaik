import { create } from 'zustand'
import { createId } from '../lib/id'

export type ToastTone = 'success' | 'error' | 'info'

interface Toast {
  id: string
  message: string
  tone: ToastTone
}

interface UiState {
  toasts: Toast[]
  pushToast: (message: string, tone?: ToastTone) => void
  dismissToast: (id: string) => void
}

export const useUiStore = create<UiState>((set, get) => ({
  toasts: [],

  pushToast: (message, tone = 'info') => {
    const id = createId()
    set((s) => ({ toasts: [...s.toasts, { id, message, tone }] }))
    window.setTimeout(() => get().dismissToast(id), 3500)
  },

  dismissToast: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}))