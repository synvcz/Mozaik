import { useEffect, type ReactNode } from 'react'
import { useNavigationStore } from '../../store/navigationStore'
import Footer from './Footer'
import NavBar from './NavBar'

export default function AppShell({ children }: { children: ReactNode }) {
  const route = useNavigationStore((s) => s.route)
  const syncFromHash = useNavigationStore((s) => s.syncFromHash)

  // Keep the store in sync with the browser's back/forward buttons and typed URLs.
  useEffect(() => {
    window.addEventListener('hashchange', syncFromHash)
    return () => window.removeEventListener('hashchange', syncFromHash)
  }, [syncFromHash])

  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [route])

  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#main"
        onClick={(e) => {
          e.preventDefault()
          document.getElementById('main')?.focus()
        }}
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-forest focus:px-4 focus:py-2 focus:text-ivory"
      >
        Skip to content
      </a>
      <NavBar />
      <main id="main" tabIndex={-1} className="flex-1 outline-none">
        {children}
      </main>
      <Footer />
    </div>
  )
}