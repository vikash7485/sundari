// Public (read-only) data access for the visitor site.
import { DEFAULT_SETTINGS } from '../data/seed'
import { readDb } from './localDb'

export const isDemo = true

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

/**
 * Loads all data parts from local storage / seed data.
 */
export async function loadAll() {
  const db = readDb()
  return {
    categories: [...db.categories].sort((a, b) => (a.sort ?? 999) - (b.sort ?? 999)),
    products: db.products.map(normalizeProduct).sort((a, b) => b.created_at.localeCompare(a.created_at)),
    settings: mergeSettings(db.settings),
    gallery: [...db.gallery].sort((a, b) => b.created_at.localeCompare(a.created_at)),
    failed: [],
  }
}
