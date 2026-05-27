import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <span className="text-6xl mb-6">🎈</span>
      <h1 className="text-3xl font-extrabold text-[#1E293B] mb-2">Página não encontrada</h1>
      <p className="text-slate/60 mb-8">Ops! Esta página não existe ou foi removida.</p>
      <Link
        href="/"
        className="px-6 py-3 rounded-2xl bg-[#F9A8D4] text-[#1E293B] font-bold hover:bg-pink-300 transition-colors"
      >
        Voltar ao início
      </Link>
    </div>
  )
}
