'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Calendar, MapPin, Check, X, ArrowRight, MessageCircle } from 'lucide-react'
import { getWhatsAppLink } from '@/lib/whatsapp'

const EVENT_TYPES = [
  'Casamento',
  'Aniversário Infantil',
  '15 Anos / Debutante',
  'Chá de Bebê / Revelação',
  'Formatura / Adulto',
  'Evento Corporativo',
]

const SERVICE_STYLES = [
  'Decoração Completa com Balões Orgânicos',
  'Cenário de Entrada & Painel de Fotos',
  'Aluguel de Peças & Suportes (Pegue e Monte)',
  'Quero ajuda da Miriam para escolher',
]

const CITIES = [
  'São Miguel Arcanjo',
  'Itapetininga',
  'Pilar do Sul',
  'Sarapuí',
  'Outra cidade da região',
]

interface QuickQuoteModalProps {
  isOpen: boolean
  onClose: () => void
}

export function QuickQuoteModal({ isOpen, onClose }: QuickQuoteModalProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [eventType, setEventType] = useState('')
  const [serviceStyle, setServiceStyle] = useState('')
  const [city, setCity] = useState(CITIES[0])
  const [date, setDate] = useState('')

  if (!isOpen) return null

  function handleSubmit() {
    const link = getWhatsAppLink({
      eventType: eventType || 'Celebração especial',
      serviceType: serviceStyle || 'Decoração personalizada',
      city: city || 'São Miguel Arcanjo e região',
      date: date || 'A combinar',
    })
    window.open(link, '_blank')
    onClose()
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden z-10 border border-[#F9A8D4]/30"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[#fdf2f8] to-[#faf8f5] px-6 py-5 border-b border-slate/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#EC4899]/10 flex items-center justify-center text-[#EC4899]">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-extrabold text-[#1E293B] text-base leading-tight">
                  Simulador de Festa
                </h3>
                <p className="text-xs text-[#1E293B]/60">
                  Etapa {step} de 3 · Orçamento rápido via WhatsApp
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/80 hover:bg-white flex items-center justify-center text-[#1E293B]/60 hover:text-[#1E293B] transition-colors"
              aria-label="Fechar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-slate/10 h-1">
            <div
              className="bg-[#EC4899] h-1 transition-all duration-300"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>

          {/* Body */}
          <div className="p-6">
            {/* Step 1: Event Type */}
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                <h4 className="font-bold text-base text-[#1E293B]">
                  Qual tipo de celebração você está planejando?
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {EVENT_TYPES.map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setEventType(type)}
                      className={`p-3 rounded-2xl text-left text-sm font-semibold border transition-all flex items-center justify-between ${
                        eventType === type
                          ? 'border-[#EC4899] bg-[#fdf2f8] text-[#1E293B] ring-2 ring-[#EC4899]/20'
                          : 'border-slate/10 hover:border-slate/30 text-[#1E293B]/80 bg-white'
                      }`}
                    >
                      <span>{type}</span>
                      {eventType === type && <Check className="w-4 h-4 text-[#EC4899]" />}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 2: Date & City */}
            {step === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-bold text-[#1E293B] mb-2 flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-[#D4AF37]" />
                    Data prevista do evento (ou mês aproximado):
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: 20 de Novembro ou Novembro/2026"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl border border-slate/20 focus:outline-none focus:ring-2 focus:ring-[#EC4899] text-sm text-[#1E293B]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-[#1E293B] mb-2 flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-[#D4AF37]" />
                    Cidade onde será realizada a festa:
                  </label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl border border-slate/20 focus:outline-none focus:ring-2 focus:ring-[#EC4899] text-sm text-[#1E293B] bg-white"
                  >
                    {CITIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </motion.div>
            )}

            {/* Step 3: Style & Summary */}
            {step === 3 && (
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                <h4 className="font-bold text-base text-[#1E293B]">
                  Qual estilo de serviço você tem interesse?
                </h4>
                <div className="space-y-2">
                  {SERVICE_STYLES.map((style) => (
                    <button
                      key={style}
                      type="button"
                      onClick={() => setServiceStyle(style)}
                      className={`w-full p-3 rounded-2xl text-left text-sm font-semibold border transition-all flex items-center justify-between ${
                        serviceStyle === style
                          ? 'border-[#EC4899] bg-[#fdf2f8] text-[#1E293B] ring-2 ring-[#EC4899]/20'
                          : 'border-slate/10 hover:border-slate/30 text-[#1E293B]/80 bg-white'
                      }`}
                    >
                      <span>{style}</span>
                      {serviceStyle === style && <Check className="w-4 h-4 text-[#EC4899]" />}
                    </button>
                  ))}
                </div>

                {/* Summary preview */}
                <div className="bg-[#faf8f5] p-3.5 rounded-2xl border border-slate/10 text-xs text-[#1E293B]/70 space-y-1">
                  <p>
                    <strong className="text-[#1E293B]">Resumo:</strong> {eventType || 'Evento'} em{' '}
                    {city} {date ? `(${date})` : ''}
                  </p>
                  <p className="text-[#1E293B]/60">
                    Ao confirmar, uma mensagem estruturada será aberta no WhatsApp da Miriam para
                    resposta rápida.
                  </p>
                </div>
              </motion.div>
            )}
          </div>

          {/* Footer Controls */}
          <div className="bg-[#faf8f5] px-6 py-4 border-t border-slate/10 flex items-center justify-between">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep((s) => (s - 1) as 1 | 2)}
                className="px-4 py-2 text-sm font-semibold text-[#1E293B]/70 hover:text-[#1E293B]"
              >
                Voltar
              </button>
            ) : (
              <span />
            )}

            {step < 3 ? (
              <button
                type="button"
                disabled={step === 1 && !eventType}
                onClick={() => setStep((s) => (s + 1) as 2 | 3)}
                className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-2xl font-bold text-sm bg-[#1E293B] text-white hover:bg-[#1E293B]/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                Avançar <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-2xl font-bold text-sm bg-whatsapp hover:bg-whatsapp-dark text-white shadow-md hover:shadow-lg transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                Enviar pelo WhatsApp
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
