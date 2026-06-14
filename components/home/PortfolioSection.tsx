'use client'

import { useRef, useState, useEffect } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { WhatsAppButton } from '@/components/shared/WhatsAppButton'

const DEFAULT_IMAGES = [
  '/festa-9.jpg',
  '/festa-2.jpg',
  '/festa-12.jpg',
  '/festa-1.jpg',
  '/festa-4.jpg',
]

interface PortfolioSectionProps {
  images?: string[]
}

export function PortfolioSection({ images }: PortfolioSectionProps) {
  const srcs = images && images.length > 0 ? images : DEFAULT_IMAGES
  const scrollRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    const onScroll = () => {
      const index = Math.round(el.scrollLeft / (el.scrollWidth / srcs.length))
      setActiveIndex(index)
    }
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => el.removeEventListener('scroll', onScroll)
  }, [srcs.length])

  function scrollTo(i: number) {
    const el = scrollRef.current
    if (!el) return
    const itemWidth = el.scrollWidth / srcs.length
    el.scrollTo({ left: itemWidth * i, behavior: 'smooth' })
    setActiveIndex(i)
  }

  return (
    <section className="py-20 bg-[#faf8f5]">
      <div className="container mx-auto px-4 max-w-6xl">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <p className="text-xs font-bold text-[#D4AF37] uppercase tracking-widest mb-3">
            Portfólio
          </p>
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#1E293B]">
            Nossas{' '}
            <span className="font-playfair italic text-[#EC4899]">decorações</span>
          </h2>
          <p className="text-[#1E293B]/50 mt-3 text-sm">
            Eventos reais realizados pela Decobalões com muito carinho.
          </p>
        </motion.div>

        {/* Horizontal scroll gallery */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory -mx-4 px-4 md:mx-0 md:px-0"
        >
          {srcs.map((src, i) => (
            <motion.div
              key={src + i}
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.06 }}
              className="flex-shrink-0 snap-start w-[80vw] sm:w-[46%] md:w-[31%] aspect-[4/3] rounded-2xl overflow-hidden relative"
            >
              <Image
                src={src}
                alt="Decoração Decobalões"
                fill
                className="object-cover hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 640px) 80vw, (max-width: 1024px) 46vw, 31vw"
              />
            </motion.div>
          ))}
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-5">
          {srcs.map((_, i) => (
            <button
              key={i}
              onClick={() => scrollTo(i)}
              aria-label={`Foto ${i + 1}`}
              className={`rounded-full transition-all duration-300 ${
                i === activeIndex
                  ? 'w-6 h-2 bg-[#D4AF37]'
                  : 'w-2 h-2 bg-[#D4AF37]/30 hover:bg-[#D4AF37]/60'
              }`}
            />
          ))}
        </div>

        {/* WhatsApp CTA */}
        <div className="flex justify-center mt-10">
          <WhatsAppButton size="md" />
        </div>

      </div>
    </section>
  )
}
