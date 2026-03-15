'use client'

import { motion } from 'framer-motion'
import { Sparkles, Heart, Star, Users, ArrowRight } from 'lucide-react'
import { WhatsAppButton } from '@/components/shared/WhatsAppButton'
import Link from 'next/link'

export default function SobrePage() {
  const values = [
    {
      icon: Heart,
      title: 'Paixão pelo que fazemos',
      description:
        'Cada decoração é criada com amor e atenção aos detalhes, porque acreditamos que cada festa merece ser especial.',
    },
    {
      icon: Star,
      title: 'Qualidade premium',
      description:
        'Trabalhamos apenas com materiais de alta qualidade para garantir que sua decoração seja linda e duradoura.',
    },
    {
      icon: Users,
      title: 'Atendimento personalizado',
      description:
        'Entendemos que cada cliente é único. Por isso, oferecemos consultoria personalizada para o seu evento.',
    },
  ]

  return (
    <div className="min-h-screen pt-20">
      {/* Hero */}
      <section className="py-20 bg-gradient-to-b from-[#fdf2f8] to-white">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#F9A8D4]/20 text-sm font-semibold text-[#D4AF37] mb-6">
              <Sparkles className="w-4 h-4" />
              Nossa história
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-[#1E293B] mb-6 leading-tight">
              Criamos memórias que
              <span className="block text-[#F9A8D4]">duram para sempre</span>
            </h1>
            <p className="text-lg text-slate/70 leading-relaxed max-w-2xl mx-auto">
              A Decobalões nasceu da crença de que cada celebração merece ser
              única. Somos uma boutique especializada em decorações para festas,
              unindo criatividade, elegância e afeto em cada projeto.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              {/* Founder card */}
              <div className="aspect-square rounded-3xl bg-gradient-to-br from-[#fdf2f8] to-[#fefce8] border border-[#F9A8D4]/20 relative overflow-hidden flex flex-col items-center justify-center p-8">
                {/* Decorative blobs */}
                <div className="absolute top-4 right-4 w-20 h-20 rounded-full bg-[#F9A8D4]/20 blur-xl" />
                <div className="absolute bottom-6 left-4 w-28 h-28 rounded-full bg-[#D4AF37]/10 blur-xl" />
                <div className="absolute top-1/4 left-6 w-3 h-3 rounded-full bg-[#F9A8D4]/60" />
                <div className="absolute bottom-1/3 right-8 w-2 h-2 rounded-full bg-[#D4AF37]/60" />

                <div className="relative text-center">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#F9A8D4]/40 to-[#D4AF37]/20 flex items-center justify-center mx-auto mb-5 shadow-sm">
                    <Heart className="w-11 h-11 text-[#D4AF37]" />
                  </div>
                  <p className="text-2xl font-extrabold text-[#1E293B] mb-1">Miriam Vasaki</p>
                  <p className="text-sm text-slate/50 font-medium mb-6">Fundadora &amp; Decoradora</p>

                  <div className="flex gap-6 justify-center">
                    <div className="text-center">
                      <p className="text-xl font-extrabold text-[#D4AF37]">25+</p>
                      <p className="text-xs text-slate/40 font-medium mt-0.5">Anos</p>
                    </div>
                    <div className="w-px bg-slate/10" />
                    <div className="text-center">
                      <p className="text-xl font-extrabold text-[#D4AF37]">13k+</p>
                      <p className="text-xs text-slate/40 font-medium mt-0.5">Festas</p>
                    </div>
                    <div className="w-px bg-slate/10" />
                    <div className="text-center">
                      <p className="text-xl font-extrabold text-[#D4AF37]">500+</p>
                      <p className="text-xs text-slate/40 font-medium mt-0.5">Itens</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15 }}
            >
              <h2 className="text-2xl font-extrabold text-[#1E293B] mb-4">
                Do sonho à realidade
              </h2>
              <p className="text-slate/70 leading-relaxed mb-4">
                Tudo começou com uma simples vontade: fazer as festas das
                pessoas serem tão especiais quanto elas merecem. Com mais de
                25 anos de experiência, a Decobalões se tornou referência
                em decorações boutique para festas em São Miguel Arcanjo e região.
              </p>
              <p className="text-slate/70 leading-relaxed mb-6">
                Hoje, com um catálogo com mais de 500 itens cuidadosamente
                selecionados, já transformamos mais de 13.000 festas em
                experiências inesquecíveis. Cada detalhe importa para nós —
                do arco de balões ao laço de fita.
              </p>
              <WhatsAppButton size="md" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-[#fdf2f8]">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-10"
          >
            <h2 className="text-2xl font-extrabold text-[#1E293B]">
              Nossos valores
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-card"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#F9A8D4]/20 flex items-center justify-center mb-4">
                  <value.icon className="w-6 h-6 text-[#D4AF37]" />
                </div>
                <h3 className="font-bold text-[#1E293B] mb-2">{value.title}</h3>
                <p className="text-sm text-slate/60 leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-2xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-sm font-bold text-[#D4AF37] uppercase tracking-widest mb-3">
              Vamos conversar?
            </p>
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#1E293B] mb-4">
              Sua próxima festa começa aqui
            </h2>
            <p className="text-slate/60 mb-8 leading-relaxed">
              Conte-nos sobre o seu evento e vamos criar juntas uma decoração
              que vai encantar a todos.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <WhatsAppButton size="lg" />
              <Link
                href="/catalogo"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl border-2 border-[#F9A8D4] text-[#1E293B] font-bold hover:bg-[#F9A8D4] transition-all duration-200"
              >
                Ver catálogo
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
