'use client'

import Image from 'next/image'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { useEffect, useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  CircleCheck,
  Expand,
  Heart,
  MapPin,
  Share2,
  Shield,
  ShieldCheck,
} from 'lucide-react'
import { FaqAccordion } from '@/components/shared/faq-accordion'
import { Skeleton } from '@/components/ui/skeleton'
import {
  fetchApartments,
  fetchPopularAreas,
} from '@/lib/apartments-api'
import { fetchBlogs, type BlogPost } from '@/lib/blog-api'
import { stripHtml } from '@/lib/utils'

const MapComponent = dynamic(() => import('@/components/apartments/MapComponent'), {
  ssr: false,
  loading: () => <Skeleton className="h-full w-full rounded-md" />,
})

const fallbackPopularAreas = [
  {
    title: 'Studio Apartments',
    count: '08 Apartments',
    image: '/images/properties-1.jpg',
  },
  {
    title: 'Old Town Lifestyle',
    count: '15 Apartments',
    image: '/images/properties-2.jpg',
  },
  {
    title: '1-2 Bedroom Apartments',
    count: '12 Apartments',
    image: '/images/properties-3.jpg',
  },
  {
    title: 'Luxury Apartments',
    count: '05 Apartments',
    image: '/images/properties-4.jpg',
  },
]

const fallbackPropertyImages = [
  '/images/properties-2.jpg',
  '/images/properties-3.jpg',
  '/images/properties-4.jpg',
]

const areaImages = [
  '/images/properties-1.jpg',
  '/images/properties-2.jpg',
  '/images/properties-3.jpg',
  '/images/properties-4.jpg',
]

