import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getCategories } from '@/services/categories'
import { ProductForm } from '@/components/admin/ProductForm'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import type { Product } from '@/types'

interface EditProductPageProps {
  params: Promise<{ id: string }>
}

async function getProduct(id: string): Promise<Product | null> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('products')
    .select('*, categories(id, name, slug)')
    .eq('id', id)
    .single()
  return data as Product | null
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params
  const [product, categories] = await Promise.all([
    getProduct(id),
    getCategories(),
  ])

  if (!product) notFound()

  return (
    <div className="p-4 md:p-8">
      <div className="mb-8">
        <Link
          href="/admin/produtos"
          className="inline-flex items-center gap-1 text-sm text-slate/50 hover:text-slate mb-4 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Voltar
        </Link>
        <h1 className="text-2xl font-extrabold text-[#1E293B]">Editar produto</h1>
        <p className="text-slate/50 text-sm mt-1">{product.name}</p>
      </div>

      <div className="bg-white rounded-2xl shadow-card p-6">
        <ProductForm categories={categories} product={product} />
      </div>
    </div>
  )
}
