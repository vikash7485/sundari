import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { AdminPage, Field, Panel, SaveButton, Spinner, Toggle, useToast } from './ui'
import ImageUploader, { existingItem } from './ImageUploader'
import { adminApi, uploadVariants } from './adminApi'
import Icon from '../components/Icon'
import { useData } from '../data/DataContext'
import { METALS, OCCASIONS, PURITIES, productCode } from '../config'
import { formatPrice, slugify } from '../lib/format'

const EMPTY = {
  title: '',
  title_hi: '',
  description: '',
  description_hi: '',
  category: '',
  metal: 'gold',
  purity: '22K',
  weight: '',
  price: '',
  price_on_request: false,
  occasions: [],
  in_stock: true,
  featured: false,
  is_sample: false,
}

const toForm = (p) => ({
  ...EMPTY,
  ...Object.fromEntries(Object.keys(EMPTY).map((k) => [k, p[k] ?? EMPTY[k]])),
  weight: p.weight ?? '',
  price: p.price ?? '',
})

function Chips({ options, value, onChange, multi = false }) {
  const isOn = (v) => (multi ? value.includes(v) : value === v)
  const click = (v) => {
    if (!multi) return onChange(v)
    onChange(value.includes(v) ? value.filter((x) => x !== v) : [...value, v])
  }
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => (
        <button key={o.value} type="button" aria-pressed={isOn(o.value)} onClick={() => click(o.value)} className="chip">
          {isOn(o.value) && <Icon name="check" className="size-3.5" strokeWidth={2.4} />}
          {o.label}
        </button>
      ))}
    </div>
  )
}

