// Picks the Supabase backend when keys are configured, otherwise the in-browser demo.
import { isDemo } from '../lib/api'

let implPromise
const impl = () => (implPromise ??= isDemo ? import('./backends/local.js') : import('./backends/supabase.js'))

// adminApi.saveProduct(...) etc. — every call is async.
export const adminApi = new Proxy(
  {},
  {
    get: (_, name) =>
      async (...args) => {
        const mod = await impl()
        if (typeof mod[name] !== 'function') throw new Error(`adminApi.${String(name)} is not available`)
        return mod[name](...args)
      },
  },
)

/** Compresses (already done by caller) and uploads both sizes of an image. */
export async function uploadVariants(compressed, folder) {
  const full = await adminApi.uploadImage(compressed.full.blob, folder, compressed.full.ext)
  const thumb = await adminApi.uploadImage(compressed.thumb.blob, `${folder}/thumbs`, compressed.thumb.ext)
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
