import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { AdminProductTable } from '@/components/admin/AdminProductTable'
import { Plus } from 'lucide-react'
import type { Product } from '@/types'

async function getAdminProducts(): Promise<Product[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('products')
    .select('*, categories(id, name, slug)')
    .order('created_at', { ascending: false })
  return (data as Product[]) ?? []
}

export default async function AdminProductsPage() {
  const products = await getAdminProducts()

  return (
    <div className="p-4 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-extrabold text-[#1E293B]">Produtos</h1>
          <p className="text-slate/50 text-sm mt-1">{products.length} produto(s)</p>
        </div>
        <Link
          href="/admin/produtos/novo"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#F9A8D4] text-[#1E293B] font-bold text-sm hover:bg-pink-300 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Novo produto</span>
          <span className="sm:hidden">Novo</span>
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-card p-4 md:p-6">
        <AdminProductTable products={products} />
      </div>
    </div>
  )
}
