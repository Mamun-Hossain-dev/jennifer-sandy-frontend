'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'

import { ImageGallery } from '@/components/account/image-gallery'
import { fetchRecentInquiries } from '@/lib/dashboard-api'
import type { InquiryRecord } from '@/types/dashboard'
import { Skeleton } from '@/components/ui/skeleton'

export function InquiryDetailContent() {
  const params = useParams()
  const inquiryId = params?.id as string
  const { data: session } = useSession()
  const token = session?.user?.accessToken
  const { data, isLoading } = useQuery({
    queryKey: ['account-inquiries'],
    queryFn: () => fetchRecentInquiries(token as string, { limit: 100 }),
    enabled: !!token,
  })

  const allInquiries: InquiryRecord[] = data?.data?.data || []
  const inquiry = allInquiries.find((i: InquiryRecord) => i._id === inquiryId)

  const onOfficeData =
    typeof inquiry?.onOfficeId === 'object'
      ? (inquiry.onOfficeId as Record<string, unknown>)
      : null

  const images = onOfficeData
    ? [
        {
          url: '/images/no-image.png',
          alt: (onOfficeData.objekttitel as string) || 'Property',
        },
      ]
    : [{ url: '/images/no-image.png', alt: 'No image' }]

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-5 w-36" />
        <Skeleton className="h-[320px] w-full rounded-lg" />
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <Skeleton className="h-7 w-48" />
          <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-20 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!inquiry) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-lg font-semibold text-[#343A40]">
          Inquiry not found
        </p>
        <Link
          href="/account/inquiries"
          className="mt-4 text-sm font-medium text-[#2563EB] hover:underline"
        >
          Back to inquiries
        </Link>
      </div>
    )
  }

  return (
    <div>
      <Link
        href="/account/inquiries"
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-[#2563EB] hover:underline"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Inquiries
      </Link>

      <div className="mb-6 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="p-6">
          <ImageGallery images={images.slice(1)} mainImage={images[0]?.url} />
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="p-6">
          <h2 className="text-xl font-bold text-[#343A40]">
            {(onOfficeData?.objekttitel as string) || 'Property Details'}
          </h2>

          <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
            <div className="rounded-lg bg-gray-50 p-4">
              <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                Area
              </p>
              <p className="mt-1 text-sm font-medium text-gray-900">
                {(onOfficeData?.flaeche as string) || 'N/A'} m&sup2;
              </p>
            </div>
            <div className="rounded-lg bg-gray-50 p-4">
              <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                Rooms
              </p>
              <p className="mt-1 text-sm font-medium text-gray-900">
                {(onOfficeData?.anzahlZimmer as string) || 'N/A'}
              </p>
            </div>
            <div className="rounded-lg bg-gray-50 p-4">
              <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                Status
              </p>
              <p className="mt-1 text-sm font-medium text-gray-900">
                {inquiry.status || 'Pending'}
              </p>
            </div>
            <div className="rounded-lg bg-gray-50 p-4">
              <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                Email
              </p>
              <p className="mt-1 text-sm font-medium text-gray-900">
                {inquiry.email || 'N/A'}
              </p>
            </div>
          </div>

          {inquiry.message && (
            <div className="mt-6">
              <h3 className="text-base font-semibold text-[#343A40]">
                Message
              </h3>
              <p className="mt-2 text-base leading-relaxed text-[#68706A]">
                {inquiry.message}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
