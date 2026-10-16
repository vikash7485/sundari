import { useEffect, useState } from 'react'
import { Link, Navigate, NavLink, Route, Routes } from 'react-router'
import { adminApi, isDemo } from './adminApi'
import { ToastProvider, Spinner } from './ui'
import Login from './Login'
import Dashboard from './Dashboard'
import Products from './Products'
import ProductForm from './ProductForm'
import Categories from './Categories'
import Rates from './Rates'
import GalleryAdmin from './GalleryAdmin'
import SiteSettings from './SiteSettings'
import Icon from '../components/Icon'
import { Monogram } from '../components/Logo'

const NAV = [
  { to: '/admin', label: 'Dashboard', short: 'Home', icon: 'home', end: true },
  { to: '/admin/products', label: 'Products', short: 'Products', icon: 'gem' },
  { to: '/admin/rates', label: "Today's Rate", short: 'Rates', icon: 'trend' },
  { to: '/admin/gallery', label: 'Shop Gallery', short: 'Gallery', icon: 'image' },
  { to: '/admin/categories', label: 'Categories', short: 'Categories', icon: 'tag' },
  { to: '/admin/settings', label: 'Shop Settings', short: 'Settings', icon: 'sliders' },
]

function useNoIndex() {
  useEffect(() => {
    const prevTitle = document.title
    document.title = 'Admin – Sundari Jewellers'
    const meta = document.createElement('meta')
    meta.name = 'robots'
    meta.content = 'noindex, nofollow'
    document.head.appendChild(meta)
    return () => {
      document.title = prevTitle
      meta.remove()
    }
  }, [])
}

function DemoBanner() {
  if (!isDemo) return null
  return (
    <div className="bg-gold-pale px-4 py-2 text-center text-[0.8rem] text-ink">
      <strong>Demo mode:</strong> changes are saved only in this browser. Connect Supabase (see README) so every visitor sees your products.
    </div>
  )
}

function Layout({ user, children }) {
  const logout = () => adminApi.signOut()
  return (
    <div className="min-h-screen bg-cream lg:grid lg:grid-cols-[15.5rem_minmax(0,1fr)]">
      {/* Desktop sidebar */}
      <aside className="texture-dots sticky top-0 hidden h-screen flex-col bg-maroon-deep p-5 text-white/80 lg:flex">
        <Link to="/admin" className="flex items-center gap-3">
          <Monogram className="size-10 text-[16px]" />
          <span>
            <span className="block font-display text-lg text-white">Sundari</span>
            <span className="block text-xs tracking-[0.2em] text-gold-light">ADMIN</span>
          </span>
        </Link>
        <nav className="mt-8 flex flex-col gap-1">
          {NAV.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.end}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-2.5 text-[0.95rem] transition ${isActive ? 'bg-gold text-maroon-deep' : 'hover:bg-white/10'}`
              }
            >
              <Icon name={n.icon} className="size-5" />
              {n.label}
            </NavLink>
          ))}
        </nav>
        <div className="mt-auto space-y-1 border-t border-white/10 pt-4 text-sm">
          <p className="truncate px-3 text-xs text-white/50">{user.email}</p>
          <a href="/" target="_blank" rel="noopener" className="flex items-center gap-3 rounded-xl px-3 py-2 hover:bg-white/10">
            <Icon name="external" className="size-4" /> View website
          </a>
          <button type="button" onClick={logout} className="flex w-full items-center gap-3 rounded-xl px-3 py-2 hover:bg-white/10">
            <Icon name="logout" className="size-4" /> Log out
          </button>
        </div>
      </aside>

      <div className="min-w-0">
        {/* Mobile top bar */}
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-gold/25 bg-cream/95 px-4 py-2.5 backdrop-blur lg:hidden">
          <Link to="/admin" className="flex items-center gap-2">
            <Monogram className="size-9 text-[15px]" />
            <span className="font-display text-lg text-maroon">Admin</span>
          </Link>
          <a href="/" target="_blank" rel="noopener" className="ml-auto grid size-10 place-items-center rounded-full text-maroon hover:bg-gold-pale" aria-label="View website">
            <Icon name="external" className="size-5" />
          </a>
          <button type="button" onClick={logout} className="grid size-10 place-items-center rounded-full text-maroon hover:bg-gold-pale" aria-label="Log out">
            <Icon name="logout" className="size-5" />
          </button>
        </header>
        <DemoBanner />
        <main>{children}</main>
      </div>

      {/* Mobile bottom tabs */}
      <nav
        className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-6 border-t border-gold/30 bg-white/95 backdrop-blur lg:hidden"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        {NAV.map((n) => (
          <NavLink
            key={n.to}
            to={n.to}
            end={n.end}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 py-2 text-[0.62rem] font-medium ${isActive ? 'text-maroon' : 'text-ink-soft'}`
            }
          >
            {({ isActive }) => (
              <>
                <span className={`grid h-7 w-11 place-items-center rounded-full transition ${isActive ? 'bg-gold-pale' : ''}`}>
                  <Icon name={n.icon} className="size-5" />
                </span>
                {n.short}
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}

export default function AdminApp() {
  const [user, setUser] = useState(undefined) // undefined = still checking
  useNoIndex()

  useEffect(() => {
    let unsub
    let alive = true
    adminApi.getUser().then((u) => alive && setUser(u))
    adminApi.onAuthChange((u) => setUser(u)).then((fn) => {
      unsub = fn
      if (!alive) fn()
    })
    return () => {
      alive = false
      unsub?.()
    }
  }, [])

  if (user === undefined) {
    return (
      <div className="grid min-h-screen place-items-center text-maroon">
        <Spinner className="size-8" />
      </div>
    )
  }

  if (!user) return <Login onLogin={setUser} />

  return (
    <ToastProvider>
      <Layout user={user}>
        <Routes>
          <Route index element={<Dashboard />} />
          <Route path="products" element={<Products />} />
          <Route path="products/new" element={<ProductForm />} />
          <Route path="products/:id" element={<ProductForm />} />
          <Route path="categories" element={<Categories />} />
          <Route path="rates" element={<Rates />} />
          <Route path="gallery" element={<GalleryAdmin />} />
          <Route path="settings" element={<SiteSettings />} />
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
      </Layout>
    </ToastProvider>
  )
}
