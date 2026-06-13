'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'

const stats = [
  { value: '13.000+', label: 'Festas Realizadas' },
  { value: '25+',     label: 'Anos de Experiência' },
  { value: '98%',     label: 'Clientes Satisfeitos' },
  { value: '500+',    label: 'Itens no Catálogo' },
]

export function AboutSection() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-sm font-bold text-[#D4AF37] uppercase tracking-widest mb-3">
              Sobre a Empresa
            </p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#1E293B] leading-tight mb-6">
              Criando memórias<br />inesquecíveis há mais<br />de 25 anos
            </h2>
            <p className="text-slate/60 leading-relaxed mb-8 max-w-md">
              Na Decobalões, cada festa é uma oportunidade única de criar momentos mágicos.
              Com décadas de experiência, transformamos visões em celebrações deslumbrantes,
              cuidando de cada detalhe para que você aproveite cada instante.
            </p>

            <div className="flex items-center gap-4 pt-2">
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#fdf2f8] border border-[#F9A8D4]/20">
                <Image src="/logo.png" alt="Decobalões" width={28} height={28} className="object-contain" />
                <span className="text-sm font-bold text-[#1E293B] tracking-wide">Decobalões</span>
              </div>
              <div className="h-5 w-px bg-slate/10" />
              <span className="text-sm text-slate/50 font-medium">Decorações Premium</span>
            </div>
          </motion.div>

          {/* Right — Stats grid */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="grid grid-cols-2 gap-5"
          >
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.08 * i }}
                className="p-6 rounded-2xl bg-[#fdf2f8] border border-[#F9A8D4]/20 hover:border-[#F9A8D4]/50 transition-colors"
              >
                <p className="text-3xl md:text-4xl font-extrabold text-[#EC4899] mb-1">{stat.value}</p>
                <p className="text-sm text-slate/60 font-medium leading-snug">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>

        </div>
      </div>
    </section>
  )
}
