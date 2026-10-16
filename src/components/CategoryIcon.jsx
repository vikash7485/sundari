import { iconFor } from '../data/icons'

export default function CategoryIcon({ slug, className = 'size-8', strokeWidth = 1.3 }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: iconFor(slug) }}
    />
  )
}