export default function ProductForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const toast = useToast()
  const { products, categories, refresh, status } = useData()
  const existing = id ? products.find((p) => String(p.id) === id) : null

  const [f, setF] = useState(() => (existing ? toForm(existing) : EMPTY))
  const [images, setImages] = useState(() => (existing ? existing.images.map(existingItem) : []))
  const [busy, setBusy] = useState('')
  const [newCat, setNewCat] = useState(null)
  const loaded = useRef(!!existing || !id)

  // Opened via direct link before data finished loading
  useEffect(() => {
    if (!loaded.current && existing) {
      loaded.current = true
      setF(toForm(existing))
      setImages(existing.images.map(existingItem))
    }
  }, [existing])

  const set = (k, v) => setF((s) => ({ ...s, [k]: v }))

  const setMetal = (metal) =>
    setF((s) => ({
      ...s,
      metal,
      purity: metal === 'silver' ? '92.5' : metal === 'fancy' ? '' : s.purity === '92.5' || !s.purity ? (metal === 'diamond' ? '18K' : '22K') : s.purity,
    }))

  if (id && !existing) {
    return (
      <AdminPage title="Product">
        {status === 'loading' ? <Spinner className="size-6 text-maroon" /> : <p>Product not found. <Link className="text-maroon underline" to="/admin/products">Back to products</Link></p>}
      </AdminPage>
    )
  }

  const addCategory = async () => {
    const name = newCat.name_en.trim()
    if (!name) return toast('Enter the category name', 'error')
    let base = slugify(name) || `category-${Date.now().toString(36)}`
    let slug = base
    for (let n = 2; categories.some((c) => c.slug === slug); n++) slug = `${base}-${n}`
    setBusy('Adding category…')
    try {
      await adminApi.saveCategory(
        { slug, name_en: name, name_hi: newCat.name_hi.trim() || null, sort: Math.max(0, ...categories.map((c) => c.sort || 0)) + 1 },
        true,
      )
      await refresh()
      set('category', slug)
      setNewCat(null)
      toast(`Category “${name}” added`)
    } catch (e) {
      toast(e.message, 'error')
    } finally {
      setBusy('')
    }
  }

  const save = async (e) => {
    e.preventDefault()
    if (!f.title.trim()) return toast('Please enter the product title', 'error')
    try {
      const finalImages = []
      const total = images.filter((i) => i.kind === 'new').length
      let n = 0
      for (const im of images) {
        if (im.kind === 'existing') finalImages.push(im.data)
        else {
          n++
          setBusy(`Uploading photo ${n} of ${total}…`)
          finalImages.push(await uploadVariants(im.compressed, 'products'))
        }
      }
      setBusy('Saving…')
      const noPrice = f.price === '' || f.price == null
      const payload = {
        ...(existing ? { id: existing.id } : {}),
        title: f.title.trim(),
        title_hi: f.title_hi.trim() || null,
        description: f.description.trim() || null,
        description_hi: f.description_hi.trim() || null,
        category: f.category || null,
        metal: f.metal || null,
        purity: f.purity || null,
        weight: f.weight === '' ? null : Number(f.weight),
        price: f.price_on_request || noPrice ? null : Number(f.price),
        price_on_request: f.price_on_request || noPrice,
        occasions: f.occasions,
        in_stock: f.in_stock,
        featured: f.featured,
        images: finalImages,
        is_sample: existing ? f.is_sample : false,
      }
      const saved = await adminApi.saveProduct(payload)
      if (existing) {
        const keep = new Set(finalImages.flatMap((im) => [im.path, im.thumb_path]).filter(Boolean))
        const gone = existing.images.flatMap((im) => [im.path, im.thumb_path]).filter((p) => p && !keep.has(p))
        if (gone.length) await adminApi.removeFiles(gone)
      }
      await refresh()
      toast(existing ? 'Product updated' : `Product added – code ${productCode(saved.id)}`)
      navigate('/admin/products')
    } catch (err) {
      toast(err.message || 'Could not save', 'error')
    } finally {
      setBusy('')
    }
  }

  const remove = async () => {
    if (!confirm(`Delete “${existing.title}” (${productCode(existing.id)})? This cannot be undone.`)) return
    setBusy('Deleting…')
    try {
      await adminApi.deleteProduct(existing)
      await refresh()
      toast('Product deleted')
      navigate('/admin/products')
    } catch (err) {
      toast(err.message, 'error')
      setBusy('')
    }
  }

  return (
    <AdminPage
      title={existing ? 'Edit product' : 'Add product'}
      subtitle={existing ? `${productCode(existing.id)} · ${existing.title}` : 'Fill in the details – only the title is required.'}
      actions={
        existing && (
          <a href={`/product/${existing.id}`} target="_blank" rel="noopener" className="btn btn-outline bg-white px-4 py-2 text-sm">
            <Icon name="eye" className="size-4" /> View on website
          </a>
        )
      }
    >
      <form onSubmit={save} className="space-y-5">
        <Panel title="Photos" description="Up to 5 photos. Clear photos on a plain background look best.">
          <ImageUploader items={images} setItems={setImages} />
        </Panel>

        <Panel title="Details">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Title (English) *" htmlFor="title" className="sm:col-span-2">
              <input id="title" className="field" required value={f.title} onChange={(e) => set('title', e.target.value)} placeholder="e.g. Gold Jhumka Earrings" />
            </Field>
            <Field label="Title in Hindi (optional)" htmlFor="title_hi" hint="Shown when visitors choose हिंदी." className="sm:col-span-2">
              <input id="title_hi" className="field" value={f.title_hi} onChange={(e) => set('title_hi', e.target.value)} placeholder="जैसे: सोने के झुमके" />
            </Field>
            <Field label="Description" htmlFor="desc" className="sm:col-span-2">
              <textarea id="desc" className="field min-h-24" value={f.description} onChange={(e) => set('description', e.target.value)} />
            </Field>
            <Field label="Description in Hindi (optional)" htmlFor="desc_hi" className="sm:col-span-2">
              <textarea id="desc_hi" className="field min-h-20" value={f.description_hi} onChange={(e) => set('description_hi', e.target.value)} />
            </Field>

            <Field label="Category" htmlFor="cat" className="sm:col-span-2">
              <select
                id="cat"
                className="field"
                value={newCat ? '__new' : f.category}
                onChange={(e) => {
                  if (e.target.value === '__new') setNewCat({ name_en: '', name_hi: '' })
                  else {
                    setNewCat(null)
                    set('category', e.target.value)
                  }
                }}
              >
                <option value="">— Choose category —</option>
                {categories.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.name_en}
                    {c.name_hi ? ` · ${c.name_hi}` : ''}
                  </option>
                ))}
                <option value="__new">+ Add new category…</option>
              </select>
              {newCat && (
                <div className="mt-2.5 grid grid-cols-1 gap-2 rounded-xl border border-gold/40 bg-ivory/60 p-3 sm:grid-cols-[1fr_1fr_auto]">
                  <input
                    className="field"
                    placeholder="Name (English)"
                    value={newCat.name_en}
                    autoFocus
                    onChange={(e) => setNewCat((c) => ({ ...c, name_en: e.target.value }))}
                  />
                  <input
                    className="field"
                    placeholder="नाम (हिंदी)"
                    value={newCat.name_hi}
                    onChange={(e) => setNewCat((c) => ({ ...c, name_hi: e.target.value }))}
                  />
                  <div className="flex gap-2">
                    <button type="button" onClick={addCategory} className="btn btn-maroon flex-1">
                      Add
                    </button>
                    <button type="button" onClick={() => setNewCat(null)} className="btn btn-outline bg-white">
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </Field>

            <Field label="Metal" className="sm:col-span-2">
              <Chips options={METALS.map((m) => ({ value: m.value, label: m.en }))} value={f.metal} onChange={setMetal} />
            </Field>
            <Field label="Purity" className="sm:col-span-2">
              <Chips
                options={[...PURITIES.map((p) => ({ value: p.value, label: p.en })), { value: '', label: 'None' }]}
                value={f.purity || ''}
                onChange={(v) => set('purity', v)}
              />
            </Field>

            <Field label="Weight (grams)" htmlFor="weight">
              <input
                id="weight"
                type="number"
                inputMode="decimal"
                step="0.001"
                min="0"
                className="field"
                value={f.weight}
                onChange={(e) => set('weight', e.target.value)}
                placeholder="e.g. 7.85"
              />
            </Field>
            <Field
              label="Price (₹)"
              htmlFor="price"
              hint={!f.price_on_request && f.price !== '' ? `Shows as ${formatPrice(f.price)}` : 'Leave empty to show “Price on request”.'}
            >
              <input
                id="price"
                type="number"
                inputMode="numeric"
                step="1"
                min="0"
                className="field disabled:bg-ivory disabled:text-ink-soft"
                disabled={f.price_on_request}
                value={f.price}
                onChange={(e) => set('price', e.target.value)}
                placeholder="e.g. 125000"
              />
            </Field>
            <div className="sm:col-span-2">
              <Toggle
                label="Price on request"
                hint="Hide the price and show “Price on request” instead."
                checked={f.price_on_request}
                onChange={(v) => set('price_on_request', v)}
              />
            </div>

            <Field label="Occasion" className="sm:col-span-2">
              <Chips multi options={OCCASIONS.map((o) => ({ value: o.value, label: o.en }))} value={f.occasions} onChange={(v) => set('occasions', v)} />
            </Field>
          </div>
        </Panel>

        <Panel title="Visibility">
          <div className="space-y-4">
            <Toggle label="In stock" hint="Turn off when sold out – the product stays visible with an “Out of stock” label." checked={f.in_stock} onChange={(v) => set('in_stock', v)} />
            <Toggle label="Featured" hint="Show in the “Featured” tab on the home page." checked={f.featured} onChange={(v) => set('featured', v)} />
            {existing?.is_sample && (
              <Toggle label="Sample product" hint="Turn off to remove the SAMPLE label." checked={f.is_sample} onChange={(v) => set('is_sample', v)} />
            )}
          </div>
        </Panel>

        <div
          className="sticky bottom-[calc(4.75rem+env(safe-area-inset-bottom))] z-20 flex items-center gap-3 rounded-2xl border border-gold/30 bg-white/95 p-3 shadow-lift backdrop-blur lg:bottom-4"
        >
          {existing && (
            <button type="button" onClick={remove} disabled={!!busy} className="btn border border-red-200 px-4 text-red-700 hover:bg-red-50">
              <Icon name="trash" className="size-4" />
              <span className="hidden sm:inline">Delete</span>
            </button>
          )}
          <p className="min-w-0 flex-1 truncate text-sm text-ink-soft">{busy}</p>
          <Link to="/admin/products" className="btn btn-outline hidden bg-white sm:inline-flex">
            Cancel
          </Link>
          <SaveButton busy={!!busy}>{existing ? 'Save changes' : 'Add product'}</SaveButton>
        </div>
      </form>
    </AdminPage>
  )
}
