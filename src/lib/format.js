import { NEW_DAYS } from '../config'

const inr = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })
const num = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 3 })

// ₹1,25,000 (Indian grouping)
export const formatPrice = (n) => (n == null || n === '' || isNaN(n) ? '' : inr.format(Number(n)))

export const formatNumber = (n) => (n == null || n === '' ? '' : num.format(Number(n)))

export const formatWeight = (g) => (g == null || g === '' ? '' : `${num.format(Number(g))} g`)

export function formatDateTime(iso, lang = 'en') {
  if (!iso) return ''
  return new Intl.DateTimeFormat(lang === 'hi' ? 'hi-IN' : 'en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZone: 'Asia/Kolkata',
  }).format(new Date(iso))
}

// "2026-10-20" -> "20/10/2026"
export function formatDateDMY(ymd) {
  if (!ymd) return ''
  const [y, m, d] = ymd.split('-')
  return `${d}/${m}/${y}`
}

// "20:30" -> "8:30 PM"
export function formatTime12(hhmm) {
  if (!hhmm) return ''
  const [h, m] = hhmm.split(':').map(Number)
  const suffix = h >= 12 ? 'PM' : 'AM'
  const h12 = h % 12 || 12
  return `${h12}:${String(m).padStart(2, '0')} ${suffix}`
}

export const isNew = (iso) => !!iso && Date.now() - new Date(iso).getTime() < NEW_DAYS * 86400000

// Minutes since midnight in India, regardless of the visitor's own timezone
function istMinutesNow() {
  const parts = new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'Asia/Kolkata',
  }).formatToParts(new Date())
  const h = Number(parts.find((p) => p.type === 'hour').value) % 24
  const m = Number(parts.find((p) => p.type === 'minute').value)
  return h * 60 + m
}

export function isOpenNow(open, close) {
  if (!open || !close) return null
  const toMin = (s) => {
    const [h, m] = s.split(':').map(Number)
    return h * 60 + m
  }
  const now = istMinutesNow()
  return now >= toMin(open) && now < toMin(close)
}

export const slugify = (s) =>
  s
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
