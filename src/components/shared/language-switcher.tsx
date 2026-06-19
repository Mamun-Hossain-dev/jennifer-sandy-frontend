'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { type SiteLanguage, useLanguageStore } from '@/stores/useLanguageStore'

const options: Array<{ value: SiteLanguage; label: string }> = [
  { value: 'de', label: 'Deutsch' },
  { value: 'en', label: 'English' },
]

export function LanguageSwitcher() {
  const language = useLanguageStore(state => state.language)
  const setLanguage = useLanguageStore(state => state.setLanguage)

  return (
    <Select
      value={language}
      onValueChange={value => {
        if (value) {
          setLanguage(value)
        }
      }}
    >
      <SelectTrigger className="h-10 min-w-28 cursor-pointer rounded-xl border-slate-200 bg-slate-50 px-3 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-100 md:min-w-32">
        <SelectValue>
          {value => options.find(option => option.value === value)?.label ?? 'Language'}
        </SelectValue>
      </SelectTrigger>
      <SelectContent sideOffset={12} className="min-w-32">
        {options.map(option => (
          <SelectItem
            key={option.value}
            value={option.value}
            className="cursor-pointer data-[selected]:bg-primary/10 data-[selected]:text-slate-700 data-[selected]:font-semibold data-[highlighted]:bg-primary/15 data-[highlighted]:text-slate-700"
          >
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
