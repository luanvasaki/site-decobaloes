import Link from 'next/link'

// notFound() dentro do painel (ex. produto/evento excluído) — tom utilitário,
// igual ao error.tsx do admin, sem o menu do site público
export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center text-center py-24 px-4">
      <h1 className="text-xl font-bold text-[#1E293B] mb-2">Registro não encontrado</h1>
      <p className="text-slate/70 text-sm mb-6">Ele pode ter sido excluído, ou o endereço está incorreto.</p>
      <Link
        href="/admin"
        className="px-5 py-2.5 rounded-xl bg-[#1E293B] text-white font-bold text-sm hover:bg-slate-700 transition-colors"
      >
        Voltar ao painel
      </Link>
    </div>
  )
}
