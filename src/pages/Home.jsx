import { Link } from 'react-router'
import Hero from '../components/Hero'
import RateStrip from '../components/RateStrip'
import CategoryGrid from '../components/CategoryGrid'
import NewArrivals from '../components/NewArrivals'
import WhyChooseUs from '../components/WhyChooseUs'
import GalleryGrid from '../components/GalleryGrid'
import SectionHeading from '../components/SectionHeading'
import PlanVisitForm from '../components/PlanVisitForm'
import CustomOrderForm from '../components/CustomOrderForm'
import ContactSection from '../components/ContactSection'
import Reveal from '../components/Reveal'
import Icon from '../components/Icon'
import { useLang } from '../i18n/LanguageContext'
import { useData } from '../data/DataContext'
import { useSeo } from '../lib/seo'

export function VisitAndCustom() {
  return (
    <section className="bg-ivory/70 py-14 sm:py-20" id="visit">
      <div className="container-x grid grid-cols-1 gap-10 pt-4 md:grid-cols-2 md:gap-6 lg:gap-8">
        <Reveal>
          <PlanVisitForm />
        </Reveal>
        <Reveal delay={100} id="custom-order">
          <CustomOrderForm />
        </Reveal>
      </div>
    </section>
  )
}

export default function Home() {
  const { t } = useLang()
  const { gallery } = useData()
  useSeo({ path: '/' })

  return (
    <>
      <Hero />
      <RateStrip className="-mt-14" />
      <CategoryGrid />
      <NewArrivals />
      <WhyChooseUs />

      {gallery.length > 0 && (
        <section className="py-14 sm:py-20" aria-labelledby="gal-title">
          <div className="container-x">
            <SectionHeading
              eyebrow={t('gallery.eyebrow')}
              title={<span id="gal-title">{t('gallery.title')}</span>}
              subtitle={t('gallery.subtitle')}
            />
            <GalleryGrid items={gallery.slice(0, 8)} />
            {gallery.length > 0 && (
              <div className="mt-8 text-center">
                <Link to="/gallery" className="btn btn-outline px-6">
                  {t('gallery.viewAll')}
                  <Icon name="arrowRight" className="size-4" />
                </Link>
              </div>
            )}
          </div>
        </section>
      )}

      <VisitAndCustom />
      <ContactSection />
    </>
  )
}
