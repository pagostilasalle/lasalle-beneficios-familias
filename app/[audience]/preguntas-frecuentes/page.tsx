import { notFound } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { isAudience } from '@/lib/utils'
import type { Faq } from '@/lib/types'
import FaqAcordeon from '@/components/FaqAcordeon'

export const revalidate = 60

async function getFaqs(audience: string) {
  const { data } = await supabase
    .from('faqs')
    .select('*')
    .eq('active', true)
    .eq('audience', audience)
    .order('sort_order')
  return (data as Faq[]) ?? []
}

export default async function PreguntasFrecuentesPage({ params }: { params: { audience: string } }) {
  if (!isAudience(params.audience)) notFound()
  const faqs = await getFaqs(params.audience)

  return (
    <>
      <section
        className="relative"
        style={{ backgroundImage: 'url(/banner.png)', backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        <div className="absolute inset-0 bg-[#1e2a65]/80" />
        <div className="relative max-w-4xl mx-auto px-4 py-16 text-center text-white">
          <h1 className="text-3xl font-bold mb-2">Preguntas frecuentes</h1>
          <p className="text-white/85">Todo lo que necesitás saber sobre la Comunidad de Beneficios.</p>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-4 py-12">
        {faqs.length === 0 ? (
          <p className="text-gray-500 text-center">Todavía no hay preguntas frecuentes cargadas.</p>
        ) : (
          <FaqAcordeon faqs={faqs} />
        )}
      </section>
    </>
  )
}
