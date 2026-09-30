'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import type { Audience } from '@/lib/utils'
import { audienceLabel } from '@/lib/utils'

export default function HeaderPublico({ audience }: { audience: Audience }) {
  const [menuAbierto, setMenuAbierto] = useState(false)
  const pathname = usePathname()

  const base = `/${audience}`
  const navItems = [
    { href: base, label: 'Inicio' },
    { href: `${base}/convenios`, label: 'Convenios' },
    { href: `${base}/preguntas-frecuentes`, label: 'Preguntas frecuentes' },
    { href: `${base}/contacto`, label: 'Contacto' },
  ]

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href={base} className="flex items-center gap-2">
          <Image src="/logo-lasalle.png" alt="La Salle" width={110} height={60} className="h-9 w-auto" />
          <span className="hidden sm:block font-semibold text-marino text-xs leading-tight border-l border-gray-200 pl-2">
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
          <Link
            href="/"
            className="ml-2 px-3 py-2 rounded-xl text-xs text-gray-400 hover:text-marino border border-gray-200 hover:border-marino transition-colors"
          >
            Cambiar comunidad
          </Link>
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

      <div className="bg-fondo text-center text-[11px] text-marino/70 py-1">
        Estás viendo la comunidad de {audienceLabel(audience)}
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
          <Link
            href="/"
            onClick={() => setMenuAbierto(false)}
            className="px-4 py-3 rounded-xl text-sm text-gray-500 border-t border-gray-100 mt-1"
          >
            ← Cambiar comunidad
          </Link>
        </nav>
      )}
    </header>
  )
}
