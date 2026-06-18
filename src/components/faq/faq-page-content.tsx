'use client'

import Image from 'next/image'
import { FaqAccordion } from '@/components/shared/faq-accordion'
import { ContactCtaSection } from '@/components/shared/contact-cta-section'
import { TranslatedText } from '@/components/shared/translated-text'

const faqs = [
  {
    question: 'How does the booking process work?',
    answer:
      'Our booking process is simple and digital. After you submit your request, we will review it and send you a digital rental agreement for signature. Attached you will receive all the necessary information for your move-in. We are here to support you every step of the way.',
  },
  {
    question: 'What is included in the additional costs?',
    answer:
      'Additional costs typically include utilities such as water, electricity, heating, and maintenance fees. A detailed breakdown will be provided in your rental agreement before signing.',
  },
  {
    question: 'Can I view the apartment?',
    answer:
      'Yes, we offer both in-person and virtual viewing options. Simply contact our team to schedule a tour at your convenience. We are happy to accommodate your preferred viewing method.',
  },
  {
    question: 'How long is the lease?',
    answer:
      'Lease terms are flexible and can range from 6 months to several years, depending on your needs. We offer both short-term and long-term rental options. Specific terms will be discussed during the booking process.',
  },
  {
    question: 'How does billing work?',
    answer:
      'Billing is handled digitally. You will receive monthly invoices via email with a secure payment link. We accept major credit cards, bank transfers, and other convenient payment methods.',
  },
  {
    question: 'How do I change my account email?',
    answer:
      'You can update your email address directly from your account settings page after logging in. Navigate to Settings > Profile and edit your email address. You may need to verify the new email address.',
  },
]

export function FaqPageContent() {
  return (
    <main className="space-y-20 py-12">
      {/* ───────────────────────────────────────
          HERO BANNER — "Find Your Perfect Home"
      ─────────────────────────────────────────── */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-10">
        <div className="relative overflow-hidden rounded-[20px]">
          <Image
            src="/images/banner.jpg"
            alt="Explore homes banner"
            width={1600}
            height={650}
            className="h-[300px] w-full object-cover sm:h-[360px] lg:h-[420px]"
            priority
          />
          <div className="absolute inset-0 bg-black/35" />
          <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center text-white sm:px-8 lg:px-10">
            <h1 className="font-serif font-bold text-3xl md:text-[40px] leading-[150%]">
              <TranslatedText
                text="Find Your Perfect Home"
                cacheKey="faq:hero:title"
              />
            </h1>
            <p className="mt-4 max-w-3xl text-sm md:text-base leading-relaxed text-white/95">
              <TranslatedText
                text="Easily search, compare, and connect with professionally managed apartments and homes. Whether you&apos;re looking for a cozy studio, a family-friendly space, or a stylish city pad, we help you find a safe, comfortable, and move-in ready home without agents or hidden fees."
                cacheKey="faq:hero:subtitle"
              />
            </p>
            <a
              href="/apartments"
              className="mt-8 inline-flex items-center justify-center rounded-lg bg-[#1672E6] px-8 py-3 text-base font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#0f63ce] hover:shadow-lg active:translate-y-px active:scale-[0.98]"
            >
              <TranslatedText text="Explore Houses" cacheKey="faq:hero:cta" />
            </a>
          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────
          FAQ ACCORDION
      ─────────────────────────────────────────── */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-10 ">
        <FaqAccordion
          items={faqs}
          showHeader={true}
          title="Frequently Asked Questions"
          subtitle="Find quick answers to the most common questions about our facilities and services."
        />
      </section>

      {/* ───────────────────────────────────────
          CTA SECTION
      ─────────────────────────────────────────── */}
      <ContactCtaSection />
    </main>
  )
}
