// Client-side image compression: every upload is resized and converted to WebP
// (JPEG fallback on old browsers) before it leaves the owner's phone.

async function loadBitmap(file) {
  if ('createImageBitmap' in window) {
    try {
      return await createImageBitmap(file, { imageOrientation: 'from-image' })
    } catch {
      /* fall through to <img> decoding */
    }
  }
  const url = URL.createObjectURL(file)
  try {
    const img = new Image()
    img.decoding = 'async'
    img.src = url
    await img.decode()
    return img
  } finally {
    URL.revokeObjectURL(url)
  }
}

function toBlob(canvas, type, quality) {
  return new Promise((resolve) => canvas.toBlob(resolve, type, quality))
}

async function encode(source, maxSize, quality) {
  const sw = source.width
  const sh = source.height
  const scale = Math.min(1, maxSize / Math.max(sw, sh))
  const w = Math.round(sw * scale)
  const h = Math.round(sh * scale)
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')
  ctx.imageSmoothingQuality = 'high'
  ctx.drawImage(source, 0, 0, w, h)
  let blob = await toBlob(canvas, 'image/webp', quality)
  if (!blob || blob.type !== 'image/webp') blob = await toBlob(canvas, 'image/jpeg', quality)
  return { blob, width: w, height: h, ext: blob.type === 'image/webp' ? 'webp' : 'jpg' }
}

/**
 * Returns a large version (for zoom / lightbox) and a small thumbnail (for cards),
 * plus a local preview URL.
 */
export async function compressImage(file, { full = 1600, thumb = 640, quality = 0.82 } = {}) {
  if (!file.type.startsWith('image/')) throw new Error('Please choose an image file')
  const bitmap = await loadBitmap(file)
  const big = await encode(bitmap, full, quality)
  const small = await encode(bitmap, thumb, 0.78)
  if (bitmap.close) bitmap.close()
  return {
    full: big,
    thumb: small,
    previewUrl: URL.createObjectURL(small.blob),
    originalSize: file.size,
  }
}

export const formatBytes = (b) =>
  b > 1024 * 1024 ? `${(b / 1024 / 1024).toFixed(1)} MB` : `${Math.max(1, Math.round(b / 1024))} KB`
