'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { toast } from 'sonner'
import { ArrowRight, CircleCheck } from 'lucide-react'
import { FaqAccordion } from '@/components/shared/faq-accordion'
import { ContactCtaSection } from '@/components/shared/contact-cta-section'
import { fetchBlogs, type BlogPost } from '@/lib/blog-api'
import { stripHtml } from '@/lib/utils'
import { LandlordLeadModal } from '@/components/landlords/landlord-lead-modal'
import { TranslatedText } from '@/components/shared/translated-text'
import { useTranslatedText } from '@/hooks/use-translated-text'

// ─────────────────────────────────────────────
// DATA — "Our full-service promise" cards
// ─────────────────────────────────────────────
const promiseCards = [
  {
    icon: '/icons/_08_camera.png',
    title: 'High-End Production',
    description:
      'Professional photoshoot, home staging and SEO-optimized property listings for maximum visibility.',
    width: 150,
    height: 118,
  },
  {
    icon: '/icons/Layer_1.png',
    title: 'Safe Choice',
    description:
      'Strict credit check, exclusive corporate client network and legally compliant lease agreements.',
    width: 150,
    height: 150,
  },
  {
    icon: '/icons/Layer_1 (1).png',
    title: 'Operational Operations',
    description:
      'Key handover, cleaning, repairs and complete tenant communication - 100% hands-off.',
    width: 150,
    height: 150,
  },
]

// ─────────────────────────────────────────────
// DATA — "This is How Easy Renting Works" steps
// ─────────────────────────────────────────────
const rentingSteps = [
  {
    number: 1,
    icon: '/icons/Layer_1 (2).png',
    title: 'Contact',
    description: 'Send us an inquiry or call us.',
    width: 150,
    height: 150,
  },
  {
    number: 2,
    icon: '/icons/Layer_1 (3).png',
    title: 'Rating',
    description:
      'We will inspect your property and determine the optimal rental price.',
    width: 149,
    height: 150,
  },
  {
    number: 3,
    icon: '/icons/_08_camera.png',
    title: 'Marketing',
    description:
      'Professional photoshoot and creation of a sales pitch for maximum visibility or call us.',
    width: 150,
    height: 118,
  },
  {
    number: 4,
    icon: '/icons/Layer_1 (4).png',
    title: 'Rental',
    description: "We'll find the perfect tenant. You can sit back and relax.",
    width: 150,
    height: 150,
  },
]

// ─────────────────────────────────────────────
// DATA — FAQ items
// ─────────────────────────────────────────────
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

// ─────────────────────────────────────────────
// PROMISE CARD
// ─────────────────────────────────────────────
function PromiseCard({
  icon,
  title,
  description,
  width,
  height,
}: {
  icon: string
  title: string
  description: string
  width: number
  height: number
}) {
  return (
    <div className="bg-white rounded-[16px] border border-gray-100 shadow-[0_10px_25px_rgba(0,0,0,0.03)] p-8 md:p-10 flex flex-col items-center text-center h-full">
      <div className="flex items-center justify-center h-[160px] mb-6">
        <Image
          src={icon}
          alt={title}
          width={width}
          height={height}
          className="object-contain"
          priority
        />
      </div>
      <h3 className="font-sans font-semibold text-gray-900 text-lg mb-3">
        <TranslatedText text={title} cacheKey={`landlords:promise:${title}`} />
      </h3>
      <p className="text-sm text-gray-500 leading-relaxed max-w-[280px]">
        <TranslatedText
          text={description}
          cacheKey={`landlords:promise-desc:${title}`}
        />
      </p>
    </div>
  )
}

// ─────────────────────────────────────────────
// MAGAZINE DATA
// ─────────────────────────────────────────────
const fallbackMagazineCategories = [
  'Relocation',
  'Lifestyle',
  'Right',
  'Neighborhood Guides',
  'Expat Tips',
]

const fallbackFeaturedArticle = {
  badge: 'Guide',
  title: 'Living in the Media Harbour: The ultimate guide for expats',
  description:
    "Discover luxurious living in Düsseldorf's Media Harbour. From modern loft apartments to the best restaurants and leisure activities for international residents — you'll find everything you need for a perfect start.",
  image: '/images/blog.jpg',
  href: '/blogs',
}

