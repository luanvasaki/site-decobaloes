'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import { formatCurrency } from '@/lib/utils'
import { Pencil, Trash2, Package, ToggleLeft, ToggleRight, Loader2 } from 'lucide-react'
import type { Product } from '@/types'
import { useRouter } from 'next/navigation'

interface AdminProductTableProps {
  products: Product[]
}

export function AdminProductTable({ products }: AdminProductTableProps) {
  const router = useRouter()
  const [loadingId, setLoadingId] = useState<string | null>(null)

  async function toggleAvailability(product: Product) {
    setLoadingId(product.id)
    const supabase = createClient()
    await supabase.from('products').update({ is_available: !product.is_available }).eq('id', product.id)
    setLoadingId(null)
    router.refresh()
  }

  async function deleteProduct(id: string) {
    if (!confirm('Tem certeza que deseja excluir este produto?')) return
    setLoadingId(id)
    const supabase = createClient()
    await supabase.from('products').delete().eq('id', id)
    setLoadingId(null)
    router.refresh()
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-slate/30 gap-3">
        <Package className="w-12 h-12" />
        <p className="font-semibold">Nenhum produto cadastrado</p>
        <Link href="/admin/produtos/novo" className="text-sm text-[#F9A8D4] hover:underline font-bold">
          Criar primeiro produto
        </Link>
      </div>
    )
  }

  return (
    <>
      {/* ── Mobile: card list ── */}
      <div className="md:hidden space-y-3">
        {products.map((product) => (
          <div key={product.id} className="flex items-center gap-3 p-3 rounded-2xl border border-slate/8 bg-slate-50/60">
            {/* Thumbnail */}
            <div className="w-14 h-14 rounded-xl bg-primary-50 overflow-hidden shrink-0">
              {product.images_urls?.[0] ? (
                <Image
                  src={product.images_urls[0]}
                  alt={product.name}
                  width={56}
                  height={56}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Package className="w-5 h-5 text-primary-300" />
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="font-bold text-[#1E293B] text-sm line-clamp-1">{product.name}</p>
              <p className="text-xs text-slate/50 mt-0.5">
                {product.categories?.name ?? '—'} · {formatCurrency(product.price_rental)}
              </p>
              {/* Toggle */}
              <button
                onClick={() => toggleAvailability(product)}
                disabled={loadingId === product.id}
                className="flex items-center gap-1 mt-1.5 focus:outline-none"
              >
                {loadingId === product.id ? (
                  <Loader2 className="w-4 h-4 animate-spin text-slate/40" />
                ) : product.is_available ? (
                  <ToggleRight className="w-5 h-5 text-green-500" />
                ) : (
                  <ToggleLeft className="w-5 h-5 text-slate/30" />
                )}
                <span className={`text-xs font-semibold ${product.is_available ? 'text-green-600' : 'text-slate/40'}`}>
                  {product.is_available ? 'Disponível' : 'Indisponível'}
                </span>
              </button>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2">
              <Link
                href={`/admin/produtos/${product.id}/editar`}
                className="w-9 h-9 rounded-xl flex items-center justify-center bg-white border border-slate/10 text-slate/50 hover:text-[#1E293B] transition-colors"
              >
                <Pencil className="w-4 h-4" />
              </Link>
              <button
                onClick={() => deleteProduct(product.id)}
                disabled={loadingId === product.id}
                className="w-9 h-9 rounded-xl flex items-center justify-center bg-white border border-slate/10 text-slate/40 hover:text-red-500 hover:border-red-200 transition-colors disabled:opacity-40"
              >
                {loadingId === product.id ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
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
              <th className="text-left pb-3 px-3 text-xs font-bold text-slate/40 uppercase tracking-wider">Produto</th>
              <th className="text-left pb-3 px-3 text-xs font-bold text-slate/40 uppercase tracking-wider">Categoria</th>
              <th className="text-left pb-3 px-3 text-xs font-bold text-slate/40 uppercase tracking-wider">Preço</th>
              <th className="text-left pb-3 px-3 text-xs font-bold text-slate/40 uppercase tracking-wider">Status</th>
              <th className="pb-3 px-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate/5">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-slate-50/60 transition-colors">
                <td className="py-3 px-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary-50 overflow-hidden shrink-0">
                      {product.images_urls?.[0] ? (
                        <Image src={product.images_urls[0]} alt={product.name} width={40} height={40} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="w-4 h-4 text-primary-300" />
                        </div>
                      )}
                    </div>
                    <span className="font-semibold text-[#1E293B] line-clamp-1 max-w-[200px]">{product.name}</span>
                  </div>
                </td>
                <td className="py-3 px-3 text-slate/60">{product.categories?.name ?? '—'}</td>
                <td className="py-3 px-3 font-bold text-[#D4AF37]">{formatCurrency(product.price_rental)}</td>
                <td className="py-3 px-3">
                  <button
                    onClick={() => toggleAvailability(product)}
                    disabled={loadingId === product.id}
                    className="flex items-center gap-1.5 transition-colors focus:outline-none focus:ring-4 focus:ring-[#F9A8D4]/40 rounded-lg"
                  >
                    {loadingId === product.id ? (
                      <Loader2 className="w-5 h-5 animate-spin text-slate/40" />
                    ) : product.is_available ? (
                      <ToggleRight className="w-6 h-6 text-green-500" />
                    ) : (
                      <ToggleLeft className="w-6 h-6 text-slate/30" />
                    )}
                    <span className={`text-xs font-semibold ${product.is_available ? 'text-green-600' : 'text-slate/40'}`}>
                      {product.is_available ? 'Ativo' : 'Inativo'}
                    </span>
                  </button>
                </td>
                <td className="py-3 px-3">
                  <div className="flex items-center gap-2 justify-end">
                    <Link
                      href={`/admin/produtos/${product.id}/editar`}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-slate/40 hover:text-[#1E293B] hover:bg-slate-100 transition-colors"
                    >
                      <Pencil className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => deleteProduct(product.id)}
                      disabled={loadingId === product.id}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-slate/40 hover:text-red-500 hover:bg-red-50 transition-colors disabled:opacity-40"
                    >
                      <Trash2 className="w-4 h-4" />
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
