import type { ApiEnvelope, PaginationMeta } from '@/types/dashboard'

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'

export interface EstateImage {
  id?: number
  type?: string
  url?: string
  title?: string
}

export interface OnofficeEstate {
  _id: string
  onofficeId: number
  slug?: string
  objekttitel?: string
  objektbeschreibung?: string
  lage?: string
  ausstatt_beschr?: string
  wohnflaeche?: number
  anzahl_zimmer?: number
  anzahl_badezimmer?: number
  anzahl_schlafzimmer?: number
  kaltmiete?: number
  warmmiete?: number
  kaufpreis?: number
  kaution?: number
  nebenkosten?: number
  vermarktungsart?: string
  objektart?: string
  objekttyp?: string
  ort?: string
  plz?: string
  strasse?: string
  hausnummer?: string
  stadtteil?: string
  breitengrad?: number | null
  laengengrad?: number | null
  balkon?: string
  terrasse?: string
  fahrstuhl?: string
  moebliert?: string
  haustiere?: string
  verfuegbar_ab?: string | null
  minimumStay?: string
  amenities?: {
    furnished?: boolean
    transportationParking?: boolean
    wifi?: boolean
    elevator?: boolean
    fittedKitchen?: boolean
    emergencyAlertSystem?: boolean
    moveInCoordination?: boolean
    mealPreparationService?: boolean
    petFriendly?: boolean
    balcony?: boolean
  }
  whyChoose?: string[]
  locationHighlights?: {
    label: string
    distance: string
  }[]
  images?: EstateImage[]
  titleImage?: EstateImage | null
}

export interface Apartment {
  id: string
  onOfficeId: string
  title: string
  price: number
  size: number
  rooms: number
  hasBalcony: boolean
  availableFrom: string
  image: string
  images: string[]
  district: string
  city: string
  lat: number
  lng: number
  amenities: string[]
  description: string
  deposit: number
  minimumStay: number
  serviceFee: string
  locationSubtitle: string
  locationDescription: string
  locationDetails: {
    subway: string
    restaurants: string
    rhine: string
  }
  locationHighlights: {
    label: string
    distance: string
  }[]
  whyChoose: string[]
}

export interface ApartmentListResponse {
  apartments: Apartment[]
  meta?: PaginationMeta
}

export interface PopularArea {
  district: string
  city?: string
  count: number
}

export interface ApartmentQueryParams {
  searchTerm?: string
  district?: string
  minRooms?: number
  maxRooms?: number
  minPrice?: number
  maxPrice?: number
  minArea?: number
  maxArea?: number
  availableFrom?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  page?: number
  limit?: number
}

const fallbackImage = '/images/properties-2.jpg'

const amenityLabels: Array<
  [keyof NonNullable<OnofficeEstate['amenities']>, string]
> = [
  ['furnished', 'Furnished'],
  ['transportationParking', 'Transportation & parking'],
  ['wifi', 'Wi-Fi'],
  ['elevator', 'Elevator'],
  ['fittedKitchen', 'Fitted kitchen'],
  ['emergencyAlertSystem', 'Emergency Alert System'],
  ['moveInCoordination', 'Move-in coordination'],
  ['mealPreparationService', 'Meal preparation and service'],
  ['petFriendly', 'Pet-friendly'],
  ['balcony', 'Balcony/Terrace'],
]

