import Icon from './Icon'
import SectionHeading from './SectionHeading'
import Reveal from './Reveal'
import { useLang } from '../i18n/LanguageContext'
import { useData } from '../data/DataContext'

export default function WhyChooseUs() {
  const { t, pick } = useLang()
  const { settings } = useData()
  const items = settings.why

  return (
    <section className="texture-dots relative overflow-hidden bg-maroon py-14 text-white sm:py-20" aria-labelledby="why-title">
      <div className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full border border-gold/20" />
      <div className="pointer-events-none absolute -bottom-32 -left-20 size-80 rounded-full border border-gold/15" />
      <div className="container-x relative">
        <SectionHeading light eyebrow={t('why.eyebrow')} title={<span id="why-title">{t('why.title')}</span>} />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5 lg:gap-4">
          {items.map((w, i) => (
            <Reveal
              key={i}
              delay={i * 70}
              className="flex gap-4 rounded-2xl border border-gold/30 bg-white/[0.06] p-4 backdrop-blur-sm transition hover:border-gold/60 hover:bg-white/10 lg:flex-col lg:items-center lg:p-6 lg:text-center"
            >
              <span className="grid size-12 shrink-0 place-items-center rounded-full bg-linear-to-br from-gold-light to-gold-dark text-maroon-deep shadow-lg lg:size-14">
                <Icon name={w.icon} className="size-6 lg:size-7" strokeWidth={1.7} />
              </span>
              <div>
                <h3 className="font-display text-[1.05rem] font-semibold text-gold-light">{pick(w, 'title')}</h3>
                <p className="mt-1 text-[0.88rem] leading-relaxed text-white/80">{pick(w, 'text')}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
