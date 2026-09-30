'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export const dynamic = 'force-dynamic'

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    activosFamilias: 0,
    activosDocentes: 0,
    inactivos: 0,
    porRubro: [] as { rubro: string; cantidad: number }[],
    mensajesPendientes: 0,
  })

  useEffect(() => {
    const load = async () => {
      const { data: benefits } = await supabase
        .from('benefits')
        .select('status, audience, category:categories(name)')

      const { count: mensajesPendientes } = await supabase
        .from('contact_messages')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending')

      const activosFamilias = (benefits ?? []).filter((b: any) => b.status === 'active' && b.audience === 'familias').length
      const activosDocentes = (benefits ?? []).filter((b: any) => b.status === 'active' && b.audience === 'docentes').length
      const inactivos = (benefits ?? []).filter((b: any) => b.status === 'inactive').length

      const conteoRubro: Record<string, number> = {}
      ;(benefits ?? [])
        .filter((b: any) => b.status === 'active')
        .forEach((b: any) => {
          const nombre = b.category?.name ?? 'Sin rubro'
          conteoRubro[nombre] = (conteoRubro[nombre] ?? 0) + 1
        })

      setStats({
        activosFamilias,
        activosDocentes,
        inactivos,
        porRubro: Object.entries(conteoRubro).map(([rubro, cantidad]) => ({ rubro, cantidad })),
        mensajesPendientes: mensajesPendientes ?? 0,
      })
    }
    load()
  }, [])

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-marino">Dashboard</h1>

      <div className="grid sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <p className="text-gray-500 text-sm">Activos — Familias</p>
          <p className="text-3xl font-bold text-marino">{stats.activosFamilias}</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <p className="text-gray-500 text-sm">Activos — Docentes</p>
          <p className="text-3xl font-bold text-marino">{stats.activosDocentes}</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <p className="text-gray-500 text-sm">Inactivos (total)</p>
          <p className="text-3xl font-bold text-marino">{stats.inactivos}</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <p className="text-gray-500 text-sm">Mensajes sin leer</p>
          <p className="text-3xl font-bold text-naranja">{stats.mensajesPendientes}</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="font-semibold text-marino mb-4">Convenios activos por rubro (ambas comunidades)</h2>
        {stats.porRubro.length === 0 ? (
          <p className="text-gray-500 text-sm">Sin datos todavía.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {stats.porRubro.map((r) => (
              <div key={r.rubro} className="flex items-center justify-between text-sm">
                <span className="text-gray-700">{r.rubro}</span>
                <span className="font-semibold text-marino">{r.cantidad}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
