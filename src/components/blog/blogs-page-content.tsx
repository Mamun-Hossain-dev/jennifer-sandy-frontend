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

export function BlogsPageContent() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['public-blogs', 1],
    queryFn: () => fetchBlogs({ page: 1, limit: 10 }),
    staleTime: 1000 * 60 * 5,
  })

  const blogs: BlogPost[] = data?.data || []
  const featured = blogs[0]
  const sidePosts = blogs.slice(1, 4)
  const categories = useMemo(() => {
    const set = new Set(blogs.map(b => b.category).filter(Boolean))
    return Array.from(set)
  }, [blogs])

  if (isLoading) {
    return (
      <main className="space-y-24 py-12">
        <section className="container mx-auto px-6 lg:px-10">
          <div className="relative overflow-hidden rounded-[14px]">
            <Image
              src="/images/about-banner.jpg"
              alt="Blogs banner"
              width={1600}
              height={420}
              className="h-[230px] w-full object-cover object-[center_25%]"
              priority
            />
            <div className="absolute inset-0 bg-black/50" />
            <div className="absolute inset-0 flex flex-col items-center justify-center px-8 text-center text-white">
              <h1 className="banner-title">
                Insights, Tips & Guidance for Families
              </h1>
              <p className="banner-desc mt-2 max-w-5xl text-white/90">
                Explore helpful articles, expert advice, and real-life stories
                designed to guide families in making informed and confident
                decisions about senior care.
              </p>
            </div>
          </div>
        </section>
        <section className="container mx-auto px-6 lg:px-10">
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
        <section className="container mx-auto px-6 lg:px-10">
          <div className="relative overflow-hidden rounded-[14px]">
            <Image
              src="/images/about-banner.jpg"
              alt="Blogs banner"
              width={1600}
              height={420}
              className="h-[230px] w-full object-cover object-[center_25%]"
              priority
            />
            <div className="absolute inset-0 bg-black/50" />
            <div className="absolute inset-0 flex flex-col items-center justify-center px-8 text-center text-white">
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
            Unable to load blogs
          </p>
          <p className="mt-2 text-sm text-slate-500">Please try again later.</p>
        </section>
      </main>
    )
  }

  return (
    <main className="space-y-24 py-12">
      <section className="container mx-auto px-6 lg:px-10">
        <div className="relative overflow-hidden rounded-[14px]">
          <Image
            src="/images/about-banner.jpg"
            alt="Blogs banner"
            width={1600}
            height={420}
            className="h-[230px] w-full object-cover object-[center_25%]"
            priority
          />
          <div className="absolute inset-0 bg-black/50" />
          <div className="absolute inset-0 flex flex-col items-center justify-center px-8 text-center text-white">
            <h1 className="banner-title">
              Insights, Tips & Guidance for Families
            </h1>
            <p className="banner-desc mt-2 max-w-5xl text-white/90">
              Explore helpful articles, expert advice, and real-life stories
              designed to guide families in making informed and confident
              decisions about senior care.
            </p>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-6 lg:px-10">
        <h2 className="section-title text-slate-800">Recent blog posts</h2>

        {blogs.length === 0 ? (
          <div className="mt-10 rounded-lg bg-white p-10 text-center">
            <p className="text-base text-slate-500">
              No blog posts available yet.
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
                  className="h-[460px] w-full object-cover"
                />
                <div className="absolute inset-0 bg-black/45" />
                <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                  <span className="inline-flex rounded-full bg-primary px-4 py-1 text-xs">
                    {featured.category || 'Guide'}
                  </span>
                  <h3 className="mt-4 font-serif text-[42px] leading-[130%]">
                    {featured.title}
                  </h3>
                  <p className="mt-2 text-sm text-white/90">
                    {stripHtml(featured.excerpt)}
                  </p>
                  <Link
                    href={`/blogs/${featured.slug}`}
                    className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#1d86ff]"
                  >
                    Read more <ArrowUpRight className="h-4 w-4" />
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
                  className="grid grid-cols-[110px_1fr] gap-3 py-3 first:pt-0"
                >
                  <div className="relative h-[110px] overflow-hidden rounded-md">
                    <Image
                      src={post.thumbnail || '/images/connect-2.jpg'}
                      alt={post.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="text-[20px] leading-[145%] text-slate-800">
                      {post.title}
                    </h3>
                    <span className="mt-3 inline-flex rounded-full bg-primary px-4 py-1 text-xs text-white">
                      {post.category || 'General'}
                    </span>
                  </div>
                </Link>
              ))}
            </div>

            {/* Categories */}
            <aside className="border-l border-slate-200 pl-4">
              <h3 className="text-[36px] font-medium text-slate-800">
                Categories
              </h3>
              <ul className="mt-3 space-y-2">
                {categories.map(cat => (
                  <li key={cat} className="text-[18px] text-slate-500">
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
