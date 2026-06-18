'use client'

import type { ReactNode } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { MessageSquare, Settings, Home } from 'lucide-react'
import { LogoutModal } from '@/components/shared/logout-modal'
import { cn } from '@/lib/utils'

const navItems = [
  {
    href: '/',
    label: 'Go Home',
    icon: Home,
  },
  {
    href: '/account/inquiries',
    label: 'My Inquiries',
    icon: MessageSquare,
  },
  {
    href: '/account/settings/profile',
    label: 'Settings',
    icon: Settings,
  },
]

export function AccountShell({ children }: { children: ReactNode }) {
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === '/') return false
    if (href === '/account/inquiries') {
      return pathname.startsWith('/account/inquiries')
    }
    return pathname.startsWith(href)
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="flex w-[220px] min-w-[220px] flex-col border-r border-gray-200 bg-white">
        {/* Logo */}
        <div className="px-6 pb-10 pt-8">
          <Link href="/">
            <span className="text-2xl font-bold text-primary">0211wohnen</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-4">
          {navItems.map(item => {
            const active = isActive(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all',
                  active
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Logout */}
        <div className="px-4 pb-8 pt-4">
          <LogoutModal />
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8">{children}</main>
    </div>
  )
}
