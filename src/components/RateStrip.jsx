import Icon from './Icon'
import Reveal from './Reveal'
import { useLang } from '../i18n/LanguageContext'
import { useData } from '../data/DataContext'
import { formatDateTime, formatPrice } from '../lib/format'
import { telLink } from '../lib/contact'
import { SHOP } from '../config'

const ITEMS = [
  { key: 'gold24', unit: 'per10g', tone: 'gold' },
  { key: 'gold22', unit: 'per10g', tone: 'gold' },
  { key: 'gold18', unit: 'per10g', tone: 'gold' },
  { key: 'silver', unit: 'perKg', tone: 'silver' },
]

export default function RateStrip({ className = '' }) {
  const { t, lang } = useLang()
  const { settings } = useData()
  const rates = settings.rates
  const anySet = ITEMS.some((i) => rates[i.key] != null && rates[i.key] !== '')

  return (
    <section className={`container-x relative z-10 ${className}`} aria-labelledby="rates-title">
      <Reveal className="card overflow-hidden border-gold/50 bg-white">
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 bg-linear-to-r from-maroon to-maroon-dark px-4 py-2.5 text-white sm:px-5">
          <h2 id="rates-title" className="flex items-center gap-2 font-display text-[1.05rem] font-medium sm:text-lg">
            <Icon name="trend" className="size-5 text-gold-light" />
            {t('rates.title')}
          </h2>
          {rates.updated_at && (
            <p className="text-[0.75rem] text-gold-light/90">
              {t('rates.lastUpdated')}: {formatDateTime(rates.updated_at, lang)}
            </p>
          )}
        </div>
        <dl className="grid grid-cols-2 lg:grid-cols-4">
          {ITEMS.map((item, i) => {
            const v = rates[item.key]
            const has = v != null && v !== ''
            return (
              <div
                key={item.key}
                className={`border-gold/25 px-4 py-3.5 sm:px-5 ${i % 2 === 0 ? 'border-r' : ''} ${i < 2 ? 'border-b lg:border-b-0' : ''} ${
                  i < ITEMS.length - 1 ? 'lg:border-r' : ''
                }`}
              >
                <dt className="flex items-center gap-1.5 text-[0.78rem] text-ink-soft">
                  <span
                    className={`size-2.5 rounded-full ${item.tone === 'gold' ? 'bg-linear-to-br from-gold-light to-gold-dark' : 'bg-linear-to-br from-slate-200 to-slate-400'}`}
                  />
                  {t(`rates.${item.key}`)}
                </dt>
                <dd className="mt-1">
                  {has ? (
                    <>
                      <span className="font-display text-xl font-semibold text-maroon sm:text-2xl">{formatPrice(v)}</span>
                      <span className="ml-1 text-[0.72rem] text-ink-soft">{t(`rates.${item.unit}`)}</span>
                    </>
                  ) : (
                    <a href={telLink(SHOP.phones[0])} className="text-sm font-medium text-maroon underline decoration-gold underline-offset-4">
                      {t('rates.ask')}
                    </a>
                  )}
                </dd>
              </div>
            )
          })}
        </dl>
        {!anySet && <p className="border-t border-gold/25 bg-ivory/60 px-4 py-2.5 text-[0.8rem] text-ink-soft sm:px-5">{t('rates.notSet')}</p>}
      </Reveal>
    </section>
  )
}
