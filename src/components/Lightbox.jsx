import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import Icon from './Icon'
import SafeImg, { MissingImage } from './SafeImg'

/**
 * Full-screen image viewer: swipe / arrow keys to move, tap to zoom, drag to pan.
 * images: [{ src, alt, caption }]
 */
export default function Lightbox({ images, index, onIndex, onClose }) {
  const [zoom, setZoom] = useState(false)
  const [origin, setOrigin] = useState('50% 50%')
  const touch = useRef(null)
  const img = images[index]
  const many = images.length > 1

  const go = (d) => onIndex((index + d + images.length) % images.length)

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight' && many) go(1)
      if (e.key === 'ArrowLeft' && many) go(-1)
    }
    window.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  })

  useEffect(() => setZoom(false), [index])

  const originFrom = (el, x, y) => {
    const r = el.getBoundingClientRect()
    const px = Math.min(100, Math.max(0, ((x - r.left) / r.width) * 100))
    const py = Math.min(100, Math.max(0, ((y - r.top) / r.height) * 100))
    return `${px}% ${py}%`
  }

  const onImgClick = (e) => {
    setOrigin(originFrom(e.currentTarget, e.clientX, e.clientY))
    setZoom((z) => !z)
  }

  const onTouchStart = (e) => {
    const t0 = e.touches[0]
    touch.current = { x: t0.clientX, y: t0.clientY, moved: false }
  }
  const onTouchMove = (e) => {
    if (!touch.current) return
    const t0 = e.touches[0]
    if (zoom) {
      setOrigin(originFrom(e.currentTarget, t0.clientX, t0.clientY))
    }
    touch.current.moved = true
    touch.current.dx = t0.clientX - touch.current.x
    touch.current.dy = t0.clientY - touch.current.y
  }
  const onTouchEnd = () => {
    const tc = touch.current
    touch.current = null
    if (!tc || zoom || !tc.moved || !many) return
    if (Math.abs(tc.dx) > 50 && Math.abs(tc.dx) > Math.abs(tc.dy)) go(tc.dx < 0 ? 1 : -1)
  }

  if (!img) return null

  return createPortal(
    <div role="dialog" aria-modal="true" className="fixed inset-0 z-[70] flex animate-fade-in flex-col bg-[#120509]/95 text-white">
      <div className="flex items-center justify-between gap-3 px-4 py-3">
        <p className="min-w-0 truncate text-sm text-white/80">
          {many && (
            <span className="mr-2 text-gold-light">
              {index + 1} / {images.length}
            </span>
          )}
          {img.caption}
        </p>
        <div className="flex shrink-0 gap-1">
          <button
            type="button"
            onClick={() => setZoom((z) => !z)}
            className="grid size-11 place-items-center rounded-full hover:bg-white/10"
            aria-label="Zoom"
          >
            <Icon name="zoomIn" className="size-5" />
          </button>
          <button type="button" onClick={onClose} className="grid size-11 place-items-center rounded-full hover:bg-white/10" aria-label="Close">
            <Icon name="x" className="size-6" />
          </button>
        </div>
      </div>

      <div
        className="relative flex-1 select-none overflow-hidden"
        style={{ touchAction: zoom ? 'none' : 'pan-y' }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onMouseMove={(e) => zoom && setOrigin(originFrom(e.currentTarget, e.clientX, e.clientY))}
      >
        <div className="absolute inset-0 grid place-items-center p-2 sm:p-8">
          <SafeImg
            key={img.src}
            src={img.src}
            alt={img.alt || ''}
            onClick={onImgClick}
            draggable={false}
            className={`max-h-full max-w-full animate-fade-in rounded-md object-contain transition-transform duration-300 ${zoom ? 'cursor-zoom-out' : 'cursor-zoom-in'}`}
            style={{ transform: zoom ? 'scale(2.5)' : 'none', transformOrigin: origin }}
            fallback={<MissingImage className="size-40 rounded-md" />}
          />
        </div>
        {many && (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              className="absolute left-2 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-black/40 hover:bg-black/60"
              aria-label="Previous"
            >
              <Icon name="chevronLeft" className="size-6" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              className="absolute right-2 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-black/40 hover:bg-black/60"
              aria-label="Next"
            >
              <Icon name="chevronRight" className="size-6" />
            </button>
          </>
        )}
      </div>

      {many && (
        <div className="no-scrollbar flex justify-center gap-2 overflow-x-auto px-4 py-3" style={{ paddingBottom: 'calc(0.75rem + env(safe-area-inset-bottom))' }}>
          {images.map((im, i) => (
            <button
              key={i}
              type="button"
              onClick={() => onIndex(i)}
              className={`size-12 shrink-0 overflow-hidden rounded-md ring-2 transition ${i === index ? 'ring-gold' : 'opacity-50 ring-transparent hover:opacity-90'}`}
              aria-label={`Image ${i + 1}`}
            >
              <SafeImg src={im.thumb || im.src} className="size-full object-cover" loading="lazy" />
            </button>
          ))}
        </div>
      )}
    </div>,
    document.body,
  )
}
