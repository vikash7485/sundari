import { useState } from 'react'
import Icon from './Icon'

/**
 * <img> that shows `fallback` instead of a broken-image icon when the photo
 * can't be loaded (e.g. photo storage is down or the file was deleted).
 */
export default function SafeImg({ src, fallback = <MissingImage className="size-full" />, alt = '', ...props }) {
  const [failedSrc, setFailedSrc] = useState(null)
  if (!src || failedSrc === src) return fallback
  return <img src={src} alt={alt} onError={() => setFailedSrc(src)} {...props} />
}

export function MissingImage({ className = '' }) {
  return (
    <span className={`grid place-items-center bg-ivory text-gold ${className}`}>
      <Icon name="image" className="size-1/4 max-h-10 min-h-5 max-w-10 min-w-5" strokeWidth={1.4} />
    </span>
  )
}
