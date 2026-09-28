'use client'

import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'

export default function AdminAuthGuard({ children }: { children: React.ReactNode }) {
  const [listo, setListo] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    const auth = localStorage.getItem('admin_auth') === 'true'
    if (!auth && pathname !== '/admin/login') {
      router.replace('/admin/login')
    } else {
      setListo(true)
    }
  }, [pathname, router])

  if (pathname === '/admin/login') return <>{children}</>
  if (!listo) return null

  return <>{children}</>
}
