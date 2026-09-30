import Link from 'next/link'
import Image from 'next/image'

export default function SelectorComunidadPage() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center px-4 py-16">
      <Image
        src="/logo-lasalle.png"
        alt="La Salle - Distrito Argentina-Paraguay"
        width={220}
        height={121}
        className="mb-8 h-16 w-auto"
        priority
      />

      <p className="text-marino/60 text-sm uppercase tracking-wide mb-2 text-center">
        Distrito La Salle Argentina-Paraguay
      </p>
      <h1 className="text-3xl md:text-4xl font-bold text-marino text-center mb-3">
        Comunidad de Beneficios
      </h1>
      <p className="text-gray-500 text-center max-w-xl mb-12">
        Elegí a qué comunidad pertenecés para ver los convenios y descuentos disponibles.
      </p>

      <div className="grid sm:grid-cols-2 gap-6 w-full max-w-3xl">
        <Link
          href="/familias"
          className="group bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center hover:shadow-md hover:border-naranja transition-all flex flex-col items-center gap-3"
        >
          <div className="w-14 h-14 rounded-xl bg-[#FFF3E0] flex items-center justify-center text-2xl">
            🎓
          </div>
          <h2 className="text-xl font-semibold text-marino">Familias y Estudiantes</h2>
          <p className="text-sm text-gray-500">
            Beneficios para estudiantes y familias de toda la Red La Salle.
          </p>
          <span className="mt-2 text-naranja font-medium text-sm group-hover:underline">
            Ingresar →
          </span>
        </Link>

        <Link
          href="/docentes"
          className="group bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center hover:shadow-md hover:border-marino transition-all flex flex-col items-center gap-3"
        >
          <div className="w-14 h-14 rounded-xl bg-fondo flex items-center justify-center text-2xl">
            🏫
          </div>
          <h2 className="text-xl font-semibold text-marino">Personal Docente y No Docente</h2>
          <p className="text-sm text-gray-500">
            Beneficios exclusivos para educadores y personal de la Red La Salle.
          </p>
          <span className="mt-2 text-marino font-medium text-sm group-hover:underline">
            Ingresar →
          </span>
        </Link>
      </div>
    </main>
  )
}
