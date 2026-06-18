import { Suspense } from 'react'
import { VerifyOtpContent } from '@/components/auth/verify-otp-content'
import { Skeleton } from '@/components/ui/skeleton'

export default function VerifyOtpPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen w-screen items-center justify-center bg-[#F8FAFC]">
          <div className="w-full max-w-md space-y-4 rounded-xl bg-white p-8 shadow-sm">
            <Skeleton className="mx-auto h-12 w-12 rounded-full" />
            <Skeleton className="mx-auto h-6 w-44" />
            <div className="grid grid-cols-6 gap-2">
              {Array.from({ length: 6 }).map((_, index) => (
                <Skeleton key={index} className="h-11 rounded-lg" />
              ))}
            </div>
            <Skeleton className="h-11 w-full" />
          </div>
        </div>
      }
    >
      <VerifyOtpContent />
    </Suspense>
  )
}
