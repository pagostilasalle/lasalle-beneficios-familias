'use client'

import { useEffect, useState } from 'react'
import { adminApi } from '@/lib/adminApi'
import type { Category } from '@/lib/types'
import { slugify } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export default function AdminCategoriasPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [nuevoNombre, setNuevoNombre] = useState('')

  const load = async () => {
    try {
      setCategories(await adminApi.list<Category>('categories'))
    } catch (e: any) {
      alert(e.message)
    }
  }

  useEffect(() => { load() }, [])

  const crear = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!nuevoNombre.trim()) return
    try {
      await adminApi.create('categories', {
        name: nuevoNombre,
        slug: slugify(nuevoNombre),
        sort_order: categories.length + 1,
      })
      setNuevoNombre('')
    } catch (e: any) {
      alert(e.message)
    }
    load()
  }

  const toggleActivo = async (c: Category) => {
    try {
      await adminApi.update('categories', c.id, { active: !c.active })
    } catch (e: any) {
      alert(e.message)
    }
    load()
  }

  const mover = async (index: number, direccion: -1 | 1) => {
    const destino = index + direccion
    if (destino < 0 || destino >= categories.length) return
    const a = categories[index]
    const b = categories[destino]
    try {
      await adminApi.update('categories', a.id, { sort_order: b.sort_order })
      await adminApi.update('categories', b.id, { sort_order: a.sort_order })
    } catch (e: any) {
      alert(e.message)
    }
    load()
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-marino">Rubros</h1>
      <p className="text-gray-500 text-sm max-w-xl">
        Los rubros son compartidos entre las dos comunidades (Familias y Docentes). Un rubro solo
        aparece en /convenios de cada comunidad si tiene al menos un convenio activo de esa comunidad.
      </p>

      <form onSubmit={crear} className="flex gap-3 max-w-md">
        <input
          placeholder="Nuevo rubro (ej: Salud)"
          value={nuevoNombre}
          onChange={(e) => setNuevoNombre(e.target.value)}
          className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-[#1e2a65] outline-none"
        />
        <button className="bg-naranja hover:bg-naranjaHover text-white px-5 py-2.5 rounded-xl font-medium">
          Agregar
        </button>
      </form>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 divide-y divide-gray-100">
        {categories.map((c, i) => (
          <div key={c.id} className="flex items-center justify-between px-6 py-4">
            <span className="font-medium text-marino">{c.name}</span>
            <div className="flex items-center gap-3">
              <button onClick={() => mover(i, -1)} className="text-gray-400 hover:text-marino text-sm">↑</button>
              <button onClick={() => mover(i, 1)} className="text-gray-400 hover:text-marino text-sm">↓</button>
              <button
                onClick={() => toggleActivo(c)}
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  c.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                }`}
              >
                {c.active ? 'Activo' : 'Inactivo'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
