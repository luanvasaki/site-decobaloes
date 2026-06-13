import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { WhatsAppButton } from '@/components/shared/WhatsAppButton'
import { HeroContent } from '@/components/home/HeroContent'
import { getHeroImageUrl } from '@/services/settings'

export async function HeroSection() {
  const heroImageUrl = await getHeroImageUrl()

  return (
    <section className="relative h-[50vh] md:h-[60vh] max-h-[580px] min-h-[380px] flex items-end overflow-hidden">
      <Image
        src={heroImageUrl}
        alt="Decoração Decobalões"
        fill
        className="object-cover object-center"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#1E293B]/85 via-[#1E293B]/30 to-transparent" />

      <div className="relative z-10 w-full container mx-auto px-4 max-w-6xl pb-20 md:pb-28">
        <HeroContent />
      </div>
    </section>
  )
}
