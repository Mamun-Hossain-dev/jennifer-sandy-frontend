'use client'

import { useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { fetchMyProfile, updateMyProfile } from '@/lib/dashboard-api'
import { getApiErrorMessage } from '@/lib/get-api-error-message'
import { broadcastProfileUpdate } from '@/components/shared/profile-update-broadcast'
import { TranslatedText } from '@/components/shared/translated-text'
import { useTranslatedText } from '@/hooks/use-translated-text'

const profileSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phoneNumber: z.string().optional(),
  bio: z.string().optional(),
  streetAddress: z.string().optional(),
  location: z.string().optional(),
  postalCode: z.string().optional(),
  gender: z.enum(['male', 'female']).optional(),
})

type ProfileFormValues = z.infer<typeof profileSchema>

export function ProfileForm() {
  const { data: session } = useSession()
  const token = session?.user?.accessToken
  const queryClient = useQueryClient()
  const profileUpdatedMessage = useTranslatedText(
    'Profile updated successfully',
    'en',
    { cacheKey: 'profile:toast:success' },
  )
  const updateFailedMessage = useTranslatedText('Update failed', 'en', {
    cacheKey: 'profile:toast:error',
  })

  const profileQuery = useQuery({
    queryKey: ['my-profile'],
    queryFn: () => fetchMyProfile(token as string),
    enabled: !!token,
    staleTime: 1000 * 60 * 5,
  })

  const profile = profileQuery.data?.data

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      bio: '',
      streetAddress: '',
      location: '',
      postalCode: '',
      gender: undefined,
    },
  })

  // Reset form when profile data loads
  useEffect(() => {
    if (profile) {
      form.reset({
        firstName: profile.firstName ?? '',
        lastName: profile.lastName ?? '',
        email: profile.email ?? '',
        phoneNumber: profile.phoneNumber ?? '',
        bio: profile.bio ?? '',
        streetAddress: profile.streetAddress ?? '',
        location: profile.location ?? '',
        postalCode: profile.postalCode ?? '',
        gender: (profile.gender as 'male' | 'female') ?? undefined,
      })
    }
  }, [profile, form])

  const updateMutation = useMutation({
    mutationFn: async (values: ProfileFormValues) => {
      return updateMyProfile(token as string, {
        firstName: values.firstName.trim(),
        lastName: values.lastName.trim(),
        email: values.email.trim(),
        phoneNumber: values.phoneNumber?.trim() ?? '',
        bio: values.bio?.trim() ?? '',
        streetAddress: values.streetAddress?.trim() ?? '',
        location: values.location?.trim() ?? '',
        postalCode: values.postalCode?.trim() ?? '',
        gender: values.gender,
      })
    },
    onSuccess: async response => {
      toast.success(response.message || profileUpdatedMessage)
      await queryClient.invalidateQueries({ queryKey: ['my-profile'] })
      broadcastProfileUpdate()
    },
    onError: error => {
      toast.error(getApiErrorMessage(error, updateFailedMessage))
    },
  })

  const onSubmit = (values: ProfileFormValues) => {
    if (!token) return
    updateMutation.mutate(values)
  }

  const handleDiscard = () => {
    if (profile) {
      form.reset({
        firstName: profile.firstName ?? '',
        lastName: profile.lastName ?? '',
        email: profile.email ?? '',
        phoneNumber: profile.phoneNumber ?? '',
        bio: profile.bio ?? '',
        streetAddress: profile.streetAddress ?? '',
        location: profile.location ?? '',
        postalCode: profile.postalCode ?? '',
        gender: (profile.gender as 'male' | 'female') ?? undefined,
      })
    }
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
      <div>
        <h4 className="text-xl font-semibold leading-[120%] text-[#343A40] md:text-2xl">
          <TranslatedText
            text="Personal Information"
            cacheKey="profile:title"
          />
        </h4>
        <p className="pt-3 text-base font-normal leading-[120%] text-[#68706A]">
          <TranslatedText
            text="Manage your personal information and profile details."
            cacheKey="profile:subtitle"
          />
        </p>
      </div>

      <div className="pt-8">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Gender */}
          <div className="space-y-3">
            <Label className="text-base font-medium leading-[120%] text-[#3B4759]">
              <TranslatedText text="Gender" cacheKey="profile:gender" />
            </Label>
            <div className="flex items-center gap-8">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="gender"
                  value="male"
                  checked={form.watch('gender') === 'male'}
                  onChange={() =>
                    form.setValue('gender', 'male', { shouldDirty: true })
                  }
                  className="h-4 w-4 accent-[#2563EB]"
                />
                <span className="text-sm font-normal text-gray-700">
                  <TranslatedText text="Male" cacheKey="profile:male" />
                </span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="gender"
                  value="female"
                  checked={form.watch('gender') === 'female'}
                  onChange={() =>
                    form.setValue('gender', 'female', { shouldDirty: true })
                  }
                  className="h-4 w-4 accent-[#2563EB]"
                />
                <span className="text-sm font-normal text-gray-700">
                  <TranslatedText text="Female" cacheKey="profile:female" />
                </span>
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label
                htmlFor="firstName"
              className="text-base font-medium leading-[120%] text-[#3B4759]"
            >
                <TranslatedText text="First Name" cacheKey="profile:first" />
              </Label>
              <Input
                id="firstName"
                {...form.register('firstName')}
                placeholder="Maria Jasmin"
                className="h-[48px] w-full rounded-md border-[#C0C3C1] p-3 text-base font-normal leading-[120%] text-[#3B4759] placeholder:text-[#8E959F]"
              />
              {form.formState.errors.firstName && (
                <p className="text-xs text-red-500">
                  {form.formState.errors.firstName.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="lastName"
              className="text-base font-medium leading-[120%] text-[#3B4759]"
            >
                <TranslatedText text="Last Name" cacheKey="profile:last" />
              </Label>
              <Input
                id="lastName"
                {...form.register('lastName')}
                placeholder="Maria Jasmin"
                className="h-[48px] w-full rounded-md border-[#C0C3C1] p-3 text-base font-normal leading-[120%] text-[#3B4759] placeholder:text-[#8E959F]"
              />
              {form.formState.errors.lastName && (
                <p className="text-xs text-red-500">
                  {form.formState.errors.lastName.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
            <Label
              htmlFor="email"
              className="text-base font-medium leading-[120%] text-[#3B4759]"
            >
              <TranslatedText
                text="Email Address"
                cacheKey="profile:email"
              />
            </Label>
              <Input
                id="email"
                type="email"
                disabled
                {...form.register('email')}
                placeholder="bessieedwards@gmail.com"
                className="h-[48px] w-full rounded-md border-[#C0C3C1] p-3 text-base font-normal leading-[120%] text-[#3B4759] placeholder:text-[#8E959F]"
              />
            </div>

            <div className="space-y-2">
            <Label
              htmlFor="phoneNumber"
              className="text-base font-medium leading-[120%] text-[#3B4759]"
            >
              <TranslatedText
                text="Phone Number"
                cacheKey="profile:phone"
              />
            </Label>
              <Input
                id="phoneNumber"
                {...form.register('phoneNumber')}
                placeholder="+1 (555) 123-4567"
                className="h-[48px] w-full rounded-md border-[#C0C3C1] p-3 text-base font-normal leading-[120%] text-[#3B4759] placeholder:text-[#8E959F]"
              />
            </div>
          </div>

          {/* Bio */}
          <div className="space-y-2">
            <Label
              htmlFor="bio"
              className="text-base font-medium leading-[120%] text-[#3B4759]"
            >
              <TranslatedText text="Bio" cacheKey="profile:bio" />
            </Label>
            <Textarea
              id="bio"
              {...form.register('bio')}
              placeholder="Tell us about yourself..."
              className="min-h-[100px] w-full rounded-md border-[#C0C3C1] p-3 text-base font-normal leading-[120%] text-[#3B4759] placeholder:text-[#8E959F]"
            />
          </div>

          {/* Street Address */}
          <div className="space-y-2">
            <Label
              htmlFor="streetAddress"
              className="text-base font-medium leading-[120%] text-[#3B4759]"
            >
              <TranslatedText
                text="Street Address"
                cacheKey="profile:street"
              />
            </Label>
            <Input
              id="streetAddress"
              {...form.register('streetAddress')}
              placeholder="San Francisco"
              className="h-[48px] w-full rounded-md border-[#C0C3C1] p-3 text-base font-normal leading-[120%] text-[#3B4759] placeholder:text-[#8E959F]"
            />
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label
                htmlFor="location"
              className="text-base font-medium leading-[120%] text-[#3B4759]"
            >
              <TranslatedText text="Location" cacheKey="profile:location" />
            </Label>
              <Input
                id="location"
                {...form.register('location')}
                placeholder="City or region"
                className="h-[48px] w-full rounded-md border-[#C0C3C1] p-3 text-base font-normal leading-[120%] text-[#3B4759] placeholder:text-[#8E959F]"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="postalCode"
              className="text-base font-medium leading-[120%] text-[#3B4759]"
            >
              <TranslatedText
                text="Postal Code"
                cacheKey="profile:postal"
              />
            </Label>
              <Input
                id="postalCode"
                {...form.register('postalCode')}
                placeholder="Postal code"
                className="h-[48px] w-full rounded-md border-[#C0C3C1] p-3 text-base font-normal leading-[120%] text-[#3B4759] placeholder:text-[#8E959F]"
              />
            </div>
          </div>

          <div className="flex w-full items-center justify-end gap-6 pt-5">
            <Button
              type="button"
              variant="outline"
              onClick={handleDiscard}
              className="h-[47px] rounded-md border border-[#E5102E] px-6 py-4 text-sm font-medium leading-[120%] text-[#E5102E]"
            >
              <TranslatedText
                text="Discard Changes"
                cacheKey="profile:discard"
              />
            </Button>
            <Button
              type="submit"
              disabled={updateMutation.isPending}
              className="h-[47px] rounded-md bg-[#2563EB] px-6 py-4 text-sm font-medium leading-[120%] text-white hover:bg-[#1d4ed8]"
            >
              {updateMutation.isPending ? (
                <TranslatedText
                  text="Updating..."
                  cacheKey="profile:loading"
                />
              ) : (
                <TranslatedText
                  text="Save Changes"
                  cacheKey="profile:save"
                />
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
