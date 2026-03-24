import { useCallback, useEffect, useRef, useState, type FormEvent, type KeyboardEvent as ReactKeyboardEvent } from 'react'
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

type ProjectFormState = {
  name: string
  projectManagerId: string
  technicianId: string
}

type TaskFormState = {
  name: string
  description: string
  status: Task['status']
}

function SettingsIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1Z" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  )
}

function statusLabel(status: Task['status']) {
  return status.replace('_', ' ')
}

function buildProjectForm(project: Project): ProjectFormState {
  return {
    name: project.name,
    projectManagerId: String(project.projectManagerId),
    technicianId: String(project.technicianId),
  }
}

function buildTaskForm(task: Task): TaskFormState {
  return {
    name: task.name,
    description: task.description,
    status: task.status,
  }
}

function Home() {
  const { logout } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoadingProjects, setIsLoadingProjects] = useState(true)
  const [projectsError, setProjectsError] = useState('')
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [projectForm, setProjectForm] = useState<ProjectFormState | null>(null)
  const [isSavingProject, setIsSavingProject] = useState(false)
  const [projectFormError, setProjectFormError] = useState('')
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [selectedTaskProject, setSelectedTaskProject] = useState<Project | null>(null)
  const [taskForm, setTaskForm] = useState<TaskFormState | null>(null)
  const [isSavingTask, setIsSavingTask] = useState(false)
  const [taskFormError, setTaskFormError] = useState('')
  const menuRef = useRef<HTMLDivElement>(null)

  const loadAssignedProjects = useCallback(async () => {
    setIsLoadingProjects(true)
    setProjectsError('')

    try {
      const data = await request<{ projects: Project[] }>('/assignedProjects')
      setProjects(data.projects)
    } catch (err) {
      setProjects([])
      setProjectsError(err instanceof Error ? err.message : 'Unable to load assigned projects')
    } finally {
      setIsLoadingProjects(false)
    }
  }, [])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false)
      }
    }

    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [menuOpen])

  useEffect(() => {
    void loadAssignedProjects()
  }, [loadAssignedProjects])

  useEffect(() => {
    if (!selectedProject && !selectedTask) {
      return
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        closeProjectModal()
        closeTaskModal()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [selectedProject, selectedTask])

  useEffect(() => {
    if (!selectedProject && !selectedTask) {
      return
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [selectedProject, selectedTask])

  function openProjectModal(project: Project) {
    setSelectedTask(null)
    setSelectedTaskProject(null)
    setTaskForm(null)
    setTaskFormError('')
    setSelectedProject(project)
    setProjectForm(buildProjectForm(project))
    setProjectFormError('')
  }

  function closeProjectModal() {
    setSelectedProject(null)
    setProjectForm(null)
    setProjectFormError('')
  }

  function openTaskModal(project: Project, task: Task) {
    setSelectedProject(null)
    setProjectForm(null)
    setProjectFormError('')
    setSelectedTaskProject(project)
    setSelectedTask(task)
    setTaskForm(buildTaskForm(task))
    setTaskFormError('')
  }

  function closeTaskModal() {
    setSelectedTask(null)
    setSelectedTaskProject(null)
    setTaskForm(null)
    setTaskFormError('')
  }

  async function handleProjectUpdate(event: FormEvent) {
    event.preventDefault()

    if (!selectedProject || !projectForm) {
      return
    }

    const projectManagerId = Number.parseInt(projectForm.projectManagerId, 10)
    const technicianId = Number.parseInt(projectForm.technicianId, 10)

    if (!projectForm.name.trim()) {
      setProjectFormError('Project name is required.')
      return
    }

    if ([projectManagerId, technicianId].some((value) => Number.isNaN(value) || value <= 0)) {
      setProjectFormError('Project manager ID and technician ID must both be valid positive numbers.')
      return
    }

    setIsSavingProject(true)
    setProjectFormError('')

    try {
      await request(`/projects/${selectedProject.id}`, {
        method: 'PATCH',
        body: {
          name: projectForm.name.trim(),
          organizationId: selectedProject.organizationId,
          projectManagerId,
          technicianId,
        },
      })

      await loadAssignedProjects()
      closeProjectModal()
    } catch (err) {
      setProjectFormError(err instanceof Error ? err.message : 'Unable to update project')
    } finally {
      setIsSavingProject(false)
    }
  }

  async function handleTaskUpdate(event: FormEvent) {
    event.preventDefault()

    if (!selectedTask || !selectedTaskProject || !taskForm) {
      return
    }

    if (!taskForm.name.trim() || !taskForm.description.trim()) {
      setTaskFormError('Task name and description are required.')
      return
    }

    setIsSavingTask(true)
    setTaskFormError('')

    try {
      await request(`/tasks/${selectedTask.id}`, {
        method: 'PATCH',
        body: {
          name: taskForm.name.trim(),
          description: taskForm.description.trim(),
          projectId: selectedTask.projectId,
          status: taskForm.status,
          assignedToUserId: selectedTask.assignedToUserId,
        },
      })

      await loadAssignedProjects()
      closeTaskModal()
    } catch (err) {
      setTaskFormError(err instanceof Error ? err.message : 'Unable to update task')
    } finally {
      setIsSavingTask(false)
    }
  }

  function handleProjectCardKeyDown(event: ReactKeyboardEvent<HTMLElement>, project: Project) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      openProjectModal(project)
    }
  }

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
              onClick={() => setMenuOpen((open) => !open)}
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
                role="button"
                tabIndex={0}
                onClick={() => openProjectModal(project)}
                onKeyDown={(event) => handleProjectCardKeyDown(event, project)}
                className="flex h-full cursor-pointer flex-col items-stretch rounded-2xl border p-5 text-left align-top shadow-sm transition-transform duration-200 ease-out hover:-translate-y-1 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent-red)]/20"
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
                      <li key={task.id}>
                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation()
                            openTaskModal(project, task)
                          }}
                          className="w-full cursor-pointer rounded-xl border p-3 text-left transition-all duration-200 ease-out hover:-translate-y-0.5 hover:border-[var(--accent-red)]/30 hover:bg-white hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[var(--accent-red)]/20"
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
                        </button>
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

      {selectedProject && projectForm && (
        <div
          className="fixed inset-0 z-30 flex items-center justify-center bg-black/45 px-4 py-6"
          onClick={closeProjectModal}
          role="presentation"
        >
          <div
            className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border p-6 shadow-2xl sm:p-8"
            style={{ backgroundColor: 'var(--paper-surface)', borderColor: 'var(--paper-border)' }}
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={closeProjectModal}
              className="absolute right-4 top-4 rounded-full p-2 transition-colors hover:bg-[var(--paper-bg)]"
              style={{ color: 'var(--paper-text-muted)' }}
              aria-label="Close edit project modal"
            >
              <CloseIcon />
            </button>

            <div className="mb-6 pr-10">
              <p className="text-xs font-semibold uppercase tracking-[0.16em]" style={{ color: 'var(--accent-red)' }}>
                Edit project
              </p>
              <h3 className="mt-2 text-2xl font-semibold" style={{ color: 'var(--paper-text)' }}>
                {selectedProject.name}
              </h3>
            </div>

            <form onSubmit={handleProjectUpdate} className="flex flex-col gap-4">
              <div>
                <label htmlFor="project-name" className="mb-1 block text-sm font-medium" style={{ color: 'var(--paper-text-muted)' }}>
                  Name
                </label>
                <input
                  id="project-name"
                  type="text"
                  value={projectForm.name}
                  onChange={(event) =>
                    setProjectForm((current) =>
                      current
                        ? {
                            ...current,
                            name: event.target.value,
                          }
                        : current,
                    )
                  }
                  required
                  className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--accent-red)]/30 focus:border-[var(--accent-red)] transition-colors"
                  style={{
                    backgroundColor: 'var(--paper-surface)',
                    borderColor: 'var(--paper-border)',
                    color: 'var(--paper-text)',
                  }}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="project-manager-id" className="mb-1 block text-sm font-medium" style={{ color: 'var(--paper-text-muted)' }}>
                    Project manager ID
                  </label>
                  <input
                    id="project-manager-id"
                    type="number"
                    min="1"
                    step="1"
                    value={projectForm.projectManagerId}
                    onChange={(event) =>
                      setProjectForm((current) =>
                        current
                          ? {
                              ...current,
                              projectManagerId: event.target.value,
                            }
                          : current,
                      )
                    }
                    required
                    className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--accent-red)]/30 focus:border-[var(--accent-red)] transition-colors"
                    style={{
                      backgroundColor: 'var(--paper-surface)',
                      borderColor: 'var(--paper-border)',
                      color: 'var(--paper-text)',
                    }}
                  />
                </div>

                <div>
                  <label htmlFor="technician-id" className="mb-1 block text-sm font-medium" style={{ color: 'var(--paper-text-muted)' }}>
                    Technician ID
                  </label>
                  <input
                    id="technician-id"
                    type="number"
                    min="1"
                    step="1"
                    value={projectForm.technicianId}
                    onChange={(event) =>
                      setProjectForm((current) =>
                        current
                          ? {
                              ...current,
                              technicianId: event.target.value,
                            }
                          : current,
                      )
                    }
                    required
                    className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--accent-red)]/30 focus:border-[var(--accent-red)] transition-colors"
                    style={{
                      backgroundColor: 'var(--paper-surface)',
                      borderColor: 'var(--paper-border)',
                      color: 'var(--paper-text)',
                    }}
                  />
                </div>
              </div>

              {projectFormError && (
                <p className="text-sm" style={{ color: 'var(--accent-red)' }}>
                  {projectFormError}
                </p>
              )}

              <div className="mt-2 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeProjectModal}
                  className="inline-flex items-center justify-center rounded-md border px-4 py-2 text-sm font-medium transition-colors hover:bg-black/5"
                  style={{
                    borderColor: 'var(--paper-border)',
                    color: 'var(--paper-text)',
                    backgroundColor: 'var(--paper-bg)',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingProject}
                  className="inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[var(--accent-red-hover)] disabled:cursor-not-allowed disabled:opacity-50"
                  style={{ backgroundColor: 'var(--accent-red)' }}
                >
                  {isSavingProject ? 'Updating...' : 'Update project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedTask && selectedTaskProject && taskForm && (
        <div
          className="fixed inset-0 z-40 flex items-center justify-center bg-black/45 px-4 py-6"
          onClick={closeTaskModal}
          role="presentation"
        >
          <div
            className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border p-6 shadow-2xl sm:p-8"
            style={{ backgroundColor: 'var(--paper-surface)', borderColor: 'var(--paper-border)' }}
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={closeTaskModal}
              className="absolute right-4 top-4 rounded-full p-2 transition-colors hover:bg-[var(--paper-bg)]"
              style={{ color: 'var(--paper-text-muted)' }}
              aria-label="Close edit task modal"
            >
              <CloseIcon />
            </button>

            <div className="mb-6 pr-10">
              <p className="text-xs font-semibold uppercase tracking-[0.16em]" style={{ color: 'var(--accent-red)' }}>
                Edit task
              </p>
              <h3 className="mt-2 text-2xl font-semibold" style={{ color: 'var(--paper-text)' }}>
                {selectedTask.name}
              </h3>
              <p className="mt-2 text-sm" style={{ color: 'var(--paper-text-muted)' }}>
                Project: {selectedTaskProject.name}
              </p>
            </div>

            <form onSubmit={handleTaskUpdate} className="flex flex-col gap-4">
              <div>
                <label htmlFor="task-name" className="mb-1 block text-sm font-medium" style={{ color: 'var(--paper-text-muted)' }}>
                  Name
                </label>
                <input
                  id="task-name"
                  type="text"
                  value={taskForm.name}
                  onChange={(event) =>
                    setTaskForm((current) =>
                      current
                        ? {
                            ...current,
                            name: event.target.value,
                          }
                        : current,
                    )
                  }
                  required
                  className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--accent-red)]/30 focus:border-[var(--accent-red)] transition-colors"
                  style={{
                    backgroundColor: 'var(--paper-surface)',
                    borderColor: 'var(--paper-border)',
                    color: 'var(--paper-text)',
                  }}
                />
              </div>

              <div>
                <label htmlFor="task-description" className="mb-1 block text-sm font-medium" style={{ color: 'var(--paper-text-muted)' }}>
                  Description
                </label>
                <textarea
                  id="task-description"
                  value={taskForm.description}
                  onChange={(event) =>
                    setTaskForm((current) =>
                      current
                        ? {
                            ...current,
                            description: event.target.value,
                          }
                        : current,
                    )
                  }
                  required
                  rows={4}
                  className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--accent-red)]/30 focus:border-[var(--accent-red)] transition-colors"
                  style={{
                    backgroundColor: 'var(--paper-surface)',
                    borderColor: 'var(--paper-border)',
                    color: 'var(--paper-text)',
                  }}
                />
              </div>

              <div>
                <label htmlFor="task-status" className="mb-1 block text-sm font-medium" style={{ color: 'var(--paper-text-muted)' }}>
                  Status
                </label>
                <select
                  id="task-status"
                  value={taskForm.status}
                  onChange={(event) =>
                    setTaskForm((current) =>
                      current
                        ? {
                            ...current,
                            status: event.target.value as Task['status'],
                          }
                        : current,
                    )
                  }
                  className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--accent-red)]/30 focus:border-[var(--accent-red)] transition-colors"
                  style={{
                    backgroundColor: 'var(--paper-surface)',
                    borderColor: 'var(--paper-border)',
                    color: 'var(--paper-text)',
                  }}
                >
                  <option value="pending">pending</option>
                  <option value="in_progress">in_progress</option>
                  <option value="completed">completed</option>
                </select>
              </div>

              {taskFormError && (
                <p className="text-sm" style={{ color: 'var(--accent-red)' }}>
                  {taskFormError}
                </p>
              )}

              <div className="mt-2 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeTaskModal}
                  className="inline-flex items-center justify-center rounded-md border px-4 py-2 text-sm font-medium transition-colors hover:bg-black/5"
                  style={{
                    borderColor: 'var(--paper-border)',
                    color: 'var(--paper-text)',
                    backgroundColor: 'var(--paper-bg)',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingTask}
                  className="inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[var(--accent-red-hover)] disabled:cursor-not-allowed disabled:opacity-50"
                  style={{ backgroundColor: 'var(--accent-red)' }}
                >
                  {isSavingTask ? 'Updating...' : 'Update task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Home
