// Starting data. The same content is in supabase/seed.sql for the live database.
// Sample products are flagged `is_sample: true` and can be removed in one click from /admin.

export const SEED_CATEGORIES = [
  { slug: 'necklace-set', name_en: 'Necklace Set', name_hi: 'नेकलेस सेट', sort: 1 },
  { slug: 'earrings', name_en: 'Earrings (Jhumka / Tops)', name_hi: 'झुमका / टॉप्स', sort: 2 },
  { slug: 'rings', name_en: 'Rings', name_hi: 'अंगूठी', sort: 3 },
  { slug: 'nose-pin', name_en: 'Nose Pin / Nath', name_hi: 'नथ / नोज़ पिन', sort: 4 },
  { slug: 'mangalsutra', name_en: 'Mangalsutra', name_hi: 'मंगलसूत्र', sort: 5 },
  { slug: 'bangles', name_en: 'Bangles / Kangan', name_hi: 'चूड़ी / कंगन', sort: 6 },
  { slug: 'chains', name_en: 'Chains', name_hi: 'चेन', sort: 7 },
  { slug: 'pendants', name_en: 'Pendants', name_hi: 'पेंडेंट / लॉकेट', sort: 8 },
  { slug: 'payal', name_en: 'Payal / Anklets', name_hi: 'पायल', sort: 9 },
  { slug: 'maang-tikka', name_en: 'Maang Tikka', name_hi: 'मांग टीका', sort: 10 },
  { slug: 'bridal-sets', name_en: 'Bridal Sets', name_hi: 'ब्राइडल सेट', sort: 11 },
  { slug: 'silver-items', name_en: 'Silver Items', name_hi: 'चाँदी के सामान', sort: 12 },
  { slug: 'mens-jewellery', name_en: "Men's Jewellery", name_hi: 'पुरुषों के आभूषण', sort: 13 },
].map((c) => ({ image: null, ...c }))

export const DEFAULT_SETTINGS = {
  rates: { gold24: null, gold22: null, gold18: null, silver: null, updated_at: null },
  timings: {
    open: '10:30',
    close: '20:30',
    days_en: 'Open all days',
    days_hi: 'सभी दिन खुला',
  },
  why: [
    {
      icon: 'hallmark',
      title_en: 'BIS Hallmark Jewellery',
      title_hi: 'BIS हॉलमार्क ज्वेलरी',
      text_en: 'Our gold jewellery carries the BIS hallmark, so you get exactly the purity you pay for.',
      text_hi: 'हमारे सोने के गहनों पर BIS हॉलमार्क — जितनी शुद्धता का दाम, उतनी ही शुद्धता।',
    },
    {
      icon: 'craft',
      title_en: 'Own Manufacturing',
      title_hi: 'अपना निर्माण',
      text_en: 'We make jewellery ourselves, so we can craft your custom design to order.',
      text_hi: 'गहने हम खुद बनाते हैं, इसलिए आपकी पसंद का डिज़ाइन ऑर्डर पर तैयार कर सकते हैं।',
    },
    {
      icon: 'exchange',
      title_en: 'Old Gold Exchange',
      title_hi: 'पुराने सोने का एक्सचेंज',
      text_en: 'Bring your old gold and exchange it for a new design at a fair value.',
      text_hi: 'अपना पुराना सोना लाएँ और सही मूल्य पर नए डिज़ाइन में बदलें।',
    },
    {
      icon: 'trust',
      title_en: 'Trusted Local Shop',
      title_hi: 'भरोसेमंद स्थानीय दुकान',
      text_en: 'Your own jewellery shop at Mahadev Chowk, Tajpur Road — we value every association.',
      text_hi: 'महादेव चौक, ताजपुर रोड पर आपकी अपनी दुकान — हम हर रिश्ते की कद्र करते हैं।',
    },
    {
      icon: 'scale',
      title_en: 'Honest Weight & Purity',
      title_hi: 'सही वज़न, सही शुद्धता',
      text_en: 'Every piece is weighed in front of you, with its purity clearly mentioned.',
      text_hi: 'हर गहना आपके सामने तौला जाता है और उसकी शुद्धता साफ़ बताई जाती है।',
    },
  ],
  site: {
    hero_image: null,
    logo: null,
    google_review_url: '',
    map_query: '',
  },
}

