export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
import { getGalleryPhotos } from '@/services/gallery'
import { GALLERY_CATEGORIES } from '@/lib/gallery-constants'
import { GaleriaView } from '@/components/gallery/GaleriaView'
import { WhatsAppButton } from '@/components/shared/WhatsAppButton'

export const metadata: Metadata = {
  title: 'Galeria',
  description:
    'Veja fotos reais de decorações que já realizamos, organizadas por tema — casamentos, aniversários, festa infantil e chá de bebê.',
}

export default async function GaleriaPage({
  searchParams,
}: {
  searchParams: Promise<{ tema?: string }>
}) {
  const { tema } = await searchParams
  const validTheme = GALLERY_CATEGORIES.find((c) => c.id === tema)?.id

  const galleryPhotos = await getGalleryPhotos()

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="bg-gradient-to-b from-[#fdf2f8] to-white py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          <p className="text-sm font-bold text-[#D4AF37] uppercase tracking-widest mb-2">
            Galeria
          </p>
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#1E293B]">
            Decorações que já realizamos
          </h1>
          <p className="text-[#1E293B]/50 mt-3 max-w-xl text-sm">
            Fotos reais de festas que decoramos, organizadas por tema. Navegue,
            amplie e escolha o estilo que mais combina com a sua celebração.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-6xl py-8">
        <GaleriaView photosByCategory={galleryPhotos} initialTheme={validTheme} />
      </div>

      <div className="container mx-auto px-4 max-w-2xl text-center mt-16">
        <p className="text-lg font-bold text-[#1E293B] mb-4">Gostou de algum estilo?</p>
        <WhatsAppButton size="lg" />
      </div>
    </div>
  )
}
