'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { adminApi } from '@/lib/adminApi'
import type { Benefit, Category } from '@/lib/types'
import { normalizar, audienceLabel, type Audience } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export default function AdminConveniosPage() {
  const [benefits, setBenefits] = useState<(Benefit & { category?: Category })[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [busqueda, setBusqueda] = useState('')
  const [filtroEstado, setFiltroEstado] = useState<'todos' | 'active' | 'inactive'>('todos')
  const [filtroRubro, setFiltroRubro] = useState<'todos' | string>('todos')
  const [filtroAudience, setFiltroAudience] = useState<'todos' | Audience>('todos')
  const [cargando, setCargando] = useState(true)

  const load = async () => {
    setCargando(true)
    try {
      const [b, c] = await Promise.all([
        adminApi.list('benefits'),
        adminApi.list('categories'),
      ])
      setBenefits(b)
      setCategories(c)
    } catch (e: any) {
      alert(e.message)
    }
    setCargando(false)
  }

  useEffect(() => {
    load()
  }, [])

  const filtrados = benefits.filter((b) => {
    const q = normalizar(busqueda)
    const matchTexto = !q || normalizar(b.title).includes(q) || normalizar(b.company_name).includes(q)
    const matchEstado = filtroEstado === 'todos' || b.status === filtroEstado
    const matchRubro = filtroRubro === 'todos' || b.category_id === filtroRubro
    const matchAudience = filtroAudience === 'todos' || b.audience === filtroAudience
    return matchTexto && matchEstado && matchRubro && matchAudience
  })

  const toggleEstado = async (b: Benefit) => {
    const nuevoEstado = b.status === 'active' ? 'inactive' : 'active'
    try {
      await adminApi.update('benefits', b.id, { status: nuevoEstado })
    } catch (e: any) {
      alert(e.message)
    }
    load()
  }

  const eliminar = async (id: string) => {
    if (!confirm('¿Eliminar este convenio? Esta acción no se puede deshacer.')) return
    try {
      await adminApi.remove('benefits', id)
    } catch (e: any) {
      alert(e.message)
    }
    load()
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-marino">Convenios</h1>
        <Link href="/admin/convenios/nuevo" className="bg-naranja hover:bg-naranjaHover text-white px-5 py-2.5 rounded-xl font-medium">
          + Nuevo convenio
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
        <input
          placeholder="Buscar..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-[#1e2a65] outline-none"
        />
        <select
          value={filtroAudience}
          onChange={(e) => setFiltroAudience(e.target.value as any)}
          className="border border-gray-200 rounded-xl px-4 py-2.5"
        >
          <option value="todos">Ambas comunidades</option>
          <option value="familias">Familias y Estudiantes</option>
          <option value="docentes">Personal Docente y No Docente</option>
        </select>
        <select
          value={filtroEstado}
          onChange={(e) => setFiltroEstado(e.target.value as any)}
          className="border border-gray-200 rounded-xl px-4 py-2.5"
        >
          <option value="todos">Todos los estados</option>
          <option value="active">Activos</option>
          <option value="inactive">Inactivos</option>
        </select>
        <select
          value={filtroRubro}
          onChange={(e) => setFiltroRubro(e.target.value)}
          className="border border-gray-200 rounded-xl px-4 py-2.5"
        >
          <option value="todos">Todos los rubros</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-fondo text-marino text-left">
            <tr>
              <th className="px-4 py-3">Empresa</th>
              <th className="px-4 py-3">Título</th>
              <th className="px-4 py-3">Comunidad</th>
              <th className="px-4 py-3">Rubro</th>
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3">Destacado</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {cargando && (
              <tr><td colSpan={7} className="px-4 py-6 text-center text-gray-400">Cargando...</td></tr>
            )}
            {!cargando && filtrados.length === 0 && (
              <tr><td colSpan={7} className="px-4 py-6 text-center text-gray-400">Sin resultados.</td></tr>
            )}
            {filtrados.map((b) => (
              <tr key={b.id} className="border-t border-gray-100">
                <td className="px-4 py-3 font-medium text-marino whitespace-nowrap">{b.company_name}</td>
                <td className="px-4 py-3">{b.title}</td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className={`px-2 py-0.5 rounded-full text-xs ${b.audience === 'familias' ? 'bg-[#FFF3E0] text-naranja' : 'bg-fondo text-marino'}`}>
                    {audienceLabel(b.audience)}
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">{b.category?.name ?? '—'}</td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => toggleEstado(b)}
                    className={`px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                      b.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {b.status === 'active' ? 'Activo' : 'Inactivo'}
                  </button>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  {b.is_featured && <span className="text-naranja text-xs font-semibold">★ Destacado</span>}
                  {b.is_new && <span className="ml-2 text-marino text-xs font-semibold">Nuevo</span>}
                </td>
                <td className="px-4 py-3 text-right whitespace-nowrap">
                  <Link href={`/admin/convenios/${b.id}`} className="text-marino hover:text-naranja text-xs font-medium mr-3">
                    Editar
                  </Link>
                  <button onClick={() => eliminar(b.id)} className="text-red-600 hover:text-red-700 text-xs font-medium">
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
