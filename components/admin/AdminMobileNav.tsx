'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { LayoutDashboard, Package, Tag, Images, LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'

const links = [
  { href: '/admin',            label: 'Início',     icon: LayoutDashboard, exact: true },
  { href: '/admin/produtos',   label: 'Produtos',   icon: Package },
  { href: '/admin/categorias', label: 'Categorias', icon: Tag },
  { href: '/admin/galeria',    label: 'Galeria',    icon: Images },
]

export function AdminMobileNav() {
  const pathname = usePathname()
  const router = useRouter()

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate/10"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="flex items-stretch h-14">
        {links.map((link) => {
          const isActive = link.exact
            ? pathname === link.href
            : pathname.startsWith(link.href)
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'flex-1 flex flex-col items-center justify-center gap-0.5 text-[10px] font-semibold transition-colors',
                isActive ? 'text-[#F9A8D4]' : 'text-slate/40 hover:text-slate/70'
              )}
            >
              <link.icon className={cn('w-5 h-5', isActive && 'stroke-[2.5]')} />
              {link.label}
            </Link>
          )
        })}
        <button
          onClick={handleLogout}
          className="flex-1 flex flex-col items-center justify-center gap-0.5 text-[10px] font-semibold text-slate/30 hover:text-red-400 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Sair
        </button>
      </div>
    </nav>
  )
}
