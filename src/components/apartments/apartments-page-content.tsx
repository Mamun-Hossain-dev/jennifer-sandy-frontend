'use client'

import { Fragment, useDeferredValue, useEffect, useMemo, useState } from 'react'
import { FaqAccordion, FaqItem } from '@/components/shared/faq-accordion'
import Image from 'next/image'
import Link from 'next/link'
import {
  Calendar,
  Check,
  ChevronDown,
  CircleCheck,
  List,
  Map,
  MapPin,
  Search,
} from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import dynamic from 'next/dynamic'
import { fetchApartments, fetchPopularAreas } from '@/lib/apartments-api'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'

const MapComponent = dynamic(() => import('./MapComponent'), {
  ssr: false,
  loading: () => (
    <Skeleton className="h-full w-full rounded-2xl border border-slate-200" />
  ),
})

const allAmenities = [
  'Balcony/Terrace',
  'Fitted kitchen',
  'Furnished',
  'Elevator',
  'Transportation & parking',
  'Move-in coordination',
  'Concierge',
  'Meal preparation and service',
  'Community-sponsored activities',
  'Pet-friendly',
  'Wi-Fi',
  'Washing Machine',
  'Emergency Alert System',
]

const faqItems: FaqItem[] = [
  {
    question: 'How do I search for available apartments?',
    answer:
      'You can use the search bar and filters on this page to find apartments by district, price range, room count, amenities, and availability date.',
  },
  {
    question: 'Are the apartments furnished?',
    answer:
      'Many of our apartments come fully furnished with modern furniture, fitted kitchens, and essential appliances.',
  },
  {
    question: 'What is the rental process?',
    answer:
      'Once you find an apartment you like, simply click "Details" to view more information and submit an inquiry.',
  },
  {
    question: 'Can I visit the apartment before renting?',
    answer:
      'Yes, we offer both virtual and in-person viewings. After submitting an inquiry, our team will coordinate a convenient time.',
  },
  {
    question: 'Is pet-friendly housing available?',
    answer:
      'Yes, many of our listed properties are pet-friendly. Use the amenities filter and select "Pet-friendly".',
  },
]

function ApartmentCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-[0_4px_25px_rgba(0,0,0,0.02)]">
      <Skeleton className="h-[240px] w-full rounded-none" />
      <div className="space-y-4 p-6">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-6 w-28" />
        <div className="flex items-center justify-between border-t border-slate-100 pt-4">
          <Skeleton className="h-4 w-36" />
          <Skeleton className="h-9 w-20 rounded-xl" />
        </div>
      </div>
    </div>
  )
}

function MapViewSkeleton() {
  return (
    <div className="flex h-[680px] flex-col gap-6 lg:flex-row">
      <div className="w-full space-y-4 lg:w-[360px]">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="flex gap-4 rounded-2xl border border-slate-100 bg-white p-3 shadow-sm"
          >
            <Skeleton className="h-20 w-28 shrink-0 rounded-xl" />
            <div className="flex flex-1 flex-col justify-between py-1">
              <Skeleton className="h-4 w-4/5" />
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-4 w-16" />
            </div>
          </div>
        ))}
      </div>
      <Skeleton className="h-full min-h-[350px] flex-1 rounded-2xl" />
    </div>
  )
}

interface ApartmentsPageContentProps {
  initialFilters?: {
    availableFrom?: string
    district?: string
    rooms?: string
    searchTerm?: string
  }
}

