'use client'

import { useState } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'

interface ImageItem {
  url: string
  alt?: string
}

interface ImageGalleryProps {
  images: ImageItem[]
  mainImage?: string
}

export function ImageGallery({ images, mainImage }: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)

  const allImages: ImageItem[] = mainImage
    ? [{ url: mainImage, alt: 'Main image' }, ...images]
    : images.length > 0
      ? images
      : [
          {
            url: '/images/no-image.png',
            alt: 'No image available',
          },
        ]

  const currentImage = allImages[selectedIndex] || allImages[0]

  return (
    <div className="space-y-4">
      {/* Main image */}
      <div className="relative h-[400px] w-full overflow-hidden rounded-lg">
        <Image
          src={currentImage.url}
          alt={currentImage.alt || 'Property image'}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 800px"
        />
      </div>

      {/* Thumbnails */}
      {allImages.length > 1 && (
        <div className="flex gap-3">
          {allImages.map((img, index) => (
            <button
              key={index}
              onClick={() => setSelectedIndex(index)}
              className={cn(
                'relative h-20 w-24 flex-shrink-0 overflow-hidden rounded-md border-2 transition-all',
                selectedIndex === index
                  ? 'border-[#2563EB] opacity-100'
                  : 'border-transparent opacity-70 hover:opacity-100',
              )}
            >
              <Image
                src={img.url}
                alt={img.alt || `Thumbnail ${index + 1}`}
                fill
                className="object-cover"
                sizes="96px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
