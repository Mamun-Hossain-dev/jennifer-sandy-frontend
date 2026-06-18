import { HomeHeroSection } from '@/components/home/home-hero-section'
import { HomeContentSections } from '@/components/home/home-sections'

export default function Home() {
  return (
    <div className="min-h-screen bg-[#F3F3F3] pb-10 font-manrope">
      <main className="pt-12 space-y-24">
        <HomeHeroSection />
        <HomeContentSections />
      </main>
    </div>
  )
}
