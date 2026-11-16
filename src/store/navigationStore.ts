import { create } from 'zustand'

export const ROUTES = [
  { id: 'workshop', label: 'Workshop', path: '' },
  { id: 'create', label: 'Create', path: 'create' },
  { id: 'challenges', label: 'Challenges', path: 'challenges' },
  { id: 'galeri', label: 'Galeri', path: 'galeri' },
  { id: 'collection', label: 'My Collection', path: 'collection' },
] as const

export type RouteId = (typeof ROUTES)[number]['id']

function parseHash(hash: string): RouteId {
  const path = hash.replace(/^#\/?/, '')
  return ROUTES.find((route) => route.path === path)?.id ?? 'workshop'
}

export function hrefFor(id: RouteId): string {
  const route = ROUTES.find((r) => r.id === id)
  return route && route.path ? `#/${route.path}` : '#/'
}

interface NavigationState {
  route: RouteId
  navigate: (route: RouteId) => void
  syncFromHash: () => void
}

export const useNavigationStore = create<NavigationState>((set) => ({
  route: parseHash(window.location.hash),

  navigate: (route) => {
    window.location.hash = hrefFor(route).slice(1)
    set({ route })
  },

  syncFromHash: () => set({ route: parseHash(window.location.hash) }),
}))