'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import type { Benefit, Category } from '@/lib/types'
import { slugify } from '@/lib/utils'

type Props = { convenio?: Benefit }

const emptyForm = {
  title: '',
  company_name: '',
  category_id: '',
  logo_url: '',
  cover_image_url: '',
  short_description: '',
  full_description: '',
  who_can_apply: '',
  how_to_apply: '',
  how_to_redeem: '',
  terms_conditions: '',
  external_link: '',
  contact_email: '',
  contact_phone: '',
  valid_from: '',
  valid_until: '',
  status: 'active' as 'active' | 'inactive',
  is_featured: false,
  is_new: false,
}

export default function ConvenioForm({ convenio }: Props) {
  const [categories, setCategories] = useState<Category[]>([])
  const [form, setForm] = useState(convenio ? { ...emptyForm, ...convenio } : emptyForm)
  const [guardando, setGuardando] = useState(false)
  const router = useRouter()

  useEffect(() => {
    supabase.from('categories').select('*').order('sort_order').then(({ data }) => {
      setCategories((data as Category[]) ?? [])
    })
  }, [])

  const set = (campo: string, valor: any) => setForm((f) => ({ ...f, [campo]: valor }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setGuardando(true)

    const payload: Record<string, any> = {
      ...form,
      slug: convenio?.slug || slugify(`${form.company_name}-${form.title}`),
      valid_from: form.valid_from || null,
      valid_until: form.valid_until || null,
    }
    delete payload.id
    delete payload.category
    delete payload.created_at
    delete payload.updated_at

    if (convenio) {
      await supabase.from('benefits').update(payload).eq('id', convenio.id)
    } else {
      await supabase.from('benefits').insert(payload)
    }

    setGuardando(false)
    router.push('/admin/convenios')
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 max-w-3xl">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-marino mb-1">Empresa</label>
          <input required value={form.company_name} onChange={(e) => set('company_name', e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-[#1B2A6B] outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-marino mb-1">Título del beneficio</label>
          <input required value={form.title} onChange={(e) => set('title', e.target.value)}
            placeholder="Ej: 15% de descuento en el local"
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-[#1B2A6B] outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-marino mb-1">Rubro</label>
          <select required value={form.category_id} onChange={(e) => set('category_id', e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5">
            <option value="">Seleccionar...</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-marino mb-1">Logo (URL)</label>
          <input value={form.logo_url ?? ''} onChange={(e) => set('logo_url', e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-[#1B2A6B] outline-none" />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium text-marino mb-1">Descripción corta (para cards)</label>
          <textarea required rows={2} value={form.short_description} onChange={(e) => set('short_description', e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-[#1B2A6B] outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-marino mb-1">Descripción completa</label>
          <textarea required rows={4} value={form.full_description} onChange={(e) => set('full_description', e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-[#1B2A6B] outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-marino mb-1">¿Quiénes pueden acceder?</label>
          <textarea required rows={2} value={form.who_can_apply} onChange={(e) => set('who_can_apply', e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-[#1B2A6B] outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-marino mb-1">¿Cómo aplico?</label>
          <textarea required rows={2} value={form.how_to_apply} onChange={(e) => set('how_to_apply', e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-[#1B2A6B] outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-marino mb-1">¿Cómo obtengo el beneficio?</label>
          <textarea required rows={2} value={form.how_to_redeem} onChange={(e) => set('how_to_redeem', e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-[#1B2A6B] outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-marino mb-1">Condiciones (opcional)</label>
          <textarea rows={2} value={form.terms_conditions ?? ''} onChange={(e) => set('terms_conditions', e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-[#1B2A6B] outline-none" />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-marino mb-1">Email de contacto de la empresa</label>
          <input value={form.contact_email ?? ''} onChange={(e) => set('contact_email', e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-[#1B2A6B] outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-marino mb-1">Teléfono de contacto</label>
          <input value={form.contact_phone ?? ''} onChange={(e) => set('contact_phone', e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-[#1B2A6B] outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-marino mb-1">Link externo (opcional)</label>
          <input value={form.external_link ?? ''} onChange={(e) => set('external_link', e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-[#1B2A6B] outline-none" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-marino mb-1">Vigente desde</label>
            <input type="date" value={form.valid_from ?? ''} onChange={(e) => set('valid_from', e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5" />
          </div>
          <div>
            <label className="block text-sm font-medium text-marino mb-1">Vigente hasta</label>
            <input type="date" value={form.valid_until ?? ''} onChange={(e) => set('valid_until', e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-wrap gap-6">
        <label className="flex items-center gap-2 text-sm text-marino">
          <input type="checkbox" checked={form.status === 'active'} onChange={(e) => set('status', e.target.checked ? 'active' : 'inactive')} />
          Convenio activo
        </label>
        <label className="flex items-center gap-2 text-sm text-marino">
          <input type="checkbox" checked={form.is_featured} onChange={(e) => set('is_featured', e.target.checked)} />
          Destacado en Home
        </label>
        <label className="flex items-center gap-2 text-sm text-marino">
          <input type="checkbox" checked={form.is_new} onChange={(e) => set('is_new', e.target.checked)} />
          Marcar como "Nuevo"
        </label>
      </div>

      <button type="submit" disabled={guardando}
        className="self-start bg-marino hover:bg-marinoHover text-white px-6 py-3 rounded-xl font-medium transition-colors disabled:opacity-60">
        {guardando ? 'Guardando...' : convenio ? 'Guardar cambios' : 'Crear convenio'}
      </button>
    </form>
  )
}
