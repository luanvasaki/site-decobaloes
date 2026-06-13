'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useRef } from 'react'

const services = [
  {
    number: '01',
    title: 'Casamentos',
    description: 'Cenários românticos e elegantes que tornam o dia mais especial da sua vida verdadeiramente inesquecível.',
    image: '/festa-9.jpg',
    href: '/catalogo',
  },
  {
    number: '02',
    title: 'Aniversários',
    description: 'Do primeiro aninho à festa adulta, decorações únicas e personalizadas para cada fase da vida.',
    image: '/festa-2.jpg',
    href: '/catalogo',
  },
  {
    number: '03',
    title: 'Festas Infantis',
    description: 'Cenários encantadores e coloridos que realizam os sonhos dos pequenos e encantam os adultos.',
    image: '/festa-1.jpg',
    href: '/catalogo',
  },
  {
    number: '04',
    title: 'Debutantes',
    description: 'Ambientes sofisticados e personalizados para a festa mais aguardada da adolescência.',
    image: '/festa-12.jpg',
    href: '/catalogo',
  },
]

export function ServicesSection() {
  const scrollRef = useRef<HTMLDivElement>(null)

  function scroll(dir: 'left' | 'right') {
    if (!scrollRef.current) return
    scrollRef.current.scrollBy({ left: dir === 'left' ? -300 : 300, behavior: 'smooth' })
  }

  return (
    <section className="py-20 bg-[#fdf2f8]">
      <div className="container mx-auto px-4 max-w-6xl">

        {/* Header */}
        <div className="flex items-end justify-between mb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-sm font-bold text-[#D4AF37] uppercase tracking-widest mb-2">
              Nossos Serviços
            </p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#1E293B]">
              O que oferecemos
            </h2>
          </motion.div>

          <div className="flex gap-2">
            <button
              onClick={() => scroll('left')}
              aria-label="Anterior"
              className="w-11 h-11 rounded-xl border-2 border-[#F9A8D4] text-[#1E293B] flex items-center justify-center hover:bg-[#F9A8D4] transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll('right')}
              aria-label="Próximo"
              className="w-11 h-11 rounded-xl bg-[#F9A8D4] text-[#1E293B] flex items-center justify-center hover:bg-primary-400 transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Cards */}
        <div
          ref={scrollRef}
          className="flex gap-5 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory"
        >
          {services.map((service, index) => (
            <motion.div
              key={service.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="min-w-[260px] md:min-w-[280px] flex-shrink-0 snap-start"
            >
              <Link href={service.href} className="group block">
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-4 shadow-card bg-[#fdf2f8]">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-contain group-hover:scale-105 transition-transform duration-500"
                    sizes="280px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1E293B]/30 to-transparent" />
                  <div className="absolute top-4 left-4 w-9 h-9 rounded-xl bg-[#F9A8D4] flex items-center justify-center shadow-sm">
                    <span className="text-xs font-extrabold text-[#1E293B]">{service.number}</span>
                  </div>
                </div>
                <h3 className="text-lg font-extrabold text-[#1E293B] mb-1.5 group-hover:text-[#EC4899] transition-colors">
                  {service.title}
                </h3>
                <p className="text-sm text-slate/60 leading-relaxed">{service.description}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
