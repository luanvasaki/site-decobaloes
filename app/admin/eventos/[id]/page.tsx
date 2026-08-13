import { notFound } from 'next/navigation'
import Link from 'next/link'
import {
  ChevronLeft, Pencil, Phone, Mail, MapPin,
  Clock, Users, Palette, Sparkles, Banknote,
  ClipboardList, Package, CalendarDays,
} from 'lucide-react'
import { getEventById } from '@/services/events'
import { formatCurrency } from '@/lib/utils'

const STATUS_STYLE: Record<string, string> = {
  orcamento:    'bg-slate-100 text-slate-600',
  confirmado:   'bg-blue-100 text-blue-700',
  em_andamento: 'bg-yellow-100 text-yellow-700',
  concluido:    'bg-green-100 text-green-700',
  cancelado:    'bg-red-100 text-red-600',
}
const STATUS_LABEL: Record<string, string> = {
  orcamento: 'Orçamento', confirmado: 'Confirmado',
  em_andamento: 'Em andamento', concluido: 'Concluído', cancelado: 'Cancelado',
}
const PAYMENT_LABEL: Record<string, string> = {
  pendente: 'Pagamento pendente', parcial: 'Sinal pago', pago: 'Pago',
}
const PAYMENT_STYLE: Record<string, string> = {
  pendente: 'text-red-500 bg-red-50', parcial: 'text-yellow-700 bg-yellow-50', pago: 'text-green-700 bg-green-50',
}

function Field({ icon: Icon, label, value }: { icon?: React.ElementType; label: string; value?: string | number | null }) {
  if (!value) return null
  return (
    <div className="flex items-start gap-3">
      {Icon && <Icon className="w-4 h-4 text-slate/40 mt-0.5 shrink-0" />}
      <div>
        <p className="text-[11px] font-bold text-slate/40 uppercase tracking-wide">{label}</p>
        <p className="text-sm font-semibold text-slate mt-0.5">{value}</p>
      </div>
    </div>
  )
}

function Section({ title, icon: Icon, children, pink }: { title: string; icon: React.ElementType; children: React.ReactNode; pink?: boolean }) {
  return (
    <div className={`p-5 rounded-2xl border ${pink ? 'bg-[#fdf2f8] border-[#F9A8D4]/20' : 'bg-slate-50 border-slate/[0.08]'}`}>
      <p className={`text-xs font-bold uppercase tracking-widest flex items-center gap-2 mb-4 ${pink ? 'text-[#D4AF37]' : 'text-slate/40'}`}>
        <Icon className="w-3.5 h-3.5" />{title}
      </p>
      <div className="space-y-3">{children}</div>
    </div>
  )
}

