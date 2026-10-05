'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLoginPage() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [enviando, setEnviando] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setEnviando(true)
    setError('')
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      const json = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError(json.error || 'No se pudo ingresar.')
        setEnviando(false)
        return
      }
      router.push('/admin')
    } catch {
      setError('No se pudo conectar. Probá de nuevo.')
      setEnviando(false)
    }
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 w-full max-w-sm flex flex-col gap-4">
        <h1 className="text-xl font-semibold text-marino text-center mb-2">Ingreso al backoffice</h1>
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#1e2a65] outline-none"
        />
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button
          type="submit"
          disabled={enviando}
          className="bg-marino hover:bg-marinoHover text-white px-6 py-3 rounded-xl font-medium transition-colors disabled:opacity-60"
        >
          {enviando ? 'Ingresando...' : 'Ingresar'}
        </button>
      </form>
    </div>
  )
}
