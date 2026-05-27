import type { MetadataRoute } from 'next'
import { getAllProductSlugs } from '@/services/products'
import { getCategories } from '@/services/categories'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://decobaloes.com.br'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${BASE_URL}/catalogo`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE_URL}/sobre`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/contato`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
  ]

  try {
    const [slugs, categories] = await Promise.all([
      getAllProductSlugs(),
      getCategories(),
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

    return [...staticPages, ...productPages, ...categoryPages]
  } catch {
    return staticPages
  }
}