const SAMPLE_NOTE_EN = 'Sample product – the shop owner will replace this with real jewellery.'
const SAMPLE_NOTE_HI = 'नमूना उत्पाद – दुकान के मालिक इसे असली गहनों से बदलेंगे।'

const img = (name) => [{ full: `/samples/${name}.svg`, thumb: `/samples/${name}.svg` }]

// `days` = how many days ago it was added (so a few show the NEW badge).
export const SAMPLE_PRODUCTS = [
  { key: 'bridal-kundan-set', days: 1, category: 'bridal-sets', metal: 'gold', purity: '22K', weight: 52, price: null, price_on_request: true, occasions: ['bridal'], featured: true,
    title: 'Bridal Kundan Necklace Set', title_hi: 'ब्राइडल कुंदन नेकलेस सेट',
    description: 'Heavy bridal necklace with matching earrings and maang tikka.', description_hi: 'मैचिंग झुमके और मांग टीका के साथ भारी ब्राइडल नेकलेस।' },
  { key: 'temple-necklace', days: 2, category: 'necklace-set', metal: 'gold', purity: '22K', weight: 28.5, price: 215000, occasions: ['bridal', 'party'], featured: true,
    title: 'Temple Design Necklace Set', title_hi: 'टेम्पल डिज़ाइन नेकलेस सेट',
    description: 'Traditional temple-work necklace with matching earrings.', description_hi: 'मैचिंग झुमकों के साथ पारंपरिक टेम्पल डिज़ाइन नेकलेस।' },
  { key: 'gold-jhumka', days: 4, category: 'earrings', metal: 'gold', purity: '22K', weight: 7.8, price: 58900, occasions: ['party', 'gift'],
    title: 'Gold Jhumka Earrings', title_hi: 'सोने के झुमके',
    description: 'Classic dome jhumka with fine bead drops.', description_hi: 'बारीक मोतियों वाले पारंपरिक झुमके।' },
  { key: 'diamond-ring', days: 9, category: 'rings', metal: 'diamond', purity: '18K', weight: 3.2, price: null, price_on_request: true, occasions: ['party', 'gift'], featured: true,
    title: 'Diamond Ring for Ladies', title_hi: 'लेडीज़ डायमंड अंगूठी',
    description: 'Elegant diamond ring set in 18K gold.', description_hi: '18 कैरेट सोने में जड़ी सुंदर डायमंड अंगूठी।' },
  { key: 'gold-nath', days: 12, category: 'nose-pin', metal: 'gold', purity: '22K', weight: 2.6, price: 19800, occasions: ['bridal'],
    title: 'Gold Nath with Pearl Drop', title_hi: 'मोती वाली सोने की नथ',
    description: 'Bridal nath with a delicate pearl drop and chain.', description_hi: 'मोती और चेन वाली दुल्हन की नथ।' },
  { key: 'mangalsutra', days: 15, category: 'mangalsutra', metal: 'gold', purity: '22K', weight: 9.5, price: 72500, occasions: ['daily', 'bridal'],
    title: 'Daily Wear Mangalsutra', title_hi: 'रोज़ पहनने वाला मंगलसूत्र',
    description: 'Lightweight mangalsutra with black beads and gold vati.', description_hi: 'काले मोतियों और सोने की वटी वाला हल्का मंगलसूत्र।' },
  { key: 'gold-kangan', days: 18, category: 'bangles', metal: 'gold', purity: '22K', weight: 34, price: null, price_on_request: true, occasions: ['bridal', 'party'],
    title: 'Gold Kangan Pair', title_hi: 'सोने के कंगन (जोड़ी)',
    description: 'Pair of carved gold kangan.', description_hi: 'नक्काशीदार सोने के कंगन की जोड़ी।' },
  { key: 'rope-chain', days: 21, category: 'chains', metal: 'gold', purity: '22K', weight: 12, price: 91000, occasions: ['daily', 'gift'], in_stock: false,
    title: 'Rope Design Gold Chain', title_hi: 'रोप डिज़ाइन सोने की चेन',
    description: 'Rope design chain, suitable for men and women.', description_hi: 'रोप डिज़ाइन चेन, पुरुष और महिला दोनों के लिए।' },
  { key: 'gents-ring', days: 25, category: 'mens-jewellery', metal: 'gold', purity: '22K', weight: 6.4, price: 48500, occasions: ['gift'],
    title: "Gents Gold Ring", title_hi: 'जेंट्स सोने की अंगूठी',
    description: 'Broad gents ring with a flat top.', description_hi: 'चौड़े टॉप वाली जेंट्स अंगूठी।' },
  { key: 'silver-payal', days: 28, category: 'payal', metal: 'silver', purity: '92.5', weight: 48, price: 5400, occasions: ['daily', 'gift'],
    title: 'Silver Payal with Ghungroo (Pair)', title_hi: 'घुंघरू वाली चाँदी की पायल (जोड़ी)',
    description: 'Pure 92.5 silver payal with small ghungroo.', description_hi: 'छोटे घुंघरू वाली 92.5 चाँदी की पायल।' },
  { key: 'kundan-tikka', days: 30, category: 'maang-tikka', metal: 'fancy', purity: null, weight: 14, price: 650, occasions: ['bridal', 'party'],
    title: 'Kundan Maang Tikka (Fancy)', title_hi: 'कुंदन मांग टीका (फैन्सी)',
    description: 'Artificial kundan maang tikka for weddings and functions.', description_hi: 'शादी और फंक्शन के लिए आर्टिफिशियल कुंदन मांग टीका।' },
  { key: 'silver-thali', days: 35, category: 'silver-items', metal: 'silver', purity: '92.5', weight: 210, price: null, price_on_request: true, occasions: ['gift'],
    title: 'Silver Pooja Thali Set', title_hi: 'चाँदी की पूजा थाली सेट',
    description: 'Silver pooja thali with diya – a lovely gift.', description_hi: 'दीया सहित चाँदी की पूजा थाली – एक सुंदर उपहार।' },
]

