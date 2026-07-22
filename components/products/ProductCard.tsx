'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Package } from 'lucide-react'
import { cn, formatCurrency } from '@/lib/utils'
import type { Product } from '@/types'

interface ProductCardProps {
  product: Product
  className?: string
}

export function ProductCard({ product, className }: ProductCardProps) {
  const imageUrl = product.images_urls?.[0]

  return (
    <Link
      href={`/produto/${product.slug}`}
      className={cn('group block focus:outline-none', className)}
      aria-label={`Ver detalhes de ${product.name}`}
    >
      {/* Image */}
      <div className="relative aspect-[3/4] bg-primary-50 rounded-2xl overflow-hidden mb-3">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-primary-100 to-primary-50">
            <Package className="w-10 h-10 text-[#F9A8D4]" />
            <span className="text-xs font-semibold text-[#D4AF37]">Foto em breve</span>
          </div>
        )}

        {/* Top badges */}
        <div className="absolute top-3 left-3 right-3 flex items-start justify-between gap-2">
          {product.categories?.name && (
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-sm text-slate/80 leading-none">
              {product.categories.name}
            </span>
          )}
          {!product.is_available && (
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-black/60 text-white/90 leading-none ml-auto">
              Indisponível
            </span>
          )}
        </div>

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <span className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-white text-slate font-bold text-sm shadow-lg">
            Ver detalhes
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="px-1">
        <h3 className="font-semibold text-slate text-sm leading-snug line-clamp-2 mb-1.5 group-hover:text-[#D4AF37] transition-colors duration-200">
          {product.name}
        </h3>

        <div className="flex items-baseline justify-between gap-2">
          <span className={`font-extrabold text-base leading-none ${product.price_rental != null ? 'text-[#D4AF37]' : 'text-slate/50'}`}>
            {formatCurrency(product.price_rental)}
          </span>
          {product.price_rental != null && (
            <span className="text-xs text-slate/40 font-medium">/ evento</span>
          )}
        </div>

        {product.product_type === 'decoracao' && product.includes_setup && (
          <p className="text-xs text-green-600 font-semibold mt-1.5">
            ✓ Montagem inclusa
          </p>
        )}
      </div>
    </Link>
  )
}
