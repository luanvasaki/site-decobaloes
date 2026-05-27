'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/client'
import { formatCurrency } from '@/lib/utils'
import {
  Loader2, Plus, Trash2, User, Phone, Mail,
  CalendarDays, Clock, MapPin, Palette, Sparkles,
  Banknote, ClipboardList, Package,
} from 'lucide-react'
import type { Category, Product, Event } from '@/types'

const itemSchema = z.object({
  product_id:  z.string().optional(),
  custom_name: z.string().optional(),
  quantity:    z.coerce.number().int().min(1),
  unit_price:  z.coerce.number().min(0),
  notes:       z.string().optional(),
})

const schema = z.object({
  client_name:       z.string().min(2, 'Informe o nome do cliente'),
  client_phone:      z.string().min(14, 'Informe um telefone válido'),
  client_email:      z.string().email('E-mail inválido').optional().or(z.literal('')),
  event_date:        z.string().min(1, 'Informe a data do evento'),
  event_time:        z.string().optional(),
  setup_time:        z.string().optional(),
  teardown_time:     z.string().optional(),
  category_id:       z.string().optional(),
  event_theme:       z.string().optional(),
  guest_count:       z.coerce.number().int().min(1).optional(),
  location_name:     z.string().optional(),
  location_address:  z.string().optional(),
  decoration_colors: z.string().optional(),
  balloon_colors:    z.string().optional(),
  balloon_types:     z.string().optional(),
  fabric_colors:     z.string().optional(),
  decoration_pieces: z.string().optional(),
  inspiration_refs:  z.string().optional(),
  special_requests:  z.string().optional(),
  total_value:       z.coerce.number().min(0),
  deposit_value:     z.coerce.number().min(0),
  deposit_paid_at:   z.string().optional(),
  payment_method:    z.enum(['pix','cartao','dinheiro','transferencia','']).optional(),
  payment_status:    z.enum(['pendente','parcial','pago']),
  status:            z.enum(['orcamento','confirmado','em_andamento','concluido','cancelado']),
  internal_notes:    z.string().optional(),
  items:             z.array(itemSchema),
})

type FormData = z.infer<typeof schema>

interface EventFormProps {
  categories: Category[]
  products: Product[]
  event?: Event
}

const STATUS_LABELS = {
  orcamento:    { label: 'Orçamento', color: 'bg-slate-100 text-slate-600' },
  confirmado:   { label: 'Confirmado', color: 'bg-blue-100 text-blue-700' },
  em_andamento: { label: 'Em andamento', color: 'bg-yellow-100 text-yellow-700' },
  concluido:    { label: 'Concluído', color: 'bg-green-100 text-green-700' },
  cancelado:    { label: 'Cancelado', color: 'bg-red-100 text-red-600' },
}

