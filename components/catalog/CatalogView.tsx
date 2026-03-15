'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Hammer, Package, ZoomIn } from 'lucide-react'
import { ProductCard } from '@/components/products/ProductCard'
import { PhotoLightbox } from '@/components/shared/PhotoLightbox'
import { GALLERY_CATEGORIES, FALLBACK_PHOTOS } from '@/lib/gallery-constants'
import type { Product, Category } from '@/types'
import type { GalleryPhoto } from '@/services/gallery'

interface CatalogViewProps {
  products: Product[]
  categories: Category[]
  galleryPhotos: Record<string, GalleryPhoto[]>
  initialTheme?: string
}

export function CatalogView({ products, categories, galleryPhotos, initialTheme }: CatalogViewProps) {
  const [mainTab, setMainTab] = useState<'decoracao' | 'material'>('decoracao')
  const [activeTheme, setActiveTheme] = useState(initialTheme ?? GALLERY_CATEGORIES[0].id)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const decoracoes = products.filter((p) => p.product_type === 'decoracao')
  const materiais  = products.filter((p) => p.product_type === 'material')

  function getThemePhotos(themeId: string) {
    const db = galleryPhotos[themeId] ?? []
    if (db.length > 0) return db.map((p) => ({ src: p.image_url, alt: 'Decoração Decobalões' }))
    return FALLBACK_PHOTOS[themeId] ?? []
  }

  const themeCategory = categories.find((c) => {
    const map: Record<string, string[]> = {
      casamentos:   ['casamento'],
      aniversarios: ['aniversario', 'debutante'],
      infantil:     ['festa-infantil'],
      cha:          ['cha-de-bebe', 'cha-revelacao'],
    }
    return (map[activeTheme] ?? []).includes(c.slug)
  })
  const themeProducts = themeCategory
    ? decoracoes.filter((p) => p.categories?.slug === themeCategory.slug)
    : []

  const currentPhotos = getThemePhotos(activeTheme)

  return (
    <div>
      {/* Main tabs */}
      <div className="flex gap-3 mb-8 flex-wrap">
        <button
          onClick={() => setMainTab('decoracao')}
          className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm transition-all focus:outline-none focus:ring-4 focus:ring-[#F9A8D4]/40 ${
            mainTab === 'decoracao'
              ? 'bg-[#F9A8D4] text-[#1E293B] shadow-sm'
              : 'bg-white border border-slate/10 text-slate/60 hover:border-[#F9A8D4]'
          }`}
        >
          🎉 Decorações
        </button>
        <button
          onClick={() => setMainTab('material')}
          className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm transition-all focus:outline-none focus:ring-4 focus:ring-[#D4AF37]/40 ${
            mainTab === 'material'
              ? 'bg-[#D4AF37] text-white shadow-sm'
              : 'bg-white border border-slate/10 text-slate/60 hover:border-[#D4AF37]'
          }`}
        >
          <Hammer className="w-4 h-4" /> Aluguel de Materiais
        </button>
      </div>

      <AnimatePresence mode="wait">

        {/* ── DECORAÇÕES ── */}
        {mainTab === 'decoracao' && (
          <motion.div
            key="decoracao"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
          >
            {/* Theme tabs */}
            <div className="flex gap-2 mb-8 overflow-x-auto pb-1 -mx-4 px-4 md:mx-0 md:px-0 md:flex-wrap scrollbar-hide">
              {GALLERY_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveTheme(cat.id)}
                  className={`px-5 py-2 rounded-2xl text-sm font-bold transition-all focus:outline-none focus:ring-4 focus:ring-[#F9A8D4]/40 ${
                    activeTheme === cat.id
                      ? 'bg-[#1E293B] text-white'
                      : 'bg-white border border-slate/10 text-slate/60 hover:border-slate/30 hover:text-slate'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTheme}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                {/* Photo gallery */}
                {currentPhotos.length > 0 && (
                  <div className="mb-10">
                    <p className="text-xs font-bold text-slate/40 uppercase tracking-widest mb-4">
                      Trabalhos realizados
                    </p>
                    <div className={`grid gap-3 ${
                      currentPhotos.length === 1 ? 'grid-cols-1 max-w-md' :
                      currentPhotos.length === 2 ? 'grid-cols-2' :
                      'grid-cols-2 md:grid-cols-4'
                    }`}>
                      {currentPhotos.map((photo, i) => (
                        <motion.button
                          key={photo.src}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3, delay: i * 0.06 }}
                          onClick={() => setLightboxIndex(i)}
                          className={`relative rounded-2xl overflow-hidden group shadow-card focus:outline-none focus:ring-4 focus:ring-[#F9A8D4]/40 ${
                            i === 0 && currentPhotos.length >= 4
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
                          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                              <ZoomIn className="w-5 h-5 text-white" />
                            </div>
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Products */}
                {themeProducts.length > 0 && (
                  <div>
                    <p className="text-xs font-bold text-slate/40 uppercase tracking-widest mb-4">
                      Itens disponíveis para aluguel
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {themeProducts.map((product, i) => (
                        <motion.div
                          key={product.id}
                          initial={{ opacity: 0, y: 16 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: i * 0.06 }}
                        >
                          <ProductCard product={product} />
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {currentPhotos.length === 0 && themeProducts.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-20 gap-3 text-slate/30">
                    <Package className="w-12 h-12" />
                    <p className="font-semibold">Nenhum item nesta categoria ainda</p>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        )}

        {/* ── MATERIAIS ── */}
        {mainTab === 'material' && (
          <motion.div
            key="material"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
          >
            {materiais.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 gap-4 text-center max-w-md mx-auto">
                <Hammer className="w-16 h-16 text-[#D4AF37]/30" />
                <p className="text-xl font-extrabold text-[#D4AF37]">Em breve!</p>
                <p className="text-sm text-slate/50 leading-relaxed">
                  Estamos preparando nosso catálogo de materiais para aluguel.
                  Em breve você poderá alugar mesas, cadeiras, toalhas e muito mais.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {materiais.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </motion.div>
        )}

      </AnimatePresence>

      {/* Lightbox */}
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
    </div>
  )
}
