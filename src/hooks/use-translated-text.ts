'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  type SiteLanguage,
  useLanguageStore,
} from '@/stores/useLanguageStore'

interface TranslateOptions {
  cacheKey?: string
}

const storagePrefix = '0211wohnen-translation-v2'
const memoryCache = new Map<string, string>()

function getClientCacheKey(
  text: string,
  sourceLang: SiteLanguage,
  targetLang: SiteLanguage,
  cacheKey?: string,
) {
  return [storagePrefix, sourceLang, targetLang, cacheKey || text].join(':')
}

export function useTranslatedText(
  text: string,
  sourceLang: SiteLanguage,
  options: TranslateOptions = {},
) {
  const language = useLanguageStore(state => state.language)
  const cacheKey = useMemo(
    () => getClientCacheKey(text, sourceLang, language, options.cacheKey),
    [language, options.cacheKey, sourceLang, text],
  )
  const [translatedText, setTranslatedText] = useState(text)

  useEffect(() => {
    if (!text || sourceLang === language) {
      setTranslatedText(text)
      return
    }

    const cached = memoryCache.get(cacheKey)

    if (cached) {
      setTranslatedText(cached)
      return
    }

    const stored =
      typeof window === 'undefined' ? null : window.localStorage.getItem(cacheKey)

    if (stored) {
      memoryCache.set(cacheKey, stored)
      setTranslatedText(stored)
      return
    }

    let cancelled = false
    setTranslatedText(text)

    async function translate() {
      try {
        const response = await fetch('/api/translate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            text,
            sourceLang,
            targetLang: language,
            cacheKey: options.cacheKey,
          }),
        })
        const data = (await response.json()) as { translatedText?: string }
        const nextText = data.translatedText || text

        if (cancelled) return

        if (nextText !== text) {
          memoryCache.set(cacheKey, nextText)
          window.localStorage.setItem(cacheKey, nextText)
        }
        setTranslatedText(nextText)
      } catch {
        if (!cancelled) setTranslatedText(text)
      }
    }

    translate()

    return () => {
      cancelled = true
    }
  }, [cacheKey, language, options.cacheKey, sourceLang, text])

  return translatedText
}
