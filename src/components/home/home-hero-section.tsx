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

  const handleSearch = () => {
    const params = new URLSearchParams()

    if (availableFrom) params.set('availableFrom', availableFrom)
    if (district) params.set('district', district)
    if (rooms) params.set('rooms', rooms >= 4 ? '4+' : String(rooms))

    router.push(`/apartments${params.toString() ? `?${params.toString()}` : ''}`)
  }

  return (
    <section className="container mx-auto px-6 lg:px-10">
      <div className="relative overflow-hidden rounded-[24px]">
        <Image src="/images/home-banner.jpg" alt="Luxury home" width={1600} height={950} className="h-[760px] w-full object-cover" priority />
        <div className="absolute inset-0 bg-black/45" />

        <div className="absolute inset-x-0 top-[30%] flex flex-col items-center px-6 text-center">
          <h1 className="banner-title text-[#E6F2FD]">Your Desire Home in Duesseldorf</h1>
          <p className="banner-desc mt-3 text-white/90">Furnished apartments from professionals. No agents. No fees.</p>

          <div className="mt-10 flex w-full items-center rounded-xl bg-white px-4 py-4 shadow-xl lg:px-6">
            <div className="flex flex-1 items-center gap-3 border-r border-slate-300 pr-4">
              <div className="space-y-1 text-slate-500"><Calendar className="h-5 w-5" /><Calendar className="h-5 w-5" /></div>
              <div className="text-left">
                <p className="text-base font-medium text-slate-700 lg:text-lg">Available From</p>
                <input
                  type="date"
                  value={availableFrom}
                  onChange={event => setAvailableFrom(event.target.value)}
                  className="mt-1 w-full bg-transparent text-sm text-slate-500 outline-none lg:text-base"
                />
              </div>
            </div>

            <div className="flex flex-1 items-center gap-3 border-r border-slate-300 px-4">
              <div className="space-y-1 text-slate-500"><MapPin className="h-5 w-5" /><MapPin className="h-5 w-5" /></div>
              <div className="text-left">
                <p className="text-base font-medium text-slate-700 lg:text-lg">District</p>
                <DropdownMenu>
                  <DropdownMenuTrigger className="mt-1 flex max-w-[220px] items-center gap-2 text-sm text-slate-500 outline-none lg:text-base">
                    <span className="truncate">{district || 'e.g. Media Harbour'}</span>
                    <ChevronDown className="h-4 w-4 shrink-0" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="max-h-72 min-w-[230px] rounded-xl border border-slate-100 bg-white p-1 shadow-xl">
                    <DropdownMenuItem
                      onClick={() => setDistrict('')}
                      className="cursor-pointer justify-between rounded-lg px-3 py-2 text-sm font-medium"
                    >
                      All districts
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

            <div className="flex flex-1 items-center gap-3 px-4">
              <BedDouble className="h-5 w-5 text-slate-500" />
              <div className="flex-1 text-left">
                <p className="text-base font-medium text-slate-700 lg:text-lg">Room</p>
                <div className="mt-2 flex items-center gap-3 text-slate-500">
                  <button
                    type="button"
                    onClick={() => setRooms(value => Math.max(1, value - 1))}
                    aria-label="Decrease rooms"
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
              className="ml-3 flex h-12 min-w-[150px] items-center justify-center gap-2 rounded-md bg-[#1672E6] px-5 text-base text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#0f63ce] hover:shadow-lg active:translate-y-px active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1672E6]/30"
            >
              <Search className="h-5 w-5" /> Search
            </button>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-8 text-sm text-white lg:text-base">
            <div className="flex items-center gap-2"><CircleCheck className="h-5 w-5 text-[#00E36E]" /><span>{apartmentCount || 120}+ Apartments</span></div>
            <div className="flex items-center gap-2"><CircleCheck className="h-5 w-5 text-[#00E36E]" /><span>100% Full-Service</span></div>
            <div className="flex items-center gap-2"><CircleCheck className="h-5 w-5 text-[#00E36E]" /><span>Only Duesseldorf</span></div>
          </div>
        </div>
      </div>
    </section>
  )
}
