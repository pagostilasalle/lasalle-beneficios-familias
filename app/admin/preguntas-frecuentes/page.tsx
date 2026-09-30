'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import type { Faq } from '@/lib/types'
import { audienceLabel, type Audience } from '@/lib/utils'

export const dynamic = 'force-dynamic'

const emptyForm = { question: '', answer: '', audience: 'familias' as Audience }

export default function AdminFaqPage() {
  const [faqs, setFaqs] = useState<Faq[]>([])
  const [form, setForm] = useState(emptyForm)
  const [editando, setEditando] = useState<string | null>(null)
  const [filtroAudience, setFiltroAudience] = useState<'todos' | Audience>('todos')

  const load = async () => {
    const { data } = await supabase.from('faqs').select('*').order('sort_order')
    setFaqs((data as Faq[]) ?? [])
  }

  useEffect(() => { load() }, [])

  const guardar = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.question.trim() || !form.answer.trim()) return

    if (editando) {
      await supabase.from('faqs').update(form).eq('id', editando)
    } else {
      await supabase.from('faqs').insert({ ...form, sort_order: faqs.length + 1 })
    }
    setForm(emptyForm)
    setEditando(null)
    load()
  }

  const editar = (faq: Faq) => {
    setForm({ question: faq.question, answer: faq.answer, audience: faq.audience })
    setEditando(faq.id)
  }

  const eliminar = async (id: string) => {
    if (!confirm('¿Eliminar esta pregunta?')) return
    await supabase.from('faqs').delete().eq('id', id)
    load()
  }

  const toggleActivo = async (faq: Faq) => {
    await supabase.from('faqs').update({ active: !faq.active }).eq('id', faq.id)
    load()
  }

  const faqsFiltradas = faqs.filter((f) => filtroAudience === 'todos' || f.audience === filtroAudience)

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-marino">Preguntas frecuentes</h1>

      <form onSubmit={guardar} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col gap-4 max-w-2xl">
        <div>
          <label className="block text-sm font-medium text-marino mb-2">Comunidad</label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 text-sm">
              <input type="radio" name="faq-audience" checked={form.audience === 'familias'} onChange={() => setForm({ ...form, audience: 'familias' })} />
              Familias y Estudiantes
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="radio" name="faq-audience" checked={form.audience === 'docentes'} onChange={() => setForm({ ...form, audience: 'docentes' })} />
              Personal Docente y No Docente
            </label>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-marino mb-1">Pregunta</label>
          <input value={form.question} onChange={(e) => setForm({ ...form, question: e.target.value })}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-[#1e2a65] outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-marino mb-1">Respuesta</label>
          <textarea rows={3} value={form.answer} onChange={(e) => setForm({ ...form, answer: e.target.value })}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-[#1e2a65] outline-none" />
        </div>
        <div className="flex gap-3">
          <button className="bg-marino hover:bg-marinoHover text-white px-5 py-2.5 rounded-xl font-medium">
            {editando ? 'Guardar cambios' : 'Agregar pregunta'}
          </button>
          {editando && (
            <button type="button" onClick={() => { setForm(emptyForm); setEditando(null) }}
              className="text-marino text-sm">
              Cancelar edición
            </button>
          )}
        </div>
      </form>

      <select
        value={filtroAudience}
        onChange={(e) => setFiltroAudience(e.target.value as any)}
        className="border border-gray-200 rounded-xl px-4 py-2.5 max-w-xs"
      >
        <option value="todos">Ambas comunidades</option>
        <option value="familias">Familias y Estudiantes</option>
        <option value="docentes">Personal Docente y No Docente</option>
      </select>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 divide-y divide-gray-100">
        {faqsFiltradas.map((faq) => (
          <div key={faq.id} className="px-6 py-4 flex items-start justify-between gap-4">
            <div>
              <span className={`inline-block mb-1 text-[10px] uppercase tracking-wide px-2 py-0.5 rounded-full ${faq.audience === 'familias' ? 'bg-[#FFF3E0] text-naranja' : 'bg-fondo text-marino'}`}>
                {audienceLabel(faq.audience)}
              </span>
              <p className="font-medium text-marino">{faq.question}</p>
              <p className="text-sm text-gray-500 mt-1">{faq.answer}</p>
            </div>
            <div className="flex items-center gap-3 whitespace-nowrap">
              <button
                onClick={() => toggleActivo(faq)}
                className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                  faq.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                }`}
              >
                {faq.active ? 'Activa' : 'Inactiva'}
              </button>
              <button onClick={() => editar(faq)} className="text-marino hover:text-naranja text-xs font-medium">Editar</button>
              <button onClick={() => eliminar(faq.id)} className="text-red-600 hover:text-red-700 text-xs font-medium">Eliminar</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
