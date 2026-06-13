import { createClient } from '@/lib/supabase/server'

const HERO_IMAGE_FALLBACK = '/festa-9.jpg'

export async function getHeroImageUrl(): Promise<string> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('settings')
      .select('value')
      .eq('key', 'hero_image_url')
      .single()

    if (error || !data?.value) return HERO_IMAGE_FALLBACK
    return data.value
  } catch {
    return HERO_IMAGE_FALLBACK
  }
}

export async function setHeroImageUrl(url: string): Promise<void> {
  const supabase = await createClient()
  await supabase
    .from('settings')
    .upsert({ key: 'hero_image_url', value: url, updated_at: new Date().toISOString() })
}
