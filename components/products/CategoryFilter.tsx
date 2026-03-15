'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import type { Category } from '@/types'

interface CategoryFilterProps {
  categories: Category[]
}

export function CategoryFilter({ categories }: CategoryFilterProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentCategory = searchParams.get('categoria') ?? ''

  function handleSelect(slug: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (slug) {
      params.set('categoria', slug)
    } else {
      params.delete('categoria')
    }
    router.push(`/catalogo?${params.toString()}`)
  }

  const items = [{ id: '', name: 'Todos', slug: '' }, ...categories]

  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrar por categoria">
      {items.map((cat) => {
        const isActive = currentCategory === cat.slug

        return (
          <motion.button
            key={cat.id || 'all'}
            onClick={() => handleSelect(cat.slug)}
            whileTap={{ scale: 0.95 }}
            aria-pressed={isActive}
            className={cn(
              'px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-[#F9A8D4]/40',
              isActive
                ? 'bg-[#F9A8D4] text-[#1E293B] shadow-sm'
                : 'bg-white text-slate/70 border border-slate/10 hover:border-primary-200 hover:text-slate hover:bg-primary-50'
            )}
          >
            {cat.name}
          </motion.button>
        )
      })}
    </div>
  )
}
