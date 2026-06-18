'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Mail, Phone, MapPin, MessageSquare } from 'lucide-react'
import { toast } from 'sonner'
import { useMutation } from '@tanstack/react-query'

import { submitContact, type ContactPayload } from '@/lib/contact-api'
import { getApiErrorMessage } from '@/lib/get-api-error-message'

const contactSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(7, 'Phone number is required'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  agreed: z.boolean().refine(val => val === true, {
    message: 'You must agree to the terms',
  }),
})

type ContactFormData = z.infer<typeof contactSchema>

export function ContactForm() {
  const submitMutation = useMutation({
    mutationFn: (data: ContactPayload) => submitContact(data),
  })

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  })

  const onSubmit = async (data: ContactFormData) => {
    try {
      await submitMutation.mutateAsync({
        fullName: `${data.firstName} ${data.lastName}`,
        email: data.email,
        phoneNumber: data.phone,
        message: data.message,
      })

      toast.success('Message sent successfully!')
      reset()
    } catch (error) {
      toast.error(
        getApiErrorMessage(error, 'Something went wrong. Please try again.'),
      )
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            First Name
          </label>
          <input
            {...register('firstName')}
            placeholder="Name Here"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1672E6]"
          />
          {errors.firstName && (
            <p className="text-red-500 text-xs mt-1">
              {errors.firstName.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Last Name
          </label>
          <input
            {...register('lastName')}
            placeholder="Name Here"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1672E6]"
          />
          {errors.lastName && (
            <p className="text-red-500 text-xs mt-1">
              {errors.lastName.message}
            </p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email Address
        </label>
        <input
          {...register('email')}
          type="email"
          placeholder="hello@example.com"
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1672E6]"
        />
        {errors.email && (
          <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Phone Number
        </label>
        <input
          {...register('phone')}
          type="tel"
          placeholder="+1234567890"
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1672E6]"
        />
        {errors.phone && (
          <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Message
        </label>
        <textarea
          {...register('message')}
          rows={5}
          placeholder="Write your message here.."
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1672E6] resize-none"
        />
        {errors.message && (
          <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>
        )}
      </div>

      <div className="flex items-start gap-2">
        <input
          {...register('agreed')}
          type="checkbox"
          id="agreed"
          className="mt-1 h-4 w-4 rounded border-gray-300 text-[#1672E6] focus:ring-[#1672E6]"
        />
        <label htmlFor="agreed" className="text-sm text-gray-600">
          You agree to our friendly{' '}
          <a href="/terms" className="text-[#1672E6] hover:underline">
            Terms & Conditions
          </a>{' '}
          and{' '}
          <a href="/privacy" className="text-[#1672E6] hover:underline">
            Privacy Policy
          </a>
          .
        </label>
      </div>
      {errors.agreed && (
        <p className="text-red-500 text-xs -mt-2">{errors.agreed.message}</p>
      )}

      <button
        type="submit"
        disabled={submitMutation.isPending}
        className="w-full bg-[#1672E6] hover:bg-[#125bbf] disabled:opacity-60 text-white font-medium py-2.5 rounded-md transition-colors text-sm flex items-center justify-center gap-2"
      >
        {submitMutation.isPending ? 'Sending...' : 'Send Message'}
      </button>
    </form>
  )
}

export function ContactInfo() {
  const contactDetails = [
    {
      icon: <Mail className="w-5 h-5 text-[#1672E6]" />,
      value: 'contact@0211wohnen.de',
      href: 'mailto:contact@0211wohnen.de',
    },
    {
      icon: <Phone className="w-5 h-5 text-[#1672E6]" />,
      value: '+49 211 12345678',
      href: 'tel:+4921112345678',
    },
    {
      icon: <MessageSquare className="w-5 h-5 text-[#1672E6]" />,
      value: 'Write to us on WhatsApp',
      href: 'https://wa.me/4921112345678',
    },
    {
      icon: <MapPin className="w-5 h-5 text-[#1672E6]" />,
      value: '0211wohnen, Medienhafen, Düsseldorf',
      href: null,
    },
  ]

  return (
    <div className="mt-16 md:mt-0">
      <h2 className="text-2xl font-semibold text-[#1672E6] mb-2">
        Contact Information
      </h2>
      <p className="text-gray-600 text-sm mb-6">
        Find all the ways to reach us, including email, phone, and our office
        address, so you can get the support and answers you need quickly and
        easily.
      </p>

      <ul className="space-y-4">
        {contactDetails.map((item, index) => (
          <li key={index} className="flex items-center gap-3">
            {item.icon}
            {item.href ? (
              <a
                href={item.href}
                className="text-sm text-gray-700 hover:text-[#1672E6] transition-colors"
              >
                {item.value}
              </a>
            ) : (
              <span className="text-sm text-gray-700">{item.value}</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
