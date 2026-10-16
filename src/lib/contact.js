import { SHOP, productCode } from '../config'

export const waLink = (text) => `https://wa.me/${SHOP.whatsapp}${text ? `?text=${encodeURIComponent(text)}` : ''}`

export const telLink = (phone) => `tel:+91${phone}`

export const productEnquiryText = (p) =>
  `Namaste, mujhe ye product pasand aaya: ${p.title} (Code: ${productCode(p.id)}). Kya ye available hai?`

export const mapsSearchUrl = (q = SHOP.mapQuery) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`

export const mapsDirectionsUrl = (q = SHOP.mapQuery) =>
  `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(q)}`

export const mapsEmbedUrl = (q = SHOP.mapQuery) =>
  `https://maps.google.com/maps?q=${encodeURIComponent(q)}&z=16&output=embed`

// Fallback when the owner hasn't pasted their Google review link yet
export const googleReviewFallback = () =>
  `https://www.google.com/search?q=${encodeURIComponent('Sundari Jewellers Mahadev Chowk Tajpur Road Samastipur')}`
