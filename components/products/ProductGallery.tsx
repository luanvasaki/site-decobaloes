'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Package } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ProductGalleryProps {
  images: string[]
  productName: string
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [current, setCurrent] = useState(0)

  if (!images || images.length === 0) {
    return (
      <div className="aspect-square rounded-2xl bg-primary-50 flex items-center justify-center">
        <Package className="w-20 h-20 text-primary-200" />
      </div>
    )
  }

  function prev() {
    setCurrent((c) => (c === 0 ? images.length - 1 : c - 1))
  }
  function next() {
    setCurrent((c) => (c === images.length - 1 ? 0 : c + 1))
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Main image */}
      <div className="relative aspect-square rounded-2xl overflow-hidden bg-primary-50 shadow-card">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0"
          >
            <Image
              src={images[current]}
              alt={`${productName} — imagem ${current + 1}`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </motion.div>
        </AnimatePresence>

        {/* Navigation arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              aria-label="Imagem anterior"
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-xl bg-white/90 text-slate flex items-center justify-center shadow-sm hover:bg-white transition-colors focus:outline-none focus:ring-4 focus:ring-[#F9A8D4]/40"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={next}
              aria-label="Próxima imagem"
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-xl bg-white/90 text-slate flex items-center justify-center shadow-sm hover:bg-white transition-colors focus:outline-none focus:ring-4 focus:ring-[#F9A8D4]/40"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((img, index) => (
            <button
              key={index}
              onClick={() => setCurrent(index)}
              aria-label={`Ver imagem ${index + 1}`}
              aria-current={current === index ? 'true' : undefined}
              className={cn(
                'relative shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-[#F9A8D4]/40',
                current === index
                  ? 'border-[#D4AF37] shadow-gold'
                  : 'border-transparent opacity-60 hover:opacity-100'
              )}
            >
              <Image
                src={img}
                alt={`Miniatura ${index + 1}`}
                fill
                className="object-cover"
                sizes="64px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
