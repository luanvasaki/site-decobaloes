'use client'

import { useCallback, useEffect, useState } from 'react'
import Image from 'next/image'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface HeroPhotoCarouselProps {
  images: string[]
}

export function HeroPhotoCarousel({ images }: HeroPhotoCarouselProps) {
  const [index, setIndex] = useState(0)

  const prev = useCallback(() => {
    setIndex((i) => (i === 0 ? images.length - 1 : i - 1))
  }, [images.length])

  const next = useCallback(() => {
    setIndex((i) => (i + 1) % images.length)
  }, [images.length])

  useEffect(() => {
    if (images.length <= 1) return
    const timer = setInterval(next, 5000)
    return () => clearInterval(timer)
  }, [images.length, next, index])

  if (images.length === 0) return null

  return (
    <>
      <AnimatePresence mode="wait">
        <motion.div
          key={images[index]}
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          className="absolute inset-0"
        >
          <Image
            src={images[index]}
            alt="Decoração Decobalões"
            fill
            className="object-cover"
            priority={index === 0}
          />
        </motion.div>
      </AnimatePresence>

      {images.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-white/10 text-white hover:bg-white/25 backdrop-blur-sm transition-colors flex items-center justify-center z-10"
            aria-label="Foto anterior"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={next}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-white/10 text-white hover:bg-white/25 backdrop-blur-sm transition-colors flex items-center justify-center z-10"
            aria-label="Próxima foto"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}
    </>
  )
}
