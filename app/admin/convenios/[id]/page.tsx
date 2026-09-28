'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import type { Benefit } from '@/lib/types'
import ConvenioForm from '@/components/ConvenioForm'

export const dynamic = 'force-dynamic'

export default function EditarConvenioPage({ params }: { params: { id: string } }) {
  const [convenio, setConvenio] = useState<Benefit | null>(null)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    supabase.from('benefits').select('*').eq('id', params.id).single().then(({ data }) => {
      setConvenio(data as Benefit)
      setCargando(false)
    })
  }, [params.id])

  if (cargando) return <p className="text-gray-400">Cargando...</p>
  if (!convenio) return <p className="text-gray-400">Convenio no encontrado.</p>

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-marino">Editar convenio</h1>
      <ConvenioForm convenio={convenio} />
    </div>
  )
}
