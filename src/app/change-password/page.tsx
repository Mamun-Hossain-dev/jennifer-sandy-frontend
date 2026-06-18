import { Suspense } from 'react'
import { ChangePasswordContent } from '@/components/auth/change-password-content'
import { Skeleton } from '@/components/ui/skeleton'

export default function ChangePasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen w-screen items-center justify-center bg-[#F8FAFC]">
          <div className="w-full max-w-md space-y-4 rounded-xl bg-white p-8 shadow-sm">
            <Skeleton className="mx-auto h-12 w-12 rounded-full" />
            <Skeleton className="mx-auto h-6 w-48" />
            <Skeleton className="h-11 w-full" />
            <Skeleton className="h-11 w-full" />
            <Skeleton className="h-11 w-full" />
          </div>
        </div>
      }
    >
      <ChangePasswordContent />
    </Suspense>
  )
}
