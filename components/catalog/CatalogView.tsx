'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Hammer, Package, ArrowRight } from 'lucide-react'
import { ProductCard } from '@/components/products/ProductCard'
import { PhotoLightbox } from '@/components/shared/PhotoLightbox'
import { GALLERY_CATEGORIES } from '@/lib/gallery-constants'
import { CATEGORY_TO_THEME } from '@/lib/category-mapping'
import type { GalleryPhoto } from '@/services/gallery'
import type { Product } from '@/types'

interface CatalogViewProps {
  products: Product[]
  galleryPhotos: Record<string, GalleryPhoto[]>
  initialTheme?: string
}

export function CatalogView({ products, galleryPhotos, initialTheme }: CatalogViewProps) {
  const [mainTab, setMainTab] = useState<'decoracao' | 'material'>('decoracao')
  const [activeTheme, setActiveTheme] = useState(initialTheme ?? GALLERY_CATEGORIES[0].id)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const decoracoes = products.filter((p) => p.product_type === 'decoracao')
  const materiais  = products.filter((p) => p.product_type === 'material')

  const themeProducts = decoracoes.filter((p) => {
    const slug = p.categories?.slug
    return !!slug && CATEGORY_TO_THEME[slug] === activeTheme
  })

  const activeLabel = GALLERY_CATEGORIES.find((c) => c.id === activeTheme)?.label ?? ''
  const themePhotos = (galleryPhotos[activeTheme] ?? []).slice(0, 4)
  const lightboxPhotos = themePhotos.map((p, i) => ({
    src: p.image_url,
    alt: `${activeLabel} — foto ${i + 1}`,
  }))

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
                  className={`relative px-5 py-2 rounded-2xl text-sm font-bold transition-colors focus:outline-none focus:ring-4 focus:ring-[#F9A8D4]/40 ${
                    activeTheme === cat.id
                      ? 'text-white'
                      : 'bg-white border border-slate/10 text-slate/60 hover:border-slate/30 hover:text-slate'
                  }`}
                >
                  {activeTheme === cat.id && (
                    <motion.span
                      layoutId="theme-tab-pill"
                      className="absolute inset-0 bg-[#1E293B] rounded-2xl"
                      transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                    />
                  )}
                  <span className="relative">{cat.label}</span>
                </button>
              ))}
            </div>

            {/* Fotos reais deste tema — abre lightbox na própria página, sem navegar */}
            {themePhotos.length > 0 && (
              <div className="mb-8">
                <p className="text-xs font-bold text-slate/40 uppercase tracking-widest mb-3">
                  Fotos reais deste tema
                </p>
                <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide">
                  {themePhotos.map((photo, i) => {
                    const tilt = i % 2 === 0 ? '-rotate-1' : 'rotate-1'
                    const corners =
                      i % 2 === 0
                        ? 'rounded-tl-2xl rounded-br-2xl rounded-tr-lg rounded-bl-lg'
                        : 'rounded-tr-2xl rounded-bl-2xl rounded-tl-lg rounded-br-lg'
                    return (
                      <button
                        key={photo.id}
                        onClick={() => setLightboxIndex(i)}
                        aria-label={`Ampliar foto ${i + 1} de ${activeLabel}`}
                        className={`relative shrink-0 w-20 h-20 sm:w-24 sm:h-24 overflow-hidden group shadow-card focus:outline-none focus:ring-4 focus:ring-[#F9A8D4]/40 ${corners} ${tilt} hover:rotate-0 transition-transform duration-300`}
                      >
                        <Image
                          src={photo.image_url}
                          alt={`${activeLabel} — foto ${i + 1}`}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          sizes="96px"
                        />
                      </button>
                    )
                  })}
                  <Link
                    href={`/galeria?tema=${activeTheme}`}
                    className="shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-2xl border border-[#F9A8D4]/40 bg-[#fdf2f8] flex flex-col items-center justify-center gap-1 text-center px-1 text-[#D4AF37] hover:border-[#F9A8D4] hover:bg-[#fce7f3] transition-colors focus:outline-none focus:ring-4 focus:ring-[#F9A8D4]/40"
                  >
                    <ArrowRight className="w-4 h-4" />
                    <span className="text-[10px] font-bold leading-tight">Ver todas</span>
                  </Link>
                </div>
              </div>
            )}

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTheme}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                {/* Products */}
                {themeProducts.length > 0 ? (
                  <div>
                    <p className="text-xs font-bold text-slate/40 uppercase tracking-widest mb-4">
                      Pacotes disponíveis
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8">
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
                ) : (
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
              <div>
                <p className="text-xs font-bold text-slate/40 uppercase tracking-widest mb-4">
                  Itens disponíveis para aluguel
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {materiais.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}

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
