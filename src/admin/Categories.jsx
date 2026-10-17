import { useState } from 'react'
import { AdminPage, Panel, Spinner, useToast } from './ui'
import { adminApi } from './adminApi'
import Icon from '../components/Icon'
import CategoryIcon from '../components/CategoryIcon'
import SafeImg from '../components/SafeImg'
import { useData } from '../data/DataContext'
import { compressImage } from '../lib/image'
import { slugify } from '../lib/format'

function CategoryRow({ cat, count, index, total, onMove, busy, setBusy }) {
  const { refresh } = useData()
  const toast = useToast()
  const [name, setName] = useState({ en: cat.name_en, hi: cat.name_hi || '' })
  const dirty = name.en !== cat.name_en || name.hi !== (cat.name_hi || '')

  const run = async (label, fn, done) => {
    setBusy(cat.slug)
    try {
      await fn()
      await refresh()
      if (done) toast(done)
    } catch (e) {
      toast(e.message, 'error')
    } finally {
      setBusy(null)
    }
  }

  const save = () => {
    if (!name.en.trim()) return toast('English name is required', 'error')
    run('save', () => adminApi.saveCategory({ ...cat, name_en: name.en.trim(), name_hi: name.hi.trim() || null }, false), 'Category renamed')
  }

  const remove = () => {
    const msg = count
      ? `Delete “${cat.name_en}”? Its ${count} product(s) will stay on the website without a category.`
      : `Delete “${cat.name_en}”?`
    if (confirm(msg)) run('delete', () => adminApi.deleteCategory(cat), 'Category deleted')
  }

  // The old photo file is removed only after the category points to the new one.
  const setImage = (file) =>
    run(
      'image',
      async () => {
        const c = await compressImage(file, { full: 400, thumb: 200 })
        const up = await adminApi.uploadImage(c.full.blob, 'categories', c.full.ext)
        await adminApi.saveCategory({ ...cat, image: up.url }, false)
        if (cat.image) await adminApi.removeByUrl([cat.image])
      },
      'Category photo updated',
    )

  const removeImage = () =>
    run(
      'img',
      async () => {
        await adminApi.saveCategory({ ...cat, image: null }, false)
        await adminApi.removeByUrl([cat.image])
      },
      'Photo removed',
    )

  const isBusy = busy === cat.slug

  return (
    <li className="grid grid-cols-[auto_minmax(0,1fr)] gap-3 p-3 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:items-center sm:p-4">
      <label className="group relative grid size-16 cursor-pointer place-items-center overflow-hidden rounded-full bg-gold-pale text-gold-dark ring-1 ring-gold/50" title="Change photo">
        <SafeImg src={cat.image} className="size-full object-cover" fallback={<CategoryIcon slug={cat.slug} className="size-8" />} />
        <span className="absolute inset-0 grid place-items-center bg-black/45 text-white opacity-0 transition group-hover:opacity-100">
          <Icon name="upload" className="size-5" />
        </span>
        <input type="file" accept="image/*" className="sr-only" onChange={(e) => e.target.files?.[0] && setImage(e.target.files[0])} />
      </label>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <input className="field py-2" value={name.en} onChange={(e) => setName((n) => ({ ...n, en: e.target.value }))} aria-label="Name (English)" />
        <input className="field py-2" value={name.hi} placeholder="हिंदी नाम" onChange={(e) => setName((n) => ({ ...n, hi: e.target.value }))} aria-label="Name (Hindi)" />
        <p className="text-xs text-ink-soft sm:col-span-2">
          {count} product{count === 1 ? '' : 's'}
          {cat.image && (
            <>
              {' · '}
              <button type="button" className="text-maroon underline" onClick={removeImage}>
                remove photo (use icon)
              </button>
            </>
          )}
        </p>
      </div>
      <div className="col-span-2 flex items-center justify-end gap-1 sm:col-span-1">
        {isBusy && <Spinner className="size-4 text-maroon" />}
        {dirty && (
          <button type="button" onClick={save} disabled={isBusy} className="btn btn-maroon px-4 py-2 text-sm">
            Save
          </button>
        )}
        <button type="button" onClick={() => onMove(index, -1)} disabled={index === 0 || !!busy} className="grid size-9 place-items-center rounded-full hover:bg-gold-pale disabled:opacity-30" aria-label="Move up">
          <Icon name="chevronLeft" className="size-4 rotate-90" />
        </button>
        <button type="button" onClick={() => onMove(index, 1)} disabled={index === total - 1 || !!busy} className="grid size-9 place-items-center rounded-full hover:bg-gold-pale disabled:opacity-30" aria-label="Move down">
          <Icon name="chevronRight" className="size-4 rotate-90" />
        </button>
        <button type="button" onClick={remove} disabled={isBusy} className="grid size-9 place-items-center rounded-full text-red-700 hover:bg-red-50" aria-label="Delete category">
          <Icon name="trash" className="size-4" />
        </button>
      </div>
    </li>
  )
}

