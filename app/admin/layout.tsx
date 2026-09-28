import AdminHeader from '@/components/AdminHeader'
import AdminAuthGuard from '@/components/AdminAuthGuard'

export const dynamic = 'force-dynamic'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminAuthGuard>
      <AdminHeaderWrapper />
      <div className="max-w-6xl mx-auto px-4 py-8">{children}</div>
    </AdminAuthGuard>
  )
}

function AdminHeaderWrapper() {
  return <AdminHeader />
}
