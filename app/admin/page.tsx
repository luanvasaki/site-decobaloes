import { createClient } from '@/lib/supabase/server'
import { Package, Tag, CheckCircle2, XCircle } from 'lucide-react'

async function getStats() {
  const supabase = await createClient()

  const [{ count: totalProducts }, { count: totalCategories }, { count: availableProducts }] =
    await Promise.all([
      supabase.from('products').select('*', { count: 'exact', head: true }),
      supabase.from('categories').select('*', { count: 'exact', head: true }),
      supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('is_available', true),
    ])

  return {
    totalProducts: totalProducts ?? 0,
    totalCategories: totalCategories ?? 0,
    availableProducts: availableProducts ?? 0,
    unavailableProducts: (totalProducts ?? 0) - (availableProducts ?? 0),
  }
}

export default async function AdminDashboardPage() {
  const stats = await getStats()

  const cards = [
    {
      label: 'Total de Produtos',
      value: stats.totalProducts,
      icon: Package,
      color: 'bg-blue-50 text-blue-600',
    },
    {
      label: 'Categorias',
      value: stats.totalCategories,
      icon: Tag,
      color: 'bg-purple-50 text-purple-600',
    },
    {
      label: 'Disponíveis',
      value: stats.availableProducts,
      icon: CheckCircle2,
      color: 'bg-green-50 text-green-600',
    },
    {
      label: 'Indisponíveis',
      value: stats.unavailableProducts,
      icon: XCircle,
      color: 'bg-red-50 text-red-500',
    },
  ]

  return (
    <div className="p-4 md:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-[#1E293B]">Dashboard</h1>
        <p className="text-slate/50 text-sm mt-1">Visão geral do seu catálogo</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {cards.map((card) => (
          <div
            key={card.label}
            className="bg-white rounded-2xl shadow-card p-6 flex items-center gap-4"
          >
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${card.color}`}>
              <card.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-extrabold text-[#1E293B]">{card.value}</p>
              <p className="text-xs text-slate/50 font-medium">{card.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick links */}
      <div className="bg-white rounded-2xl shadow-card p-6">
        <h2 className="font-bold text-[#1E293B] mb-4">Ações rápidas</h2>
        <div className="flex flex-wrap gap-3">
          <a
            href="/admin/produtos/novo"
            className="px-5 py-2.5 rounded-xl bg-[#F9A8D4] text-[#1E293B] font-bold text-sm hover:bg-pink-300 transition-colors"
          >
            + Novo produto
          </a>
          <a
            href="/admin/categorias/nova"
            className="px-5 py-2.5 rounded-xl border border-slate/15 text-slate font-bold text-sm hover:bg-slate-50 transition-colors"
          >
            + Nova categoria
          </a>
          <a
            href="/"
            target="_blank"
            className="px-5 py-2.5 rounded-xl border border-slate/15 text-slate font-bold text-sm hover:bg-slate-50 transition-colors"
          >
            Ver site público ↗
          </a>
        </div>
      </div>
    </div>
  )
}