export function buildSampleProducts(now = Date.now()) {
  return SAMPLE_PRODUCTS.map((p, i) => ({
    id: 1001 + i,
    title: p.title,
    title_hi: p.title_hi,
    description: `${p.description}\n\n${SAMPLE_NOTE_EN}`,
    description_hi: `${p.description_hi}\n\n${SAMPLE_NOTE_HI}`,
    category: p.category,
    metal: p.metal,
    purity: p.purity,
    weight: p.weight,
    price: p.price,
    price_on_request: !!p.price_on_request,
    occasions: p.occasions,
    in_stock: p.in_stock !== false,
    featured: !!p.featured,
    images: img(p.key),
    is_sample: true,
    created_at: new Date(now - p.days * 86400000).toISOString(),
  }))
}

// Placeholder photos alternate landscape / portrait so the masonry layout is visible.
export const gallerySize = (i) => (i % 3 === 1 ? { width: 900, height: 1200 } : { width: 900, height: 675 })

export const SAMPLE_GALLERY = [
  { caption: 'Shop front (sample photo)' },
  { caption: 'Gold display counter (sample photo)' },
  { caption: 'Bridal collection corner (sample photo)' },
  { caption: 'Silver section (sample photo)' },
  { caption: 'Workshop (sample photo)' },
  { caption: 'Customer seating (sample photo)' },
].map((g, i) => ({
  id: i + 1,
  ...gallerySize(i),
  full_url: `/samples/gallery-${i + 1}.svg`,
  thumb_url: `/samples/gallery-${i + 1}.svg`,
  caption: g.caption,
  is_sample: true,
  created_at: new Date(Date.now() - i * 1000).toISOString(),
}))
