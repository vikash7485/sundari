import { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router'
import ProductCard, { EmptyState, PriceTag, PurityBadge } from '../components/ProductCard'
import CategoryIcon from '../components/CategoryIcon'
import Lightbox from '../components/Lightbox'
import Icon, { WhatsAppIcon } from '../components/Icon'
import Reveal from '../components/Reveal'
import { useLang } from '../i18n/LanguageContext'
import { useData } from '../data/DataContext'
import { METALS, OCCASIONS, PURITIES, SHOP, productCode } from '../config'
import { formatPrice, formatWeight, isNew } from '../lib/format'
import { productEnquiryText, telLink, waLink } from '../lib/contact'
import { useSeo } from '../lib/seo'

function ImageGallery({ images, title, category, onOpen }) {
  const { t } = useLang()
  const track = useRef(null)
  const [active, setActive] = useState(0)
  const [hover, setHover] = useState(null) // transform-origin while mouse-zooming

  const scrollTo = (i) => {
    const el = track.current
    if (el) el.scrollTo({ left: i * el.clientWidth, behavior: 'smooth' })
  }

  const onScroll = () => {
    const el = track.current
    if (el) setActive(Math.round(el.scrollLeft / el.clientWidth))
  }

  if (!images.length) {
    return (
      <div className="card grid aspect-square place-items-center bg-ivory text-gold">
        <CategoryIcon slug={category} className="size-28" strokeWidth={1} />
      </div>
    )
  }

  return (
    <div>
      <div className="card relative overflow-hidden bg-ivory">
        <div ref={track} onScroll={onScroll} className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto">
          {images.map((im, i) => (
            <button
              key={i}
              type="button"
              onClick={() => onOpen(i)}
              onPointerEnter={(e) => e.pointerType === 'mouse' && setHover('50% 50%')}
              onPointerLeave={() => setHover(null)}
              onPointerMove={(e) => {
                if (e.pointerType !== 'mouse') return
                const r = e.currentTarget.getBoundingClientRect()
                setHover(`${((e.clientX - r.left) / r.width) * 100}% ${((e.clientY - r.top) / r.height) * 100}%`)
              }}
              className="relative aspect-square w-full shrink-0 snap-center cursor-zoom-in overflow-hidden"
              aria-label={`${title} – ${i + 1}`}
            >
              <img
                src={im.full || im.thumb}
                alt={`${title}${images.length > 1 ? ` – ${i + 1}` : ''}`}
                loading={i === 0 ? 'eager' : 'lazy'}
                fetchPriority={i === 0 ? 'high' : undefined}
                decoding="async"
                className="size-full object-cover transition-transform duration-200"
                style={hover && active === i ? { transform: 'scale(1.9)', transformOrigin: hover } : undefined}
              />
            </button>
          ))}
        </div>
        <span className="pointer-events-none absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full bg-white/85 px-2.5 py-1 text-[0.72rem] text-ink-soft backdrop-blur">
          <Icon name="zoomIn" className="size-3.5" />
          {t('product.tapToZoom')}
        </span>
        {images.length > 1 && (
          <>
            <div className="pointer-events-none absolute inset-x-0 bottom-3.5 flex justify-center gap-1.5 sm:hidden">
              {images.map((_, i) => (
                <span key={i} className={`h-1.5 rounded-full transition-all ${i === active ? 'w-5 bg-maroon' : 'w-1.5 bg-maroon/30'}`} />
              ))}
            </div>
            <button
              type="button"
              onClick={() => scrollTo(Math.max(0, active - 1))}
              className="absolute left-3 top-1/2 hidden size-10 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-maroon shadow sm:grid"
              aria-label="Previous image"
            >
              <Icon name="chevronLeft" />
            </button>
            <button
              type="button"
              onClick={() => scrollTo(Math.min(images.length - 1, active + 1))}
              className="absolute right-3 top-1/2 hidden size-10 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-maroon shadow sm:grid"
              aria-label="Next image"
            >
              <Icon name="chevronRight" />
            </button>
          </>
        )}
      </div>
      {images.length > 1 && (
        <div className="no-scrollbar mt-3 flex gap-2.5 overflow-x-auto">
          {images.map((im, i) => (
            <button
              key={i}
              type="button"
              onClick={() => scrollTo(i)}
              className={`size-16 shrink-0 overflow-hidden rounded-xl border-2 transition sm:size-20 ${i === active ? 'border-maroon' : 'border-gold/30 opacity-70 hover:opacity-100'}`}
              aria-label={`Image ${i + 1}`}
            >
              <img src={im.thumb || im.full} alt="" className="size-full object-cover" loading="lazy" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default function ProductDetail() {
  const { id } = useParams()
  const { t, pick, L } = useLang()
  const { products, categoryBySlug, status } = useData()
  const [lightbox, setLightbox] = useState(null)
  const [copied, setCopied] = useState(false)
  const p = products.find((x) => String(x.id) === String(id))

  const title = p ? pick(p, 'title') : ''
  useSeo({
    title: p ? `${p.title}${p.purity ? ` (${p.purity})` : ''}` : 'Product',
    description: p
      ? `${p.title} – ${[p.weight && `${p.weight} g`, p.purity, p.price && !p.price_on_request ? formatPrice(p.price) : 'Price on request'].filter(Boolean).join(', ')}. Sundari Jewellers, Mahadev Chowk, Tajpur Road, Samastipur.`
      : undefined,
    image: p?.images[0]?.full,
  })

  useEffect(() => setLightbox(null), [id])

  if (!p) {
    if (status === 'loading') {
      return (
        <div className="container-x grid gap-8 py-10 lg:grid-cols-2">
          <div className="aspect-square animate-pulse rounded-2xl bg-ivory" />
          <div className="space-y-3">
            <div className="h-8 w-3/4 animate-pulse rounded bg-ivory" />
            <div className="h-6 w-1/3 animate-pulse rounded bg-ivory" />
          </div>
        </div>
      )
    }
    return (
      <div className="container-x py-20">
        <EmptyState title={t('product.notFound')}>
          <Link to="/collection" className="btn btn-maroon mt-5">
            {t('product.back')}
          </Link>
        </EmptyState>
      </div>
    )
  }

  const cat = categoryBySlug[p.category]
  const metal = METALS.find((m) => m.value === p.metal)
  const purity = PURITIES.find((m) => m.value === p.purity)
  const description = pick(p, 'description')
  const related = products.filter((x) => x.id !== p.id && x.category === p.category).slice(0, 4)
  const more = related.length ? related : products.filter((x) => x.id !== p.id).slice(0, 4)

  const share = async () => {
    const url = window.location.href
    if (navigator.share) {
      try {
        await navigator.share({ title: `${p.title} – ${SHOP.name.en}`, text: `${p.title} – ${SHOP.name.en}, Samastipur`, url })
      } catch {
        /* cancelled */
      }
      return
    }
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2200)
    } catch {
      window.open(waLink(`${p.title} – ${url}`), '_blank', 'noopener')
    }
  }

  const specs = [
    [t('product.code'), productCode(p.id)],
    cat && [t('product.category'), pick(cat, 'name')],
    metal && [t('product.metal'), L(metal)],
    purity && [t('product.purity'), L(purity)],
    p.weight != null && [t('product.weight'), `${formatWeight(p.weight)} (${t('product.approx')})`],
    p.occasions.length > 0 && [
      t('product.occasion'),
      p.occasions.map((o) => L(OCCASIONS.find((x) => x.value === o) || { en: o })).join(', '),
    ],
  ].filter(Boolean)

  return (
    <div className="pb-16">
      <nav className="container-x flex items-center gap-1.5 overflow-hidden py-4 text-[0.8rem] text-ink-soft" aria-label="Breadcrumb">
        <Link to="/" className="shrink-0 hover:text-maroon">
          {t('nav.home')}
        </Link>
        <Icon name="chevronRight" className="size-3.5 shrink-0 text-gold" />
        <Link to="/collection" className="shrink-0 hover:text-maroon">
          {t('nav.collection')}
        </Link>
        {cat && (
          <>
            <Icon name="chevronRight" className="size-3.5 shrink-0 text-gold" />
            <Link to={`/collection?category=${cat.slug}`} className="truncate hover:text-maroon">
              {pick(cat, 'name')}
            </Link>
          </>
        )}
      </nav>

      <div className="container-x grid grid-cols-1 gap-7 lg:grid-cols-2 lg:gap-12">
        <ImageGallery images={p.images} title={title} category={p.category} onOpen={setLightbox} />

        <div>
          <div className="flex flex-wrap items-center gap-2">
            {isNew(p.created_at) && (
              <span className="rounded-full bg-maroon px-2.5 py-0.5 text-[0.7rem] font-semibold tracking-wider text-white">{t('product.new')}</span>
            )}
            {p.is_sample && (
              <span className="rounded-full bg-ink/70 px-2.5 py-0.5 text-[0.7rem] font-medium tracking-wider text-white">{t('product.sample')}</span>
            )}
            <PurityBadge purity={p.purity} className="text-[0.75rem]!" />
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[0.75rem] font-medium ${p.in_stock ? 'bg-green-50 text-wa-dark' : 'bg-maroon-soft text-maroon'}`}
            >
              <span className={`size-1.5 rounded-full ${p.in_stock ? 'bg-wa-bright' : 'bg-maroon'}`} />
              {p.in_stock ? t('product.inStock') : t('product.outOfStock')}
            </span>
          </div>

          <h1 className="mt-3 font-display text-[1.75rem] font-semibold leading-tight text-maroon sm:text-4xl">{title}</h1>
          <p className="mt-1 text-sm text-ink-soft">
            {t('product.code')}: <span className="font-medium text-ink">{productCode(p.id)}</span>
          </p>

          <div className="mt-4 text-2xl sm:text-3xl">
            <PriceTag product={p} className="font-display" />
          </div>
          <p className="mt-3 flex gap-2 rounded-xl border border-gold/30 bg-gold-pale/40 p-3 text-[0.8rem] leading-relaxed text-ink-soft">
            <Icon name="trend" className="mt-0.5 size-4 shrink-0 text-gold-dark" />
            {t('product.makingNote')}
          </p>

          <div className="mt-5 grid grid-cols-1 gap-2.5 sm:grid-cols-[1.4fr_1fr_auto]">
            <a href={waLink(productEnquiryText(p))} target="_blank" rel="noopener" className="btn btn-wa py-3.5 text-base">
              <WhatsAppIcon className="size-5" />
              {t('product.enquire')}
            </a>
            <div className="grid grid-cols-2 gap-2.5 sm:contents">
              <a href={telLink(SHOP.phones[0])} className="btn btn-maroon py-3.5">
                <Icon name="phone" className="size-4" />
                {t('product.callNow')}
              </a>
              <button type="button" onClick={share} className="btn btn-outline py-3.5">
                <Icon name={copied ? 'check' : 'share'} className="size-4" />
                {copied ? t('product.linkCopied') : t('product.share')}
              </button>
            </div>
          </div>

          <div className="card mt-6 p-5">
            <h2 className="font-display text-lg font-semibold text-maroon">{t('product.details')}</h2>
            <dl className="mt-3 divide-y divide-gold/15 text-[0.92rem]">
              {specs.map(([k, v]) => (
                <div key={k} className="flex justify-between gap-4 py-2.5">
                  <dt className="text-ink-soft">{k}</dt>
                  <dd className="text-right font-medium text-ink">{v}</dd>
                </div>
              ))}
            </dl>
            {description && <p className="mt-4 whitespace-pre-line border-t border-gold/20 pt-4 text-[0.92rem] leading-relaxed text-ink-soft">{description}</p>}
          </div>
        </div>
      </div>

      {more.length > 0 && (
        <section className="container-x mt-16">
          <h2 className="font-display text-2xl font-semibold text-maroon">{t('product.related')}</h2>
          <div className="ornament mt-2" aria-hidden="true">
            <svg viewBox="0 0 12 12" className="size-2.5 fill-current">
              <path d="M6 0 12 6 6 12 0 6z" />
            </svg>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-4">
            {more.map((x, i) => (
              <Reveal key={x.id} delay={i * 60}>
                <ProductCard product={x} />
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {lightbox != null && (
        <Lightbox
          images={p.images.map((im) => ({ src: im.full || im.thumb, thumb: im.thumb, alt: title, caption: title }))}
          index={lightbox}
          onIndex={setLightbox}
          onClose={() => setLightbox(null)}
        />
      )}
    </div>
  )
}
