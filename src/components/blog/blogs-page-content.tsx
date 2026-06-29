'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useMemo } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { fetchBlogs, type BlogPost } from '@/lib/blog-api'
import { BlogSharedBottom } from '@/components/blog/blog-shared-bottom'
import { stripHtml } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'
import { TranslatedText } from '@/components/shared/translated-text'

const EMPTY_BLOGS: BlogPost[] = []

export function BlogsPageContent() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['public-blogs', 1],
    queryFn: () => fetchBlogs({ page: 1, limit: 10 }),
    staleTime: 1000 * 60 * 5,
  })

  const blogs: BlogPost[] = data?.data ?? EMPTY_BLOGS
  const featured = blogs[0]
  const sidePosts = blogs.slice(1, 4)
  const categories = useMemo(() => {
    const set = new Set(blogs.map(b => b.category).filter(Boolean))
    return Array.from(set)
  }, [blogs])

  if (isLoading) {
    return (
      <main className="space-y-24 py-12">
        <section className="container mx-auto px-4 sm:px-6 lg:px-10">
          <div className="relative overflow-hidden rounded-[14px]">
            <Image
              src="/images/about-banner.jpg"
              alt="Blogs banner"
              width={1600}
              height={420}
              className="h-[190px] w-full object-cover object-[center_25%] sm:h-[230px]"
              priority
            />
            <div className="absolute inset-0 bg-black/50" />
            <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center text-white sm:px-8">
              <h1 className="banner-title">
                <TranslatedText
                  text="Insights, Tips & Guidance for Families"
                  cacheKey="blogs:hero:title"
                />
              </h1>
              <p className="banner-desc mt-2 max-w-5xl text-white/90">
                <TranslatedText
                  text="Explore helpful articles, expert advice, and real-life stories designed to guide families in making informed and confident decisions about senior care."
                  cacheKey="blogs:hero:subtitle"
                />
              </p>
            </div>
          </div>
        </section>
        <section className="container mx-auto px-4 sm:px-6 lg:px-10">
          <div className="mt-6 grid gap-4 lg:grid-cols-[1.65fr_1fr_0.55fr]">
            <Skeleton className="h-[460px] rounded-lg" />
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <Skeleton key={index} className="h-[110px] rounded-md" />
              ))}
            </div>
            <Skeleton className="h-[220px] rounded-lg" />
          </div>
        </section>
      </main>
    )
  }

  if (isError) {
    return (
      <main className="space-y-24 py-12">
        <section className="container mx-auto px-4 sm:px-6 lg:px-10">
          <div className="relative overflow-hidden rounded-[14px]">
            <Image
              src="/images/about-banner.jpg"
              alt="Blogs banner"
              width={1600}
              height={420}
              className="h-[190px] w-full object-cover object-[center_25%] sm:h-[230px]"
              priority
            />
            <div className="absolute inset-0 bg-black/50" />
            <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center text-white sm:px-8">
              <h1 className="banner-title">
                Insights, Tips & Guidance for Families
              </h1>
              <p className="banner-desc mt-2 max-w-5xl text-white/90">
                Explore helpful articles, expert advice, and real-life
                stories...
              </p>
            </div>
          </div>
        </section>
        <section className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-lg font-semibold text-slate-800">
            <TranslatedText
              text="Unable to load blogs"
              cacheKey="blogs:error:title"
            />
          </p>
          <p className="mt-2 text-sm text-slate-500">
            <TranslatedText
              text="Please try again later."
              cacheKey="blogs:error:subtitle"
            />
          </p>
        </section>
      </main>
    )
  }

  return (
    <main className="space-y-24 py-12">
      <section className="container mx-auto px-4 sm:px-6 lg:px-10">
        <div className="relative overflow-hidden rounded-[14px]">
          <Image
            src="/images/about-banner.jpg"
            alt="Blogs banner"
            width={1600}
            height={420}
            className="h-[190px] w-full object-cover object-[center_25%] sm:h-[230px]"
            priority
          />
          <div className="absolute inset-0 bg-black/50" />
          <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center text-white sm:px-8">
            <h1 className="banner-title">
              <TranslatedText
                text="Insights, Tips & Guidance for Families"
                cacheKey="blogs:hero:title"
              />
            </h1>
            <p className="banner-desc mt-2 max-w-5xl text-white/90">
              <TranslatedText
                text="Explore helpful articles, expert advice, and real-life stories designed to guide families in making informed and confident decisions about senior care."
                cacheKey="blogs:hero:subtitle"
              />
            </p>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 sm:px-6 lg:px-10">
        <h2 className="section-title text-slate-800">
          <TranslatedText
            text="Recent blog posts"
            cacheKey="blogs:section:title"
          />
        </h2>

        {blogs.length === 0 ? (
          <div className="mt-10 rounded-lg bg-white p-10 text-center">
              <p className="text-base text-slate-500">
                <TranslatedText
                  text="No blog posts available yet."
                  cacheKey="blogs:empty"
                />
              </p>
          </div>
        ) : (
          <div className="mt-6 grid gap-4 lg:grid-cols-[1.65fr_1fr_0.55fr]">
            {/* Featured post */}
            {featured && (
              <article className="relative overflow-hidden rounded-lg">
                <Image
                  src={featured.thumbnail || '/images/properties-3.jpg'}
                  alt={featured.title}
                  width={950}
                  height={620}
                  className="h-[280px] w-full object-cover sm:h-[460px]"
                />
                <div className="absolute inset-0 bg-black/45" />
                <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                  <span className="inline-flex rounded-full bg-primary px-4 py-1 text-xs">
                    <TranslatedText
                      text={featured.category || 'Guide'}
                      cacheKey={`blogs:category:${featured.category || 'Guide'}`}
                    />
                  </span>
                  <h3 className="mt-4 font-serif text-[28px] leading-[130%] sm:text-[42px]">
                    <TranslatedText
                      text={featured.title}
                      cacheKey={`blogs:title:${featured._id}`}
                    />
                  </h3>
                  <p className="mt-2 text-sm text-white/90">
                    <TranslatedText
                      text={stripHtml(featured.excerpt)}
                      cacheKey={`blogs:excerpt:${featured._id}`}
                    />
                  </p>
                  <Link
                    href={`/blogs/${featured.slug}`}
                    className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#1d86ff]"
                  >
                    <TranslatedText text="Read more" cacheKey="blogs:read-more" />{' '}
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </div>
              </article>
            )}

            {/* Side posts */}
            <div className="divide-y divide-slate-200">
              {sidePosts.map(post => (
                <Link
                  key={post._id}
                  href={`/blogs/${post.slug}`}
                  className="grid grid-cols-[124px_1fr] gap-4 py-4 first:pt-0"
                >
                  <div className="relative h-[112px] overflow-hidden rounded-md sm:h-[126px]">
                    <Image
                      src={post.thumbnail || '/images/connect-2.jpg'}
                      alt={post.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="text-[18px] leading-[140%] text-slate-800">
                      <TranslatedText
                        text={post.title}
                        cacheKey={`blogs:title:${post._id}`}
                      />
                    </h3>
                    <span className="mt-2.5 inline-flex rounded-full bg-primary px-4 py-1 text-xs text-white">
                      <TranslatedText
                        text={post.category || 'General'}
                        cacheKey={`blogs:category:${post.category || 'General'}`}
                      />
                    </span>
                  </div>
                </Link>
              ))}
            </div>

            {/* Categories */}
            <aside className="border-l border-slate-200 pl-4">
              <h3 className="text-[24px] font-medium text-slate-800 sm:text-[30px]">
                <TranslatedText text="Categories" cacheKey="blogs:categories" />
              </h3>
              <ul className="mt-3 space-y-2">
                {categories.map(cat => (
                  <li key={cat} className="text-[16px] text-slate-500">
                    {cat}
                  </li>
                ))}
              </ul>
            </aside>
          </div>
        )}
      </section>

      {blogs.length > 0 && <BlogSharedBottom blogs={blogs} />}
    </main>
  )
}
