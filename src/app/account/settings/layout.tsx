'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { User, Key } from 'lucide-react'
import { cn } from '@/lib/utils'
import { TranslatedText } from '@/components/shared/translated-text'

const settingsNavItems = [
  {
    href: '/account/settings/profile',
    label: 'Profile',
    icon: User,
  },
  {
    href: '/account/settings/password',
    label: 'Password',
    icon: Key,
  },
]

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold leading-[120%] text-foreground">
          <TranslatedText text="Settings" cacheKey="settings:title" />
        </h1>
        <p className="mt-2 text-base font-normal leading-[150%] text-muted-foreground">
          <TranslatedText
            text="Manage your preferences"
            cacheKey="settings:subtitle"
          />
        </p>
      </div>

      {/* Sub-navigation tabs */}
      <div className="mb-6 flex items-center gap-4 border-b border-border pb-2">
        {settingsNavItems.map(item => {
          const active = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'inline-flex items-center gap-2 border-b-2 px-1 pb-3 text-sm font-medium transition-all',
                active
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground',
              )}
            >
              <item.icon className="h-4 w-4" />
              <TranslatedText
                text={item.label}
                cacheKey={`settings:tab:${item.label}`}
              />
            </Link>
          )
        })}
      </div>

      {children}
    </div>
  )
}
