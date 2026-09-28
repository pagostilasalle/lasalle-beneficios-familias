'use client'

import { usePathname } from 'next/navigation'
import HeaderPublico from '@/components/HeaderPublico'
import BotonScrollTop from '@/components/BotonScrollTop'

export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const esAdmin = pathname?.startsWith('/admin')

  if (esAdmin) {
    // El admin tiene su propio header (AdminHeader) definido en app/admin/layout.tsx
    return <>{children}</>
  }

  return (
    <>
      <HeaderPublico />
      <main className="flex-1">{children}</main>
      <footer className="bg-marino text-white/80 text-sm py-8 mt-16">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-2">
          <span>© {new Date().getFullYear()} Distrito La Salle Argentina-Paraguay</span>
          <span>Comunidad de Beneficios · Estudiantes y Familias</span>
        </div>
      </footer>
      <BotonScrollTop />
    </>
  )
}
