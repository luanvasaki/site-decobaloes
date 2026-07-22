'use client'

import Link from 'next/link'

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <span className="text-6xl mb-6">🎈</span>
      <h1 className="text-3xl font-extrabold text-[#1E293B] mb-2">Ops, algo deu errado por aqui</h1>
      <p className="text-slate/60 mb-8">Não conseguimos carregar esta página agora. Tente novamente em instantes.</p>
      <div className="flex gap-3">
        <button
          onClick={reset}
          className="px-6 py-3 rounded-2xl bg-[#F9A8D4] text-[#1E293B] font-bold hover:bg-pink-300 transition-colors"
        >
          Tentar novamente
        </button>
        <Link
          href="/"
          className="px-6 py-3 rounded-2xl border border-slate/15 text-slate font-semibold hover:bg-slate-50 transition-colors"
        >
          Voltar ao início
        </Link>
      </div>
    </div>
  )
}
