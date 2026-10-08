'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function AdminMobileHeader() {
  const pathname = usePathname()

  // A tela de login fica em tela cheia, sem o cabeçalho do painel
  if (pathname === '/admin/login') return null

  return (
    <header className="md:hidden flex items-center gap-2 px-4 h-14 bg-[#1E293B] shrink-0">
      <Link href="/admin" className="flex items-center gap-2">
        <Image
          src="/logo.png"
          alt="Decobalões"
          width={32}
          height={32}
          className="h-8 w-8 object-contain"
        />
        <span className="text-base font-extrabold text-white">
          Deco<span className="text-[#D4AF37]">balões</span>
        </span>
      </Link>
    </header>
  )
}
