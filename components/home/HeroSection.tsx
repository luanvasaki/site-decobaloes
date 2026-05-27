'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import { WhatsAppButton } from '@/components/shared/WhatsAppButton'
import { useState, useEffect } from 'react'

const slides = [
  { src: '/festa-1.jpg', alt: 'Mesa decorada com flores coloridas' },
  { src: '/festa-2.jpg', alt: 'Decoração 15 anos rosa e dourada' },
  { src: '/festa-9.jpg', alt: 'Mesa de casamento elegante com luzes' },
  { src: '/festa-12.jpg', alt: 'Cerimônia de casamento com flores brancas' },
]

export function HeroSection() {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((c) => (c + 1) % slides.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [])

  function prev() {
    setCurrent((c) => (c === 0 ? slides.length - 1 : c - 1))
  }
  function next() {
    setCurrent((c) => (c + 1) % slides.length)
  }

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-[#fdf2f8] via-white to-[#fefce8]">
      {/* Decorative blobs */}
      <div className="absolute top-20 right-10 w-72 h-72 rounded-full bg-[#F9A8D4]/20 blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 left-10 w-96 h-96 rounded-full bg-[#D4AF37]/10 blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 max-w-6xl pt-24 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Text */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#F9A8D4]/20 text-sm font-semibold text-[#D4AF37] mb-6">
              <Image src="/logo.png" alt="" width={20} height={20} className="w-5 h-5 object-contain" />
              Decorações Únicas para Momentos Especiais
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#1E293B] leading-tight mb-6">
              Transforme sua
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#F9A8D4] to-[#D4AF37]">
                festa em magia
              </span>
            </h1>

            <p className="text-lg text-slate/70 leading-relaxed mb-8 max-w-lg">
              Alugue decorações premium para festas e eventos. Do arco de balões
              ao cenário completo — nós cuidamos de tudo para você celebrar com
              estilo.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/catalogo"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-[#F9A8D4] text-[#1E293B] font-bold text-base hover:bg-pink-300 transition-all duration-200 shadow-sm hover:shadow-md focus:outline-none focus:ring-4 focus:ring-[#F9A8D4]/40"
              >
                Ver Catálogo
                <ArrowRight className="w-4 h-4" />
              </Link>
              <WhatsAppButton size="md" variant="outline" />
            </div>

            {/* Mobile hero image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="block lg:hidden mt-8 relative w-full aspect-[4/3] rounded-3xl overflow-hidden shadow-card"
          >
            <Image
              src="/festa-1.jpg"
              alt="Decoração Decobalões"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1E293B]/30 to-transparent" />
          </motion.div>

          {/* Stats */}
            <div className="mt-10 flex gap-8">
              {[
                { value: '13.000+', label: 'Festas realizadas' },
                { value: '500+',    label: 'Itens no catálogo' },
                { value: '25+ anos', label: 'De experiência' },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-2xl font-extrabold text-[#D4AF37]">{stat.value}</p>
                  <p className="text-xs text-slate/60 font-medium mt-0.5">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Carousel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            <div className="relative w-full aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl">
              <AnimatePresence mode="wait">
                <motion.div
                  key={current}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.7 }}
                  className="absolute inset-0"
                >
                  <Image
                    src={slides[current].src}
                    alt={slides[current].alt}
                    fill
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1E293B]/40 to-transparent" />
                </motion.div>
              </AnimatePresence>

              {/* Navigation arrows */}
              <button
                onClick={prev}
                aria-label="Foto anterior"
                className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-xl bg-white/80 text-slate flex items-center justify-center hover:bg-white transition-colors z-10"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={next}
                aria-label="Próxima foto"
                className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-xl bg-white/80 text-slate flex items-center justify-center hover:bg-white transition-colors z-10"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              {/* Dots */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrent(i)}
                    aria-label={`Ir para foto ${i + 1}`}
                    className={`transition-all duration-300 rounded-full ${
                      i === current ? 'w-6 h-2 bg-white' : 'w-2 h-2 bg-white/50'
                    }`}
                  />
                ))}
              </div>

              {/* Badge */}
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute bottom-12 left-5 bg-white/95 backdrop-blur-sm rounded-2xl px-4 py-3 shadow-lg z-10"
              >
                <p className="text-xs text-slate/50 font-medium">25+ anos de experiência</p>
                <p className="text-sm font-extrabold text-[#1E293B]">+13.000 festas realizadas 🎉</p>
              </motion.div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
