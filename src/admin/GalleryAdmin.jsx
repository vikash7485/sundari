import { useState } from 'react'
import { AdminPage, Panel, useToast } from './ui'
import { DropZone, filesToItems } from './ImageUploader'
import { adminApi, uploadVariants } from './adminApi'
import Icon from '../components/Icon'
import { useData } from '../data/DataContext'

function Photo({ g, onDelete, onCaption }) {
  const [caption, setCaption] = useState(g.caption || '')
  return (
    <li className="overflow-hidden rounded-xl border border-gold/25 bg-white shadow-soft">
      <div className="relative aspect-[4/3] bg-ivory">
        <img src={g.thumb_url || g.full_url} alt="" loading="lazy" className="size-full object-cover" />
        {g.is_sample && <span className="absolute left-2 top-2 rounded-full bg-ink/70 px-2 py-0.5 text-[0.62rem] text-white">SAMPLE</span>}
        <button
          type="button"
          onClick={() => onDelete(g)}
          className="absolute right-2 top-2 grid size-9 place-items-center rounded-full bg-white/90 text-red-700 shadow hover:bg-white"
          aria-label="Delete photo"
        >
          <Icon name="trash" className="size-4" />
        </button>
      </div>
      <div className="flex gap-1.5 p-2">
        <input
          className="field py-1.5 text-sm"
          placeholder="Caption (optional)"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), onCaption(g, caption))}
        />
        {caption !== (g.caption || '') && (
          <button type="button" onClick={() => onCaption(g, caption)} className="btn btn-maroon px-3 py-1.5 text-xs">
            Save
          </button>
        )}
      </div>
    </li>
  )
}

export default function GalleryAdmin() {
  const { gallery, refresh } = useData()
  const toast = useToast()
  const [progress, setProgress] = useState('')

  const upload = async (fileList) => {
    setProgress('Compressing…')
    try {
      const items = await filesToItems(fileList, 30, toast)
      let n = 0
      for (const it of items) {
        n++
        setProgress(`Uploading ${n} of ${items.length}…`)
        const v = await uploadVariants(it.compressed, 'gallery')
        await adminApi.addGalleryItem({
          full_url: v.full,
          thumb_url: v.thumb,
          path: v.path,
          thumb_path: v.thumb_path,
          width: v.width,
          height: v.height,
          caption: null,
          is_sample: false,
        })
      }
      await refresh()
      if (items.length) toast(`${items.length} photo${items.length > 1 ? 's' : ''} added to the gallery`)
    } catch (e) {
      toast(e.message, 'error')
    } finally {
      setProgress('')
    }
  }

  const remove = async (g) => {
    if (!confirm('Delete this photo from the gallery?')) return
    try {
      await adminApi.deleteGalleryItem(g)
      await refresh()
      toast('Photo deleted')
    } catch (e) {
      toast(e.message, 'error')
    }
  }

  const saveCaption = async (g, caption) => {
    try {
      await adminApi.updateGalleryItem(g.id, { caption: caption.trim() || null })
      await refresh()
      toast('Caption saved')
    } catch (e) {
      toast(e.message, 'error')
    }
  }

  return (
    <AdminPage title="Shop Gallery" subtitle="Photos of your shop interior and display counters. Newest photos show first.">
      <Panel>
        <DropZone onFiles={upload} busy={!!progress} className="py-8">
          <span className="font-medium text-ink">{progress || 'Upload shop photos'}</span>
          <span className="text-sm text-ink-soft">Tap to choose (you can select many) or drag &amp; drop · auto-compressed to WebP</span>
        </DropZone>
      </Panel>

      {gallery.length === 0 ? (
        <p className="text-center text-ink-soft">No photos yet.</p>
      ) : (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {gallery.map((g) => (
            <Photo key={`${g.id}-${g.caption}`} g={g} onDelete={remove} onCaption={saveCaption} />
          ))}
        </ul>
      )}
    </AdminPage>
  )
}
