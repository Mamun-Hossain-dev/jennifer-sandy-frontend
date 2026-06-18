'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type SiteLanguage = 'de' | 'en'

interface LanguageState {
  language: SiteLanguage
  setLanguage: (language: SiteLanguage) => void
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    set => ({
      language: 'de',
      setLanguage: language => set({ language }),
    }),
    {
      name: '0211wohnen-language',
    },
  ),
)
