import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { getEventById } from '@/services/events'
import { getCategories } from '@/services/categories'
import { getProducts } from '@/services/products'
import { EventForm } from '@/components/admin/EventForm'

export default async function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [event, categories, products] = await Promise.all([
    getEventById(id),
    getCategories(),
    getProducts(),
  ])
  if (!event) notFound()

  return (
    <div className="p-4 md:p-8">
      <div className="mb-8">
        <Link
          href={`/admin/eventos/${id}`}
          className="inline-flex items-center gap-1 text-sm text-slate/50 hover:text-slate mb-4 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" /> Voltar
        </Link>
        <h1 className="text-2xl font-extrabold text-[#1E293B]">Editar evento</h1>
        <p className="text-slate/50 text-sm mt-1">{event.client_name}</p>
      </div>
      <div className="bg-white rounded-2xl shadow-card p-6">
        <EventForm categories={categories} products={products} event={event} />
      </div>
    </div>
  )
}
