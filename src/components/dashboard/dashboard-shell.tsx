'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect } from 'react'
import type { ComponentType, ReactNode } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'
import {
  LayoutDashboard,
  LogOut,
  Mail,
  MapPin,
  Shield,
  UserRound,
} from 'lucide-react'
import { useQuery } from '@tanstack/react-query'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { fetchMyProfile } from '@/lib/dashboard-api'
import {
  DashboardErrorState,
  DashboardSidebarSkeleton,
} from '@/components/dashboard/dashboard-states'
import type { UserProfile } from '@/types/dashboard'

type NavItem = {
  href: string
  label: string
  icon: ComponentType<{ className?: string }>
}

const navItems: NavItem[] = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  {
    href: '/dashboard/inquiries',
    label: 'Inquiries',
    icon: Mail,
  },
  {
    href: '/dashboard/settings/profile',
    label: 'Profile',
    icon: UserRound,
  },
  {
    href: '/dashboard/settings/password',
    label: 'Security',
    icon: Shield,
  },
]

const routeMeta: Record<string, { title: string; description: string }> = {
  '/dashboard': {
    title: 'Account Overview',
    description:
      'Track your workspace activity, revenue, and incoming inquiries.',
  },
  '/dashboard/settings': {
    title: 'Account Settings',
    description:
      'Keep your profile, contact details, and security settings up to date.',
  },
  '/dashboard/settings/personal-information': {
    title: 'Personal Information',
    description: 'Update your name, contact info, and profile details.',
  },
  '/dashboard/settings/change-password': {
    title: 'Security',
    description: 'Keep your account protected with a strong password.',
  },
}

function getDashboardMeta(pathname: string) {
  const exact = routeMeta[pathname]
  if (exact) return exact

  if (pathname.startsWith('/dashboard/settings')) {
    return routeMeta['/dashboard/settings']
  }

  return routeMeta['/dashboard']
}

function isRemoteImage(src?: string) {
  return !!src && /^https?:\/\//i.test(src)
}

function ProfileAvatar({ src, alt }: { src?: string; alt: string }) {
  const imageSrc = src || '/images/team-1.png'

  if (isRemoteImage(imageSrc)) {
    return (
      <img
        src={imageSrc}
        alt={alt}
        className="h-full w-full object-cover"
        referrerPolicy="no-referrer"
      />
    )
  }

  return (
    <Image
      src={imageSrc}
      alt={alt}
      fill
      className="object-cover"
      sizes="96px"
    />
  )
}

function NavPill({
  href,
  label,
  icon: Icon,
  active,
}: NavItem & { active: boolean }) {
  return (
    <Link
      href={href}
      className={cn(
        'inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all',
        active
          ? 'border-sky-200 bg-sky-50 text-sky-700 shadow-sm'
          : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900',
      )}
    >
      <Icon className="h-4 w-4" />
      {label}
    </Link>
  )
}

