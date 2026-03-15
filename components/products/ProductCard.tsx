'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Package, CircleDollarSign, CheckCircle2 } from 'lucide-react'
import { cn, formatCurrency } from '@/lib/utils'
import type { Product } from '@/types'

interface ProductCardProps {
  product: Product
  className?: string
}

export function ProductCard({ product, className }: ProductCardProps) {
  const imageUrl = product.images_urls?.[0]

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={cn('group', className)}
    >
      <Link
        href={`/produto/${product.slug}`}
        className="block bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-shadow duration-300 focus:outline-none focus:ring-4 focus:ring-[#F9A8D4]/40"
        aria-label={`Ver detalhes de ${product.name}`}
      >
        {/* Image */}
        <div className="relative aspect-[4/3] bg-primary-50 overflow-hidden">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <Package className="w-12 h-12 text-primary-300" />
            </div>
          )}

          {/* Availability badge */}
          <div className="absolute top-3 right-3">
            <span
              className={cn(
                'text-xs font-bold px-3 py-1 rounded-full',
                product.is_available
                  ? 'bg-green-100 text-green-700'
                  : 'bg-red-100 text-red-600'
              )}
            >
              {product.is_available ? 'Disponível' : 'Indisponível'}
            </span>
          </div>

          {/* Category badge */}
          {product.categories?.name && (
            <div className="absolute top-3 left-3">
              <span className="text-xs font-semibold px-2 py-1 rounded-full bg-white/90 text-slate/80">
                {product.categories.name}
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-bold text-slate text-base leading-snug mb-1 line-clamp-2 group-hover:text-[#D4AF37] transition-colors">
            {product.name}
          </h3>

          {product.description && (
            <p className="text-sm text-slate/60 line-clamp-2 mb-3">
              {product.description}
            </p>
          )}

          {/* Decoration-specific details */}
          {product.product_type === 'decoracao' && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {product.color_palette && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-[#F9A8D4]/15 text-slate/70 font-medium">
                  🎨 {product.color_palette}
                </span>
              )}
              {product.event_size && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-primary-50 text-slate/70 font-medium">
                  {product.event_size === 'pequeno' ? '🏡 Pequeno' : product.event_size === 'medio' ? '🎪 Médio' : '🏟️ Grande'}
                </span>
              )}
              {product.includes_setup && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-green-50 text-green-700 font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Montagem inclusa
                </span>
              )}
            </div>
          )}

          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-1">
              <CircleDollarSign className="w-4 h-4 text-[#D4AF37]" />
              <span className="font-extrabold text-[#D4AF37] text-base">
                {formatCurrency(product.price_rental)}
              </span>
            </div>
            <span className="text-xs text-slate/50 font-medium">/ evento</span>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
