// Line-art jewellery icons (24x24, stroke = currentColor).
// Shared by the website (CategoryIcon) and scripts/generate-samples.mjs.

export const JEWEL_ICONS = {
  'necklace-set': `
    <path d="M3.5 3.5c.5 6.3 4 10.2 8.5 10.2s8-3.9 8.5-10.2"/>
    <path d="M6.2 10.2v1.4M8.8 12.5v1.4M15.2 12.5v1.4M17.8 10.2v1.4"/>
    <circle cx="6.2" cy="12.5" r=".9"/><circle cx="8.8" cy="14.8" r=".9"/>
    <circle cx="15.2" cy="14.8" r=".9"/><circle cx="17.8" cy="12.5" r=".9"/>
    <path d="M12 13.7v1.1"/><path d="M12 14.8l2.2 2.9L12 21.2l-2.2-3.5z"/>`,
  earrings: `
    <circle cx="12" cy="3.8" r="1.5"/><path d="M12 5.3v1.6"/>
    <circle cx="12" cy="8.2" r="1.3"/><path d="M12 9.5v1.3"/>
    <path d="M6.6 16.3a5.4 5.4 0 0 1 10.8 0z"/>
    <path d="M9 13.6c.8-.6 1.9-1 3-1s2.2.4 3 1" opacity=".55"/>
    <circle cx="7.6" cy="18.3" r=".8"/><circle cx="10" cy="19" r=".8"/>
    <circle cx="14" cy="19" r=".8"/><circle cx="16.4" cy="18.3" r=".8"/>
    <path d="M12 16.3v2.6"/><circle cx="12" cy="20.4" r="1"/>`,
  rings: `
    <circle cx="12" cy="15" r="6"/>
    <path d="M9.4 6.3 12 9l2.6-2.7-1.3-2.3h-2.6z"/><path d="M9.4 6.3h5.2"/>`,
  'nose-pin': `
    <path d="M15.6 6.5A7 7 0 1 1 8.2 6.8"/>
    <circle cx="8.2" cy="6.8" r="1"/>
    <path d="M15.6 6.5c1.4-1.9 3-3 5-3.2" stroke-dasharray=".1 1.6"/>
    <circle cx="12" cy="19.6" r="1.4"/><circle cx="8.9" cy="18.7" r=".8"/><circle cx="15.1" cy="18.7" r=".8"/>`,
  mangalsutra: `
    <path d="M3.5 3l8.5 10 8.5-10" stroke-dasharray=".1 1.9" stroke-width="2"/>
    <path d="M12 13v1.2"/>
    <circle cx="9.7" cy="16.6" r="2.3"/><circle cx="14.3" cy="16.6" r="2.3"/>
    <circle cx="9.7" cy="16.6" r=".6"/><circle cx="14.3" cy="16.6" r=".6"/>`,
  bangles: `
    <ellipse cx="12" cy="8" rx="8.5" ry="3"/>
    <ellipse cx="12" cy="12" rx="8.5" ry="3"/>
    <ellipse cx="12" cy="16" rx="8.5" ry="3"/>`,
  chains: `
    <rect x="1.8" y="8.8" width="7.6" height="6.4" rx="3.2"/>
    <rect x="6.6" y="11" width="10.8" height="2" rx="1"/>
    <rect x="14.6" y="8.8" width="7.6" height="6.4" rx="3.2"/>`,
  pendants: `
    <path d="M4.5 3 12 10l7.5-7"/><circle cx="12" cy="11" r="1"/>
    <path d="M12 12c3 3.2 4.2 5 4.2 6.6a4.2 4.2 0 0 1-8.4 0C7.8 17 9 15.2 12 12z"/>
    <path d="M12 16.2v3" opacity=".55"/>`,
  payal: `
    <path d="M3 9.5c2-1.6 5.4-2.5 9-2.5s7 .9 9 2.5" opacity=".5"/>
    <path d="M3 9.5c2 3 5.4 4.5 9 4.5s7-1.5 9-4.5"/>
    <path d="M6 12v1.8M9 13.4v1.8M12 14v1.8M15 13.4v1.8M18 12v1.8"/>
    <circle cx="6" cy="14.8" r="1"/><circle cx="9" cy="16.2" r="1"/><circle cx="12" cy="16.8" r="1"/>
    <circle cx="15" cy="16.2" r="1"/><circle cx="18" cy="14.8" r="1"/>`,
  'maang-tikka': `
    <path d="M12 1.8v6" stroke-dasharray=".1 1.5"/>
    <circle cx="12" cy="11.4" r="3.5"/><circle cx="12" cy="11.4" r="1.2"/>
    <path d="M12 14.9v1.8"/><path d="M12 16.7l1.7 2.3L12 22l-1.7-3z"/>`,
  'bridal-sets': `
    <path d="M3 4c1.2 5.8 4.6 8.8 9 8.8s7.8-3 9-8.8"/>
    <path d="M5.6 5c1.3 3.8 3.6 5.6 6.4 5.6s5.1-1.8 6.4-5.6"/>
    <circle cx="6.6" cy="11.6" r=".9"/><circle cx="17.4" cy="11.6" r=".9"/>
    <path d="M12 12.8v.9"/><circle cx="12" cy="16.1" r="2.4"/><circle cx="12" cy="16.1" r=".8"/>
    <path d="M12 18.5v1.3"/><circle cx="12" cy="20.8" r="1"/>`,
  'silver-items': `
    <ellipse cx="12" cy="16" rx="9" ry="3.2"/>
    <ellipse cx="12" cy="16" rx="5.5" ry="1.7" opacity=".5"/>
    <path d="M8.6 11.6c0 1.3 1.5 2.2 3.4 2.2s3.4-.9 3.4-2.2z"/>
    <path d="M12 10.4c-1-1.2-1-2.6 0-4.2 1 1.6 1 3 0 4.2z"/>`,
  'mens-jewellery': `
    <path d="M7.2 11.2a6 6 0 1 0 9.6 0"/>
    <rect x="7.3" y="4.6" width="9.4" height="7" rx="1.6"/>
    <rect x="9.6" y="6.6" width="4.8" height="3" rx=".6" opacity=".6"/>`,
  gem: `
    <path d="M6.5 4h11L21 9l-9 11L3 9z"/>
    <path d="M3 9h18M9.5 4 8 9l4 11 4-11-1.5-5"/>`,
}

export const iconFor = (slug) => JEWEL_ICONS[slug] || JEWEL_ICONS.gem
