import { HeroSection } from '@/components/home/HeroSection'
import { FeaturedProducts } from '@/components/home/FeaturedProducts'
import { CategoryPreview } from '@/components/home/CategoryPreview'
import { CallToAction } from '@/components/home/CallToAction'
import { PhotoGallery } from '@/components/home/PhotoGallery'
import { getFeaturedProducts } from '@/services/products'
import { getCategories } from '@/services/categories'
import { getGalleryPhotos } from '@/services/gallery'

export default async function HomePage() {
  const [products, categories, galleryPhotos] = await Promise.all([
    getFeaturedProducts(6),
    getCategories(),
    getGalleryPhotos(),
  ])

  return (
    <>
      <HeroSection />
      <PhotoGallery photos={galleryPhotos} />
      <CategoryPreview categories={categories} />
      <FeaturedProducts products={products} />
      <CallToAction />
    </>
  )
}
