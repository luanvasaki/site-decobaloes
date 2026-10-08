import Link from 'next/link'

export function NotFoundMessage() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 pt-28 pb-20">
      <span className="text-6xl mb-6">🎈</span>
      <h1 className="text-3xl font-extrabold text-[#1E293B] mb-2">Página não encontrada</h1>
      <p className="text-slate/70 mb-8 max-w-sm">
        Ops! Esta página não existe ou foi removida. Que tal ver nossas decorações?
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          href="/catalogo"
          className="px-6 py-3 rounded-2xl bg-[#F9A8D4] text-[#1E293B] font-bold hover:bg-pink-300 transition-colors"
        >
          Ver catálogo
        </Link>
        <Link
          href="/galeria"
          className="px-6 py-3 rounded-2xl border border-slate/15 text-slate font-semibold hover:bg-slate-50 transition-colors"
        >
          Ver galeria de fotos
        </Link>
        <Link
          href="/"
          className="px-6 py-3 text-slate/70 font-semibold hover:text-slate transition-colors"
        >
          Voltar ao início
        </Link>
      </div>
    </div>
  )
}
