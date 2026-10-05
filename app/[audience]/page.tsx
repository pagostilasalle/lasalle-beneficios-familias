import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { isAudience, audienceLabel, visibleAudiences, hasText, type Audience } from '@/lib/utils'
import type { BenefitPublic, Category } from '@/lib/types'
import { BENEFIT_PUBLIC_COLUMNS } from '@/lib/benefitColumns'

export const revalidate = 60

async function getDestacados(audience: Audience) {
  const { data } = await supabase
    .from('benefits')
    .select(BENEFIT_PUBLIC_COLUMNS)
    .eq('status', 'active')
    .in('audience', visibleAudiences(audience))
    .or('is_featured.eq.true,is_new.eq.true')
    .order('created_at', { ascending: false })
    .limit(6)
  return (data as unknown as BenefitPublic[]) ?? []
}

async function getRubrosConConvenios(audience: Audience) {
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .eq('active', true)
    .order('sort_order')

  const { data: benefits } = await supabase
    .from('benefits')
    .select('category_id')
    .eq('status', 'active')
    .in('audience', visibleAudiences(audience))

  const idsConConvenio = new Set((benefits ?? []).map((b) => b.category_id))
  return ((categories as Category[]) ?? []).filter((c) => idsConConvenio.has(c.id))
}

async function getStats(audience: Audience) {
  const [{ count: totalConvenios }, rubros] = await Promise.all([
    supabase
      .from('benefits')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'active')
      .in('audience', visibleAudiences(audience)),
    getRubrosConConvenios(audience),
  ])
  return {
    convenios: totalConvenios ?? 0,
    rubros: rubros.length,
  }
}

const ICONOS_VALOR = [
  { icon: '🏷️', label: 'Descuentos reales' },
  { icon: '✅', label: 'Convenios verificados' },
  { icon: '🔄', label: 'Se actualiza seguido' },
  { icon: '🏛️', label: 'Red La Salle' },
]

export default async function AudienceHomePage({ params }: { params: { audience: string } }) {
  if (!isAudience(params.audience)) notFound()
  const audience = params.audience

  const [destacados, rubros, stats] = await Promise.all([
    getDestacados(audience),
    getRubrosConConvenios(audience),
    getStats(audience),
  ])

  return (
    <>
      {/* HERO: foto de fondo + overlay azul institucional */}
      <section
        className="relative"
        style={{ backgroundImage: 'url(/banner2.png)', backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        <div className="absolute inset-0 bg-marino/85" />
        <div className="relative max-w-6xl mx-auto px-4 py-24 md:py-28">
          <p className="uppercase tracking-wide text-sm text-white/70 mb-3">
            Distrito La Salle Argentina-Paraguay · {audienceLabel(audience)}
          </p>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-5 max-w-2xl leading-tight">
            Comunidad de Beneficios
          </h1>
          <p className="max-w-xl text-white/85 mb-8 text-lg">
            Descuentos y convenios pensados para vos: gastronomía, deportes, turismo, educación y entretenimiento.
          </p>
          <Link
            href={`/${audience}/convenios`}
            className="inline-block bg-naranja hover:bg-naranjaHover text-white px-8 py-4 rounded-xl font-semibold transition-colors"
          >
            Ver convenios →
          </Link>
        </div>
      </section>

      {/* FRANJA DE ÍCONOS (naranja) */}
      <section className="bg-naranja">
        <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          {ICONOS_VALOR.map((item) => (
            <div key={item.label} className="flex flex-col items-center text-center gap-2">
              <span className="text-3xl">{item.icon}</span>
              <span className="text-white text-sm font-medium">{item.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* DESTACADOS */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-naranja text-sm font-semibold uppercase tracking-wide">Novedades</p>
            <h2 className="text-2xl md:text-3xl font-bold text-marino">Beneficios destacados</h2>
          </div>
          <Link href={`/${audience}/convenios`} className="text-marino text-sm font-medium hover:text-naranja">
            Ver todos →
          </Link>
        </div>

        {destacados.length === 0 ? (
          <p className="text-gray-500">Todavía no hay convenios destacados cargados.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {destacados.map((b) => (
              <Link
                key={b.id}
                href={`/${audience}/convenios/${b.slug}`}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow flex flex-col"
              >
                <div className="p-5 flex flex-col gap-3 flex-1">
                  <div className="flex items-center gap-3">
                    {b.logo_url ? (
                      <Image src={b.logo_url} alt={b.company_name} width={44} height={44} className="rounded-xl object-contain" />
                    ) : (
                      <div className="w-11 h-11 rounded-xl bg-fondo flex items-center justify-center text-marino font-semibold">
                        {b.company_name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <p className="font-semibold text-marino leading-tight">{b.company_name}</p>
                      {b.is_new && (
                        <span className="inline-block mt-1 text-[10px] uppercase tracking-wide bg-naranja text-white px-2 py-0.5 rounded-full">
                          Nuevo
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="font-medium text-black">{b.title}</p>
                  {hasText(b.short_description) && (
                    <p className="text-sm text-gray-600 line-clamp-2">{b.short_description}</p>
                  )}
                </div>
                <div className="h-1.5 bg-naranja" />
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* BLOQUE DE ESTADÍSTICAS (azul institucional) */}
      <section className="bg-marino">
        <div className="max-w-6xl mx-auto px-4 py-14 grid grid-cols-2 gap-8 text-center">
          <div>
            <p className="text-4xl md:text-5xl font-extrabold text-naranja">{stats.convenios}</p>
            <p className="text-white/80 text-sm mt-2 uppercase tracking-wide">Convenios activos</p>
          </div>
          <div>
            <p className="text-4xl md:text-5xl font-extrabold text-naranja">{stats.rubros}</p>
            <p className="text-white/80 text-sm mt-2 uppercase tracking-wide">Rubros con beneficios</p>
          </div>
        </div>
      </section>

      {/* RUBROS */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <p className="text-naranja text-sm font-semibold uppercase tracking-wide mb-1">Navegá por rubro</p>
        <h2 className="text-2xl md:text-3xl font-bold text-marino mb-8">¿Qué tipo de beneficio buscás?</h2>

        {rubros.length === 0 ? (
          <p className="text-gray-500">Todavía no hay rubros con convenios activos.</p>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {rubros.map((r) => (
              <Link
                key={r.id}
                href={`/${audience}/convenios?rubro=${r.slug}`}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center hover:shadow-md hover:border-naranja transition-all"
              >
                <p className="font-semibold text-marino">{r.name}</p>
              </Link>
            ))}
          </div>
        )}
      </section>
    </>
  )
}
