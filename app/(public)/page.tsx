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
  const images = homepageImages.length > 0 ? homepageImages : heroImages

  return (
    <>
      <HeroSection />
      <ServicesSection images={images} titles={serviceTitles} />
      <PortfolioSection images={images} />
      <CallToAction />
    </>
  )
}
