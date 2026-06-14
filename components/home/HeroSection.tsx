import Image from 'next/image'
import { getHeroImageUrl } from '@/services/settings'
import { HeroContent } from '@/components/home/HeroContent'

export async function HeroSection() {
  const heroImageUrl = await getHeroImageUrl()

  return (
    <section className="min-h-screen bg-[#faf8f5] flex items-center">
      <div className="container mx-auto px-4 max-w-7xl w-full py-8 pt-24 pb-16">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12 min-h-[calc(100vh-8rem)]">

          {/* Left: Photo */}
          <div className="w-full lg:w-[52%] flex-shrink-0">
            <div className="relative h-[55vh] sm:h-[65vh] lg:h-[80vh] rounded-3xl overflow-hidden shadow-xl">
              <Image
                src={heroImageUrl}
                alt="Decoração Decobalões"
                fill
                className="object-cover"
                priority
              />

              {/* Badge: anos — topo esquerdo */}
              <div className="absolute top-5 left-5">
                <span className="bg-[#1E293B] text-white text-sm font-bold px-4 py-2 rounded-full shadow">
                  +25 anos
                </span>
              </div>

              {/* Badge: festas — base centralizado */}
              <div className="absolute bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap">
                <div className="bg-white/95 backdrop-blur-sm text-[#1E293B] text-sm font-bold px-5 py-2.5 rounded-full flex items-center gap-2 shadow-lg">
                  ✨ +13.000 festas realizadas
                </div>
              </div>
            </div>
          </div>

          {/* Right: Content */}
          <div className="w-full lg:w-[48%]">
            <HeroContent />
          </div>

        </div>
      </div>
    </section>
  )
}
