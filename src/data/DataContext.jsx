import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { DATA_PARTS, isDemo, loadAll, mergeSettings } from '../lib/api'

const DataContext = createContext(null)
const CACHE_KEY = 'sj-cache-v1'

// Show the last copy instantly on repeat visits (slow mobile data), then refresh.
function readCache() {
  if (isDemo) return null
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function writeCache(data) {
  if (isDemo) return
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(data))
  } catch {
    /* storage full or blocked – fine */
  }
}

const EMPTY = { categories: [], products: [], settings: mergeSettings({}), gallery: [] }

/**
 * status:
 *  'loading' – still fetching (a cached copy may already be showing)
 *  'ready'   – every part has come from the server during this visit
 *  'error'   – the last attempt failed for some part; old/partial data (or nothing) is showing
 */
export function DataProvider({ children }) {
  const [data, setData] = useState(() => ({ ...EMPTY, ...readCache() }))
  const dataRef = useRef(data)
  const [fresh, setFresh] = useState(() => new Set()) // parts loaded from the server this visit
  const [loading, setLoading] = useState(true)
  const latest = useRef(0)

  const refresh = useCallback(async () => {
    const id = ++latest.current
    setLoading(true)
    let result
    try {
      result = await loadAll()
    } catch (err) {
      console.error(err)
      result = { failed: DATA_PARTS }
    }
    if (id !== latest.current) return // a newer refresh has started; let it win
    const ok = DATA_PARTS.filter((k) => !result.failed.includes(k))
    if (ok.length) {
      // Keep the previous copy of any part that failed instead of blanking it.
      const next = { ...dataRef.current }
      for (const k of ok) next[k] = result[k]
      dataRef.current = next
      setData(next)
      writeCache(next)
      setFresh((prev) => new Set([...prev, ...ok]))
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  const complete = DATA_PARTS.every((k) => fresh.has(k))
  const status = complete ? 'ready' : loading ? 'loading' : 'error'

  // Try again by itself when the phone gets internet back or the visitor returns to the tab.
  useEffect(() => {
    if (status !== 'error') return
    const retry = () => document.visibilityState === 'visible' && refresh()
    window.addEventListener('online', retry)
    document.addEventListener('visibilitychange', retry)
    return () => {
      window.removeEventListener('online', retry)
      document.removeEventListener('visibilitychange', retry)
    }
  }, [status, refresh])

  const value = useMemo(() => {
    const categoryBySlug = Object.fromEntries(data.categories.map((c) => [c.slug, c]))
    // Parts that could not be loaded this visit (what's showing for them is an old copy, or empty)
    const failed = status === 'error' ? DATA_PARTS.filter((k) => !fresh.has(k)) : []
    return { ...data, categoryBySlug, status, failed, refresh, isDemo }
  }, [data, status, fresh, refresh])

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}

export const useData = () => useContext(DataContext)
