import Link from 'next/link'
import { Plus, Search } from 'lucide-react'
import { getEvents } from '@/services/events'
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
const PAYMENT_STYLE: Record<string, string> = {
  pendente: 'text-red-500', parcial: 'text-yellow-600', pago: 'text-green-600',
}

export default async function AdminEventosPage() {
  const events = await getEvents()

  const upcoming = events.filter(e =>
    new Date(e.event_date) >= new Date() && e.status !== 'cancelado'
  )
  const past = events.filter(e =>
    new Date(e.event_date) < new Date() || e.status === 'cancelado'
  )

  function EventRow({ ev }: { ev: typeof events[0] }) {
    const date = new Date(ev.event_date + 'T12:00:00')
    return (
      <Link
        href={`/admin/eventos/${ev.id}`}
        className="flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors rounded-xl group"
      >
        <div className="shrink-0 text-center bg-primary-50 rounded-xl px-3 py-2 w-14">
          <p className="text-lg font-extrabold text-[#1E293B] leading-none">
            {date.getDate().toString().padStart(2,'0')}
          </p>
          <p className="text-[10px] text-slate/50 font-bold uppercase">
            {date.toLocaleString('pt-BR', { month: 'short' })}
          </p>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-bold text-slate text-sm group-hover:text-[#D4AF37] transition-colors truncate">
              {ev.client_name}
            </p>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${STATUS_STYLE[ev.status]}`}>
              {STATUS_LABEL[ev.status]}
            </span>
          </div>
          <p className="text-xs text-slate/50 mt-0.5">
            {ev.categories?.name ?? 'Evento'}{ev.event_time ? ` · ${ev.event_time.slice(0,5)}` : ''}{ev.location_name ? ` · ${ev.location_name}` : ''}
          </p>
          <p className="text-xs text-slate/40 mt-0.5">{ev.client_phone}</p>
        </div>

        <div className="text-right shrink-0">
          <p className="text-sm font-extrabold text-[#D4AF37]">{formatCurrency(ev.total_value)}</p>
          <p className={`text-[10px] font-semibold mt-0.5 ${PAYMENT_STYLE[ev.payment_status]}`}>
            {ev.payment_status === 'pendente' ? 'Pagamento pendente'
              : ev.payment_status === 'parcial' ? 'Sinal pago'
              : '✓ Pago'}
          </p>
        </div>
      </Link>
    )
  }

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl md:text-2xl font-extrabold text-[#1E293B]">Eventos</h1>
          <p className="text-slate/50 text-sm mt-1">{events.length} evento(s) no total</p>
        </div>
        <Link
          href="/admin/eventos/novo"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#F9A8D4] text-[#1E293B] font-bold text-sm hover:bg-pink-300 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Novo evento</span>
          <span className="sm:hidden">Novo</span>
        </Link>
      </div>

      {events.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-card p-12 flex flex-col items-center gap-4 text-center">
          <Search className="w-12 h-12 text-slate/20" />
          <p className="font-bold text-slate/40">Nenhum evento cadastrado</p>
          <Link
            href="/admin/eventos/novo"
            className="px-6 py-2.5 rounded-xl bg-[#F9A8D4] text-[#1E293B] font-bold text-sm hover:bg-pink-300 transition-colors"
          >
            Criar primeiro evento
          </Link>
        </div>
      ) : (
        <>
          {upcoming.length > 0 && (
            <div className="bg-white rounded-2xl shadow-card overflow-hidden">
              <div className="px-5 py-4 border-b border-slate/[0.08]">
                <h2 className="font-bold text-[#1E293B] text-sm uppercase tracking-wide">Próximos eventos</h2>
              </div>
              <div className="divide-y divide-slate/5 px-1 py-2">
                {upcoming.map(ev => <EventRow key={ev.id} ev={ev} />)}
              </div>
            </div>
          )}

          {past.length > 0 && (
            <div className="bg-white rounded-2xl shadow-card overflow-hidden">
              <div className="px-5 py-4 border-b border-slate/[0.08]">
                <h2 className="font-bold text-slate/40 text-sm uppercase tracking-wide">Histórico</h2>
              </div>
              <div className="divide-y divide-slate/5 px-1 py-2">
                {past.map(ev => <EventRow key={ev.id} ev={ev} />)}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
