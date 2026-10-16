import { useEffect, useState } from 'react'
import { AdminPage, Field, Panel, SaveButton, Spinner, useToast } from './ui'
import { adminApi } from './adminApi'
import Icon, { WHY_ICONS } from '../components/Icon'
import { useData } from '../data/DataContext'
import { DEFAULT_SETTINGS } from '../data/seed'
import { compressImage } from '../lib/image'
import { formatTime12 } from '../lib/format'

function useSaver() {
  const { refresh } = useData()
  const toast = useToast()
  const [busy, setBusy] = useState(null)
  const save = async (key, value, message) => {
    setBusy(key)
    try {
      await adminApi.saveSetting(key, value)
      await refresh()
      toast(message)
    } catch (e) {
      toast(e.message, 'error')
    } finally {
      setBusy(null)
    }
  }
  return [busy, save]
}

function Timings() {
  const { settings } = useData()
  const [t, setT] = useState(settings.timings)
  const [busy, save] = useSaver()
  useEffect(() => setT(settings.timings), [settings.timings])
  const set = (k) => (e) => setT((s) => ({ ...s, [k]: e.target.value }))
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        save('timings', t, 'Shop timings saved')
      }}
    >
      <Panel title="Shop timings" description={`Website shows: ${formatTime12(t.open)} – ${formatTime12(t.close)}, ${t.days_en}`}>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Opens at" htmlFor="open">
            <input id="open" type="time" className="field" required value={t.open} onChange={set('open')} />
          </Field>
          <Field label="Closes at" htmlFor="close">
            <input id="close" type="time" className="field" required value={t.close} onChange={set('close')} />
          </Field>
          <Field label="Days (English)" htmlFor="days_en" className="col-span-2 sm:col-span-1">
            <input id="days_en" className="field" value={t.days_en} onChange={set('days_en')} placeholder="Open all days" />
          </Field>
          <Field label="Days (Hindi)" htmlFor="days_hi" className="col-span-2 sm:col-span-1">
            <input id="days_hi" className="field" value={t.days_hi} onChange={set('days_hi')} placeholder="सभी दिन खुला" />
          </Field>
        </div>
        <div className="mt-5 flex justify-end">
          <SaveButton busy={busy === 'timings'}>Save timings</SaveButton>
        </div>
      </Panel>
    </form>
  )
}

function WhyEditor() {
  const { settings } = useData()
  const [items, setItems] = useState(settings.why)
  const [busy, save] = useSaver()
  useEffect(() => setItems(settings.why), [settings.why])
  const set = (i, k, v) => setItems((list) => list.map((it, j) => (j === i ? { ...it, [k]: v } : it)))
  const blank = { icon: 'gem', title_en: '', title_hi: '', text_en: '', text_hi: '' }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        save('why', items.filter((it) => it.title_en.trim()), '“Why Choose Us” saved')
      }}
    >
      <Panel
        title="“Why Choose Us” text"
        description="Shown on the home page and About page. Hindi text appears when visitors choose हिंदी."
        right={
          <button
            type="button"
            className="shrink-0 text-xs text-maroon underline"
            onClick={() => confirm('Reset to the original 5 points?') && setItems(DEFAULT_SETTINGS.why)}
          >
            Reset
          </button>
        }
      >
        <ol className="space-y-4">
          {items.map((it, i) => (
            <li key={i} className="rounded-xl border border-gold/30 bg-ivory/40 p-3 sm:p-4">
              <div className="mb-3 flex items-center gap-2">
                <span className="font-display text-maroon">#{i + 1}</span>
                <div className="flex flex-wrap gap-1">
                  {WHY_ICONS.map((ic) => (
                    <button
                      key={ic}
                      type="button"
                      onClick={() => set(i, 'icon', ic)}
                      className={`grid size-8 place-items-center rounded-full ${it.icon === ic ? 'bg-maroon text-white' : 'bg-white text-gold-dark hover:bg-gold-pale'}`}
                      aria-label={`Icon ${ic}`}
                      aria-pressed={it.icon === ic}
                    >
                      <Icon name={ic} className="size-4" />
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => setItems((list) => list.filter((_, j) => j !== i))}
                  className="ml-auto grid size-8 shrink-0 place-items-center rounded-full text-red-700 hover:bg-red-50"
                  aria-label="Remove point"
                >
                  <Icon name="trash" className="size-4" />
                </button>
              </div>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <input className="field" placeholder="Title (English)" value={it.title_en} onChange={(e) => set(i, 'title_en', e.target.value)} />
                <input className="field" placeholder="शीर्षक (हिंदी)" value={it.title_hi || ''} onChange={(e) => set(i, 'title_hi', e.target.value)} />
                <textarea className="field min-h-20" placeholder="Text (English)" value={it.text_en} onChange={(e) => set(i, 'text_en', e.target.value)} />
                <textarea className="field min-h-20" placeholder="विवरण (हिंदी)" value={it.text_hi || ''} onChange={(e) => set(i, 'text_hi', e.target.value)} />
              </div>
            </li>
          ))}
        </ol>
        <div className="mt-4 flex flex-wrap justify-between gap-3">
          <button type="button" onClick={() => setItems((l) => [...l, blank])} className="btn btn-outline bg-white">
            <Icon name="plus" className="size-4" /> Add point
          </button>
          <SaveButton busy={busy === 'why'}>Save text</SaveButton>
        </div>
      </Panel>
    </form>
  )
}

