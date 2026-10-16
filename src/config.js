// Fixed shop details. Things the owner edits day-to-day (rates, timings,
// "Why Choose Us", photos) live in the database and are changed from /admin.

export const SHOP = {
  name: { en: 'Sundari Jewellers', hi: 'सुन्दरी ज्वेलर्स' },
  tagline: 'We Value Your Association',
  subline: {
    en: 'Manufacturer & Seller of Fancy Jewellery',
    hi: 'फैन्सी जेवरों के निर्माता एवं विक्रेता',
  },
  proprietor: { en: 'Prop. Dipeshwar Prasad', hi: 'प्रो० दिपेश्वर प्रसाद' },
  address: {
    en: 'Mahadev Chowk, Tajpur Road, Samastipur, Bihar',
    hi: 'महादेव चौक, ताजपुर रोड, समस्तीपुर, बिहार',
  },
  phones: ['8757575209', '8579839113'],
  whatsapp: '918579839113',
  blessing: '१ तूहि निरंकार',
  mapQuery: 'Mahadev Chowk, Tajpur Road, Samastipur, Bihar',
}

// Code shown to customers and used in WhatsApp messages, e.g. SJ-1001
export const productCode = (id) => `SJ-${id}`

export const SITE_URL = (import.meta.env.VITE_SITE_URL || '').replace(/\/$/, '')

// First language a new visitor sees. Their choice is remembered on their phone.
export const DEFAULT_LANG = 'en'

export const METALS = [
  { value: 'gold', en: 'Gold', hi: 'सोना' },
  { value: 'silver', en: 'Silver', hi: 'चाँदी' },
  { value: 'diamond', en: 'Diamond', hi: 'हीरा' },
  { value: 'fancy', en: 'Fancy / Artificial', hi: 'फैन्सी / आर्टिफिशियल' },
]

export const PURITIES = [
  { value: '24K', en: '24K', hi: '24 कैरेट' },
  { value: '22K', en: '22K', hi: '22 कैरेट' },
  { value: '18K', en: '18K', hi: '18 कैरेट' },
  { value: '92.5', en: '92.5 Silver', hi: '92.5 चाँदी' },
]

export const OCCASIONS = [
  { value: 'bridal', en: 'Bridal', hi: 'शादी / दुल्हन' },
  { value: 'daily', en: 'Daily wear', hi: 'रोज़ाना पहनने के लिए' },
  { value: 'party', en: 'Party', hi: 'पार्टी' },
  { value: 'gift', en: 'Gift', hi: 'उपहार' },
]

export const NEW_DAYS = 7
