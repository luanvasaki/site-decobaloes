export const dynamic = 'force-dynamic'

import { HeroSection } from '@/components/home/HeroSection'
import { ServicesSection } from '@/components/home/ServicesSection'
import { PortfolioSection } from '@/components/home/PortfolioSection'
import { CallToAction } from '@/components/home/CallToAction'
import { getHomepageImages, getHeroImages, getServiceTitles } from '@/services/settings'

export default async function HomePage() {
  const [homepageImages, heroImages, serviceTitles] = await Promise.all([
    getHomepageImages(),
    getHeroImages(),
    getServiceTitles(),
  ])
  const portfolioImages = homepageImages.length > 0 ? homepageImages : heroImages

  return (
    <>
      <HeroSection />
      {/* ServicesSection não recebe fallback de hero_images: cada card representa um tema
          específico (Casamentos, Aniversários...), e uma foto de outro tema aparecendo ali
          seria enganosa — melhor mostrar o placeholder "Foto em breve" até homepage_images
          ser configurado (Admin > Galeria > marcar foto como "Página inicial"). */}
      <ServicesSection images={homepageImages} titles={serviceTitles} />
      <PortfolioSection images={portfolioImages} />
      <CallToAction />
    </>
  )
}
