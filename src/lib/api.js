// Public (read-only) data access for the visitor site.
// Uses Supabase's REST API directly so the visitor bundle stays small;
// the full supabase-js client is only loaded inside /admin.
import { DEFAULT_SETTINGS } from '../data/seed'
import { readDb } from './localDb'

const SUPABASE_URL = (import.meta.env.VITE_SUPABASE_URL || '').replace(/\/$/, '')
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

export const isDemo = !(SUPABASE_URL && SUPABASE_KEY)
export const supabaseEnv = { url: SUPABASE_URL, key: SUPABASE_KEY }

// Give up after 15 s so a hanging connection shows the "try again" message instead of loading forever.
const timeout = () => (typeof AbortSignal.timeout === 'function' ? AbortSignal.timeout(15000) : undefined)

async function rest(path) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, { headers: { apikey: SUPABASE_KEY }, signal: timeout() })
  if (!res.ok) throw new Error(`Could not load ${path.split('?')[0]} (${res.status})`)
  return res.json()
}

const toNum = (v) => (v == null || v === '' ? null : Number(v))

export function normalizeProduct(p) {
  return {
    ...p,
    id: Number(p.id),
    weight: toNum(p.weight),
    price: toNum(p.price),
    occasions: p.occasions || [],
    images: Array.isArray(p.images) ? p.images : [],
    in_stock: p.in_stock !== false,
  }
}

export function mergeSettings(rowsOrObject) {
  const obj = Array.isArray(rowsOrObject)
    ? Object.fromEntries(rowsOrObject.map((r) => [r.key, r.value]))
    : rowsOrObject || {}
  return {
    rates: { ...DEFAULT_SETTINGS.rates, ...obj.rates },
    timings: { ...DEFAULT_SETTINGS.timings, ...obj.timings },
    why: Array.isArray(obj.why) && obj.why.length ? obj.why : DEFAULT_SETTINGS.why,
    site: { ...DEFAULT_SETTINGS.site, ...obj.site },
  }
}

export const DATA_PARTS = ['categories', 'products', 'settings', 'gallery']

const QUERIES = {
  categories: ['categories?select=*&order=sort.asc,name_en.asc', (rows) => rows],
  products: ['products?select=*&order=created_at.desc', (rows) => rows.map(normalizeProduct)],
  settings: ['settings?select=key,value', mergeSettings],
  gallery: ['gallery?select=*&order=created_at.desc', (rows) => rows],
}

/**
 * Loads each part on its own, so one failing table doesn't blank the whole site.
 * Parts that could not be loaded are missing from the result and listed in `failed`.
 */
export async function loadAll() {
  if (isDemo) {
    const db = readDb()
    return {
      categories: [...db.categories].sort((a, b) => (a.sort ?? 999) - (b.sort ?? 999)),
      products: db.products.map(normalizeProduct).sort((a, b) => b.created_at.localeCompare(a.created_at)),
      settings: mergeSettings(db.settings),
      gallery: [...db.gallery].sort((a, b) => b.created_at.localeCompare(a.created_at)),
      failed: [],
    }
  }
  const results = await Promise.allSettled(DATA_PARTS.map((k) => rest(QUERIES[k][0])))
  const out = { failed: [] }
  results.forEach((r, i) => {
    const k = DATA_PARTS[i]
    if (r.status === 'fulfilled') out[k] = QUERIES[k][1](r.value)
    else {
      console.error(r.reason)
      out.failed.push(k)
    }
  })
  return out
}
