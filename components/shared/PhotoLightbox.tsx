'use client'

import { useEffect, useCallback } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'

export interface LightboxPhoto {
  src: string
  alt: string
}

interface PhotoLightboxProps {
  photos: LightboxPhoto[]
  currentIndex: number
  onClose: () => void
  onNavigate: (index: number) => void
}

export function PhotoLightbox({ photos, currentIndex, onClose, onNavigate }: PhotoLightboxProps) {
  const prev = useCallback(() => {
    onNavigate(currentIndex === 0 ? photos.length - 1 : currentIndex - 1)
  }, [currentIndex, photos.length, onNavigate])

  const next = useCallback(() => {
    onNavigate((currentIndex + 1) % photos.length)
  }, [currentIndex, photos.length, onNavigate])

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose, prev, next])

  const photo = photos[currentIndex]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 bg-black/92 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Close */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 w-10 h-10 rounded-xl bg-white/10 text-white hover:bg-white/25 transition-colors flex items-center justify-center z-10"
        aria-label="Fechar"
      >
        <X className="w-5 h-5" />
      </button>

      {/* Counter */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white/50 text-sm font-medium tabular-nums">
        {currentIndex + 1} / {photos.length}
      </div>

      {/* Prev */}
      {photos.length > 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); prev() }}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-white/10 text-white hover:bg-white/25 transition-colors flex items-center justify-center"
          aria-label="Foto anterior"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      )}

      {/* Image */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.18 }}
          className="relative w-full max-w-3xl max-h-[82vh] aspect-square"
          onClick={(e) => e.stopPropagation()}
        >
          <Image
            src={photo.src}
            alt={photo.alt}
            fill
            className="object-contain"
            sizes="(max-width: 768px) 100vw, 75vw"
            priority
          />
        </motion.div>
      </AnimatePresence>

      {/* Next */}
      {photos.length > 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); next() }}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-white/10 text-white hover:bg-white/25 transition-colors flex items-center justify-center"
          aria-label="Próxima foto"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      )}
    </motion.div>
  )
}
