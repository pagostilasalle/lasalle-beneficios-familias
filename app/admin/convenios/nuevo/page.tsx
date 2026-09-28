import ConvenioForm from '@/components/ConvenioForm'

export default function NuevoConvenioPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-marino">Nuevo convenio</h1>
      <ConvenioForm />
    </div>
  )
}
