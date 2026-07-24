export const dynamic = 'force-dynamic'

import type { MetadataRoute } from 'next'
import { getAllProductSlugs } from '@/services/products'
import { getCategories } from '@/services/categories'
import { getGalleryPhotos } from '@/services/gallery'
import { GALLERY_CATEGORIES } from '@/lib/gallery-constants'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://decobaloes.com.br'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${BASE_URL}/catalogo`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE_URL}/galeria`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE_URL}/sobre`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/contato`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
  ]

  try {
    const [slugs, categories, galleryPhotos] = await Promise.all([
      getAllProductSlugs(),
      getCategories(),
      getGalleryPhotos(),
    ])

    const productPages: MetadataRoute.Sitemap = slugs.map((slug) => ({
      url: `${BASE_URL}/produto/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    }))

    const categoryPages: MetadataRoute.Sitemap = categories.map((cat) => ({
      url: `${BASE_URL}/catalogo?tema=${cat.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    }))

    // Só lista variações de tema que já têm fotos reais — evita indexar páginas
    // vazias ("thin content") enquanto a categoria não tiver fotos cadastradas.
    const galeriaThemePages: MetadataRoute.Sitemap = GALLERY_CATEGORIES
      .filter((cat) => (galleryPhotos[cat.id]?.length ?? 0) > 0)
      .map((cat) => ({
        url: `${BASE_URL}/galeria?tema=${cat.id}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.6,
      }))

    return [...staticPages, ...productPages, ...categoryPages, ...galeriaThemePages]
  } catch {
    return staticPages
  }
}
