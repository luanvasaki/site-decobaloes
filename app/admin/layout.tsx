export const dynamic = 'force-dynamic'

import Image from 'next/image'
import Link from 'next/link'
import { AdminSidebar } from '@/components/admin/AdminSidebar'
import { AdminMobileNav } from '@/components/admin/AdminMobileNav'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <AdminSidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header mobile com logo */}
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

        <main className="flex-1 overflow-auto pb-16 md:pb-0">{children}</main>
      </div>

      <AdminMobileNav />
    </div>
  )
}
