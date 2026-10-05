'use client'

import { useEffect, useState } from 'react'
import { adminApi } from '@/lib/adminApi'

export const dynamic = 'force-dynamic'

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    activosFamilias: 0,
    activosDocentes: 0,
    inactivos: 0,
    porRubro: [] as { rubro: string; cantidad: number }[],
    mensajesPendientes: 0,
  })
  const [error, setError] = useState('')

  useEffect(() => {
    const load = async () => {
      try {
        const [benefits, mensajes] = await Promise.all([
          adminApi.list('benefits'),
          adminApi.list('contact_messages'),
        ])

        const activos = benefits.filter((b: any) => b.status === 'active')
        const conteoRubro: Record<string, number> = {}
        activos.forEach((b: any) => {
          const nombre = b.category?.name ?? 'Sin rubro'
          conteoRubro[nombre] = (conteoRubro[nombre] ?? 0) + 1
        })

        setStats({
          activosFamilias: activos.filter((b: any) => b.audience === 'familias').length,
          activosDocentes: activos.filter((b: any) => b.audience === 'docentes').length,
          inactivos: benefits.filter((b: any) => b.status === 'inactive').length,
          porRubro: Object.entries(conteoRubro).map(([rubro, cantidad]) => ({ rubro, cantidad })),
          mensajesPendientes: mensajes.filter((m: any) => m.status === 'pending').length,
        })
      } catch (e: any) {
        setError(e.message)
      }
    }
    load()
  }, [])

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-marino">Dashboard</h1>
      {error && <p className="text-red-600 text-sm">{error}</p>}

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
