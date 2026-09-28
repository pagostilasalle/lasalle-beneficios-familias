'use client'

import { useState } from 'react'
import type { Faq } from '@/lib/types'

export default function FaqAcordeon({ faqs }: { faqs: Faq[] }) {
  const [abierta, setAbierta] = useState<string | null>(faqs[0]?.id ?? null)

  return (
    <div className="flex flex-col gap-3">
      {faqs.map((faq) => {
        const abierto = abierta === faq.id
        return (
          <div key={faq.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <button
              onClick={() => setAbierta(abierto ? null : faq.id)}
              className="w-full flex items-center justify-between px-6 py-4 text-left"
            >
              <span className="font-medium text-marino">{faq.question}</span>
              <span className="text-marino">{abierto ? '−' : '+'}</span>
            </button>
            {abierto && (
              <div className="px-6 pb-5 text-gray-600 text-sm whitespace-pre-line">{faq.answer}</div>
            )}
          </div>
        )
      })}
    </div>
  )
}
