// DEMO MODE admin backend: same functions as supabase.js, stored in this browser only.
import { readDb, writeDb, resetDb } from '../../lib/localDb'

const SESSION_KEY = 'sj-demo-admin'
const DEMO_PASSWORD = import.meta.env.VITE_DEMO_ADMIN_PASSWORD || 'sundari-demo'
const listeners = new Set()

const demoUser = { email: 'demo@localhost', demo: true }

export async function getUser() {
  try {
    return sessionStorage.getItem(SESSION_KEY) ? demoUser : null
  } catch {
    return null
  }
}

export function onAuthChange(cb) {
  listeners.add(cb)
  return () => listeners.delete(cb)
}

export async function signIn(_email, password) {
  if (password !== DEMO_PASSWORD) throw new Error('Wrong password')
  try {
    sessionStorage.setItem(SESSION_KEY, '1')
  } catch {
    /* ignore */
  }
  listeners.forEach((cb) => cb(demoUser))
  return demoUser
}

export async function signOut() {
  try {
    sessionStorage.removeItem(SESSION_KEY)
  } catch {
    /* ignore */
  }
  listeners.forEach((cb) => cb(null))
}

// ---------- Storage (images become data URLs) ----------
const toDataUrl = (blob) =>
  new Promise((resolve, reject) => {
    const r = new FileReader()
    r.onload = () => resolve(r.result)
    r.onerror = reject
    r.readAsDataURL(blob)
  })

export async function uploadImage(blob) {
  return { url: await toDataUrl(blob), path: null }
}

export async function removeFiles() {}

export async function removeByUrl() {}

const update = (fn) => writeDb(fn(structuredClone(readDb())))

// ---------- Products ----------
export async function saveProduct(p) {
  let saved
  update((db) => {
    if (p.id) {
      db.products = db.products.map((x) => (x.id === p.id ? (saved = { ...x, ...p, updated_at: new Date().toISOString() }) : x))
    } else {
      saved = { ...p, id: db.nextId++, created_at: new Date().toISOString() }
      db.products.unshift(saved)
    }
    return db
  })
  return saved
}

export async function updateProductFields(id, patch) {
  return saveProduct({ id, ...patch })
}

export async function deleteProduct(p) {
  update((db) => ({ ...db, products: db.products.filter((x) => x.id !== p.id) }))
}

export async function deleteSampleProducts() {
  update((db) => ({ ...db, products: db.products.filter((x) => !x.is_sample) }))
}

// ---------- Categories ----------
export async function saveCategory(cat, isNew) {
  update((db) => {
    if (isNew) {
      if (db.categories.some((c) => c.slug === cat.slug)) throw new Error('A category with this name already exists')
      db.categories.push(cat)
    } else db.categories = db.categories.map((c) => (c.slug === cat.slug ? { ...c, ...cat } : c))
    return db
  })
  return cat
}

export async function deleteCategory(cat) {
  update((db) => ({
    ...db,
    categories: db.categories.filter((c) => c.slug !== cat.slug),
    products: db.products.map((p) => (p.category === cat.slug ? { ...p, category: null } : p)),
  }))
}

// ---------- Settings ----------
export async function saveSetting(key, value) {
  update((db) => ({ ...db, settings: { ...db.settings, [key]: value } }))
}

// ---------- Gallery ----------
export async function addGalleryItem(item) {
  let saved
  update((db) => {
    saved = { ...item, id: db.nextGalleryId++, created_at: new Date().toISOString() }
    db.gallery.unshift(saved)
    return db
  })
  return saved
}

export async function updateGalleryItem(id, patch) {
  update((db) => ({ ...db, gallery: db.gallery.map((g) => (g.id === id ? { ...g, ...patch } : g)) }))
}

export async function deleteGalleryItem(item) {
  update((db) => ({ ...db, gallery: db.gallery.filter((g) => g.id !== item.id) }))
}

export async function deleteSampleGallery() {
  update((db) => ({ ...db, gallery: db.gallery.filter((g) => !g.is_sample) }))
}

// ---------- Backup ----------
export async function exportBackup() {
  const { categories, products, gallery, settings } = readDb()
  return structuredClone({ categories, products, gallery, settings })
}

export async function resetDemo() {
  resetDb()
}
