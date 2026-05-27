import Link from 'next/link'
import { getCategories } from '@/services/categories'
import { AdminCategoryTable } from '@/components/admin/AdminCategoryTable'
import { Plus } from 'lucide-react'

export default async function AdminCategoriesPage() {
  const categories = await getCategories()

  return (
    <div className="p-4 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-extrabold text-[#1E293B]">Categorias</h1>
          <p className="text-slate/50 text-sm mt-1">{categories.length} categoria(s)</p>
        </div>
        <Link
          href="/admin/categorias/nova"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#F9A8D4] text-[#1E293B] font-bold text-sm hover:bg-pink-300 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Nova categoria</span>
          <span className="sm:hidden">Nova</span>
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-card p-4 md:p-6">
        <AdminCategoryTable categories={categories} />
      </div>
    </div>
  )
}
