export const dynamic = 'force-dynamic'

import { HeroSection } from '@/components/home/HeroSection'
import { ServicesSection } from '@/components/home/ServicesSection'
import { PortfolioSection } from '@/components/home/PortfolioSection'
import { CallToAction } from '@/components/home/CallToAction'
import { getHomepageImages } from '@/services/settings'

export default async function HomePage() {
  const homepageImages = await getHomepageImages()

  return (
    <>
      <HeroSection />
      <ServicesSection images={homepageImages} />
      <PortfolioSection images={homepageImages} />
      <CallToAction />
    </>
  )
}
