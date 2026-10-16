// Generates the placeholder artwork in public/samples/ (sample products + gallery).
// Run with: npm run samples
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { iconFor } from '../src/data/icons.js'
import { SAMPLE_PRODUCTS, SAMPLE_GALLERY, gallerySize } from '../src/data/seed.js'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const out = join(root, 'public', 'samples')
mkdirSync(out, { recursive: true })

// Soft background tints so the sample grid doesn't look identical.
const TINTS = ['#FBEFD9', '#F7E6E1', '#F3EBDD', '#EEF0E4', '#F6E9D0', '#F1E4E8']

function productSvg(category, i) {
  const bg = TINTS[i % TINTS.length]
  const silver = category === 'silver-items' || category === 'payal'
  const [g1, g2, g3] = silver ? ['#9AA3AD', '#E4E8EC', '#7D8792'] : ['#B8892F', '#F1D88E', '#9C7224']
  return `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 800 800">
  <defs>
    <radialGradient id="bg" cx="50%" cy="42%" r="70%">
      <stop offset="0" stop-color="#FFFDF7"/><stop offset="1" stop-color="${bg}"/>
    </radialGradient>
    <linearGradient id="metal" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="${g1}"/><stop offset=".5" stop-color="${g2}"/><stop offset="1" stop-color="${g3}"/>
    </linearGradient>
    <filter id="sh" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="10" stdDeviation="12" flood-color="#7A1E2C" flood-opacity=".18"/>
    </filter>
  </defs>
  <rect width="800" height="800" fill="url(#bg)"/>
  <circle cx="400" cy="380" r="270" fill="none" stroke="#C9A24A" stroke-opacity=".25" stroke-width="2" stroke-dasharray="2 10" stroke-linecap="round"/>
  <circle cx="400" cy="380" r="300" fill="none" stroke="#C9A24A" stroke-opacity=".15" stroke-width="1.5"/>
  <g transform="translate(208 188) scale(16)" fill="none" stroke="url(#metal)" stroke-width="1.05" stroke-linecap="round" stroke-linejoin="round" filter="url(#sh)">
    ${iconFor(category)}
  </g>
  <g font-family="Georgia, 'Times New Roman', serif" text-anchor="middle">
    <rect x="300" y="704" width="200" height="44" rx="22" fill="#7A1E2C" fill-opacity=".9"/>
    <text x="400" y="733" font-size="20" letter-spacing="6" fill="#F6E7BF">SAMPLE</text>
  </g>
</svg>`
}

function gallerySvg(caption, i) {
  const { width: w, height: h } = gallerySize(i)
  const dark = i % 2 === 0
  const bg1 = dark ? '#7A1E2C' : '#F6EBD4'
  const bg2 = dark ? '#4E111B' : '#EAD8B4'
  const ink = dark ? '#F1D88E' : '#7A1E2C'
  const sub = dark ? '#E9D6A8' : '#6B4A2E'
  const cy = h / 2 - 40
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${bg1}"/><stop offset="1" stop-color="${bg2}"/>
    </linearGradient>
    <pattern id="p" width="60" height="60" patternUnits="userSpaceOnUse">
      <path d="M30 6l6 24-6 24-6-24z" fill="${ink}" fill-opacity=".06"/>
    </pattern>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#bg)"/>
  <rect width="${w}" height="${h}" fill="url(#p)"/>
  <rect x="24" y="24" width="${w - 48}" height="${h - 48}" rx="18" fill="none" stroke="${ink}" stroke-opacity=".35" stroke-width="2"/>
  <g transform="translate(${w / 2 - 54} ${cy - 54}) scale(4.5)" fill="none" stroke="${ink}" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round">
    <path d="M3 8.5h18l-1.6-4.5H4.6z"/><path d="M4.5 8.5V20h15V8.5"/><path d="M9.5 20v-6h5v6"/>
    <path d="M3 8.5c0 1.4 1 2.3 2.3 2.3S7.6 9.9 7.6 8.5c0 1.4 1 2.3 2.2 2.3S12 9.9 12 8.5c0 1.4 1 2.3 2.2 2.3s2.2-.9 2.2-2.3c0 1.4 1 2.3 2.3 2.3S21 9.9 21 8.5"/>
  </g>
  <g font-family="Georgia, 'Times New Roman', serif" text-anchor="middle">
    <text x="${w / 2}" y="${cy + 110}" font-size="40" fill="${ink}">${caption.replace(' (sample photo)', '')}</text>
    <text x="${w / 2}" y="${cy + 160}" font-size="24" letter-spacing="5" fill="${sub}">SAMPLE PHOTO · UPLOAD FROM ADMIN</text>
  </g>
</svg>`
}

SAMPLE_PRODUCTS.forEach((p, i) => {
  writeFileSync(join(out, `${p.key}.svg`), productSvg(p.category, i))
})
SAMPLE_GALLERY.forEach((g, i) => {
  writeFileSync(join(out, `gallery-${i + 1}.svg`), gallerySvg(g.caption, i))
})
console.log(`Wrote ${SAMPLE_PRODUCTS.length} product and ${SAMPLE_GALLERY.length} gallery placeholders to public/samples/`)
