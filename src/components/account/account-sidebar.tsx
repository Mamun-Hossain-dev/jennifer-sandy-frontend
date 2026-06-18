'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { MessageSquare, Settings, LogOut } from 'lucide-react'
import { signOut } from 'next-auth/react'
import { cn } from '@/lib/utils'
import { TranslatedText } from '@/components/shared/translated-text'

const navItems = [
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

export function AccountSidebar() {
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === '/account/inquiries') {
      return pathname.startsWith('/account/inquiries')
    }
    return pathname.startsWith(href)
  }

  return (
    <aside className="flex h-full w-[220px] min-w-[220px] flex-col bg-white shadow-sm">
      {/* Logo */}
      <div className="px-6 pb-10 pt-8">
        <Link href="/account/inquiries">
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
              <TranslatedText
                text={item.label}
                cacheKey={`account-sidebar:${item.label}`}
              />
            </Link>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="px-4 pb-8 pt-4">
        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-destructive transition-all hover:bg-destructive/10"
        >
          <LogOut className="h-5 w-5" />
          <TranslatedText
            text="Log out"
            cacheKey="account-sidebar:logout"
          />
        </button>
      </div>
    </aside>
  )
}
