'use client'

import { useEffect, useRef, useState } from 'react'

interface Apartment {
  id: string
  title: string
  price: number
  lat: number
  lng: number
  image?: string
}

interface MapComponentProps {
  apartments: Apartment[]
  center?: [number, number]
  zoom?: number
}

declare global {
  interface Window {
    google?: any
  }
}

let googleMapsPromise: Promise<void> | null = null
const defaultCenter: [number, number] = [51.222, 6.765]

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

function loadGoogleMaps(apiKey: string) {
  if (window.google?.maps) return Promise.resolve()
  if (googleMapsPromise) return googleMapsPromise

  googleMapsPromise = new Promise((resolve, reject) => {
    const existingScript = document.querySelector<HTMLScriptElement>(
      'script[data-google-maps="true"]',
    )

    if (existingScript) {
      existingScript.addEventListener('load', () => resolve())
      existingScript.addEventListener('error', reject)
      return
    }

    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`
    script.async = true
    script.defer = true
    script.dataset.googleMaps = 'true'
    script.onload = () => resolve()
    script.onerror = reject
    document.head.appendChild(script)
  })

  return googleMapsPromise
}

export default function MapComponent({
  apartments,
  center = defaultCenter,
  zoom = 13,
}: MapComponentProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const markersRef = useRef<any[]>([])
  const infoWindowRef = useRef<any>(null)
  const [mapError, setMapError] = useState<string | null>(null)
  const [isMapReady, setIsMapReady] = useState(false)

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

    if (!apiKey) {
      setMapError('Google Maps API key is missing.')
      return
    }

    let isMounted = true

    loadGoogleMaps(apiKey)
      .then(() => {
        if (!isMounted || !mapRef.current || !window.google?.maps) return

        if (!mapInstanceRef.current) {
          mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
            center: { lat: center[0], lng: center[1] },
            zoom,
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: true,
            clickableIcons: false,
          })
          infoWindowRef.current = new window.google.maps.InfoWindow()
        }
        setIsMapReady(true)
      })
      .catch(() => {
        if (isMounted) setMapError('Unable to load Google Maps.')
      })

    return () => {
      isMounted = false
    }
  }, [center, zoom])

  useEffect(() => {
    const map = mapInstanceRef.current
    if (!isMapReady || !map || !window.google?.maps) return

    markersRef.current.forEach(marker => marker.setMap(null))
    markersRef.current = []

    const bounds = new window.google.maps.LatLngBounds()
    const validApartments = apartments.filter(
      apartment => Number.isFinite(apartment.lat) && Number.isFinite(apartment.lng),
    )

    validApartments.forEach(apartment => {
      const position = { lat: apartment.lat, lng: apartment.lng }
      const marker = new window.google.maps.Marker({
        position,
        map,
        title: apartment.title,
      })

      marker.addListener('click', () => {
        infoWindowRef.current?.setContent(`
          <div style="min-width: 180px; max-width: 220px;">
            <div style="font-weight: 700; color: #1e293b; font-size: 14px; line-height: 1.35;">
              ${escapeHtml(apartment.title)}
            </div>
            <div style="margin-top: 6px; color: #1672E6; font-weight: 700;">
              ${apartment.price.toLocaleString('de-DE')} € / Month
            </div>
            <a href="/apartments/${encodeURIComponent(apartment.id)}" style="display: inline-block; margin-top: 8px; color: #1672E6; font-weight: 700; font-size: 12px;">
              View details
            </a>
          </div>
        `)
        infoWindowRef.current?.open({ map, anchor: marker })
      })

      markersRef.current.push(marker)
      bounds.extend(position)
    })

    if (validApartments.length > 1) {
      map.fitBounds(bounds, 64)
    } else if (validApartments.length === 1) {
      map.setCenter({
        lat: validApartments[0].lat,
        lng: validApartments[0].lng,
      })
      map.setZoom(zoom)
    } else {
      map.setCenter({ lat: center[0], lng: center[1] })
      map.setZoom(zoom)
    }
  }, [apartments, center, isMapReady, zoom])

  if (mapError) {
    return (
      <div className="flex h-full w-full items-center justify-center rounded-2xl border border-slate-200 bg-slate-100 text-sm font-semibold text-slate-500">
        {mapError}
      </div>
    )
  }

  return (
    <div className="h-full w-full overflow-hidden rounded-2xl border border-slate-200 shadow-sm">
      <div ref={mapRef} className="h-full w-full" />
    </div>
  )
}
