import Icon, { WhatsAppIcon } from './Icon'
import { EmptyState } from './ProductCard'
import { useLang } from '../i18n/LanguageContext'
import { useData } from '../data/DataContext'
import { waLink } from '../lib/contact'

/** Shown in place of products / photos that could not be loaded (e.g. the database is unreachable). */
export default function LoadError({ title }) {
  const { t } = useLang()
  const { refresh } = useData()
  return (
    <EmptyState title={title} hint={t('common.askOnWhatsApp')}>
      <div className="mt-5 flex flex-wrap justify-center gap-2">
        <button type="button" onClick={refresh} className="btn btn-outline">
          <Icon name="refresh" className="size-4" /> {t('common.retry')}
        </button>
        <a href={waLink(t('hero.visitText'))} target="_blank" rel="noopener" className="btn btn-wa">
          <WhatsAppIcon className="size-4" /> WhatsApp
        </a>
      </div>
    </EmptyState>
  )
}

/** Thin bar under the header while the latest data could not be loaded. */
export function LoadNotice() {
  const { t } = useLang()
  const { status, products, refresh } = useData()
  if (status !== 'error') return null
  return (
    <div role="alert" className="border-b border-gold/40 bg-gold-pale">
      <div className="container-x flex flex-wrap items-center justify-center gap-x-3 gap-y-1 py-2 text-center text-[0.85rem] text-ink">
        <span>{products.length ? t('common.stale') : t('common.error')}</span>
        <button type="button" onClick={refresh} className="inline-flex items-center gap-1 font-medium text-maroon underline decoration-gold underline-offset-4">
          <Icon name="refresh" className="size-3.5" /> {t('common.retry')}
        </button>
      </div>
    </div>
  )
}
