import { supabase } from '@/lib/supabaseClient'
import type { Benefit, Category } from '@/lib/types'
import ConveniosConBusqueda from '@/components/ConveniosConBusqueda'

export const revalidate = 60

async function getData() {
  const [{ data: categories }, { data: benefits }] = await Promise.all([
    supabase.from('categories').select('*').eq('active', true).order('sort_order'),
    supabase.from('benefits').select('*').eq('status', 'active').order('company_name'),
  ])
  return {
    categories: (categories as Category[]) ?? [],
    benefits: (benefits as Benefit[]) ?? [],
  }
}

export default async function ConveniosPage() {
  const { categories, benefits } = await getData()

  return (
    <>
      <section
        className="relative"
        style={{ backgroundImage: 'url(/banner.png)', backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        <div className="absolute inset-0 bg-[#1B2A6B]/80" />
        <div className="relative max-w-6xl mx-auto px-4 py-16 text-center text-white">
          <h1 className="text-3xl font-bold mb-2">Convenios</h1>
          <p className="text-white/85">
            Todos los beneficios activos para estudiantes y familias, organizados por rubro.
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-12">
        <ConveniosConBusqueda categories={categories} benefits={benefits} />
      </section>
    </>
  )
}
