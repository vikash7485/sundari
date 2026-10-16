import { Link } from 'react-router'
import Logo from './Logo'
import Icon, { WhatsAppIcon } from './Icon'
import { NAV } from './Header'
import { useLang } from '../i18n/LanguageContext'
import { useData } from '../data/DataContext'
import { SHOP } from '../config'
import { telLink, waLink, mapsSearchUrl } from '../lib/contact'
import { formatTime12 } from '../lib/format'

export default function Footer() {
  const { t, L, lang } = useLang()
  const { settings } = useData()
  const tm = settings.timings
  return (
    <footer className="texture-dots relative bg-maroon-deep pb-24 text-white/80 sm:pb-10">
      <div className="h-1 bg-linear-to-r from-gold-dark via-gold-light to-gold-dark" />
      <div className="container-x grid grid-cols-1 gap-10 pt-12 md:grid-cols-[1.3fr_1fr_1.2fr]">
        <div>
          <Logo light />
          <p className="mt-4 font-display text-lg italic text-gold-light">“{SHOP.tagline}”</p>
          <p className="mt-1 font-deva text-white/75">{SHOP.subline.hi}</p>
          <p className="text-sm text-white/60">{SHOP.subline.en}</p>
          <p className="mt-3 text-sm text-white/70">{L(SHOP.proprietor)}</p>
        </div>

        <div>
          <h3 className="eyebrow text-gold">{t('footer.quickLinks')}</h3>
          <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2.5 md:grid-cols-1">
            {NAV.map((n) => (
              <li key={n.to}>
                <Link to={n.to} className="inline-flex items-center gap-1.5 hover:text-gold-light">
                  <Icon name="chevronRight" className="size-3.5 text-gold" />
                  {t(`nav.${n.key}`)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="eyebrow text-gold">{t('footer.reachUs')}</h3>
          <ul className="mt-4 space-y-3 text-[0.95rem]">
            <li>
              <a href={mapsSearchUrl(settings.site.map_query || undefined)} target="_blank" rel="noopener" className="flex gap-2.5 hover:text-gold-light">
                <Icon name="mapPin" className="mt-0.5 size-5 shrink-0 text-gold" />
                <span>{L(SHOP.address)}</span>
              </a>
            </li>
            <li className="flex gap-2.5">
              <Icon name="phone" className="mt-0.5 size-5 shrink-0 text-gold" />
              <span className="flex flex-wrap gap-x-3">
                {SHOP.phones.map((p) => (
                  <a key={p} href={telLink(p)} className="hover:text-gold-light">
                    {p}
                  </a>
                ))}
              </span>
            </li>
            <li>
              <a href={waLink()} target="_blank" rel="noopener" className="flex gap-2.5 hover:text-gold-light">
                <WhatsAppIcon className="mt-0.5 size-5 shrink-0 text-gold" />
                <span>WhatsApp: {SHOP.whatsapp.slice(2)}</span>
              </a>
            </li>
            <li className="flex gap-2.5">
              <Icon name="clock" className="mt-0.5 size-5 shrink-0 text-gold" />
              <span>
                {formatTime12(tm.open)} – {formatTime12(tm.close)}
                <span className="block text-sm text-white/60">{lang === 'hi' ? tm.days_hi : tm.days_en}</span>
              </span>
            </li>
          </ul>
        </div>
      </div>

      <div className="container-x mt-10">
        <p className="rounded-xl border border-gold/25 bg-white/5 px-4 py-3 text-sm text-white/75">
          <Icon name="trend" className="mr-2 inline size-4 -translate-y-px text-gold" />
          {t('footer.priceNote')}
        </p>
        <div className="mt-6 flex flex-col items-center justify-between gap-2 border-t border-white/10 pt-5 text-xs text-white/50 sm:flex-row">
          <p>
            © {new Date().getFullYear()} {SHOP.name.en} · {SHOP.name.hi}. {t('footer.rights')}
          </p>
          <Link to="/admin" className="hover:text-gold-light">
            {t('footer.admin')}
          </Link>
        </div>
      </div>
    </footer>
  )
}
