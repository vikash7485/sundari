import { useEffect } from 'react'
import { SITE_URL } from '../config'

export const DEFAULT_TITLE = 'Sundari Jewellers – Gold & Fancy Jewellery Shop in Samastipur'
export const DEFAULT_DESC =
  'Sundari Jewellers (सुन्दरी ज्वेलर्स), Mahadev Chowk, Tajpur Road, Samastipur, Bihar – manufacturer & seller of gold, silver, bridal and fancy jewellery. BIS hallmark gold, custom designs, old gold exchange.'

function setMeta(attr, key, content) {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

// Per-page <title>, description and Open Graph tags.
export function useSeo({ title, description, image, path } = {}) {
  useEffect(() => {
    const fullTitle = title ? `${title} | Sundari Jewellers, Samastipur` : DEFAULT_TITLE
    const desc = description || DEFAULT_DESC
    document.title = fullTitle
    setMeta('name', 'description', desc)
    setMeta('property', 'og:title', fullTitle)
    setMeta('property', 'og:description', desc)
    if (SITE_URL) {
      const url = `${SITE_URL}${path ?? window.location.pathname}`
      setMeta('property', 'og:url', url)
      const canonical = document.head.querySelector('link[rel="canonical"]')
      if (canonical) canonical.href = url
      if (image) setMeta('property', 'og:image', image.startsWith('http') ? image : `${SITE_URL}${image}`)
    }
  }, [title, description, image, path])
}
