import ContactoForm from '@/components/ContactoForm'

export default function ContactoPage() {
  return (
    <>
      <section
        className="relative"
        style={{ backgroundImage: 'url(/banner.png)', backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        <div className="absolute inset-0 bg-[#1B2A6B]/80" />
        <div className="relative max-w-4xl mx-auto px-4 py-16 text-center text-white">
          <h1 className="text-3xl font-bold mb-2">Contacto</h1>
          <p className="text-white/85">
            ¿Tenés dudas sobre un convenio o querés proponer una alianza? Escribinos.
          </p>
        </div>
      </section>

      <section className="max-w-xl mx-auto px-4 py-12">
        <ContactoForm />
      </section>
    </>
  )
}