function formatDate(value?: string | null) {
  if (!value) return 'on request'

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'on request'

  return new Intl.DateTimeFormat('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date)
}

function isEnabled(value?: string | boolean | null) {
  if (typeof value === 'boolean') return value
  if (!value) return false

  const normalized = value.toLowerCase()
  return ['1', 'true', 'yes', 'ja', 'y', 'j'].includes(normalized)
}

function getImages(estate: OnofficeEstate) {
  const urls = [
    estate.titleImage?.url,
    ...(estate.images?.map(image => image.url) ?? []),
  ].filter((url): url is string => Boolean(url))

  return Array.from(new Set(urls)).slice(0, 8)
}

function buildAmenities(estate: OnofficeEstate) {
  const amenities = amenityLabels
    .filter(([key]) => estate.amenities?.[key])
    .map(([, label]) => label)

  if (isEnabled(estate.moebliert) && !amenities.includes('Furnished')) {
    amenities.push('Furnished')
  }
  if (isEnabled(estate.fahrstuhl) && !amenities.includes('Elevator')) {
    amenities.push('Elevator')
  }
  if (
    (isEnabled(estate.balkon) || isEnabled(estate.terrasse)) &&
    !amenities.includes('Balcony/Terrace')
  ) {
    amenities.push('Balcony/Terrace')
  }
  if (isEnabled(estate.haustiere) && !amenities.includes('Pet-friendly')) {
    amenities.push('Pet-friendly')
  }

  return amenities
}

function toNumber(value: unknown, fallback = 0) {
  const number = Number(value)
  return Number.isFinite(number) ? number : fallback
}

function cleanTitle(value?: string | null) {
  if (!value) return ''

  return value
    .replace(/^\s*\*+\s*/, '')
    .replace(/\s*\*+\s*$/, '')
    .trim()
}

export function normalizeEstateToApartment(estate: OnofficeEstate): Apartment {
  const images = getImages(estate)
  const price = toNumber(
    estate.kaltmiete || estate.warmmiete || estate.kaufpreis,
  )
  const district = estate.stadtteil || estate.ort || 'Düsseldorf'
  const address = [estate.strasse, estate.hausnummer, estate.plz, estate.ort]
    .filter(Boolean)
    .join(' ')
  const locationHighlights = estate.locationHighlights ?? []

  return {
    id: estate.slug || String(estate.onofficeId || estate._id),
    onOfficeId: estate._id,
    title:
      cleanTitle(estate.objekttitel) || 'Furnished apartment in Düsseldorf',
    price,
    size: toNumber(estate.wohnflaeche),
    rooms: toNumber(estate.anzahl_zimmer),
    hasBalcony:
      isEnabled(estate.balkon) ||
      isEnabled(estate.terrasse) ||
      Boolean(estate.amenities?.balcony),
    availableFrom: formatDate(estate.verfuegbar_ab),
    image: images[0] || fallbackImage,
    images: images.length > 0 ? images : [fallbackImage],
    district,
    city: estate.ort || 'Düsseldorf',
    lat: toNumber(estate.breitengrad, 51.222),
    lng: toNumber(estate.laengengrad, 6.765),
    amenities: buildAmenities(estate),
    description:
      [estate.objektbeschreibung, estate.ausstatt_beschr]
        .filter(Boolean)
        .join('\n\n') || 'Details for this apartment will be available soon.',
    deposit: toNumber(estate.kaution),
    minimumStay: toNumber(estate.minimumStay, 1),
    serviceFee: estate.nebenkosten
      ? `${estate.nebenkosten.toLocaleString('de-DE')} €`
      : 'None',
    locationSubtitle: address || district,
    locationDescription:
      estate.lage ||
      `This apartment is located in ${district}, with convenient access to Düsseldorf and nearby services.`,
    locationDetails: {
      subway: locationHighlights[0]?.distance || 'Nearby',
      restaurants: locationHighlights[1]?.distance || 'Nearby',
      rhine: locationHighlights[2]?.distance || 'Nearby',
    },
    locationHighlights,
    whyChoose: estate.whyChoose ?? [],
  }
}

async function apiRequest<T>(path: string, init?: RequestInit) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
  })

  if (!response.ok) {
    const err = await response.json().catch(() => null)
    throw new Error(err?.message || 'Request failed')
  }

  return response.json() as Promise<T>
}

export async function fetchApartments(params: ApartmentQueryParams = {}) {
  const searchParams = new URLSearchParams()

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      searchParams.set(key, String(value))
    }
  })

  const query = searchParams.toString()
  const response = await apiRequest<ApiEnvelope<OnofficeEstate[]>>(
    `/onoffice/estates${query ? `?${query}` : ''}`,
  )

  return {
    apartments: response.data.map(normalizeEstateToApartment),
    meta: response.meta,
  } satisfies ApartmentListResponse
}

export async function fetchApartmentBySlugOrId(slugOrId: string) {
  const isNumericId = /^\d+$/.test(slugOrId)
  const endpoint = isNumericId
    ? `/onoffice/estates/${encodeURIComponent(slugOrId)}`
    : `/onoffice/estates/slug/${encodeURIComponent(slugOrId)}`

  const response = await apiRequest<ApiEnvelope<OnofficeEstate>>(endpoint, {
    cache: 'no-store',
  })

  return normalizeEstateToApartment(response.data)
}

export async function fetchSimilarApartments(slugOrId: string, limit = 4) {
  if (/^\d+$/.test(slugOrId)) {
    const response = await fetchApartments({ limit })
    return response.apartments
  }

  const response = await apiRequest<ApiEnvelope<OnofficeEstate[]>>(
    `/onoffice/estates/slug/${encodeURIComponent(slugOrId)}/similar?limit=${limit}`,
    { cache: 'no-store' },
  )

  return response.data.map(normalizeEstateToApartment)
}

export async function fetchPopularAreas() {
  const response = await apiRequest<ApiEnvelope<PopularArea[]>>(
    '/onoffice/popular-areas',
  )

  return response.data
}
