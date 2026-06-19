'use client'

import { useEffect, useRef } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L, { type Map as LeafletMap } from 'leaflet'

export default function GoogleMapInner() {
  const position: [number, number] = [51.216, 6.765]
  const mapRef = useRef<LeafletMap | null>(null)

  useEffect(() => {
    // Fix default marker icon (leaflet default icons broken in bundlers)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (L.Icon.Default.prototype as any)._getIconUrl
    L.Icon.Default.mergeOptions({
      iconRetinaUrl:
        'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      shadowUrl:
        'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    })
  }, [])

  useEffect(() => {
    const map = mapRef.current

    if (!map) {
      return
    }

    const resizeMap = () => map.invalidateSize()
    const timeout = window.setTimeout(resizeMap, 150)

    window.addEventListener('resize', resizeMap)

    return () => {
      window.clearTimeout(timeout)
      window.removeEventListener('resize', resizeMap)
    }
  }, [])

  return (
    <div className="relative z-0 h-64 w-full overflow-hidden rounded-xl border border-gray-200 md:h-80">
      <MapContainer
        center={position}
        zoom={15}
        scrollWheelZoom={false}
        ref={mapRef}
        className="h-full w-full"
        style={{ width: '100%', height: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position}>
          <Popup>
            0211wohnen <br /> Medienhafen, Düsseldorf
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  )
}
