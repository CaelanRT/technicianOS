import { useEffect, useRef, useState } from 'react'
import { request } from '../api/client'
import { useAuth } from '../contexts/AuthContext'

type Task = {
  id: number
  name: string
  description: string
  status: 'pending' | 'in_progress' | 'completed'
  projectId: number
  assignedToUserId: number | null
  createdAt: string
  updatedAt: string
}

type Project = {
  id: number
  name: string
  organizationId: number
  projectManagerId: number
  technicianId: number
  createdAt: string
  updatedAt: string
  tasks: Task[]
}

function SettingsIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1Z" />
    </svg>
  )
}

function statusLabel(status: Task['status']) {
  return status.replace('_', ' ')
}

function Home() {
  const { logout } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoadingProjects, setIsLoadingProjects] = useState(true)
  const [projectsError, setProjectsError] = useState('')
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

  useEffect(() => {
    let isMounted = true

    async function loadAssignedProjects() {
      setIsLoadingProjects(true)
      setProjectsError('')

      try {
        const data = await request<{ projects: Project[] }>('/assignedProjects')
        if (isMounted) {
          setProjects(data.projects)
        }
      } catch (err) {
        if (isMounted) {
          setProjects([])
          setProjectsError(err instanceof Error ? err.message : 'Unable to load assigned projects')
        }
      } finally {
        if (isMounted) {
          setIsLoadingProjects(false)
        }
      }
    }

    loadAssignedProjects()

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--paper-bg)' }}>
      <nav className="w-full border-b px-4 py-4 sm:px-6" style={{ borderColor: 'var(--paper-border)', backgroundColor: 'var(--paper-surface)' }}>
        <div className="flex w-full items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--accent-red)' }}>
              TechnicianOS
            </h1>
          </div>
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setMenuOpen((o) => !o)}
              className="rounded-md p-2 transition-colors hover:bg-[var(--paper-border)]"
              style={{ color: 'var(--paper-text-muted)' }}
              aria-label="Settings"
              aria-expanded={menuOpen}
              aria-haspopup="true"
            >
              <SettingsIcon />
            </button>
            {menuOpen && (
              <div
                className="absolute right-0 top-full z-10 mt-1 min-w-[140px] rounded-md border py-1 shadow-lg"
                style={{ backgroundColor: 'var(--paper-surface)', borderColor: 'var(--paper-border)' }}
              >
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false)
                    void logout()
                  }}
                  className="logout-menu-item w-full px-4 py-2 text-left text-sm font-medium transition-colors"
                >
                  Log out
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      <main className="mx-auto flex w-full max-w-6xl flex-col px-6 pt-10 pb-8 sm:pt-12">
        <section className="mb-10 sm:mb-12">
          <h2 className="text-3xl font-semibold" style={{ color: 'var(--paper-text)' }}>
            Assigned projects
          </h2>
        </section>

        {isLoadingProjects && (
          <section className="rounded-2xl border p-6 shadow-sm" style={{ backgroundColor: 'var(--paper-surface)', borderColor: 'var(--paper-border)' }}>
            <p style={{ color: 'var(--paper-text)' }}>Loading your assigned projects...</p>
          </section>
        )}

        {!isLoadingProjects && projectsError && (
          <section className="rounded-2xl border p-6 shadow-sm" style={{ backgroundColor: 'var(--paper-surface)', borderColor: 'var(--paper-border)' }}>
            <p className="text-sm font-medium" style={{ color: 'var(--accent-red)' }}>
              {projectsError}
            </p>
          </section>
        )}

        {!isLoadingProjects && !projectsError && projects.length === 0 && (
          <section className="rounded-2xl border p-6 shadow-sm" style={{ backgroundColor: 'var(--paper-surface)', borderColor: 'var(--paper-border)' }}>
            <p className="text-lg font-medium" style={{ color: 'var(--paper-text)' }}>
              No assigned projects yet.
            </p>
            <p className="mt-2 text-sm" style={{ color: 'var(--paper-text-muted)' }}>
              When a project is assigned to you, it will show up here along with its tasks.
            </p>
          </section>
        )}

        {!isLoadingProjects && !projectsError && projects.length > 0 && (
          <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {projects.map((project) => (
              <article
                key={project.id}
                className="rounded-2xl border p-5 shadow-sm transition-transform duration-200 ease-out hover:-translate-y-1 hover:shadow-lg"
                style={{ backgroundColor: 'var(--paper-surface)', borderColor: 'var(--paper-border)' }}
              >
                <div className="mb-4 flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em]" style={{ color: 'var(--accent-red)' }}>
                      Project #{project.id}
                    </p>
                    <h3 className="mt-1 text-xl font-semibold" style={{ color: 'var(--paper-text)' }}>
                      {project.name}
                    </h3>
                  </div>
                  <span
                    className="rounded-full px-3 py-1 text-xs font-medium"
                    style={{ backgroundColor: 'var(--paper-bg)', color: 'var(--paper-text-muted)' }}
                  >
                    {project.tasks.length} {project.tasks.length === 1 ? 'task' : 'tasks'}
                  </span>
                </div>

                {project.tasks.length > 0 ? (
                  <ul className="space-y-3">
                    {project.tasks.map((task) => (
                      <li
                        key={task.id}
                        className="rounded-xl border p-3"
                        style={{ borderColor: 'var(--paper-border)', backgroundColor: 'var(--paper-bg)' }}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="font-medium" style={{ color: 'var(--paper-text)' }}>
                              {task.name}
                            </p>
                            <p className="mt-1 text-sm" style={{ color: 'var(--paper-text-muted)' }}>
                              {task.description}
                            </p>
                          </div>
                          <span
                            className="whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium capitalize"
                            style={{ backgroundColor: 'var(--paper-surface)', color: 'var(--accent-red)' }}
                          >
                            {statusLabel(task.status)}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm" style={{ color: 'var(--paper-text-muted)' }}>
                    This project does not have any tasks yet.
                  </p>
                )}
              </article>
            ))}
          </section>
        )}
      </main>
    </div>
  )
}

export default Home
