export const dynamic = 'force-dynamic'

import { HeroSection } from '@/components/home/HeroSection'
import { ServicesSection } from '@/components/home/ServicesSection'
import { PortfolioSection } from '@/components/home/PortfolioSection'
import { CallToAction } from '@/components/home/CallToAction'
import { getHomepageImages, getServiceTitles } from '@/services/settings'

export default async function HomePage() {
  const [homepageImages, serviceTitles] = await Promise.all([
    getHomepageImages(),
    getServiceTitles(),
  ])

  return (
    <>
      <HeroSection />
      <ServicesSection images={homepageImages} titles={serviceTitles} />
      <PortfolioSection images={homepageImages} />
      <CallToAction />
    </>
  )
}
