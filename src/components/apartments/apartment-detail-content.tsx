'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { toast } from 'sonner'
import {
  Home,
  BedDouble,
  DoorOpen,
  Calendar,
  CircleCheck,
  ChevronLeft,
  ChevronRight,
  Sofa,
  Car,
  Wifi,
  CookingPot,
  Bell,
  Users,
  PawPrint,
  Flower2,
  Utensils,
  ShieldCheck,
  Wrench,
  FileText,
  Sparkles,
} from 'lucide-react'
import { FaqAccordion, FaqItem } from '@/components/shared/faq-accordion'
import { ContactCtaSection } from '@/components/shared/contact-cta-section'
import { InquiryModal } from '@/components/apartments/inquiry-modal'
import dynamic from 'next/dynamic'
import type { Apartment } from '@/lib/apartments-api'
import { TranslatedText } from '@/components/shared/translated-text'
import { useTranslatedText } from '@/hooks/use-translated-text'

const MapComponent = dynamic(() => import('./MapComponent'), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full rounded-2xl bg-slate-100 flex items-center justify-center border border-slate-200">
      <div className="text-slate-500 font-medium flex flex-col items-center gap-2">
        <span>
          <TranslatedText
            text="Loading Map..."
            cacheKey="apt:loading-map"
          />
        </span>
      </div>
    </div>
  ),
})

// ─────────────────────────────────────────────
// Amenity icon mapping
// ─────────────────────────────────────────────
const amenityIcons: Record<string, React.ReactNode> = {
  Furnished: <Sofa className="h-5 w-5 text-[#1672E6]" />,
  'Transportation & parking': <Car className="h-5 w-5 text-[#1672E6]" />,
  'Wi-Fi': <Wifi className="h-5 w-5 text-[#1672E6]" />,
  Elevator: <DoorOpen className="h-5 w-5 text-[#1672E6]" />,
  'Fitted kitchen': <CookingPot className="h-5 w-5 text-[#1672E6]" />,
  'Emergency Alert System': <Bell className="h-5 w-5 text-[#1672E6]" />,
  'Move-in coordination': <Users className="h-5 w-5 text-[#1672E6]" />,
  'Meal preparation and service': (
    <Utensils className="h-5 w-5 text-[#1672E6]" />
  ),
  'Pet-friendly': <PawPrint className="h-5 w-5 text-[#1672E6]" />,
  Balcony: <Flower2 className="h-5 w-5 text-[#1672E6]" />,
  'Balcony/Terrace': <Flower2 className="h-5 w-5 text-[#1672E6]" />,
  Concierge: <Users className="h-5 w-5 text-[#1672E6]" />,
}

// ─────────────────────────────────────────────
// FAQ data
// ─────────────────────────────────────────────
const faqItems: FaqItem[] = [
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
      'Yes, we offer both in-person and virtual viewing options. Simply contact our team to schedule a tour at your convenience.',
  },
  {
    question: 'How long is the lease?',
    answer:
      'Lease terms are flexible and can range from a few months to several years, depending on your needs. Specific terms will be discussed during the booking process.',
  },
  {
    question: 'How does billing work?',
    answer:
      'Billing is handled digitally. You will receive monthly invoices via email with a secure payment link.',
  },
  {
    question: 'How do I change my account email?',
    answer:
      'You can update your email address directly from your account settings page after logging in.',
  },
]

// ─────────────────────────────────────────────
// Service advantages
// ─────────────────────────────────────────────
const serviceAdvantages = [
  {
    icon: <Sparkles className="h-8 w-8 text-[#1672E6]" />,
    title: 'Professional Cleaning',
    desc: 'We take care of everything.',
  },
  {
    icon: <Wrench className="h-8 w-8 text-[#1672E6]" />,
    title: 'Maintenance & Support',
    desc: '24/7 availability',
  },
  {
    icon: <ShieldCheck className="h-8 w-8 text-[#1672E6]" />,
    title: 'Reliable Tenants',
    desc: 'Credit check included',
  },
  {
    icon: <FileText className="h-8 w-8 text-[#1672E6]" />,
    title: 'Flexible Contracts',
    desc: 'No hidden fees',
  },
]

