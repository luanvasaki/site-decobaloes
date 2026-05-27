import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import {
  Package, Tag, TrendingUp, CalendarDays,
  AlertCircle, CheckCircle2, Clock, Plus,
} from 'lucide-react'
import { EventCalendar } from '@/components/admin/EventCalendar'
import { formatCurrency } from '@/lib/utils'
import {
  getUpcomingEvents, getMonthlyRevenue,
  getRevenueByCategory, getEventsForMonth,
} from '@/services/events'
import type { Event } from '@/types'

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
const PAYMENT_LABEL: Record<string, string> = {
  pendente: 'Pendente', parcial: 'Sinal pago', pago: 'Pago',
}
const MONTH_NAMES = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez']

async function getDashboardData() {
  const supabase = await createClient()
  const now = new Date()
  const y = now.getFullYear()
  const m = now.getMonth() + 1
  const firstOfMonth = `${y}-${String(m).padStart(2,'0')}-01`
  const lastOfMonth  = `${y}-${String(m).padStart(2,'0')}-${new Date(y, m, 0).getDate()}`

  const [
    { count: totalProducts },
    { count: totalCategories },
    { data: monthEvents },
    upcoming,
    monthlyRevenue,
    revenueByCategory,
    calendarEvents,
  ] = await Promise.all([
    supabase.from('products').select('*', { count: 'exact', head: true }),
    supabase.from('categories').select('*', { count: 'exact', head: true }),
    supabase.from('events')
      .select('total_value, deposit_value, payment_status, status')
      .gte('event_date', firstOfMonth)
      .lte('event_date', lastOfMonth),
    getUpcomingEvents(6),
    getMonthlyRevenue(),
    getRevenueByCategory(),
    getEventsForMonth(y, m),
  ])

  const monthEventsArr = monthEvents ?? []
  const monthRevenue    = monthEventsArr.filter(e => e.status === 'concluido').reduce((s, e) => s + Number(e.total_value), 0)
  const monthConfirmed  = monthEventsArr.filter(e => ['confirmado','em_andamento','concluido'].includes(e.status)).length
  const pendingPayments = monthEventsArr
    .filter(e => e.payment_status !== 'pago' && e.status !== 'cancelado')
    .reduce((s, e) => s + (Number(e.total_value) - Number(e.deposit_value)), 0)

  return {
    totalProducts:    totalProducts ?? 0,
    totalCategories:  totalCategories ?? 0,
    monthRevenue,
    monthConfirmed,
    pendingPayments,
    upcoming,
    monthlyRevenue,
    revenueByCategory,
    calendarEvents,
  }
}

