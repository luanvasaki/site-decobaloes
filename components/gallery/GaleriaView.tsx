'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { ZoomIn, ImageOff } from 'lucide-react'
import { GALLERY_CATEGORIES } from '@/lib/gallery-constants'
import { PhotoLightbox } from '@/components/shared/PhotoLightbox'
import type { GalleryPhoto } from '@/services/gallery'

interface GaleriaViewProps {
  photosByCategory: Record<string, GalleryPhoto[]>
  initialTheme?: string
}

export function GaleriaView({ photosByCategory, initialTheme }: GaleriaViewProps) {
  const [activeTheme, setActiveTheme] = useState(initialTheme ?? GALLERY_CATEGORIES[0].id)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const photos = photosByCategory[activeTheme] ?? []
  const activeLabel = GALLERY_CATEGORIES.find((c) => c.id === activeTheme)?.label ?? ''
  const lightboxPhotos = photos.map((p, i) => ({
    src: p.image_url,
    alt: `${activeLabel} — foto ${i + 1}`,
  }))

  return (
    <div>
      {/* Theme tabs */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-1 -mx-4 px-4 md:mx-0 md:px-0 md:flex-wrap scrollbar-hide">
        {GALLERY_CATEGORIES.map((cat) => {
          const count = photosByCategory[cat.id]?.length ?? 0
          return (
            <button
              key={cat.id}
              onClick={() => setActiveTheme(cat.id)}
              className={`relative px-5 py-2 rounded-2xl text-sm font-bold transition-colors focus:outline-none focus:ring-4 focus:ring-[#F9A8D4]/40 ${
                activeTheme === cat.id
                  ? 'text-white'
                  : 'bg-white border border-slate/10 text-slate/60 hover:border-slate/30 hover:text-slate'
              }`}
            >
              {activeTheme === cat.id && (
                <motion.span
                  layoutId="galeria-tab-pill"
                  className="absolute inset-0 bg-[#1E293B] rounded-2xl"
                  transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                />
              )}
              <span className="relative">
                {cat.label}
                {count > 0 && <span className="opacity-60"> ({count})</span>}
              </span>
            </button>
          )
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTheme}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          {photos.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3 text-slate/30">
              <ImageOff className="w-12 h-12" />
              <p className="font-semibold">Ainda não temos fotos nesta categoria</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {photos.map((photo, i) => {
                const tilt = i % 2 === 0 ? '-rotate-1' : 'rotate-1'
                const corners =
                  i % 2 === 0
                    ? 'rounded-tl-[2.5rem] rounded-br-[2.5rem] rounded-tr-xl rounded-bl-xl'
                    : 'rounded-tr-[2.5rem] rounded-bl-[2.5rem] rounded-tl-xl rounded-br-xl'

                return (
                  <motion.button
                    key={photo.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: i * 0.04 }}
                    onClick={() => setLightboxIndex(i)}
                    aria-label={`Ampliar foto ${i + 1} de ${activeLabel}`}
                    className={`relative aspect-square overflow-hidden group shadow-card focus:outline-none focus:ring-4 focus:ring-[#F9A8D4]/40 ${corners} ${tilt} hover:rotate-0 transition-transform duration-300`}
                  >
                    <Image
                      src={photo.image_url}
                      alt={`${activeLabel} — foto ${i + 1}`}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    />
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                        <ZoomIn className="w-5 h-5 text-white" />
                      </div>
                    </div>
                  </motion.button>
                )
              })}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        {lightboxIndex !== null && (
          <PhotoLightbox
            photos={lightboxPhotos}
            currentIndex={lightboxIndex}
            onClose={() => setLightboxIndex(null)}
            onNavigate={setLightboxIndex}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
