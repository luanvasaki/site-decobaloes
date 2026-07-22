'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { AnimatePresence, motion } from 'framer-motion'

interface HeroPhotoCarouselProps {
  images: string[]
}

export function HeroPhotoCarousel({ images }: HeroPhotoCarouselProps) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (images.length <= 1) return
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [images.length])

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={images[index]}
        initial={{ opacity: 0, scale: 1.04 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.98 }}
        transition={{ duration: 0.8, ease: 'easeInOut' }}
        className="absolute inset-0"
      >
        <Image
          src={images[index]}
          alt="Decoração Decobalões"
          fill
          className="object-cover"
          priority={index === 0}
        />
      </motion.div>
    </AnimatePresence>
  )
}