export function ApartmentsPageContent({
  initialFilters,
}: ApartmentsPageContentProps) {
  const pageSize = 10
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list')
  const [currentPage, setCurrentPage] = useState(1)
  const [searchText, setSearchText] = useState(initialFilters?.searchTerm ?? '')
  const deferredSearchText = useDeferredValue(searchText)

  // ——— Draft states (sidebar controls) ———
  const [draftDistricts, setDraftDistricts] = useState<string[]>(
    initialFilters?.district ? [initialFilters.district] : [],
  )
  const [draftRooms, setDraftRooms] = useState<string[]>(
    initialFilters?.rooms ? [initialFilters.rooms] : [],
  )
  const [draftAmenities, setDraftAmenities] = useState<string[]>([])
  const [draftDate, setDraftDate] = useState(
    initialFilters?.availableFrom ?? '',
  )
  const [draftMaxPrice, setDraftMaxPrice] = useState(3000)

  // ——— Applied states (used for query/filter) ———
  const [appliedDistricts, setAppliedDistricts] = useState<string[]>(
    initialFilters?.district ? [initialFilters.district] : [],
  )
  const [appliedRooms, setAppliedRooms] = useState<string[]>(
    initialFilters?.rooms ? [initialFilters.rooms] : [],
  )
  const [appliedAmenities, setAppliedAmenities] = useState<string[]>([])
  const [appliedDate, setAppliedDate] = useState(
    initialFilters?.availableFrom ?? '',
  )
  const [appliedMaxPrice, setAppliedMaxPrice] = useState(3000)
  const [isPriceApplied, setIsPriceApplied] = useState(false)
  const [sortBy, setSortBy] = useState('popularity')

  const apartmentQueryParams = useMemo(() => {
    const params: Parameters<typeof fetchApartments>[0] = {
      page: currentPage,
      limit: pageSize,
      searchTerm: deferredSearchText.trim() || undefined,
      district: appliedDistricts[0] || undefined,
      availableFrom: appliedDate || undefined,
      maxPrice: isPriceApplied ? appliedMaxPrice : undefined,
    }

    if (appliedRooms.length === 1) {
      const room = appliedRooms[0]
      params.minRooms = room === '4+' ? 4 : Number(room)
      params.maxRooms = room === '4+' ? undefined : Number(room)
    }

    if (sortBy === 'price-asc') {
      params.sortBy = 'kaltmiete'
      params.sortOrder = 'asc'
    }
    if (sortBy === 'price-desc') {
      params.sortBy = 'kaltmiete'
      params.sortOrder = 'desc'
    }

    return params
  }, [
    appliedDate,
    appliedMaxPrice,
    appliedDistricts,
    appliedRooms,
    currentPage,
    deferredSearchText,
    isPriceApplied,
    sortBy,
  ])

  const { data, isLoading, isFetching, isError } = useQuery({
    queryKey: ['public-apartments', apartmentQueryParams],
    queryFn: () => fetchApartments(apartmentQueryParams),
    staleTime: 1000 * 60 * 5,
  })

  const { data: popularAreas = [] } = useQuery({
    queryKey: ['popular-areas'],
    queryFn: fetchPopularAreas,
    staleTime: 1000 * 60 * 10,
  })

  useEffect(() => {
    setCurrentPage(1)
  }, [
    appliedDate,
    appliedMaxPrice,
    isPriceApplied,
    appliedDistricts,
    appliedRooms,
    appliedAmenities,
    sortBy,
    deferredSearchText,
  ])

  const filteredApartments = useMemo(() => {
    const apartments = data?.apartments ?? []
    return apartments
      .filter(apt => {
        if (
          appliedDistricts.length > 0 &&
          !appliedDistricts.some(
            d => d.toLowerCase() === apt.district.toLowerCase(),
          )
        )
          return false
        if (
          appliedRooms.length > 0 &&
          !appliedRooms.some(r =>
            r === '4+' ? apt.rooms >= 4 : apt.rooms === Number(r),
          )
        )
          return false
        if (
          appliedAmenities.length > 0 &&
          !appliedAmenities.every(a => apt.amenities.includes(a))
        )
          return false
        return true
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price
        if (sortBy === 'price-desc') return b.price - a.price
        return 0
      })
  }, [
    data?.apartments,
    appliedAmenities,
    appliedDistricts,
    appliedRooms,
    sortBy,
  ])

  const districtOptions = useMemo(() => {
    const fromAreas = popularAreas.map(area => area.district).filter(Boolean)
    const fromApartments = (data?.apartments ?? [])
      .map(a => a.district)
      .filter(Boolean)
    return Array.from(new Set([...fromAreas, ...fromApartments]))
  }, [data?.apartments, popularAreas])

  const appliedDistrictLabel = appliedDistricts[0] || 'District'
  const sortLabel =
    {
      popularity: 'popularity',
      'price-asc': 'price: low to high',
      'price-desc': 'price: high to low',
    }[sortBy] ?? 'popularity'
  const totalItems = data?.meta?.total ?? filteredApartments.length
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))
  const showingStart = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1
  const showingEnd = Math.min(currentPage * pageSize, totalItems)

  const pageNumbers = useMemo(() => {
    const pages = new Set([
      1,
      totalPages,
      currentPage - 1,
      currentPage,
      currentPage + 1,
    ])
    return Array.from(pages)
      .filter(p => p >= 1 && p <= totalPages)
      .sort((a, b) => a - b)
  }, [currentPage, totalPages])

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages)
  }, [currentPage, totalPages])

  function applyFilters() {
    setAppliedDistricts(draftDistricts)
    setAppliedRooms(draftRooms)
    setAppliedAmenities(draftAmenities)
    setAppliedDate(draftDate)
    setAppliedMaxPrice(draftMaxPrice)
    setIsPriceApplied(draftMaxPrice < 3000)
  }

  return (
    <main className="pb-16 pt-6 font-manrope bg-[#F9FBFC] min-h-screen">
      {/* SEARCH BAR */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-10 mb-8">
        <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100 p-3 flex flex-col md:flex-row items-center gap-4 w-full">
          <div className="flex items-center gap-2 px-4 py-2 border-b md:border-b-0 md:border-r border-slate-200 w-full md:w-auto shrink-0">
            <MapPin className="h-5 w-5 text-slate-400" />
            <DropdownMenu>
              <DropdownMenuTrigger className="inline-flex min-w-[150px] items-center justify-between gap-2 rounded-xl px-2 py-1.5 text-sm font-semibold text-slate-700 outline-none transition-colors hover:bg-slate-50 focus:bg-slate-50">
                <span className="max-w-[180px] truncate">
                  {appliedDistrictLabel}
                </span>
                <ChevronDown className="h-4 w-4 text-slate-400" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="max-h-72 min-w-[220px] rounded-xl border border-slate-100 bg-white p-1 shadow-xl">
                <DropdownMenuItem
                  onClick={() => {
                    setDraftDistricts([])
                    setAppliedDistricts([])
                  }}
                  className="cursor-pointer justify-between rounded-lg px-3 py-2 text-sm font-medium"
                >
                  District
                  {appliedDistricts.length === 0 && (
                    <Check className="h-4 w-4 text-[#1672E6]" />
                  )}
                </DropdownMenuItem>
                {districtOptions.map(district => (
                  <DropdownMenuItem
                    key={district}
                    onClick={() => {
                      setDraftDistricts([district])
                      setAppliedDistricts([district])
                    }}
                    className="cursor-pointer justify-between rounded-lg px-3 py-2 text-sm font-medium"
                  >
                    <span className="truncate">{district}</span>
                    {appliedDistricts[0] === district && (
                      <Check className="h-4 w-4 text-[#1672E6]" />
                    )}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="flex-1 flex items-center gap-2 px-2 w-full">
            <input
              type="text"
              placeholder="e.g. Media Harbour"
              className="w-full text-slate-700 placeholder-slate-400 bg-transparent focus:outline-none py-2 font-medium"
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
            />
          </div>
          <button className="bg-[#1672E6] hover:bg-[#0f63ce] text-white px-8 py-3.5 rounded-xl font-semibold flex items-center gap-2 shadow-sm transition-all duration-200 shrink-0 w-full md:w-auto justify-center">
            <Search className="h-5 w-5" />
            Search
          </button>
        </div>
      </section>

      {/* FILTERS + RESULTS */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-10">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* SIDEBAR FILTER */}
          <aside className="w-full lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)] lg:w-80 lg:overflow-y-auto bg-white rounded-2xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] p-6 shrink-0">
            <div className="space-y-6">
              {/* Available from */}
              <div>
                <h4 className="text-sm font-semibold text-slate-800 mb-2.5 flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-slate-400" /> Available from
                </h4>
                <input
                  type="date"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#1672E6]/20"
                  value={draftDate}
                  onChange={e => setDraftDate(e.target.value)}
                />
              </div>

              {/* District badges — only draft */}
              <div>
                <h4 className="text-sm font-semibold text-slate-800 mb-2">
                  District
                </h4>
                <div className="flex flex-wrap gap-2 mt-2">
                  {draftDistricts.map(d => (
                    <span
                      key={d}
                      className="inline-flex items-center gap-1.5 bg-[#EAF3FF] text-[#1672E6] text-xs font-semibold px-3 py-1.5 rounded-full"
                    >
                      {d}
                      <button
                        onClick={() =>
                          setDraftDistricts(prev => prev.filter(x => x !== d))
                        }
                        className="hover:text-red-500 font-bold ml-0.5 text-sm"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                  <button
                    type="button"
                    onClick={() => setDraftDistricts([])}
                    className="text-xs text-[#1672E6] font-bold hover:underline mt-1"
                  >
                    {draftDistricts.length === 0 ? 'All districts' : 'Clear'}
                  </button>
                </div>
              </div>

              {/* Rooms */}
              <div>
                <h4 className="text-sm font-semibold text-slate-800 mb-2.5">
                  Rooms
                </h4>
                <div className="flex items-center gap-4">
                  {['1', '2', '3', '4+'].map(r => (
                    <label
                      key={r}
                      className="flex items-center gap-2 cursor-pointer select-none"
                    >
                      <input
                        type="checkbox"
                        checked={draftRooms.includes(r)}
                        onChange={() =>
                          setDraftRooms(prev =>
                            prev.includes(r)
                              ? prev.filter(x => x !== r)
                              : [...prev, r],
                          )
                        }
                        className="rounded border-slate-300 text-[#1672E6] focus:ring-[#1672E6] h-4 w-4"
                      />
                      <span className="text-sm text-slate-600 font-semibold">
                        [{r}]
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price */}
              <div>
                <h4 className="text-sm font-semibold text-slate-800 mb-2">
                  Price
                </h4>
                <div className="mt-2 space-y-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        setDraftMaxPrice(prev => Math.max(500, prev - 100))
                      }
                      className="text-slate-400 hover:text-slate-600 text-lg font-bold px-1"
                    >
                      -
                    </button>
                    <input
                      type="range"
                      min={500}
                      max={3000}
                      value={draftMaxPrice}
                      onChange={e => setDraftMaxPrice(Number(e.target.value))}
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#1672E6]"
                    />
                    <button
                      onClick={() =>
                        setDraftMaxPrice(prev => Math.min(3000, prev + 100))
                      }
                      className="text-slate-400 hover:text-slate-600 text-lg font-bold px-1"
                    >
                      +
                    </button>
                  </div>
                  <div className="flex justify-between text-xs font-semibold text-slate-500">
                    <span>500 €</span>
                    <span className="text-[#1672E6] font-bold text-sm">
                      {draftMaxPrice === 3000
                        ? '3.000 €+'
                        : `${draftMaxPrice} €`}
                    </span>
                    <span>3.000 €+</span>
                  </div>
                </div>
              </div>

              {/* Amenities */}
              <div>
                <h4 className="text-sm font-semibold text-slate-800 mb-3">
                  Amenities
                </h4>
                <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1">
                  {allAmenities.map(amenity => (
                    <label
                      key={amenity}
                      className="flex items-center gap-3 cursor-pointer py-0.5 select-none"
                    >
                      <input
                        type="checkbox"
                        checked={draftAmenities.includes(amenity)}
                        onChange={() =>
                          setDraftAmenities(prev =>
                            prev.includes(amenity)
                              ? prev.filter(a => a !== amenity)
                              : [...prev, amenity],
                          )
                        }
                        className="rounded border-slate-300 text-[#1672E6] focus:ring-[#1672E6] h-4 w-4"
                      />
                      <span className="text-sm text-slate-600 font-medium">
                        {amenity}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={applyFilters}
                className="w-full bg-[#1672E6] hover:bg-[#0f63ce] text-white text-sm font-bold py-3.5 rounded-xl shadow-sm transition-all duration-200 active:scale-[0.98]"
              >
                Apply filters
              </button>
            </div>
          </aside>

          {/* MAIN RESULTS */}
          <div className="flex-1 w-full">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <h2 className="font-serif text-[#1672E6] text-2xl md:text-3xl font-bold">
                {filteredApartments.length} results in{' '}
                {searchText || 'Düsseldorf'}
              </h2>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                  <span>Sort by</span>
                  <DropdownMenu>
                    <DropdownMenuTrigger className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-sm font-semibold text-slate-800 outline-none transition-colors hover:bg-white focus:bg-white">
                      {sortLabel}{' '}
                      <ChevronDown className="h-4 w-4 text-slate-400" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="min-w-[190px] rounded-xl border border-slate-100 bg-white p-1 shadow-xl"
                    >
                      {[
                        ['popularity', 'popularity'],
                        ['price-asc', 'price: low to high'],
                        ['price-desc', 'price: high to low'],
                      ].map(([value, label]) => (
                        <DropdownMenuItem
                          key={value}
                          onClick={() => setSortBy(value)}
                          className="cursor-pointer justify-between rounded-lg px-3 py-2 text-sm font-medium"
                        >
                          {label}
                          {sortBy === value && (
                            <Check className="h-4 w-4 text-[#1672E6]" />
                          )}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setViewMode('list')}
                    className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold rounded-xl transition-all duration-200 border border-slate-200 shadow-sm ${viewMode === 'list' ? 'bg-[#1672E6] text-white border-[#1672E6]' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
                  >
                    <List className="h-4 w-4" /> List
                  </button>
                  <button
                    onClick={() => setViewMode('map')}
                    className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold rounded-xl transition-all duration-200 border border-slate-200 shadow-sm ${viewMode === 'map' ? 'bg-[#1672E6] text-white border-[#1672E6]' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
                  >
                    <Map className="h-4 w-4" /> Map
                  </button>
                </div>
              </div>
            </div>

            {isLoading || isFetching ? (
              viewMode === 'list' ? (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {Array.from({ length: pageSize }).map((_, i) => (
                    <ApartmentCardSkeleton key={i} />
                  ))}
                </div>
              ) : (
                <MapViewSkeleton />
              )
            ) : isError ? (
              <div className="rounded-2xl border border-red-100 bg-white p-10 text-center">
                <p className="text-base font-semibold text-slate-800">
                  Unable to load apartments
                </p>
                <p className="mt-2 text-sm text-slate-500">
                  Please check the API connection and try again.
                </p>
              </div>
            ) : filteredApartments.length === 0 ? (
              <div className="rounded-2xl border border-slate-100 bg-white p-10 text-center">
                <p className="text-base font-semibold text-slate-800">
                  No apartments found
                </p>
                <p className="mt-2 text-sm text-slate-500">
                  Try changing your filters.
                </p>
              </div>
            ) : viewMode === 'list' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredApartments.map(apt => (
                  <div
                    key={apt.id}
                    className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-[0_4px_25px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-all duration-300 flex flex-col h-full group"
                  >
                    <div className="relative h-[240px] w-full overflow-hidden shrink-0">
                      <Image
                        src={apt.image}
                        alt={apt.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-6 flex flex-col flex-1 justify-between">
                      <div>
                        <h3 className="font-sans font-semibold text-slate-800 text-lg mb-1 leading-snug group-hover:text-[#1672E6] transition-colors">
                          {apt.title}
                        </h3>
                        <p className="text-xs text-slate-400 font-semibold tracking-wide uppercase mb-3">
                          {apt.size} m² | {apt.rooms} Rooms |{' '}
                          {apt.hasBalcony ? 'Balcony' : 'No Balcony'}
                        </p>
                        <p className="text-[#1672E6] font-bold text-xl mb-4">
                          {apt.price} €{' '}
                          <span className="text-xs text-slate-400 font-semibold">
                            / Month
                          </span>
                        </p>
                      </div>
                      <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-auto">
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold">
                          <CircleCheck className="h-4 w-4 text-[#22C55E]" />
                          <span>Available from {apt.availableFrom}</span>
                        </div>
                        <Link
                          href={`/apartments/${apt.id}`}
                          className="border-2 border-[#1672E6] text-[#1672E6] hover:bg-[#1672E6] hover:text-white text-xs font-bold px-4 py-2 rounded-xl transition-all duration-200"
                        >
                          Details
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col lg:flex-row gap-6 h-[680px]">
                <div className="w-full lg:w-[360px] overflow-y-auto pr-2 space-y-4 max-h-full shrink-0">
                  {filteredApartments.map(apt => (
                    <Link
                      key={apt.id}
                      href={`/apartments/${apt.id}`}
                      className="bg-white rounded-2xl border border-slate-100 p-3 shadow-sm flex gap-4 cursor-pointer hover:border-[#1672E6]/30 transition-colors shrink-0 group"
                    >
                      <div className="relative w-28 h-20 rounded-xl overflow-hidden shrink-0">
                        <Image
                          src={apt.image}
                          alt={apt.title}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                      <div className="flex flex-col justify-between py-0.5 flex-1 min-w-0">
                        <h4 className="font-sans font-semibold text-slate-800 text-sm truncate group-hover:text-[#1672E6] transition-colors">
                          {apt.title}
                        </h4>
                        <p className="text-xs text-slate-400 font-bold">
                          {apt.size} m² | {apt.rooms} Rooms
                        </p>
                        <p className="text-[#1672E6] font-bold text-sm">
                          {apt.price} €
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
                <div className="flex-1 h-full min-h-[350px] lg:min-h-0">
                  <MapComponent apartments={filteredApartments} />
                </div>
              </div>
            )}

            {!isLoading && !isFetching && !isError && totalPages > 1 && (
              <div className="mt-8 flex flex-col items-center justify-between gap-4 rounded-2xl border border-slate-100 bg-white px-5 py-4 shadow-[0_4px_20px_rgba(0,0,0,0.02)] sm:flex-row">
                <p className="text-sm font-medium text-slate-500">
                  Showing {showingStart} to {showingEnd} of {totalItems}{' '}
                  apartments
                </p>
                <Pagination className="mx-0 w-auto">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        href="#"
                        onClick={e => {
                          e.preventDefault()
                          setCurrentPage(p => Math.max(1, p - 1))
                        }}
                        className={
                          currentPage <= 1
                            ? 'pointer-events-none border-slate-200 text-slate-300 opacity-50'
                            : 'cursor-pointer border-[#1672E6]/20 text-[#1672E6] hover:bg-[#EAF3FF] hover:text-[#0f63ce]'
                        }
                      />
                    </PaginationItem>
                    {pageNumbers.map((page, idx) => {
                      const prev = pageNumbers[idx - 1]
                      const gap = prev !== undefined && page - prev > 1
                      return (
                        <Fragment key={page}>
                          {gap && (
                            <PaginationItem>
                              <PaginationEllipsis />
                            </PaginationItem>
                          )}
                          <PaginationItem>
                            <PaginationLink
                              href="#"
                              isActive={page === currentPage}
                              onClick={e => {
                                e.preventDefault()
                                setCurrentPage(page)
                              }}
                              className={
                                page === currentPage
                                  ? 'cursor-pointer border-[#1672E6] bg-[#1672E6] text-white hover:bg-[#0f63ce] hover:text-white'
                                  : 'cursor-pointer text-[#1672E6] hover:bg-[#EAF3FF] hover:text-[#0f63ce]'
                              }
                            >
                              {page}
                            </PaginationLink>
                          </PaginationItem>
                        </Fragment>
                      )
                    })}
                    <PaginationItem>
                      <PaginationNext
                        href="#"
                        onClick={e => {
                          e.preventDefault()
                          setCurrentPage(p => Math.min(totalPages, p + 1))
                        }}
                        className={
                          currentPage >= totalPages
                            ? 'pointer-events-none border-slate-200 text-slate-300 opacity-50'
                            : 'cursor-pointer border-[#1672E6]/20 text-[#1672E6] hover:bg-[#EAF3FF] hover:text-[#0f63ce]'
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* BOTTOM BANNER */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-10 mt-20">
        <div className="relative overflow-hidden rounded-[20px]">
          <Image
            src="/images/banner.jpg"
            alt="Explore homes banner"
            width={1600}
            height={650}
            className="h-[420px] w-full object-cover"
          />
          <div className="absolute inset-0 bg-black/35" />
          <div className="absolute inset-0 flex flex-col items-center justify-center px-10 text-center text-white">
            <h3 className="font-serif font-bold text-3xl md:text-[40px] leading-[150%]">
              Find <span className="text-[#1672E6]">Your Perfect</span> Home
            </h3>
            <p className="mt-4 max-w-3xl text-sm md:text-base leading-relaxed text-white/95">
              Easily search, compare, and connect with professionally managed
              apartments and homes.
            </p>
            <button className="mt-8 rounded-lg bg-[#1672E6] px-8 py-3 text-base font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#0f63ce] hover:shadow-lg active:translate-y-px active:scale-[0.98]">
              Explore Houses
            </button>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-10 mt-20">
        <FaqAccordion items={faqItems} />
      </section>
    </main>
  )
}
