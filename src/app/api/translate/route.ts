import { NextResponse } from 'next/server'

type Language = 'de' | 'en'

interface TranslateRequest {
  text?: string
  sourceLang?: Language
  targetLang?: Language
  cacheKey?: string
}

const translationCache = new Map<string, string>()

function getCacheKey({
  text,
  sourceLang,
  targetLang,
  cacheKey,
}: Required<TranslateRequest>) {
  return ['v2', sourceLang, targetLang, cacheKey || text].join(':')
}

async function translateWithCloudApi(
  text: string,
  sourceLang: Language,
  targetLang: Language,
  apiKey: string,
) {
  const response = await fetch(
    `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        q: text,
        source: sourceLang,
        target: targetLang,
        format: 'text',
      }),
    },
  )

  if (!response.ok) return text

  const data = (await response.json()) as {
    data?: {
      translations?: Array<{
        translatedText?: string
      }>
    }
  }

  return data.data?.translations?.[0]?.translatedText || text
}

async function translateWithFreeEndpoint(
  text: string,
  sourceLang: Language,
  targetLang: Language,
) {
  const params = new URLSearchParams({
    client: 'gtx',
    sl: sourceLang,
    tl: targetLang,
    dt: 't',
    q: text,
  })
  const response = await fetch(
    `https://translate.googleapis.com/translate_a/single?${params.toString()}`,
  )

  if (!response.ok) return text

  const data = (await response.json()) as Array<unknown>
  const segments = Array.isArray(data[0]) ? data[0] : []
  const translatedText = segments
    .map(segment => (Array.isArray(segment) ? segment[0] : ''))
    .filter((segment): segment is string => typeof segment === 'string')
    .join('')

  return translatedText || text
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as TranslateRequest
  const text = body.text?.trim()
  const sourceLang = body.sourceLang
  const targetLang = body.targetLang

  if (!text || !sourceLang || !targetLang) {
    return NextResponse.json({ translatedText: body.text || '' })
  }

  if (sourceLang === targetLang) {
    return NextResponse.json({ translatedText: text })
  }

  const key = getCacheKey({
    text,
    sourceLang,
    targetLang,
    cacheKey: body.cacheKey || text,
  })
  const cached = translationCache.get(key)

  if (cached) {
    return NextResponse.json({ translatedText: cached })
  }

  const apiKey =
    process.env.GOOGLE_TRANSLATE_API_KEY ||
    process.env.GOOGLE_CLOUD_TRANSLATE_API_KEY

  try {
    const translatedText = apiKey
      ? await translateWithCloudApi(text, sourceLang, targetLang, apiKey)
      : await translateWithFreeEndpoint(text, sourceLang, targetLang)

    if (translatedText !== text) {
      translationCache.set(key, translatedText)
    }

    return NextResponse.json({ translatedText })
  } catch {
    return NextResponse.json({ translatedText: text })
  }
}
