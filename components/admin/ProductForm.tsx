'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/client'
import { slugify } from '@/lib/utils'
import { Loader2, Upload, X, Sparkles, Wrench } from 'lucide-react'
import type { Category, Product } from '@/types'

const schema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  description: z.string().optional(),
  product_type: z.enum(['decoracao', 'material']),
  category_id: z.string().optional(),
  price_rental: z.coerce.number().positive('Preço deve ser maior que zero'),
  // decoração-specific
  color_palette: z.string().optional(),
  event_size: z.enum(['pequeno', 'medio', 'grande', '']).optional(),
  includes_setup: z.boolean().optional(),
  // material-specific
  height: z.coerce.number().optional(),
  width: z.coerce.number().optional(),
  depth: z.coerce.number().optional(),
  quantity_total: z.coerce.number().int().min(1).optional(),
  quantity_available: z.coerce.number().int().min(0).optional(),
  is_available: z.boolean(),
})

type FormData = z.infer<typeof schema>

interface ProductFormProps {
  categories: Category[]
  product?: Product
}

export function ProductForm({ categories, product }: ProductFormProps) {
  const router = useRouter()
  const isEditing = !!product
  const [loading, setLoading] = useState(false)
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [existingImages, setExistingImages] = useState<string[]>(
    product?.images_urls ?? []
  )
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: product?.name ?? '',
      description: product?.description ?? '',
      product_type: product?.product_type ?? 'decoracao',
      category_id: product?.category_id ?? '',
      price_rental: product?.price_rental ?? 0,
      color_palette: product?.color_palette ?? '',
      event_size: product?.event_size ?? '',
      includes_setup: product?.includes_setup ?? false,
      height: product?.height ?? undefined,
      width: product?.width ?? undefined,
      depth: product?.depth ?? undefined,
      quantity_total: product?.quantity_total ?? 1,
      quantity_available: product?.quantity_available ?? 1,
      is_available: product?.is_available ?? true,
    },
  })

  const productType = watch('product_type')
  const isDecoracao = productType === 'decoracao'

  async function uploadImages(productId: string): Promise<string[]> {
    if (imageFiles.length === 0) return existingImages
    const supabase = createClient()
    const uploaded: string[] = [...existingImages]
    for (const file of imageFiles) {
      const ext = file.name.split('.').pop()
      const path = `products/${productId}/${Date.now()}.${ext}`
      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(path, file, { upsert: true })
      if (!uploadError) {
        const { data } = supabase.storage.from('product-images').getPublicUrl(path)
        uploaded.push(data.publicUrl)
      }
    }
    return uploaded
  }

  async function onSubmit(data: FormData) {
    setLoading(true)
    setError(null)
    const supabase = createClient()
    const slug = isEditing ? product.slug : slugify(data.name)

    // Build payload according to type
    const basePayload = {
      name: data.name,
      slug,
      description: data.description || null,
      product_type: data.product_type,
      category_id: data.category_id || null,
      price_rental: data.price_rental,
      is_available: data.is_available,
    }

    const payload = isDecoracao
      ? {
          ...basePayload,
          color_palette: data.color_palette || null,
          event_size: data.event_size || null,
          includes_setup: data.includes_setup ?? false,
          height: null,
          width: null,
          depth: null,
          quantity_total: 1,
          quantity_available: 1,
        }
      : {
          ...basePayload,
          color_palette: null,
          event_size: null,
          includes_setup: false,
          height: data.height || null,
          width: data.width || null,
          depth: data.depth || null,
          quantity_total: data.quantity_total ?? 1,
          quantity_available: data.quantity_available ?? 1,
        }

    try {
      if (isEditing) {
        const images = await uploadImages(product.id)
        const { error: updateError } = await supabase
          .from('products')
          .update({ ...payload, images_urls: images })
          .eq('id', product.id)
        if (updateError) throw updateError
      } else {
        const { data: newProduct, error: insertError } = await supabase
          .from('products')
          .insert({ ...payload, images_urls: [] })
          .select()
          .single()
        if (insertError) throw insertError
        const images = await uploadImages(newProduct.id)
        if (images.length > 0) {
          await supabase
            .from('products')
            .update({ images_urls: images })
            .eq('id', newProduct.id)
        }
      }
      router.push('/admin/produtos')
      router.refresh()
    } catch (err) {
      console.warn(err)
      setError('Erro ao salvar. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    setImageFiles((prev) => [...prev, ...files])
  }

  const input =
    'w-full px-4 py-2.5 rounded-xl border border-slate/15 text-sm focus:outline-none focus:ring-4 focus:ring-[#F9A8D4]/40 focus:border-[#F9A8D4] transition-all bg-white'
  const label = 'block text-sm font-semibold text-slate mb-1.5'
  const err = 'text-xs text-red-500 mt-1'

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-8 max-w-2xl">
      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* ── Tipo de item ── */}
      <div>
        <p className={label}>Tipo de item *</p>
        <div className="grid grid-cols-2 gap-3">
          {[
            { value: 'decoracao', label: 'Decoração', emoji: '🎉', desc: 'Pacotes decorativos para eventos' },
            { value: 'material',  label: 'Material',  emoji: '🔧', desc: 'Itens físicos para aluguel' },
          ].map((opt) => (
            <label
              key={opt.value}
              className={`flex flex-col gap-1 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                productType === opt.value
                  ? 'border-[#F9A8D4] bg-[#fdf2f8]'
                  : 'border-slate/10 bg-white hover:border-slate/25'
              }`}
            >
              <input type="radio" value={opt.value} {...register('product_type')} className="sr-only" />
              <span className="text-xl">{opt.emoji}</span>
              <span className="font-bold text-sm text-slate">{opt.label}</span>
              <span className="text-xs text-slate/50">{opt.desc}</span>
            </label>
          ))}
        </div>
      </div>

      {/* ── Informações básicas ── */}
      <div className="space-y-4 p-5 rounded-2xl bg-slate-50 border border-slate/8">
        <p className="text-xs font-bold text-slate/40 uppercase tracking-widest">Informações básicas</p>

        <div>
          <label htmlFor="name" className={label}>Nome *</label>
          <input
            id="name"
            {...register('name')}
            className={input}
            placeholder={isDecoracao ? 'Ex: Decoração Casamento Clássico Rosa e Dourado' : 'Ex: Mesa redonda 1,50m'}
          />
          {errors.name && <p className={err}>{errors.name.message}</p>}
        </div>

        <div>
          <label htmlFor="description" className={label}>Descrição</label>
          <textarea
            id="description"
            {...register('description')}
            rows={3}
            className={input}
            placeholder={
              isDecoracao
                ? 'Descreva o que está incluso: arco de balões, mesa de doces, painel, arranjos...'
                : 'Descreva o material, estado de conservação, observações...'
            }
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="category_id" className={label}>
              {isDecoracao ? 'Tipo de evento' : 'Categoria'}
            </label>
            <select id="category_id" {...register('category_id')} className={input}>
              <option value="">Selecione...</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="price_rental" className={label}>Preço de aluguel (R$) *</label>
            <input
              id="price_rental"
              type="number"
              step="0.01"
              min="0"
              {...register('price_rental')}
              className={input}
              placeholder="0,00"
            />
            {errors.price_rental && <p className={err}>{errors.price_rental.message}</p>}
          </div>
        </div>
      </div>

      {/* ── Detalhes da Decoração ── */}
      {isDecoracao && (
        <div className="space-y-4 p-5 rounded-2xl bg-[#fdf2f8] border border-[#F9A8D4]/20">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#D4AF37]" />
            <p className="text-xs font-bold text-[#D4AF37] uppercase tracking-widest">Detalhes da decoração</p>
          </div>

          {/* Paleta de cores */}
          <div>
            <label htmlFor="color_palette" className={label}>Paleta de cores</label>
            <input
              id="color_palette"
              {...register('color_palette')}
              className={input}
              placeholder="Ex: Rosa, Dourado e Branco"
            />
            <p className="text-xs text-slate/40 mt-1">Separe as cores por vírgula</p>
          </div>

          {/* Tamanho do evento */}
          <div>
            <p className={label}>Tamanho do evento indicado</p>
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: 'pequeno', label: 'Pequeno',  desc: 'até 30 pessoas',   emoji: '🏡' },
                { value: 'medio',   label: 'Médio',    desc: '30 a 80 pessoas',  emoji: '🎪' },
                { value: 'grande',  label: 'Grande',   desc: 'acima de 80',      emoji: '🏟️' },
              ].map((opt) => (
                <label
                  key={opt.value}
                  className={`flex flex-col items-center gap-1 p-3 rounded-xl border-2 cursor-pointer text-center transition-all ${
                    watch('event_size') === opt.value
                      ? 'border-[#D4AF37] bg-[#fefce8]'
                      : 'border-slate/10 bg-white hover:border-slate/25'
                  }`}
                >
                  <input type="radio" value={opt.value} {...register('event_size')} className="sr-only" />
                  <span className="text-lg">{opt.emoji}</span>
                  <span className="font-bold text-xs text-slate">{opt.label}</span>
                  <span className="text-xs text-slate/40">{opt.desc}</span>
                </label>
              ))}
            </div>
            <label
              className="flex items-center gap-2 mt-2 cursor-pointer"
            >
              <input type="radio" value="" {...register('event_size')} className="accent-slate/40" />
              <span className="text-xs text-slate/50">Não especificar</span>
            </label>
          </div>

          {/* Inclui montagem */}
          <div className="flex items-center gap-3 p-3 rounded-xl bg-white border border-slate/10">
            <input
              id="includes_setup"
              type="checkbox"
              {...register('includes_setup')}
              className="w-4 h-4 rounded accent-[#D4AF37]"
            />
            <div>
              <label htmlFor="includes_setup" className="text-sm font-semibold text-slate cursor-pointer">
                Inclui montagem e desmontagem
              </label>
              <p className="text-xs text-slate/40">A decoradora monta e desmonta no local do evento</p>
            </div>
          </div>
        </div>
      )}

      {/* ── Especificações do Material ── */}
      {!isDecoracao && (
        <div className="space-y-4 p-5 rounded-2xl bg-slate-50 border border-slate/8">
          <div className="flex items-center gap-2">
            <Wrench className="w-4 h-4 text-slate/50" />
            <p className="text-xs font-bold text-slate/40 uppercase tracking-widest">Especificações do material</p>
          </div>

          <div>
            <p className={label}>Dimensões (cm)</p>
            <div className="grid grid-cols-3 gap-3">
              {(['height', 'width', 'depth'] as const).map((dim) => (
                <div key={dim}>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    {...register(dim)}
                    className={input}
                    placeholder={dim === 'height' ? 'Altura' : dim === 'width' ? 'Largura' : 'Profundidade'}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="quantity_total" className={label}>Qtd. total em estoque</label>
              <input id="quantity_total" type="number" min="1" {...register('quantity_total')} className={input} />
            </div>
            <div>
              <label htmlFor="quantity_available" className={label}>Qtd. disponível agora</label>
              <input id="quantity_available" type="number" min="0" {...register('quantity_available')} className={input} />
            </div>
          </div>
        </div>
      )}

      {/* ── Disponibilidade ── */}
      <div className="flex items-center gap-3 p-4 rounded-xl bg-white border border-slate/10">
        <input
          id="is_available"
          type="checkbox"
          {...register('is_available')}
          className="w-4 h-4 rounded accent-[#F9A8D4]"
        />
        <div>
          <label htmlFor="is_available" className="text-sm font-semibold text-slate cursor-pointer">
            Disponível para aluguel
          </label>
          <p className="text-xs text-slate/40">Aparece no catálogo público do site</p>
        </div>
      </div>

      {/* ── Imagens ── */}
      <div className="space-y-3">
        <p className={label}>Fotos</p>

        {existingImages.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {existingImages.map((url) => (
              <div key={url} className="relative w-20 h-20 rounded-xl overflow-hidden border border-slate/10 group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt="" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => setExistingImages((prev) => prev.filter((u) => u !== url))}
                  className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label="Remover"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        {imageFiles.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {imageFiles.map((file, index) => (
              <div key={index} className="relative w-20 h-20 rounded-xl overflow-hidden border-2 border-dashed border-[#F9A8D4] group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={URL.createObjectURL(file)} alt="" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => setImageFiles((prev) => prev.filter((_, i) => i !== index))}
                  className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label="Remover"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        <label className="flex items-center gap-2 px-4 py-3 rounded-xl border-2 border-dashed border-slate/20 text-sm text-slate/50 hover:border-[#F9A8D4] hover:text-slate transition-colors cursor-pointer w-fit">
          <Upload className="w-4 h-4" />
          <span>Adicionar fotos</span>
          <input type="file" multiple accept="image/*" onChange={handleFileChange} className="sr-only" />
        </label>
        <p className="text-xs text-slate/40">Pode selecionar várias fotos de uma vez. A primeira será a foto principal.</p>
      </div>

      {/* ── Botões ── */}
      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="px-8 py-3 rounded-xl bg-[#1E293B] text-white font-bold text-sm hover:bg-slate-700 transition-colors focus:outline-none focus:ring-4 focus:ring-slate/30 disabled:opacity-60 flex items-center gap-2"
        >
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          {loading ? 'Salvando...' : isEditing ? 'Salvar alterações' : 'Criar item'}
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
