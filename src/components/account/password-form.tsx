'use client'

import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { Eye, EyeOff } from 'lucide-react'
import { useMutation } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { changeMyPassword } from '@/lib/dashboard-api'
import { getApiErrorMessage } from '@/lib/get-api-error-message'

const changePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(8, 'Current password must be at least 8 characters'),
    newPassword: z
      .string()
      .min(8, 'New password must be at least 8 characters'),
    confirmPassword: z.string().min(8, 'Please confirm your new password'),
  })
  .refine(values => values.newPassword === values.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  })

type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>

export function PasswordForm() {
  const { data: session } = useSession()
  const token = session?.user?.accessToken
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const form = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  })

  const changePasswordMutation = useMutation({
    mutationFn: (values: ChangePasswordFormValues) =>
      changeMyPassword(token as string, {
        oldPassword: values.currentPassword,
        newPassword: values.newPassword,
      }),
    onSuccess: response => {
      toast.success(response.message || 'Password changed successfully')
      form.reset()
    },
    onError: error => {
      toast.error(getApiErrorMessage(error, 'Password update failed'))
    },
  })

  const onSubmit = (values: ChangePasswordFormValues) => {
    if (!token) return
    changePasswordMutation.mutate(values)
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
      <div>
        <h4 className="text-xl font-semibold leading-[120%] text-[#343A40] md:text-2xl">
          Changes Password
        </h4>
        <p className="pt-3 text-base font-normal leading-[120%] text-[#68706A]">
          Manage your account preferences, security settings, and privacy
          options.
        </p>
      </div>

      <div className="pt-8">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Current Password */}
            <div className="space-y-2">
              <Label
                htmlFor="currentPassword"
                className="text-base font-medium leading-[120%] text-[#3B4759]"
              >
                Current Password
              </Label>
              <div className="relative">
                <Input
                  id="currentPassword"
                  type={showCurrentPassword ? 'text' : 'password'}
                  placeholder="••••••••••••••••••"
                  className="h-[48px] w-full rounded-md border-[#C0C3C1] p-3 pr-12 text-base font-normal leading-[120%] text-[#3B4759] placeholder:text-[#8E959F]"
                  {...form.register('currentPassword')}
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(value => !value)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 transition-colors hover:text-gray-800"
                >
                  {showCurrentPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {form.formState.errors.currentPassword && (
                <p className="text-xs text-red-500">
                  {form.formState.errors.currentPassword.message}
                </p>
              )}
            </div>

            {/* New Password */}
            <div className="space-y-2">
              <Label
                htmlFor="newPassword"
                className="text-base font-medium leading-[120%] text-[#3B4759]"
              >
                New Password
              </Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showNewPassword ? 'text' : 'password'}
                  placeholder="••••••••••••••••••"
                  className="h-[48px] w-full rounded-md border-[#C0C3C1] p-3 pr-12 text-base font-normal leading-[120%] text-[#3B4759] placeholder:text-[#8E959F]"
                  {...form.register('newPassword')}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(value => !value)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 transition-colors hover:text-gray-800"
                >
                  {showNewPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {form.formState.errors.newPassword && (
                <p className="text-xs text-red-500">
                  {form.formState.errors.newPassword.message}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label
                htmlFor="confirmPassword"
                className="text-base font-medium leading-[120%] text-[#3B4759]"
              >
                Confirm New Password
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="••••••••••••••••••"
                  className="h-[48px] w-full rounded-md border-[#C0C3C1] p-3 pr-12 text-base font-normal leading-[120%] text-[#3B4759] placeholder:text-[#8E959F]"
                  {...form.register('confirmPassword')}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(value => !value)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 transition-colors hover:text-gray-800"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {form.formState.errors.confirmPassword && (
                <p className="text-xs text-red-500">
                  {form.formState.errors.confirmPassword.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex w-full items-center justify-end gap-6 pt-5">
            <Button
              type="button"
              variant="outline"
              onClick={() => form.reset()}
              className="h-[47px] rounded-md border border-[#E5102E] px-6 py-4 text-sm font-medium leading-[120%] text-[#E5102E]"
            >
              Discard Changes
            </Button>
            <Button
              type="submit"
              disabled={changePasswordMutation.isPending}
              className="h-[47px] rounded-md bg-[#2563EB] px-6 py-4 text-sm font-medium leading-[120%] text-white hover:bg-[#1d4ed8]"
            >
              {changePasswordMutation.isPending ? 'Sending...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
