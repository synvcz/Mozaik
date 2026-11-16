import type { ComponentType } from 'react'
import AppShell from './components/layout/AppShell'
import CollectionPage from './features/collection/CollectionPage'
import CreatePage from './features/editor/CreatePage'
import ChallengesPage from './features/challenges/ChallengesPage'
import GaleriPage from './features/gallery/GaleriPage'
import WorkshopPage from './features/workshop/WorkshopPage'
import { useNavigationStore, type RouteId } from './store/navigationStore'

const PAGES: Record<RouteId, ComponentType> = {
  workshop: WorkshopPage,
  create: CreatePage,
  challenges: ChallengesPage,
  galeri: GaleriPage,
  collection: CollectionPage,
}

function App() {
  const route = useNavigationStore((s) => s.route)
  const Page = PAGES[route]

  return (
    <AppShell>
      <div key={route} className="animate-page">
        <Page />
      </div>
    </AppShell>
  )
}

export default App