'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Image from 'next/image'
import {
  LayoutDashboard,
  Package,
  Tag,
  Images,
  LogOut,
  ChevronRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const links = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/produtos', label: 'Produtos', icon: Package },
  { href: '/admin/categorias', label: 'Categorias', icon: Tag },
  { href: '/admin/galeria', label: 'Galeria', icon: Images },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <aside className="hidden md:flex w-64 shrink-0 bg-[#1E293B] min-h-screen flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <Link href="/admin" className="flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="Decobalões"
            width={36}
            height={36}
            className="h-9 w-9 object-contain"
          />
          <span className="text-base font-extrabold text-white">
            Deco<span className="text-[#D4AF37]">balões</span>
          </span>
        </Link>
        <p className="text-xs text-slate-400 mt-1 ml-10">Administração</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {links.map((link) => {
            const isActive = link.exact
              ? pathname === link.href
              : pathname.startsWith(link.href)

            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 group',
                    isActive
                      ? 'bg-[#F9A8D4]/20 text-[#F9A8D4]'
                      : 'text-slate-400 hover:bg-white/5 hover:text-white'
                  )}
                >
                  <link.icon className="w-4 h-4 shrink-0" />
                  {link.label}
                  {isActive && (
                    <ChevronRight className="w-3 h-3 ml-auto text-[#F9A8D4]" />
                  )}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-white/10">
        <Link
          href="/"
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-slate-400 hover:text-white transition-colors mb-2"
          target="_blank"
        >
          Ver site público
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200"
        >
          <LogOut className="w-4 h-4" />
          Sair
        </button>
      </div>
    </aside>
  )
}
