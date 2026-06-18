import type { Metadata } from 'next'
import { LandlordsPageContent } from '@/components/landlords/landlords-page-content'

export const metadata: Metadata = {
  title: 'Landlords | 0211wohnen',
  description:
    'Rent your furnished apartment with 0211wohnen. Full-service property management for landlords in Düsseldorf.',
}

export default function LandlordsPage() {
  return (
    <div className="min-h-screen bg-[#F3F3F3] font-manrope">
      <LandlordsPageContent />
    </div>
  )
}
