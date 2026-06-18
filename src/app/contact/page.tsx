import Image from 'next/image'
import { ContactForm, ContactInfo } from '@/components/contact/contact-form'
import { GoogleMapEmbed } from '@/components/contact/google-map'
import { TranslatedText } from '@/components/shared/translated-text'

export default function ContactUsPage() {
  return (
    <div className="min-h-screen bg-[#F3F3F3] font-manrope">
      <main className="py-12">
        <section className="container mx-auto mb-12 px-4 sm:px-6 lg:px-10">
          <div className="relative h-40 w-full overflow-hidden rounded-xl sm:h-48 md:h-56">
            <Image
              src="/images/banner.jpg"
              alt="Reach out to us"
              fill
              className="object-cover object-[center_25%]"
              priority
            />
            <div className="absolute inset-0 bg-black/45" />
            <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
              <h1 className="mb-2 text-2xl font-semibold text-white md:text-3xl">
                <TranslatedText
                  text="Reach Out to 0211wohnen for Support & Guidance"
                  cacheKey="contact:page:title"
                />
              </h1>
              <p className="text-white/80 text-sm max-w-xl">
                <TranslatedText
                  text="Our team is ready to assist you with any questions, provide guidance, and help you confidently connect with the most suitable assisted living facilities for your loved ones."
                  cacheKey="contact:page:subtitle"
                />
              </p>
            </div>
          </div>
        </section>

        <section className="container mx-auto mb-10 px-4 sm:px-6 lg:px-10">
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm md:p-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              <div>
                <h2 className="text-2xl font-semibold text-[#1672E6] mb-1">
                  <TranslatedText text="Get in Touch" cacheKey="contact:page:heading" />
                </h2>
                <p className="text-gray-500 text-sm mb-6">
                  <TranslatedText
                    text="Our friendly team would love to hear from you."
                    cacheKey="contact:page:subheading"
                  />
                </p>
                <ContactForm />
              </div>

              <div className="hidden md:block relative h-full min-h-[400px] rounded-xl overflow-hidden">
                <Image
                  src="/images/connect-1.jpg"
                  alt="Happy family"
                  fill
                  className="object-cover rounded-xl"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="container mx-auto grid grid-cols-1 items-start gap-8 px-4 sm:px-6 lg:px-10 md:grid-cols-2">
          <GoogleMapEmbed />
          <ContactInfo />
        </section>
      </main>
    </div>
  )
}
