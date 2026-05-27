import { createClient } from '@/lib/supabase/server'
import type { Event } from '@/types'

const EVENT_SELECT = `
  *,
  categories(id, name, slug),
  event_items(*, products(id, name, slug))
`

export async function getEvents(): Promise<Event[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('events')
    .select(EVENT_SELECT)
    .order('event_date', { ascending: true })
  if (error) { console.error('[events] getEvents:', error); return [] }
  return (data as Event[]) ?? []
}

export async function getEventById(id: string): Promise<Event | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('events')
    .select(EVENT_SELECT)
    .eq('id', id)
    .single()
  if (error) { console.error('[events] getEventById:', error); return null }
  return data as Event
}

export async function getUpcomingEvents(limit = 5): Promise<Event[]> {
  const supabase = await createClient()
  const today = new Date().toISOString().split('T')[0]
  const { data, error } = await supabase
    .from('events')
    .select(EVENT_SELECT)
    .gte('event_date', today)
    .not('status', 'in', '("cancelado")')
    .order('event_date', { ascending: true })
    .limit(limit)
  if (error) { console.error('[events] getUpcomingEvents:', error); return [] }
  return (data as Event[]) ?? []
}

export async function getEventsForMonth(year: number, month: number): Promise<Event[]> {
  const supabase = await createClient()
  const from = `${year}-${String(month).padStart(2, '0')}-01`
  const lastDay = new Date(year, month, 0).getDate()
  const to = `${year}-${String(month).padStart(2, '0')}-${lastDay}`
  const { data, error } = await supabase
    .from('events')
    .select('id, event_date, client_name, status, total_value')
    .gte('event_date', from)
    .lte('event_date', to)
    .order('event_date', { ascending: true })
  if (error) { console.error('[events] getEventsForMonth:', error); return [] }
  return (data as Event[]) ?? []
}

export async function getMonthlyRevenue(): Promise<{ month: string; revenue: number }[]> {
  const supabase = await createClient()
  const sixMonthsAgo = new Date()
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5)
  sixMonthsAgo.setDate(1)

  const { data, error } = await supabase
    .from('events')
    .select('event_date, total_value')
    .eq('status', 'concluido')
    .gte('event_date', sixMonthsAgo.toISOString().split('T')[0])

  if (error) { console.error('[events] getMonthlyRevenue:', error); return [] }

  const map: Record<string, number> = {}
  for (const row of data ?? []) {
    const key = row.event_date.slice(0, 7)
    map[key] = (map[key] ?? 0) + Number(row.total_value)
  }

  return Object.entries(map)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, revenue]) => ({ month, revenue }))
}

export async function getRevenueByCategory(): Promise<{ name: string; revenue: number; count: number }[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('events')
    .select('total_value, categories(name)')
    .eq('status', 'concluido')

  if (error) { console.error('[events] getRevenueByCategory:', error); return [] }

  const map: Record<string, { revenue: number; count: number }> = {}
  for (const row of data ?? []) {
    const name = (row.categories as unknown as { name: string } | null)?.name ?? 'Sem categoria'
    if (!map[name]) map[name] = { revenue: 0, count: 0 }
    map[name].revenue += Number(row.total_value)
    map[name].count += 1
  }

  return Object.entries(map)
    .map(([name, v]) => ({ name, ...v }))
    .sort((a, b) => b.revenue - a.revenue)
}
