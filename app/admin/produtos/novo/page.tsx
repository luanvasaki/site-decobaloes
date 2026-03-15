import { getCategories } from '@/services/categories'
import { ProductForm } from '@/components/admin/ProductForm'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

export default async function NewProductPage() {
  const categories = await getCategories()

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
        <h1 className="text-2xl font-extrabold text-[#1E293B]">Novo produto</h1>
      </div>

      <div className="bg-white rounded-2xl shadow-card p-6">
        <ProductForm categories={categories} />
      </div>
    </div>
  )
}
