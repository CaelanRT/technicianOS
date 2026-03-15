import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../contexts/AuthContext'

function SettingsIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1Z" />
    </svg>
  )
}

function Home() {
  const { logout } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [menuOpen])

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--paper-bg)' }}>
      <nav className="w-full border-b py-4 px-6 flex items-center justify-between" style={{ borderColor: 'var(--paper-border)', backgroundColor: 'var(--paper-surface)' }}>
        <h1 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--accent-red)' }}>
          TechnicianOS
        </h1>
        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            className="p-2 rounded-md transition-colors hover:bg-[var(--paper-border)]"
            style={{ color: 'var(--paper-text-muted)' }}
            aria-label="Settings"
            aria-expanded={menuOpen}
            aria-haspopup="true"
          >
            <SettingsIcon />
          </button>
          {menuOpen && (
            <div
              className="absolute right-0 top-full mt-1 py-1 min-w-[140px] rounded-md shadow-lg border z-10"
              style={{ backgroundColor: 'var(--paper-surface)', borderColor: 'var(--paper-border)' }}
            >
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false)
                  logout()
                }}
                className="logout-menu-item w-full px-4 py-2 text-left text-sm font-medium transition-colors"
              >
                Log out
              </button>
            </div>
          )}
        </div>
      </nav>
      <div className="flex-1 flex flex-col items-center justify-center gap-6">
        <p className="text-xl font-medium" style={{ color: 'var(--paper-text)' }}>Welcome, you&apos;re logged in.</p>
      </div>
    </div>
  )
}

export default Home
