'use client'

import { type SiteLanguage } from '@/stores/useLanguageStore'
import { useTranslatedText } from '@/hooks/use-translated-text'

export function TranslatedText({
  text,
  sourceLang = 'en',
  cacheKey,
}: {
  text: string
  sourceLang?: SiteLanguage
  cacheKey?: string
}) {
  return <>{useTranslatedText(text, sourceLang, { cacheKey })}</>
}
