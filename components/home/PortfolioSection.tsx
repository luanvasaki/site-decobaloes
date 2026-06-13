'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

const portfolioItems = [
  { src: '/festa-9.jpg',  label: 'Casamento Clássico',   span: 'col-span-2 row-span-2' },
  { src: '/festa-2.jpg',  label: 'Debutante Rosa',        span: 'col-span-1 row-span-1' },
  { src: '/festa-12.jpg', label: 'Casamento Rústico',     span: 'col-span-1 row-span-1' },
  { src: '/festa-1.jpg',  label: 'Festa Colorida',        span: 'col-span-1 row-span-1' },
  { src: '/festa-4.jpg',  label: 'Aniversário Temático',  span: 'col-span-1 row-span-1' },
]

export function PortfolioSection() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">

          {/* Left — Text */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2 lg:sticky lg:top-28"
          >
            <p className="text-sm font-bold text-[#D4AF37] uppercase tracking-widest mb-3">
              Portfólio
            </p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#1E293B] leading-tight mb-5">
              Festas que já<br />
              <span className="text-[#EC4899]">criamos</span> com<br />
              carinho
            </h2>
            <p className="text-slate/60 leading-relaxed mb-8">
              Cada festa tem uma história. Veja alguns dos momentos especiais que
              ajudamos a tornar inesquecíveis ao longo dos anos.
            </p>

            <Link
              href="/catalogo"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl border-2 border-[#1E293B] text-[#1E293B] font-bold text-sm hover:bg-[#1E293B] hover:text-white transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-slate/20"
            >
              Ver mais projetos
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>

          {/* Right — Bento grid */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="lg:col-span-3 grid grid-cols-3 gap-3 auto-rows-[160px] md:auto-rows-[180px]"
          >
            {portfolioItems.map((item, i) => (
              <motion.div
                key={item.src}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.08 }}
                className={`relative rounded-2xl overflow-hidden group ${item.span}`}
              >
                <Image
                  src={item.src}
                  alt={item.label}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1E293B]/60 to-transparent" />
                <span className="absolute bottom-3 left-3 text-white text-xs font-bold px-2.5 py-1 rounded-lg bg-black/30 backdrop-blur-sm">
                  {item.label}
                </span>
              </motion.div>
            ))}
          </motion.div>

        </div>
      </div>
    </section>
  )
}
