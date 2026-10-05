'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

const links = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/convenios', label: 'Convenios' },
  { href: '/admin/categorias', label: 'Rubros' },
  { href: '/admin/preguntas-frecuentes', label: 'FAQ' },
  { href: '/admin/mensajes', label: 'Mensajes' },
]

export default function AdminHeader() {
  const pathname = usePathname()
  const router = useRouter()

  const logout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' })
    router.push('/admin/login')
  }

  return (
    <header className="bg-marino text-white">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <nav className="flex items-center gap-1 overflow-x-auto">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`px-3 py-2 rounded-xl text-sm whitespace-nowrap ${
                pathname === l.href ? 'bg-white/15 font-semibold' : 'hover:bg-white/10'
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <button onClick={logout} className="text-sm text-white/70 hover:text-white">
          Salir
        </button>
      </div>
    </header>
  )
}