export function DashboardShell({ children }: { children: ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const { status, data: session } = useSession()
  const token = session?.user?.accessToken

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['my-profile'],
    queryFn: () => fetchMyProfile(token as string),
    enabled: !!token,
    staleTime: 1000 * 60 * 5,
  })

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/login')
    }
  }, [router, status])

  const meta = getDashboardMeta(pathname)
  const profile: UserProfile | undefined = data?.data
  const displayName =
    [profile?.firstName, profile?.lastName].filter(Boolean).join(' ') ||
    session?.user?.name ||
    'Account'
  const displayRole = profile?.role || session?.user?.role || 'member'

  const shellFallback = (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(22,114,230,0.12),_transparent_35%),linear-gradient(180deg,#f7fbff_0%,#f4f7fb_100%)] px-4 py-4 lg:px-6">
      <div className="mx-auto max-w-[1600px]">
        <div className="grid gap-6 xl:grid-cols-[320px_1fr]">
          <DashboardSidebarSkeleton />
          <div className="space-y-6">
            <div className="rounded-[28px] border border-slate-200/80 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <div className="space-y-2">
                  <div className="h-4 w-24 animate-pulse rounded-full bg-slate-200" />
                  <div className="h-8 w-80 animate-pulse rounded-full bg-slate-200" />
                  <div className="h-4 w-96 animate-pulse rounded-full bg-slate-200" />
                </div>
                <div className="h-10 w-28 animate-pulse rounded-full bg-slate-200" />
              </div>
            </div>
            {children}
          </div>
        </div>
      </div>
    </div>
  )

  if (status === 'loading' || status === 'unauthenticated') {
    return shellFallback
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(22,114,230,0.12),_transparent_35%),linear-gradient(180deg,#f7fbff_0%,#f4f7fb_100%)]">
      <div className="mx-auto flex min-h-screen max-w-[1600px] gap-6 px-4 py-4 lg:px-6 lg:py-6">
        <aside className="hidden xl:flex w-[320px] shrink-0 flex-col overflow-hidden rounded-[32px] border border-slate-200/80 bg-white/90 shadow-[0_20px_80px_rgba(15,23,42,0.08)] backdrop-blur">
          <div className="relative h-40">
            <Image
              src="/images/about-banner.jpg"
              alt="Dashboard cover"
              fill
              priority
              className="object-cover"
              sizes="320px"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-slate-950/60 via-slate-950/20 to-transparent" />
          </div>

          <div className="-mt-10 px-6">
            {isLoading ? (
              <DashboardSidebarSkeleton />
            ) : isError ? (
              <DashboardErrorState
                title="Profile unavailable"
                message={
                  error instanceof Error
                    ? error.message
                    : 'Unable to load your profile.'
                }
                onRetry={() => refetch()}
              />
            ) : (
              <div className="rounded-[28px] border border-slate-200/80 bg-white p-5 shadow-sm">
                <div className="flex items-end gap-4">
                  <div className="relative h-20 w-20 overflow-hidden rounded-3xl border-4 border-white shadow-lg">
                    <ProfileAvatar
                      src={
                        profile?.profilePicture ||
                        session?.user?.image ||
                        undefined
                      }
                      alt={displayName}
                    />
                  </div>
                  <div className="min-w-0 flex-1 pb-1">
                    <p className="text-xs font-semibold uppercase tracking-[0.28em] text-sky-500">
                      Signed in
                    </p>
                    <h2 className="mt-2 truncate text-xl font-bold text-slate-900">
                      {displayName}
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">{displayRole}</p>
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-2xl bg-slate-50 p-3">
                    <div className="flex items-center gap-2 text-slate-500">
                      <Mail className="h-4 w-4" />
                      Email
                    </div>
                    <p className="mt-2 truncate font-medium text-slate-900">
                      {profile?.email || session?.user?.email || 'N/A'}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-3">
                    <div className="flex items-center gap-2 text-slate-500">
                      <MapPin className="h-4 w-4" />
                      Location
                    </div>
                    <p className="mt-2 truncate font-medium text-slate-900">
                      {profile?.location || profile?.streetAddress || 'Not set'}
                    </p>
                  </div>
                </div>

                <nav className="mt-6 space-y-2">
                  {navItems.map(item => {
                    const active =
                      item.href === '/dashboard'
                        ? pathname === item.href
                        : pathname.startsWith(item.href)

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                          'flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all',
                          active
                            ? 'bg-sky-50 text-sky-700 shadow-sm'
                            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900',
                        )}
                      >
                        <item.icon className="h-4 w-4" />
                        {item.label}
                      </Link>
                    )
                  })}
                </nav>

                <div className="mt-6 rounded-3xl bg-gradient-to-br from-sky-500 to-blue-600 p-4 text-white shadow-lg">
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/80">
                    Account
                  </p>
                  <p className="mt-2 text-sm leading-6 text-white/90">
                    Keep your details current so the dashboard stays in sync
                    with your backend profile.
                  </p>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  className="mt-6 w-full justify-start border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                  onClick={() => signOut({ callbackUrl: '/login' })}
                >
                  <LogOut className="h-4 w-4" />
                  Sign out
                </Button>
              </div>
            )}
          </div>
        </aside>

        <main className="flex-1 pb-6">
          <div className="rounded-[32px] border border-slate-200/80 bg-white/90 px-5 py-4 shadow-[0_20px_80px_rgba(15,23,42,0.08)] backdrop-blur">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-500">
                  Account Center
                </p>
                <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                  {meta.title}
                </h1>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                  {meta.description}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="hidden text-right sm:block">
                  <p className="text-sm font-semibold text-slate-900">
                    {displayName}
                  </p>
                  <p className="text-xs text-slate-500">
                    {profile?.email || session?.user?.email}
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  className="border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                  onClick={() => signOut({ callbackUrl: '/login' })}
                >
                  <LogOut className="h-4 w-4" />
                  Sign out
                </Button>
              </div>
            </div>

            <div className="mt-4 flex gap-2 overflow-x-auto pb-1 xl:hidden">
              {navItems.map(item => {
                const active =
                  item.href === '/dashboard'
                    ? pathname === item.href
                    : pathname.startsWith(item.href)

                return (
                  <NavPill
                    key={item.href}
                    href={item.href}
                    label={item.label}
                    icon={item.icon}
                    active={active}
                  />
                )
              })}
              <Button
                type="button"
                variant="ghost"
                className="shrink-0 rounded-full border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                onClick={() => signOut({ callbackUrl: '/login' })}
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>

          <div className="pt-6">{children}</div>
        </main>
      </div>
    </div>
  )
}
