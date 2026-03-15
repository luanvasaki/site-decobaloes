'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Pencil, Trash2, Tag, Loader2 } from 'lucide-react'
import type { Category } from '@/types'

interface AdminCategoryTableProps {
  categories: Category[]
}

export function AdminCategoryTable({ categories }: AdminCategoryTableProps) {
  const router = useRouter()
  const [loadingId, setLoadingId] = useState<string | null>(null)

  async function deleteCategory(id: string) {
    if (!confirm('Tem certeza? Produtos desta categoria ficarão sem categoria.')) return
    setLoadingId(id)
    const supabase = createClient()
    await supabase.from('categories').delete().eq('id', id)
    setLoadingId(null)
    router.refresh()
  }

  if (categories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-slate/30 gap-3">
        <Tag className="w-12 h-12" />
        <p className="font-semibold">Nenhuma categoria cadastrada</p>
        <Link href="/admin/categorias/nova" className="text-sm text-[#F9A8D4] hover:underline font-bold">
          Criar primeira categoria
        </Link>
      </div>
    )
  }

  return (
    <>
      {/* ── Mobile: card list ── */}
      <div className="md:hidden space-y-3">
        {categories.map((cat) => (
          <div key={cat.id} className="flex items-center gap-3 p-3 rounded-2xl border border-slate/8 bg-slate-50/60">
            <div className="w-10 h-10 rounded-xl bg-[#F9A8D4]/15 flex items-center justify-center shrink-0">
              <Tag className="w-4 h-4 text-[#D4AF37]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-[#1E293B] text-sm">{cat.name}</p>
              <p className="text-xs text-slate/40 font-mono mt-0.5">{cat.slug}</p>
            </div>
            <div className="flex gap-2">
              <Link
                href={`/admin/categorias/${cat.id}/editar`}
                className="w-9 h-9 rounded-xl flex items-center justify-center bg-white border border-slate/10 text-slate/50 hover:text-[#1E293B] transition-colors"
              >
                <Pencil className="w-4 h-4" />
              </Link>
              <button
                onClick={() => deleteCategory(cat.id)}
                disabled={loadingId === cat.id}
                className="w-9 h-9 rounded-xl flex items-center justify-center bg-white border border-slate/10 text-slate/40 hover:text-red-500 hover:border-red-200 transition-colors disabled:opacity-40"
              >
                {loadingId === cat.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ── Desktop: table ── */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate/10">
              <th className="text-left pb-3 px-3 text-xs font-bold text-slate/40 uppercase tracking-wider">Nome</th>
              <th className="text-left pb-3 px-3 text-xs font-bold text-slate/40 uppercase tracking-wider">Slug</th>
              <th className="text-left pb-3 px-3 text-xs font-bold text-slate/40 uppercase tracking-wider">Criado em</th>
              <th className="pb-3 px-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate/5">
            {categories.map((cat) => (
              <tr key={cat.id} className="hover:bg-slate-50/60 transition-colors">
                <td className="py-3 px-3 font-semibold text-[#1E293B]">{cat.name}</td>
                <td className="py-3 px-3 font-mono text-xs text-slate/50">{cat.slug}</td>
                <td className="py-3 px-3 text-slate/50">{new Date(cat.created_at).toLocaleDateString('pt-BR')}</td>
                <td className="py-3 px-3">
                  <div className="flex items-center gap-2 justify-end">
                    <Link
                      href={`/admin/categorias/${cat.id}/editar`}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-slate/40 hover:text-[#1E293B] hover:bg-slate-100 transition-colors"
                    >
                      <Pencil className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => deleteCategory(cat.id)}
                      disabled={loadingId === cat.id}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-slate/40 hover:text-red-500 hover:bg-red-50 transition-colors disabled:opacity-40"
                    >
                      {loadingId === cat.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
