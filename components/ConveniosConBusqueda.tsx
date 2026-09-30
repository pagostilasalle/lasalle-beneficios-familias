'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { normalizar, type Audience } from '@/lib/utils'
import type { Benefit, Category } from '@/lib/types'

type Props = {
  audience: Audience
  categories: Category[]
  benefits: Benefit[]
}

export default function ConveniosConBusqueda({ audience, categories, benefits }: Props) {
  const [busqueda, setBusqueda] = useState('')
  const [rubroActivo, setRubroActivo] = useState<string | 'todos'>('todos')
  const [abiertos, setAbiertos] = useState<Record<string, boolean>>({})

  const benefitsFiltrados = useMemo(() => {
    const q = normalizar(busqueda)
    return benefits.filter((b) => {
      const matchTexto =
        !q ||
        normalizar(b.title).includes(q) ||
        normalizar(b.company_name).includes(q) ||
        normalizar(b.short_description).includes(q)
      const matchRubro = rubroActivo === 'todos' || b.category_id === rubroActivo
      return matchTexto && matchRubro && b.status === 'active'
    })
  }, [busqueda, rubroActivo, benefits])

  const rubrosConConvenios = useMemo(() => {
    return categories
      .filter((c) => c.active)
      .filter((c) => benefitsFiltrados.some((b) => b.category_id === c.id))
      .sort((a, b) => a.sort_order - b.sort_order)
  }, [categories, benefitsFiltrados])

  const toggleRubro = (id: string) =>
    setAbiertos((prev) => ({ ...prev, [id]: !prev[id] }))

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="text"
          placeholder="Buscar convenio o empresa..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="flex-1 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#1B2A6B] outline-none"
        />
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => setRubroActivo('todos')}
          className={`px-4 py-2 rounded-xl text-sm border transition-colors ${
            rubroActivo === 'todos'
              ? 'bg-marino text-white border-marino'
              : 'bg-white text-marino border-gray-200 hover:bg-fondo'
          }`}
        >
          Todos
        </button>
        {categories
          .filter((c) => c.active)
          .sort((a, b) => a.sort_order - b.sort_order)
          .map((c) => (
            <button
              key={c.id}
              onClick={() => setRubroActivo(c.id)}
              className={`px-4 py-2 rounded-xl text-sm border transition-colors ${
                rubroActivo === c.id
                  ? 'bg-marino text-white border-marino'
                  : 'bg-white text-marino border-gray-200 hover:bg-fondo'
              }`}
            >
              {c.name}
            </button>
          ))}
      </div>

      {rubrosConConvenios.length === 0 && (
        <p className="text-gray-500 text-center py-12">
          No encontramos convenios que coincidan con tu búsqueda.
        </p>
      )}

      <div className="flex flex-col gap-4">
        {rubrosConConvenios.map((rubro) => {
          const items = benefitsFiltrados.filter((b) => b.category_id === rubro.id)
          const abierto = abiertos[rubro.id] ?? true

          return (
            <div
              key={rubro.id}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
            >
              <button
                onClick={() => toggleRubro(rubro.id)}
                className="w-full flex items-center justify-between px-6 py-4 text-left"
              >
                <span className="font-semibold text-marino text-lg">
                  {rubro.name}{' '}
                  <span className="text-sm font-normal text-gray-400">
                    ({items.length})
                  </span>
                </span>
                <span className="text-marino">{abierto ? '−' : '+'}</span>
              </button>

              {abierto && (
                <div className="px-6 pb-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {items.map((b) => (
                    <Link
                      key={b.id}
                      href={`/${audience}/convenios/${b.slug}`}
                      className="border border-gray-100 rounded-2xl p-4 hover:shadow-md transition-shadow bg-white flex flex-col gap-2"
                    >
                      <div className="flex items-center gap-3">
                        {b.logo_url ? (
                          <Image
                            src={b.logo_url}
                            alt={b.company_name}
                            width={40}
                            height={40}
                            className="rounded-xl object-contain"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-xl bg-fondo flex items-center justify-center text-marino font-semibold">
                            {b.company_name.charAt(0)}
                          </div>
                        )}
                        <div>
                          <p className="font-semibold text-marino text-sm leading-tight">
                            {b.company_name}
                          </p>
                          {b.is_new && (
                            <span className="inline-block mt-1 text-[10px] uppercase tracking-wide bg-naranja text-white px-2 py-0.5 rounded-full">
                              Nuevo
                            </span>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {b.short_description}
                      </p>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
