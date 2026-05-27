'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Event } from '@/types'

const STATUS_DOT: Record<string, string> = {
  orcamento:    'bg-slate-400',
  confirmado:   'bg-blue-500',
  em_andamento: 'bg-yellow-500',
  concluido:    'bg-green-500',
  cancelado:    'bg-red-400',
}

const MONTH_NAMES = [
  'Janeiro','Fevereiro','Março','Abril','Maio','Junho',
  'Julho','Agosto','Setembro','Outubro','Novembro','Dezembro',
]
const WEEK_DAYS = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb']

interface EventCalendarProps {
  events: Event[]
}

export function EventCalendar({ events }: EventCalendarProps) {
  const today = new Date()
  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())

  function prev() {
    if (month === 0) { setMonth(11); setYear(y => y - 1) }
    else setMonth(m => m - 1)
  }
  function next() {
    if (month === 11) { setMonth(0); setYear(y => y + 1) }
    else setMonth(m => m + 1)
  }

  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const eventsByDay: Record<number, Event[]> = {}
  for (const ev of events) {
    const d = new Date(ev.event_date + 'T12:00:00')
    if (d.getFullYear() === year && d.getMonth() === month) {
      const day = d.getDate()
      if (!eventsByDay[day]) eventsByDay[day] = []
      eventsByDay[day].push(ev)
    }
  }

  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]
  while (cells.length % 7 !== 0) cells.push(null)

  const isToday = (d: number) =>
    d === today.getDate() && month === today.getMonth() && year === today.getFullYear()

  return (
    <div className="bg-white rounded-2xl shadow-card p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-extrabold text-[#1E293B]">
          {MONTH_NAMES[month]} {year}
        </h3>
        <div className="flex gap-1">
          <button onClick={prev} className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors">
            <ChevronLeft className="w-4 h-4 text-slate/60" />
          </button>
          <button onClick={next} className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors">
            <ChevronRight className="w-4 h-4 text-slate/60" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 mb-1">
        {WEEK_DAYS.map((d) => (
          <div key={d} className="text-center text-[10px] font-bold text-slate/30 uppercase py-1">{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-0.5">
        {cells.map((day, i) => {
          if (!day) return <div key={i} />
          const dayEvents = eventsByDay[day] ?? []
          return (
            <div
              key={i}
              className={cn(
                'min-h-[52px] p-1 rounded-lg flex flex-col',
                isToday(day) ? 'bg-[#F9A8D4]/20 ring-2 ring-[#F9A8D4]' : 'hover:bg-slate-50',
                dayEvents.length > 0 && !isToday(day) && 'bg-blue-50'
              )}
            >
              <span className={cn(
                'text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full mb-0.5',
                isToday(day) ? 'bg-[#F9A8D4] text-[#1E293B]' : 'text-slate/60'
              )}>
                {day}
              </span>
              <div className="flex flex-col gap-0.5">
                {dayEvents.slice(0, 2).map((ev) => (
                  <Link
                    key={ev.id}
                    href={`/admin/eventos/${ev.id}`}
                    className="block text-[9px] leading-tight truncate px-1 py-0.5 rounded bg-white shadow-sm border border-slate/10 hover:border-[#F9A8D4] transition-colors"
                    title={ev.client_name}
                  >
                    <span className={cn('inline-block w-1.5 h-1.5 rounded-full mr-0.5', STATUS_DOT[ev.status] ?? 'bg-slate-400')} />
                    {ev.client_name.split(' ')[0]}
                  </Link>
                ))}
                {dayEvents.length > 2 && (
                  <span className="text-[9px] text-slate/40 pl-1">+{dayEvents.length - 2}</span>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-4 pt-3 border-t border-slate/8">
        {Object.entries({ confirmado: 'Confirmado', em_andamento: 'Em andamento', concluido: 'Concluído', orcamento: 'Orçamento', cancelado: 'Cancelado' }).map(([k, v]) => (
          <span key={k} className="flex items-center gap-1 text-[10px] text-slate/50">
            <span className={cn('w-2 h-2 rounded-full', STATUS_DOT[k])} />{v}
          </span>
        ))}
      </div>
    </div>
  )
}
