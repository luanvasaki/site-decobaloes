'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import type { Category } from '@/types'

const categoryEmojis: Record<string, string> = {
  casamento: '💍',
  aniversario: '🎂',
  formatura: '🎓',
  'cha-de-bebe': '🍼',
  'cha-revelacao': '🎀',
  debutante: '👑',
  'festa-infantil': '🎠',
  corporativo: '🏢',
  baloes: '🎈',
  'arco-de-baloes': '🌈',
  cenarios: '✨',
  mesas: '🎪',
  'painel-de-fotos': '📸',
  flores: '🌸',
  outros: '🎉',
}

// Maps a DB category slug to the gallery theme id used in CatalogView
const categoryToTheme: Record<string, string> = {
  casamento:       'casamentos',
  aniversario:     'aniversarios',
  debutante:       'aniversarios',
  'festa-infantil': 'infantil',
  'cha-de-bebe':   'cha',
  'cha-revelacao': 'cha',
}

interface CategoryPreviewProps {
  categories: Category[]
}

export function CategoryPreview({ categories }: CategoryPreviewProps) {
  if (categories.length === 0) return null

  return (
    <section className="py-20 bg-gradient-to-b from-[#fdf2f8] to-white">
      <div className="container mx-auto px-4 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="text-sm font-bold text-[#D4AF37] uppercase tracking-widest mb-2">
            Categorias
          </p>
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#1E293B]">
            O que oferecemos
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {categories.map((cat, index) => {
            const theme = categoryToTheme[cat.slug]
            const href = theme ? `/catalogo?tema=${theme}` : '/catalogo'

            return (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
              >
                <Link
                  href={href}
                  className="group flex flex-col items-center gap-3 p-6 rounded-2xl bg-white border border-primary-100 hover:border-[#F9A8D4] hover:shadow-card transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-[#F9A8D4]/40"
                  aria-label={`Ver decorações de ${cat.name}`}
                >
                  <span className="text-3xl group-hover:scale-110 transition-transform duration-200">
                    {categoryEmojis[cat.slug] ?? '🎉'}
                  </span>
                  <span className="text-sm font-bold text-slate text-center leading-tight">
                    {cat.name}
                  </span>
                </Link>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
