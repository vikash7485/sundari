// Admin writes against Supabase (database + storage + auth).
import { createClient } from '@supabase/supabase-js'
import { supabaseEnv } from '../../lib/api'

const sb = createClient(supabaseEnv.url, supabaseEnv.key, {
  auth: { persistSession: true, autoRefreshToken: true, storageKey: 'sj-admin-auth' },
})
const BUCKET = 'media'

const must = ({ data, error }) => {
  if (error) throw new Error(error.message || String(error))
  return data
}

async function checkAdmin() {
  const ok = must(await sb.rpc('is_admin'))
  if (!ok) {
    await sb.auth.signOut()
    throw new Error('This email is not set up as an admin. Add it to the "admins" table in Supabase.')
  }
}

export async function getUser() {
  const { data } = await sb.auth.getSession()
  const user = data.session?.user ?? null
  if (!user) return null
  try {
    await checkAdmin()
    return user
  } catch {
    return null
  }
}

// Only sign-outs are pushed (e.g. expired session); sign-ins go through signIn(),
// which also checks the admin allow-list.
export function onAuthChange(cb) {
  const { data } = sb.auth.onAuthStateChange((event) => {
    if (event === 'SIGNED_OUT') cb(null)
  })
  return () => data.subscription.unsubscribe()
}

export async function signIn(email, password) {
  const { data, error } = await sb.auth.signInWithPassword({ email: email.trim(), password })
  if (error) throw new Error(error.message === 'Invalid login credentials' ? 'Wrong email or password' : error.message)
  await checkAdmin()
  return data.user
}

export async function signOut() {
  await sb.auth.signOut()
}

// ---------- Storage ----------
export async function uploadImage(blob, folder, ext) {
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
  must(await sb.storage.from(BUCKET).upload(path, blob, { contentType: blob.type, cacheControl: '31536000', upsert: false }))
  const { data } = sb.storage.from(BUCKET).getPublicUrl(path)
  return { url: data.publicUrl, path }
}

export async function removeFiles(paths) {
  const list = paths.filter(Boolean)
  if (!list.length) return
  const { error } = await sb.storage.from(BUCKET).remove(list)
  if (error) console.warn('Could not delete some files', error)
}

const imagePaths = (images = []) => images.flatMap((im) => [im.path, im.thumb_path])

// ---------- Products ----------
const PRODUCT_FIELDS = [
  'title', 'title_hi', 'description', 'description_hi', 'category', 'metal', 'purity', 'weight',
  'price', 'price_on_request', 'occasions', 'in_stock', 'featured', 'images', 'is_sample',
]
const pickFields = (obj, fields) => Object.fromEntries(fields.filter((f) => f in obj).map((f) => [f, obj[f]]))

export async function saveProduct(p) {
  const row = { ...pickFields(p, PRODUCT_FIELDS), updated_at: new Date().toISOString() }
  if (p.id) return must(await sb.from('products').update(row).eq('id', p.id).select().single())
  return must(await sb.from('products').insert(row).select().single())
}

export async function updateProductFields(id, patch) {
  return must(await sb.from('products').update({ ...patch, updated_at: new Date().toISOString() }).eq('id', id).select().single())
}

export async function deleteProduct(p) {
  must(await sb.from('products').delete().eq('id', p.id))
  await removeFiles(imagePaths(p.images))
}

export async function deleteSampleProducts() {
  must(await sb.from('products').delete().eq('is_sample', true))
}

// ---------- Categories ----------
export async function saveCategory(cat, isNew) {
  const row = { slug: cat.slug, name_en: cat.name_en, name_hi: cat.name_hi || null, image: cat.image || null, sort: cat.sort ?? 100 }
  if (isNew) return must(await sb.from('categories').insert(row).select().single())
  return must(await sb.from('categories').update(row).eq('slug', cat.slug).select().single())
}

export async function deleteCategory(slug) {
  must(await sb.from('categories').delete().eq('slug', slug))
}

// ---------- Settings ----------
export async function saveSetting(key, value) {
  must(await sb.from('settings').upsert({ key, value, updated_at: new Date().toISOString() }))
}

// ---------- Gallery ----------
export async function addGalleryItem(item) {
  return must(await sb.from('gallery').insert(item).select().single())
}

export async function updateGalleryItem(id, patch) {
  return must(await sb.from('gallery').update(patch).eq('id', id).select().single())
}

export async function deleteGalleryItem(item) {
  must(await sb.from('gallery').delete().eq('id', item.id))
  await removeFiles([item.path, item.thumb_path])
}

export async function deleteSampleGallery() {
  must(await sb.from('gallery').delete().eq('is_sample', true))
}

export const resetDemo = null
