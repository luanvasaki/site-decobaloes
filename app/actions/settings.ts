'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function setHeroImageAction(url: string): Promise<{ ok: boolean }> {
  const supabase = await createClient()
  const { error } = await supabase
    .from('settings')
    .upsert({ key: 'hero_image_url', value: url, updated_at: new Date().toISOString() })

  if (error) return { ok: false }

  revalidatePath('/')
  return { ok: true }
}
