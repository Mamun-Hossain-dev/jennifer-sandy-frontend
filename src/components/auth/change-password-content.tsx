'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Eye, EyeOff } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter, useSearchParams } from 'next/navigation'
import { useMutation } from '@tanstack/react-query'

import { AuthLayout } from '@/components/shared/AuthLayout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { resetPassword } from '@/lib/auth-api'
import { getApiErrorMessage } from '@/lib/get-api-error-message'

const changePasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters' }),
    confirmPassword: z
      .string()
      .min(8, { message: 'Please confirm your new password' }),
  })
  .refine(data => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  })

type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>

export function ChangePasswordContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get('email') || ''
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const resetPasswordMutation = useMutation({
    mutationFn: resetPassword,
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  })

  const onSubmit = async (data: ChangePasswordFormValues) => {
    if (!email) {
      toast.error(
        'Missing email address. Please restart the password reset flow.',
      )
      router.push('/forgot-password')
      return
    }

    try {
      await resetPasswordMutation.mutateAsync({
        email,
        newPassword: data.password,
      })

      toast.success(
        'Password reset successfully! You can now log in with your new password.',
      )
      router.push('/login')
    } catch (error) {
      toast.error(
        getApiErrorMessage(
          error,
          'Failed to reset password. Please try again.',
        ),
      )
    }
  }

  return (
    <AuthLayout
      title="Change Password"
      description={
        email
          ? 'Enter your new password to reset your password'
          : 'Please restart the password reset flow'
      }
      footer={
        <p className="text-slate-600">
          Back to{' '}
          <Link
            href="/login"
            className="text-[#006fe6] font-semibold hover:underline"
          >
            Log In
          </Link>
        </p>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Create New Password */}
        <div className="space-y-2">
          <Label
            htmlFor="password"
            className="text-sm font-medium text-slate-700"
          >
            Create New Password
          </Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="********"
              {...register('password')}
              className={`h-11 pr-10 border-slate-200 focus-visible:ring-[#006fe6]/20 focus-visible:border-[#006fe6] transition-all bg-slate-50/50 focus:bg-white ${
                errors.password
                  ? 'border-destructive focus-visible:ring-destructive/20'
                  : ''
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none transition-colors"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-xs text-destructive mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Confirm New Password */}
        <div className="space-y-2">
          <Label
            htmlFor="confirmPassword"
            className="text-sm font-medium text-slate-700"
          >
            Confirm New Password
          </Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="********"
              {...register('confirmPassword')}
              className={`h-11 pr-10 border-slate-200 focus-visible:ring-[#006fe6]/20 focus-visible:border-[#006fe6] transition-all bg-slate-50/50 focus:bg-white ${
                errors.confirmPassword
                  ? 'border-destructive focus-visible:ring-destructive/20'
                  : ''
              }`}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none transition-colors"
            >
              {showConfirmPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-xs text-destructive mt-1">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={resetPasswordMutation.isPending}
          className="w-full h-11 bg-[#006fe6] hover:bg-[#005ec4] text-white font-medium rounded-lg shadow-sm hover:shadow transition-all duration-200 mt-2 flex items-center justify-center gap-2"
        >
          {resetPasswordMutation.isPending ? 'Saving password...' : 'Change Password'}
        </Button>
      </form>
    </AuthLayout>
  )
}
