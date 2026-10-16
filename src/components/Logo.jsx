import { Link } from 'react-router'
import { useData } from '../data/DataContext'
import { useLang } from '../i18n/LanguageContext'
import { SHOP } from '../config'

export function Monogram({ className = 'size-11' }) {
  return (
    <span
      className={`relative grid shrink-0 place-items-center rounded-full bg-maroon text-gold-light shadow-[inset_0_0_0_1.5px_var(--color-gold),0_0_0_3px_var(--color-cream),0_0_0_4px_rgb(201_162_74/0.55)] ${className}`}
      aria-hidden="true"
    >
      <span className="font-deva text-[1.35em] leading-none translate-y-[0.06em]">सु</span>
    </span>
  )
}

export default function Logo({ light = false, onClick }) {
  const { settings } = useData()
  const { lang } = useLang()
  const logo = settings.site.logo
  const primary = lang === 'hi' ? SHOP.name.hi : SHOP.name.en
  const secondary = lang === 'hi' ? SHOP.name.en : SHOP.name.hi
  return (
    <Link to="/" onClick={onClick} className="flex min-w-0 items-center gap-2.5" aria-label={SHOP.name.en}>
      {logo ? (
        <img src={logo} alt="" className="size-11 shrink-0 rounded-full object-cover ring-1 ring-gold/60" />
      ) : (
        <Monogram className="size-10 text-[16px] sm:size-11 sm:text-[17px]" />
      )}
      <span className="min-w-0 leading-tight">
        <span
          className={`block truncate font-semibold ${light ? 'text-white' : 'text-maroon'} ${
            lang === 'hi' ? 'font-deva text-[1.15rem] sm:text-[1.3rem]' : 'font-display text-[clamp(0.85rem,4.3vw,1.02rem)] sm:text-[1.18rem] sm:tracking-wide'
          }`}
        >
          {primary}
        </span>
        <span className={`block truncate text-[0.72rem] ${light ? 'text-gold-light' : 'text-gold-dark'} ${lang === 'hi' ? 'tracking-[0.18em] uppercase' : 'font-deva'}`}>
          {secondary}
        </span>
      </span>
    </Link>
  )
}
