import Image from 'next/image'
import Link from 'next/link'
import { TranslatedText } from '@/components/shared/translated-text'

const tenantLinks = [
  { label: 'Home', href: '/' },
  { label: 'Find apartments', href: '/apartments' },
  { label: 'Magazine', href: '/blogs' },
  { label: 'FAQs', href: '/faqs' },
  { label: 'Contact Us', href: '/contact' },
]

const landlordLinks = [
  { label: 'Landlord service', href: '/landlords' },
  { label: 'List your apartment', href: '/landlords' },
  { label: 'About us', href: '/about' },
]

const legalLinks = [
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Terms & Conditions', href: '/terms' },
  { label: 'Account', href: '/account' },
]

export function SiteFooter() {
  return (
    <footer className="relative pt-28 bg-[#E6F2FD]">
      <div className="container relative mx-auto px-6 py-12 lg:px-10">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4 md:items-center md:pr-[260px]">
          <div>
            <h4 className="font-serif text-[28px] font-bold text-[#1672E6]">
              0211wohnen
            </h4>
            <p className="mt-3 text-sm leading-6 text-slate-500">
              <TranslatedText
                text="Your trusted partner for furnished temporary accommodation in Düsseldorf."
                cacheKey="footer:tagline"
              />
            </p>
            <div className="mt-4 flex items-center gap-3">
              <a
                href="#"
                aria-label="Instagram"
                className="flex h-8 w-8 items-center justify-center rounded bg-[#5AA2EC] text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#3f92e7] hover:shadow-md active:translate-y-px active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1672E6]/30"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect x="3" y="3" width="18" height="18" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle
                    cx="17.2"
                    cy="6.8"
                    r="1"
                    fill="currentColor"
                    stroke="none"
                  />
                </svg>
              </a>
              <a
                href="#"
                aria-label="LinkedIn"
                className="flex h-8 w-8 items-center justify-center rounded bg-[#5AA2EC] text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#3f92e7] hover:shadow-md active:translate-y-px active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1672E6]/30"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4"
                  fill="currentColor"
                >
                  <path d="M6.94 8.5A1.44 1.44 0 1 1 6.93 5.6a1.44 1.44 0 0 1 0 2.9ZM5.75 9.75h2.37v8.65H5.75V9.75Zm3.86 0h2.27v1.18h.03c.32-.6 1.1-1.24 2.27-1.24 2.43 0 2.88 1.6 2.88 3.68v5.03h-2.37V14.1c0-1.03-.02-2.35-1.43-2.35-1.44 0-1.66 1.12-1.66 2.27v4.38H9.61V9.75Z" />
                </svg>
              </a>
            </div>
          </div>

          <div>
            <h5 className="text-sm font-semibold text-slate-700">
              <TranslatedText text="For tenants" cacheKey="footer:tenants" />
            </h5>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              {tenantLinks.map(link => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="inline-flex transition-colors duration-200 hover:text-[#1672E6] hover:underline underline-offset-4"
                  >
                    <TranslatedText
                      text={link.label}
                      cacheKey={`footer:tenant:${link.label}`}
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h5 className="text-sm font-semibold text-slate-700">
              <TranslatedText
                text="For landlords"
                cacheKey="footer:landlords"
              />
            </h5>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              {landlordLinks.map(link => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="inline-flex transition-colors duration-200 hover:text-[#1672E6] hover:underline underline-offset-4"
                  >
                    <TranslatedText
                      text={link.label}
                      cacheKey={`footer:landlord:${link.label}`}
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h5 className="text-sm font-semibold text-slate-700">
              <TranslatedText text="Legal" cacheKey="footer:legal" />
            </h5>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              {legalLinks.map(link => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="inline-flex transition-colors duration-200 hover:text-[#1672E6] hover:underline underline-offset-4"
                  >
                    <TranslatedText
                      text={link.label}
                      cacheKey={`footer:legal:${link.label}`}
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pointer-events-none absolute -top-[118px] right-0 hidden md:block">
          <Image
            src="/images/phone.png"
            alt="Mobile preview"
            width={220}
            height={390}
            className="h-[430px] w-auto object-contain"
          />
        </div>

        <div className="mt-8 border-t border-[#c5ddf7] pt-3 text-xs text-slate-500">
          <TranslatedText
            text="© 2026 Dusseldorf. All rights reserved."
            cacheKey="footer:copyright"
          />
        </div>
      </div>
    </footer>
  )
}
