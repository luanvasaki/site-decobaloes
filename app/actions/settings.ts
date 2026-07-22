'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function setHeroImagesAction(urls: string[]): Promise<{ ok: boolean }> {
  const supabase = await createClient()
  const { error } = await supabase
    .from('settings')
    .upsert({ key: 'hero_images', value: JSON.stringify(urls), updated_at: new Date().toISOString() })

  if (error) return { ok: false }

  revalidatePath('/')
  return { ok: true }
}

export async function setHomepageImagesAction(urls: string[]): Promise<{ ok: boolean }> {
  const supabase = await createClient()
  const { error } = await supabase
    .from('settings')
    .upsert({ key: 'homepage_images', value: JSON.stringify(urls), updated_at: new Date().toISOString() })

  if (error) return { ok: false }

  revalidatePath('/')
  return { ok: true }
}

export async function setServiceTitlesAction(titles: string[]): Promise<{ ok: boolean }> {
  const supabase = await createClient()
  const { error } = await supabase
    .from('settings')
    .upsert({ key: 'service_titles', value: JSON.stringify(titles), updated_at: new Date().toISOString() })

  if (error) return { ok: false }

  revalidatePath('/')
  return { ok: true }
}
