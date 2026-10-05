'use client'

import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'

export default function AdminAuthGuard({ children }: { children: React.ReactNode }) {
  const [listo, setListo] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    if (pathname === '/admin/login') {
      setListo(true)
      return
    }
    fetch('/api/admin/me', { credentials: 'same-origin' }).then((res) => {
      if (res.ok) setListo(true)
      else router.replace('/admin/login')
    })
  }, [pathname, router])

  if (pathname === '/admin/login') return <>{children}</>
  if (!listo) return null

  return <>{children}</>
}
