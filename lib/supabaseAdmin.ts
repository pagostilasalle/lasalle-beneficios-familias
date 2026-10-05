import { createClient } from '@supabase/supabase-js'

// Cliente con permisos totales. SOLO se usa en código de servidor (rutas /api).
// La clave NO lleva el prefijo NEXT_PUBLIC_, por eso nunca llega al navegador.
export function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) {
    throw new Error('Faltan variables de entorno de Supabase en el servidor.')
  }
  return createClient(url, key, { auth: { persistSession: false } })
}
