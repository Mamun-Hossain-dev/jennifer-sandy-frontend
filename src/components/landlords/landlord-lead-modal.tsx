'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { Building2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import { getApiErrorMessage } from '@/lib/get-api-error-message'
import { submitLandlordLead } from '@/lib/landlord-api'

const landlordLeadSchema = z.object({
  firstName: z.string().trim().min(1, 'First name is required'),
  lastName: z.string().trim().min(1, 'Last name is required'),
  email: z.string().trim().email('Please enter a valid email address'),
  phoneNumber: z.string().trim().min(7, 'Phone number is required'),
  propertyAddress: z.string().trim().optional(),
  propertyType: z.string().trim().optional(),
  message: z.string().trim().optional(),
})

type LandlordLeadFormValues = z.infer<typeof landlordLeadSchema>

const propertyTypes = [
  'apartment',
  'studio',
  'penthouse',
  'house',
  'other',
]

const modalCopy = {
  become: {
    badge: 'Landlord partner request',
    title: 'Become a landlord with 0211wohnen',
    description:
      'Share your property details and we will reach out with pricing, positioning, and next steps.',
    cta: 'Become a landlord',
  },
  list: {
    badge: 'List your apartment',
    title: 'List your apartment faster',
    description:
      'Send your listing details and our team will help you launch with photos, positioning, and tenant screening.',
    cta: 'List my apartment',
  },
} as const

interface LandlordLeadModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  source: keyof typeof modalCopy
}

const defaultValues: LandlordLeadFormValues = {
  firstName: '',
  lastName: '',
  email: '',
  phoneNumber: '',
  propertyAddress: '',
  propertyType: 'apartment',
  message: '',
}

export function LandlordLeadModal({
  open,
  onOpenChange,
  source,
}: LandlordLeadModalProps) {
  const copy = modalCopy[source]
  const form = useForm<LandlordLeadFormValues>({
    resolver: zodResolver(landlordLeadSchema),
    defaultValues,
  })

  const submitMutation = useMutation({
    mutationFn: submitLandlordLead,
    onSuccess: response => {
      toast.success(response.message || 'Submission received successfully')
      form.reset(defaultValues)
      onOpenChange(false)
    },
    onError: error => {
      toast.error(
        getApiErrorMessage(error, 'Unable to submit right now. Please try again.'),
      )
    },
  })

  const onSubmit = (values: LandlordLeadFormValues) => {
    submitMutation.mutate({
      firstName: values.firstName.trim(),
      lastName: values.lastName.trim(),
      email: values.email.trim(),
      phoneNumber: values.phoneNumber.trim(),
      propertyAddress: values.propertyAddress?.trim() || undefined,
      propertyType: values.propertyType?.trim() || undefined,
      message: values.message?.trim() || undefined,
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[82vh] overflow-hidden p-0 sm:max-w-2xl">
        <div className="max-h-[82vh] overflow-y-auto bg-white">
          <div className="border-b border-slate-100 bg-[linear-gradient(180deg,#F7FAFF_0%,#FFFFFF_100%)] px-6 py-6 md:px-8">
            <span className="inline-flex w-fit rounded-full border border-[#1672E6]/10 bg-[#1672E6]/8 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-[#1672E6]">
              {copy.badge}
            </span>
            <div className="mt-4 flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#1672E6]/10">
                <Building2 className="h-5 w-5 text-[#1672E6]" />
              </div>
              <h3 className="text-2xl font-semibold leading-tight text-slate-900">
                {copy.title}
              </h3>
            </div>
            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-600">
              {copy.description}
            </p>
          </div>

          <div className="px-6 py-6 md:px-8 md:py-7">
            <DialogHeader className="space-y-2">
              <DialogTitle className="text-2xl font-semibold text-slate-900">
                Tell us about your apartment
              </DialogTitle>
              <DialogDescription className="text-sm leading-6 text-slate-500">
                We only need a few details to get your listing conversation started.
              </DialogDescription>
            </DialogHeader>

            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="mt-8 space-y-5"
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="landlord-first-name">First Name</Label>
                  <Input
                    id="landlord-first-name"
                    placeholder="Tallulah"
                    {...form.register('firstName')}
                  />
                  {form.formState.errors.firstName && (
                    <p className="text-xs text-red-500">
                      {form.formState.errors.firstName.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="landlord-last-name">Last Name</Label>
                  <Input
                    id="landlord-last-name"
                    placeholder="Elliott"
                    {...form.register('lastName')}
                  />
                  {form.formState.errors.lastName && (
                    <p className="text-xs text-red-500">
                      {form.formState.errors.lastName.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="landlord-email">Email Address</Label>
                  <Input
                    id="landlord-email"
                    type="email"
                    placeholder="hello@example.com"
                    {...form.register('email')}
                  />
                  {form.formState.errors.email && (
                    <p className="text-xs text-red-500">
                      {form.formState.errors.email.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="landlord-phone">Phone Number</Label>
                  <Input
                    id="landlord-phone"
                    type="tel"
                    placeholder="+49 176 12345678"
                    {...form.register('phoneNumber')}
                  />
                  {form.formState.errors.phoneNumber && (
                    <p className="text-xs text-red-500">
                      {form.formState.errors.phoneNumber.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="landlord-address">Property Address</Label>
                <Input
                  id="landlord-address"
                  placeholder="Königsallee 15, 40212 Düsseldorf"
                  {...form.register('propertyAddress')}
                />
              </div>

              <div className="space-y-3">
                <Label>Property Type</Label>
                <div className="flex flex-wrap gap-2">
                  {propertyTypes.map(type => {
                    const isActive = form.watch('propertyType') === type
                    return (
                      <button
                        key={type}
                        type="button"
                        onClick={() =>
                          form.setValue('propertyType', type, {
                            shouldDirty: true,
                            shouldValidate: true,
                          })
                        }
                        className={cn(
                          'rounded-full border px-4 py-2 text-sm font-medium capitalize transition-colors',
                          isActive
                            ? 'border-[#1672E6] bg-[#1672E6] text-white'
                            : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-[#1672E6]/50 hover:text-[#1672E6]',
                        )}
                      >
                        {type}
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="landlord-message">Message</Label>
                <Textarea
                  id="landlord-message"
                  rows={5}
                  placeholder="Tell us about the apartment, expected availability, or any preferences."
                  {...form.register('message')}
                />
              </div>

              <div className="rounded-2xl border border-[#1672E6]/10 bg-[#1672E6]/5 px-4 py-3 text-sm text-slate-600">
                Our team usually replies within 1 business day.
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  className="h-11 px-5"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={submitMutation.isPending}
                  className="h-11 bg-[#1672E6] px-6 text-white hover:bg-[#0f63ce]"
                >
                  {submitMutation.isPending ? 'Sending...' : copy.cta}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
