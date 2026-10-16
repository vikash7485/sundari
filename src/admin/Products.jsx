import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import { AdminPage, Thumb, useToast } from './ui'
import { adminApi } from './adminApi'
import Icon from '../components/Icon'
import { useData } from '../data/DataContext'
import { formatPrice, formatWeight } from '../lib/format'
import { productCode } from '../config'

export default function Products() {
  const { products, categories, categoryBySlug, refresh } = useData()
  const toast = useToast()
  const [sp, setSp] = useSearchParams()
  const [q, setQ] = useState('')
  const [busyId, setBusyId] = useState(null)
  const cat = sp.get('category') || ''

  const list = useMemo(() => {
    const s = q.trim().toLowerCase()
    return products.filter((p) => {
      if (cat === '_none' ? p.category : cat && p.category !== cat) return false
      if (!s) return true
      return [p.title, p.title_hi, productCode(p.id), String(p.id)].filter(Boolean).join(' ').toLowerCase().includes(s)
    })
  }, [products, q, cat])

  const toggleStock = async (p) => {
    setBusyId(p.id)
    try {
      await adminApi.updateProductFields(p.id, { in_stock: !p.in_stock })
      await refresh()
      toast(`${p.title}: ${!p.in_stock ? 'In stock' : 'Out of stock'}`)
    } catch (e) {
      toast(e.message, 'error')
    } finally {
      setBusyId(null)
    }
  }

  return (
    <AdminPage
      title="Products"
      subtitle={`${products.length} products on your website`}
      actions={
        <Link to="/admin/products/new" className="btn btn-maroon">
          <Icon name="plus" className="size-4" strokeWidth={2.4} /> Add product
        </Link>
      }
    >
      <div className="flex flex-col gap-2 sm:flex-row">
        <label className="relative flex-1">
          <Icon name="search" className="pointer-events-none absolute left-3.5 top-1/2 size-5 -translate-y-1/2 text-gold-dark" />
          <input className="field pl-11" placeholder="Search by name or code (SJ-1001)" value={q} onChange={(e) => setQ(e.target.value)} />
        </label>
        <select
          className="field sm:w-60"
          value={cat}
          onChange={(e) => setSp(e.target.value ? { category: e.target.value } : {}, { replace: true })}
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.name_en}
            </option>
          ))}
          <option value="_none">No category</option>
        </select>
      </div>

      {list.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gold/60 bg-white p-10 text-center">
          <p className="text-ink-soft">No products found.</p>
          <Link to="/admin/products/new" className="btn btn-maroon mt-4">
            <Icon name="plus" className="size-4" /> Add your first product
          </Link>
        </div>
      ) : (
        <ul className="divide-y divide-gold/15 overflow-hidden rounded-2xl border border-gold/25 bg-white shadow-soft">
          {list.map((p) => (
            <li key={p.id} className="flex items-center gap-3 p-3 sm:gap-4 sm:p-4">
              <Link to={`/admin/products/${p.id}`} className="flex min-w-0 flex-1 items-center gap-3 sm:gap-4">
                <Thumb src={p.images[0]?.thumb || p.images[0]?.full} className="size-16" />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-ink">{p.title}</p>
                  <p className="truncate text-xs text-ink-soft">
                    {productCode(p.id)} · {categoryBySlug[p.category]?.name_en || 'No category'}
                    {p.weight ? ` · ${formatWeight(p.weight)}` : ''}
                  </p>
                  <p className="mt-0.5 text-sm font-semibold text-maroon">
                    {p.price_on_request || p.price == null ? <span className="font-normal italic text-ink-soft">Price on request</span> : formatPrice(p.price)}
                  </p>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {p.is_sample && <span className="rounded-full bg-ink/70 px-2 py-0.5 text-[0.65rem] text-white">SAMPLE</span>}
                    {p.featured && <span className="rounded-full bg-gold-pale px-2 py-0.5 text-[0.65rem] text-gold-dark">★ Featured</span>}
                    {!p.in_stock && <span className="rounded-full bg-maroon-soft px-2 py-0.5 text-[0.65rem] text-maroon">Out of stock</span>}
                  </div>
                </div>
              </Link>
              <div className="flex shrink-0 flex-col items-end gap-2 sm:flex-row sm:items-center">
                <button
                  type="button"
                  disabled={busyId === p.id}
                  onClick={() => toggleStock(p)}
                  className={`rounded-full px-3 py-1.5 text-xs font-medium transition disabled:opacity-50 ${
                    p.in_stock ? 'bg-green-50 text-wa-dark hover:bg-green-100' : 'bg-maroon-soft text-maroon hover:bg-maroon-soft/70'
                  }`}
                  title="Tap to change stock"
                >
                  {p.in_stock ? 'In stock' : 'Sold out'}
                </button>
                <Link to={`/admin/products/${p.id}`} className="grid size-9 place-items-center rounded-full text-maroon hover:bg-gold-pale" aria-label="Edit">
                  <Icon name="edit" className="size-4" />
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}

      <Link
        to="/admin/products/new"
        className="fixed bottom-20 right-4 z-20 grid size-14 place-items-center rounded-full bg-maroon text-white shadow-lift lg:hidden"
        aria-label="Add product"
        style={{ marginBottom: 'env(safe-area-inset-bottom)' }}
      >
        <Icon name="plus" className="size-7" strokeWidth={2.2} />
      </Link>
    </AdminPage>
  )
}
