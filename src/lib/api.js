// Public (read-only) data access for the visitor site.
// Uses Supabase's REST API directly so the visitor bundle stays small;
// the full supabase-js client is only loaded inside /admin.
import { DEFAULT_SETTINGS } from '../data/seed'
import { readDb } from './localDb'

const SUPABASE_URL = (import.meta.env.VITE_SUPABASE_URL || '').replace(/\/$/, '')
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

export const isDemo = !(SUPABASE_URL && SUPABASE_KEY)
export const supabaseEnv = { url: SUPABASE_URL, key: SUPABASE_KEY }

async function rest(path) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, { headers: { apikey: SUPABASE_KEY } })
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

export async function loadAll() {
  if (isDemo) {
    const db = readDb()
    return {
      categories: [...db.categories].sort((a, b) => (a.sort ?? 999) - (b.sort ?? 999)),
      products: db.products.map(normalizeProduct).sort((a, b) => b.created_at.localeCompare(a.created_at)),
      settings: mergeSettings(db.settings),
      gallery: [...db.gallery].sort((a, b) => b.created_at.localeCompare(a.created_at)),
    }
  }
  const [categories, products, settings, gallery] = await Promise.all([
    rest('categories?select=*&order=sort.asc,name_en.asc'),
    rest('products?select=*&order=created_at.desc'),
    rest('settings?select=key,value'),
    rest('gallery?select=*&order=created_at.desc'),
  ])
  return {
    categories,
    products: products.map(normalizeProduct),
    settings: mergeSettings(settings),
    gallery,
  }
}
