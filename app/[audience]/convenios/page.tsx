import { notFound } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { isAudience, visibleAudiences, type Audience } from '@/lib/utils'
import type { Benefit, Category } from '@/lib/types'
import ConveniosConBusqueda from '@/components/ConveniosConBusqueda'

export const revalidate = 60

async function getData(audience: Audience) {
  const [{ data: categories }, { data: benefits }] = await Promise.all([
    supabase.from('categories').select('*').eq('active', true).order('sort_order'),
    supabase.from('benefits').select('*').eq('status', 'active').in('audience', visibleAudiences(audience)).order('company_name'),
  ])
  return {
    categories: (categories as Category[]) ?? [],
    benefits: (benefits as Benefit[]) ?? [],
  }
}

export default async function ConveniosPage({ params }: { params: { audience: string } }) {
  if (!isAudience(params.audience)) notFound()
  const { categories, benefits } = await getData(params.audience)

  return (
    <>
      <section
        className="relative"
        style={{ backgroundImage: 'url(/banner.png)', backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        <div className="absolute inset-0 bg-[#1e2a65]/80" />
        <div className="relative max-w-6xl mx-auto px-4 py-16 text-center text-white">
          <h1 className="text-3xl font-bold mb-2">Convenios</h1>
          <p className="text-white/85">
            Todos los beneficios activos, organizados por rubro.
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-12">
        <ConveniosConBusqueda audience={params.audience} categories={categories} benefits={benefits} />
      </section>
    </>
  )
}
