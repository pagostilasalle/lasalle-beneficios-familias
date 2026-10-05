import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { isAudience, visibleAudiences, hasText, type Audience } from '@/lib/utils'
import type { BenefitPublic, Category } from '@/lib/types'
import { BENEFIT_PUBLIC_COLUMNS } from '@/lib/benefitColumns'

export const revalidate = 60

async function getConvenio(slug: string, audience: Audience) {
  const { data } = await supabase
    .from('benefits')
    .select(`${BENEFIT_PUBLIC_COLUMNS}, category:categories(*)`)
    .eq('slug', slug)
    .eq('status', 'active')
    .in('audience', visibleAudiences(audience))
    .single()
  return data as unknown as (BenefitPublic & { category: Category }) | null
}

export default async function ConvenioDetallePage({
  params,
}: {
  params: { audience: string; slug: string }
}) {
  if (!isAudience(params.audience)) notFound()
  const convenio = await getConvenio(params.slug, params.audience)
  if (!convenio) notFound()

  // Solo se muestran las secciones que tienen texto. Lo que se deje vacío en el backoffice no aparece.
  const secciones = [
    { titulo: 'Sobre el beneficio', texto: convenio.full_description, chico: false },
    { titulo: '¿Quiénes pueden acceder?', texto: convenio.who_can_apply, chico: false },
    { titulo: '¿Cómo aplico?', texto: convenio.how_to_apply, chico: false },
    { titulo: '¿Cómo obtengo el beneficio?', texto: convenio.how_to_redeem, chico: false },
    { titulo: 'Condiciones', texto: convenio.terms_conditions, chico: true },
  ].filter((sec) => hasText(sec.texto))

  return (
    <>
      <section
        className="relative"
        style={{ backgroundImage: 'url(/banner.png)', backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        <div className="absolute inset-0 bg-[#1e2a65]/80" />
        <div className="relative max-w-4xl mx-auto px-4 py-14 text-white">
          <nav className="text-sm text-white/70 mb-4">
            <Link href={`/${params.audience}/convenios`} className="hover:text-white">Convenios</Link>
            {' / '}
            <span>{convenio.category?.name}</span>
            {' / '}
            <span className="text-white">{convenio.company_name}</span>
          </nav>
          <div className="flex items-center gap-4">
            {convenio.logo_url ? (
              <Image
                src={convenio.logo_url}
                alt={convenio.company_name}
                width={64}
                height={64}
                className="rounded-xl bg-white object-contain p-1"
              />
            ) : (
              <div className="w-16 h-16 rounded-xl bg-white/20 flex items-center justify-center text-2xl font-bold">
                {convenio.company_name.charAt(0)}
              </div>
            )}
            <div>
              <p className="text-white/70 text-sm">{convenio.category?.name}</p>
              <h1 className="text-2xl md:text-3xl font-bold">{convenio.title}</h1>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 py-12 grid md:grid-cols-3 gap-8">
        {secciones.length > 0 && (
          <div className="md:col-span-2 flex flex-col gap-8">
            {secciones.map((sec) => (
              <div key={sec.titulo} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h2 className="font-semibold text-marino mb-3">{sec.titulo}</h2>
                <p className={`text-gray-700 whitespace-pre-line ${sec.chico ? 'text-sm' : ''}`}>{sec.texto}</p>
              </div>
            ))}
          </div>
        )}

        <aside className={`flex flex-col gap-4 ${secciones.length === 0 ? 'md:col-span-3 max-w-md' : ''}`}>
          {convenio.external_link && (
            <a
              href={convenio.external_link}
              target="_blank"
              rel="noreferrer"
              className="text-center bg-marino hover:bg-marinoHover text-white px-4 py-3 rounded-xl font-medium transition-colors"
            >
              Visitar sitio de {convenio.company_name}
            </a>
          )}

          <Link
            href={`/${params.audience}/contacto`}
            className="text-center bg-naranja hover:bg-naranjaHover text-white px-4 py-3 rounded-xl font-medium transition-colors"
          >
            ¿Tenés dudas? Escribinos
          </Link>
        </aside>
      </section>
    </>
  )
}
