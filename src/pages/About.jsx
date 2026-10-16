import { Link } from 'react-router'
import WhyChooseUs from '../components/WhyChooseUs'
import Reveal from '../components/Reveal'
import Icon from '../components/Icon'
import { Monogram } from '../components/Logo'
import { VisitAndCustom } from './Home'
import { useLang } from '../i18n/LanguageContext'
import { SHOP } from '../config'
import { useSeo } from '../lib/seo'

export default function About() {
  const { t, L } = useLang()
  useSeo({
    title: 'About Us',
    description:
      'Sundari Jewellers, Mahadev Chowk, Tajpur Road, Samastipur – manufacturer & seller of fancy jewellery. Prop. Dipeshwar Prasad.',
  })

  return (
    <>
      <section className="relative overflow-hidden border-b border-gold/20 bg-ivory/60">
        <div className="container-x grid grid-cols-1 items-center gap-8 py-12 sm:py-16 md:grid-cols-[auto_1fr] md:gap-12">
          <Reveal className="mx-auto">
            <div className="relative grid size-44 place-items-center rounded-full bg-white shadow-gold sm:size-56">
              <div className="absolute inset-3 rounded-full border border-dashed border-gold/50" />
              <Monogram className="size-24 text-[2.6rem] sm:size-32 sm:text-[3.4rem]" />
            </div>
          </Reveal>
          <Reveal delay={100} className="text-center md:text-left">
            <p className="eyebrow">{t('nav.about')}</p>
            <h1 className="mt-1 font-display text-3xl font-semibold text-maroon sm:text-4xl">{t('about.title')}</h1>
            <p className="mt-3 font-display text-lg italic text-gold-dark">“{SHOP.tagline}”</p>
            <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-ink-soft md:mx-0">{t('about.p1')}</p>
            <p className="mx-auto mt-3 max-w-2xl leading-relaxed text-ink-soft md:mx-0">{t('about.p2')}</p>
            <div className="mt-5 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-ink md:justify-start">
              <span className="flex items-center gap-2">
                <Icon name="star" className="size-4 text-gold" />
                {L(SHOP.proprietor)}
              </span>
              <span className="flex items-center gap-2">
                <Icon name="mapPin" className="size-4 text-gold" />
                {L(SHOP.address)}
              </span>
            </div>
            <div className="mt-6 flex flex-wrap justify-center gap-3 md:justify-start">
              <Link to="/collection" className="btn btn-maroon">
                {t('hero.viewCollection')}
              </Link>
              <Link to="/contact" className="btn btn-outline">
                {t('nav.contact')}
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
      <WhyChooseUs />
      <VisitAndCustom />
    </>
  )
}
