'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Package } from 'lucide-react'

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
  const imgs = images ?? []

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

        {/* Bento grid — primeiro item ganha destaque, os demais se organizam ao redor */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 lg:grid-rows-2 gap-4 lg:h-[520px]">
          {SERVICES.map((service, i) => {
            const spanClasses = [
              'lg:col-span-2 lg:row-span-2',
              'lg:col-span-2 lg:row-span-1',
              'lg:col-span-1 lg:row-span-1',
              'lg:col-span-1 lg:row-span-1',
            ][i]

            return (
              <motion.div
                key={service.title}
                className={spanClasses}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
              >
                <Link
                  href={service.href}
                  className="group relative flex h-[280px] sm:h-[360px] lg:h-full rounded-3xl overflow-hidden"
                >
                  {imgs[i] ? (
                    <Image
                      src={imgs[i]}
                      alt={service.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-primary-100 to-primary-50">
                      <Package className="w-8 h-8 text-[#F9A8D4]" />
                      <span className="text-xs font-semibold text-[#D4AF37]">Foto em breve</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-6 lg:p-7">
                    <h3 className={`font-extrabold text-white mb-1 ${i === 0 ? 'text-2xl lg:text-3xl' : 'text-xl lg:text-2xl'}`}>
                      {titles?.[i] || service.title}
                    </h3>
                    <p className="text-white/70 text-sm leading-snug">{service.desc}</p>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </div>

      </div>
    </section>
  )
}
