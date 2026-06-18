import type { Metadata } from 'next'
import './globals.css'
import { cn } from '@/lib/utils'
import { AppProvider } from '@/components/providers/AppProvider'
import { AuthProvider } from '@/components/providers/AuthProvider'
import { SiteHeader } from '@/components/shared/site-header'
import { SiteFooter } from '@/components/shared/site-footer'
import { Toaster } from '@/components/ui/sonner'
import { ShellWrapper } from '@/components/shared/shell-wrapper'

export const metadata: Metadata = {
  title: 'Next.js Boilerplate',
  description: 'A Next.js boilerplate project',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={cn('min-h-screen bg-background font-sans antialiased')}>
        <AuthProvider>
          <AppProvider>
            <ShellWrapper header={<SiteHeader />} footer={<SiteFooter />}>
              <main>{children}</main>
            </ShellWrapper>
            <Toaster />
          </AppProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
