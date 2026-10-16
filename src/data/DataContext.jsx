import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { isDemo, loadAll, mergeSettings } from '../lib/api'

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

export function DataProvider({ children }) {
  const [data, setData] = useState(() => readCache() || EMPTY)
  const [status, setStatus] = useState(() => (readCache() ? 'ready' : 'loading'))

  const refresh = useCallback(async () => {
    try {
      const fresh = await loadAll()
      setData(fresh)
      setStatus('ready')
      writeCache(fresh)
    } catch (err) {
      console.error(err)
      setStatus((s) => (s === 'ready' ? s : 'error'))
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  const value = useMemo(() => {
    const categoryBySlug = Object.fromEntries(data.categories.map((c) => [c.slug, c]))
    return { ...data, categoryBySlug, status, refresh, isDemo }
  }, [data, status, refresh])

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}

export const useData = () => useContext(DataContext)
