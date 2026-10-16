import { useState } from 'react'
import { Link } from 'react-router'
import { AdminPage, Panel, Thumb, useToast } from './ui'
import { adminApi } from './adminApi'
import Icon from '../components/Icon'
import { useData } from '../data/DataContext'
import { formatDateTime, formatPrice } from '../lib/format'
import { productCode } from '../config'

function Stat({ label, value, icon, to }) {
  return (
    <Link to={to} className="rounded-2xl border border-gold/25 bg-white p-4 shadow-soft transition hover:-translate-y-0.5 hover:shadow-gold">
      <span className="grid size-9 place-items-center rounded-full bg-gold-pale text-maroon">
        <Icon name={icon} className="size-5" />
      </span>
      <p className="mt-3 font-display text-3xl font-semibold text-maroon">{value}</p>
      <p className="text-sm text-ink-soft">{label}</p>
    </Link>
  )
}

export default function Dashboard() {
  const { products, categories, gallery, settings, refresh } = useData()
  const toast = useToast()
  const [busy, setBusy] = useState(false)
  const samples = products.filter((p) => p.is_sample).length
  const sampleGallery = gallery.filter((g) => g.is_sample).length
  const rates = settings.rates

  const counts = categories
    .map((c) => ({ ...c, n: products.filter((p) => p.category === c.slug).length }))
    .sort((a, b) => b.n - a.n)
  const max = Math.max(1, ...counts.map((c) => c.n))
  const uncategorised = products.filter((p) => !p.category).length

  const removeSamples = async () => {
    if (!confirm(`Delete all ${samples} sample products and ${sampleGallery} sample gallery photos? Your own items are not touched.`)) return
    setBusy(true)
    try {
      await adminApi.deleteSampleProducts()
      await adminApi.deleteSampleGallery()
      await refresh()
      toast('Sample items deleted')
    } catch (e) {
      toast(e.message, 'error')
    } finally {
      setBusy(false)
    }
  }

  return (
    <AdminPage
      title="Namaste 🙏"
      subtitle="Here is a quick look at your website."
      actions={
        <Link to="/admin/products/new" className="btn btn-maroon">
          <Icon name="plus" className="size-4" strokeWidth={2.4} /> Add product
        </Link>
      }
    >
      {(samples > 0 || sampleGallery > 0) && (
        <div className="flex flex-col gap-3 rounded-2xl border border-gold bg-gold-pale/60 p-4 sm:flex-row sm:items-center">
          <Icon name="sparkle" className="size-6 shrink-0 text-gold-dark" />
          <p className="flex-1 text-sm text-ink">
            Your website is showing <strong>{samples} sample products</strong>
            {sampleGallery > 0 && (
              <>
                {' '}and <strong>{sampleGallery} sample shop photos</strong>
              </>
            )}
            . Add your real jewellery, then delete the samples.
          </p>
          <button type="button" disabled={busy} onClick={removeSamples} className="btn btn-outline shrink-0 bg-white">
            <Icon name="trash" className="size-4" /> Delete samples
          </button>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Total products" value={products.length} icon="gem" to="/admin/products" />
        <Stat label="In stock" value={products.filter((p) => p.in_stock).length} icon="check" to="/admin/products" />
        <Stat label="Categories" value={categories.length} icon="tag" to="/admin/categories" />
        <Stat label="Gallery photos" value={gallery.length} icon="image" to="/admin/gallery" />
      </div>

      <Panel
        title="Today's gold & silver rate"
        description={rates.updated_at ? `Last updated: ${formatDateTime(rates.updated_at)}` : 'Not set yet – visitors see "Call for rate".'}
        right={
          <Link to="/admin/rates" className="btn btn-gold shrink-0 px-4 py-2 text-sm">
            Update
          </Link>
        }
      >
        <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            ['24K / 10g', rates.gold24],
            ['22K / 10g', rates.gold22],
            ['18K / 10g', rates.gold18],
            ['Silver / kg', rates.silver],
          ].map(([k, v]) => (
            <div key={k} className="rounded-xl bg-ivory/70 px-3 py-2.5">
              <dt className="text-xs text-ink-soft">{k}</dt>
              <dd className="font-semibold text-maroon">{v ? formatPrice(v) : '—'}</dd>
            </div>
          ))}
        </dl>
      </Panel>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Panel title="Products per category">
          <ul className="space-y-2.5">
            {counts.map((c) => (
              <li key={c.slug}>
                <Link to={`/admin/products?category=${c.slug}`} className="group block">
                  <div className="flex justify-between text-sm">
                    <span className="text-ink group-hover:text-maroon">{c.name_en}</span>
                    <span className="font-medium text-ink-soft">{c.n}</span>
                  </div>
                  <div className="mt-1 h-1.5 rounded-full bg-ivory">
                    <div className="h-full rounded-full bg-linear-to-r from-gold to-maroon" style={{ width: `${(c.n / max) * 100}%` }} />
                  </div>
                </Link>
              </li>
            ))}
            {uncategorised > 0 && (
              <li className="text-sm text-ink-soft">
                No category: <strong>{uncategorised}</strong>
              </li>
            )}
          </ul>
        </Panel>

        <Panel
          title="Latest products"
          right={
            <Link to="/admin/products" className="text-sm text-maroon underline decoration-gold underline-offset-4">
              See all
            </Link>
          }
        >
          {products.length === 0 ? (
            <p className="text-sm text-ink-soft">No products yet.</p>
          ) : (
            <ul className="divide-y divide-gold/15">
              {products.slice(0, 6).map((p) => (
                <li key={p.id}>
                  <Link to={`/admin/products/${p.id}`} className="flex items-center gap-3 py-2.5 hover:bg-ivory/40">
                    <Thumb src={p.images[0]?.thumb} className="size-12" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-ink">{p.title}</p>
                      <p className="text-xs text-ink-soft">
                        {productCode(p.id)} · {p.price_on_request || p.price == null ? 'Price on request' : formatPrice(p.price)}
                      </p>
                    </div>
                    <Icon name="chevronRight" className="size-4 text-gold" />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>
    </AdminPage>
  )
}
