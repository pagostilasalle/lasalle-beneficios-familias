'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { usePathname } from 'next/navigation'

const navItems = [
  { href: '/', label: 'Inicio' },
  { href: '/convenios', label: 'Convenios' },
  { href: '/preguntas-frecuentes', label: 'Preguntas frecuentes' },
  { href: '/contacto', label: 'Contacto' },
]

export default function HeaderPublico() {
  const [menuAbierto, setMenuAbierto] = useState(false)
  const pathname = usePathname()

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo-lasalle.png" alt="La Salle" width={40} height={40} />
          <span className="hidden sm:block font-semibold text-marino text-sm leading-tight">
            Comunidad de<br />Beneficios
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const activo = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-2 rounded-xl text-sm transition-colors ${
                  activo
                    ? 'text-naranja bg-[#FFF3E0] font-semibold'
                    : 'text-marino hover:bg-fondo'
                }`}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>

        <button
          className="md:hidden p-2 rounded-xl hover:bg-fondo"
          onClick={() => setMenuAbierto(!menuAbierto)}
          aria-label="Abrir menú"
        >
          <span className="block w-6 h-0.5 bg-marino mb-1.5" />
          <span className="block w-6 h-0.5 bg-marino mb-1.5" />
          <span className="block w-6 h-0.5 bg-marino" />
        </button>
      </div>

      {menuAbierto && (
        <nav className="md:hidden border-t border-gray-100 bg-white px-4 py-3 flex flex-col gap-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMenuAbierto(false)}
              className={`px-4 py-3 rounded-xl text-sm ${
                pathname === item.href
                  ? 'text-naranja bg-[#FFF3E0] font-semibold'
                  : 'text-marino hover:bg-fondo'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  )
}
