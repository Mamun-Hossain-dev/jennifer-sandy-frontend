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
import { signIn } from 'next-auth/react'

import { AuthLayout } from '@/components/shared/AuthLayout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { loginUser, normalizeAuthUser } from '@/lib/auth-api'
import { getApiErrorMessage } from '@/lib/get-api-error-message'

const loginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters' }),
  rememberMe: z.boolean().optional(),
})

type LoginFormValues = z.infer<typeof loginSchema>

export function LoginForm() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const loginMutation = useMutation({
    mutationFn: loginUser,
  })

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  })

  const rememberMeValue = watch('rememberMe')

  const onSubmit = async (data: LoginFormValues) => {
    try {
      const response = await loginMutation.mutateAsync({
        email: data.email,
        password: data.password,
      })

      const authUser = normalizeAuthUser(response.data.user)
      const sessionResult = await signIn('credentials', {
        redirect: false,
        accessToken: response.data.accessToken,
        user: JSON.stringify(authUser),
      })

      if (sessionResult?.error) {
        toast.error(sessionResult.error)
        return
      }

      toast.success('Welcome back! Logged in successfully.')
      router.push('/account/inquiries')
    } catch (error) {
      toast.error(
        getApiErrorMessage(error, 'Unable to log in. Please try again.'),
      )
    }
  }

  return (
    <AuthLayout
      title="Welcome"
      description="Access your account to manage tours, leads, and listings"
      footer={
        <p className="text-slate-600">
          {"Don't have an account? "}
          <Link
            href="/signup"
            className="text-[#006fe6] font-semibold hover:underline"
          >
            Sign Up
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

        {/* Password */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label
              htmlFor="password"
              className="text-sm font-medium text-slate-700"
            >
              Password
            </Label>
          </div>
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

        {/* Remember me & Forgot Password */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="rememberMe"
              checked={rememberMeValue === true}
              onCheckedChange={checked =>
                setValue('rememberMe', checked === true, {
                  shouldValidate: true,
                })
              }
              className="data-checked:border-[#006fe6] data-checked:bg-[#006fe6] data-checked:text-white aria-checked:border-[#006fe6] aria-checked:bg-[#006fe6] aria-checked:text-white"
            />
            <label
              htmlFor="rememberMe"
              className="text-sm font-normal text-slate-500 hover:text-slate-700 cursor-pointer select-none transition-colors"
            >
              Remember me
            </label>
          </div>
          <Link
            href="/forgot-password"
            className="text-sm font-medium text-[#006fe6] hover:underline transition-colors"
          >
            Forgot password?
          </Link>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={loginMutation.isPending}
          className="w-full h-11 bg-[#006fe6] hover:bg-[#005ec4] text-white font-medium rounded-lg shadow-sm hover:shadow transition-all duration-200 mt-2 flex items-center justify-center gap-2"
        >
          {loginMutation.isPending ? 'Logging in...' : 'Log In'}
        </Button>
      </form>
    </AuthLayout>
  )
}
