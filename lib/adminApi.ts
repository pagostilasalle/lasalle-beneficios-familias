// Helper del navegador para hablar con las rutas /api/admin (la sesión viaja en una cookie segura).
async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: { 'Content-Type': 'application/json' },
    credentials: 'same-origin',
  })
  if (res.status === 401) {
    if (typeof window !== 'undefined' && window.location.pathname !== '/admin/login') {
      window.location.href = '/admin/login'
    }
    throw new Error('Sesión vencida. Volvé a ingresar.')
  }
  const json = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(json.error || 'Ocurrió un error.')
  return json as T
}

export const adminApi = {
  list: <T = any>(table: string) =>
    request<{ data: T[] }>(`/api/admin/${table}`).then((r) => r.data),
  get: <T = any>(table: string, id: string) =>
    request<{ data: T }>(`/api/admin/${table}/${id}`).then((r) => r.data),
  create: <T = any>(table: string, body: Record<string, unknown>) =>
    request<{ data: T }>(`/api/admin/${table}`, { method: 'POST', body: JSON.stringify(body) }).then((r) => r.data),
  update: <T = any>(table: string, id: string, body: Record<string, unknown>) =>
    request<{ data: T }>(`/api/admin/${table}/${id}`, { method: 'PATCH', body: JSON.stringify(body) }).then((r) => r.data),
  remove: (table: string, id: string) =>
    request<{ ok: boolean }>(`/api/admin/${table}/${id}`, { method: 'DELETE' }),
}
