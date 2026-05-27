const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '5511999999999'

export function getWhatsAppLink(productName?: string): string {
  const base = `https://wa.me/${WHATSAPP_NUMBER}`

  if (!productName) {
    const text = encodeURIComponent(
      'Olá Decobalões! Gostaria de mais informações sobre seus produtos.'
    )
    return `${base}?text=${text}`
  }

  const text = encodeURIComponent(
    `Olá Decobalões! Gostaria de saber a disponibilidade do item ${productName} para minha festa.`
  )
  return `${base}?text=${text}`
}
