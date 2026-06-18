'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { fetchBlogBySlug, fetchBlogs } from '@/lib/blog-api'
import { BlogSharedBottom } from '@/components/blog/blog-shared-bottom'
import { stripHtml } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'
import { TranslatedText } from '@/components/shared/translated-text'

export function BlogDetailsPageContent() {
  const params = useParams()
  const slug = params?.slug as string

  const { data, isLoading, isError } = useQuery({
    queryKey: ['blog-detail', slug],
    queryFn: () => fetchBlogBySlug(slug),
    enabled: !!slug,
    staleTime: 1000 * 60 * 5,
  })

  const { data: allBlogsData } = useQuery({
    queryKey: ['public-blogs', 1],
    queryFn: () => fetchBlogs({ page: 1, limit: 100 }),
    staleTime: 1000 * 60 * 5,
  })

  const blog = data?.data
  const allBlogs = allBlogsData?.data || []
  const relatedArticles = allBlogs.filter(b => b.slug !== slug).slice(0, 3)

  if (isLoading) {
    return (
      <main className="space-y-8 py-12">
        <section className="container mx-auto px-4 sm:px-6 lg:px-10">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="mt-6 h-[260px] w-full rounded-lg sm:h-[420px]" />
          <Skeleton className="mt-8 h-10 w-3/4" />
          <Skeleton className="mt-4 h-4 w-full" />
          <Skeleton className="mt-3 h-4 w-5/6" />
        </section>
      </main>
    )
  }

  if (isError || !blog) {
    return (
      <main className="space-y-24 py-12">
        <section className="container mx-auto flex flex-col items-center justify-center px-4 py-20 sm:px-6 lg:px-10">
          <p className="text-lg font-semibold text-slate-800">
            <TranslatedText
              text="Blog post not found"
              cacheKey="blog-detail:not-found"
            />
          </p>
          <Link
            href="/blogs"
            className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            <TranslatedText text="Back to blogs" cacheKey="blog-detail:back" />
          </Link>
        </section>
      </main>
    )
  }

  return (
    <main className="space-y-24 py-12">
      <section className="container mx-auto px-4 sm:px-6 lg:px-10">
        <Link
          href="/blogs"
          className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          <TranslatedText text="Back to blogs" cacheKey="blog-detail:back" />
        </Link>

        <article className="relative mt-4 overflow-hidden rounded-[12px]">
          <Image
            src={blog.thumbnail || '/images/properties-3.jpg'}
            alt={blog.title}
            width={1600}
            height={650}
            className="h-[240px] w-full object-cover sm:h-[360px]"
            priority
          />
          <div className="absolute inset-0 bg-black/50" />
          <div className="absolute inset-x-0 bottom-0 p-4 text-white sm:p-6 lg:p-8">
            <span className="inline-flex rounded-full bg-primary px-6 py-1.5 text-sm">
              <TranslatedText
                text={blog.category || 'Guide'}
                sourceLang="en"
                cacheKey={`blog-detail:category:${blog.category || 'Guide'}`}
              />
            </span>
            <h1 className="mt-5 max-w-3xl font-serif text-[30px] leading-[130%] sm:text-[52px]">
              {blog.title}
            </h1>
            <p className="mt-3 text-sm text-white/90">
              <TranslatedText
                text={blog.author ? `By ${blog.author}` : 'By the 0211 team'}
                sourceLang="en"
                cacheKey={`blog-detail:author:${blog.author || 'team'}`}
              />{' '}
              |{' '}
              {blog.publishedAt
                ? new Date(blog.publishedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })
                : <TranslatedText text="Recent" cacheKey="blog-detail:recent" />}
            </p>
          </div>
        </article>
      </section>

      <section className="container mx-auto px-4 sm:px-6 lg:px-10">
        <div className="grid items-start gap-8 lg:grid-cols-[1fr_320px]">
          <article className="space-y-8 pr-0 lg:pr-2">
            <p className="section-desc text-slate-600">
              {stripHtml(blog.excerpt || blog.content || '')}
            </p>

            {blog.content && (
              <div
                className="space-y-4 section-desc text-slate-600"
                dangerouslySetInnerHTML={{ __html: blog.content }}
              />
            )}
          </article>

          <aside className="space-y-5">
            <div className="rounded-lg bg-white p-5">
              <h3 className="text-[24px] font-semibold text-slate-800 sm:text-[28px]">
                <TranslatedText
                  text="Related Articles"
                  cacheKey="blog-detail:related"
                />
              </h3>
              <div className="mt-4 space-y-3">
                {relatedArticles.map(item => (
                  <Link
                    key={item._id}
                    href={`/blogs/${item.slug}`}
                    className="grid grid-cols-[72px_1fr] gap-3 sm:grid-cols-[84px_1fr]"
                  >
                    <div className="relative h-[72px] overflow-hidden rounded-md sm:h-[84px]">
                      <Image
                        src={item.thumbnail || '/images/properties-1.jpg'}
                        alt={item.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-[14px] font-medium leading-[140%] text-slate-800 truncate">
                        {item.title}
                      </h4>
                      <p className="mt-1 text-[12px] leading-[140%] text-slate-500 line-clamp-2">
                        {stripHtml(item.excerpt || '')}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <div className="rounded-lg bg-white p-5">
              <h3 className="text-[24px] font-semibold text-primary sm:text-[28px]">
                <TranslatedText
                  text="Newsletter"
                  cacheKey="blog-detail:newsletter"
                />
              </h3>
              <p className="mt-2 text-[14px] text-slate-500">
                <TranslatedText
                  text="Subscribe to Our Updates"
                  cacheKey="blog-detail:subscribe"
                />
              </p>
              <div className="mt-4 flex gap-2">
                <input
                  type="email"
                  placeholder="E-mail Address"
                  className="h-10 flex-1 rounded border border-slate-300 px-3 text-sm outline-none"
                />
                <button className="h-10 rounded bg-primary px-5 text-sm text-white">
                  <TranslatedText text="Send" cacheKey="blog-detail:send" />
                </button>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <BlogSharedBottom blogs={allBlogs} />
    </main>
  )
}
