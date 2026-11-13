import { useEffect, useState } from 'react'
import Icon from './Icon'
import { useLang } from '../i18n/LanguageContext'

// "Install our app" popup for visitors.
// - Android / Chrome / Edge: uses the browser's own install dialog.
// - iPhone / iPad: Apple has no install button for websites, so we show the
//   two Safari steps (Share → Add to Home Screen) instead.
// Never shown inside the installed app; after "Not now" it waits a few days.
// Add ?install=1 to any page URL to see the popup right away (for testing).

const KEY = 'sj-install-dismissed'
const SNOOZE_DAYS = 3
const DELAY_MS = 5000

const isStandalone = () =>
  window.matchMedia?.('(display-mode: standalone)').matches || window.navigator.standalone === true

const isIos = () =>
  /iphone|ipad|ipod/i.test(navigator.userAgent) ||
  (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)

function snoozed() {
  try {
    const at = Number(localStorage.getItem(KEY))
    return at && Date.now() - at < SNOOZE_DAYS * 864e5
  } catch {
    return false
  }
}

function snooze() {
  try {
    localStorage.setItem(KEY, String(Date.now()))
  } catch {
    /* private mode – fine */
  }
}

export default function InstallPrompt() {
  const { t } = useLang()
  const [deferred, setDeferred] = useState(null) // Chrome's saved install event
  const [mode, setMode] = useState(null) // null | 'native' | 'ios'

  useEffect(() => {
    if (isStandalone()) return
    const forced = new URLSearchParams(location.search).has('install')
    if (!forced && snoozed()) return

    let timer
    const show = (m) => {
      clearTimeout(timer)
      timer = setTimeout(() => setMode(m), forced ? 300 : DELAY_MS)
    }

    const onPrompt = (e) => {
      e.preventDefault() // keep Chrome's mini-bar away; we show our own popup
      setDeferred(e)
      show('native')
    }
    const onInstalled = () => {
      setMode(null)
      snooze()
    }
    window.addEventListener('beforeinstallprompt', onPrompt)
    window.addEventListener('appinstalled', onInstalled)

    if (isIos()) show('ios')
    else if (forced) show('native')

    return () => {
      clearTimeout(timer)
      window.removeEventListener('beforeinstallprompt', onPrompt)
      window.removeEventListener('appinstalled', onInstalled)
    }
  }, [])

  useEffect(() => {
    if (!mode) return
    const onKey = (e) => e.key === 'Escape' && dismiss()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  if (!mode) return null

  function dismiss() {
    snooze()
    setMode(null)
  }

  async function install() {
    if (!deferred) return dismiss()
    deferred.prompt()
    const { outcome } = await deferred.userChoice.catch(() => ({}))
    setDeferred(null)
    if (outcome !== 'accepted') snooze()
    setMode(null)
  }

  const [before, after] = t('install.iosStep1').split('{icon}')

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-maroon-deep/45 p-3 animate-fade-in sm:items-center"
      style={{ paddingBottom: 'calc(0.75rem + env(safe-area-inset-bottom))' }}
      onClick={dismiss}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="install-title"
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-sm overflow-hidden rounded-3xl bg-cream text-ink shadow-lift ring-1 ring-gold/40 animate-sheet-up"
      >
        <button
          type="button"
          onClick={dismiss}
          aria-label={t('install.close')}
          className="absolute right-3 top-3 grid size-9 place-items-center rounded-full text-white/80 hover:bg-white/10 hover:text-white"
        >
          <Icon name="x" className="size-5" />
        </button>

        <div className="flex items-center gap-4 bg-linear-to-br from-maroon to-maroon-deep px-5 pb-5 pt-6 text-white">
          <img src="/icon-192.png" alt="" className="size-16 shrink-0 rounded-2xl shadow-gold" />
          <div className="pr-6">
            <h2 id="install-title" className="font-display text-lg leading-snug">
              {t('install.title')}
            </h2>
            <p className="mt-0.5 text-xs text-gold-light">{location.host}</p>
          </div>
        </div>

        <div className="px-5 pb-5 pt-4">
          <p className="text-sm leading-relaxed text-ink-soft">{t('install.text')}</p>

          {mode === 'ios' ? (
            <>
              <ol className="mt-4 space-y-3 text-sm">
                <li className="flex items-center gap-3">
                  <span className="grid size-7 shrink-0 place-items-center rounded-full bg-maroon text-xs font-semibold text-white">1</span>
                  <span>
                    {before}
                    <Icon name="share" className="mx-1 inline size-5 -translate-y-0.5 text-[#0A7AFF]" />
                    {after}
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="grid size-7 shrink-0 place-items-center rounded-full bg-maroon text-xs font-semibold text-white">2</span>
                  <span>
                    {t('install.iosStep2')} <Icon name="plus" className="ml-1 inline size-4 -translate-y-0.5" />
                  </span>
                </li>
              </ol>
              <button
                type="button"
                onClick={dismiss}
                className="mt-5 w-full rounded-full bg-maroon py-3 font-medium text-white hover:bg-maroon-dark"
              >
                {t('install.gotIt')}
              </button>
            </>
          ) : (
            <div className="mt-5 flex gap-3">
              <button
                type="button"
                onClick={dismiss}
                className="flex-1 rounded-full py-3 text-sm font-medium text-ink-soft ring-1 ring-ink/15 hover:bg-ivory"
              >
                {t('install.later')}
              </button>
              <button
                type="button"
                onClick={install}
                className="flex flex-[1.4] items-center justify-center gap-2 rounded-full bg-maroon py-3 text-sm font-medium text-white shadow-soft hover:bg-maroon-dark"
              >
                <Icon name="download" className="size-4" />
                {t('install.button')}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
