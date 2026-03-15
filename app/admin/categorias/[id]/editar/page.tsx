import { notFound } from 'next/navigation'
import { getCategoryBySlug } from '@/services/categories'
import { createClient } from '@/lib/supabase/server'
import { CategoryForm } from '@/components/admin/CategoryForm'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import type { Category } from '@/types'

interface EditCategoryPageProps {
  params: Promise<{ id: string }>
}

async function getCategoryById(id: string): Promise<Category | null> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('categories')
    .select('*')
    .eq('id', id)
    .single()
  return data
}

export default async function EditCategoryPage({ params }: EditCategoryPageProps) {
  const { id } = await params
  const category = await getCategoryById(id)

  if (!category) notFound()

  return (
    <div className="p-4 md:p-8">
      <div className="mb-8">
        <Link
          href="/admin/categorias"
          className="inline-flex items-center gap-1 text-sm text-slate/50 hover:text-slate mb-4 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Voltar
        </Link>
        <h1 className="text-2xl font-extrabold text-[#1E293B]">Editar categoria</h1>
        <p className="text-slate/50 text-sm mt-1">{category.name}</p>
      </div>

      <div className="bg-white rounded-2xl shadow-card p-6">
        <CategoryForm category={category} />
      </div>
    </div>
  )
}
