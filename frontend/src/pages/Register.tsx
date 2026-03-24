import { useEffect, useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<'project_manager' | 'technician'>('technician')
  const [organizationId, setOrganizationId] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()
  const { user, isLoading, register } = useAuth()

  useEffect(() => {
    if (!isLoading && user) {
      navigate('/', { replace: true })
    }
  }, [isLoading, navigate, user])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')

    const parsedOrganizationId = Number.parseInt(organizationId, 10)

    if (Number.isNaN(parsedOrganizationId) || parsedOrganizationId <= 0) {
      setError('Organization ID must be a valid positive number.')
      return
    }

    setIsSubmitting(true)

    try {
      await register({
        name,
        email,
        password,
        role,
        organizationId: parsedOrganizationId,
      })

      navigate('/', { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: 'var(--paper-bg)' }}>
      <div
        className="w-full max-w-md rounded-lg border p-6 shadow-sm"
        style={{ backgroundColor: 'var(--paper-surface)', borderColor: 'var(--paper-border)' }}
      >
        <h2 className="mb-2 text-xl font-semibold text-center" style={{ color: 'var(--paper-text)' }}>
          Register
        </h2>
        <p className="mb-6 text-center text-sm" style={{ color: 'var(--paper-text-muted)' }}>
          Create an account using the organization ID you were given.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label htmlFor="name" className="mb-1 block text-sm font-medium" style={{ color: 'var(--paper-text-muted)' }}>
              Full name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoComplete="name"
              placeholder="Jane Doe"
              className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--accent-red)]/30 focus:border-[var(--accent-red)] transition-colors placeholder:text-[var(--paper-text-muted)]/60"
              style={{
                backgroundColor: 'var(--paper-surface)',
                borderColor: 'var(--paper-border)',
                color: 'var(--paper-text)',
              }}
            />
          </div>

          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium" style={{ color: 'var(--paper-text-muted)' }}>
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              placeholder="you@example.com"
              className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--accent-red)]/30 focus:border-[var(--accent-red)] transition-colors placeholder:text-[var(--paper-text-muted)]/60"
              style={{
                backgroundColor: 'var(--paper-surface)',
                borderColor: 'var(--paper-border)',
                color: 'var(--paper-text)',
              }}
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-1 block text-sm font-medium" style={{ color: 'var(--paper-text-muted)' }}>
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="new-password"
              className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--accent-red)]/30 focus:border-[var(--accent-red)] transition-colors"
              style={{
                backgroundColor: 'var(--paper-surface)',
                borderColor: 'var(--paper-border)',
                color: 'var(--paper-text)',
              }}
            />
          </div>

          <div>
            <label htmlFor="role" className="mb-1 block text-sm font-medium" style={{ color: 'var(--paper-text-muted)' }}>
              Role
            </label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value as 'project_manager' | 'technician')}
              className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--accent-red)]/30 focus:border-[var(--accent-red)] transition-colors"
              style={{
                backgroundColor: 'var(--paper-surface)',
                borderColor: 'var(--paper-border)',
                color: 'var(--paper-text)',
              }}
            >
              <option value="technician">Technician</option>
              <option value="project_manager">Project Manager</option>
            </select>
          </div>

          <div>
            <label htmlFor="organizationId" className="mb-1 block text-sm font-medium" style={{ color: 'var(--paper-text-muted)' }}>
              Organization ID
            </label>
            <input
              id="organizationId"
              type="number"
              min="1"
              step="1"
              inputMode="numeric"
              value={organizationId}
              onChange={(e) => setOrganizationId(e.target.value)}
              required
              placeholder="e.g. 12"
              className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--accent-red)]/30 focus:border-[var(--accent-red)] transition-colors placeholder:text-[var(--paper-text-muted)]/60"
              style={{
                backgroundColor: 'var(--paper-surface)',
                borderColor: 'var(--paper-border)',
                color: 'var(--paper-text)',
              }}
            />
            <p className="mt-1 text-xs" style={{ color: 'var(--paper-text-muted)' }}>
              Enter the numeric organization ID provided to you.
            </p>
          </div>

          {error && (
            <p className="text-sm" style={{ color: 'var(--accent-red)' }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-md py-2 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors hover:bg-[var(--accent-red-hover)]"
            style={{ backgroundColor: 'var(--accent-red)' }}
          >
            {isSubmitting ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <div className="mt-4 border-t pt-4 text-center" style={{ borderColor: 'var(--paper-border)' }}>
          <p className="mb-3 text-sm" style={{ color: 'var(--paper-text-muted)' }}>
            Already have an account?
          </p>
          <Link
            to="/login"
            className="inline-flex w-full items-center justify-center rounded-md border px-4 py-2 text-sm font-medium transition-colors hover:bg-black/5"
            style={{
              borderColor: 'var(--paper-border)',
              color: 'var(--paper-text)',
              backgroundColor: 'var(--paper-bg)',
            }}
          >
            Back to sign in
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Register
