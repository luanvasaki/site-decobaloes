import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Decobalões',
    short_name: 'Decobalões',
    description: 'Aluguel de decorações premium para festas e eventos.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#1E293B',
    icons: [
      {
        src: '/logo.png',
        sizes: 'any',
        type: 'image/png',
      },
    ],
  }
}
