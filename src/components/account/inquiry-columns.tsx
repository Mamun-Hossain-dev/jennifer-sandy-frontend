'use client'

import Link from 'next/link'
import { Eye, Trash } from 'lucide-react'
import type { ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import type { InquiryRecord } from '@/types/dashboard'

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    responded: 'bg-green-100 text-green-700',
    pending: 'bg-yellow-100 text-yellow-700',
    closed: 'bg-red-100 text-red-700',
  }

  const baseStyle =
    'inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold'
  const statusLower = status?.toLowerCase() || 'pending'

  return (
    <span className={cn(baseStyle, styles[statusLower] || styles.pending)}>
      {status || 'Pending'}
    </span>
  )
}

export const inquiryColumns = (
  onView: (inquiry: InquiryRecord) => void,
  onDelete: (id: string) => void,
): ColumnDef<InquiryRecord>[] => [
  {
    accessorKey: 'apartmentName',
    header: () => (
      <span className="text-sm font-normal leading-[150%] text-[#343A40]">
        Apartment Name
      </span>
    ),
    cell: ({ row }) => {
      const inquiry = row.original
      const name =
        typeof inquiry.onOfficeId === 'object' &&
        inquiry.onOfficeId?.objekttitel
          ? inquiry.onOfficeId.objekttitel
          : 'N/A'
      return (
        <span className="text-base font-medium leading-[150%] text-[#68706A]">
          {name}
        </span>
      )
    },
  },
  {
    accessorKey: 'createdAt',
    header: () => (
      <span className="text-sm font-normal leading-[150%] text-[#343A40]">
        Date
      </span>
    ),
    cell: ({ row }) => {
      const date = row.original.createdAt
      return (
        <span className="text-base font-normal leading-[150%] text-[#68706A]">
          {date ? format(new Date(date), 'MMM dd yyyy') : 'N/A'}
        </span>
      )
    },
  },
  {
    accessorKey: 'message',
    header: () => (
      <span className="text-sm font-normal leading-[150%] text-[#343A40]">
        Message
      </span>
    ),
    cell: ({ row }) => {
      const msg = row.original.message || ''
      const truncated = msg.length > 50 ? msg.slice(0, 50) + '...' : msg
      return (
        <span className="text-base font-normal leading-[150%] text-[#68706A]">
          {truncated || 'N/A'}
        </span>
      )
    },
  },
  {
    accessorKey: 'status',
    header: () => (
      <span className="text-sm font-normal leading-[150%] text-[#343A40]">
        Status
      </span>
    ),
    cell: ({ row }) => (
      <StatusBadge status={row.original.status || 'pending'} />
    ),
  },
  {
    id: 'details',
    header: () => (
      <span className="text-sm font-normal leading-[150%] text-[#343A40]">
        Inquiry Details
      </span>
    ),
    cell: ({ row }) => {
      const inquiry = row.original
      return (
        <Link
          href={`/account/inquiries/${inquiry._id}`}
          className="text-base font-medium leading-[150%] text-[#2563EB] hover:underline"
        >
          See Details
        </Link>
      )
    },
  },
  {
    id: 'actions',
    header: () => (
      <span className="text-sm font-normal leading-[150%] text-[#343A40]">
        Action
      </span>
    ),
    cell: ({ row }) => {
      const inquiry = row.original
      return (
        <div className="flex items-center justify-center gap-6">
          <button
            onClick={() => onView(inquiry)}
            className="cursor-pointer transition-colors hover:opacity-80"
            title="View"
          >
            <Eye className="h-6 w-6 text-[#2563EB]" />
          </button>
          <button
            onClick={() => onDelete(inquiry._id)}
            className="cursor-pointer transition-colors hover:opacity-80"
            title="Delete"
          >
            <Trash className="h-6 w-6 text-red-500" />
          </button>
        </div>
      )
    },
  },
]
