import type { Metadata } from 'next'
import { Montserrat } from 'next/font/google'
import './globals.css'
import SiteChrome from '@/components/SiteChrome'

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-montserrat',
})

export const metadata: Metadata = {
  title: 'Comunidad de Beneficios - La Salle',
  description:
    'Convenios y descuentos para estudiantes y familias del Distrito La Salle Argentina-Paraguay',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className={montserrat.variable}>
      <body className="font-sans bg-fondo min-h-screen flex flex-col">
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  )
}
