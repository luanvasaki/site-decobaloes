'use client'

import { useEffect, useCallback, useRef } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence, type PanInfo } from 'framer-motion'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'

const SWIPE_THRESHOLD = 60

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
  const containerRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)

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
    const previouslyFocused = document.activeElement as HTMLElement | null
    closeButtonRef.current?.focus()
    return () => { previouslyFocused?.focus() }
  }, [])

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()

      if (e.key === 'Tab' && containerRef.current) {
        const focusable = containerRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
        if (focusable.length === 0) return
        const first = focusable[0]
        const last = focusable[focusable.length - 1]

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose, prev, next])

  const handleDragEnd = useCallback((_: unknown, info: PanInfo) => {
    if (photos.length <= 1) return
    if (info.offset.x < -SWIPE_THRESHOLD) next()
    else if (info.offset.x > SWIPE_THRESHOLD) prev()
  }, [photos.length, next, prev])

  const photo = photos[currentIndex]

  return (
    <motion.div
      ref={containerRef}
      role="dialog"
      aria-modal="true"
      aria-label="Visualização de foto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 bg-black/92 flex items-center justify-center p-4 cursor-default"
      onClick={onClose}
    >
      {/* Close */}
      <button
        ref={closeButtonRef}
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
          drag={photos.length > 1 ? 'x' : false}
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.6}
          onDragEnd={handleDragEnd}
          className="relative w-full max-w-5xl max-h-[90vh] aspect-square"
          onClick={(e) => e.stopPropagation()}
        >
          <Image
            src={photo.src}
            alt={photo.alt}
            fill
            draggable={false}
            className="object-contain pointer-events-none select-none"
            sizes="(max-width: 768px) 100vw, 90vw"
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
