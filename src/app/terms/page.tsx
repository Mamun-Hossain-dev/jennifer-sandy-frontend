import Image from 'next/image'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms & Conditions | 0211wohnen',
  description:
    'Read the terms and conditions governing your use of the 0211wohnen platform and services.',
}

const sections = [
  {
    id: 'acceptance',
    heading: '1. Acceptance of Terms',
    content: [
      {
        type: 'paragraph',
        text: 'By accessing or using the 0211wohnen website and services (collectively, the "Service"), you agree to be bound by these Terms and Conditions ("Terms"). If you do not agree to these Terms, please do not use the Service. These Terms constitute a legally binding agreement between you and 0211wohnen GmbH ("we", "us", or "our").',
      },
      {
        type: 'paragraph',
        text: 'We reserve the right to update or modify these Terms at any time without prior notice. Your continued use of the Service following any changes constitutes your acceptance of the revised Terms. We encourage you to review these Terms periodically to stay informed of any updates.',
      },
    ],
  },
  {
    id: 'services',
    heading: '2. Description of Services',
    content: [
      {
        type: 'paragraph',
        text: '0211wohnen provides an online platform connecting tenants with landlords offering furnished temporary accommodation in Düsseldorf. Our services include, but are not limited to:',
      },
      {
        type: 'bullets',
        items: [
          'Listing and searching for furnished apartments',
          'Apartment valuation tools for landlords',
          'Landlord service and process management',
          'Communication tools between tenants and landlords',
          'Blog and magazine content related to Düsseldorf living',
        ],
      },
      {
        type: 'paragraph',
        text: 'We act solely as an intermediary platform and are not a party to any rental agreements entered into between tenants and landlords. Any rental contract is exclusively between the tenant and the landlord.',
      },
    ],
  },
  {
    id: 'user-accounts',
    heading: '3. User Accounts',
    content: [
      {
        type: 'paragraph',
        text: 'To access certain features of the Service, you may be required to create an account. You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete.',
      },
      {
        type: 'paragraph',
        text: 'You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account.',
      },
      {
        type: 'bullets',
        items: [
          'You must be at least 18 years old to create an account',
          'One person or legal entity may not maintain more than one account',
          'Accounts are non-transferable',
          'We reserve the right to suspend or terminate accounts at our discretion',
        ],
      },
    ],
  },
  {
    id: 'user-conduct',
    heading: '4. User Conduct',
    content: [
      {
        type: 'paragraph',
        text: 'You agree to use the Service only for lawful purposes and in a manner that does not infringe the rights of others or restrict their use and enjoyment of the Service.',
      },
      {
        type: 'bullets',
        items: [
          'Posting false, inaccurate, misleading, or fraudulent listings',
          'Harassing, threatening, or intimidating other users',
          'Using automated tools to scrape or collect data from the platform',
          'Attempting to gain unauthorized access to any part of the Service',
          'Transmitting viruses, malware, or other harmful code',
          'Violating any applicable local, national, or international law or regulation',
        ],
      },
    ],
  },
  {
    id: 'intellectual-property',
    heading: '5. Intellectual Property',
    content: [
      {
        type: 'paragraph',
        text: 'All content on the Service, including but not limited to text, graphics, logos, images, and software, is the property of 0211wohnen GmbH or its content suppliers and is protected by applicable intellectual property laws.',
      },
      {
        type: 'paragraph',
        text: 'By submitting content to the Service (such as property listings, photos, or reviews), you grant us a non-exclusive, worldwide, royalty-free license to use, display, reproduce, and distribute that content in connection with operating and promoting the Service.',
      },
    ],
  },
  {
    id: 'disclaimer',
    heading: '6. Disclaimer of Warranties',
    content: [
      {
        type: 'paragraph',
        text: 'The Service is provided on an "as is" and "as available" basis without warranties of any kind, either express or implied. We do not warrant that the Service will be uninterrupted, error-free, or free of viruses or other harmful components.',
      },
    ],
  },
  {
    id: 'governing-law',
    heading: '7. Governing Law',
    content: [
      {
        type: 'paragraph',
        text: 'These Terms shall be governed by and construed in accordance with the laws of the Federal Republic of Germany, without regard to its conflict of law provisions. Any disputes arising under these Terms shall be subject to the exclusive jurisdiction of the courts located in Düsseldorf, Germany.',
      },
    ],
  },
  {
    id: 'contact',
    heading: '8. Contact Us',
    content: [
      {
        type: 'paragraph',
        text: 'If you have any questions about these Terms and Conditions, please contact us:',
      },
      {
        type: 'bullets',
        items: [
          'Email: contact@0211wohnen.de',
          'Phone: +49 211 12345678',
          'Address: 0211wohnen GmbH, Medienhafen, Düsseldorf, Germany',
        ],
      },
    ],
  },
]

type ContentBlock =
  | { type: 'paragraph'; text: string }
  | { type: 'bullets'; items: string[] }

function Section({
  heading,
  content,
}: {
  heading: string
  content: ContentBlock[]
}) {
  return (
    <div className="mb-10">
      <h2 className="text-base font-semibold text-gray-900 mb-3">{heading}</h2>
      <div className="space-y-3">
        {content.map((block, i) => {
          if (block.type === 'paragraph') {
            return (
              <p key={i} className="text-sm text-gray-600 leading-relaxed">
                {block.text}
              </p>
            )
          }
          if (block.type === 'bullets') {
            return (
              <ul key={i} className="space-y-1.5 ml-1">
                {block.items.map((item, j) => (
                  <li
                    key={j}
                    className="flex items-start gap-2 text-sm text-gray-600"
                  >
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gray-400 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            )
          }
          return null
        })}
      </div>
    </div>
  )
}

export default function TermsAndConditionsPage() {
  return (
    <div className="min-h-screen bg-[#F3F3F3] font-manrope">
      <main className="py-12">
        <section className="container mx-auto px-6 lg:px-10 mb-12">
          <div className="relative w-full h-48 md:h-56 rounded-xl overflow-hidden">
            <Image
              src="/images/about-banner.jpg"
              alt="Terms and Conditions"
              fill
              className="object-cover object-[center_25%]"
              priority
            />
            <div className="absolute inset-0 bg-black/50" />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
              <h1 className="text-white text-2xl md:text-3xl font-semibold mb-2">
                Terms & Conditions
              </h1>
              <p className="text-white/80 text-sm max-w-xl">
                Please read these terms carefully before using the 0211wohnen
                platform and services.
              </p>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-6 lg:px-10">
          <div className="mx-auto container">
            {sections.map(section => (
              <Section
                key={section.id}
                heading={section.heading}
                content={section.content as ContentBlock[]}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
