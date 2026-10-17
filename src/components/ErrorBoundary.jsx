import { Component } from 'react'
import { SHOP } from '../config'
import { telLink, waLink } from '../lib/contact'

// A new deploy renames the JS files; a tab opened before it then fails to load
// the admin (or another lazy part). Reloading once fetches the new files.
const RELOAD_KEY = 'sj-reloaded-at'

export const isChunkError = (err) =>
  /dynamically imported module|Importing a module script failed|error loading dynamically imported|Unable to preload CSS/i.test(String(err?.message || err))

/** Reloads the page unless it already did so in the last 10 s (avoids a reload loop). */
export function reloadOnce() {
  try {
    if (Date.now() - Number(sessionStorage.getItem(RELOAD_KEY) || 0) < 10000) return false
    sessionStorage.setItem(RELOAD_KEY, String(Date.now()))
  } catch {
    return false
  }
  window.location.reload()
  return true
}

export default class ErrorBoundary extends Component {
  state = { error: null }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error) {
    console.error(error)
    if (isChunkError(error)) reloadOnce()
  }

  render() {
    if (!this.state.error) return this.props.children
    return (
      <div className="grid min-h-screen place-items-center bg-cream px-4 py-10 text-center">
        <div className="card max-w-sm p-6">
          <p className="font-display text-xl text-maroon">Something went wrong</p>
          <p className="font-deva text-ink-soft">कुछ गड़बड़ हो गई</p>
          <p className="mt-3 text-sm text-ink-soft">Please reload the page. · कृपया पेज दोबारा लोड करें।</p>
          <button type="button" onClick={() => window.location.reload()} className="btn btn-maroon mt-5 w-full">
            Reload page · पेज रीलोड करें
          </button>
          <div className="mt-3 flex gap-2">
            <a href={waLink()} target="_blank" rel="noopener" className="btn btn-wa flex-1">
              WhatsApp
            </a>
            <a href={telLink(SHOP.phones[0])} className="btn btn-outline flex-1">
              Call
            </a>
          </div>
        </div>
      </div>
    )
  }
}
