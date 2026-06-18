'use client'

import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { useMutation } from '@tanstack/react-query'

import { AuthLayout } from '@/components/shared/AuthLayout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { sendForgotPasswordOtp } from '@/lib/auth-api'
import { getApiErrorMessage } from '@/lib/get-api-error-message'

const forgotPasswordSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
})

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>

export function ForgotPasswordForm() {
  const router = useRouter()
  const forgotPasswordMutation = useMutation({
    mutationFn: sendForgotPasswordOtp,
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  })

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    try {
      await forgotPasswordMutation.mutateAsync({ email: data.email })

      toast.success('Verification code sent to your email!')
      router.push(`/verify-otp?email=${encodeURIComponent(data.email)}`)
    } catch (error) {
      toast.error(
        getApiErrorMessage(
          error,
          'Failed to send verification code. Please try again.',
        ),
      )
    }
  }

  return (
    <AuthLayout
      title="Forgot Password"
      description="Enter your email to receive your password reset code"
      footer={
        <p className="text-slate-600">
          Remember your password?{' '}
          <Link
            href="/login"
            className="text-[#006fe6] font-semibold hover:underline"
          >
            Log In
          </Link>
        </p>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Email Address */}
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium text-slate-700">
            Email Address
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="hello@example.com"
            {...register('email')}
            className={`h-11 border-slate-200 focus-visible:ring-[#006fe6]/20 focus-visible:border-[#006fe6] transition-all bg-slate-50/50 focus:bg-white ${
              errors.email
                ? 'border-destructive focus-visible:ring-destructive/20'
                : ''
            }`}
          />
          {errors.email && (
            <p className="text-xs text-destructive mt-1">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={forgotPasswordMutation.isPending}
          className="w-full h-11 bg-[#006fe6] hover:bg-[#005ec4] text-white font-medium rounded-lg shadow-sm hover:shadow transition-all duration-200 mt-2 flex items-center justify-center gap-2"
        >
          {forgotPasswordMutation.isPending ? 'Sending code...' : 'Send OTP'}
        </Button>
      </form>
    </AuthLayout>
  )
}
