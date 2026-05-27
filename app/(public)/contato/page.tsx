import type { Metadata } from 'next'
import { MapPin, Clock, Instagram, Mail, Phone } from 'lucide-react'
import { WhatsAppButton } from '@/components/shared/WhatsAppButton'
import { getWhatsAppLink } from '@/lib/whatsapp'

export const metadata: Metadata = {
  title: 'Contato',
  description:
    'Entre em contato com a Decobalões. Estamos prontos para tornar sua festa inesquecível.',
}

export default function ContatoPage() {
  return (
    <div className="min-h-screen pt-20 pb-16">
      {/* Header */}
      <div className="bg-gradient-to-b from-[#fdf2f8] to-white py-16">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <p className="text-sm font-bold text-[#D4AF37] uppercase tracking-widest mb-2">
            Contato
          </p>
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#1E293B] mb-4">
            Fale com a gente
          </h1>
          <p className="text-slate/60 max-w-md mx-auto">
            Pronta para fazer sua festa dos sonhos? Entre em contato e vamos
            criar algo especial juntas.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-4xl py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Contact info */}
          <div>
            <h2 className="text-xl font-extrabold text-[#1E293B] mb-6">
              Informações de contato
            </h2>

            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-2xl bg-[#F9A8D4]/20 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-[#D4AF37]" />
                </div>
                <div>
                  <p className="font-semibold text-slate text-sm">Localização</p>
                  <p className="text-sm text-slate/60 mt-0.5">
                    São Miguel Arcanjo — SP
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-2xl bg-[#F9A8D4]/20 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5 text-[#D4AF37]" />
                </div>
                <div>
                  <p className="font-semibold text-slate text-sm">WhatsApp</p>
                  <a
                    href={getWhatsAppLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-[#F9A8D4] hover:text-pink-400 transition-colors mt-0.5 block"
                  >
                    (15) 9 9620-4192
                  </a>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-2xl bg-[#F9A8D4]/20 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5 text-[#D4AF37]" />
                </div>
                <div>
                  <p className="font-semibold text-slate text-sm">Horário de atendimento</p>
                  <p className="text-sm text-slate/60 mt-0.5">
                    Segunda a Sábado, das 9h às 18h
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-2xl bg-[#F9A8D4]/20 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5 text-[#D4AF37]" />
                </div>
                <div>
                  <p className="font-semibold text-slate text-sm">E-mail</p>
                  <a
                    href="mailto:miriamvasaki@gmail.com"
                    className="text-sm text-[#F9A8D4] hover:text-pink-400 transition-colors mt-0.5 block"
                  >
                    miriamvasaki@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-2xl bg-[#F9A8D4]/20 flex items-center justify-center shrink-0">
                  <Instagram className="w-5 h-5 text-[#D4AF37]" />
                </div>
                <div>
                  <p className="font-semibold text-slate text-sm">Instagram</p>
                  <a
                    href="https://instagram.com/miriam_vasaki"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-[#F9A8D4] hover:text-pink-400 transition-colors mt-0.5 block"
                  >
                    @miriam_vasaki
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* WhatsApp CTA */}
          <div className="bg-gradient-to-br from-[#fdf2f8] to-white rounded-3xl p-8 flex flex-col items-center justify-center text-center border border-primary-100 shadow-card">
            <span className="text-5xl mb-4">💬</span>
            <h3 className="text-xl font-extrabold text-[#1E293B] mb-3">
              A forma mais rápida de falar com a gente
            </h3>
            <p className="text-slate/60 text-sm mb-2 max-w-xs">
              Mande uma mensagem pelo WhatsApp e receba um orçamento personalizado
              para a sua festa em minutos.
            </p>
            <p className="text-[#D4AF37] font-extrabold text-lg mb-8">
              (15) 9 9620-4192
            </p>
            <WhatsAppButton size="lg" className="w-full justify-center" />
          </div>
        </div>
      </div>
    </div>
  )
}
