import { createClient } from '@/lib/supabase/server'
import { SERVICE_TITLES_FALLBACK } from '@/lib/service-constants'

const HERO_IMAGES_FALLBACK = ['/festa-9.jpg']

const HOMEPAGE_IMAGES_FALLBACK = [
  '/festa-9.jpg',
  '/festa-2.jpg',
  '/festa-12.jpg',
  '/festa-1.jpg',
  '/festa-4.jpg',
]

export async function getHeroImages(): Promise<string[]> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('settings')
      .select('value')
      .eq('key', 'hero_images')
      .single()

    if (error || !data?.value) return HERO_IMAGES_FALLBACK
    const parsed = JSON.parse(data.value)
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : HERO_IMAGES_FALLBACK
  } catch {
    return HERO_IMAGES_FALLBACK
  }
}

export async function getHomepageImages(): Promise<string[]> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('settings')
      .select('value')
      .eq('key', 'homepage_images')
      .single()

    if (error || !data?.value) return HOMEPAGE_IMAGES_FALLBACK
    const parsed = JSON.parse(data.value)
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : HOMEPAGE_IMAGES_FALLBACK
  } catch {
    return HOMEPAGE_IMAGES_FALLBACK
  }
}

export async function getServiceTitles(): Promise<string[]> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('settings')
      .select('value')
      .eq('key', 'service_titles')
      .single()

    if (error || !data?.value) return SERVICE_TITLES_FALLBACK
    const parsed = JSON.parse(data.value)
    return Array.isArray(parsed) && parsed.length === 4 ? parsed : SERVICE_TITLES_FALLBACK
  } catch {
    return SERVICE_TITLES_FALLBACK
  }
}
