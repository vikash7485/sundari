import { Link } from 'react-router'
import { EmptyState } from '../components/ProductCard'
import { useLang } from '../i18n/LanguageContext'
import { useSeo } from '../lib/seo'

export default function NotFound() {
  const { t } = useLang()
  useSeo({ title: 'Page not found' })
  return (
    <div className="container-x py-20">
      <EmptyState title="404">
        <Link to="/" className="btn btn-maroon mt-5">
          {t('nav.home')}
        </Link>
      </EmptyState>
    </div>
  )
}
