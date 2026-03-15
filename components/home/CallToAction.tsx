'use client'

import { motion } from 'framer-motion'
import { WhatsAppButton } from '@/components/shared/WhatsAppButton'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export function CallToAction() {
  return (
    <section className="py-20 bg-[#1E293B] relative overflow-hidden">
      {/* Decorative */}
      <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-[#F9A8D4]/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-[#D4AF37]/10 blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 max-w-3xl text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-4xl mb-6 block">🎉</span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
            Pronta para planejar
            <span className="block text-[#F9A8D4]">sua festa dos sonhos?</span>
          </h2>
          <p className="text-slate-400 text-lg mb-10 max-w-xl mx-auto">
            Entre em contato agora e descubra como podemos transformar o seu
            evento em algo verdadeiramente especial.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <WhatsAppButton size="lg" />
            <Link
              href="/catalogo"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl border-2 border-white/20 text-white font-bold text-base hover:border-[#F9A8D4] hover:text-[#F9A8D4] transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-white/20"
            >
              Ver catálogo
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
