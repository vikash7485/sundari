import { useEffect, useState } from 'react'
import { NavLink, useLocation } from 'react-router'
import Logo from './Logo'
import Icon, { WhatsAppIcon } from './Icon'
import { useLang } from '../i18n/LanguageContext'
import { SHOP } from '../config'
import { telLink, waLink } from '../lib/contact'

export const NAV = [
  { to: '/', key: 'home' },
  { to: '/collection', key: 'collection' },
  { to: '/gallery', key: 'gallery' },
  { to: '/about', key: 'about' },
  { to: '/contact', key: 'contact' },
]

export function LangToggle({ dark = false }) {
  const { lang, setLang } = useLang()
  const base = 'px-2 py-1 sm:px-2.5 rounded-full text-[0.78rem] font-medium transition-colors'
  const on = dark ? 'bg-gold text-maroon-deep' : 'bg-maroon text-white'
  const off = dark ? 'text-gold-light' : 'text-maroon'
  return (
    <div
      role="group"
      aria-label="Language / भाषा"
      className={`flex items-center rounded-full border p-0.5 ${dark ? 'border-gold/50' : 'border-gold/60 bg-white/70'}`}
    >
      <button type="button" aria-pressed={lang === 'en'} onClick={() => setLang('en')} className={`${base} ${lang === 'en' ? on : off}`}>
        EN
      </button>
      <button
        type="button"
        aria-pressed={lang === 'hi'}
        onClick={() => setLang('hi')}
        className={`${base} font-deva-sans ${lang === 'hi' ? on : off}`}
        style={{ fontFamily: 'var(--font-deva-sans)' }}
      >
        <span className="sm:hidden">हिं</span>
        <span className="hidden sm:inline">हिंदी</span>
      </button>
    </div>
  )
}

export default function Header() {
  const { t } = useLang()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => setOpen(false), [pathname])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <>
      <div className="bg-maroon-deep py-1 text-center font-deva text-[0.82rem] tracking-wide text-gold-light">
        {SHOP.blessing}
      </div>
      <header
        className={`sticky top-0 z-40 border-b transition-[background-color,box-shadow,border-color] duration-300 ${
          scrolled || open
            ? 'border-gold/30 bg-cream/95 shadow-[0_6px_20px_-12px_rgb(86_20_32/0.35)] backdrop-blur-md'
            : 'border-transparent bg-cream'
        }`}
      >
        <div className="container-x flex h-16 items-center gap-3 lg:h-[4.5rem]">
          <Logo />

          <nav className="ml-6 hidden items-center gap-1 lg:flex" aria-label="Main">
            {NAV.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                end={n.to === '/'}
                className={({ isActive }) =>
                  `relative px-3 py-2 text-[0.95rem] transition-colors after:absolute after:inset-x-3 after:-bottom-0.5 after:h-px after:origin-center after:bg-gold after:transition-transform ${
                    isActive ? 'text-maroon after:scale-x-100' : 'text-ink-soft hover:text-maroon after:scale-x-0 hover:after:scale-x-100'
                  }`
                }
              >
                {t(`nav.${n.key}`)}
              </NavLink>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-1.5 sm:gap-2.5">
            <LangToggle />
            <a href={telLink(SHOP.phones[0])} className="btn btn-maroon hidden py-2 sm:inline-flex">
              <Icon name="phone" className="size-4" />
              {t('header.call')}
            </a>
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              className="grid size-10 place-items-center rounded-full text-maroon hover:bg-gold-pale lg:hidden"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? t('header.close') : t('header.menu')}
            >
              <Icon name={open ? 'x' : 'menu'} className="size-6" />
            </button>
          </div>
        </div>

        {open && (
          <div id="mobile-menu" className="animate-fade-in border-t border-gold/20 bg-cream lg:hidden">
            <nav className="container-x flex max-h-[calc(100svh-6rem)] flex-col overflow-y-auto pb-6 pt-2" aria-label="Mobile">
              {NAV.map((n, i) => (
                <NavLink
                  key={n.to}
                  to={n.to}
                  end={n.to === '/'}
                  style={{ animationDelay: `${i * 40}ms` }}
                  className={({ isActive }) =>
                    `animate-fade-up flex items-center justify-between border-b border-gold/15 py-3.5 font-display text-xl ${
                      isActive ? 'text-maroon' : 'text-ink'
                    }`
                  }
                >
                  {t(`nav.${n.key}`)}
                  <Icon name="chevronRight" className="size-5 text-gold" />
                </NavLink>
              ))}
              <div className="mt-5 grid grid-cols-2 gap-2.5">
                {SHOP.phones.map((p) => (
                  <a key={p} href={telLink(p)} className="btn btn-outline px-3 text-sm">
                    <Icon name="phone" className="size-4" /> {p}
                  </a>
                ))}
              </div>
              <a href={waLink(t('hero.visitText'))} target="_blank" rel="noopener" className="btn btn-wa mt-2.5">
                <WhatsAppIcon className="size-5" /> {t('contact.whatsapp')}
              </a>
            </nav>
          </div>
        )}
      </header>
    </>
  )
}
