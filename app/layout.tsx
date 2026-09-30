import type { Metadata } from 'next'
import { Montserrat } from 'next/font/google'
import './globals.css'
import BotonScrollTop from '@/components/BotonScrollTop'

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-montserrat',
})

export const metadata: Metadata = {
  title: 'Comunidad de Beneficios - La Salle',
  description:
    'Convenios y descuentos para la comunidad del Distrito La Salle Argentina-Paraguay',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className={montserrat.variable}>
      <body className="font-sans bg-fondo min-h-screen flex flex-col">
        <div className="flex-1 flex flex-col">{children}</div>
        <footer className="bg-marino text-white/80 text-sm py-8">
          <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-2">
            <span>© {new Date().getFullYear()} Distrito La Salle Argentina-Paraguay</span>
            <span>Comunidad de Beneficios</span>
          </div>
        </footer>
        <BotonScrollTop />
      </body>
    </html>
  )
}
