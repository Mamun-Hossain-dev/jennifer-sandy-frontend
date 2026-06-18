'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  BedDouble,
  Calendar,
  Check,
  ChevronDown,
  CircleCheck,
  MapPin,
  Minus,
  Plus,
  Search,
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { fetchApartments, fetchPopularAreas } from '@/lib/apartments-api'
import { TranslatedText } from '@/components/shared/translated-text'
import { useTranslatedText } from '@/hooks/use-translated-text'

export function HomeHeroSection() {
  const router = useRouter()
  const [availableFrom, setAvailableFrom] = useState('')
  const [district, setDistrict] = useState('')
  const [rooms, setRooms] = useState(3)

  const { data: areas = [] } = useQuery({
    queryKey: ['home-popular-areas'],
    queryFn: fetchPopularAreas,
    staleTime: 1000 * 60 * 10,
  })

  const { data: apartmentData } = useQuery({
    queryKey: ['home-apartment-count'],
    queryFn: () => fetchApartments({ page: 1, limit: 1 }),
    staleTime: 1000 * 60 * 10,
  })

  const districtOptions = useMemo(
    () => areas.map(area => area.district).filter(Boolean),
    [areas],
  )
  const apartmentCount = apartmentData?.meta?.total ?? apartmentData?.apartments.length
  const districtPlaceholder = useTranslatedText('e.g. Media Harbour', 'en', {
    cacheKey: 'home:hero:district-placeholder',
  })

  const handleSearch = () => {
    const params = new URLSearchParams()

    if (availableFrom) params.set('availableFrom', availableFrom)
    if (district) params.set('district', district)
    if (rooms) params.set('rooms', rooms >= 4 ? '4+' : String(rooms))

    router.push(`/apartments${params.toString() ? `?${params.toString()}` : ''}`)
  }

  return (
    <section className="container mx-auto px-[6px] sm:px-6 lg:px-10">
      <div className="relative overflow-hidden rounded-[24px] bg-slate-900">
        <div className="absolute inset-0">
          <Image
            src="/images/home-banner.jpg"
            alt="Luxury home"
            width={1600}
            height={950}
            className="h-full min-h-[760px] w-full object-cover sm:min-h-[820px]"
            priority
          />
          <div className="absolute inset-0 bg-black/45" />
        </div>

        <div className="relative z-10 flex min-h-[760px] flex-col items-center justify-center px-4 py-10 text-center sm:min-h-[820px] sm:px-6 lg:px-10">
          <div className="max-w-4xl">
            <h1 className="banner-title text-[#E6F2FD]">
              <TranslatedText
                text="Your Desire Home in Duesseldorf"
                cacheKey="home:hero:title"
              />
            </h1>
            <p className="banner-desc mt-3 text-balance text-white/90">
              <TranslatedText
                text="Furnished apartments from professionals. No agents. No fees."
                cacheKey="home:hero:subtitle"
              />
            </p>
          </div>

          <div className="mt-8 w-full max-w-5xl overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-black/5">
            <div className="grid gap-px md:grid-cols-2 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,1.1fr)_minmax(0,1fr)_180px]">
              <div className="flex items-start gap-3 bg-white px-4 py-4 text-left sm:px-5">
                <div className="space-y-1 text-slate-500">
                  <Calendar className="h-5 w-5" />
                  <Calendar className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-slate-700 sm:text-base">
                    <TranslatedText
                      text="Available From"
                      cacheKey="home:hero:available-from"
                    />
                  </p>
                  <input
                    type="date"
                    value={availableFrom}
                    onChange={event => setAvailableFrom(event.target.value)}
                    className="mt-1 w-full bg-transparent text-sm text-slate-500 outline-none sm:text-base"
                  />
                </div>
              </div>

              <div className="flex items-start gap-3 bg-white px-4 py-4 text-left sm:px-5">
                <div className="space-y-1 text-slate-500">
                  <MapPin className="h-5 w-5" />
                  <MapPin className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-slate-700 sm:text-base">
                    <TranslatedText
                      text="District"
                      cacheKey="home:hero:district"
                    />
                  </p>
                  <DropdownMenu>
                    <DropdownMenuTrigger className="mt-1 flex w-full items-center justify-between gap-2 text-left text-sm text-slate-500 outline-none sm:text-base">
                      <span className="truncate">
                        {district || districtPlaceholder}
                      </span>
                      <ChevronDown className="h-4 w-4 shrink-0" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="max-h-72 min-w-[230px] rounded-xl border border-slate-100 bg-white p-1 shadow-xl">
                      <DropdownMenuItem
                        onClick={() => setDistrict('')}
                        className="cursor-pointer justify-between rounded-lg px-3 py-2 text-sm font-medium"
                      >
                        <TranslatedText
                          text="All districts"
                          cacheKey="home:hero:all-districts"
                        />
                        {!district && <Check className="h-4 w-4 text-[#1672E6]" />}
                      </DropdownMenuItem>
                      {districtOptions.map(option => (
                        <DropdownMenuItem
                          key={option}
                          onClick={() => setDistrict(option)}
                          className="cursor-pointer justify-between rounded-lg px-3 py-2 text-sm font-medium"
                        >
                          <span className="truncate">{option}</span>
                          {district === option && (
                            <Check className="h-4 w-4 text-[#1672E6]" />
                          )}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-white px-4 py-4 text-left sm:px-5">
                <BedDouble className="mt-0.5 h-5 w-5 shrink-0 text-slate-500" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-slate-700 sm:text-base">
                    <TranslatedText text="Room" cacheKey="home:hero:room" />
                  </p>
                  <div className="mt-2 flex items-center gap-3 text-slate-500">
                    <button
                      type="button"
                      onClick={() => setRooms(value => Math.max(1, value - 1))}
                      aria-label="Decrease rooms"
                      className="shrink-0"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <input
                      type="range"
                      min={1}
                      max={4}
                      value={rooms}
                      onChange={event => setRooms(Number(event.target.value))}
                      className="h-2 w-full accent-[#1672E6]"
                    />
                    <button
                      type="button"
                      onClick={() => setRooms(value => Math.min(4, value + 1))}
                      aria-label="Increase rooms"
                      className="shrink-0"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                    <span className="min-w-6 text-sm font-semibold text-[#1672E6]">
                      {rooms >= 4 ? '4+' : rooms}
                    </span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleSearch}
                className="flex min-h-[72px] items-center justify-center gap-2 bg-[#1672E6] px-5 text-base font-semibold text-white shadow-sm transition-all duration-200 hover:bg-[#0f63ce] hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1672E6]/30 active:translate-y-px active:scale-[0.98] md:col-span-2 xl:col-span-1 xl:min-h-full"
              >
                <Search className="h-5 w-5" />
                <TranslatedText text="Search" cacheKey="home:hero:search" />
              </button>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm text-white sm:gap-x-8 lg:text-base">
            <div className="flex items-center gap-2">
              <CircleCheck className="h-5 w-5 text-[#00E36E]" />
              <span>
                {apartmentCount || 120}{' '}
                <TranslatedText
                  text="Apartments"
                  cacheKey="home:hero:apartments"
                />
              </span>
            </div>
            <div className="flex items-center gap-2">
              <CircleCheck className="h-5 w-5 text-[#00E36E]" />
              <span>
                <TranslatedText
                  text="100% Full-Service"
                  cacheKey="home:hero:full-service"
                />
              </span>
            </div>
            <div className="flex items-center gap-2">
              <CircleCheck className="h-5 w-5 text-[#00E36E]" />
              <span>
                <TranslatedText
                  text="Only Duesseldorf"
                  cacheKey="home:hero:only-dusseldorf"
                />
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
