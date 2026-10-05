'use client'

import { useEffect, useState } from 'react'
import { adminApi } from '@/lib/adminApi'
import type { ContactMessage } from '@/lib/types'
import { audienceLabel, type Audience } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export default function AdminMensajesPage() {
  const [mensajes, setMensajes] = useState<ContactMessage[]>([])
  const [filtroAudience, setFiltroAudience] = useState<'todos' | Audience>('todos')

  const load = async () => {
    try {
      setMensajes(await adminApi.list<ContactMessage>('contact_messages'))
    } catch (e: any) {
      alert(e.message)
    }
  }

  useEffect(() => { load() }, [])

  const marcarLeido = async (m: ContactMessage) => {
    try {
      await adminApi.update('contact_messages', m.id, { status: m.status === 'pending' ? 'read' : 'pending' })
    } catch (e: any) {
      alert(e.message)
    }
    load()
  }

  const eliminar = async (m: ContactMessage) => {
    if (!confirm(`¿Eliminar el mensaje de ${m.name}? Esta acción no se puede deshacer.`)) return
    try {
      await adminApi.remove('contact_messages', m.id)
    } catch (e: any) {
      alert(e.message)
    }
    load()
  }

  const mensajesFiltrados = mensajes.filter((m) => filtroAudience === 'todos' || m.audience === filtroAudience)

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-marino">Mensajes de contacto</h1>

      <select
        value={filtroAudience}
        onChange={(e) => setFiltroAudience(e.target.value as any)}
        className="border border-gray-200 rounded-xl px-4 py-2.5 max-w-xs"
      >
        <option value="todos">Ambas comunidades</option>
        <option value="familias">Familias y Estudiantes</option>
        <option value="docentes">Personal Docente y No Docente</option>
      </select>

      <div className="flex flex-col gap-3">
        {mensajesFiltrados.length === 0 && <p className="text-gray-400">Todavía no hay mensajes.</p>}
        {mensajesFiltrados.map((m) => (
          <div key={m.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className={`inline-block mb-1 text-[10px] uppercase tracking-wide px-2 py-0.5 rounded-full ${m.audience === 'familias' ? 'bg-[#FFF3E0] text-naranja' : 'bg-fondo text-marino'}`}>
                  {audienceLabel(m.audience)}
                </span>
                <p className="font-semibold text-marino">
                  {m.name}{' '}
                  {m.status === 'pending' && (
                    <span className="ml-2 text-[10px] uppercase tracking-wide bg-naranja text-white px-2 py-0.5 rounded-full align-middle">
                      Pendiente
                    </span>
                  )}
                </p>
                <p className="text-sm text-gray-500">
                  {m.email} {m.phone ? `· ${m.phone}` : ''}
                </p>
              </div>
              <div className="flex items-center gap-4 whitespace-nowrap">
                <button
                  onClick={() => marcarLeido(m)}
                  className="text-xs font-medium text-marino hover:text-naranja"
                >
                  {m.status === 'pending' ? 'Marcar como leído' : 'Marcar como pendiente'}
                </button>
                <button
                  onClick={() => eliminar(m)}
                  className="text-xs font-medium text-red-600 hover:text-red-700"
                >
                  Eliminar
                </button>
              </div>
            </div>
            <p className="text-gray-700 text-sm mt-3 whitespace-pre-line">{m.message}</p>
            <p className="text-xs text-gray-400 mt-3">
              {new Date(m.created_at).toLocaleString('es-AR')}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
