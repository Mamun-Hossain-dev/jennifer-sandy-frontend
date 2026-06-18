import type { PaginationMeta } from '@/types/dashboard'

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'

export interface BlogPost {
  _id: string
  title: string
  slug: string
  excerpt: string
  content?: string
  category: string
  tags: string[]
  thumbnail: string
  author: string
  publishedAt: string
  createdAt: string
  updatedAt: string
}

// Actual API response shape: { message, meta, data: BlogPost[] }
export interface BlogApiResponse {
  message: string
  meta: PaginationMeta
  data: BlogPost[]
}

export interface BlogSingleApiResponse {
  message: string
  data: BlogPost
}

async function apiRequest<T>(path: string) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  })

  if (!response.ok) {
    const err = await response.json().catch(() => null)
    throw new Error(err?.message || 'Request failed')
  }

  return response.json() as Promise<T>
}

export async function fetchBlogs(params?: {
  page?: number
  limit?: number
  category?: string
}) {
  const searchParams = new URLSearchParams()
  if (params?.page) searchParams.set('page', String(params.page))
  if (params?.limit) searchParams.set('limit', String(params.limit))
  if (params?.category) searchParams.set('category', params.category)

  const query = searchParams.toString()
  return apiRequest<BlogApiResponse>(`/blog${query ? `?${query}` : ''}`)
}

export async function fetchBlogBySlug(slug: string) {
  return apiRequest<BlogSingleApiResponse>(`/blog/slug/${slug}`)
}
