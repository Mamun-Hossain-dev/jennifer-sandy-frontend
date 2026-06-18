'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import { Camera } from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { toast } from 'sonner'

import { fetchMyProfile } from '@/lib/dashboard-api'
import { getApiErrorMessage } from '@/lib/get-api-error-message'
import { broadcastProfileUpdate } from '@/components/shared/profile-update-broadcast'

export function ProfileCard() {
  const { data: session } = useSession()
  const token = session?.user?.accessToken
  const queryClient = useQueryClient()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const { data, isLoading } = useQuery({
    queryKey: ['my-profile'],
    queryFn: () => fetchMyProfile(token as string),
    enabled: !!token,
    staleTime: 1000 * 60 * 5,
  })

  const profile = data?.data

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData()
      formData.append('profilePicture', file, file.name)
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'}/user/profile`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        },
      )
      if (!res.ok) {
        const err = await res.json().catch(() => null)
        throw new Error(err?.message || 'Upload failed')
      }
      return res.json()
    },
    onSuccess: async response => {
      toast.success(response?.message || 'Profile image updated!')
      await queryClient.invalidateQueries({ queryKey: ['my-profile'] })

      broadcastProfileUpdate()

      setPreviewUrl(null)
    },
    onError: error => {
      toast.error(getApiErrorMessage(error, 'Upload failed'))
      setPreviewUrl(null)
    },
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string)
    }
    reader.readAsDataURL(file)

    uploadMutation.mutate(file)
  }

  const avatarSrc =
    previewUrl || profile?.profilePicture || '/images/no-user.jpeg'

  if (isLoading) {
    return (
      <div className="animate-pulse rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col items-center gap-4">
          <div className="h-24 w-24 rounded-full bg-gray-200" />
          <div className="h-4 w-32 rounded bg-gray-200" />
          <div className="h-3 w-40 rounded bg-gray-200" />
          <div className="mt-4 space-y-2">
            <div className="h-3 w-48 rounded bg-gray-200" />
            <div className="h-3 w-48 rounded bg-gray-200" />
            <div className="h-3 w-48 rounded bg-gray-200" />
            <div className="h-3 w-48 rounded bg-gray-200" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
      {/* Avatar section */}
      <div className="flex flex-col items-center px-6 pt-10">
        <div className="relative">
          <div className="relative h-24 w-24 overflow-hidden rounded-full border-4 border-white shadow-md">
            <Image
              src={avatarSrc}
              alt={profile?.firstName || 'Profile'}
              width={96}
              height={96}
              className="h-full w-full rounded-full object-cover"
              priority
            />
          </div>
          <div
            className="absolute -bottom-1 -right-1 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-[#2563EB] text-white shadow-md hover:bg-[#1d4ed8]"
            onClick={() => fileInputRef.current?.click()}
          >
            <Camera className="h-4 w-4" />
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            hidden
            onChange={handleFileChange}
          />
        </div>
        <h3 className="mt-4 text-lg font-semibold text-gray-900">
          {profile?.firstName} {profile?.lastName}
        </h3>
        <p className="mt-1 text-sm text-gray-500">{profile?.email}</p>
        {profile?.bio && (
          <p className="mt-3 text-center text-sm text-gray-600">
            {profile.bio}
          </p>
        )}
      </div>

      {/* Details */}
      <div className="mt-6 space-y-4 border-t border-gray-100 px-6 pb-6 pt-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
            Name
          </p>
          <p className="mt-1 text-sm font-medium text-gray-900">
            {profile?.firstName} {profile?.lastName}
          </p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
            Email
          </p>
          <p className="mt-1 text-sm text-gray-600">
            {profile?.email || 'N/A'}
          </p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
            Phone
          </p>
          <p className="mt-1 text-sm text-gray-600">
            {profile?.phoneNumber || 'N/A'}
          </p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
            Location
          </p>
          <p className="mt-1 text-sm text-gray-600">
            {profile?.location || profile?.streetAddress || 'N/A'}
          </p>
        </div>
      </div>
    </div>
  )
}