export function EventForm({ categories, products, event }: EventFormProps) {
  const router = useRouter()
  const isEditing = !!event
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register, handleSubmit, watch, control, setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      client_name:       event?.client_name ?? '',
      client_phone:      event?.client_phone ?? '',
      client_email:      event?.client_email ?? '',
      event_date:        event?.event_date ?? '',
      event_time:        event?.event_time ?? '',
      setup_time:        event?.setup_time ?? '',
      teardown_time:     event?.teardown_time ?? '',
      category_id:       event?.category_id ?? '',
      event_theme:       event?.event_theme ?? '',
      guest_count:       event?.guest_count ?? undefined,
      location_name:     event?.location_name ?? '',
      location_address:  event?.location_address ?? '',
      decoration_colors: event?.decoration_colors ?? '',
      balloon_colors:    event?.balloon_colors ?? '',
      balloon_types:     event?.balloon_types ?? '',
      fabric_colors:     event?.fabric_colors ?? '',
      decoration_pieces: event?.decoration_pieces ?? '',
      inspiration_refs:  event?.inspiration_refs ?? '',
      special_requests:  event?.special_requests ?? '',
      total_value:       event?.total_value ?? 0,
      deposit_value:     event?.deposit_value ?? 0,
      deposit_paid_at:   event?.deposit_paid_at ?? '',
      payment_method:    event?.payment_method ?? '',
      payment_status:    event?.payment_status ?? 'pendente',
      status:            event?.status ?? 'orcamento',
      internal_notes:    event?.internal_notes ?? '',
      items: event?.event_items?.map((i) => ({
        product_id:  i.product_id ?? '',
        custom_name: i.custom_name ?? '',
        quantity:    i.quantity,
        unit_price:  i.unit_price,
        notes:       i.notes ?? '',
      })) ?? [],
    },
  })

  const { fields, append, remove } = useFieldArray({ control, name: 'items' })

  const formatPhone = useCallback((value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 11)
    if (digits.length <= 2) return digits.length ? `(${digits}` : ''
    if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
    if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
  }, [])

  const watchItems = watch('items')
  const itemsTotal = watchItems.reduce(
    (sum, it) => sum + (Number(it.unit_price) || 0) * (Number(it.quantity) || 0), 0
  )

  async function onSubmit(data: FormData) {
    setLoading(true)
    setError(null)
    const supabase = createClient()

    const payload = {
      client_name:       data.client_name,
      client_phone:      data.client_phone,
      client_email:      data.client_email || null,
      event_date:        data.event_date,
      event_time:        data.event_time || null,
      setup_time:        data.setup_time || null,
      teardown_time:     data.teardown_time || null,
      category_id:       data.category_id || null,
      event_theme:       data.event_theme || null,
      guest_count:       data.guest_count ?? null,
      location_name:     data.location_name || null,
      location_address:  data.location_address || null,
      decoration_colors: data.decoration_colors || null,
      balloon_colors:    data.balloon_colors || null,
      balloon_types:     data.balloon_types || null,
      fabric_colors:     data.fabric_colors || null,
      decoration_pieces: data.decoration_pieces || null,
      inspiration_refs:  data.inspiration_refs || null,
      special_requests:  data.special_requests || null,
      total_value:       data.total_value,
      deposit_value:     data.deposit_value,
      deposit_paid_at:   data.deposit_paid_at || null,
      payment_method:    data.payment_method || null,
      payment_status:    data.payment_status,
      status:            data.status,
      internal_notes:    data.internal_notes || null,
      updated_at:        new Date().toISOString(),
    }

    try {
      let eventId = event?.id
      if (isEditing) {
        const { error: e } = await supabase.from('events').update(payload).eq('id', eventId!)
        if (e) throw e
      } else {
        const { data: created, error: e } = await supabase
          .from('events').insert(payload).select('id').single()
        if (e) throw e
        eventId = created.id
      }

      // Sync items
      await supabase.from('event_items').delete().eq('event_id', eventId!)
      if (data.items.length > 0) {
        const itemsPayload = data.items.map((it) => ({
          event_id:    eventId,
          product_id:  it.product_id || null,
          custom_name: it.custom_name || null,
          quantity:    it.quantity,
          unit_price:  it.unit_price,
          notes:       it.notes || null,
        }))
        const { error: ei } = await supabase.from('event_items').insert(itemsPayload)
        if (ei) throw ei
      }

      router.push('/admin/eventos')
      router.refresh()
    } catch (err) {
      console.error('[EventForm] onSubmit:', err)
      setError('Erro ao salvar o evento. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const input = 'w-full px-4 py-2.5 rounded-xl border border-slate/15 text-sm focus:outline-none focus:ring-4 focus:ring-[#F9A8D4]/40 focus:border-[#F9A8D4] transition-all bg-white'
  const label = 'block text-sm font-semibold text-slate mb-1.5'
  const errCls = 'text-xs text-red-500 mt-1'
  const section = 'space-y-4 p-5 rounded-2xl bg-slate-50 border border-slate/8'
  const sectionTitle = 'text-xs font-bold text-slate/40 uppercase tracking-widest flex items-center gap-2'

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6 max-w-3xl">
      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-sm text-red-600">{error}</div>
      )}

      {/* ── Status ── */}
      <div className="flex flex-wrap gap-2">
        {(Object.entries(STATUS_LABELS) as [FormData['status'], typeof STATUS_LABELS[keyof typeof STATUS_LABELS]][]).map(([val, meta]) => (
          <label key={val} className="cursor-pointer">
            <input type="radio" value={val} {...register('status')} className="sr-only" />
            <span className={`px-4 py-2 rounded-xl text-xs font-bold border-2 transition-all inline-block ${
              watch('status') === val
                ? `${meta.color} border-current`
                : 'bg-white text-slate/40 border-slate/10 hover:border-slate/25'
            }`}>
              {meta.label}
            </span>
          </label>
        ))}
      </div>

      {/* ── Cliente ── */}
      <div className={section}>
        <p className={sectionTitle}><User className="w-3.5 h-3.5" /> Cliente</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={label}>Nome completo *</label>
            <input {...register('client_name')} className={input} placeholder="Ex: Maria Silva" />
            {errors.client_name && <p className={errCls}>{errors.client_name.message}</p>}
          </div>
          <div>
            <label className={label}>
              <Phone className="w-3.5 h-3.5 inline mr-1" />WhatsApp *
            </label>
            <input
              {...register('client_phone')}
              className={input}
              placeholder="(11) 99999-9999"
              inputMode="numeric"
              onChange={(e) => {
                setValue('client_phone', formatPhone(e.target.value), { shouldValidate: true })
              }}
            />
            {errors.client_phone && <p className={errCls}>{errors.client_phone.message}</p>}
          </div>
          <div className="sm:col-span-2">
            <label className={label}>
              <Mail className="w-3.5 h-3.5 inline mr-1" />E-mail
            </label>
            <input {...register('client_email')} type="email" className={input} placeholder="maria@email.com" />
            {errors.client_email && <p className={errCls}>{errors.client_email.message}</p>}
          </div>
        </div>
      </div>

      {/* ── Evento ── */}
      <div className={section}>
        <p className={sectionTitle}><CalendarDays className="w-3.5 h-3.5" /> Evento</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div className="col-span-2 sm:col-span-1">
            <label className={label}>Data do evento *</label>
            <input type="date" {...register('event_date')} className={input} />
            {errors.event_date && <p className={errCls}>{errors.event_date.message}</p>}
          </div>
          <div>
            <label className={label}><Clock className="w-3.5 h-3.5 inline mr-1" />Horário início</label>
            <input type="time" {...register('event_time')} className={input} />
          </div>
          <div>
            <label className={label}>Montagem a partir</label>
            <input type="time" {...register('setup_time')} className={input} />
          </div>
          <div>
            <label className={label}>Desmontagem até</label>
            <input type="time" {...register('teardown_time')} className={input} />
          </div>
          <div>
            <label className={label}>Tipo de evento</label>
            <select {...register('category_id')} className={input}>
              <option value="">Selecione...</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={label}>Tema / Estilo</label>
            <input {...register('event_theme')} className={input} placeholder="Ex: Romântico, Rústico, Moderno" />
          </div>
          <div>
            <label className={label}>Nº de convidados</label>
            <input type="number" min="1" {...register('guest_count')} className={input} placeholder="50" />
          </div>
        </div>
      </div>

      {/* ── Local ── */}
      <div className={section}>
        <p className={sectionTitle}><MapPin className="w-3.5 h-3.5" /> Local</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={label}>Nome do espaço / salão</label>
            <input {...register('location_name')} className={input} placeholder="Ex: Buffet Estrela" />
          </div>
          <div>
            <label className={label}>Endereço completo</label>
            <input {...register('location_address')} className={input} placeholder="Rua, número, bairro, cidade" />
          </div>
        </div>
      </div>

      {/* ── Decoração ── */}
      <div className="space-y-4 p-5 rounded-2xl bg-[#fdf2f8] border border-[#F9A8D4]/20">
        <p className={sectionTitle}><Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" /> <span className="text-[#D4AF37]">Detalhes da decoração</span></p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={label}><Palette className="w-3.5 h-3.5 inline mr-1" />Cores da decoração</label>
            <input {...register('decoration_colors')} className={input} placeholder="Ex: Rosa, Dourado, Branco" />
          </div>
          <div>
            <label className={label}>Cores dos balões</label>
            <input {...register('balloon_colors')} className={input} placeholder="Ex: Rosa bebê, Transparente, Dourado" />
          </div>
          <div>
            <label className={label}>Tipos de balão</label>
            <input {...register('balloon_types')} className={input} placeholder="Ex: Látex, Metalizado, Bubble, Cromado" />
          </div>
          <div>
            <label className={label}>Tecidos / cores</label>
            <input {...register('fabric_colors')} className={input} placeholder="Ex: Voil branco, Cetim rosa" />
          </div>
          <div className="sm:col-span-2">
            <label className={label}>Peças / itens da decoração</label>
            <textarea
              {...register('decoration_pieces')} rows={2} className={input}
              placeholder="Ex: Arco orgânico de entrada, Mesa de doces com painel, 2 arranjos de mesa, Mural de balões..."
            />
          </div>
          <div className="sm:col-span-2">
            <label className={label}>Referências / inspiração</label>
            <textarea
              {...register('inspiration_refs')} rows={2} className={input}
              placeholder="Links do Pinterest, Instagram, descrição da inspiração..."
            />
          </div>
          <div className="sm:col-span-2">
            <label className={label}>Pedidos especiais</label>
            <textarea
              {...register('special_requests')} rows={2} className={input}
              placeholder="Personalizações, restrições, pedidos do cliente..."
            />
          </div>
        </div>
      </div>

      {/* ── Itens do catálogo ── */}
      <div className={section}>
        <div className="flex items-center justify-between">
          <p className={sectionTitle}><Package className="w-3.5 h-3.5" /> Itens do evento</p>
          <button
            type="button"
            onClick={() => append({ product_id: '', custom_name: '', quantity: 1, unit_price: 0, notes: '' })}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F9A8D4]/20 text-[#1E293B] text-xs font-bold hover:bg-[#F9A8D4]/40 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" /> Adicionar item
          </button>
        </div>

        {fields.length === 0 && (
          <p className="text-sm text-slate/40 text-center py-4">Nenhum item adicionado ainda.</p>
        )}

        <div className="space-y-3">
          {fields.map((field, index) => (
            <div key={field.id} className="p-4 rounded-xl bg-white border border-slate/10 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={label}>Do catálogo</label>
                  <select {...register(`items.${index}.product_id`)} className={input}>
                    <option value="">Item avulso / personalizado</option>
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={label}>Nome (se avulso)</label>
                  <input
                    {...register(`items.${index}.custom_name`)} className={input}
                    placeholder="Ex: Toalha rosa extra"
                  />
                </div>
                <div>
                  <label className={label}>Qtd.</label>
                  <input type="number" min="1" {...register(`items.${index}.quantity`)} className={input} />
                </div>
                <div>
                  <label className={label}>Preço unitário (R$)</label>
                  <input type="number" step="0.01" min="0" {...register(`items.${index}.unit_price`)} className={input} />
                </div>
                <div className="sm:col-span-2">
                  <label className={label}>Observação</label>
                  <input {...register(`items.${index}.notes`)} className={input} placeholder="Cor específica, tamanho, observação..." />
                </div>
              </div>
              <div className="flex items-center justify-between pt-1">
                <span className="text-xs text-slate/50 font-medium">
                  Subtotal: {formatCurrency((Number(watchItems[index]?.unit_price) || 0) * (Number(watchItems[index]?.quantity) || 0))}
                </span>
                <button
                  type="button" onClick={() => remove(index)}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs text-red-500 hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Remover
                </button>
              </div>
            </div>
          ))}
        </div>

        {fields.length > 0 && (
          <div className="flex justify-end pt-2">
            <p className="text-sm font-bold text-slate">
              Total dos itens: <span className="text-[#D4AF37]">{formatCurrency(itemsTotal)}</span>
            </p>
          </div>
        )}
      </div>

      {/* ── Financeiro ── */}
      <div className={section}>
        <p className={sectionTitle}><Banknote className="w-3.5 h-3.5" /> Financeiro</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div>
            <label className={label}>Valor total (R$) *</label>
            <input type="number" step="0.01" min="0" {...register('total_value')} className={input} />
            {errors.total_value && <p className={errCls}>{errors.total_value.message}</p>}
          </div>
          <div>
            <label className={label}>Sinal / entrada (R$)</label>
            <input type="number" step="0.01" min="0" {...register('deposit_value')} className={input} />
          </div>
          <div>
            <label className={label}>Data do sinal</label>
            <input type="date" {...register('deposit_paid_at')} className={input} />
          </div>
          <div>
            <label className={label}>Forma de pagamento</label>
            <select {...register('payment_method')} className={input}>
              <option value="">Selecione...</option>
              <option value="pix">Pix</option>
              <option value="cartao">Cartão</option>
              <option value="dinheiro">Dinheiro</option>
              <option value="transferencia">Transferência</option>
            </select>
          </div>
          <div>
            <label className={label}>Status do pagamento</label>
            <select {...register('payment_status')} className={input}>
              <option value="pendente">Pendente</option>
              <option value="parcial">Parcial (sinal pago)</option>
              <option value="pago">Pago</option>
            </select>
          </div>
        </div>

        {/* Balance summary */}
        <div className="mt-2 p-3 rounded-xl bg-white border border-slate/10 flex items-center justify-between text-sm">
          <span className="text-slate/60">Saldo a receber:</span>
          <span className="font-extrabold text-[#1E293B]">
            {formatCurrency(Math.max(0, (Number(watch('total_value')) || 0) - (Number(watch('deposit_value')) || 0)))}
          </span>
        </div>
      </div>

      {/* ── Notas internas ── */}
      <div className={section}>
        <p className={sectionTitle}><ClipboardList className="w-3.5 h-3.5" /> Notas internas</p>
        <textarea
          {...register('internal_notes')} rows={3} className={input}
          placeholder="Anotações privadas da decoradora — não visíveis para o cliente..."
        />
      </div>

      {/* ── Botões ── */}
      <div className="flex gap-3 pt-2">
        <button
          type="submit" disabled={loading}
          className="px-8 py-3 rounded-xl bg-[#1E293B] text-white font-bold text-sm hover:bg-slate-700 transition-colors disabled:opacity-60 flex items-center gap-2"
        >
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          {loading ? 'Salvando...' : isEditing ? 'Salvar alterações' : 'Criar evento'}
        </button>
        <button
          type="button" onClick={() => router.back()}
          className="px-6 py-3 rounded-xl border border-slate/15 text-slate font-semibold text-sm hover:bg-slate-50 transition-colors"
        >
          Cancelar
        </button>
      </div>
    </form>
  )
}
