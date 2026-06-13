'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { WhatsAppButton } from '@/components/shared/WhatsAppButton'

export function HeroSection() {
  return (
    <section className="relative h-screen min-h-[620px] flex items-end overflow-hidden">
      <Image
        src="/festa-9.jpg"
        alt="Decoração Decobalões"
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#1E293B]/85 via-[#1E293B]/30 to-transparent" />

      <div className="relative z-10 w-full container mx-auto px-4 max-w-6xl pb-20 md:pb-28">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="max-w-2xl"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 text-sm font-semibold mb-6">
            <Image src="/logo.png" alt="" width={18} height={18} className="object-contain" />
            Decorações para Momentos Especiais
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-[1.05] mb-6">
            Transforme sua
            <span className="block text-[#F9A8D4]">festa em magia</span>
          </h1>

          <p className="text-lg text-white/70 leading-relaxed mb-8 max-w-lg">
            Alugue decorações premium para festas e eventos. Do arco de balões
            ao cenário completo — nós cuidamos de cada detalhe para você celebrar.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/catalogo"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-[#F9A8D4] text-[#1E293B] font-bold text-base hover:bg-primary-400 transition-all duration-200 shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-[#F9A8D4]/40"
            >
              Ver Catálogo
              <ArrowRight className="w-4 h-4" />
            </Link>
            <WhatsAppButton size="md" variant="outline" className="border-white/40 text-white hover:border-white hover:bg-white/10" />
          </div>
        </motion.div>
      </div>
    </section>
  )
}
