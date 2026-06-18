'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Eye, EyeOff } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { useMutation } from '@tanstack/react-query'

import { AuthLayout } from '@/components/shared/AuthLayout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { registerUser } from '@/lib/auth-api'
import { getApiErrorMessage } from '@/lib/get-api-error-message'

const signupSchema = z
  .object({
    firstName: z.string().min(1, { message: 'First name is required' }),
    lastName: z.string().min(1, { message: 'Last name is required' }),
    email: z.string().email({ message: 'Please enter a valid email address' }),
    password: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters' }),
    confirmPassword: z
      .string()
      .min(8, { message: 'Please confirm your password' }),
    agree: z.boolean().refine(val => val === true, {
      message: 'You must agree to the Terms & Conditions',
    }),
  })
  .refine(data => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  })

type SignupFormValues = z.infer<typeof signupSchema>

export function SignupForm() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const registerMutation = useMutation({
    mutationFn: registerUser,
  })

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      agree: false,
    },
  })

  const onSubmit = async (data: SignupFormValues) => {
    try {
      await registerMutation.mutateAsync({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
      })

      toast.success(
        'Account created successfully. Check your email for the verification code.',
      )
      router.push(
        `/verify-otp?email=${encodeURIComponent(data.email)}&type=signup`,
      )
    } catch (error) {
      toast.error(
        getApiErrorMessage(error, 'Registration failed. Please try again.'),
      )
    }
  }

  const agreeValue = watch('agree')

  return (
    <AuthLayout
      title="Create Your Account"
      description="Connect families with trusted care join ALH Hub today."
      footer={
        <p className="text-slate-600">
          Already have an account?{' '}
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
        {/* First & Last Name */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label
              htmlFor="firstName"
              className="text-sm font-medium text-slate-700"
            >
              First Name
            </Label>
            <Input
              id="firstName"
              placeholder="Name Here"
              {...register('firstName')}
              className={`h-11 border-slate-200 focus-visible:ring-[#006fe6]/20 focus-visible:border-[#006fe6] transition-all bg-slate-50/50 focus:bg-white ${
                errors.firstName
                  ? 'border-destructive focus-visible:ring-destructive/20'
                  : ''
              }`}
            />
            {errors.firstName && (
              <p className="text-xs text-destructive mt-1">
                {errors.firstName.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="lastName"
              className="text-sm font-medium text-slate-700"
            >
              Last Name
            </Label>
            <Input
              id="lastName"
              placeholder="Name Here"
              {...register('lastName')}
              className={`h-11 border-slate-200 focus-visible:ring-[#006fe6]/20 focus-visible:border-[#006fe6] transition-all bg-slate-50/50 focus:bg-white ${
                errors.lastName
                  ? 'border-destructive focus-visible:ring-destructive/20'
                  : ''
              }`}
            />
            {errors.lastName && (
              <p className="text-xs text-destructive mt-1">
                {errors.lastName.message}
              </p>
            )}
          </div>
        </div>

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

        {/* Create Password */}
        <div className="space-y-2">
          <Label
            htmlFor="password"
            className="text-sm font-medium text-slate-700"
          >
            Create Password
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

        {/* Confirm Password */}
        <div className="space-y-2">
          <Label
            htmlFor="confirmPassword"
            className="text-sm font-medium text-slate-700"
          >
            Confirm Password
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

        {/* Agreement Checkbox */}
        <div className="space-y-2 pt-1">
          <div className="flex items-start space-x-2.5">
            <Checkbox
              id="agree"
              checked={agreeValue === true}
              onCheckedChange={checked =>
                setValue('agree', checked === true, { shouldValidate: true })
              }
              className="data-checked:border-[#006fe6] data-checked:bg-[#006fe6] data-checked:text-white aria-checked:border-[#006fe6] aria-checked:bg-[#006fe6] aria-checked:text-white"
            />
            <label
              htmlFor="agree"
              className="text-xs sm:text-sm font-normal text-slate-500 hover:text-slate-700 cursor-pointer select-none leading-tight transition-colors"
            >
              {"I agree to ALH Hub's "}
              <Link
                href="/terms"
                className="text-[#006fe6] font-semibold hover:underline"
              >
                Terms & Conditions
              </Link>{' '}
              and{' '}
              <Link
                href="/privacy"
                className="text-[#006fe6] font-semibold hover:underline"
              >
                Privacy Policy
              </Link>
              .
            </label>
          </div>
          {errors.agree && (
            <p className="text-xs text-destructive mt-1">
              {errors.agree.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={registerMutation.isPending}
          className="w-full h-11 bg-[#006fe6] hover:bg-[#005ec4] text-white font-medium rounded-lg shadow-sm hover:shadow transition-all duration-200 mt-2 flex items-center justify-center gap-2"
        >
          {registerMutation.isPending ? 'Creating account...' : 'Sign Up'}
        </Button>
      </form>
    </AuthLayout>
  )
}
