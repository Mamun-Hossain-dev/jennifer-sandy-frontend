import { HomeHeroSection } from '@/components/home/home-hero-section'
import { HomeContentSections } from '@/components/home/home-sections'

export default function Home() {
  return (
    <div className="min-h-screen bg-[#F3F3F3] pb-10 font-manrope">
      <main className="space-y-16 pt-6 sm:space-y-24 sm:pt-10">
        <HomeHeroSection />
        <HomeContentSections />
      </main>
    </div>
  )
}
