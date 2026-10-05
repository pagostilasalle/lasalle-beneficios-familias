import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabaseClient'
import { BENEFIT_PUBLIC_COLUMNS } from '@/lib/benefitColumns'

// PÁGINA TEMPORAL DE DIAGNÓSTICO — borrar cuando ya no haga falta.
// No muestra nada secreto: la clave publicable y la URL de Supabase son públicas por diseño
// (igual se muestran recortadas), y no se usa la clave del servidor.
export const dynamic = 'force-dynamic'

type Resultado = { ok: boolean; filas?: number; estado?: number; error?: string }

async function probar(fn: () => PromiseLike<{ data: any; error: any }>): Promise<Resultado> {
  try {
    const { data, error } = await fn()
    if (error) return { ok: false, error: `${error.code ?? ''} ${error.message ?? error}`.trim() }
    return { ok: true, filas: Array.isArray(data) ? data.length : data ? 1 : 0 }
  } catch (e: any) {
    return { ok: false, error: `excepción: ${e?.message ?? e}` }
  }
}

async function pedidoDirecto(url: string, headers: Record<string, string>): Promise<Resultado> {
  try {
    const res = await fetch(url, { headers, cache: 'no-store' })
    const texto = await res.text()
    let filas: number | undefined
    try { const j = JSON.parse(texto); filas = Array.isArray(j) ? j.length : undefined } catch {}
    return { ok: res.ok, estado: res.status, filas, error: res.ok ? undefined : texto.slice(0, 160) }
  } catch (e: any) {
    return { ok: false, error: `excepción: ${e?.message ?? e}` }
  }
}

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''

  const entorno = {
    version_desplegada: (process.env.VERCEL_GIT_COMMIT_SHA ?? 'local').slice(0, 7),
    mensaje_del_commit: process.env.VERCEL_GIT_COMMIT_MESSAGE ?? null,
    url_supabase: url,
    clave_inicio: key ? key.slice(0, 19) : '(VACÍA)',
    clave_fin: key ? key.slice(-4) : '',
    clave_largo: key.length,
    clave_tiene_espacios_o_saltos: /\s/.test(key),
  }

  // Cliente "viejo" (como era antes del ajuste), para comparar.
  const clienteSinAjuste = createClient(url, key)
  const apikeyHeader = `${url}/rest/v1/categories?select=name`

  const pruebas = {
    '1_sitio_rubros (con ajuste, como el sitio real)': await probar(() =>
      supabase.from('categories').select('name').eq('active', true)),
    '2_sitio_convenios (con ajuste)': await probar(() =>
      supabase.from('benefits').select(BENEFIT_PUBLIC_COLUMNS).eq('status', 'active')),
    '3_sitio_convenio_con_rubro (con ajuste)': await probar(() =>
      supabase.from('benefits').select(`${BENEFIT_PUBLIC_COLUMNS}, category:categories(*)`)
        .eq('status', 'active').limit(1).single()),
    '4_sin_ajuste (cliente como antes)': await probar(() =>
      clienteSinAjuste.from('categories').select('name').eq('active', true)),
    '5_directo_solo_apikey': await pedidoDirecto(apikeyHeader, { apikey: key }),
    '6_directo_apikey_y_authorization': await pedidoDirecto(apikeyHeader, { apikey: key, Authorization: `Bearer ${key}` }),
  }

  return NextResponse.json({ entorno, pruebas }, { headers: { 'Cache-Control': 'no-store' } })
}
