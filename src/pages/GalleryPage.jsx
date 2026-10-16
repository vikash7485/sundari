import GalleryGrid from '../components/GalleryGrid'
import { EmptyState } from '../components/ProductCard'
import { useLang } from '../i18n/LanguageContext'
import { useData } from '../data/DataContext'
import { useSeo } from '../lib/seo'

export default function GalleryPage() {
  const { t } = useLang()
  const { gallery, status } = useData()
  useSeo({
    title: 'Shop Gallery',
    description: 'Photos of Sundari Jewellers shop and display counters at Mahadev Chowk, Tajpur Road, Samastipur.',
  })

  return (
    <div className="pb-16">
      <div className="border-b border-gold/20 bg-ivory/60">
        <div className="container-x py-8 text-center sm:py-12">
          <p className="eyebrow">{t('gallery.eyebrow')}</p>
          <h1 className="mt-1 font-display text-3xl font-semibold text-maroon sm:text-4xl">{t('gallery.title')}</h1>
          <p className="mx-auto mt-2 max-w-xl text-ink-soft">{t('gallery.subtitle')}</p>
        </div>
      </div>
      <div className="container-x mt-8">
        {gallery.length ? (
          <GalleryGrid items={gallery} />
        ) : (
          status !== 'loading' && <EmptyState title={t('gallery.empty')} />
        )}
      </div>
    </div>
  )
}
