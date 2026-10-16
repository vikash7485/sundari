import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { STRINGS } from './strings'
import { DEFAULT_LANG } from '../config'

const LangContext = createContext(null)
const STORAGE_KEY = 'sj-lang'

const lookup = (dict, key) => key.split('.').reduce((o, k) => (o == null ? o : o[k]), dict)

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved === 'hi' || saved === 'en' ? saved : DEFAULT_LANG
    } catch {
      return DEFAULT_LANG
    }
  })

  useEffect(() => {
    document.documentElement.lang = lang
    try {
      localStorage.setItem(STORAGE_KEY, lang)
    } catch {
      /* private mode – fine */
    }
  }, [lang])

  const value = useMemo(() => {
    const t = (key, vars) => {
      let s = lookup(STRINGS[lang], key) ?? lookup(STRINGS.en, key) ?? key
      if (vars) for (const [k, v] of Object.entries(vars)) s = s.replaceAll(`{${k}}`, v)
      return s
    }
    // Field from a DB row: pick(product, 'title') -> title_hi in Hindi when present
    const pick = (obj, base) => {
      if (!obj) return ''
      if (lang === 'hi' && obj[`${base}_hi`]) return obj[`${base}_hi`]
      return obj[`${base}_en`] ?? obj[base] ?? ''
    }
    // { en, hi } objects from config
    const L = (o) => (o && typeof o === 'object' ? o[lang] ?? o.en : o)
    return {
      lang,
      setLang,
      toggle: () => setLang((l) => (l === 'en' ? 'hi' : 'en')),
      t,
      pick,
      L,
    }
  }, [lang])

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>
}

export const useLang = () => useContext(LangContext)
