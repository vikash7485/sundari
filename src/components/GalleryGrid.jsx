import { useState } from 'react'
import Lightbox from './Lightbox'
import Reveal from './Reveal'
import Icon from './Icon'
import SafeImg, { MissingImage } from './SafeImg'

export default function GalleryGrid({ items }) {
  const [open, setOpen] = useState(null)
  const images = items.map((g) => ({ src: g.full_url, thumb: g.thumb_url, caption: g.caption, alt: g.caption }))

  return (
    <>
      <div className={`columns-2 gap-3 sm:columns-3 sm:gap-4 ${items.length > 9 ? "xl:columns-4" : ""}`}>
        {items.map((g, i) => (
          <Reveal key={g.id} delay={(i % 4) * 50} className="mb-3 break-inside-avoid sm:mb-4">
            <button
              type="button"
              onClick={() => setOpen(i)}
              className="group relative block w-full overflow-hidden rounded-xl border border-gold/25 bg-ivory shadow-soft"
              aria-label={g.caption || `Photo ${i + 1}`}
            >
              <SafeImg
                src={g.thumb_url || g.full_url}
                alt={g.caption || ''}
                width={g.width || undefined}
                height={g.height || undefined}
                loading="lazy"
                decoding="async"
                className="h-auto w-full transition duration-700 group-hover:scale-105"
                fallback={<MissingImage className="aspect-[4/3] w-full" />}
              />
              <span className="absolute inset-0 bg-linear-to-t from-maroon-deep/70 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
              <span className="absolute right-2 top-2 grid size-8 place-items-center rounded-full bg-white/85 text-maroon opacity-0 transition group-hover:opacity-100">
                <Icon name="zoomIn" className="size-4" />
              </span>
              {g.caption && (
                <span className="absolute inset-x-0 bottom-0 translate-y-2 p-2.5 text-left text-[0.8rem] text-white opacity-0 transition group-hover:translate-y-0 group-hover:opacity-100">
                  {g.caption}
                </span>
              )}
            </button>
          </Reveal>
        ))}
      </div>
      {open != null && <Lightbox images={images} index={open} onIndex={setOpen} onClose={() => setOpen(null)} />}
    </>
  )
}
