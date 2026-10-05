import { notFound } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { isAudience, visibleAudiences, type Audience } from '@/lib/utils'
import type { BenefitPublic, Category } from '@/lib/types'
import { BENEFIT_PUBLIC_COLUMNS } from '@/lib/benefitColumns'
import ConveniosConBusqueda from '@/components/ConveniosConBusqueda'
import { logError } from '@/lib/logError'

export const revalidate = 60

async function getData(audience: Audience) {
  const [{ data: categories, error: errCategorias }, { data: benefits, error: errConvenios }] = await Promise.all([
    supabase.from('categories').select('*').eq('active', true).order('sort_order'),
    supabase.from('benefits').select(BENEFIT_PUBLIC_COLUMNS).eq('status', 'active').in('audience', visibleAudiences(audience)).order('company_name'),
  ])
  logError('convenios/rubros', errCategorias)
  logError('convenios/convenios', errConvenios)
  return {
    categories: (categories as Category[]) ?? [],
    benefits: (benefits as unknown as BenefitPublic[]) ?? [],
    fallo: Boolean(errCategorias || errConvenios),
  }
}

export default async function ConveniosPage({ params }: { params: { audience: string } }) {
  if (!isAudience(params.audience)) notFound()
  const { categories, benefits, fallo } = await getData(params.audience)

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
        {fallo ? (
          <p className="text-center text-gray-600 py-12">
            No pudimos cargar los convenios en este momento. Probá de nuevo en unos minutos.
          </p>
        ) : (
          <ConveniosConBusqueda audience={params.audience} categories={categories} benefits={benefits} />
        )}
      </section>
    </>
  )
}
