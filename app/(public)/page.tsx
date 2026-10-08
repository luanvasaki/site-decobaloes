export const dynamic = 'force-dynamic'

import { HeroSection } from '@/components/home/HeroSection'
import { ServicesSection } from '@/components/home/ServicesSection'
import { HowItWorksSection } from '@/components/home/HowItWorksSection'
import { FeaturedProducts } from '@/components/home/FeaturedProducts'
import { PortfolioSection } from '@/components/home/PortfolioSection'
import { AboutSection } from '@/components/home/AboutSection'
import { CallToAction } from '@/components/home/CallToAction'
import { getHomepageImages, getHeroImages, getServiceTitles } from '@/services/settings'
import { getFeaturedProducts } from '@/services/products'

export default async function HomePage() {
  const [homepageImages, heroImages, serviceTitles, featuredProducts] = await Promise.all([
    getHomepageImages(),
    getHeroImages(),
    getServiceTitles(),
    getFeaturedProducts(6).catch(() => []),
  ])
  const portfolioImages = homepageImages.length > 0 ? homepageImages : heroImages

  return (
    <>
      <HeroSection />
      {/* Especialidades por tema */}
      <ServicesSection images={homepageImages} titles={serviceTitles} />
      {/* Passo a passo: Como funciona nosso atendimento */}
      <HowItWorksSection />
      {/* Vitrine de produtos/cenários em destaque */}
      <FeaturedProducts products={featuredProducts} />
      {/* Portfólio de festas e decorações reais */}
      <PortfolioSection images={portfolioImages} />
      {/* Sobre a empresa e história da fundadora */}
      <AboutSection />
      {/* Chamada para ação final */}
      <CallToAction />
    </>
  )
}
