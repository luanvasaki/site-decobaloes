'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { getWhatsAppLink } from '@/lib/whatsapp'

export function FloatingWhatsAppButton() {
  const pathname = usePathname()
  // Some quando um botão grande de WhatsApp da página já está visível — evita
  // cobrir conteúdo no celular e repetir a mesma ação duas vezes na tela.
  // null = ainda não medido: fica escondido para não aparecer e sumir em seguida
  const [ctaVisible, setCtaVisible] = useState<boolean | null>(null)
  const hidden = ctaVisible !== false

  useEffect(() => {
    const observed = new Set<Element>()
    // Sem nenhum botão na página: aparece após 1,5s (o mesmo atraso de entrada de antes)
    let showTimer: ReturnType<typeof setTimeout> | undefined
    const visible = new Set<Element>()
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) visible.add(entry.target)
        else visible.delete(entry.target)
      }
      setCtaVisible(visible.size > 0)
    }, {
      // Conta também um botão logo abaixo da dobra (ex. o do Hero no celular),
      // para o flutuante não cobrir o texto que vem antes dele
      rootMargin: '0px 0px 25% 0px',
    })

    // O conteúdo da página chega por streaming depois do layout — os botões
    // podem ainda não existir agora, então observa também os que aparecerem depois
    function scan() {
      document.querySelectorAll('[data-whatsapp-cta]').forEach((cta) => {
        if (!observed.has(cta)) {
          observed.add(cta)
          observer.observe(cta)
        }
      })
      for (const cta of observed) {
        if (!cta.isConnected) {
          observed.delete(cta)
          visible.delete(cta)
          observer.unobserve(cta)
        }
      }
      if (observed.size === 0) {
        showTimer ??= setTimeout(() => setCtaVisible(false), 1500)
      } else if (showTimer) {
        clearTimeout(showTimer)
        showTimer = undefined
      }
    }

    scan()
    const mutations = new MutationObserver(scan)
    mutations.observe(document.body, { childList: true, subtree: true })
    return () => {
      clearTimeout(showTimer)
      mutations.disconnect()
      observer.disconnect()
    }
  }, [pathname])

  return (
    <motion.a
      href={getWhatsAppLink()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar pelo WhatsApp"
      aria-hidden={hidden}
      tabIndex={hidden ? -1 : undefined}
      initial={{ scale: 0, opacity: 0 }}
      animate={hidden ? { scale: 0, opacity: 0 } : { scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className={`fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-whatsapp text-white flex items-center justify-center shadow-lg focus:outline-none focus:ring-4 focus:ring-whatsapp/40 ${
        hidden ? 'pointer-events-none' : ''
      }`}
    >
      {/* Pulse ring */}
      <span className="absolute inset-0 rounded-full bg-whatsapp animate-ping opacity-30 pointer-events-none" />
      {/* WhatsApp icon SVG */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-6 h-6 sm:w-7 sm:h-7 relative z-10"
        aria-hidden="true"
      >
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
        <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.553 4.116 1.522 5.847L0 24l6.313-1.496A11.933 11.933 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.938a9.9 9.9 0 01-5.068-1.383l-.363-.216-3.749.888.918-3.648-.236-.374A9.9 9.9 0 012.063 12C2.063 6.504 6.504 2.063 12 2.063S21.937 6.504 21.937 12 17.496 21.937 12 21.937z" />
      </svg>
    </motion.a>
  )
}
