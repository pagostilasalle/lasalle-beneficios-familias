'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import type { ContactMessage } from '@/lib/types'
import { audienceLabel, type Audience } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export default function AdminMensajesPage() {
  const [mensajes, setMensajes] = useState<ContactMessage[]>([])
  const [filtroAudience, setFiltroAudience] = useState<'todos' | Audience>('todos')

  const load = async () => {
    const { data } = await supabase.from('contact_messages').select('*').order('created_at', { ascending: false })
    setMensajes((data as ContactMessage[]) ?? [])
  }

  useEffect(() => { load() }, [])

  const marcarLeido = async (m: ContactMessage) => {
    await supabase.from('contact_messages').update({ status: m.status === 'pending' ? 'read' : 'pending' }).eq('id', m.id)
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
              <button
                onClick={() => marcarLeido(m)}
                className="text-xs font-medium text-marino hover:text-naranja whitespace-nowrap"
              >
                {m.status === 'pending' ? 'Marcar como leído' : 'Marcar como pendiente'}
              </button>
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
