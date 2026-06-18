'use client'

import { useTheme } from 'next-themes'
import { Toaster as Sonner } from 'sonner'

const Toaster = () => {
  const { theme = 'system' } = useTheme()

  return (
    <Sonner
      richColors
      closeButton
      position="top-right"
      theme={theme as 'light' | 'dark' | 'system'}
    />
  )
}

export { Toaster }
