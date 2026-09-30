import { notFound } from 'next/navigation'
import { isAudience } from '@/lib/utils'
import HeaderPublico from '@/components/HeaderPublico'

export function generateStaticParams() {
  return [{ audience: 'familias' }, { audience: 'docentes' }]
}

export default function AudienceLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { audience: string }
}) {
  if (!isAudience(params.audience)) notFound()

  return (
    <>
      <HeaderPublico audience={params.audience} />
      <main className="flex-1">{children}</main>
    </>
  )
}
