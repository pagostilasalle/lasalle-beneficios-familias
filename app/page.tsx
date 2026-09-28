import Link from 'next/link'
import Image from 'next/image'
import { supabase } from '@/lib/supabaseClient'
import type { Benefit, Category } from '@/lib/types'

export const revalidate = 60

async function getDestacados() {
  const { data } = await supabase
    .from('benefits')
    .select('*')
    .eq('status', 'active')
    .or('is_featured.eq.true,is_new.eq.true')
    .order('created_at', { ascending: false })
    .limit(6)
  return (data as Benefit[]) ?? []
}

async function getRubrosConConvenios() {
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .eq('active', true)
    .order('sort_order')

  const { data: benefits } = await supabase
    .from('benefits')
    .select('category_id')
    .eq('status', 'active')

  const idsConConvenio = new Set((benefits ?? []).map((b) => b.category_id))
  return ((categories as Category[]) ?? []).filter((c) => idsConConvenio.has(c.id))
}

export default async function HomePage() {
  const [destacados, rubros] = await Promise.all([getDestacados(), getRubrosConConvenios()])

  return (
    <>
      {/* Hero */}
      <section
        className="relative"
        style={{ backgroundImage: 'url(/banner2.png)', backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        <div className="absolute inset-0 bg-[#1B2A6B]/80" />
        <div className="relative max-w-6xl mx-auto px-4 py-24 text-center text-white">
          <p className="uppercase tracking-wide text-sm text-white/70 mb-3">
            Distrito La Salle Argentina-Paraguay
          </p>
          <h1 className="text-3xl md:text-5xl font-bold mb-4">Comunidad de Beneficios</h1>
          <p className="max-w-2xl mx-auto text-white/85 mb-8">
            Descuentos y convenios pensados para estudiantes y familias de la Red La Salle:
            gastronomía, deportes, turismo, educación y entretenimiento.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href="/convenios"
              className="bg-naranja hover:bg-naranjaHover text-white px-6 py-3 rounded-xl font-medium transition-colors"
            >
              Ver convenios →
            </Link>
            <Link
              href="/preguntas-frecuentes"
              className="bg-white/10 hover:bg-white/20 border border-white/40 text-white px-6 py-3 rounded-xl font-medium transition-colors"
            >
              Preguntas frecuentes
            </Link>
          </div>
        </div>
      </section>

      {/* Destacados / nuevos */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-naranja text-sm font-semibold uppercase tracking-wide">Novedades</p>
            <h2 className="text-2xl font-bold text-marino">Beneficios destacados</h2>
          </div>
          <Link href="/convenios" className="text-marino text-sm font-medium hover:text-naranja">
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
                href={`/convenios/${b.slug}`}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow flex flex-col gap-3"
              >
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
                <p className="font-medium text-marino">{b.title}</p>
                <p className="text-sm text-gray-600 line-clamp-2">{b.short_description}</p>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Rubros */}
      <section
        className="relative py-16"
        style={{ backgroundImage: 'url(/banner4.png)', backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        <div className="absolute inset-0 bg-white/70" />
        <div className="relative max-w-6xl mx-auto px-4">
          <p className="text-naranja text-sm font-semibold uppercase tracking-wide mb-1">Navegá por rubro</p>
          <h2 className="text-2xl font-bold text-marino mb-8">¿Qué tipo de beneficio buscás?</h2>

          {rubros.length === 0 ? (
            <p className="text-gray-500">Todavía no hay rubros con convenios activos.</p>
          ) : (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {rubros.map((r) => (
                <Link
                  key={r.id}
                  href={`/convenios?rubro=${r.slug}`}
                  className="bg-white/90 rounded-2xl shadow-sm border border-gray-100 p-6 text-center hover:shadow-md transition-shadow"
                >
                  <p className="font-semibold text-marino">{r.name}</p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA inferior */}
      <section
        className="relative"
        style={{ backgroundImage: 'url(/banner.png)', backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        <div className="absolute inset-0 bg-[#1B2A6B]/80" />
        <div className="relative max-w-4xl mx-auto px-4 py-16 text-center text-white">
          <h2 className="text-2xl font-bold mb-3">¿Tenés una empresa y querés sumarte?</h2>
          <p className="text-white/85 mb-6">
            Escribinos y te contamos cómo formar parte de la Comunidad de Beneficios La Salle.
          </p>
          <Link
            href="/contacto"
            className="inline-block bg-naranja hover:bg-naranjaHover text-white px-6 py-3 rounded-xl font-medium transition-colors"
          >
            Contactanos
          </Link>
        </div>
      </section>
    </>
  )
}
