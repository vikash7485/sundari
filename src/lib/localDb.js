// Local browser storage database.
import { SEED_CATEGORIES, DEFAULT_SETTINGS, buildSampleProducts, SAMPLE_GALLERY } from '../data/seed'

const KEY = 'sj-demo-db-v1'
let cache = null

function seed() {
  return {
    categories: SEED_CATEGORIES,
    products: buildSampleProducts(),
    settings: structuredClone(DEFAULT_SETTINGS),
    gallery: SAMPLE_GALLERY,
    nextId: 1013,
    nextGalleryId: SAMPLE_GALLERY.length + 1,
  }
}

export function readDb() {
  if (cache) return cache
  try {
    const raw = localStorage.getItem(KEY)
    cache = raw ? JSON.parse(raw) : seed()
  } catch {
    cache = seed()
  }
  return cache
}

export function writeDb(next) {
  try {
    localStorage.setItem(KEY, JSON.stringify(next))
  } catch {
    throw new Error('Browser storage is full.')
  }
  cache = next
  return next
}

export function resetDb() {
  try {
    localStorage.removeItem(KEY)
  } catch {
    /* ignore */
  }
  cache = null
}
