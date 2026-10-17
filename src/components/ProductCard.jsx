import { Link } from 'react-router'
import Icon, { WhatsAppIcon } from './Icon'
import CategoryIcon from './CategoryIcon'
import SafeImg from './SafeImg'
import { useLang } from '../i18n/LanguageContext'
import { useData } from '../data/DataContext'
import { formatPrice, formatWeight, isNew } from '../lib/format'
import { productEnquiryText, waLink } from '../lib/contact'
import { METALS } from '../config'

export function PriceTag({ product, className = '' }) {
  const { t } = useLang()
  if (product.price_on_request || product.price == null) {
    return <span className={`italic text-ink-soft ${className}`}>{t('product.priceOnRequest')}</span>
  }
  return <span className={`font-semibold text-maroon ${className}`}>{formatPrice(product.price)}</span>
}

export function PurityBadge({ purity, className = '' }) {
  if (!purity) return null
  return (
    <span
      className={`rounded-full bg-linear-to-b from-gold-light to-gold px-2 py-0.5 text-[0.68rem] font-semibold tracking-wide text-maroon-deep shadow-sm ${className}`}
    >
      {purity === '92.5' ? '92.5 Silver' : purity}
    </span>
  )
}

export default function ProductCard({ product }) {
  const { t, pick, L } = useLang()
  const { categoryBySlug } = useData()
  const img = product.images[0]
  const title = pick(product, 'title')
  const cat = categoryBySlug[product.category]
  const metal = METALS.find((m) => m.value === product.metal)
  const fresh = isNew(product.created_at)

  return (
    <article className="group card @container flex flex-col overflow-hidden transition duration-300 hover:-translate-y-1 hover:shadow-lift">
      <Link to={`/product/${product.id}`} className="flex flex-1 flex-col" aria-label={title}>
        <div className="relative aspect-square overflow-hidden bg-ivory">
          <SafeImg
            src={img && (img.thumb || img.full)}
            alt={title}
            loading="lazy"
            decoding="async"
            className="size-full object-cover transition duration-700 ease-out group-hover:scale-[1.06]"
            fallback={
              <div className="grid size-full place-items-center text-gold">
                <CategoryIcon slug={product.category} className="size-16" />
              </div>
            }
          />
          <div className="absolute left-2 top-2 flex flex-col items-start gap-1">
            {fresh && (
              <span className="rounded-full bg-maroon px-2 py-0.5 text-[0.65rem] font-semibold tracking-wider text-white shadow">
                {t('product.new')}
              </span>
            )}
            {product.is_sample && (
              <span className="rounded-full bg-ink/70 px-2 py-0.5 text-[0.62rem] font-medium tracking-wider text-white backdrop-blur">
                {t('product.sample')}
              </span>
            )}
          </div>
          <PurityBadge purity={product.purity} className="absolute right-2 top-2" />
          {!product.in_stock && (
            <span className="absolute inset-x-0 bottom-0 bg-ink/70 py-1 text-center text-[0.72rem] font-medium text-white backdrop-blur-sm">
              {t('product.outOfStock')}
            </span>
          )}
        </div>
        <div className="flex flex-1 flex-col p-3 sm:p-4">
          {cat && <p className="truncate text-[0.68rem] uppercase tracking-[0.14em] text-gold-dark">{pick(cat, 'name')}</p>}
          <h3 className="mt-0.5 line-clamp-2 font-display text-[0.98rem] font-medium leading-snug text-ink sm:text-[1.05rem]">
            {title}
          </h3>
          <p className="mt-1 text-[0.75rem] text-ink-soft">
            {[formatWeight(product.weight), metal && L(metal)].filter(Boolean).join(' · ')}
          </p>
          <div className="mt-auto pt-2 text-[0.95rem]">
            <PriceTag product={product} />
          </div>
        </div>
      </Link>
      <div className="px-3 pb-3 sm:px-4 sm:pb-4">
        <a
          href={waLink(productEnquiryText(product))}
          target="_blank"
          rel="noopener"
          className="btn btn-wa w-full px-2 py-2 text-[0.78rem] sm:text-[0.85rem]"
        >
          <WhatsAppIcon className="size-4 shrink-0" />
          <span className="truncate">
            <span className="@min-[14.5rem]:hidden">{t('product.enquireShort')}</span>
            <span className="hidden @min-[14.5rem]:inline">{t('product.enquire')}</span>
          </span>
        </a>
      </div>
    </article>
  )
}

export function ProductCardSkeleton() {
  return (
    <div className="card overflow-hidden">
      <div className="aspect-square animate-pulse bg-ivory" />
      <div className="space-y-2 p-4">
        <div className="h-3 w-1/3 animate-pulse rounded bg-ivory" />
        <div className="h-4 w-4/5 animate-pulse rounded bg-ivory" />
        <div className="h-4 w-1/2 animate-pulse rounded bg-ivory" />
      </div>
    </div>
  )
}

export function EmptyState({ title, hint, children }) {
  return (
    <div className="card mx-auto max-w-md px-6 py-10 text-center">
      <Icon name="gem" className="mx-auto size-10 text-gold" strokeWidth={1.4} />
      <p className="mt-3 font-display text-lg text-maroon">{title}</p>
      {hint && <p className="mt-1 text-sm text-ink-soft">{hint}</p>}
      {children}
    </div>
  )
}
