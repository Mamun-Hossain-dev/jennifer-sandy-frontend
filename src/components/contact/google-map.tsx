'use client'

import dynamic from 'next/dynamic'

const LazyMap = dynamic(() => import('./google-map-inner'), { ssr: false })

export function GoogleMapEmbed() {
  return <LazyMap />
}
