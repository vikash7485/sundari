import { useMemo, useState } from 'react'
import { WhatsAppIcon } from './Icon'
import Icon from './Icon'
import { useLang } from '../i18n/LanguageContext'
import { useData } from '../data/DataContext'
import { waLink } from '../lib/contact'
import { formatDateDMY, formatTime12 } from '../lib/format'

const todayYMD = () => {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

// Half-hour slots within shop timings
function timeSlots(open = '10:30', close = '20:30') {
  const toMin = (s) => s.split(':').map(Number).reduce((h, m) => h * 60 + m)
  const out = []
  for (let m = toMin(open); m <= toMin(close) - 30; m += 30) {
    out.push(`${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`)
  }
  return out
}

export default function PlanVisitForm() {
  const { t } = useLang()
  const { settings } = useData()
  const slots = useMemo(() => timeSlots(settings.timings.open, settings.timings.close), [settings.timings])
  const [f, setF] = useState({ name: '', date: '', time: '', interest: '' })
  const set = (k) => (e) => setF((s) => ({ ...s, [k]: e.target.value }))

  const submit = (e) => {
    e.preventDefault()
    // Message format requested by the shop owner – keep in Hinglish.
    const text = `Namaste Sundari Jewellers, main ${f.name.trim()} ${formatDateDMY(f.date)} ko ${formatTime12(f.time)} baje shop visit karna chahta/chahti hoon. Mujhe ${f.interest.trim() || 'aapka collection'} dekhna hai.`
    window.open(waLink(text), '_blank', 'noopener')
  }

  return (
    <form onSubmit={submit} className="card relative flex h-full flex-col p-5 sm:p-7">
      <span className="absolute -top-5 left-5 grid size-10 place-items-center rounded-full bg-maroon text-gold-light shadow-lg ring-4 ring-cream">
        <Icon name="calendar" className="size-5" />
      </span>
      <p className="eyebrow mt-2">{t('visit.eyebrow')}</p>
      <h3 className="mt-1 font-display text-2xl font-semibold text-maroon">{t('visit.title')}</h3>
      <p className="mt-1 text-sm text-ink-soft">{t('visit.subtitle')}</p>

      <div className="mt-5 grid grid-cols-1 gap-4">
        <div>
          <label className="label" htmlFor="pv-name">{t('visit.name')}</label>
          <input id="pv-name" className="field" required autoComplete="name" value={f.name} onChange={set('name')} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label" htmlFor="pv-date">{t('visit.date')}</label>
            <input id="pv-date" type="date" className="field px-3" required min={todayYMD()} value={f.date} onChange={set('date')} />
          </div>
          <div>
            <label className="label" htmlFor="pv-time">{t('visit.time')}</label>
            <select id="pv-time" className="field px-3" required value={f.time} onChange={set('time')}>
              <option value="">--</option>
              {slots.map((s) => (
                <option key={s} value={s}>
                  {formatTime12(s)}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label className="label" htmlFor="pv-int">{t('visit.interest')}</label>
          <input id="pv-int" className="field" placeholder={t('visit.interestPh')} value={f.interest} onChange={set('interest')} />
        </div>
      </div>
      <button type="submit" className="btn btn-wa mt-6 w-full py-3.5 text-base">
        <WhatsAppIcon className="size-5" />
        {t('visit.send')}
      </button>
    </form>
  )
}
