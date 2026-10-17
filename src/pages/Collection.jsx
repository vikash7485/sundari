import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router'
import ProductCard, { EmptyState, ProductCardSkeleton } from '../components/ProductCard'
import PriceRange from '../components/PriceRange'
import LoadError from '../components/LoadError'
import Icon, { WhatsAppIcon } from '../components/Icon'
import { useLang } from '../i18n/LanguageContext'
import { useData } from '../data/DataContext'
import { METALS, OCCASIONS, PURITIES, productCode } from '../config'
import { useSeo } from '../lib/seo'
import { waLink } from '../lib/contact'

const PAGE = 24
const LIST_KEYS = ['category', 'metal', 'purity', 'occasion']

const getList = (sp, k) => (sp.get(k) || '').split(',').filter(Boolean)

function niceMax(n) {
  if (!n) return 100000
  const step = n > 500000 ? 50000 : n > 100000 ? 10000 : 1000
  return Math.ceil(n / step) * step
}

function ChipGroup({ options, selected, onToggle, label }) {
  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label={label}>
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          aria-pressed={selected.includes(o.value)}
          onClick={() => onToggle(o.value)}
          className="chip"
        >
          {selected.includes(o.value) && <Icon name="check" className="size-3.5" strokeWidth={2.4} />}
          {o.label}
          {o.count != null && <span className="text-[0.72rem] opacity-60">{o.count}</span>}
        </button>
      ))}
    </div>
  )
}

function FilterBlock({ title, children }) {
  return (
    <div className="border-b border-gold/20 py-5 first:pt-0 last:border-0">
      <h3 className="mb-3 text-[0.78rem] font-semibold uppercase tracking-[0.14em] text-gold-dark">{title}</h3>
      {children}
    </div>
  )
}

function FilterPanel({ f, toggle, update, categoryOptions, priceMax, priceStep }) {
  const { t, L } = useLang()
  const opt = (arr) => arr.map((o) => ({ value: o.value, label: L(o) }))
  return (
    <div>
      <FilterBlock title={t('collection.category')}>
        <ChipGroup label={t('collection.category')} options={categoryOptions} selected={f.category} onToggle={(v) => toggle('category', v)} />
      </FilterBlock>
      <FilterBlock title={t('collection.metal')}>
        <ChipGroup label={t('collection.metal')} options={opt(METALS)} selected={f.metal} onToggle={(v) => toggle('metal', v)} />
      </FilterBlock>
      <FilterBlock title={t('collection.purity')}>
        <ChipGroup label={t('collection.purity')} options={opt(PURITIES)} selected={f.purity} onToggle={(v) => toggle('purity', v)} />
      </FilterBlock>
      <FilterBlock title={t('collection.price')}>
        <PriceRange
          min={0}
          max={priceMax}
          step={priceStep}
          value={[f.min ?? 0, f.max ?? priceMax]}
          onCommit={([lo, hi]) => update({ min: lo > 0 ? lo : null, max: hi < priceMax ? hi : null })}
        />
        {f.priceActive && <p className="mt-2 text-[0.75rem] text-ink-soft">{t('collection.porNote')}</p>}
      </FilterBlock>
      <FilterBlock title={t('collection.occasion')}>
        <ChipGroup label={t('collection.occasion')} options={opt(OCCASIONS)} selected={f.occasion} onToggle={(v) => toggle('occasion', v)} />
      </FilterBlock>
      <FilterBlock title={t('product.inStock')}>
        <label className="flex cursor-pointer items-center justify-between gap-3">
          <span className="text-[0.95rem]">{t('collection.inStockOnly')}</span>
          <input
            type="checkbox"
            className="peer sr-only"
            checked={f.stock}
            onChange={(e) => update({ stock: e.target.checked ? '1' : null })}
          />
          <span className="relative h-7 w-12 shrink-0 rounded-full bg-gold/30 transition peer-checked:bg-maroon peer-focus-visible:ring-2 peer-focus-visible:ring-gold after:absolute after:left-1 after:top-1 after:size-5 after:rounded-full after:bg-white after:shadow after:transition peer-checked:after:translate-x-5" />
        </label>
      </FilterBlock>
    </div>
  )
}

