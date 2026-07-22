'use client'

import Link from 'next/link'

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-24 px-4">
      <h1 className="text-xl font-bold text-[#1E293B] mb-2">Algo deu errado ao carregar esta página</h1>
      <p className="text-slate/60 text-sm mb-6">Tente novamente, ou volte para o painel se o problema continuar.</p>
      <div className="flex gap-3">
        <button
          onClick={reset}
          className="px-5 py-2.5 rounded-xl bg-[#1E293B] text-white font-bold text-sm hover:bg-slate-700 transition-colors"
        >
          Tentar novamente
        </button>
        <Link
          href="/admin"
          className="px-5 py-2.5 rounded-xl border border-slate/15 text-slate font-semibold text-sm hover:bg-slate-50 transition-colors"
        >
          Voltar ao início
        </Link>
      </div>
    </div>
  )
}