// ─────────────────────────────────────────────
// Component props
// ─────────────────────────────────────────────
interface Props {
  apartment: Apartment
  allApartments: Apartment[]
}

export function ApartmentDetailContent({ apartment, allApartments }: Props) {
  const router = useRouter()
  const { data: session } = useSession()
  const [selectedImage, setSelectedImage] = useState(0)
  const [inquiryOpen, setInquiryOpen] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const signInToInquireMessage = useTranslatedText(
    'Please sign in to send an inquiry',
    'en',
    { cacheKey: 'apt:toast:sign-in-inquiry' },
  )

  const similarApartments = allApartments.filter(a => a.id !== apartment.id)
  const whyChooseItems =
    apartment.whyChoose.length > 0
      ? apartment.whyChoose
      : [
          'Comfortable Living Spaces - Modern rooms and cozy common areas designed for relaxation.',
          'Professional Support - Our team helps with communication, viewing, and move-in coordination.',
          'Move-in Ready - Furnished setup designed for a smooth temporary stay.',
          'Clear Terms - Transparent pricing and rental details before you commit.',
        ]
  const locationItems =
    apartment.locationHighlights.length > 0
      ? apartment.locationHighlights
      : [
          {
            label: 'Subway/S-Bahn',
            distance: apartment.locationDetails.subway,
          },
          {
            label: 'Restaurants',
            distance: apartment.locationDetails.restaurants,
          },
          {
            label: 'Rhine riverbank',
            distance: apartment.locationDetails.rhine,
          },
        ]

  const updateScrollButtons = () => {
    const el = scrollRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 0)
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4)
  }

  useEffect(() => {
    updateScrollButtons()
  }, [])

  const scroll = (dir: 'left' | 'right') => {
    const el = scrollRef.current
    if (!el) return
    el.scrollBy({ left: dir === 'left' ? -320 : 320, behavior: 'smooth' })
    setTimeout(updateScrollButtons, 400)
  }

  return (
    <main className="pb-16 font-manrope bg-[#F9FBFC] min-h-screen">
      {/* ───────────────────────────────────────
          IMAGE GALLERY
      ─────────────────────────────────────────── */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-10 pt-8">
        {/* Main image */}
        <div className="relative w-full h-[320px] sm:h-[420px] md:h-[480px] rounded-2xl overflow-hidden mb-4">
          <Image
            src={apartment.images[selectedImage]}
            alt={apartment.title}
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Thumbnail strip */}
        <div className="grid grid-cols-4 gap-3">
          {apartment.images.map((img, i) => (
            <button
              key={i}
              onClick={() => setSelectedImage(i)}
              className={`relative h-[80px] sm:h-[110px] md:h-[130px] rounded-xl overflow-hidden transition-all duration-200 ${
                selectedImage === i
                  ? 'ring-3 ring-[#1672E6] ring-offset-2'
                  : 'opacity-70 hover:opacity-100'
              }`}
            >
              <Image
                src={img}
                alt={`${apartment.title} ${i + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      </section>

      {/* ───────────────────────────────────────
          TITLE + PRICE CARD LAYOUT
      ─────────────────────────────────────────── */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-10 mt-10">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* LEFT — Info */}
          <div className="flex-1 min-w-0">
            {/* Title & specs */}
            <h1 className="font-serif text-[#1672E6] text-2xl md:text-[32px] font-bold leading-[150%]">
              <TranslatedText
                text={apartment.title}
                sourceLang="de"
                cacheKey={`apt:title:${apartment.id}`}
              />
            </h1>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-sm text-slate-500 font-medium">
              <span className="flex items-center gap-1.5">
                <Home className="h-4 w-4" />
                {apartment.size} m²
              </span>
              <span className="flex items-center gap-1.5">
                <BedDouble className="h-4 w-4" />
                {apartment.rooms}{' '}
                <TranslatedText text="Rooms" cacheKey="apt:rooms" />
              </span>
              <span className="flex items-center gap-1.5">
                <DoorOpen className="h-4 w-4" />
                {apartment.hasBalcony ? (
                  <TranslatedText text="Balcony" cacheKey="apt:balcony" />
                ) : (
                  <TranslatedText text="No Balcony" cacheKey="apt:no-balcony" />
                )}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                <TranslatedText
                  text="Available from"
                  cacheKey="apt:available"
                />{' '}
                {apartment.availableFrom}
              </span>
            </div>

            {/* Divider */}
            <div className="border-t border-slate-200 mt-6 pt-6" />

            {/* Description */}
            <h2 className="font-sans text-slate-800 text-lg font-semibold mb-3">
              <TranslatedText text="Description" cacheKey="apt:desc:title" />
            </h2>
            <div className="text-sm text-slate-500 leading-relaxed whitespace-pre-line">
              <TranslatedText
                text={apartment.description}
                sourceLang="de"
                cacheKey={`apt:desc:${apartment.id}`}
              />
            </div>

            {/* Divider */}
            <div className="border-t border-slate-200 mt-8 pt-8" />

            {/* Amenities */}
            <h2 className="font-sans text-slate-800 text-lg font-semibold mb-5">
              <TranslatedText text="Amenities" cacheKey="apt:amenities:title" />
            </h2>
            <div className="grid grid-cols-2 gap-x-8 gap-y-4">
              {apartment.amenities.map(amenity => (
                <div key={amenity} className="flex items-center gap-3">
                  {amenityIcons[amenity] || (
                    <CircleCheck className="h-5 w-5 text-[#1672E6]" />
                  )}
                  <span className="text-sm text-slate-600 font-medium">
                    <TranslatedText
                      text={amenity}
                      cacheKey={`apt:amenity:${amenity}`}
                    />
                  </span>
                </div>
              ))}
            </div>

            {/* Divider */}
            <div className="border-t border-slate-200 mt-8 pt-8" />

            {/* Why Choose */}
            <h2 className="font-sans text-slate-800 text-lg font-bold mb-4">
              <TranslatedText
                text={`Why Choose ${apartment.title}?`}
                sourceLang="de"
                cacheKey={`apt:why:title:${apartment.id}`}
              />
            </h2>
            <ul className="space-y-2.5">
              {whyChooseItems.map((item, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-sm text-slate-500 leading-relaxed"
                >
                  <span className="mt-1 shrink-0 h-1.5 w-1.5 rounded-full bg-slate-400" />
                  <TranslatedText
                    text={item}
                    sourceLang="de"
                    cacheKey={`apt:why:${apartment.id}:${i}`}
                  />
                </li>
              ))}
            </ul>
          </div>

          {/* RIGHT — Price card */}
          <div className="w-full lg:w-[320px] shrink-0 sticky top-24">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_4px_25px_rgba(0,0,0,0.04)] p-6">
              <p className="text-3xl font-bold text-slate-800">
                {apartment.price.toLocaleString('de-DE')} €
              </p>
              <p className="text-sm text-slate-400 font-medium mt-0.5">
                <TranslatedText text="per month" cacheKey="apt:price:month" />
              </p>

              <div className="border-t border-slate-100 mt-5 pt-5 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">
                    <TranslatedText
                      text="Minimum stay"
                      cacheKey="apt:min-stay"
                    />
                  </span>
                  <span className="font-semibold text-slate-700">
                    {apartment.minimumStay}{' '}
                    <TranslatedText text="months" cacheKey="apt:months" />
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">
                    <TranslatedText text="Deposit" cacheKey="apt:deposit" />
                  </span>
                  <span className="font-semibold text-slate-700">
                    {apartment.deposit.toLocaleString('de-DE')} €
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">
                    <TranslatedText
                      text="Service fee"
                      cacheKey="apt:service-fee"
                    />
                  </span>
                  <span className="font-semibold text-slate-700">
                    {apartment.serviceFee}
                  </span>
                </div>
              </div>

              <button
                onClick={() => {
                  if (!session) {
                    toast.error(signInToInquireMessage)
                    router.push('/login')
                    return
                  }
                  setInquiryOpen(true)
                }}
                className="w-full mt-6 bg-[#1672E6] hover:bg-[#0f63ce] text-white text-sm font-bold py-3.5 rounded-xl shadow-sm transition-all duration-200 active:scale-[0.98]"
              >
                <TranslatedText
                  text="Send Inquiry"
                  cacheKey="apt:send-inquiry"
                />
              </button>
              <p className="text-center text-xs text-slate-400 mt-2">
                <TranslatedText
                  text="Response within 24 hours"
                  cacheKey="apt:response"
                />
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────
          LOCATION SECTION
      ─────────────────────────────────────────── */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-10 mt-16">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          <div className="flex-1">
            <h2 className="font-serif text-[#1672E6] text-2xl md:text-[28px] font-bold leading-[150%]">
              <TranslatedText text="Location" cacheKey="apt:location:title" />:{' '}
              <TranslatedText
                text={apartment.district}
                sourceLang="de"
                cacheKey={`apt:location:district:${apartment.id}`}
              />
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              <TranslatedText
                text={apartment.locationSubtitle}
                sourceLang="de"
                cacheKey={`apt:location:subtitle:${apartment.id}`}
              />
            </p>
            <p className="text-sm text-slate-500 leading-relaxed mt-4 max-w-lg">
              <TranslatedText
                text={apartment.locationDescription}
                sourceLang="de"
                cacheKey={`apt:location:desc:${apartment.id}`}
              />
            </p>
            <div className="mt-5 space-y-2">
              {locationItems.map(item => (
                <div
                  key={item.label}
                  className="flex items-center gap-2 text-sm text-slate-600"
                >
                  <CircleCheck className="h-4 w-4 text-[#1672E6]" />
                  <TranslatedText
                    text={item.label}
                    sourceLang="de"
                    cacheKey={`apt:location:item:${item.label}`}
                  />{' '}
                  : {item.distance}
                </div>
              ))}
            </div>
          </div>
          <div className="w-full lg:w-[480px] h-[300px] shrink-0">
            <MapComponent
              apartments={[apartment]}
              center={[apartment.lat, apartment.lng]}
              zoom={15}
            />
          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────
          SERVICE ADVANTAGES
      ─────────────────────────────────────────── */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-10 mt-16">
          <h2 className="font-sans text-slate-800 text-lg font-bold mb-8">
          <TranslatedText
            text="Your 0211 service advantage"
            cacheKey="apt:advantage:title"
          />
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {serviceAdvantages.map(item => (
            <div
              key={item.title}
              className="flex flex-col items-center text-center"
            >
              <div className="h-16 w-16 rounded-full bg-[#EAF3FF] flex items-center justify-center mb-3">
                {item.icon}
              </div>
              <h4 className="font-semibold text-slate-800 text-sm">
                <TranslatedText
                  text={item.title}
                  cacheKey={`apt:advantage:${item.title}`}
                />
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                <TranslatedText
                  text={item.desc}
                  cacheKey={`apt:advantage-desc:${item.title}`}
                />
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ───────────────────────────────────────
          SIMILAR FACILITIES CAROUSEL
      ─────────────────────────────────────────── */}
      <section className="bg-[#F3F6F9] mt-16 py-14">
        <div className="container mx-auto px-4 sm:px-6 lg:px-10">
          <div className="text-center mb-8">
            <h2 className="font-serif text-[#1672E6] text-2xl md:text-[32px] font-bold leading-[150%]">
              <TranslatedText
                text="Similar Facilities"
                cacheKey="apt:similar:title"
              />
            </h2>
            <p className="text-sm text-slate-500 mt-1 max-w-xl mx-auto">
              <TranslatedText
                text="Discover highlighted living options carefully tailored to meet the needs of families and their loved ones."
                cacheKey="apt:similar:subtitle"
              />
            </p>
          </div>

          <div className="relative">
            <div
              ref={scrollRef}
              onScroll={updateScrollButtons}
              className="flex gap-6 overflow-x-auto scrollbar-hide pb-4 snap-x snap-mandatory"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {similarApartments.map(apt => (
                <div
                  key={apt.id}
                  className="min-w-[280px] max-w-[300px] bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-[0_4px_25px_rgba(0,0,0,0.02)] flex flex-col snap-start shrink-0 group"
                >
                  <div className="relative h-[200px] w-full overflow-hidden">
                    <Image
                      src={apt.image}
                      alt={apt.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-5 flex flex-col flex-1 justify-between">
                    <div>
                      <h3 className="font-sans font-semibold text-slate-800 text-base mb-1 group-hover:text-[#1672E6] transition-colors">
                        {apt.title}
                      </h3>
                      <p className="text-xs text-slate-400 font-semibold tracking-wide uppercase mb-2">
                        {apt.size} m² | {apt.rooms}{' '}
                        <TranslatedText text="Rooms" cacheKey="apt:rooms" /> |{' '}
                        {apt.hasBalcony ? (
                          <TranslatedText text="Balcony" cacheKey="apt:balcony" />
                        ) : (
                          <TranslatedText
                            text="No Balcony"
                            cacheKey="apt:no-balcony"
                          />
                        )}
                      </p>
                      <p className="text-[#1672E6] font-bold text-lg">
                        {apt.price.toLocaleString('de-DE')} €{' '}
                        <span className="text-xs text-slate-400 font-semibold">
                          <TranslatedText text="/ Month" cacheKey="apt:month" />
                        </span>
                      </p>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-4">
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold">
                        <CircleCheck className="h-4 w-4 text-[#22C55E]" />
                        <TranslatedText
                          text="Available from"
                          cacheKey="apt:available"
                        />{' '}
                        {apt.availableFrom}
                      </div>
                      <Link
                        href={`/apartments/${apt.id}`}
                        className="border-2 border-[#1672E6] text-[#1672E6] hover:bg-[#1672E6] hover:text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-all duration-200"
                      >
                        <TranslatedText text="Details" cacheKey="apt:details" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Carousel nav */}
            <div className="flex items-center justify-center gap-3 mt-6">
              <button
                onClick={() => scroll('left')}
                disabled={!canScrollLeft}
                className="h-9 w-9 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-400 hover:text-slate-700 disabled:opacity-30 transition-all shadow-sm"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={() => scroll('right')}
                disabled={!canScrollRight}
                className="h-9 w-9 rounded-full border border-[#1672E6] bg-white flex items-center justify-center text-[#1672E6] hover:bg-[#1672E6] hover:text-white disabled:opacity-30 transition-all shadow-sm"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────
          BOTTOM BANNER
      ─────────────────────────────────────────── */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-10 mt-16">
        <div className="relative overflow-hidden rounded-[20px]">
          <Image
            src="/images/banner.jpg"
            alt="Explore homes banner"
            width={1600}
            height={650}
            className="h-[360px] w-full object-cover"
          />
          <div className="absolute inset-0 bg-black/35" />
          <div className="absolute inset-0 flex flex-col items-center justify-center px-10 text-center text-white">
            <h3 className="font-serif font-bold text-3xl md:text-[40px] leading-[150%]">
              <TranslatedText
                text="Find Your Perfect Home"
                cacheKey="apt:banner:title"
              />
            </h3>
            <p className="mt-4 max-w-3xl text-sm md:text-base leading-relaxed text-white/95">
              <TranslatedText
                text="Easily search, compare, and connect with professionally managed apartments and homes. Whether you&apos;re looking for a cozy studio, a family-friendly space, or a stylish city pad, we help you find a safe, comfortable, and move-in ready home without agents or hidden fees."
                cacheKey="apt:banner:subtitle"
              />
            </p>
            <Link
              href="/apartments"
              className="mt-8 rounded-lg bg-[#1672E6] px-8 py-3 text-base font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#0f63ce] hover:shadow-lg active:translate-y-px active:scale-[0.98]"
            >
              <TranslatedText text="Explore Houses" cacheKey="apt:banner:button" />
            </Link>
          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────
          FAQ SECTION
      ─────────────────────────────────────────── */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-10 mt-16">
        <FaqAccordion items={faqItems} />
      </section>

      {/* ───────────────────────────────────────
          CONTACT CTA
      ─────────────────────────────────────────── */}
      <div className="mt-16">
        <ContactCtaSection />
      </div>

      <InquiryModal
        open={inquiryOpen}
        onOpenChange={setInquiryOpen}
        onOfficeId={apartment.onOfficeId}
        apartmentTitle={apartment.title}
      />
    </main>
  )
}