export default async function AdminDashboardPage() {
  const d = await getDashboardData()
  const maxRevenue = Math.max(...d.monthlyRevenue.map(r => r.revenue), 1)

  return (
    <div className="p-4 md:p-8 space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-[#1E293B]">Dashboard</h1>
        <p className="text-slate/50 text-sm mt-1">Visão geral do negócio</p>
      </div>

      {/* ── KPIs ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Receita do mês', value: formatCurrency(d.monthRevenue), icon: TrendingUp, color: 'bg-green-50 text-green-600', sub: 'eventos concluídos' },
          { label: 'Eventos confirmados', value: d.monthConfirmed, icon: CalendarDays, color: 'bg-blue-50 text-blue-600', sub: 'este mês' },
          { label: 'A receber', value: formatCurrency(d.pendingPayments), icon: AlertCircle, color: 'bg-yellow-50 text-yellow-600', sub: 'pagamentos pendentes' },
          { label: 'Produtos', value: d.totalProducts, icon: Package, color: 'bg-purple-50 text-purple-600', sub: `${d.totalCategories} categorias` },
        ].map((card) => (
          <div key={card.label} className="bg-white rounded-2xl shadow-card p-5 flex items-start gap-4">
            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${card.color}`}>
              <card.icon className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <p className="text-xl font-extrabold text-[#1E293B] leading-none">{card.value}</p>
              <p className="text-xs text-slate/50 font-medium mt-1">{card.label}</p>
              <p className="text-[10px] text-slate/35 mt-0.5">{card.sub}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* ── Calendário ── */}
        <div className="xl:col-span-2">
          <EventCalendar events={d.calendarEvents as Event[]} />
        </div>

        {/* ── Próximos eventos ── */}
        <div className="bg-white rounded-2xl shadow-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-extrabold text-[#1E293B]">Próximos eventos</h3>
            <Link href="/admin/eventos" className="text-xs text-slate/40 hover:text-slate transition-colors">Ver todos</Link>
          </div>
          {d.upcoming.length === 0 ? (
            <p className="text-sm text-slate/40 text-center py-6">Nenhum evento agendado</p>
          ) : (
            <div className="space-y-3">
              {d.upcoming.map((ev) => (
                <Link key={ev.id} href={`/admin/eventos/${ev.id}`}
                  className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors group"
                >
                  <div className="shrink-0 text-center bg-primary-50 rounded-xl px-2.5 py-1.5 min-w-[44px]">
                    <p className="text-base font-extrabold text-[#1E293B] leading-none">
                      {new Date(ev.event_date + 'T12:00:00').getDate()}
                    </p>
                    <p className="text-[10px] text-slate/50 font-bold uppercase">
                      {MONTH_NAMES[new Date(ev.event_date + 'T12:00:00').getMonth()]}
                    </p>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-slate truncate group-hover:text-[#D4AF37] transition-colors">
                      {ev.client_name}
                    </p>
                    <p className="text-xs text-slate/50 truncate">{ev.categories?.name ?? 'Evento'} · {ev.event_time ?? '–'}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${STATUS_STYLE[ev.status]}`}>
                        {STATUS_LABEL[ev.status]}
                      </span>
                      <span className={`text-[10px] font-semibold ${PAYMENT_STYLE[ev.payment_status]}`}>
                        {PAYMENT_LABEL[ev.payment_status]}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
          <Link
            href="/admin/eventos/novo"
            className="mt-4 flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border-2 border-dashed border-[#F9A8D4]/50 text-sm font-bold text-[#F9A8D4] hover:border-[#F9A8D4] hover:bg-[#fdf2f8] transition-all"
          >
            <Plus className="w-4 h-4" /> Novo evento
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* ── Receita mensal (últimos 6 meses) ── */}
        <div className="bg-white rounded-2xl shadow-card p-5">
          <h3 className="font-extrabold text-[#1E293B] mb-5">Receita mensal (concluídos)</h3>
          {d.monthlyRevenue.length === 0 ? (
            <p className="text-sm text-slate/40 text-center py-8">Nenhum evento concluído ainda</p>
          ) : (
            <div className="flex items-end gap-2 h-36">
              {d.monthlyRevenue.map(({ month, revenue }) => {
                const pct = (revenue / maxRevenue) * 100
                const [, mm] = month.split('-')
                return (
                  <div key={month} className="flex-1 flex flex-col items-center gap-1 group">
                    <span className="text-[10px] text-slate/50 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                      {formatCurrency(revenue)}
                    </span>
                    <div className="w-full bg-primary-50 rounded-t-lg overflow-hidden" style={{ height: '80px' }}>
                      <div
                        className="w-full bg-[#F9A8D4] rounded-t-lg transition-all duration-700 mt-auto"
                        style={{ height: `${pct}%`, marginTop: `${100 - pct}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-bold text-slate/50">{MONTH_NAMES[parseInt(mm) - 1]}</span>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* ── Receita por tipo de evento ── */}
        <div className="bg-white rounded-2xl shadow-card p-5">
          <h3 className="font-extrabold text-[#1E293B] mb-5">Por tipo de evento</h3>
          {d.revenueByCategory.length === 0 ? (
            <p className="text-sm text-slate/40 text-center py-8">Nenhum dado ainda</p>
          ) : (
            <div className="space-y-3">
              {d.revenueByCategory.slice(0, 6).map(({ name, revenue, count }, i) => {
                const maxCat = d.revenueByCategory[0].revenue
                const pct = (revenue / maxCat) * 100
                return (
                  <div key={name}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-semibold text-slate flex items-center gap-2">
                        {i === 0 && <span className="text-xs">🏆</span>}
                        {name}
                        <span className="text-xs text-slate/40 font-normal">{count}x</span>
                      </span>
                      <span className="text-sm font-extrabold text-[#D4AF37]">{formatCurrency(revenue)}</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#F9A8D4] to-[#D4AF37] rounded-full transition-all duration-700"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* ── Ações rápidas ── */}
      <div className="bg-white rounded-2xl shadow-card p-5">
        <h3 className="font-bold text-[#1E293B] mb-4">Ações rápidas</h3>
        <div className="flex flex-wrap gap-3">
          {[
            { href: '/admin/eventos/novo',     label: '+ Novo evento',    style: 'bg-[#F9A8D4] text-[#1E293B] hover:bg-pink-300' },
            { href: '/admin/produtos/novo',    label: '+ Novo produto',   style: 'border border-slate/15 text-slate hover:bg-slate-50' },
            { href: '/admin/categorias/nova',  label: '+ Nova categoria', style: 'border border-slate/15 text-slate hover:bg-slate-50' },
            { href: '/', label: 'Ver site ↗', style: 'border border-slate/15 text-slate hover:bg-slate-50', target: '_blank' },
          ].map((a) => (
            <a key={a.href} href={a.href} target={(a as { target?: string }).target}
              className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-colors ${a.style}`}
            >
              {a.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
