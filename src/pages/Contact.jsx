import ContactSection from '../components/ContactSection'
import { VisitAndCustom } from './Home'
import { useSeo } from '../lib/seo'

export default function Contact() {
  useSeo({
    title: 'Contact & Directions',
    description:
      'Visit Sundari Jewellers at Mahadev Chowk, Tajpur Road, Samastipur, Bihar. Call 8757575209 / 8579839113 or WhatsApp 8579839113. Open all days.',
  })
  return (
    <>
      <ContactSection headingAs="h1" />
      <VisitAndCustom />
    </>
  )
}
