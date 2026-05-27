import type { Metadata } from 'next'
import { CatalogView } from '@/components/catalog/CatalogView'
import { getProducts } from '@/services/products'
import { getCategories } from '@/services/categories'
import { getGalleryPhotos } from '@/services/gallery'
import { GALLERY_CATEGORIES } from '@/lib/gallery-constants'

export const metadata: Metadata = {
  title: 'Catálogo',
  description:
    'Explore nosso catálogo de decorações e materiais para festas e eventos.',
}

export default async function CatalogoPage({
  searchParams,
}: {
  searchParams: Promise<{ tema?: string }>
}) {
  const { tema } = await searchParams

  const validTheme = GALLERY_CATEGORIES.find((c) => c.id === tema)?.id

  const [products, categories, galleryPhotos] = await Promise.all([
    getProducts({ availableOnly: true }),
    getCategories(),
    getGalleryPhotos(),
  ])

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="bg-gradient-to-b from-[#fdf2f8] to-white py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          <p className="text-sm font-bold text-[#D4AF37] uppercase tracking-widest mb-2">
            Catálogo
          </p>
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#1E293B]">
            Nossas decorações e materiais
          </h1>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-6xl py-8">
        <CatalogView
          products={products}
          categories={categories}
          galleryPhotos={galleryPhotos}
          initialTheme={validTheme}
        />
      </div>
    </div>
  )
}
