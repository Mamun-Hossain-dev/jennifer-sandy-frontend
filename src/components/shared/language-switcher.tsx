'use client'

import { type SiteLanguage, useLanguageStore } from '@/stores/useLanguageStore'

const options: SiteLanguage[] = ['de', 'en']

export function LanguageSwitcher() {
  const language = useLanguageStore(state => state.language)
  const setLanguage = useLanguageStore(state => state.setLanguage)

  return (
    <div className="inline-flex rounded-xl border border-slate-200 bg-slate-50 p-1 shadow-sm">
      {options.map(option => {
        const isActive = language === option

        return (
          <button
            key={option}
            type="button"
            onClick={() => setLanguage(option)}
            className={`rounded-lg px-2.5 py-1.5 text-xs font-bold uppercase leading-none transition-colors ${
              isActive
                ? 'bg-[#1672E6] text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
            aria-pressed={isActive}
          >
            {option}
          </button>
        )
      })}
    </div>
  )
}
