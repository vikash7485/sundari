import { createContext, useCallback, useContext, useState } from 'react'
import Icon from '../components/Icon'
import SafeImg from '../components/SafeImg'

// ---------- Toasts ----------
const ToastContext = createContext(() => {})

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null)
  const show = useCallback((message, type = 'ok') => {
    const id = Date.now()
    setToast({ id, message, type })
    setTimeout(() => setToast((t) => (t?.id === id ? null : t)), type === 'error' ? 6000 : 3000)
  }, [])
  return (
    <ToastContext.Provider value={show}>
      {children}
      {toast && (
        <div
          role="status"
          className={`fixed inset-x-4 bottom-24 z-[80] mx-auto flex max-w-md animate-fade-up items-start gap-2.5 rounded-xl px-4 py-3 text-sm text-white shadow-lift lg:bottom-6 ${
            toast.type === 'error' ? 'bg-red-700' : 'bg-ink'
          }`}
        >
          <Icon name={toast.type === 'error' ? 'x' : 'check'} className="mt-0.5 size-4 shrink-0" strokeWidth={2.4} />
          <span className="flex-1">{toast.message}</span>
        </div>
      )}
    </ToastContext.Provider>
  )
}

export const useToast = () => useContext(ToastContext)

// ---------- Layout bits ----------
export function AdminPage({ title, subtitle, actions, children }) {
  return (
    <div className="mx-auto max-w-5xl px-4 pb-28 pt-5 sm:px-6 lg:pb-12 lg:pt-8">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold text-maroon sm:text-3xl">{title}</h1>
          {subtitle && <p className="mt-1 text-sm text-ink-soft">{subtitle}</p>}
        </div>
        {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
      </div>
      <div className="space-y-5">{children}</div>
    </div>
  )
}

export function Panel({ title, description, children, className = '', right }) {
  return (
    <section className={`rounded-2xl border border-gold/25 bg-white p-4 shadow-soft sm:p-6 ${className}`}>
      {(title || right) && (
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            {title && <h2 className="font-display text-lg font-semibold text-maroon">{title}</h2>}
            {description && <p className="mt-0.5 text-sm text-ink-soft">{description}</p>}
          </div>
          {right}
        </div>
      )}
      {children}
    </section>
  )
}

export function Field({ label, hint, htmlFor, children, className = '' }) {
  return (
    <div className={className}>
      {label && (
        <label className="label" htmlFor={htmlFor}>
          {label}
        </label>
      )}
      {children}
      {hint && <p className="mt-1 text-[0.78rem] text-ink-soft">{hint}</p>}
    </div>
  )
}

export function Toggle({ checked, onChange, label, hint, disabled }) {
  return (
    <label className={`flex cursor-pointer items-center justify-between gap-4 ${disabled ? 'opacity-50' : ''}`}>
      <span>
        <span className="block text-[0.95rem] font-medium text-ink">{label}</span>
        {hint && <span className="block text-[0.78rem] text-ink-soft">{hint}</span>}
      </span>
      <input type="checkbox" className="peer sr-only" checked={!!checked} disabled={disabled} onChange={(e) => onChange(e.target.checked)} />
      <span className="relative h-7 w-12 shrink-0 rounded-full bg-gold/30 transition after:absolute after:left-1 after:top-1 after:size-5 after:rounded-full after:bg-white after:shadow after:transition peer-checked:bg-maroon peer-checked:after:translate-x-5 peer-focus-visible:ring-2 peer-focus-visible:ring-gold" />
    </label>
  )
}

export function Spinner({ className = 'size-5' }) {
  return (
    <svg viewBox="0 0 24 24" className={`animate-spin ${className}`} aria-hidden="true">
      <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeOpacity=".25" strokeWidth="3" />
      <path d="M21 12a9 9 0 0 0-9-9" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}

export function SaveButton({ busy, children = 'Save', className = '', ...rest }) {
  return (
    <button type="submit" disabled={busy} className={`btn btn-maroon px-6 disabled:opacity-60 ${className}`} {...rest}>
      {busy ? <Spinner className="size-4" /> : <Icon name="check" className="size-4" strokeWidth={2.4} />}
      {children}
    </button>
  )
}

export function Thumb({ src, className = 'size-14' }) {
  return (
    <SafeImg
      src={src}
      loading="lazy"
      className={`${className} shrink-0 rounded-lg border border-gold/25 bg-ivory object-cover`}
      fallback={
        <span className={`${className} grid shrink-0 place-items-center rounded-lg border border-gold/25 bg-ivory text-gold`}>
          <Icon name="image" className="size-5" />
        </span>
      }
    />
  )
}
