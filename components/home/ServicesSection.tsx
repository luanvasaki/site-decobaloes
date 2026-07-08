'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'

const SERVICE_DEFAULTS = ['/festa-9.jpg', '/festa-2.jpg', '/festa-1.jpg', '/festa-12.jpg']

const SERVICES = [
  {
    title: 'Casamentos',
    desc: 'Do contemporâneo ao romântico, cada detalhe conta a sua história.',
    href: '/catalogo',
  },
  {
    title: 'Aniversários',
    desc: 'Do primeiro aninho à festa adulta, decorações únicas e personalizadas.',
    href: '/catalogo',
  },
  {
    title: 'Festas Infantis',
    desc: 'Cenários encantadores que realizam os sonhos dos pequenos.',
    href: '/catalogo',
  },
  {
    title: 'Debutantes',
    desc: 'Ambientes sofisticados para a festa mais aguardada da adolescência.',
    href: '/catalogo',
  },
]

interface ServicesSectionProps {
  images?: string[]
  titles?: string[]
}

export function ServicesSection({ images, titles }: ServicesSectionProps) {
  const imgs = images && images.length > 0 ? images : SERVICE_DEFAULTS

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 max-w-6xl">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="text-xs font-bold text-[#D4AF37] uppercase tracking-widest mb-3">
            Especialidades
          </p>
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#1E293B]">
            Para cada{' '}
            <span className="font-playfair italic text-[#EC4899]">ocasião</span>
          </h2>
          <p className="text-[#1E293B]/50 mt-3 max-w-md mx-auto text-sm">
            Decoração personalizada para cada tipo de evento, com o carinho e capricho que você merece.
          </p>
        </motion.div>

        {/* 2×2 Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {SERVICES.map((service, i) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <Link
                href={service.href}
                className="group relative flex h-[280px] md:h-[360px] rounded-3xl overflow-hidden"
              >
                <Image
                  src={imgs[i] ?? SERVICE_DEFAULTS[i]}
                  alt={service.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 p-6 lg:p-7">
                  <h3 className="text-xl lg:text-2xl font-extrabold text-white mb-1">
                    {titles?.[i] || service.title}
                  </h3>
                  <p className="text-white/70 text-sm leading-snug">{service.desc}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  )
}
