const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '5515996204192'

export interface WhatsAppQuoteOptions {
  productName?: string
  eventType?: string
  date?: string
  city?: string
  serviceType?: string
  customMessage?: string
}

export function getWhatsAppLink(input?: string | WhatsAppQuoteOptions): string {
  const base = `https://wa.me/${WHATSAPP_NUMBER}`

  if (!input) {
    const text = encodeURIComponent(
      'Olá Decobalões! Gostaria de mais informações sobre suas decorações e serviços.'
    )
    return `${base}?text=${text}`
  }

  if (typeof input === 'string') {
    const text = encodeURIComponent(
      `Olá Decobalões! Gostaria de saber a disponibilidade do item ${input} para minha festa.`
    )
    return `${base}?text=${text}`
  }

  if (input.customMessage) {
    return `${base}?text=${encodeURIComponent(input.customMessage)}`
  }

  const parts = ['Olá Decobalões! Gostaria de solicitar um orçamento:']
  if (input.eventType) parts.push(`• Evento: ${input.eventType}`)
  if (input.date) parts.push(`• Data prevista: ${input.date}`)
  if (input.city) parts.push(`• Local/Cidade: ${input.city}`)
  if (input.serviceType) parts.push(`• Interesse: ${input.serviceType}`)
  if (input.productName) parts.push(`• Item de interesse: ${input.productName}`)
  parts.push('\nVocês têm disponibilidade para essa data?')

  return `${base}?text=${encodeURIComponent(parts.join('\n'))}`
}
