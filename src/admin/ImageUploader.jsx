import { useState } from 'react'
import Icon from '../components/Icon'
import SafeImg from '../components/SafeImg'
import { compressImage, formatBytes } from '../lib/image'
import { Spinner, useToast } from './ui'

const rid = () => Math.random().toString(36).slice(2, 10)

/** Turns picked/dropped files into compressed "new" items. */
export async function filesToItems(fileList, limit, toast) {
  const files = [...fileList].filter((f) => f.type.startsWith('image/')).slice(0, limit)
  const out = []
  for (const file of files) {
    try {
      const compressed = await compressImage(file)
      out.push({ id: rid(), kind: 'new', preview: compressed.previewUrl, compressed, originalSize: file.size })
    } catch (e) {
      toast?.(`${file.name}: ${e.message || 'could not read this image'}`, 'error')
    }
  }
  return out
}

export function existingItem(image) {
  return { id: rid(), kind: 'existing', preview: image.thumb || image.full, data: image }
}

export function DropZone({ onFiles, multiple = true, busy, children, className = '' }) {
  const [drag, setDrag] = useState(false)
  return (
    <label
      onDragOver={(e) => {
        e.preventDefault()
        setDrag(true)
      }}
      onDragLeave={() => setDrag(false)}
      onDrop={(e) => {
        e.preventDefault()
        setDrag(false)
        if (e.dataTransfer.files?.length) onFiles(e.dataTransfer.files)
      }}
      className={`flex cursor-pointer flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed p-4 text-center transition ${
        drag ? 'border-maroon bg-maroon-soft/50' : 'border-gold/60 bg-ivory/50 hover:bg-gold-pale/50'
      } ${className}`}
    >
      {busy ? <Spinner className="size-6 text-maroon" /> : <Icon name="upload" className="size-6 text-gold-dark" />}
      {children}
      <input
        type="file"
        accept="image/*"
        multiple={multiple}
        className="sr-only"
        onChange={(e) => {
          if (e.target.files?.length) onFiles(e.target.files)
          e.target.value = ''
        }}
      />
    </label>
  )
}

/** Up to `max` product photos: add (drag & drop / camera), reorder, remove. First photo = cover. */
export default function ImageUploader({ items, setItems, max = 5 }) {
  const toast = useToast()
  const [busy, setBusy] = useState(false)

  const add = async (fileList) => {
    const room = max - items.length
    if (room <= 0) return toast(`Maximum ${max} photos`, 'error')
    setBusy(true)
    const added = await filesToItems(fileList, room, toast)
    setItems((prev) => [...prev, ...added].slice(0, max))
    setBusy(false)
    if (fileList.length > room) toast(`Only ${max} photos allowed – extra photos were skipped`, 'error')
  }

  const move = (i, d) =>
    setItems((prev) => {
      const next = [...prev]
      const j = i + d
      if (j < 0 || j >= next.length) return prev
      ;[next[i], next[j]] = [next[j], next[i]]
      return next
    })

  const remove = (i) => setItems((prev) => prev.filter((_, k) => k !== i))

  return (
    <div>
      <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-5">
        {items.map((im, i) => (
          <div key={im.id} className="group relative aspect-square overflow-hidden rounded-xl border border-gold/30 bg-ivory">
            <SafeImg src={im.preview} className="size-full object-cover" />
            {i === 0 && (
              <span className="absolute left-1.5 top-1.5 rounded-full bg-maroon px-2 py-0.5 text-[0.6rem] font-semibold text-white">COVER</span>
            )}
            {im.kind === 'new' && (
              <span className="absolute bottom-9 left-1.5 rounded bg-black/55 px-1.5 text-[0.6rem] text-white">
                {formatBytes(im.compressed.full.blob.size)} {im.compressed.full.ext.toUpperCase()}
              </span>
            )}
            <div className="absolute inset-x-0 bottom-0 flex justify-between bg-linear-to-t from-black/60 to-transparent p-1">
              <button type="button" onClick={() => move(i, -1)} disabled={i === 0} className="grid size-7 place-items-center rounded-full bg-white/90 text-ink disabled:opacity-30" aria-label="Move left">
                <Icon name="chevronLeft" className="size-4" />
              </button>
              <button type="button" onClick={() => remove(i)} className="grid size-7 place-items-center rounded-full bg-white/90 text-red-700" aria-label="Remove photo">
                <Icon name="trash" className="size-4" />
              </button>
              <button
                type="button"
                onClick={() => move(i, 1)}
                disabled={i === items.length - 1}
                className="grid size-7 place-items-center rounded-full bg-white/90 text-ink disabled:opacity-30"
                aria-label="Move right"
              >
                <Icon name="chevronRight" className="size-4" />
              </button>
            </div>
          </div>
        ))}
        {items.length < max && (
          <DropZone onFiles={add} busy={busy} className="aspect-square">
            <span className="text-[0.75rem] font-medium leading-tight text-ink">{busy ? 'Compressing…' : 'Add photos'}</span>
            <span className="text-[0.65rem] text-ink-soft">
              {items.length}/{max}
            </span>
          </DropZone>
        )}
      </div>
      <p className="mt-2 text-[0.78rem] text-ink-soft">
        Tap “Add photos” to use the camera or gallery, or drag &amp; drop. Photos are compressed to WebP automatically. The first photo is the cover.
      </p>
    </div>
  )
}
