'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import type { Category } from '@/lib/types'
import { slugify } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export default function AdminCategoriasPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [nuevoNombre, setNuevoNombre] = useState('')

  const load = async () => {
    const { data } = await supabase.from('categories').select('*').order('sort_order')
    setCategories((data as Category[]) ?? [])
  }

  useEffect(() => { load() }, [])

  const crear = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!nuevoNombre.trim()) return
    await supabase.from('categories').insert({
      name: nuevoNombre,
      slug: slugify(nuevoNombre),
      sort_order: categories.length + 1,
    })
    setNuevoNombre('')
    load()
  }

  const toggleActivo = async (c: Category) => {
    await supabase.from('categories').update({ active: !c.active }).eq('id', c.id)
    load()
  }

  const mover = async (index: number, direccion: -1 | 1) => {
    const destino = index + direccion
    if (destino < 0 || destino >= categories.length) return
    const a = categories[index]
    const b = categories[destino]
    await supabase.from('categories').update({ sort_order: b.sort_order }).eq('id', a.id)
    await supabase.from('categories').update({ sort_order: a.sort_order }).eq('id', b.id)
    load()
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-marino">Rubros</h1>
      <p className="text-gray-500 text-sm max-w-xl">
        Los rubros inactivos no se muestran en el sitio público, aunque tengan convenios cargados.
        Un rubro activo solo aparece en /convenios si tiene al menos un convenio activo.
      </p>

      <form onSubmit={crear} className="flex gap-3 max-w-md">
        <input
          placeholder="Nuevo rubro (ej: Salud)"
          value={nuevoNombre}
          onChange={(e) => setNuevoNombre(e.target.value)}
          className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-[#1B2A6B] outline-none"
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
