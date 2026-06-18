'use client'

import type { ReactNode } from 'react'
import { usePathname } from 'next/navigation'

export function ShellWrapper({
  header,
  footer,
  children,
}: {
  header: ReactNode
  footer: ReactNode
  children: ReactNode
}) {
  const pathname = usePathname()
  const isAccountRoute = pathname.startsWith('/account')

  return (
    <>
      {!isAccountRoute && header}
      {children}
      {!isAccountRoute && footer}
    </>
  )
}
