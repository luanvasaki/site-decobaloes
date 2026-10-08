'use client'

import { motion } from 'framer-motion'
import { Sparkles, CalendarCheck, Clock, HeartHandshake, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { WhatsAppButton } from '@/components/shared/WhatsAppButton'

const STEPS = [
  {
    step: '01',
    icon: Sparkles,
    title: 'Escolha a Inspiração',
    desc: 'Navegue pelo nosso catálogo ou envie suas referências do Pinterest e a paleta de cores desejada.',
  },
  {
    step: '02',
    icon: CalendarCheck,
    title: 'Proposta & Reserva',
    desc: 'Alinhamos todos os detalhes sob medida para o seu espaço e garantimos a sua data na nossa agenda.',
  },
  {
    step: '03',
    icon: Clock,
    title: 'Montagem Impecável',
    desc: 'Chegamos com antecedência ao local para que cada balão e cenário estejam prontos antes dos convidados.',
  },
  {
    step: '04',
    icon: HeartHandshake,
    title: 'Você Apenas Celebra',
    desc: 'Aproveite cada segundo da sua comemoração. Ao final do evento, cuidamos da desmontagem com total tranquilidade.',
  },
]

export function HowItWorksSection() {
  return (
    <section className="py-20 bg-gradient-to-b from-white to-[#faf8f5]">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-xs font-bold text-gold-deep uppercase tracking-widest mb-3">
            Passo a Passo
          </p>
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#1E293B]">
            Como realizamos a sua festa{' '}
            <span className="font-playfair italic text-[#EC4899]">sem estresse</span>
          </h2>
          <p className="text-[#1E293B]/70 mt-3 max-w-lg mx-auto text-sm leading-relaxed">
            Do primeiro contato até o último brinde, cuidamos de toda a cenografia para que você viva momentos inesquecíveis.
          </p>
        </motion.div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {STEPS.map((step, index) => {
            const Icon = step.icon
            return (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative bg-white rounded-3xl p-6 border border-slate/5 shadow-soft hover:shadow-card hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Step pill & Icon */}
                  <div className="flex items-center justify-between mb-6">
                    <span className="font-playfair font-bold text-2xl text-[#EC4899]/70">
                      {step.step}
                    </span>
                    <div className="w-12 h-12 rounded-2xl bg-[#fdf2f8] flex items-center justify-center text-[#D4AF37] shadow-inner">
                      <Icon className="w-6 h-6 text-[#D4AF37]" />
                    </div>
                  </div>

                  {/* Title & Desc */}
                  <h3 className="font-extrabold text-lg text-[#1E293B] mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-[#1E293B]/70 leading-relaxed">
                    {step.desc}
                  </p>
                </div>

                {/* Bottom line accent */}
                <div className="mt-6 pt-4 border-t border-slate/5 flex items-center gap-2 text-xs font-semibold text-[#1E293B]/70">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#EC4899]" />
                  Etapa {step.step}
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Callout bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-12 p-6 sm:p-8 rounded-3xl bg-white border border-[#F9A8D4]/40 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6"
        >
          <div className="text-center sm:text-left">
            <h4 className="font-extrabold text-lg text-[#1E293B]">
              Quer saber se sua data está disponível na agenda?
            </h4>
            <p className="text-sm text-[#1E293B]/70 mt-1">
              Atendemos com exclusividade em São Miguel Arcanjo e cidades vizinhas.
            </p>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto justify-center">
            <WhatsAppButton size="md" />
            <Link
              href="/catalogo"
              className="hidden sm:inline-flex items-center gap-1.5 text-sm font-bold text-[#1E293B] hover:text-[#EC4899] px-4 py-2 transition-colors"
            >
              Ver catálogo <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
