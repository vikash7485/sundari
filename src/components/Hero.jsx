import { Link } from 'react-router'
import HeroArt from './HeroArt'
import SafeImg from './SafeImg'
import { WhatsAppIcon } from './Icon'
import Icon from './Icon'
import { useLang } from '../i18n/LanguageContext'
import { useData } from '../data/DataContext'
import { SHOP } from '../config'
import { waLink } from '../lib/contact'

export default function Hero() {
  const { t, L, lang } = useLang()
  const { settings } = useData()
  const hero = settings.site.hero_image

  return (
    <section className="relative isolate overflow-hidden bg-maroon-deep text-white">
      <div className="absolute inset-0 -z-10">
        <SafeImg src={hero} fetchPriority="high" decoding="async" className="size-full object-cover object-center" fallback={<HeroArt />} />
        <div className="absolute inset-0 bg-linear-to-t from-maroon-deep via-maroon-deep/75 via-45% to-transparent lg:bg-linear-to-r lg:from-maroon-deep/95 lg:via-maroon-deep/60 lg:via-50% lg:to-transparent" />
      </div>

      <div className="container-x flex min-h-[calc(100svh-7rem)] flex-col justify-end pb-24 pt-[52vw] sm:pt-64 lg:min-h-[640px] lg:justify-center lg:py-28">
        <div className="mx-auto max-w-xl text-center lg:mx-0 lg:text-left">
          <p className="eyebrow animate-fade-up text-gold-light">{t('hero.eyebrow')}</p>
          <h1 className="mt-3 animate-fade-up [animation-delay:80ms]">
            <span className="gold-text block pt-2 font-deva text-[2.6rem] leading-[1.3] sm:text-6xl">{SHOP.name.hi}</span>
            <span className="mt-1 block font-display text-[1.65rem] font-medium tracking-wide text-white sm:text-4xl">
              {SHOP.name.en}
            </span>
          </h1>
          <p className="mt-4 animate-fade-up font-display text-lg italic text-gold-light [animation-delay:160ms] sm:text-xl">
            “{SHOP.tagline}”
          </p>
          <p
            className={`mt-2 animate-fade-up text-[0.95rem] text-white/80 [animation-delay:220ms] ${lang === 'hi' ? '' : ''}`}
          >
            {L(SHOP.subline)}
          </p>
          <div className="mt-7 flex animate-fade-up flex-col gap-3 [animation-delay:300ms] sm:flex-row sm:justify-center lg:justify-start">
            <Link to="/collection" className="btn btn-gold px-6 py-3.5 text-base">
              {t('hero.viewCollection')}
              <Icon name="arrowRight" className="size-4" />
            </Link>
            <a href={waLink(t('hero.visitText'))} target="_blank" rel="noopener" className="btn btn-ghost-light px-6 py-3.5 text-base">
              <WhatsAppIcon className="size-5 text-wa-bright" />
              {t('hero.planVisit')}
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
