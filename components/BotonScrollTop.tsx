'use client'

import { useEffect, useState } from 'react'

export default function BotonScrollTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (!visible) return null

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed bottom-6 right-6 z-50 bg-marino hover:bg-marinoHover text-white rounded-xl shadow-lg w-11 h-11 flex items-center justify-center transition-colors"
      aria-label="Volver arriba"
    >
      ↑
    </button>
  )
}
