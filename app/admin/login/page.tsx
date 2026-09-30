'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLoginPage() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
      localStorage.setItem('admin_auth', 'true')
      router.push('/admin')
    } else {
      setError(true)
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
        {error && <p className="text-red-600 text-sm">Contraseña incorrecta.</p>}
        <button type="submit" className="bg-marino hover:bg-marinoHover text-white px-6 py-3 rounded-xl font-medium transition-colors">
          Ingresar
        </button>
      </form>
    </div>
  )
}
