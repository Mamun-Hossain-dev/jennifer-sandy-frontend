'use client'

import {
  useEffect,
  useRef,
  useState,
  KeyboardEvent,
  ClipboardEvent,
} from 'react'
import { toast } from 'sonner'
import { useRouter, useSearchParams } from 'next/navigation'
import { useMutation } from '@tanstack/react-query'

import { AuthLayout } from '@/components/shared/AuthLayout'
import { Button } from '@/components/ui/button'
import { sendForgotPasswordOtp, verifyOtp } from '@/lib/auth-api'
import { getApiErrorMessage } from '@/lib/get-api-error-message'

export function VerifyOtpContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get('email') || ''
  const type = searchParams.get('type') || 'forgot'
  const displayEmail = email || 'your email address'

  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', ''])
  const [resendTimer, setResendTimer] = useState(59)
  const verifyMutation = useMutation({
    mutationFn: verifyOtp,
  })
  const resendMutation = useMutation({
    mutationFn: sendForgotPasswordOtp,
  })

  // References to the 6 input boxes
  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ]

  // Resend OTP cooldown timer
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer(prev => prev - 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [resendTimer])

  const handleChange = (index: number, value: string) => {
    // Only accept numeric inputs
    if (value !== '' && !/^[0-9]$/.test(value)) return

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    // If typing a digit, shift focus to the next field
    if (value !== '' && index < 5) {
      inputRefs[index + 1].current?.focus()
    }
  }

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    // Handle backspace key
    if (e.key === 'Backspace') {
      if (otp[index] === '' && index > 0) {
        // Shift focus to the previous input and clear it
        const newOtp = [...otp]
        newOtp[index - 1] = ''
        setOtp(newOtp)
        inputRefs[index - 1].current?.focus()
      } else {
        const newOtp = [...otp]
        newOtp[index] = ''
        setOtp(newOtp)
      }
    }
  }

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').trim()
    if (!/^\d{6}$/.test(pastedData)) {
      toast.error('Please paste a valid 6-digit verification code')
      return
    }

    const pastedDigits = pastedData.split('')
    setOtp(pastedDigits)
    inputRefs[5].current?.focus()
  }

  const handleResend = async () => {
    if (!email) {
      toast.error(
        'Missing email address. Please restart the password reset flow.',
      )
      router.push('/forgot-password')
      return
    }

    if (resendTimer > 0) return

    try {
      await resendMutation.mutateAsync({ email })
      setResendTimer(59)
      toast.success('A new verification code has been sent!')
    } catch (error) {
      toast.error(
        getApiErrorMessage(error, 'Failed to resend verification code.'),
      )
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) {
      toast.error(
        'Missing email address. Please restart the password reset flow.',
      )
      router.push('/forgot-password')
      return
    }

    const code = otp.join('')

    if (code.length < 6) {
      toast.error('Please enter the complete 6-digit verification code')
      return
    }

    try {
      await verifyMutation.mutateAsync({ email, otp: code })
      if (type === 'signup') {
        toast.success('Email verified successfully! You can now log in.')
        router.push('/login')
      } else {
        toast.success(
          'Email verified successfully! You can now reset/change your password.',
        )
        router.push(`/change-password?email=${encodeURIComponent(email)}`)
      }
    } catch (error) {
      toast.error(
        getApiErrorMessage(
          error,
          'Invalid verification code. Please try again.',
        ),
      )
    }
  }

  return (
    <AuthLayout
      title="Verify Email"
      description={`A 6-digit verification code has been sent to ${displayEmail}`}
      footer={
        <div className="text-slate-600 font-normal">
          {"Didn't get the code? "}
          <button
            type="button"
            disabled={!email || resendTimer > 0 || resendMutation.isPending}
            onClick={handleResend}
            className={`font-semibold underline transition-colors ${
              !email || resendTimer > 0 || resendMutation.isPending
                ? 'text-slate-400 cursor-not-allowed'
                : 'text-[#006fe6] hover:text-[#005ec4]'
            }`}
          >
            {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend'}
          </button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* OTP Input Group */}
        <div className="flex justify-between items-center gap-2.5 max-w-[390px] mx-auto py-2">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={inputRefs[index]}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={e => handleChange(index, e.target.value)}
              onKeyDown={e => handleKeyDown(index, e)}
              onPaste={index === 0 ? handlePaste : undefined}
              className="w-11 h-11 sm:w-14 sm:h-14 text-center text-xl font-semibold text-slate-800 bg-slate-50/50 hover:bg-slate-50 border border-slate-200 focus:border-[#006fe6] focus:bg-white rounded-lg focus-visible:ring-3 focus-visible:ring-[#006fe6]/20 outline-none transition-all"
            />
          ))}
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={verifyMutation.isPending}
          className="w-full h-11 bg-[#006fe6] hover:bg-[#005ec4] text-white font-medium rounded-lg shadow-sm hover:shadow transition-all duration-200 flex items-center justify-center gap-2"
        >
          {verifyMutation.isPending ? 'Verifying...' : 'Verify'}
        </Button>
      </form>
    </AuthLayout>
  )
}
