import Icon, { WhatsAppIcon } from './Icon'
import { useLang } from '../i18n/LanguageContext'
import { SHOP } from '../config'
import { telLink, waLink } from '../lib/contact'

const bottom = { bottom: 'calc(1rem + env(safe-area-inset-bottom))' }

export default function FloatingButtons() {
  const { t } = useLang()
  return (
    <>
      <a
        href={waLink(t('hero.visitText'))}
        target="_blank"
        rel="noopener"
        aria-label={t('contact.whatsapp')}
        style={bottom}
        className="group fixed right-4 z-30 grid size-14 place-items-center rounded-full bg-wa-bright text-white shadow-[0_10px_25px_-8px_rgb(18_140_75/0.8)] transition-transform hover:scale-105 sm:right-6"
      >
        <span className="absolute inset-0 animate-pulse-ring rounded-full bg-wa-bright" aria-hidden="true" />
        <WhatsAppIcon className="relative size-7" />
      </a>
      <a
        href={telLink(SHOP.phones[0])}
        aria-label={`${t('header.call')} ${SHOP.phones[0]}`}
        style={bottom}
        className="fixed left-4 z-30 flex h-14 items-center gap-2 rounded-full bg-maroon pl-4 pr-5 font-medium text-white shadow-[0_10px_25px_-8px_rgb(86_20_32/0.8)] ring-2 ring-gold/40 sm:hidden"
      >
        <Icon name="phone" className="size-5" />
        {t('header.call')}
      </a>
    </>
  )
}
