'use client'

import { useState } from 'react'

export default function ContactoForm() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' })
  const [estado, setEstado] = useState<'idle' | 'enviando' | 'ok' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setEstado('enviando')
    try {
      const res = await fetch('/api/contacto', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error()
      setEstado('ok')
      setForm({ name: '', email: '', phone: '', message: '' })
    } catch {
      setEstado('error')
    }
  }

  if (estado === 'ok') {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
        <h2 className="text-xl font-semibold text-marino mb-2">¡Gracias por escribirnos!</h2>
        <p className="text-gray-600">Te vamos a responder a la brevedad.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col gap-4">
      <div>
        <label className="block text-sm font-medium text-marino mb-1">Nombre y apellido</label>
        <input
          required
          type="text"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#1B2A6B] outline-none"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-marino mb-1">Email</label>
        <input
          required
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#1B2A6B] outline-none"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-marino mb-1">Teléfono (opcional)</label>
        <input
          type="tel"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#1B2A6B] outline-none"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-marino mb-1">Mensaje</label>
        <textarea
          required
          rows={5}
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#1B2A6B] outline-none"
        />
      </div>

      {estado === 'error' && (
        <p className="text-red-600 text-sm">No pudimos enviar tu mensaje. Probá de nuevo.</p>
      )}

      <button
        type="submit"
        disabled={estado === 'enviando'}
        className="bg-naranja hover:bg-naranjaHover text-white px-6 py-3 rounded-xl font-medium transition-colors disabled:opacity-60"
      >
        {estado === 'enviando' ? 'Enviando...' : 'Enviar mensaje'}
      </button>
    </form>
  )
}
