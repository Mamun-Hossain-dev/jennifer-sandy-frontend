import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ApartmentDetailContent } from '@/components/apartments/apartment-detail-content'
import {
  fetchApartmentBySlugOrId,
  fetchSimilarApartments,
} from '@/lib/apartments-api'

interface Props {
  params: { id: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const apt = await fetchApartmentBySlugOrId(params.id)
    return {
      title: `${apt.title} | 0211wohnen`,
      description: `${apt.size} m² • ${apt.rooms} rooms • ${apt.district} • from ${apt.price} € / month`,
    }
  } catch {
    return { title: 'Apartment Not Found | 0211wohnen' }
  }
}

export default async function ApartmentDetailPage({ params }: Props) {
  try {
    const apt = await fetchApartmentBySlugOrId(params.id)
    const similarApartments = await fetchSimilarApartments(params.id, 6).catch(
      () => [],
    )

    return (
      <div className="min-h-screen bg-[#F9FBFC] font-manrope">
        <ApartmentDetailContent
          apartment={apt}
          allApartments={similarApartments}
        />
      </div>
    )
  } catch {
    notFound()
  }
}
