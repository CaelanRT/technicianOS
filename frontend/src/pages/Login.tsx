import { useState, useEffect, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { user, login } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (user) {
      navigate('/', { replace: true })
    }
  }, [user, navigate])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)
    try {
      await login(email, password)
      navigate('/')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: 'var(--paper-bg)' }}>
      <div className="w-full max-w-sm rounded-lg border p-6 shadow-sm" style={{ backgroundColor: 'var(--paper-surface)', borderColor: 'var(--paper-border)' }}>
        <h2 className="text-xl font-semibold mb-4 text-center" style={{ color: 'var(--paper-text)' }}>Sign in</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label htmlFor="email" className="block text-sm mb-1 font-medium" style={{ color: 'var(--paper-text-muted)' }}>
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="w-full px-3 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-[var(--accent-red)]/30 focus:border-[var(--accent-red)] transition-colors placeholder:text-[var(--paper-text-muted)]/60"
              style={{
                backgroundColor: 'var(--paper-surface)',
                borderColor: 'var(--paper-border)',
                color: 'var(--paper-text)',
              }}
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm mb-1 font-medium" style={{ color: 'var(--paper-text-muted)' }}>
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="w-full px-3 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-[var(--accent-red)]/30 focus:border-[var(--accent-red)] transition-colors placeholder:text-[var(--paper-text-muted)]/60"
              style={{
                backgroundColor: 'var(--paper-surface)',
                borderColor: 'var(--paper-border)',
                color: 'var(--paper-text)',
              }}
            />
          </div>
          {error && (
            <p className="text-sm" style={{ color: 'var(--accent-red)' }}>{error}</p>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2 rounded-md text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors hover:bg-[var(--accent-red-hover)]"
            style={{ backgroundColor: 'var(--accent-red)' }}
          >
            {isSubmitting ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login
