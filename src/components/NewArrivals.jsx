import { useState } from 'react'
import { Link } from 'react-router'
import ProductCard, { ProductCardSkeleton } from './ProductCard'
import SectionHeading from './SectionHeading'
import Reveal from './Reveal'
import Icon from './Icon'
import { useLang } from '../i18n/LanguageContext'
import { useData } from '../data/DataContext'

export default function NewArrivals() {
  const { t } = useLang()
  const { products, status } = useData()
  const featured = products.filter((p) => p.featured).slice(0, 8)
  const [tab, setTab] = useState('new')
  const list = tab === 'featured' && featured.length ? featured : products.slice(0, 8)

  if (status !== 'loading' && products.length === 0) return null

  return (
    <section className="bg-ivory/70 py-14 sm:py-20" aria-labelledby="new-title">
      <div className="container-x">
        <SectionHeading
          eyebrow={t('arrivals.eyebrow')}
          title={<span id="new-title">{tab === 'featured' ? t('arrivals.featured') : t('arrivals.newArrivals')}</span>}
        />
        {featured.length > 0 && (
          <div className="-mt-3 mb-7 flex justify-center gap-2" role="tablist">
            {['new', 'featured'].map((k) => (
              <button
                key={k}
                type="button"
                role="tab"
                aria-selected={tab === k}
                aria-pressed={tab === k}
                onClick={() => setTab(k)}
                className="chip"
              >
                {k === 'new' ? t('arrivals.newArrivals') : t('arrivals.featured')}
              </button>
            ))}
          </div>
        )}
        <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
          {status === 'loading' && !products.length
            ? Array.from({ length: 4 }, (_, i) => <ProductCardSkeleton key={i} />)
            : list.map((p, i) => (
                <Reveal key={p.id} delay={(i % 4) * 60}>
                  <ProductCard product={p} />
                </Reveal>
              ))}
        </div>
        <div className="mt-9 text-center">
          <Link to="/collection" className="btn btn-outline px-6">
            {t('arrivals.viewAll')}
            <Icon name="arrowRight" className="size-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
