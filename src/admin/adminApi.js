// Local in-browser data access for the admin panel.
import * as localBackend from './backends/local.js'

export const isDemo = true

// Calls that only read or log in.
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
        if (typeof localBackend[name] !== 'function') throw new Error(`adminApi.${String(name)} is not available`)
        return localBackend[name](...args)
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
    await adminApi.removeFiles([full.path]).catch(() => {})
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
