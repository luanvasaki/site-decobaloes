export const dynamic = 'force-dynamic'

import { AdminSidebar } from '@/components/admin/AdminSidebar'
import { AdminMobileNav } from '@/components/admin/AdminMobileNav'
import { AdminMobileHeader } from '@/components/admin/AdminMobileHeader'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <AdminSidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminMobileHeader />

        <main className="flex-1 overflow-auto pb-28 md:pb-0" style={{ WebkitOverflowScrolling: 'touch' }}>{children}</main>
      </div>

      <AdminMobileNav />
    </div>
  )
}