const faqItems = [
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

function formatPrice(price?: number) {
  if (!price) return 'Price on request'

  return `${price.toLocaleString('de-DE')} EUR`
}

function getBlogExcerpt(blog?: BlogPost) {
  if (!blog) return ''

  return stripHtml(blog.excerpt || blog.content || '')
}

export function HomeContentSections() {
  const [activePropertyImage, setActivePropertyImage] = useState(0)

  const { data: apartmentData, isLoading: isApartmentsLoading } = useQuery({
    queryKey: ['home-featured-apartments'],
    queryFn: () =>
      fetchApartments({
        page: 1,
        limit: 6,
        sortBy: 'createdAt',
        sortOrder: 'desc',
      }),
    staleTime: 1000 * 60 * 5,
  })
  const { data: popularAreaData = [], isLoading: isAreasLoading } = useQuery({
    queryKey: ['home-content-popular-areas'],
    queryFn: fetchPopularAreas,
    staleTime: 1000 * 60 * 10,
  })
  const { data: blogData, isLoading: isBlogLoading } = useQuery({
    queryKey: ['home-latest-blog'],
    queryFn: () => fetchBlogs({ page: 1, limit: 1 }),
    staleTime: 1000 * 60 * 5,
  })

  const apartments = apartmentData?.apartments ?? []
  const featuredApartment = apartments[0]
  const propertyImages =
    featuredApartment?.images?.length ? featuredApartment.images : fallbackPropertyImages
  const latestBlog = blogData?.data?.[0]
  const blogExcerpt = getBlogExcerpt(latestBlog)
  const homeAreas = useMemo(() => {
    if (popularAreaData.length === 0) return fallbackPopularAreas

    return popularAreaData.slice(0, 4).map((area, index) => ({
      title: area.district || area.city || 'Düsseldorf',
      count: `${area.count.toString().padStart(2, '0')} Apartments`,
      image: areaImages[index % areaImages.length],
    }))
  }, [popularAreaData])

  useEffect(() => {
    if (propertyImages.length <= 1) return undefined

    const interval = setInterval(
      () => setActivePropertyImage(p => (p + 1) % propertyImages.length),
      5000,
    )
    return () => clearInterval(interval)
  }, [propertyImages.length])

  useEffect(() => {
    setActivePropertyImage(0)
  }, [featuredApartment?.id])

  return (
    <>
      <section className="container mx-auto px-6 lg:px-10">
        <div className="mb-6 flex items-center gap-3">
          <h2 className="section-title text-[#1672E6]">Map View</h2>
          <Shield className="h-9 w-9 text-[#1672E6]" strokeWidth={2.2} />
        </div>
        <div className="relative h-[360px] overflow-hidden rounded-md bg-[#D8D8D8]">
          {isApartmentsLoading ? (
            <Skeleton className="h-full w-full rounded-md" />
          ) : apartments.length > 0 ? (
            <MapComponent apartments={apartments} />
          ) : (
            <>
              <div className="absolute left-0 top-0 h-full w-[23%] bg-[#6ea8e8]" />
              <div className="absolute right-0 top-0 h-full w-[25%] bg-[#8ecfae]" />
              <div className="absolute left-[21%] top-[20%] h-[65%] w-[60%] rounded-[120px] border-[24px] border-[#f0de23]" />
              <div className="absolute inset-0 opacity-65">
                <div className="absolute left-[2%] top-[35%] h-[10px] w-[96%] rotate-[8deg] bg-white/80" />
                <div className="absolute left-[4%] top-[58%] h-[9px] w-[90%] -rotate-[12deg] bg-white/80" />
                <div className="absolute left-[30%] top-[10%] h-[8px] w-[60%] rotate-[20deg] bg-white/80" />
              </div>
              <MapPin className="absolute left-[33%] top-[42%] h-12 w-12 fill-red-600 text-red-600" />
              <MapPin className="absolute left-[73%] top-[25%] h-12 w-12 fill-red-600 text-red-600" />
            </>
          )}
        </div>
      </section>

      <section className="container mx-auto px-6 lg:px-10">
        <h2 className="section-title text-[#1672E6]">Popular Areas</h2>
        <p className="section-desc mt-2 text-slate-500">
          Move In Ready: Professional Furnished Apartments, Zero Agent Fees
        </p>
        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {isAreasLoading
            ? Array.from({ length: 4 }).map((_, index) => (
                <article
                  key={index}
                  className="overflow-hidden rounded-lg bg-[#EEF0F3]"
                >
                  <Skeleton className="h-[320px] w-full rounded-none" />
                  <div className="space-y-3 px-4 py-4">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </article>
              ))
            : homeAreas.map(area => (
                <Link
                  key={area.title}
                  href={`/apartments?district=${encodeURIComponent(area.title)}`}
                  className="overflow-hidden rounded-lg bg-[#EEF0F3] transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="relative h-[320px] w-full">
                    <Image
                      src={area.image}
                      alt={area.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex items-center justify-between px-4 pb-2 pt-4">
                    <h3 className="text-xl text-[#1672E6]">{area.title}</h3>
                    <ArrowRight className="h-5 w-5 text-[#1672E6]" />
                  </div>
                  <p className="px-4 pb-4 text-sm text-[#6EA8E8]">{area.count}</p>
                </Link>
              ))}
        </div>
      </section>

      <section className="container mx-auto px-6 pb-20 lg:px-10">
        <h2 className="section-title text-center text-[#1672E6]">
          Our Properties View
        </h2>
        <p className="section-desc mt-2 text-center text-slate-500">
          Your Guide to Hassle-Free Renting and Stylish, Fully-Furnished Homes
        </p>
        <div className="relative mt-8 overflow-hidden rounded-[10px]">
          {isApartmentsLoading ? (
            <Skeleton className="h-[620px] w-full rounded-none" />
          ) : (
            <Image
              src={propertyImages[activePropertyImage] || fallbackPropertyImages[0]}
              alt={featuredApartment?.title || 'Active property view'}
              width={1500}
              height={850}
              className="h-[620px] w-full object-cover transition-opacity duration-500"
            />
          )}
          <div className="absolute right-8 top-8 flex items-center gap-3">
            <button
              type="button"
              className="rounded-xl bg-white/90 p-3 text-slate-700 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-white hover:shadow-md active:translate-y-px active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
            >
              <Expand className="h-6 w-6" />
            </button>
            <button
              type="button"
              className="rounded-xl bg-white/90 p-3 text-slate-700 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-white hover:shadow-md active:translate-y-px active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
            >
              <Share2 className="h-6 w-6" />
            </button>
            <button
              type="button"
              className="rounded-xl bg-white/90 p-3 text-slate-700 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-white hover:shadow-md active:translate-y-px active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
            >
              <Heart className="h-6 w-6" />
            </button>
          </div>
          <button
            type="button"
            onClick={() =>
              setActivePropertyImage(index =>
                index === 0 ? propertyImages.length - 1 : index - 1,
              )
            }
            className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/70 p-3 text-slate-700 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:bg-white hover:shadow-md active:translate-y-px active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
          >
            <ChevronLeft className="h-7 w-7" />
          </button>
          <button
            type="button"
            onClick={() =>
              setActivePropertyImage(index => (index + 1) % propertyImages.length)
            }
            className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/70 p-3 text-slate-700 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:bg-white hover:shadow-md active:translate-y-px active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
          >
            <ChevronRight className="h-7 w-7" />
          </button>
          <div className="absolute bottom-[165px] right-16 w-[320px] rounded-xl bg-white p-4 text-center shadow-xl">
            {isApartmentsLoading ? (
              <div className="space-y-3">
                <Skeleton className="mx-auto h-8 w-40" />
                <Skeleton className="mx-auto h-5 w-24" />
                <Skeleton className="mx-auto h-5 w-48" />
                <Skeleton className="h-10 w-full" />
              </div>
            ) : (
              <>
                <h3 className="text-3xl font-semibold text-[#1672E6]">
                  {formatPrice(featuredApartment?.price)}
                </h3>
                <p className="text-lg text-slate-600">per month</p>
                <div className="mt-2 flex items-center justify-center gap-2 text-sm text-slate-500">
                  <CircleCheck className="h-5 w-5 text-[#22C55E]" /> Available
                  from {featuredApartment?.availableFrom || 'on request'}
                </div>
                <Link
                  href={
                    featuredApartment
                      ? `/apartments/${featuredApartment.id}`
                      : '/apartments'
                  }
                  className="mt-3 block w-full rounded-md bg-[#1672E6] py-2.5 text-sm font-medium text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#0f63ce] hover:shadow-lg active:translate-y-px active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1672E6]/30"
                >
                  Enquire Now
                </Link>
              </>
            )}
            <div className="mt-3 flex items-center justify-center gap-2 text-sm text-slate-400">
              <ShieldCheck className="h-4 w-4" />
              Verified provider
            </div>
          </div>
          <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-4">
            {propertyImages.map((thumb, index) => (
              <button
                key={thumb}
                type="button"
                onClick={() => setActivePropertyImage(index)}
                className={`relative h-[98px] w-[170px] overflow-hidden rounded-lg border shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-px active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 ${
                  activePropertyImage === index
                    ? 'border-white'
                    : 'border-white/70'
                }`}
              >
                <Image
                  src={thumb}
                  alt="Property thumbnail"
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="container mx-auto px-6 lg:px-10">
        <h2 className="section-title text-[#1672E6]">From Our Blog</h2>
        <p className="section-desc mt-2 text-slate-500">
          Your Guide to Hassle-Free Renting and Stylish, Fully-Furnished Homes
        </p>
        <article className="mt-8 grid overflow-hidden rounded-lg border border-slate-200 bg-white lg:grid-cols-2">
          <div className="relative h-[330px] w-full lg:h-[420px]">
            {isBlogLoading ? (
              <Skeleton className="h-full w-full rounded-none" />
            ) : (
              <Image
                src={latestBlog?.thumbnail || '/images/blog.jpg'}
                alt={latestBlog?.title || 'Blog cover'}
                fill
                className="object-cover"
              />
            )}
          </div>
          <div className="p-6 lg:p-8">
            {isBlogLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-7 w-4/5" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-6 w-28" />
              </div>
            ) : (
              <>
                <h3 className="text-2xl font-medium leading-[140%] text-slate-700">
                  {latestBlog?.title ||
                    'Living in the Media Harbour: The ultimate guide for expats'}
                </h3>
                <p className="section-desc mt-4 align-middle tracking-normal text-slate-500">
                  {blogExcerpt ||
                    'Discover the best places to live, top-rated restaurants, trendy bars, and exciting leisure activities in Dusseldorf.'}
                </p>
                <Link
                  href={latestBlog ? `/blogs/${latestBlog.slug}` : '/blogs'}
                  className="mt-7 inline-flex items-center gap-2 text-lg font-semibold text-[#1672E6] transition-all duration-200 hover:translate-x-1 hover:text-[#0f63ce] active:translate-x-0 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1672E6]/30"
                >
                  Read more <ArrowRight className="h-6 w-6" />
                </Link>
              </>
            )}
          </div>
        </article>
      </section>

      <section className="container mx-auto px-6 pb-24 lg:px-10">
        <div className="relative overflow-hidden rounded-[20px]">
          <Image
            src="/images/banner.jpg"
            alt="Explore homes banner"
            width={1600}
            height={650}
            className="h-[420px] w-full object-cover"
          />
          <div className="absolute inset-0 bg-black/35" />
          <div className="absolute inset-0 flex flex-col items-center justify-center px-10 text-center text-white">
            <h3 className="section-title text-white">
              Find <span className="text-[#1672E6]">Your Perfect</span> Home
            </h3>
            <p className="banner-desc mt-4 text-white/90">
              Easily search, compare, and connect with professionally managed
              apartments and homes. Whether you&apos;re looking for a cozy studio, a
              family-friendly space, or a stylish city pad, we help you find a
              safe, comfortable, and move-in ready home without agents or hidden
              fees.
            </p>
            <Link
              href="/apartments"
              className="mt-8 rounded-lg bg-[#1672E6] px-8 py-3 text-base font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#0f63ce] hover:shadow-lg active:translate-y-px active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1672E6]/30"
            >
              Explore Homes
            </Link>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-6 lg:px-10">
        <div className="text-center">
          <h2 className="section-title text-[#1672E6]">
            Frequently Asked Questions
          </h2>
          <p className="section-desc mt-2 text-slate-500">
            Find quick answers to the most common questions about our facilities
            and services.
          </p>
        </div>
        <div className="mt-10">
          <FaqAccordion items={faqItems} showHeader={false} />
        </div>
      </section>

      <section className="container mx-auto px-6 pb-24 lg:px-10">
        <div className="relative overflow-hidden rounded-[18px] bg-[#EEF1F5] px-6 py-10 text-center">
          <div className="pointer-events-none absolute -right-8 -top-20 h-[320px] w-[520px] rounded-[50%] border-[6px] border-[#bfdbfe]" />
          <div className="pointer-events-none absolute right-40 top-0 h-[280px] w-[420px] rounded-[50%] border-[5px] border-[#bfdbfe]" />
          <h3 className="section-title relative z-10 text-[#1672E6]">
            Interested? Contact us directly.
          </h3>
          <p className="section-desc relative z-10 mt-2 text-slate-500">
            Our team is here to provide personalized guidance and support reach
            out anytime.
          </p>
          <Link
            href="/contact"
            className="relative z-10 mt-8 inline-flex rounded-lg bg-[#1672E6] px-12 py-3 text-base font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#0f63ce] hover:shadow-lg active:translate-y-px active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1672E6]/30"
          >
            Contact Us
          </Link>
        </div>
      </section>
    </>
  )
}
