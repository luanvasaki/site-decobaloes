import { createClient } from '@/lib/supabase/server'
import { GALLERY_CATEGORIES } from '@/lib/gallery-constants'

export interface GalleryPhoto {
  id: string
  category: string
  image_url: string
  created_at: string
}

export { GALLERY_CATEGORIES, FALLBACK_PHOTOS } from '@/lib/gallery-constants'

export async function getGalleryPhotos(): Promise<Record<string, GalleryPhoto[]>> {
  const supabase = await createClient()

  const { data } = await supabase
    .from('gallery_photos')
    .select('*')
    .order('created_at', { ascending: false })

  const grouped: Record<string, GalleryPhoto[]> = {}
  for (const cat of GALLERY_CATEGORIES) {
    grouped[cat.id] = data?.filter((p) => p.category === cat.id) ?? []
  }

  return grouped
}
