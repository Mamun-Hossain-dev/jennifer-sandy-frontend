'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { toast } from 'sonner'

import { InquiryTable } from '@/components/account/inquiry-table'
import { inquiryColumns } from '@/components/account/inquiry-columns'
import { DeleteModal } from '@/components/account/delete-modal'
import { fetchRecentInquiries } from '@/lib/dashboard-api'
import { getApiErrorMessage } from '@/lib/get-api-error-message'
import type { InquiryRecord } from '@/types/dashboard'

export function InquiryListContent() {
  const router = useRouter()
  const { data: session } = useSession()
  const token = session?.user?.accessToken
  const queryClient = useQueryClient()

  const [page, setPage] = useState(1)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['account-inquiries', page],
    queryFn: () => fetchRecentInquiries(token as string, { page, limit: 8 }),
    enabled: !!token,
  })

  const inquiries = data?.data?.data || []
  const meta = data?.data?.meta
  const totalPages = meta?.total ? Math.ceil(meta.total / 8) : 1
  const totalItems = meta?.total || 0

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'}/inquiry/${id}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      if (!res.ok) {
        const err = await res.json().catch(() => null)
        throw new Error(err?.message || 'Failed to delete inquiry')
      }
      return res.json()
    },
    onSuccess: () => {
      toast.success('Inquiry deleted successfully')
      queryClient.invalidateQueries({ queryKey: ['account-inquiries'] })
      setDeleteId(null)
    },
    onError: error => {
      toast.error(getApiErrorMessage(error, 'Failed to delete'))
    },
  })

  const handleView = useCallback(
    (inquiry: InquiryRecord) => {
      router.push(`/account/inquiries/${inquiry._id}`)
    },
    [router],
  )

  const handleDelete = useCallback((id: string) => {
    setDeleteId(id)
  }, [])

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold leading-[120%] text-[#343A40]">
          My Inquiries
        </h1>
        <p className="mt-2 text-base font-normal leading-[150%] text-[#68706A]">
          Here&rsquo;s an overview of your inquiries
        </p>
      </div>

      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        <InquiryTable
          columns={inquiryColumns(handleView, handleDelete)}
          data={inquiries}
          isLoading={isLoading}
          isError={isError}
          errorMessage={
            error instanceof Error ? error.message : 'Something went wrong'
          }
          onRetry={() => refetch()}
          totalPages={totalPages}
          currentPage={page}
          onPageChange={setPage}
          totalItems={totalItems}
          pageSize={8}
        />
      </div>

      <DeleteModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => {
          if (deleteId) deleteMutation.mutate(deleteId)
        }}
        isPending={deleteMutation.isPending}
      />
    </div>
  )
}
