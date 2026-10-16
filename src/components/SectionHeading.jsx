import Reveal from './Reveal'

export default function SectionHeading({ eyebrow, title, subtitle, light = false, align = 'center', as: H = 'h2' }) {
  const center = align === 'center'
  return (
    <Reveal className={`mb-8 sm:mb-10 ${center ? 'text-center' : ''}`}>
      {eyebrow && <p className={`eyebrow ${light ? 'text-gold-light' : ''}`}>{eyebrow}</p>}
      <H className={`mt-1.5 font-display text-[1.75rem] font-semibold leading-tight sm:text-4xl ${light ? 'text-white' : 'text-maroon'}`}>
        {title}
      </H>
      <div className={`ornament mt-3 ${center ? 'justify-center' : ''}`} aria-hidden="true">
        <svg viewBox="0 0 12 12" className="size-2.5 fill-current">
          <path d="M6 0 12 6 6 12 0 6z" />
        </svg>
      </div>
      {subtitle && (
        <p className={`mx-auto mt-3 max-w-xl text-[0.95rem] ${light ? 'text-white/75' : 'text-ink-soft'} ${center ? '' : 'mx-0'}`}>
          {subtitle}
        </p>
      )}
    </Reveal>
  )
}