export default function Categories() {
  const { categories, products, refresh } = useData()
  const toast = useToast()
  const [busy, setBusy] = useState(null)
  const [add, setAdd] = useState({ en: '', hi: '' })

  const create = async (e) => {
    e.preventDefault()
    const name = add.en.trim()
    if (!name) return
    const base = slugify(name) || `category-${Date.now().toString(36)}`
    let slug = base
    for (let n = 2; categories.some((c) => c.slug === slug); n++) slug = `${base}-${n}`
    setBusy('new')
    try {
      await adminApi.saveCategory({ slug, name_en: name, name_hi: add.hi.trim() || null, sort: Math.max(0, ...categories.map((c) => c.sort || 0)) + 1 }, true)
      await refresh()
      setAdd({ en: '', hi: '' })
      toast(`Category “${name}” added`)
    } catch (err) {
      toast(err.message, 'error')
    } finally {
      setBusy(null)
    }
  }

  const move = async (i, d) => {
    const order = [...categories]
    ;[order[i], order[i + d]] = [order[i + d], order[i]]
    setBusy('order')
    try {
      for (const [k, c] of order.entries()) {
        if (c.sort !== k + 1) await adminApi.saveCategory({ ...c, sort: k + 1 }, false)
      }
      await refresh()
    } catch (err) {
      toast(err.message, 'error')
    } finally {
      setBusy(null)
    }
  }

  return (
    <AdminPage title="Categories" subtitle="Rename, reorder or add categories. The order here is the order on the home page.">
      <Panel title="Add a category">
        <form onSubmit={create} className="grid grid-cols-1 gap-2 sm:grid-cols-[1fr_1fr_auto]">
          <input className="field" placeholder="Name in English, e.g. Toe Rings" value={add.en} onChange={(e) => setAdd((a) => ({ ...a, en: e.target.value }))} required />
          <input className="field" placeholder="हिंदी नाम, जैसे: बिछिया" value={add.hi} onChange={(e) => setAdd((a) => ({ ...a, hi: e.target.value }))} />
          <button type="submit" disabled={busy === 'new'} className="btn btn-maroon">
            <Icon name="plus" className="size-4" strokeWidth={2.4} /> Add
          </button>
        </form>
      </Panel>

      <ul className="divide-y divide-gold/15 overflow-hidden rounded-2xl border border-gold/25 bg-white shadow-soft">
        {categories.map((c, i) => (
          <CategoryRow
            key={`${c.slug}-${c.name_en}-${c.name_hi}`}
            cat={c}
            index={i}
            total={categories.length}
            count={products.filter((p) => p.category === c.slug).length}
            onMove={move}
            busy={busy}
            setBusy={setBusy}
          />
        ))}
      </ul>
      <p className="text-[0.78rem] text-ink-soft">Tip: tap the round icon to use your own photo for a category tile.</p>
    </AdminPage>
  )
}
