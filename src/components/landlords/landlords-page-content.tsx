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
        {title}
      </h3>
      <p className="text-sm text-gray-500 leading-relaxed max-w-[280px]">
        {description}
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
      toast.error('Please sign in to become a landlord')
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
      <section className="container mx-auto px-6 lg:px-10 pt-8 mb-16">
        <div className="relative overflow-hidden rounded-[24px]">
          <Image
            src="/images/home-banner.jpg"
            alt="Rent with 0211wohnen"
            width={1600}
            height={650}
            className="h-[600px] w-full object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/45" />

          <div className="absolute inset-x-0 top-[30%] flex flex-col items-center px-6 text-center">
            <h1 className="banner-title text-[#E6F2FD]">
              Rent with 0211wohnen
            </h1>
            <p className="banner-desc mt-3 max-w-3xl text-white/90">
              Join our network of professional landlords and rent your furnished
              apartment to qualified tenants. We handle everything from
              marketing to tenant screening, so you can focus on what matters
              most.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-8 text-sm text-white lg:text-base">
              {['120+ Apartments', '100% Full-Service', 'Only Düsseldorf'].map(
                item => (
                  <div key={item} className="flex items-center gap-2">
                    <CircleCheck className="h-5 w-5 text-[#00E36E]" />
                    <span>{item}</span>
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
      <section className="container mx-auto px-6 lg:px-10 mb-16">
        <div className="text-center mb-8">
          <h2 className="section-title text-[#1672E6] mb-2">
            Our full-service promise
          </h2>
          <p className="section-desc text-slate-500">
            We take care of everything. You enjoy the returns.
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
      <section className="container mx-auto px-6 lg:px-10 mb-16">
        <div className="text-center mb-8">
          <h2 className="section-title text-[#1672E6] mb-2">
            This is How Easy Renting Works
          </h2>
          <p className="section-desc text-slate-500 max-w-2xl mx-auto">
            Find, choose, and move into a fully furnished apartment with ease.
            From search to stay, every step is designed to be simple, fast, and
            stress free.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_10px_35px_rgba(0,0,0,0.03)] p-8 md:p-12 lg:p-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-4 lg:gap-8">
            {rentingSteps.map((step, index) => {
              return (
                <div
                  key={step.number}
                  className="relative flex flex-col items-center text-center"
                >
                  <div className="flex items-center justify-center h-[150px] mb-4">
                    <Image
                      src={step.icon}
                      alt={step.title}
                      width={step.width}
                      height={step.height}
                      className="object-contain"
                    />
                  </div>
                  <h3 className="font-serif font-bold text-gray-900 text-lg md:text-xl mb-2">
                    {step.number}. {step.title}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed max-w-[190px] mx-auto">
                    {step.description}
                  </p>
                  {index < rentingSteps.length - 1 && (
                    <div className="absolute top-[75px] -translate-y-1/2 left-[calc(100%+8px)] lg:left-[calc(100%+16px)] -translate-x-1/2 w-[60px] lg:w-[80px] h-[20px] hidden md:block z-10">
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
              Become a landlord now
            </button>
          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────
          SECTION 3 — "0211 Magazine"
      ─────────────────────────────────────────── */}
      <section className="container mx-auto px-6 lg:px-10 mb-16">
        <h2 className="section-title text-[#1672E6] mb-1">0211 Magazine</h2>
        <p className="section-desc text-slate-500 mb-6">
          Living, Life, Düsseldorf
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Featured article — large, left side, spans 2 columns */}
          <Link
            href={
              featuredBlog
                ? `/blogs/${featuredBlog.slug}`
                : fallbackFeaturedArticle.href
            }
            className="md:col-span-2 relative rounded-xl overflow-hidden group min-h-[320px] block"
          >
            <Image
              src={featuredBlog?.thumbnail || fallbackFeaturedArticle.image}
              alt={featuredBlog?.title || fallbackFeaturedArticle.title}
              fill
              className="object-cover absolute inset-0"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            <div className="absolute bottom-0 left-0 p-6 w-full">
              <span className="inline-block bg-[#1672E6] text-white text-xs font-medium px-3 py-1 rounded-full mb-3">
                {featuredBlog?.category || fallbackFeaturedArticle.badge}
              </span>
              <h3 className="text-white text-xl md:text-2xl font-semibold mb-2 max-w-md">
                {featuredBlog?.title || fallbackFeaturedArticle.title}
              </h3>
              <p className="text-white/80 text-sm max-w-md mb-3 line-clamp-3">
                {featuredBlog
                  ? stripHtml(
                      featuredBlog.excerpt || featuredBlog.content || '',
                    )
                  : fallbackFeaturedArticle.description}
              </p>
              <span className="text-blue-300 text-sm font-medium inline-flex items-center gap-1">
                Read more
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
                  <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0 bg-gray-200">
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
                      {article.title}
                    </h4>
                    <p className="mb-2 text-xs leading-5 text-gray-500 line-clamp-2">
                      {'excerpt' in article
                        ? stripHtml(article.excerpt || article.content || '')
                        : article.description}
                    </p>
                    <span className="inline-block bg-[#1672E6] text-white text-xs font-medium px-3 py-1 rounded-full w-fit">
                      {'category' in article
                        ? article.category || 'Guide'
                        : article.badge}
                    </span>
                  </div>
                </Link>
              ),
            )}

            {/* Categories */}
            <div className="mt-2">
              <h4 className="text-sm font-semibold text-gray-900 mb-2">
                Categories
              </h4>
              <ul className="space-y-1.5">
                {magazineCategories.map(category => (
                  <li key={category}>
                    <Link
                      href="/blogs"
                      className="text-[15px] font-medium text-gray-600 hover:text-[#1672E6] transition-colors"
                    >
                      {category}
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
      <section className="container mx-auto px-6 lg:px-10 my-16 lg:my-24">
        <div className="relative w-full h-[260px] rounded-xl overflow-hidden">
          <Image
            src="/images/banner.jpg"
            alt="Ready to List Your Apartment?"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/45" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
            <h2 className="text-white text-2xl md:text-3xl font-semibold mb-2">
              Ready to List Your Apartment?
            </h2>
            <p className="text-white/80 text-sm max-w-xl mb-4">
              Join hundreds of satisfied landlords who trust us to find the
              perfect tenants for their furnished apartments in Düsseldorf.
            </p>
            <button
              type="button"
              onClick={() => openLeadModal('list')}
              className="bg-[#1672E6] hover:bg-[#0f63ce] text-white text-sm font-medium px-6 py-2.5 rounded-md transition-colors"
            >
              List Your Apartment
            </button>
          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────
          FAQ SECTION — uses reusable FaqAccordion with built-in header
      ─────────────────────────────────────────── */}
      <section className="container mx-auto px-6 lg:px-10 mb-16">
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
