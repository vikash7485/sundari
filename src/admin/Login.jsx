import { useState } from 'react'
import { Link } from 'react-router'
import { adminApi, isDemo } from './adminApi'
import { Spinner } from './ui'
import Icon from '../components/Icon'
import { Monogram } from '../components/Logo'
import { SHOP } from '../config'

const PRESET_EMAIL = import.meta.env.VITE_ADMIN_EMAIL || ''

export default function Login({ onLogin }) {
  const [email, setEmail] = useState(PRESET_EMAIL)
  const [editEmail, setEditEmail] = useState(!PRESET_EMAIL && !isDemo)
  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    setBusy(true)
    setError('')
    try {
      const user = await adminApi.signIn(email, password)
      onLogin(user)
    } catch (err) {
      setError(err.message || 'Could not log in')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="texture-dots grid min-h-screen place-items-center bg-maroon-deep px-4 py-10">
      <form onSubmit={submit} className="w-full max-w-sm rounded-3xl border border-gold/40 bg-cream p-6 shadow-2xl sm:p-8">
        <div className="flex flex-col items-center text-center">
          <Monogram className="size-14 text-[22px]" />
          <h1 className="mt-4 font-display text-2xl font-semibold text-maroon">Owner Login</h1>
          <p className="mt-1 font-deva text-ink-soft">{SHOP.name.hi} · एडमिन</p>
        </div>

        <div className="mt-7 space-y-4">
          {!isDemo &&
            (editEmail ? (
              <div>
                <label className="label" htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  autoComplete="username"
                  className="field"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            ) : (
              <p className="flex items-center justify-between rounded-xl bg-ivory px-3 py-2.5 text-sm">
                <span className="truncate text-ink">{email}</span>
                <button type="button" className="ml-2 shrink-0 text-maroon underline" onClick={() => setEditEmail(true)}>
                  Change
                </button>
              </p>
            ))}
          <div>
            <label className="label" htmlFor="password">Password / पासवर्ड</label>
            <div className="relative">
              <input
                id="password"
                type={show ? 'text' : 'password'}
                autoComplete="current-password"
                className="field pr-12"
                required
                autoFocus
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShow((s) => !s)}
                className="absolute right-1 top-1/2 grid size-10 -translate-y-1/2 place-items-center text-ink-soft"
                aria-label={show ? 'Hide password' : 'Show password'}
              >
                <Icon name="eye" className="size-5" />
              </button>
            </div>
          </div>
        </div>

        {error && <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

        <button type="submit" disabled={busy} className="btn btn-maroon mt-6 w-full py-3.5 text-base disabled:opacity-60">
          {busy && <Spinner className="size-4" />}
          Log in
        </button>

        {isDemo && (
          <p className="mt-4 rounded-lg bg-gold-pale px-3 py-2 text-[0.78rem] text-ink-soft">
            Demo mode (Supabase not connected yet).
            {import.meta.env.DEV && ' Demo password is set in .env as VITE_DEMO_ADMIN_PASSWORD (default: sundari-demo).'}
          </p>
        )}
        <Link to="/" className="mt-5 block text-center text-sm text-maroon underline decoration-gold underline-offset-4">
          ← Back to website
        </Link>
      </form>
    </div>
  )
}
