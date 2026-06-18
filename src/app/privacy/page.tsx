import Image from 'next/image'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy | 0211wohnen',
  description:
    'Learn how 0211wohnen collects, uses, and protects your personal data in accordance with GDPR.',
}

const sections = [
  {
    id: 'introduction',
    heading: '1. Introduction',
    content: [
      {
        type: 'paragraph',
        text: '0211wohnen GmbH ("we", "us", or "our") is committed to protecting your personal data and respecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services.',
      },
      {
        type: 'paragraph',
        text: 'This policy is written in compliance with the General Data Protection Regulation (GDPR) (EU) 2016/679 and the German Federal Data Protection Act (Bundesdatenschutzgesetz, BDSG). By using our Service, you consent to the data practices described in this policy.',
      },
    ],
  },
  {
    id: 'data-controller',
    heading: '2. Data Controller',
    content: [
      {
        type: 'paragraph',
        text: 'The data controller responsible for your personal data is:',
      },
      {
        type: 'bullets',
        items: [
          'Company: 0211wohnen GmbH',
          'Address: Medienhafen, Düsseldorf, Germany',
          'Email: contact@0211wohnen.de',
          'Phone: +49 211 12345678',
        ],
      },
    ],
  },
  {
    id: 'data-collected',
    heading: '3. Data We Collect',
    content: [
      {
        type: 'paragraph',
        text: 'We collect information that you provide directly to us, as well as information collected automatically when you use our Service.',
      },
      {
        type: 'numbered',
        heading: 'Personal data you provide:',
        items: [
          'Name and contact information (email address, phone number)',
          'Account registration details',
          'Inquiry and message content submitted through our contact form',
          'Property listing details submitted by landlords',
          'Payment information (processed securely by third-party providers)',
        ],
      },
      {
        type: 'numbered',
        heading: 'Data collected automatically:',
        items: [
          'IP address and browser type',
          'Pages visited and time spent on the Service',
          'Referring URLs and search terms',
          'Device type and operating system',
          'Cookie and tracking data (see Section 7)',
        ],
      },
    ],
  },
  {
    id: 'legal-basis',
    heading: '4. Legal Basis for Processing',
    content: [
      {
        type: 'paragraph',
        text: 'We process your personal data under the following legal bases as defined by GDPR Article 6:',
      },
      {
        type: 'bullets',
        items: [
          'Consent (Art. 6(1)(a)): where you have given explicit consent, e.g. for marketing emails',
          'Contract performance (Art. 6(1)(b)): where processing is necessary to provide our services',
          'Legal obligation (Art. 6(1)(c)): where required by applicable law',
          'Legitimate interests (Art. 6(1)(f)): for improving our services and preventing fraud',
        ],
      },
    ],
  },
  {
    id: 'use-of-data',
    heading: '5. How We Use Your Data',
    content: [
      {
        type: 'paragraph',
        text: 'We use the data we collect for the following purposes:',
      },
      {
        type: 'bullets',
        items: [
          'To create and manage your account',
          'To provide, maintain, and improve our services',
          'To process and respond to your inquiries',
          'To connect tenants with landlords',
          'To send service-related communications and updates',
          'To send marketing communications where you have given consent',
          'To comply with legal obligations',
          'To detect and prevent fraudulent activity',
          'To analyze usage and improve user experience',
        ],
      },
    ],
  },
  {
    id: 'data-sharing',
    heading: '6. Data Sharing and Disclosure',
    content: [
      {
        type: 'paragraph',
        text: 'We do not sell your personal data. We may share your information with third parties only in limited circumstances.',
      },
      {
        type: 'bullets',
        items: [
          'Service providers who assist in operating our platform',
          'Landlords or tenants as necessary to facilitate a rental transaction',
          'Law enforcement or regulatory authorities when required by law',
          'Successor entities in the event of a merger or acquisition',
        ],
      },
    ],
  },
  {
    id: 'cookies',
    heading: '7. Cookies and Tracking',
    content: [
      {
        type: 'paragraph',
        text: 'We use cookies and similar tracking technologies to enhance your experience on our Service.',
      },
      {
        type: 'bullets',
        items: [
          'Essential cookies: required for the Service to function',
          'Analytics cookies: help us understand how users interact with our Service',
          'Preference cookies: remember your settings and preferences',
          'Marketing cookies: used to deliver relevant advertisements (only with your consent)',
        ],
      },
    ],
  },
  {
    id: 'retention',
    heading: '8. Data Retention',
    content: [
      {
        type: 'paragraph',
        text: 'We retain your personal data only for as long as necessary to fulfill the purposes outlined in this policy, unless a longer retention period is required or permitted by law.',
      },
    ],
  },
  {
    id: 'your-rights',
    heading: '9. Your Rights Under GDPR',
    content: [
      {
        type: 'paragraph',
        text: 'As a data subject under GDPR, you have the following rights:',
      },
      {
        type: 'bullets',
        items: [
          'Right of access: request a copy of the personal data we hold about you',
          'Right to rectification: request correction of inaccurate or incomplete data',
          'Right to erasure: request deletion of your personal data',
          'Right to restriction: request that we limit how we process your data',
          'Right to data portability: receive your data in a structured, machine-readable format',
          'Right to object: object to processing based on legitimate interests or for direct marketing',
          'Right to withdraw consent: where processing is based on consent, you may withdraw at any time',
        ],
      },
      {
        type: 'paragraph',
        text: 'To exercise any of these rights, please contact us at contact@0211wohnen.de. We will respond within 30 days.',
      },
    ],
  },
  {
    id: 'security',
    heading: '10. Data Security',
    content: [
      {
        type: 'paragraph',
        text: 'We implement appropriate technical and organizational security measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction.',
      },
    ],
  },
  {
    id: 'changes',
    heading: '11. Changes to This Policy',
    content: [
      {
        type: 'paragraph',
        text: 'We may update this Privacy Policy from time to time. We will notify you of significant changes by posting a notice on our website or sending an email.',
      },
    ],
  },
]

type ContentBlock =
  | { type: 'paragraph'; text: string }
  | { type: 'bullets'; items: string[] }
  | { type: 'numbered'; heading: string; items: string[] }

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
          if (block.type === 'numbered') {
            return (
              <div key={i}>
                <p className="text-sm text-gray-700 font-medium mb-2">
                  {block.heading}
                </p>
                <ul className="space-y-1.5 ml-1">
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
              </div>
            )
          }
          return null
        })}
      </div>
    </div>
  )
}

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#F3F3F3] font-manrope">
      <main className="py-12">
        <section className="container mx-auto px-6 lg:px-10 mb-12">
          <div className="relative w-full h-48 md:h-56 rounded-xl overflow-hidden">
            <Image
              src="/images/about-banner.jpg"
              alt="Privacy Policy"
              fill
              className="object-cover object-[center_25%]"
              priority
            />
            <div className="absolute inset-0 bg-black/50" />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
              <h1 className="text-white text-2xl md:text-3xl font-semibold mb-2">
                Privacy Policy
              </h1>
              <p className="text-white/80 text-sm max-w-xl">
                Your privacy matters to us. Learn how we collect, use, and
                protect your personal data in accordance with GDPR.
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