const fallbackSideArticles = [
  {
    badge: 'Relocation',
    title: 'Checklist: Moving to Düsseldorf made easy',
    description:
      'A practical moving checklist for expats and professionals settling into the city.',
    image: '/images/properties-1.jpg',
    href: '/blogs',
  },
  {
    badge: 'Lifestyle',
    title: 'The best cafes in Pempelfort for home office',
    description:
      'Quiet corners, strong coffee, and reliable Wi-Fi spots for productive workdays.',
    image: '/images/properties-2.jpg',
    href: '/blogs',
  },
  {
    badge: 'Right',
    title: 'Furnished rental: What you need to know about the security deposit',
    description:
      'A short guide to deposits, expectations, and common rental questions in Germany.',
    image: '/images/properties-3.jpg',
    href: '/blogs',
  },
]

// ─────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────
export function LandlordsPageContent() {
  const router = useRouter()
  const { data: session } = useSession()
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false)
  const [leadModalSource, setLeadModalSource] = useState<'become' | 'list'>(
    'become',
  )
  const signInToBecomeLandlordMessage = useTranslatedText(
    'Please sign in to become a landlord',
    'en',
    { cacheKey: 'landlords:toast:sign-in' },
  )

  const { data: blogData } = useQuery({
    queryKey: ['landlord-page-blogs'],
    queryFn: () => fetchBlogs({ page: 1, limit: 4 }),
    staleTime: 1000 * 60 * 5,
  })

  const blogs: BlogPost[] = blogData?.data || []
  const featuredBlog = blogs[0]
  const sideBlogs = blogs.slice(1, 4)
  const magazineCategories = useMemo(() => {
    if (blogs.length === 0) return fallbackMagazineCategories

    const set = new Set<string>()
    blogs.forEach(blog => {
      if (blog.category) set.add(blog.category)
      blog.tags?.forEach(tag => {
        if (tag) set.add(tag)
      })
    })

    return Array.from(set).slice(0, 5)
  }, [blogs])

  const openLeadModal = (source: 'become' | 'list') => {
    if (!session) {
      toast.error(signInToBecomeLandlordMessage)
      router.push('/login')
      return
    }
    setLeadModalSource(source)
    setIsLeadModalOpen(true)
  }

  return (
    <main className="pb-12">
      {/* ───────────────────────────────────────
          HERO BANNER — "Rent with 0211wohnen"
      ─────────────────────────────────────────── */}
      <section className="container mx-auto mb-16 px-4 pt-8 sm:px-6 lg:px-10">
        <div className="relative overflow-hidden rounded-[24px]">
          <Image
            src="/images/home-banner.jpg"
            alt="Rent with 0211wohnen"
            width={1600}
            height={650}
            className="h-[360px] w-full object-cover sm:h-[600px]"
            priority
          />
          <div className="absolute inset-0 bg-black/45" />

          <div className="absolute inset-x-0 top-[30%] flex flex-col items-center px-4 text-center sm:px-6">
            <h1 className="banner-title text-[#E6F2FD]">
              <TranslatedText
                text="Rent with 0211wohnen"
                cacheKey="landlords:hero:title"
              />
            </h1>
            <p className="banner-desc mt-3 max-w-3xl text-white/90">
              <TranslatedText
                text="Join our network of professional landlords and rent your furnished apartment to qualified tenants. We handle everything from marketing to tenant screening, so you can focus on what matters most."
                cacheKey="landlords:hero:subtitle"
              />
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm text-white lg:gap-8 lg:text-base">
              {['120+ Apartments', '100% Full-Service', 'Only Düsseldorf'].map(
                item => (
                  <div key={item} className="flex items-center gap-2">
                    <CircleCheck className="h-5 w-5 text-[#00E36E]" />
                    <span>
                      <TranslatedText
                        text={item}
                        cacheKey={`landlords:stat:${item}`}
                      />
                    </span>
                  </div>
                ),
              )}
            </div>
          </div>
        </div>
      </section>

      <LandlordLeadModal
        open={isLeadModalOpen}
        onOpenChange={setIsLeadModalOpen}
        source={leadModalSource}
      />

      {/* ───────────────────────────────────────
          SECTION 1 — "Our full-service promise"
      ─────────────────────────────────────────── */}
      <section className="container mx-auto mb-16 px-4 sm:px-6 lg:px-10">
          <div className="text-center mb-8">
            <h2 className="section-title text-[#1672E6] mb-2">
              <TranslatedText
                text="Our full-service promise"
                cacheKey="landlords:promise:title"
              />
            </h2>
            <p className="section-desc text-slate-500">
              <TranslatedText
                text="We take care of everything. You enjoy the returns."
                cacheKey="landlords:promise:subtitle"
              />
            </p>
          </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {promiseCards.map(card => (
            <PromiseCard key={card.title} {...card} />
          ))}
        </div>
      </section>

      {/* ───────────────────────────────────────
          SECTION 2 — "This is How Easy Renting Works"
      ─────────────────────────────────────────── */}
      <section className="container mx-auto mb-16 px-4 sm:px-6 lg:px-10">
          <div className="text-center mb-8">
            <h2 className="section-title text-[#1672E6] mb-2">
              <TranslatedText
                text="This is How Easy Renting Works"
                cacheKey="landlords:steps:title"
              />
            </h2>
            <p className="section-desc text-slate-500 max-w-2xl mx-auto">
              <TranslatedText
                text="Find, choose, and move into a fully furnished apartment with ease. From search to stay, every step is designed to be simple, fast, and stress free."
                cacheKey="landlords:steps:subtitle"
              />
            </p>
          </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-[0_10px_35px_rgba(0,0,0,0.03)] md:p-12 lg:p-16">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-4 md:gap-4 lg:gap-8">
            {rentingSteps.map((step, index) => {
              return (
                <div
                  key={step.number}
                  className="relative flex flex-col items-center text-center"
                >
                  <div className="mb-4 flex h-[120px] items-center justify-center sm:h-[150px]">
                    <Image
                      src={step.icon}
                      alt={step.title}
                      width={step.width}
                      height={step.height}
                      className="object-contain"
                    />
                  </div>
                  <h3 className="font-serif font-bold text-gray-900 text-lg md:text-xl mb-2">
                    {step.number}.{' '}
                    <TranslatedText
                      text={step.title}
                      cacheKey={`landlords:step:title:${step.number}`}
                    />
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed max-w-[190px] mx-auto">
                    <TranslatedText
                      text={step.description}
                      cacheKey={`landlords:step:desc:${step.number}`}
                    />
                  </p>
                  {index < rentingSteps.length - 1 && (
                    <div className="absolute left-[calc(100%+8px)] top-[75px] hidden h-[20px] w-[60px] -translate-x-1/2 -translate-y-1/2 z-10 md:block lg:left-[calc(100%+16px)] lg:w-[80px]">
                      <Image
                        src="/icons/Arrow 2.png"
                        alt="Arrow"
                        fill
                        className="object-contain"
                      />
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          <div className="text-center mt-12">
            <button
              type="button"
              onClick={() => openLeadModal('become')}
              className="bg-[#1672E6] hover:bg-[#0f63ce] text-white text-sm font-semibold px-8 py-3.5 rounded-lg transition-colors shadow-sm"
            >
              <TranslatedText
                text="Become a landlord now"
                cacheKey="landlords:steps:cta"
              />
            </button>
          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────
          SECTION 3 — "0211 Magazine"
      ─────────────────────────────────────────── */}
      <section className="container mx-auto mb-16 px-4 sm:px-6 lg:px-10">
        <h2 className="section-title text-[#1672E6] mb-1">
          <TranslatedText
            text="0211 Magazine"
            cacheKey="landlords:magazine:title"
          />
        </h2>
        <p className="section-desc text-slate-500 mb-6">
          <TranslatedText
            text="Living, Life, Düsseldorf"
            cacheKey="landlords:magazine:subtitle"
          />
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Featured article — large, left side, spans 2 columns */}
          <Link
            href={
              featuredBlog
                ? `/blogs/${featuredBlog.slug}`
                : fallbackFeaturedArticle.href
            }
            className="relative block min-h-[280px] overflow-hidden rounded-xl group md:col-span-2 sm:min-h-[320px]"
          >
            <Image
              src={featuredBlog?.thumbnail || fallbackFeaturedArticle.image}
              alt={featuredBlog?.title || fallbackFeaturedArticle.title}
              fill
              className="object-cover absolute inset-0"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            <div className="absolute bottom-0 left-0 w-full p-4 sm:p-6">
              <span className="inline-block bg-[#1672E6] text-white text-xs font-medium px-3 py-1 rounded-full mb-3">
                <TranslatedText
                  text={featuredBlog?.category || fallbackFeaturedArticle.badge}
                  cacheKey={`landlords:featured:badge:${featuredBlog?.category || fallbackFeaturedArticle.badge}`}
                />
              </span>
              <h3 className="mb-2 max-w-md text-xl font-semibold text-white md:text-2xl">
                <TranslatedText
                  text={featuredBlog?.title || fallbackFeaturedArticle.title}
                  cacheKey={`landlords:featured:title:${featuredBlog?.slug || 'fallback'}`}
                />
              </h3>
              <p className="text-white/80 text-sm max-w-md mb-3 line-clamp-3">
                <TranslatedText
                  text={
                    featuredBlog
                      ? stripHtml(
                          featuredBlog.excerpt || featuredBlog.content || '',
                        )
                      : fallbackFeaturedArticle.description
                  }
                  cacheKey={`landlords:featured:excerpt:${featuredBlog?.slug || 'fallback'}`}
                />
              </p>
              <span className="text-blue-300 text-sm font-medium inline-flex items-center gap-1">
                <TranslatedText text="Read more" cacheKey="landlords:read-more" />
                <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </Link>

          {/* Right column — side articles + categories */}
          <div className="flex flex-col gap-4">
            {(sideBlogs.length > 0 ? sideBlogs : fallbackSideArticles).map(
              article => (
                <Link
                  key={'_id' in article ? article._id : article.title}
                  href={
                    'slug' in article ? `/blogs/${article.slug}` : article.href
                  }
                  className="flex gap-3 group"
                >
                  <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-gray-200 sm:h-20 sm:w-20">
                    <Image
                      src={
                        'thumbnail' in article
                          ? article.thumbnail || '/images/blog.jpg'
                          : article.image
                      }
                      alt={article.title}
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex flex-col">
                    <h4 className="text-sm font-medium text-gray-900 leading-snug mb-2 group-hover:text-[#1672E6] transition-colors">
                      <TranslatedText
                        text={article.title}
                        cacheKey={`landlords:article:title:${'slug' in article ? article.slug : article.title}`}
                      />
                    </h4>
                    <p className="mb-2 text-xs leading-5 text-gray-500 line-clamp-2">
                      <TranslatedText
                        text={
                          'excerpt' in article
                            ? stripHtml(article.excerpt || article.content || '')
                            : article.description
                        }
                        cacheKey={`landlords:article:desc:${'slug' in article ? article.slug : article.title}`}
                      />
                    </p>
                    <span className="inline-block bg-[#1672E6] text-white text-xs font-medium px-3 py-1 rounded-full w-fit">
                      <TranslatedText
                        text={
                          'category' in article
                            ? article.category || 'Guide'
                            : article.badge
                        }
                        cacheKey={`landlords:article:badge:${'slug' in article ? article.slug : article.title}`}
                      />
                    </span>
                  </div>
                </Link>
              ),
            )}

            {/* Categories */}
            <div className="mt-2">
              <h4 className="text-sm font-semibold text-gray-900 mb-2">
                <TranslatedText
                  text="Categories"
                  cacheKey="landlords:categories"
                />
              </h4>
              <ul className="space-y-1.5">
                {magazineCategories.map(category => (
                  <li key={category}>
                    <Link
                      href="/blogs"
                      className="text-[15px] font-medium text-gray-600 hover:text-[#1672E6] transition-colors"
                    >
                      <TranslatedText
                        text={category}
                        cacheKey={`landlords:category:${category}`}
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────
          SECONDARY HERO BANNER — "Ready to List Your Apartment?"
      ─────────────────────────────────────────── */}
      <section className="container mx-auto my-16 px-4 sm:px-6 lg:my-24 lg:px-10">
        <div className="relative h-[220px] w-full overflow-hidden rounded-xl sm:h-[260px]">
          <Image
            src="/images/banner.jpg"
            alt="Ready to List Your Apartment?"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/45" />
          <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
            <h2 className="text-white text-2xl md:text-3xl font-semibold mb-2">
              <TranslatedText
                text="Ready to List Your Apartment?"
                cacheKey="landlords:secondary:title"
              />
            </h2>
            <p className="text-white/80 text-sm max-w-xl mb-4">
              <TranslatedText
                text="Join hundreds of satisfied landlords who trust us to find the perfect tenants for their furnished apartments in Düsseldorf."
                cacheKey="landlords:secondary:subtitle"
              />
            </p>
            <button
              type="button"
              onClick={() => openLeadModal('list')}
              className="bg-[#1672E6] hover:bg-[#0f63ce] text-white text-sm font-medium px-6 py-2.5 rounded-md transition-colors"
            >
              <TranslatedText
                text="List Your Apartment"
                cacheKey="landlords:secondary:button"
              />
            </button>
          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────
          FAQ SECTION — uses reusable FaqAccordion with built-in header
      ─────────────────────────────────────────── */}
      <section className="container mx-auto mb-16 px-4 sm:px-6 lg:px-10">
        <div className=" mx-auto">
          <FaqAccordion items={faqItems} />
        </div>
      </section>

      {/* ───────────────────────────────────────
          CTA CARD — "Interested? Contact us directly."
      ─────────────────────────────────────────── */}
      <ContactCtaSection />
    </main>
  )
}
