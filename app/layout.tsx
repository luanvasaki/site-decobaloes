import type { Metadata } from 'next'
import './globals.css'
import { FloatingWhatsAppButton } from '@/components/shared/FloatingWhatsAppButton'
import { Toaster } from '@/components/ui/toaster'

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? 'https://decobaloes.com.br'
  ),
  title: {
    default: 'Decobalões — Decorações para Festas',
    template: '%s | Decobalões',
  },
  description:
    'Aluguel de decorações premium para festas e eventos. Balões, cenários e muito mais para tornar sua festa inesquecível.',
  keywords: [
    'decoração festa',
    'aluguel balões',
    'decoração casamento',
    'aniversário',
    'cenário festa',
    'decobaloes',
  ],
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: process.env.NEXT_PUBLIC_SITE_URL,
    siteName: 'Decobalões',
    title: 'Decobalões — Decorações para Festas',
    description:
      'Aluguel de decorações premium para festas e eventos. Transforme sua festa em um momento mágico.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Decobalões — Decorações para Festas',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Decobalões — Decorações para Festas',
    description:
      'Aluguel de decorações premium para festas e eventos.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-screen bg-white antialiased" style={{ fontFamily: "'Nunito', sans-serif" }}>
        {children}
        <FloatingWhatsAppButton />
        <Toaster />
      </body>
    </html>
  )
}