function ImageSetting({ field, title, description, maxSize, aspect }) {
  const { settings } = useData()
  const toast = useToast()
  const [busy, save] = useSaver()
  const [uploading, setUploading] = useState(false)
  const current = settings.site[field]

  const upload = async (file) => {
    setUploading(true)
    try {
      const c = await compressImage(file, { full: maxSize, thumb: 200 })
      const up = await adminApi.uploadImage(c.full.blob, 'site', c.full.ext)
      await save('site', { ...settings.site, [field]: up.url }, `${title} updated`)
    } catch (e) {
      toast(e.message, 'error')
    } finally {
      setUploading(false)
    }
  }

  return (
    <Panel title={title} description={description}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className={`${aspect} grid shrink-0 place-items-center overflow-hidden rounded-xl border border-gold/30 bg-ivory text-ink-soft`}>
          {current ? <img src={current} alt="" className="size-full object-cover" /> : <span className="p-3 text-center text-xs">Not uploaded – using built-in design</span>}
        </div>
        <div className="flex flex-wrap gap-2">
          <label className="btn btn-maroon cursor-pointer">
            {uploading || busy ? <Spinner className="size-4" /> : <Icon name="upload" className="size-4" />}
            {current ? 'Replace' : 'Upload'}
            <input type="file" accept="image/*" className="sr-only" onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])} />
          </label>
          {current && (
            <button type="button" onClick={() => save('site', { ...settings.site, [field]: null }, `${title} removed`)} className="btn btn-outline bg-white">
              Remove
            </button>
          )}
        </div>
      </div>
    </Panel>
  )
}

function GoogleLinks() {
  const { settings } = useData()
  const [url, setUrl] = useState(settings.site.google_review_url || '')
  const [mapQ, setMapQ] = useState(settings.site.map_query || '')
  const [busy, save] = useSaver()
  useEffect(() => {
    setUrl(settings.site.google_review_url || '')
    setMapQ(settings.site.map_query || '')
  }, [settings.site])
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        save('site', { ...settings.site, google_review_url: url.trim(), map_query: mapQ.trim() }, 'Google settings saved')
      }}
    >
      <Panel title="Google Maps & reviews">
        <div className="space-y-4">
          <Field
            label="“Review us on Google” link"
            htmlFor="review"
            hint="Google Maps → your shop → Share / “Ask for reviews” → copy link. Until then the button opens a Google search for the shop."
          >
            <input id="review" type="url" className="field" placeholder="https://g.page/r/…/review" value={url} onChange={(e) => setUrl(e.target.value)} />
          </Field>
          <Field
            label="Map location"
            htmlFor="mapq"
            hint="What the map searches for. Default: Mahadev Chowk, Tajpur Road, Samastipur, Bihar. Once your shop is on Google Maps, enter its exact name (e.g. Sundari Jewellers, Samastipur) so the pin lands on your shop."
          >
            <input id="mapq" className="field" placeholder="Mahadev Chowk, Tajpur Road, Samastipur, Bihar" value={mapQ} onChange={(e) => setMapQ(e.target.value)} />
          </Field>
        </div>
        <div className="mt-5 flex justify-end">
          <SaveButton busy={busy === 'site'}>Save</SaveButton>
        </div>
      </Panel>
    </form>
  )
}

export default function SiteSettings() {
  return (
    <AdminPage title="Shop Settings" subtitle="Timings, “Why Choose Us” text, banner and logo.">
      <Timings />
      <ImageSetting
        field="hero_image"
        title="Home page banner"
        description="A wide bridal jewellery photo (landscape, at least 1600 px wide). Text sits on the left on computers and at the bottom on phones."
        maxSize={2000}
        aspect="aspect-[16/9] w-full sm:w-64"
      />
      <ImageSetting
        field="logo"
        title="Logo"
        description="Square logo (shown in a circle). Without it, the gold “सु” monogram is used."
        maxSize={400}
        aspect="size-24 rounded-full"
      />
      <WhyEditor />
      <GoogleLinks />
    </AdminPage>
  )
}
