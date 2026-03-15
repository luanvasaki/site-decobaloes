import { createClient } from '@/lib/supabase/server'
import { createPublicClient } from '@/lib/supabase/public'
import type { Product } from '@/types'

export async function getProducts(options?: { categorySlug?: string; availableOnly?: boolean }): Promise<Product[]> {
  const supabase = await createClient()

  let query = supabase
    .from('products')
    .select('*, categories(id, name, slug)')
    .order('created_at', { ascending: false })

  if (options?.availableOnly) {
    query = query.eq('is_available', true)
  }

  const { data, error } = await query

  if (error) {
    console.warn('[products] getProducts:', error.message)
    return []
  }

  let products = (data as Product[]) ?? []

  if (options?.categorySlug) {
    products = products.filter((p) => p.categories?.slug === options.categorySlug)
  }

  return products
}

export async function getFeaturedProducts(limit = 6): Promise<Product[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('products')
    .select('*, categories(id, name, slug)')
    .eq('is_available', true)
    .eq('product_type', 'decoracao')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.warn('[products] getFeaturedProducts:', error.message)
    return []
  }

  return (data as Product[]) ?? []
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('products')
    .select('*, categories(id, name, slug)')
    .eq('slug', slug)
    .single()

  if (error) {
    console.warn('[products] getProductBySlug:', error.message)
    return null
  }

  return data as Product
}

export async function getAllProductSlugs(): Promise<string[]> {
  const supabase = createPublicClient()

  const { data, error } = await supabase.from('products').select('slug')

  if (error) return []

  return data?.map((p) => p.slug) ?? []
}
