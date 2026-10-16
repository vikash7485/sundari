import Icon, { WhatsAppIcon } from './Icon'
import SectionHeading from './SectionHeading'
import Reveal from './Reveal'
import { useLang } from '../i18n/LanguageContext'
import { useData } from '../data/DataContext'
import { SHOP } from '../config'
import { googleReviewFallback, mapsDirectionsUrl, mapsEmbedUrl, mapsSearchUrl, telLink, waLink } from '../lib/contact'
import { formatTime12, isOpenNow } from '../lib/format'

function Row({ icon, title, children }) {
  return (
    <div className="flex gap-3.5 py-4">
      <span className="grid size-10 shrink-0 place-items-center rounded-full bg-gold-pale text-maroon">{icon}</span>
      <div className="min-w-0">
        <p className="text-[0.75rem] uppercase tracking-[0.14em] text-gold-dark">{title}</p>
        <div className="mt-0.5 text-ink">{children}</div>
      </div>
    </div>
  )
}

export function ReviewCard() {
  const { t } = useLang()
  const { settings } = useData()
  const url = settings.site.google_review_url || googleReviewFallback()
  return (
    <div className="card flex flex-col items-start gap-4 p-5 sm:flex-row sm:items-center sm:p-6">
      <span className="flex gap-0.5 text-gold">
        {Array.from({ length: 5 }, (_, i) => (
          <Icon key={i} name="star" className="size-5 fill-gold" strokeWidth={1.2} />
        ))}
      </span>
      <p className="flex-1 text-sm text-ink-soft">{t('contact.reviewText')}</p>
      <a href={url} target="_blank" rel="noopener" className="btn btn-outline shrink-0">
        {t('contact.review')}
        <Icon name="external" className="size-4" />
      </a>
    </div>
  )
}

export default function ContactSection({ headingAs = 'h2' }) {
  const { t, L, lang } = useLang()
  const { settings } = useData()
  const tm = settings.timings
  const open = isOpenNow(tm.open, tm.close)
  const mapQ = settings.site.map_query || SHOP.mapQuery

  return (
    <section className="py-14 sm:py-20" aria-label={t('contact.title')}>
      <div className="container-x">
        <SectionHeading as={headingAs} eyebrow={t('contact.eyebrow')} title={t('contact.title')} />
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_1.2fr]">
          <Reveal className="card divide-y divide-gold/20 px-5 py-1 sm:px-6">
            <Row icon={<Icon name="mapPin" />} title={t('contact.address')}>
              <a href={mapsSearchUrl(mapQ)} target="_blank" rel="noopener" className="hover:text-maroon">
                <span className="font-medium">{L(SHOP.name)}</span>
                <br />
                {L(SHOP.address)}
              </a>
            </Row>
            <Row icon={<Icon name="phone" />} title={t('contact.phone')}>
              <div className="flex flex-wrap gap-2 pt-1">
                {SHOP.phones.map((p) => (
                  <a key={p} href={telLink(p)} className="btn btn-outline px-4 py-2 text-[0.95rem]">
                    <Icon name="phone" className="size-4" />
                    {p}
                  </a>
                ))}
              </div>
            </Row>
            <Row icon={<WhatsAppIcon />} title="WhatsApp">
              <a href={waLink(t('hero.visitText'))} target="_blank" rel="noopener" className="btn btn-wa mt-1 px-4 py-2">
                <WhatsAppIcon className="size-4" />
                {t('contact.whatsapp')} · {SHOP.whatsapp.slice(2)}
              </a>
            </Row>
            <Row icon={<Icon name="clock" />} title={t('contact.timings')}>
              <p className="font-medium">
                {formatTime12(tm.open)} – {formatTime12(tm.close)}
              </p>
              <p className="text-sm text-ink-soft">{lang === 'hi' ? tm.days_hi : tm.days_en}</p>
              {open != null && (
                <span
                  className={`mt-1.5 inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${open ? 'bg-green-50 text-wa-dark' : 'bg-maroon-soft text-maroon'}`}
                >
                  <span className={`size-1.5 rounded-full ${open ? 'bg-wa-bright' : 'bg-maroon'}`} />
                  {open ? t('contact.openNow') : t('contact.closedNow')}
                </span>
              )}
            </Row>
          </Reveal>

          <Reveal delay={100} className="card flex flex-col overflow-hidden">
            <iframe
              title="Map – Mahadev Chowk, Tajpur Road, Samastipur"
              src={mapsEmbedUrl(mapQ)}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-72 w-full flex-1 border-0 sm:h-96 lg:h-auto lg:min-h-[22rem]"
              allowFullScreen
            />
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gold/25 p-4">
              <p className="text-sm text-ink-soft">{L(SHOP.address)}</p>
              <a href={mapsDirectionsUrl(mapQ)} target="_blank" rel="noopener" className="btn btn-maroon">
                <Icon name="mapPin" className="size-4" />
                {t('contact.directions')}
              </a>
            </div>
          </Reveal>
        </div>
        <Reveal className="mt-5">
          <ReviewCard />
        </Reveal>
      </div>
    </section>
  )
}
