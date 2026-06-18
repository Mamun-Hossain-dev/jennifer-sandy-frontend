'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState, useMemo } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { ContactCtaSection } from '@/components/shared/contact-cta-section'
import type { BlogPost } from '@/lib/blog-api'
import { stripHtml } from '@/lib/utils'
import { TranslatedText } from '@/components/shared/translated-text'

const ITEMS_PER_PAGE = 8

interface BlogSharedBottomProps {
  blogs: BlogPost[]
}

export function BlogSharedBottom({ blogs }: BlogSharedBottomProps) {
  const [page, setPage] = useState(1)

  const totalPages = Math.max(1, Math.ceil(blogs.length / ITEMS_PER_PAGE))

  const paginatedPosts = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE
    return blogs.slice(start, start + ITEMS_PER_PAGE)
  }, [blogs, page])

  const showingStart = blogs.length === 0 ? 0 : (page - 1) * ITEMS_PER_PAGE + 1
  const showingEnd = Math.min(page * ITEMS_PER_PAGE, blogs.length)

  const pageNumbers = useMemo(() => {
    const pages: (number | 'ellipsis')[] = []
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
    } else {
      pages.push(1)
      if (page > 3) pages.push('ellipsis')
      for (
        let i = Math.max(2, page - 1);
        i <= Math.min(totalPages - 1, page + 1);
        i++
      ) {
        pages.push(i)
      }
      if (page < totalPages - 2) pages.push('ellipsis')
      pages.push(totalPages)
    }
    return pages
  }, [totalPages, page])

  return (
    <>
      <ContactCtaSection />

      <section className="container mx-auto px-4 sm:px-6 lg:px-10">
        <h2 className="section-title text-center text-primary">
          <TranslatedText text="All Blogs" cacheKey="blogs:all:title" />
        </h2>
        <p className="section-desc mt-1 text-center text-slate-500">
          <TranslatedText
            text="Explore all our articles, tips, and stories to stay informed and make the best decisions for your loved ones&apos; care."
            cacheKey="blogs:all:subtitle"
          />
        </p>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {paginatedPosts.map(post => (
            <article
              key={post._id}
              className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-[0_1px_0_rgba(15,23,42,0.04)]"
            >
              <div className="relative h-[150px] w-full">
                <Image
                  src={post.thumbnail || '/images/blog.jpg'}
                  alt={post.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <Link
                  href={`/blogs/${post.slug}`}
                  className="text-[17px] font-medium leading-[145%] text-slate-800 hover:text-primary"
                >
                  {post.title}
                </Link>
                <p className="mt-2 text-[15px] leading-[150%] text-slate-500 line-clamp-2">
                  {stripHtml(post.excerpt)}
                </p>
                <Link
                  href={`/blogs/${post.slug}`}
                  className="mt-2 block text-[15px] font-semibold text-primary"
                >
                  <TranslatedText text="Read More" cacheKey="blogs:read-more" />
                </Link>
              </div>
            </article>
          ))}
        </div>

        {totalPages > 1 && (
          <div className="mt-10 flex flex-col items-start justify-between gap-4 text-base text-slate-500 sm:flex-row sm:items-center">
            <p>
              <TranslatedText
                text={`Showing ${showingStart} to ${showingEnd} of ${blogs.length} entries`}
                cacheKey={`blogs:showing:${page}:${blogs.length}`}
              />
            </p>
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="flex h-9 w-9 items-center justify-center rounded border border-slate-300 text-[15px] text-slate-500 disabled:opacity-50"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              {pageNumbers.map((p, i) =>
                p === 'ellipsis' ? (
                  <span key={`e-${i}`} className="px-1 text-slate-400">
                    ...
                  </span>
                ) : (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`flex h-9 w-9 items-center justify-center rounded border text-[15px] ${
                      p === page
                        ? 'border-primary bg-primary text-white'
                        : 'border-slate-300 text-slate-500'
                    }`}
                  >
                    {p}
                  </button>
                ),
              )}
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="flex h-9 w-9 items-center justify-center rounded border border-slate-300 text-[15px] text-slate-500 disabled:opacity-50"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </section>
    </>
  )
}