export default function Collection() {
  const { t, pick, lang } = useLang()
  const { products, categories, categoryBySlug, status, failed } = useData()
  const [sp, setSp] = useSearchParams()
  const [drawer, setDrawer] = useState(false)
  const [shown, setShown] = useState(PAGE)

  const priceMax = useMemo(() => niceMax(Math.max(0, ...products.map((p) => p.price || 0))), [products])
  const priceStep = priceMax > 500000 ? 5000 : priceMax > 100000 ? 1000 : 500

  const f = useMemo(() => {
    const min = sp.get('min') ? Number(sp.get('min')) : null
    const max = sp.get('max') ? Number(sp.get('max')) : null
    return {
      q: sp.get('q') || '',
      category: getList(sp, 'category'),
      metal: getList(sp, 'metal'),
      purity: getList(sp, 'purity'),
      occasion: getList(sp, 'occasion'),
      stock: sp.get('stock') === '1',
      sort: sp.get('sort') || 'new',
      min,
      max,
      priceActive: min != null || max != null,
    }
  }, [sp])

  const update = (patch) =>
    setSp(
      (prev) => {
        const n = new URLSearchParams(prev)
        for (const [k, v] of Object.entries(patch)) {
          if (v == null || v === '' || (Array.isArray(v) && !v.length)) n.delete(k)
          else n.set(k, Array.isArray(v) ? v.join(',') : String(v))
        }
        return n
      },
      { replace: true },
    )

  const toggle = (key, value) => {
    const cur = f[key]
    update({ [key]: cur.includes(value) ? cur.filter((x) => x !== value) : [...cur, value] })
  }

  const clearAll = () => setSp(f.q ? { q: f.q } : {}, { replace: true })

  const filtered = useMemo(() => {
    const q = f.q.trim().toLowerCase()
    let list = products.filter((p) => {
      if (q) {
        const cat = categoryBySlug[p.category]
        const hay = [p.title, p.title_hi, p.description, p.description_hi, productCode(p.id), cat?.name_en, cat?.name_hi]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()
        if (!hay.includes(q)) return false
      }
      if (f.category.length && !f.category.includes(p.category)) return false
      if (f.metal.length && !f.metal.includes(p.metal)) return false
      if (f.purity.length && !f.purity.includes(p.purity)) return false
      if (f.occasion.length && !p.occasions.some((o) => f.occasion.includes(o))) return false
      if (f.stock && !p.in_stock) return false
      if (f.priceActive) {
        if (p.price_on_request || p.price == null) return false
        if (f.min != null && p.price < f.min) return false
        if (f.max != null && p.price > f.max) return false
      }
      return true
    })
    const priceOf = (p) => (p.price_on_request || p.price == null ? null : p.price)
    if (f.sort === 'low' || f.sort === 'high') {
      const dir = f.sort === 'low' ? 1 : -1
      list = [...list].sort((a, b) => {
        const pa = priceOf(a)
        const pb = priceOf(b)
        if (pa == null && pb == null) return 0
        if (pa == null) return 1
        if (pb == null) return -1
        return (pa - pb) * dir
      })
    }
    return list
  }, [products, categoryBySlug, f])

  useEffect(() => setShown(PAGE), [sp])

  useEffect(() => {
    document.body.style.overflow = drawer ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [drawer])

  const categoryOptions = categories.map((c) => ({
    value: c.slug,
    label: pick(c, 'name'),
    count: products.filter((p) => p.category === c.slug).length,
  }))

  const activeCount = LIST_KEYS.reduce((n, k) => n + f[k].length, 0) + (f.stock ? 1 : 0) + (f.priceActive ? 1 : 0)
  const singleCat = f.category.length === 1 ? categoryBySlug[f.category[0]] : null
  const heading = singleCat ? pick(singleCat, 'name') : t('collection.title')

  useSeo({
    title: singleCat ? `${singleCat.name_en} – Gold & Silver Jewellery` : 'Jewellery Collection – Gold, Silver, Bridal & Fancy',
    description: singleCat
      ? `Explore ${singleCat.name_en} designs at Sundari Jewellers, Mahadev Chowk, Tajpur Road, Samastipur. Enquire on WhatsApp.`
      : undefined,
  })

  // Active filter chips (removable)
  const chips = [
    ...f.category.map((v) => ({ key: 'category', v, label: categoryBySlug[v] ? pick(categoryBySlug[v], 'name') : v })),
    ...f.metal.map((v) => ({ key: 'metal', v, label: METALS.find((m) => m.value === v)?.[lang] || v })),
    ...f.purity.map((v) => ({ key: 'purity', v, label: PURITIES.find((m) => m.value === v)?.[lang] || v })),
    ...f.occasion.map((v) => ({ key: 'occasion', v, label: OCCASIONS.find((m) => m.value === v)?.[lang] || v })),
  ]

  const panel = (
    <FilterPanel f={f} toggle={toggle} update={update} categoryOptions={categoryOptions} priceMax={priceMax} priceStep={priceStep} />
  )

  return (
    <div className="pb-16">
      <div className="border-b border-gold/20 bg-ivory/60">
        <div className="container-x py-8 sm:py-10">
          <p className="eyebrow">{SHOP_EYEBROW[lang]}</p>
          <h1 className="mt-1 font-display text-3xl font-semibold text-maroon sm:text-4xl">{heading}</h1>
          <p className="mt-2 max-w-2xl text-[0.95rem] text-ink-soft">{t('collection.subtitle')}</p>
        </div>
      </div>

      <div className="container-x lg:grid lg:grid-cols-[17rem_minmax(0,1fr)] lg:gap-8 lg:pt-8">
        {/* Desktop sidebar */}
        <aside className="hidden lg:block">
          <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto rounded-2xl border border-gold/25 bg-white p-5 shadow-soft">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold text-maroon">{t('collection.filters')}</h2>
              {activeCount > 0 && (
                <button type="button" onClick={clearAll} className="text-sm text-maroon underline decoration-gold underline-offset-4">
                  {t('collection.clearAll')}
                </button>
              )}
            </div>
            {panel}
          </div>
        </aside>

        <div>
          {/* Toolbar */}
          <div className="sticky top-16 z-20 -mx-4 border-b border-gold/20 bg-cream/95 px-4 py-3 backdrop-blur-md sm:-mx-6 sm:px-6 lg:static lg:mx-0 lg:border-0 lg:bg-transparent lg:p-0 lg:backdrop-blur-none">
            <div className="flex gap-2">
              <label className="relative min-w-0 flex-1">
                <span className="sr-only">{t('collection.search')}</span>
                <Icon name="search" className="pointer-events-none absolute left-3.5 top-1/2 size-5 -translate-y-1/2 text-gold-dark" />
                <input
                  type="search"
                  value={f.q}
                  onChange={(e) => update({ q: e.target.value })}
                  placeholder={t('collection.search')}
                  className="field rounded-full pl-11"
                />
              </label>
              <button
                type="button"
                onClick={() => setDrawer(true)}
                className="relative flex shrink-0 items-center gap-2 rounded-full border border-gold/60 bg-white px-4 text-maroon lg:hidden"
              >
                <Icon name="sliders" className="size-4" />
                <span className="text-sm font-medium">{t('collection.filters')}</span>
                {activeCount > 0 && (
                  <span className="absolute -right-1 -top-1 grid size-5 place-items-center rounded-full bg-maroon text-[0.7rem] text-white">
                    {activeCount}
                  </span>
                )}
              </button>
            </div>
            <div className="mt-3 flex items-center justify-between gap-3">
              <p className="text-sm text-ink-soft" aria-live="polite">
                {t('collection.results', { n: filtered.length })}
              </p>
              <label className="flex items-center gap-2 text-sm">
                <span className="text-ink-soft">{t('collection.sort')}:</span>
                <select
                  value={f.sort}
                  onChange={(e) => update({ sort: e.target.value === 'new' ? null : e.target.value })}
                  className="rounded-full border border-gold/50 bg-white py-1.5 pl-3 pr-8 text-sm text-ink"
                >
                  <option value="new">{t('collection.newest')}</option>
                  <option value="low">{t('collection.priceLow')}</option>
                  <option value="high">{t('collection.priceHigh')}</option>
                </select>
              </label>
            </div>
          </div>

          {(chips.length > 0 || f.stock || f.priceActive) && (
            <div className="mt-4 flex flex-wrap gap-2">
              {chips.map((c) => (
                <button key={`${c.key}-${c.v}`} type="button" onClick={() => toggle(c.key, c.v)} className="chip is-on">
                  {c.label}
                  <Icon name="x" className="size-3.5" />
                </button>
              ))}
              {f.stock && (
                <button type="button" onClick={() => update({ stock: null })} className="chip is-on">
                  {t('collection.inStockOnly')}
                  <Icon name="x" className="size-3.5" />
                </button>
              )}
              {f.priceActive && (
                <button type="button" onClick={() => update({ min: null, max: null })} className="chip is-on">
                  {t('collection.price')}
                  <Icon name="x" className="size-3.5" />
                </button>
              )}
              <button type="button" onClick={clearAll} className="px-2 text-sm text-maroon underline decoration-gold underline-offset-4">
                {t('collection.clearAll')}
              </button>
            </div>
          )}

          <div className="mt-5 grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 xl:grid-cols-4">
            {status === 'loading' && !products.length
              ? Array.from({ length: 8 }, (_, i) => <ProductCardSkeleton key={i} />)
              : filtered.slice(0, shown).map((p) => <ProductCard key={p.id} product={p} />)}
          </div>

          {failed.includes('products') && products.length === 0 && (
            <div className="mt-6">
              <LoadError title={t('common.productsFailed')} />
            </div>
          )}

          {status !== 'loading' && filtered.length === 0 && !(failed.includes('products') && products.length === 0) && (
            <div className="mt-6">
              <EmptyState title={t('collection.noResults')} hint={t('collection.noResultsHint')}>
                <div className="mt-5 flex flex-wrap justify-center gap-2">
                  {activeCount > 0 && (
                    <button type="button" onClick={clearAll} className="btn btn-outline">
                      {t('collection.clearAll')}
                    </button>
                  )}
                  <a href={waLink(`Namaste, mujhe ${heading} dekhna hai.`)} target="_blank" rel="noopener" className="btn btn-wa">
                    <WhatsAppIcon className="size-4" /> WhatsApp
                  </a>
                </div>
              </EmptyState>
            </div>
          )}

          {filtered.length > shown && (
            <div className="mt-8 text-center">
              <button type="button" onClick={() => setShown((s) => s + PAGE)} className="btn btn-outline px-8">
                <Icon name="chevronDown" className="size-4" />
                {t('collection.more')} ({filtered.length - shown})
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile filter drawer (slide-up sheet) */}
      {drawer && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label={t('collection.filters')}>
          <button type="button" className="absolute inset-0 animate-fade-in bg-ink/50" onClick={() => setDrawer(false)} aria-label="Close" />
          <div className="absolute inset-x-0 bottom-0 flex max-h-[88svh] animate-sheet-up flex-col rounded-t-3xl bg-cream shadow-2xl">
            <div className="mx-auto mt-2.5 h-1.5 w-12 rounded-full bg-gold/40" />
            <div className="flex items-center justify-between px-5 pb-3 pt-2">
              <h2 className="font-display text-xl font-semibold text-maroon">{t('collection.filters')}</h2>
              <div className="flex items-center gap-1">
                {activeCount > 0 && (
                  <button type="button" onClick={clearAll} className="px-2 text-sm text-maroon underline decoration-gold underline-offset-4">
                    {t('collection.clearAll')}
                  </button>
                )}
                <button type="button" onClick={() => setDrawer(false)} className="grid size-10 place-items-center rounded-full hover:bg-gold-pale" aria-label="Close">
                  <Icon name="x" className="size-5" />
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto overscroll-contain border-y border-gold/20 px-5 py-5">{panel}</div>
            <div className="p-4" style={{ paddingBottom: 'calc(1rem + env(safe-area-inset-bottom))' }}>
              <button type="button" onClick={() => setDrawer(false)} className="btn btn-maroon w-full py-3.5 text-base">
                {t('collection.apply', { n: filtered.length })}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const SHOP_EYEBROW = { en: 'Sundari Jewellers', hi: 'सुन्दरी ज्वेलर्स' }