export default async function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const event = await getEventById(id)
  if (!event) notFound()

  const eventDate = new Date(event.event_date + 'T12:00:00')
  const balance   = event.total_value - event.deposit_value

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-3xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <Link href="/admin/eventos" className="inline-flex items-center gap-1 text-sm text-slate/50 hover:text-slate mb-3 transition-colors">
            <ChevronLeft className="w-4 h-4" /> Eventos
          </Link>
          <h1 className="text-2xl font-extrabold text-[#1E293B]">{event.client_name}</h1>
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <span className={`text-xs font-bold px-3 py-1 rounded-full ${STATUS_STYLE[event.status]}`}>
              {STATUS_LABEL[event.status]}
            </span>
            <span className={`text-xs font-bold px-3 py-1 rounded-full ${PAYMENT_STYLE[event.payment_status]}`}>
              {PAYMENT_LABEL[event.payment_status]}
            </span>
          </div>
        </div>
        <Link
          href={`/admin/eventos/${id}/editar`}
          className="shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#F9A8D4] text-[#1E293B] font-bold text-sm hover:bg-pink-300 transition-colors"
        >
          <Pencil className="w-4 h-4" /> Editar
        </Link>
      </div>

      {/* ── Data e hora ── */}
      <div className="bg-white rounded-2xl shadow-card p-5 flex flex-wrap gap-6">
        <div className="flex items-center gap-3">
          <div className="bg-primary-50 rounded-2xl px-4 py-3 text-center">
            <p className="text-3xl font-extrabold text-[#1E293B] leading-none">{eventDate.getDate()}</p>
            <p className="text-xs font-bold text-slate/50 uppercase">
              {eventDate.toLocaleString('pt-BR', { month: 'short', year: 'numeric' })}
            </p>
          </div>
          <div className="space-y-1">
            {event.event_time && (
              <p className="text-sm text-slate/60 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" /> Início: <strong className="text-slate">{event.event_time.slice(0,5)}</strong>
              </p>
            )}
            {event.setup_time && (
              <p className="text-sm text-slate/60 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" /> Montagem: <strong className="text-slate">{event.setup_time.slice(0,5)}</strong>
              </p>
            )}
            {event.teardown_time && (
              <p className="text-sm text-slate/60 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" /> Desmontagem: <strong className="text-slate">{event.teardown_time.slice(0,5)}</strong>
              </p>
            )}
          </div>
        </div>
        {event.categories?.name && (
          <div className="flex items-center gap-2">
            <CalendarDays className="w-4 h-4 text-slate/40" />
            <div>
              <p className="text-[11px] font-bold text-slate/40 uppercase">Tipo</p>
              <p className="text-sm font-semibold text-slate">{event.categories.name}</p>
            </div>
          </div>
        )}
        {event.guest_count && (
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-slate/40" />
            <div>
              <p className="text-[11px] font-bold text-slate/40 uppercase">Convidados</p>
              <p className="text-sm font-semibold text-slate">{event.guest_count}</p>
            </div>
          </div>
        )}
      </div>

      {/* ── Cliente e local ── */}
      <Section title="Cliente" icon={Phone}>
        <Field icon={Phone} label="Telefone" value={event.client_phone} />
        <Field icon={Mail} label="E-mail" value={event.client_email} />
        <Field icon={MapPin} label="Local" value={[event.location_name, event.location_address].filter(Boolean).join(' — ')} />
      </Section>

      {/* ── Decoração ── */}
      {(event.decoration_colors || event.balloon_colors || event.balloon_types ||
        event.fabric_colors || event.decoration_pieces || event.inspiration_refs ||
        event.special_requests || event.event_theme) && (
        <Section title="Decoração" icon={Sparkles} pink>
          <Field icon={Palette} label="Cores da decoração" value={event.decoration_colors} />
          <Field label="Cores dos balões" value={event.balloon_colors} />
          <Field label="Tipos de balão" value={event.balloon_types} />
          <Field label="Tecidos / cores" value={event.fabric_colors} />
          <Field label="Tema / estilo" value={event.event_theme} />
          <Field label="Peças / itens" value={event.decoration_pieces} />
          <Field label="Referências" value={event.inspiration_refs} />
          <Field label="Pedidos especiais" value={event.special_requests} />
        </Section>
      )}

      {/* ── Itens ── */}
      {event.event_items && event.event_items.length > 0 && (
        <Section title="Itens do evento" icon={Package}>
          <div className="space-y-2">
            {event.event_items.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate/10">
                <div>
                  <p className="text-sm font-semibold text-slate">
                    {item.product_name ?? item.products?.name ?? item.custom_name ?? 'Item avulso'}
                  </p>
                  {item.notes && <p className="text-xs text-slate/50 mt-0.5">{item.notes}</p>}
                </div>
                <div className="text-right shrink-0 ml-4">
                  <p className="text-sm font-bold text-slate">{item.quantity}x</p>
                  <p className="text-xs text-[#D4AF37] font-semibold">{formatCurrency(item.unit_price * item.quantity)}</p>
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* ── Financeiro ── */}
      <Section title="Financeiro" icon={Banknote}>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 rounded-xl bg-white border border-slate/10 text-center">
            <p className="text-[11px] font-bold text-slate/40 uppercase mb-1">Valor total</p>
            <p className="text-xl font-extrabold text-[#D4AF37]">{formatCurrency(event.total_value)}</p>
          </div>
          <div className="p-3 rounded-xl bg-white border border-slate/10 text-center">
            <p className="text-[11px] font-bold text-slate/40 uppercase mb-1">Sinal pago</p>
            <p className="text-xl font-extrabold text-green-600">{formatCurrency(event.deposit_value)}</p>
          </div>
          <div className="col-span-2 p-3 rounded-xl bg-white border border-slate/10 text-center">
            <p className="text-[11px] font-bold text-slate/40 uppercase mb-1">Saldo a receber</p>
            <p className={`text-xl font-extrabold ${balance > 0 ? 'text-red-500' : 'text-green-600'}`}>
              {formatCurrency(balance)}
            </p>
          </div>
        </div>
        {event.payment_method && (
          <Field label="Forma de pagamento" value={{ pix: 'Pix', cartao: 'Cartão', dinheiro: 'Dinheiro', transferencia: 'Transferência' }[event.payment_method]} />
        )}
        {event.deposit_paid_at && (
          <Field label="Data do sinal" value={new Date(event.deposit_paid_at + 'T12:00:00').toLocaleDateString('pt-BR')} />
        )}
      </Section>

      {/* ── Notas internas ── */}
      {event.internal_notes && (
        <Section title="Notas internas" icon={ClipboardList}>
          <p className="text-sm text-slate/70 whitespace-pre-wrap">{event.internal_notes}</p>
        </Section>
      )}
    </div>
  )
}
