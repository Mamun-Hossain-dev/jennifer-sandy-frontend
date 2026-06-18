import Image from 'next/image'
import { ContactForm, ContactInfo } from '@/components/contact/contact-form'
import { GoogleMapEmbed } from '@/components/contact/google-map'

export default function ContactUsPage() {
  return (
    <div className="min-h-screen bg-[#F3F3F3] font-manrope">
      <main className="py-12">
        <section className="container mx-auto px-6 lg:px-10 mb-12">
          <div className="relative w-full h-48 md:h-56 rounded-xl overflow-hidden">
            <Image
              src="/images/banner.jpg"
              alt="Reach out to us"
              fill
              className="object-cover object-[center_25%]"
              priority
            />
            <div className="absolute inset-0 bg-black/45" />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
              <h1 className="text-white text-2xl md:text-3xl font-semibold mb-2">
                Reach Out to 0211wohnen for Support & Guidance
              </h1>
              <p className="text-white/80 text-sm max-w-xl">
                Our team is ready to assist you with any questions, provide
                guidance, and help you confidently connect with the most
                suitable assisted living facilities for your loved ones.
              </p>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-6 lg:px-10 mb-10">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              <div>
                <h2 className="text-2xl font-semibold text-[#1672E6] mb-1">
                  Get in Touch
                </h2>
                <p className="text-gray-500 text-sm mb-6">
                  Our friendly team would love to hear from you.
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

        <section className="container mx-auto px-6 lg:px-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          <GoogleMapEmbed />
          <ContactInfo />
        </section>
      </main>
    </div>
  )
}
