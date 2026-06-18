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
        <section className="container mx-auto px-6 lg:px-10">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="mt-6 h-[420px] w-full rounded-lg" />
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
        <section className="container mx-auto flex flex-col items-center justify-center px-6 py-20 lg:px-10">
          <p className="text-lg font-semibold text-slate-800">
            Blog post not found
          </p>
          <Link
            href="/blogs"
            className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to blogs
          </Link>
        </section>
      </main>
    )
  }

  return (
    <main className="space-y-24 py-12">
      <section className="container mx-auto px-6 lg:px-10">
        <Link
          href="/blogs"
          className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to blogs
        </Link>

        <article className="relative mt-4 overflow-hidden rounded-[12px]">
          <Image
            src={blog.thumbnail || '/images/properties-3.jpg'}
            alt={blog.title}
            width={1600}
            height={650}
            className="h-[360px] w-full object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/50" />
          <div className="absolute inset-x-0 bottom-0 p-6 text-white lg:p-8">
            <span className="inline-flex rounded-full bg-primary px-6 py-1.5 text-sm">
              {blog.category || 'Guide'}
            </span>
            <h1 className="mt-5 max-w-3xl font-serif text-[52px] leading-[130%]">
              {blog.title}
            </h1>
            <p className="mt-3 text-sm text-white/90">
              {blog.author ? `By ${blog.author}` : 'By the 0211 team'} |{' '}
              {blog.publishedAt
                ? new Date(blog.publishedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })
                : 'Recent'}
            </p>
          </div>
        </article>
      </section>

      <section className="container mx-auto px-6 lg:px-10">
        <div className="grid items-start gap-8 lg:grid-cols-[1fr_320px]">
          <article className="space-y-8 pr-2">
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
              <h3 className="text-[28px] font-semibold text-slate-800">
                Related Articles
              </h3>
              <div className="mt-4 space-y-3">
                {relatedArticles.map(item => (
                  <Link
                    key={item._id}
                    href={`/blogs/${item.slug}`}
                    className="grid grid-cols-[84px_1fr] gap-3"
                  >
                    <div className="relative h-[84px] overflow-hidden rounded-md">
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
              <h3 className="text-[28px] font-semibold text-primary">
                Newsletter
              </h3>
              <p className="mt-2 text-[14px] text-slate-500">
                Subscribe to Our Updates
              </p>
              <div className="mt-4 flex gap-2">
                <input
                  type="email"
                  placeholder="E-mail Address"
                  className="h-10 flex-1 rounded border border-slate-300 px-3 text-sm outline-none"
                />
                <button className="h-10 rounded bg-primary px-5 text-sm text-white">
                  Send
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
