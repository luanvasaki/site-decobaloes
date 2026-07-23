import { createClient } from '@/lib/supabase/server'
import { SERVICE_TITLES_FALLBACK } from '@/lib/service-constants'

export async function getHeroImages(): Promise<string[]> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('settings')
      .select('value')
      .eq('key', 'hero_images')
      .single()

    if (error || !data?.value) return []
    const parsed = JSON.parse(data.value)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
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

    if (error || !data?.value) return []
    const parsed = JSON.parse(data.value)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
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
