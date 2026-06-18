'use client'

import { useEffect } from 'react'
import { useLanguageStore } from '@/stores/useLanguageStore'

export function LanguageSync() {
  const language = useLanguageStore(state => state.language)

  useEffect(() => {
    document.documentElement.lang = language
  }, [language])

  return null
}
