import { Link } from 'react-router'
import CategoryIcon from './CategoryIcon'
import SafeImg from './SafeImg'
import Icon from './Icon'
import SectionHeading from './SectionHeading'
import Reveal from './Reveal'
import { useLang } from '../i18n/LanguageContext'
import { useData } from '../data/DataContext'

function Tile({ to, label, children, delay }) {
  return (
    <Reveal delay={delay} className="snap-start">
      <Link
        to={to}
        className="group flex h-full flex-col items-center gap-2 rounded-2xl border border-gold/25 bg-white px-2 pb-3 pt-3.5 text-center shadow-[0_4px_16px_-10px_rgb(86_20_32/0.3)] transition duration-300 hover:-translate-y-1 hover:border-gold/60 hover:shadow-gold"
      >
        <span className="relative grid size-[4.25rem] place-items-center overflow-hidden rounded-full bg-[radial-gradient(circle_at_35%_30%,#fff,var(--color-gold-pale)_70%)] text-gold-dark ring-1 ring-gold/50 ring-offset-2 ring-offset-white transition duration-500 group-hover:ring-gold sm:size-20">
          {children}
        </span>
        <span className="line-clamp-2 text-[0.78rem] font-medium leading-tight text-ink sm:text-[0.85rem]">{label}</span>
      </Link>
    </Reveal>
  )
}

export default function CategoryGrid() {
  const { t, pick } = useLang()
  const { categories, status } = useData()

  if (!categories.length && status !== 'loading') return null

  return (
    <section className="py-14 sm:py-20" aria-labelledby="cat-title">
      <div className="container-x">
        <SectionHeading eyebrow={t('categories.eyebrow')} title={<span id="cat-title">{t('categories.title')}</span>} />
        {categories.length === 0 ? (
          <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-5 lg:grid-cols-7" aria-hidden="true">
            {Array.from({ length: 7 }, (_, i) => (
              <div key={i} className="h-32 animate-pulse rounded-2xl bg-ivory" />
            ))}
          </div>
        ) : (
        <div className="no-scrollbar -mx-4 snap-x snap-mandatory scroll-px-4 overflow-x-auto px-4 pb-2 lg:mx-0 lg:overflow-visible lg:px-0">
          <div className="grid auto-cols-[29%] grid-flow-col grid-rows-2 gap-2.5 sm:auto-cols-[19%] sm:gap-3 lg:grid-flow-row lg:grid-cols-7 lg:grid-rows-none">
            {categories.map((c, i) => (
              <Tile key={c.slug} to={`/collection?category=${encodeURIComponent(c.slug)}`} label={pick(c, 'name')} delay={Math.min(i, 7) * 40}>
                <SafeImg
                  src={c.image}
                  loading="lazy"
                  className="size-full object-cover transition duration-700 group-hover:scale-110"
                  fallback={<CategoryIcon slug={c.slug} className="size-10 transition duration-500 group-hover:scale-110 sm:size-11" />}
                />
              </Tile>
            ))}
            <Tile to="/collection" label={t('categories.viewAll')} delay={280}>
              <Icon name="arrowRight" className="size-7 text-maroon transition group-hover:translate-x-1" />
            </Tile>
          </div>
        </div>
        )}
      </div>
    </section>
  )
}
