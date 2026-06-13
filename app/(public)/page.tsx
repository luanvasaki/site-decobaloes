export const dynamic = 'force-dynamic'

import { HeroSection } from '@/components/home/HeroSection'
import { AboutSection } from '@/components/home/AboutSection'
import { ServicesSection } from '@/components/home/ServicesSection'
import { PortfolioSection } from '@/components/home/PortfolioSection'
import { CallToAction } from '@/components/home/CallToAction'

export default async function HomePage() {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <ServicesSection />
      <PortfolioSection />
      <CallToAction />
    </>
  )
}
