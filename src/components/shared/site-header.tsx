'use client'

import { Menu, X, User } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useSession, getSession } from 'next-auth/react'
import { PROFILE_UPDATED_EVENT } from '@/components/shared/profile-update-broadcast'
import { LanguageSwitcher } from '@/components/shared/language-switcher'
import { useTranslatedText } from '@/hooks/use-translated-text'

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Apartments', href: '/apartments' },
  { label: 'Landlords', href: '/landlords' },
  { label: 'About Us', href: '/about' },
  { label: 'Blogs', href: '/blogs' },
  { label: 'FAQs', href: '/faqs' },
  { label: 'Contact Us', href: '/contact' },
]

function HeaderText({ text }: { text: string }) {
  return <>{useTranslatedText(text, 'en', { cacheKey: `ui:${text}` })}</>
}

export function SiteHeader() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  // Re-fetch session when profile picture is updated
  useEffect(() => {
    const handler = () => {
      getSession()
    }
    window.addEventListener(PROFILE_UPDATED_EVENT, handler)
    return () => window.removeEventListener(PROFILE_UPDATED_EVENT, handler)
  }, [])

  const signInLabel = useTranslatedText('Sign in', 'en', {
    cacheKey: 'ui:Sign in',
  })
  const accountLabel = useTranslatedText('Account', 'en', {
    cacheKey: 'ui:Account',
  })

  const renderNavLink = (link: (typeof navLinks)[number], mobile = false) => {
    const isActive =
      pathname === link.href ||
      (link.href === '/blogs' && pathname.startsWith('/blogs/')) ||
      (link.href === '/apartments' && pathname.startsWith('/apartments/'))

    const baseClassName = mobile
      ? `block rounded-xl px-4 py-3 text-base font-semibold transition-colors ${
          isActive
            ? 'bg-[#1672E6]/10 text-[#1672E6]'
            : 'text-slate-700 hover:bg-slate-100 hover:text-slate-950'
        }`
      : `group relative border-b-2 pb-1 text-center align-middle transition-all duration-200 ${
          isActive
            ? 'border-primary text-primary'
            : 'border-transparent text-slate-600 hover:border-primary/60 hover:text-primary'
        }`

    if (mobile) {
      return (
        <Link
          key={link.label}
          href={link.href}
          className={baseClassName}
          onClick={() => setMobileMenuOpen(false)}
        >
          <HeaderText text={link.label} />
        </Link>
      )
    }

    return (
      <Link key={link.label} href={link.href} className={baseClassName}>
        <HeaderText text={link.label} />
        <span className="absolute inset-x-0 -bottom-[2px] h-0.5 origin-left scale-x-0 bg-primary transition-transform duration-200 group-hover:scale-x-100" />
      </Link>
    )
  }

  const isLoggedIn = !!session?.user

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white backdrop-blur supports-[backdrop-filter]:bg-white/95">
      <div className="container mx-auto flex h-20 items-center justify-between px-4 sm:px-6 lg:px-10">
        <Link
          href="/"
          className="font-serif text-[28px] font-bold leading-[150%] text-primary transition-all duration-200 hover:opacity-90 active:scale-[0.98] sm:text-[32px]"
        >
          o211wohnen
        </Link>

        <nav className="hidden items-center gap-8 font-manrope text-[16px] font-semibold leading-[150%] text-slate-600 md:flex">
          {navLinks.map(link => renderNavLink(link))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <LanguageSwitcher />
          {isLoggedIn ? (
            <Link
              href="/account/inquiries"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border-2 border-primary/20 bg-white shadow-sm transition-all duration-200 hover:border-primary/50 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35"
            >
              {session?.user?.image ? (
                <Image
                  src={session.user.image}
                  alt="Profile"
                  width={36}
                  height={36}
                  className="h-9 w-9 rounded-full object-cover"
                  priority
                />
              ) : (
                <User className="h-5 w-5 text-primary" />
              )}
            </Link>
          ) : (
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-xl bg-primary px-8 py-3 text-base font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-lg active:translate-y-px active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35"
            >
              {signInLabel}
            </Link>
          )}
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <LanguageSwitcher />
          {isLoggedIn ? (
            <Link
              href="/account/inquiries"
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm transition-colors hover:bg-slate-50"
            >
              {session?.user?.image ? (
                <Image
                  src={session.user.image}
                  alt="Profile"
                  width={28}
                  height={28}
                  className="h-7 w-7 rounded-full object-cover"
                />
              ) : (
                <User className="h-5 w-5 text-primary" />
              )}
            </Link>
          ) : (
            <Link
              href="/login"
              className="inline-flex h-10 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-50"
            >
              {signInLabel}
            </Link>
          )}

          <button
            type="button"
            aria-label={
              mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'
            }
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen(open => !open)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm transition-colors hover:bg-slate-50"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 z-40 md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="absolute left-0 right-0 top-full z-50 border-b border-slate-200 bg-white shadow-lg md:hidden">
            <nav className="flex flex-col divide-y divide-slate-100">
              {navLinks.map(link => renderNavLink(link, true))}
            </nav>
            <div className="border-t border-slate-100 p-4">
              {isLoggedIn ? (
                <Link
                  href="/account/inquiries"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary/90"
                >
                  <User className="h-4 w-4" />
                  {accountLabel}
                </Link>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex w-full items-center justify-center rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary/90"
                >
                  {signInLabel}
                </Link>
              )}
            </div>
          </div>
        </>
      )}
    </header>
  )
}
