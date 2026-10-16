import { useEffect, useState } from 'react'
import { AdminPage, Field, Panel, SaveButton, useToast } from './ui'
import { adminApi } from './adminApi'
import Icon from '../components/Icon'
import { useData } from '../data/DataContext'
import { formatDateTime, formatPrice } from '../lib/format'

const FIELDS = [
  { key: 'gold24', label: '24K Gold', unit: 'per 10 g' },
  { key: 'gold22', label: '22K Gold', unit: 'per 10 g' },
  { key: 'gold18', label: '18K Gold', unit: 'per 10 g' },
  { key: 'silver', label: 'Silver', unit: 'per kg' },
]

const fromSettings = (r) => Object.fromEntries(FIELDS.map((f) => [f.key, r[f.key] ?? '']))

export default function Rates() {
  const { settings, refresh } = useData()
  const toast = useToast()
  const [v, setV] = useState(() => fromSettings(settings.rates))
  const [busy, setBusy] = useState(false)

  useEffect(() => setV(fromSettings(settings.rates)), [settings.rates])

  const autoFill = () => {
    const g24 = Number(v.gold24)
    if (!g24) return toast('Enter the 24K rate first', 'error')
    const round10 = (n) => Math.round(n / 10) * 10
    setV((s) => ({ ...s, gold22: round10(g24 * 0.916), gold18: round10(g24 * 0.75) }))
  }

  const save = async (e) => {
    e.preventDefault()
    setBusy(true)
    try {
      const value = { updated_at: new Date().toISOString() }
      for (const f of FIELDS) value[f.key] = v[f.key] === '' ? null : Number(v[f.key])
      await adminApi.saveSetting('rates', value)
      await refresh()
      toast("Today's rate updated on the website")
    } catch (err) {
      toast(err.message, 'error')
    } finally {
      setBusy(false)
    }
  }

  return (
    <AdminPage
      title="Today's Gold & Silver Rate"
      subtitle={settings.rates.updated_at ? `Last updated: ${formatDateTime(settings.rates.updated_at)}` : 'Not updated yet'}
    >
      <form onSubmit={save}>
        <Panel title="आज का भाव" description="Enter today's rates. The website shows them with today's date and time.">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {FIELDS.map((f) => (
              <Field
                key={f.key}
                label={`${f.label} (${f.unit})`}
                htmlFor={f.key}
                hint={v[f.key] !== '' ? formatPrice(v[f.key]) : 'Leave empty to show “Call for rate”'}
              >
                <div className="relative">
                  <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-soft">₹</span>
                  <input
                    id={f.key}
                    type="number"
                    inputMode="numeric"
                    min="0"
                    step="1"
                    className="field pl-8 text-lg font-semibold text-maroon"
                    value={v[f.key]}
                    onChange={(e) => setV((s) => ({ ...s, [f.key]: e.target.value }))}
                  />
                </div>
              </Field>
            ))}
          </div>
          <button type="button" onClick={autoFill} className="mt-4 inline-flex items-center gap-2 text-sm text-maroon underline decoration-gold underline-offset-4">
            <Icon name="sparkle" className="size-4" />
            Auto-fill 22K and 18K from the 24K rate (91.6% and 75%)
          </button>
          <div className="mt-6 flex justify-end">
            <SaveButton busy={busy} className="w-full py-3.5 text-base sm:w-auto">
              Update rate
            </SaveButton>
          </div>
        </Panel>
      </form>
    </AdminPage>
  )
}
