import Image from 'next/image'
import { getHeroImages, getHomepageImages } from '@/services/settings'
import { HeroContent } from '@/components/home/HeroContent'
import { HeroPhotoCarousel } from '@/components/home/HeroPhotoCarousel'

export async function HeroSection() {
  const [heroImages, homepageImages] = await Promise.all([
    getHeroImages(),
    getHomepageImages(),
  ])
  const accentPhoto = homepageImages[0] ?? heroImages[1] ?? heroImages[0]

  return (
    <section className="min-h-screen bg-[#faf8f5] flex items-center overflow-hidden">
      <div className="container mx-auto px-4 max-w-7xl w-full py-8 pt-24 pb-16">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12 min-h-[calc(100vh-8rem)]">

          {/* Left: Photo */}
          <div className="relative w-full lg:w-[52%] flex-shrink-0">
            <div className="relative h-[55vh] sm:h-[65vh] lg:h-[80vh] rounded-3xl overflow-hidden shadow-xl">
              <HeroPhotoCarousel images={heroImages} />

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

            {/* Foto secundária — composição em camadas, tipo "polaroid" escapando da moldura principal */}
            {accentPhoto && (
              <div className="hidden sm:block absolute -right-6 lg:-right-10 bottom-20 lg:bottom-28 w-28 h-36 lg:w-36 lg:h-44 rotate-6 z-10">
                <div className="relative w-full h-full rounded-2xl overflow-hidden border-4 border-white shadow-xl">
                  <Image
                    src={accentPhoto}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="150px"
                  />
                </div>
              </div>
            )}
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
