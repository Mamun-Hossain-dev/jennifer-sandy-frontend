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
import { fetchApartments, fetchPopularAreas } from '@/lib/apartments-api'
import { fetchBlogs, type BlogPost } from '@/lib/blog-api'
import { stripHtml } from '@/lib/utils'
import { TranslatedText } from '@/components/shared/translated-text'

const MapComponent = dynamic(
  () => import('@/components/apartments/MapComponent'),
  {
    ssr: false,
    loading: () => <Skeleton className="h-full w-full rounded-md" />,
  },
)

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
  const propertyImages = featuredApartment?.images?.length
    ? featuredApartment.images
    : fallbackPropertyImages
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
      <section className="container mx-auto px-[6px] sm:px-6 lg:px-10">
        <div className="mb-5 flex items-center gap-3 sm:mb-6">
          <h2 className="section-title text-[#1672E6]">
            <TranslatedText text="Map View" cacheKey="home:map-view" />
          </h2>
          <Shield className="h-7 w-7 text-[#1672E6] sm:h-9 sm:w-9" strokeWidth={2.2} />
        </div>
        <div className="relative h-[250px] overflow-hidden rounded-md bg-[#D8D8D8] sm:h-[320px] lg:h-[360px]">
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

      <section className="container mx-auto px-[6px] sm:px-6 lg:px-10">
        <h2 className="section-title text-[#1672E6]">
          <TranslatedText text="Popular Areas" cacheKey="home:popular-areas" />
        </h2>
        <p className="section-desc mt-2 text-slate-500">
          <TranslatedText
            text="Move In Ready: Professional Furnished Apartments, Zero Agent Fees"
            cacheKey="home:popular-areas:subtitle"
          />
        </p>
        <div className="mt-6 grid gap-4 sm:mt-8 md:grid-cols-2 xl:grid-cols-4">
          {isAreasLoading
            ? Array.from({ length: 4 }).map((_, index) => (
                <article
                  key={index}
                  className="overflow-hidden rounded-lg bg-[#EEF0F3]"
                >
                  <Skeleton className="h-[240px] w-full rounded-none sm:h-[280px] md:h-[320px]" />
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
                  <div className="relative h-[240px] w-full sm:h-[280px] md:h-[320px]">
                    <Image
                      src={area.image}
                      alt={area.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex items-center justify-between px-4 pb-2 pt-4">
                    <h3 className="text-lg text-[#1672E6] sm:text-xl">{area.title}</h3>
                    <ArrowRight className="h-5 w-5 shrink-0 text-[#1672E6]" />
                  </div>
                  <p className="px-4 pb-4 text-sm text-[#6EA8E8]">
                    {area.count}
                  </p>
                </Link>
              ))}
        </div>
      </section>

      <section className="container mx-auto px-4 pb-16 sm:px-6 sm:pb-20 lg:px-10">
        <h2 className="section-title text-center text-[#1672E6]">
          <TranslatedText
            text="Our Properties View"
            cacheKey="home:properties-view"
          />
        </h2>
        <p className="section-desc mt-2 text-center text-slate-500">
          <TranslatedText
            text="Your Guide to Hassle-Free Renting and Stylish, Fully-Furnished Homes"
            cacheKey="home:properties-view:subtitle"
          />
        </p>
        <div className="relative mt-8 overflow-hidden rounded-[10px]">
          {isApartmentsLoading ? (
            <Skeleton className="h-[240px] w-full rounded-none sm:h-[360px] md:h-[520px] lg:h-[620px]" />
          ) : (
            <Image
              src={
                propertyImages[activePropertyImage] || fallbackPropertyImages[0]
              }
              alt={featuredApartment?.title || 'Active property view'}
              width={1500}
              height={850}
              className="h-[240px] w-full object-cover transition-opacity duration-500 sm:h-[360px] md:h-[520px] lg:h-[620px]"
            />
          )}

          {/* Top-right action buttons */}
          <div className="absolute right-2 top-2 sm:right-4 sm:top-4 md:right-8 md:top-8 flex items-center gap-1.5 sm:gap-2 md:gap-3">
            <button
              type="button"
              className="rounded-lg sm:rounded-xl bg-white/90 p-1.5 sm:p-2 md:p-3 text-slate-700 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-white hover:shadow-md active:translate-y-px active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
            >
              <Expand className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
            </button>
            <button
              type="button"
              className="rounded-lg sm:rounded-xl bg-white/90 p-1.5 sm:p-2 md:p-3 text-slate-700 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-white hover:shadow-md active:translate-y-px active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
            >
              <Share2 className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
            </button>
            <button
              type="button"
              className="rounded-lg sm:rounded-xl bg-white/90 p-1.5 sm:p-2 md:p-3 text-slate-700 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-white hover:shadow-md active:translate-y-px active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
            >
              <Heart className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
            </button>
          </div>

          {/* Left arrow */}
          <button
            type="button"
            onClick={() =>
              setActivePropertyImage(i =>
                i === 0 ? propertyImages.length - 1 : i - 1,
              )
            }
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/70 p-1.5 sm:p-2 md:p-3 text-slate-700 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:bg-white hover:shadow-md active:translate-y-px active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
          >
            <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7" />
          </button>

          {/* Right arrow */}
          <button
            type="button"
            onClick={() =>
              setActivePropertyImage(i => (i + 1) % propertyImages.length)
            }
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/70 p-1.5 sm:p-2 md:p-3 text-slate-700 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:bg-white hover:shadow-md active:translate-y-px active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
          >
            <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7" />
          </button>

          {/* Floating info card */}
          <div className="absolute bottom-2 left-2 right-2 sm:bottom-auto sm:top-auto sm:left-auto sm:right-4 md:right-8 sm:bottom-[140px] sm:w-[280px] md:w-[320px] rounded-xl bg-white p-3 sm:p-4 text-center shadow-xl">
            {isApartmentsLoading ? (
              <div className="space-y-2 sm:space-y-3">
                <Skeleton className="mx-auto h-6 sm:h-8 w-32 sm:w-40" />
                <Skeleton className="mx-auto h-4 sm:h-5 w-20 sm:w-24" />
                <Skeleton className="mx-auto h-4 sm:h-5 w-36 sm:w-48" />
                <Skeleton className="h-9 sm:h-10 w-full" />
              </div>
            ) : (
              <>
                <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold text-[#1672E6]">
                  {formatPrice(featuredApartment?.price)}
                </h3>
                <p className="text-sm sm:text-base md:text-lg text-slate-600">
                  <TranslatedText
                    text="per month"
                    cacheKey="home:properties:month"
                  />
                </p>
                <div className="mt-1 sm:mt-2 flex items-center justify-center gap-2 text-xs sm:text-sm text-slate-500">
                  <CircleCheck className="h-4 w-4 sm:h-5 sm:w-5 text-[#22C55E]" />
                  <TranslatedText
                    text="Available from"
                    cacheKey="home:properties:available"
                  />{' '}
                  {featuredApartment?.availableFrom || 'on request'}
                </div>
                <Link
                  href={
                    featuredApartment
                      ? `/apartments/${featuredApartment.id}`
                      : '/apartments'
                  }
                  className="mt-2 sm:mt-3 block w-full rounded-md bg-[#1672E6] py-2 sm:py-2.5 text-xs sm:text-sm font-medium text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#0f63ce] hover:shadow-lg active:translate-y-px active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1672E6]/30"
                >
                  <TranslatedText
                    text="Enquire Now"
                    cacheKey="home:properties:enquire"
                  />
                </Link>
              </>
            )}
            <div className="mt-2 sm:mt-3 flex items-center justify-center gap-2 text-xs sm:text-sm text-slate-400">
              <ShieldCheck className="h-3 w-3 sm:h-4 sm:w-4" />
              <TranslatedText
                text="Verified provider"
                cacheKey="home:properties:verified"
              />
            </div>
          </div>

          {/* Thumbnail strip */}
          <div className="absolute bottom-2 left-1/2 hidden -translate-x-1/2 items-center gap-1.5 sm:bottom-3 sm:flex sm:gap-2 md:bottom-4 md:gap-4">
            {propertyImages.map((thumb, index) => (
              <button
                key={thumb}
                type="button"
                onClick={() => setActivePropertyImage(index)}
                className={`relative h-10 sm:h-14 md:h-[98px] w-16 sm:w-24 md:w-[170px] overflow-hidden rounded border shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-px active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 ${
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

      <section className="container mx-auto px-[6px] sm:px-6 lg:px-10">
        <h2 className="section-title text-[#1672E6]">
          <TranslatedText text="From Our Blog" cacheKey="home:blog-title" />
        </h2>
        <p className="section-desc mt-2 text-slate-500">
          <TranslatedText
            text="Your Guide to Hassle-Free Renting and Stylish, Fully-Furnished Homes"
            cacheKey="home:blog-subtitle"
          />
        </p>
        <article className="mt-8 grid overflow-hidden rounded-lg border border-slate-200 bg-white lg:grid-cols-2">
          <div className="relative h-[220px] w-full sm:h-[300px] lg:h-[420px]">
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
          <div className="p-5 sm:p-6 lg:p-8">
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
                  <TranslatedText
                    text={
                      latestBlog?.title ||
                      'Living in the Media Harbour: The ultimate guide for expats'
                    }
                    sourceLang="en"
                    cacheKey={`home:blog:title:${latestBlog?.slug || 'fallback'}`}
                  />
                </h3>
                <p className="section-desc mt-4 align-middle tracking-normal text-slate-500">
                  <TranslatedText
                    text={
                      blogExcerpt ||
                      'Discover the best places to live, top-rated restaurants, trendy bars, and exciting leisure activities in Dusseldorf.'
                    }
                    sourceLang="en"
                    cacheKey={`home:blog:excerpt:${latestBlog?.slug || 'fallback'}`}
                  />
                </p>
                <Link
                  href={latestBlog ? `/blogs/${latestBlog.slug}` : '/blogs'}
                  className="mt-7 inline-flex items-center gap-2 text-base font-semibold text-[#1672E6] transition-all duration-200 hover:translate-x-1 hover:text-[#0f63ce] active:translate-x-0 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1672E6]/30 sm:text-lg"
                >
                  <TranslatedText text="Read more" cacheKey="home:blog:read-more" />{' '}
                  <ArrowRight className="h-6 w-6" />
                </Link>
              </>
            )}
          </div>
        </article>
      </section>

      <section className="container mx-auto px-[6px] pb-16 sm:px-6 sm:pb-20 lg:px-10">
        <div className="relative overflow-hidden rounded-[20px]">
          <Image
            src="/images/banner.jpg"
            alt="Explore homes banner"
            width={1600}
            height={650}
            className="h-[320px] w-full object-cover sm:h-[380px] lg:h-[420px]"
          />
          <div className="absolute inset-0 bg-black/35" />
          <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center text-white sm:px-8 lg:px-10">
            <h3 className="section-title text-white">
              <TranslatedText
                text="Find Your Perfect Home"
                cacheKey="home:banner:title"
              />
            </h3>
            <p className="banner-desc mt-4 max-w-3xl text-balance text-white/90">
              <TranslatedText
                text="Easily search, compare, and connect with professionally managed apartments and homes. Whether you&apos;re looking for a cozy studio, a family-friendly space, or a stylish city pad, we help you find a safe, comfortable, and move-in ready home without agents or hidden fees."
                cacheKey="home:banner:subtitle"
              />
            </p>
            <Link
              href="/apartments"
              className="mt-8 rounded-lg bg-[#1672E6] px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#0f63ce] hover:shadow-lg active:translate-y-px active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1672E6]/30 sm:px-8 sm:text-base"
            >
              <TranslatedText
                text="Explore Homes"
                cacheKey="home:banner:cta"
              />
            </Link>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-[6px] sm:px-6 lg:px-10">
        <div className="text-center">
            <h2 className="section-title text-[#1672E6]">
              <TranslatedText
                text="Frequently Asked Questions"
                cacheKey="home:faq:title"
              />
            </h2>
          <p className="section-desc mt-2 text-slate-500">
            <TranslatedText
              text="Find quick answers to the most common questions about our facilities and services."
              cacheKey="home:faq:subtitle"
            />
          </p>
        </div>
        <div className="mt-10">
          <FaqAccordion items={faqItems} showHeader={false} />
        </div>
      </section>

      <section className="container mx-auto px-[6px] pb-16 sm:px-6 sm:pb-20 lg:px-10">
        <div className="relative overflow-hidden rounded-[18px] bg-[#EEF1F5] px-5 py-10 text-center sm:px-6">
          <div className="pointer-events-none absolute -right-8 -top-20 hidden h-[320px] w-[520px] rounded-[50%] border-[6px] border-[#bfdbfe] md:block" />
          <div className="pointer-events-none absolute right-40 top-0 hidden h-[280px] w-[420px] rounded-[50%] border-[5px] border-[#bfdbfe] md:block" />
          <h3 className="section-title relative z-10 text-[#1672E6]">
            <TranslatedText
              text="Interested? Contact us directly."
              cacheKey="home:contact:title"
            />
          </h3>
          <p className="section-desc relative z-10 mt-2 text-slate-500">
            <TranslatedText
              text="Our team is here to provide personalized guidance and support reach out anytime."
              cacheKey="home:contact:subtitle"
            />
          </p>
          <Link
            href="/contact"
            className="relative z-10 mt-8 inline-flex rounded-lg bg-[#1672E6] px-12 py-3 text-base font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#0f63ce] hover:shadow-lg active:translate-y-px active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1672E6]/30"
          >
            <TranslatedText
              text="Contact Us"
              cacheKey="home:contact:button"
            />
          </Link>
        </div>
      </section>
    </>
  )
}
