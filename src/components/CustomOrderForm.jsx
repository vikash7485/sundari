import { useEffect, useState } from 'react'
import Icon, { WhatsAppIcon } from './Icon'
import { useLang } from '../i18n/LanguageContext'
import { waLink } from '../lib/contact'

export default function CustomOrderForm() {
  const { t } = useLang()
  const [f, setF] = useState({ name: '', description: '' })
  const [photo, setPhoto] = useState(null)
  const [preview, setPreview] = useState(null)
  const set = (k) => (e) => setF((s) => ({ ...s, [k]: e.target.value }))

  useEffect(() => {
    if (!photo) return setPreview(null)
    const url = URL.createObjectURL(photo)
    setPreview(url)
    return () => URL.revokeObjectURL(url)
  }, [photo])

  const message = () =>
    `Namaste Sundari Jewellers, main ${f.name.trim()} hoon. Mujhe apna design banwana hai: ${f.description.trim()}` +
    (photo ? `\n${t('custom.photoNote')}` : '')

  const canShareFile = !!photo && typeof navigator !== 'undefined' && navigator.canShare?.({ files: [photo] })

  const submit = (e) => {
    e.preventDefault()
    window.open(waLink(message()), '_blank', 'noopener')
  }

  // Mobile share sheet: sends photo + text together (the customer picks WhatsApp → Sundari Jewellers).
  const sharePhoto = async () => {
    const form = document.getElementById('custom-order-form')
    if (!form.reportValidity()) return
    try {
      await navigator.share({ files: [photo], text: message() })
    } catch {
      /* cancelled */
    }
  }

  return (
    <form id="custom-order-form" onSubmit={submit} className="card relative flex h-full flex-col p-5 sm:p-7">
      <span className="absolute -top-5 left-5 grid size-10 place-items-center rounded-full bg-gold text-maroon-deep shadow-lg ring-4 ring-cream">
        <Icon name="sparkle" className="size-5" />
      </span>
      <p className="eyebrow mt-2">{t('custom.eyebrow')}</p>
      <h3 className="mt-1 font-display text-2xl font-semibold text-maroon">{t('custom.title')}</h3>
      <p className="mt-1 text-sm text-ink-soft">{t('custom.subtitle')}</p>

      <div className="mt-5 grid grid-cols-1 gap-4">
        <div>
          <label className="label" htmlFor="co-name">{t('custom.name')}</label>
          <input id="co-name" className="field" required autoComplete="name" value={f.name} onChange={set('name')} />
        </div>
        <div>
          <label className="label" htmlFor="co-desc">{t('custom.description')}</label>
          <textarea
            id="co-desc"
            className="field min-h-24 resize-y"
            required
            placeholder={t('custom.descriptionPh')}
            value={f.description}
            onChange={set('description')}
          />
        </div>
        <div>
          <span className="label">{t('custom.photo')}</span>
          <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-gold/60 bg-ivory/50 p-3 transition hover:bg-gold-pale/60">
            {preview ? (
              <img src={preview} alt="" className="size-14 rounded-lg object-cover" />
            ) : (
              <span className="grid size-14 place-items-center rounded-lg bg-white text-gold-dark">
                <Icon name="image" className="size-6" />
              </span>
            )}
            <span className="min-w-0 flex-1 text-sm text-ink-soft">
              <span className="block truncate font-medium text-ink">{photo ? photo.name : t('custom.photoHint')}</span>
            </span>
            {photo && (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault()
                  setPhoto(null)
                }}
                className="grid size-9 place-items-center rounded-full text-ink-soft hover:bg-white"
                aria-label="Remove photo"
              >
                <Icon name="x" className="size-4" />
              </button>
            )}
            <input type="file" accept="image/*" className="sr-only" onChange={(e) => setPhoto(e.target.files?.[0] || null)} />
          </label>
          {photo && <p className="mt-2 text-[0.8rem] text-wa-dark">{t('custom.photoAfter')}</p>}
        </div>
      </div>
      <div className="mt-6 grid grid-cols-1 gap-2.5">
        <button type="submit" className="btn btn-wa w-full py-3.5 text-base">
          <WhatsAppIcon className="size-5" />
          {t('custom.send')}
        </button>
        {canShareFile && (
          <button type="button" onClick={sharePhoto} className="btn btn-outline w-full">
            <Icon name="share" className="size-4" />
            {t('custom.sharePhoto')}
          </button>
        )}
      </div>
    </form>
  )
}
