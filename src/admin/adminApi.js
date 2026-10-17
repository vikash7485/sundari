// Picks the Supabase backend when keys are configured, otherwise the in-browser demo.
import { isDemo } from '../lib/api'

let implPromise
const impl = () => (implPromise ??= isDemo ? import('./backends/local.js') : import('./backends/supabase.js'))

// Calls that only read or log in. Every other call changes data and is refused while
// setWriteBlock() holds a message, so nothing is saved on top of an empty/old copy.
const READ_ONLY = new Set(['getUser', 'onAuthChange', 'signIn', 'signOut', 'exportBackup'])
let writeBlock = null
export const setWriteBlock = (message) => {
  writeBlock = message || null
}

// adminApi.saveProduct(...) etc. — every call is async.
export const adminApi = new Proxy(
  {},
  {
    get: (_, name) =>
      async (...args) => {
        if (writeBlock && !READ_ONLY.has(name)) throw new Error(writeBlock)
        const mod = await impl()
        if (typeof mod[name] !== 'function') throw new Error(`adminApi.${String(name)} is not available`)
        return mod[name](...args)
      },
  },
)

/** Compresses (already done by caller) and uploads both sizes of an image. */
export async function uploadVariants(compressed, folder) {
  const full = await adminApi.uploadImage(compressed.full.blob, folder, compressed.full.ext)
  let thumb
  try {
    thumb = await adminApi.uploadImage(compressed.thumb.blob, `${folder}/thumbs`, compressed.thumb.ext)
  } catch (e) {
    await adminApi.removeFiles([full.path]).catch(() => {}) // don't leave half a photo in storage
    throw e
  }
  return {
    full: full.url,
    thumb: thumb.url,
    path: full.path,
    thumb_path: thumb.path,
    width: compressed.full.width,
    height: compressed.full.height,
  }
}

export { isDemo }
