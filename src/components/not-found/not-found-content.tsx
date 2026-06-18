'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { ArrowLeft, Home } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'

export function NotFoundContent() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const router = useRouter()

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX / window.innerWidth - 0.5,
        y: e.clientY / window.innerHeight - 0.5,
      })
    }

    window.addEventListener('mousemove', handleMouseMove)

    const timer = setTimeout(() => setIsLoaded(true), 100)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      clearTimeout(timer)
    }
  }, [])

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-[#F8FAFC] px-4 text-slate-900 select-none">
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-50/50 via-white to-slate-50/30" />
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full border border-[#006fe6]/8 opacity-80 dark:border-white/5"
            style={{
              width: `${(i + 1) * 120}px`,
              height: `${(i + 1) * 120}px`,
              left: `calc(50% - ${(i + 1) * 60}px)`,
              top: `calc(50% - ${(i + 1) * 60}px)`,
              animationDuration: `${15 + i * 4}s`,
              animationDelay: `${i * 0.15}s`,
              animation: `pulse ${12 + i * 3}s infinite ease-in-out alternate`,
              transform: `
                translate(
                  ${mousePosition.x * (i + 1) * 8}px, 
                  ${mousePosition.y * (i + 1) * 8}px
                )
              `,
              transition: 'transform 0.4s cubic-bezier(0.1, 0.8, 0.2, 1)',
            }}
          />
        ))}
      </div>

      <div
        className={cn(
          'z-10 flex flex-col items-center text-center max-w-xl transition-all duration-1000 ease-out',
          isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0',
        )}
      >
        <div
          className="relative mb-6"
          style={{
            transform: `
              translate(${mousePosition.x * 16}px, ${mousePosition.y * 16}px)
            `,
            transition: 'transform 0.6s cubic-bezier(0.1, 0.8, 0.2, 1)',
          }}
        >
          <h1 className="text-[7rem] sm:text-[9rem] md:text-[11rem] font-bold leading-none tracking-tighter text-[#006fe6] font-serif select-none drop-shadow-sm">
            404
          </h1>

          <div
            className="absolute -bottom-2 left-0 h-1 bg-[#006fe6] rounded-full transition-all duration-1000 ease-in-out"
            style={{
              width: isLoaded ? '100%' : '0%',
              animation: 'width-pulse 3s infinite alternate ease-in-out',
            }}
          />
        </div>

        <h2 className="mb-4 text-2xl sm:text-3xl font-bold tracking-tight text-slate-800 font-serif">
          It seems this tour took a wrong turn
        </h2>

        <p className="mb-8 text-[15px] sm:text-[16px] text-slate-500 max-w-md leading-relaxed">
          {`The property, tour, or page you are looking for doesn't exist or has been relocated to another address.`}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto items-center justify-center">
          <Link
            href="/"
            className={cn(
              buttonVariants({ size: 'lg' }),
              'w-full sm:w-auto px-6 h-11 bg-[#006fe6] hover:bg-[#005ec4] text-white font-medium rounded-lg shadow-sm hover:shadow transition-all duration-200 flex items-center justify-center gap-2',
            )}
            style={{
              transform: `
                translate(${mousePosition.x * -4}px, ${mousePosition.y * -4}px)
              `,
              transition:
                'transform 0.4s cubic-bezier(0.1, 0.8, 0.2, 1), background-color 0.2s ease',
            }}
          >
            <Home className="w-4 h-4" />
            Back to Home
          </Link>

          <button
            onClick={() => router.back()}
            className={cn(
              buttonVariants({ variant: 'outline', size: 'lg' }),
              'w-full sm:w-auto px-6 h-11 border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-medium rounded-lg border shadow-sm hover:shadow-sm transition-all duration-200 flex items-center justify-center gap-2',
            )}
            style={{
              transform: `
                translate(${mousePosition.x * -4}px, ${mousePosition.y * -4}px)
              `,
              transition:
                'transform 0.4s cubic-bezier(0.1, 0.8, 0.2, 1), background-color 0.2s ease, border-color 0.2s ease',
            }}
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
        </div>
      </div>

      <style jsx global>{`
        @keyframes pulse {
          0%,
          100% {
            transform: scale(1) rotate(0deg);
          }
          50% {
            transform: scale(1.03) rotate(2deg);
          }
        }

        @keyframes width-pulse {
          0% {
            width: 30%;
            left: 35%;
          }
          100% {
            width: 100%;
            left: 0%;
          }
        }
      `}</style>
    </div>
  )
}
