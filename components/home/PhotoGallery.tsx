'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { ZoomIn } from 'lucide-react'
import { GALLERY_CATEGORIES, FALLBACK_PHOTOS } from '@/lib/gallery-constants'
import type { GalleryPhoto } from '@/services/gallery'
import { PhotoLightbox } from '@/components/shared/PhotoLightbox'

interface PhotoGalleryProps {
  photos: Record<string, GalleryPhoto[]>
}

export function PhotoGallery({ photos }: PhotoGalleryProps) {
  const [active, setActive] = useState('casamentos')
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  function getPhotos(categoryId: string) {
    const dbPhotos = photos[categoryId] ?? []
    if (dbPhotos.length > 0) {
      return dbPhotos.map((p) => ({ src: p.image_url, alt: 'Decoração Decobalões' }))
    }
    return FALLBACK_PHOTOS[categoryId] ?? []
  }

  const currentPhotos = getPhotos(active)

  return (
    <>
      <section className="py-20 bg-gradient-to-b from-white to-[#fdf2f8]">
        <div className="container mx-auto px-4 max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6 }}
            className="text-center mb-10"
          >
            <p className="text-sm font-bold text-[#D4AF37] uppercase tracking-widest mb-2">
              Galeria
            </p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#1E293B]">
              Festas que já decoramos
            </h2>
            <p className="text-slate/60 mt-3 max-w-md mx-auto">
              Cada festa tem uma história. Veja alguns dos momentos especiais que ajudamos a criar.
            </p>
          </motion.div>

          {/* Tabs */}
          <div className="flex gap-2 mb-8 overflow-x-auto pb-1 justify-start md:justify-center scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0 md:flex-wrap">
            {GALLERY_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActive(cat.id)}
                className={`px-5 py-2 rounded-2xl text-sm font-bold transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-[#F9A8D4]/40 ${
                  active === cat.id
                    ? 'bg-[#F9A8D4] text-[#1E293B] shadow-sm'
                    : 'bg-white text-slate/60 border border-slate/10 hover:border-[#F9A8D4] hover:text-slate'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Grid */}
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.35 }}
              className={`grid gap-3 ${
                currentPhotos.length === 1
                  ? 'grid-cols-1 max-w-lg mx-auto'
                  : currentPhotos.length === 2
                  ? 'grid-cols-1 sm:grid-cols-2'
                  : 'grid-cols-2 md:grid-cols-4'
              }`}
            >
              {currentPhotos.map((photo, index) => (
                <motion.button
                  key={photo.src}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: index * 0.07 }}
                  onClick={() => setLightboxIndex(index)}
                  className={`relative rounded-2xl overflow-hidden group shadow-card focus:outline-none focus:ring-4 focus:ring-[#F9A8D4]/40 ${
                    index === 0 && currentPhotos.length === 4
                      ? 'col-span-2 row-span-2 aspect-square'
                      : 'aspect-square'
                  }`}
                >
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <ZoomIn className="w-5 h-5 text-white" />
                    </div>
                  </div>
                </motion.button>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      <AnimatePresence>
        {lightboxIndex !== null && (
          <PhotoLightbox
            photos={currentPhotos}
            currentIndex={lightboxIndex}
            onClose={() => setLightboxIndex(null)}
            onNavigate={setLightboxIndex}
          />
        )}
      </AnimatePresence>
    </>
  )
}
