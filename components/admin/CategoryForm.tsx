'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/client'
import { slugify } from '@/lib/utils'
import { CATEGORY_TO_THEME } from '@/lib/category-mapping'
import { Loader2, AlertTriangle } from 'lucide-react'
import type { Category } from '@/types'

const schema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
})

type FormData = z.infer<typeof schema>

interface CategoryFormProps {
  category?: Category
}

export function CategoryForm({ category }: CategoryFormProps) {
  const router = useRouter()
  const isEditing = !!category
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { name: category?.name ?? '' },
  })

  const nameValue = watch('name')
  const previewSlug = slugify(nameValue || '')
  const outsideKnownThemes = previewSlug.length > 0 && !(previewSlug in CATEGORY_TO_THEME)

  async function onSubmit(data: FormData) {
    setLoading(true)
    setError(null)

    const supabase = createClient()
    const slug = slugify(data.name)

    try {
      if (isEditing) {
        const { error: updateError } = await supabase
          .from('categories')
          .update({ name: data.name, slug })
          .eq('id', category.id)
        if (updateError) throw updateError
      } else {
        const { error: insertError } = await supabase
          .from('categories')
          .insert({ name: data.name, slug })
        if (insertError) throw insertError
      }

      router.push('/admin/categorias')
      router.refresh()
    } catch {
      setError('Erro ao salvar categoria. Verifique se o nome já existe.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6 max-w-md">
      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-sm text-red-600">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="name" className="block text-sm font-semibold text-slate mb-1.5">
          Nome da categoria *
        </label>
        <input
          id="name"
          {...register('name')}
          className="w-full px-4 py-2.5 rounded-xl border border-slate/15 text-sm focus:outline-none focus:ring-4 focus:ring-[#F9A8D4]/40 focus:border-[#F9A8D4] transition-all"
          placeholder="Ex: Balões, Cenários, Mesas..."
        />
        {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
        {!errors.name && outsideKnownThemes && (
          <p className="flex items-start gap-1.5 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mt-2">
            <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
            Esta categoria não corresponde a nenhum dos temas conhecidos do site (Casamento, Aniversário/Debutante, Festa Infantil, Chá de Bebê/Revelação). Produtos cadastrados nela <strong>não aparecerão</strong> no Catálogo nem na Galeria públicos até que o mapeamento de temas seja atualizado.
          </p>
        )}
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="px-8 py-3 rounded-xl bg-[#1E293B] text-white font-bold text-sm hover:bg-slate-700 transition-colors focus:outline-none focus:ring-4 focus:ring-slate/30 disabled:opacity-60 flex items-center gap-2"
        >
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          {loading ? 'Salvando...' : isEditing ? 'Salvar alterações' : 'Criar categoria'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-3 rounded-xl border border-slate/15 text-slate font-semibold text-sm hover:bg-slate-50 transition-colors"
        >
          Cancelar
        </button>
      </div>
    </form>
  )
}
