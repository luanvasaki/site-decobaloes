'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowRight, Star, Sparkles } from 'lucide-react'
import { WhatsAppButton } from '@/components/shared/WhatsAppButton'
import { QuickQuoteModal } from '@/components/home/QuickQuoteModal'

export function HeroContent() {
  const [isQuoteOpen, setIsQuoteOpen] = useState(false)

  return (
    <>
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="flex flex-col gap-6"
      >
        {/* Brand tag with location */}
        <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-[#F9A8D4]/50 bg-white/80 w-fit shadow-sm">
          <Image src="/logo.png" alt="" width={18} height={18} className="object-contain" />
          <span className="text-xs font-bold text-[#1E293B]/70 uppercase tracking-widest">
            Decobalões · São Miguel Arcanjo & Região
          </span>
        </div>

        {/* Heading */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#1E293B] leading-[1.1]">
          Decorações que{' '}
          <span className="font-playfair italic text-[#EC4899]">encantam</span>
          <br />
          cada momento.
        </h1>

        {/* Description */}
        <p className="text-[#1E293B]/70 text-base leading-relaxed max-w-md">
          Casamentos, aniversários e festas especiais com decorações únicas e personalizadas.
          Cuidamos de cada detalhe para você aproveitar cada instante.
        </p>

        {/* Stats */}
        <div className="flex items-center gap-5 py-1 flex-wrap">
          <div className="flex items-center gap-1.5">
            <Star className="w-4 h-4 text-[#D4AF37] fill-[#D4AF37]" />
            <span className="font-extrabold text-[#1E293B]">98%</span>
            <span className="text-sm text-[#1E293B]/70">satisfação</span>
          </div>
          <div className="w-px h-7 bg-[#1E293B]/10" />
          <div>
            <span className="font-extrabold text-[#1E293B]">+13.000</span>
            <span className="text-sm text-[#1E293B]/70 ml-1.5">festas</span>
          </div>
          <div className="w-px h-7 bg-[#1E293B]/10" />
          <div>
            <span className="font-extrabold text-[#1E293B]">+25</span>
            <span className="text-sm text-[#1E293B]/70 ml-1.5">anos</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1">
          <WhatsAppButton size="md" />
          <button
            type="button"
            onClick={() => setIsQuoteOpen(true)}
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl border-2 border-[#1E293B] text-[#1E293B] font-bold text-sm hover:bg-[#1E293B] hover:text-white transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-slate/20"
          >
            <Sparkles className="w-4 h-4 text-[#D4AF37]" />
            Simular Festa
          </button>
          <Link
            href="/catalogo"
            className="inline-flex items-center justify-center gap-1.5 px-4 py-3.5 text-[#1E293B]/70 hover:text-[#EC4899] font-bold text-sm transition-colors"
          >
            Catálogo
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </motion.div>

      <QuickQuoteModal isOpen={isQuoteOpen} onClose={() => setIsQuoteOpen(false)} />
    </>
  )
}
