import { lazy, Suspense, useEffect } from 'react'
import { BrowserRouter, Outlet, Route, Routes, useLocation } from 'react-router'
import { LanguageProvider } from './i18n/LanguageContext'
import { DataProvider } from './data/DataContext'
import Header from './components/Header'
import Footer from './components/Footer'
import FloatingButtons from './components/FloatingButtons'
import Home from './pages/Home'
import Collection from './pages/Collection'
import ProductDetail from './pages/ProductDetail'
import GalleryPage from './pages/GalleryPage'
import About from './pages/About'
import Contact from './pages/Contact'
import NotFound from './pages/NotFound'

// The admin panel (and the full Supabase client) only downloads when /admin is opened.
const AdminApp = lazy(() => import('./admin/AdminApp'))

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname])
  return null
}

function SiteLayout() {
  return (
    <>
      <Header />
      <main className="min-h-[60vh]">
        <Outlet />
      </main>
      <Footer />
      <FloatingButtons />
    </>
  )
}

function AdminFallback() {
  return <div className="grid min-h-screen place-items-center text-ink-soft">Loading admin…</div>
}

export default function App() {
  return (
    <LanguageProvider>
      <DataProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route
              path="/admin/*"
              element={
                <Suspense fallback={<AdminFallback />}>
                  <AdminApp />
                </Suspense>
              }
            />
            <Route element={<SiteLayout />}>
              <Route index element={<Home />} />
              <Route path="collection" element={<Collection />} />
              <Route path="product/:id" element={<ProductDetail />} />
              <Route path="gallery" element={<GalleryPage />} />
              <Route path="about" element={<About />} />
              <Route path="contact" element={<Contact />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </DataProvider>
    </LanguageProvider>
  )
}
