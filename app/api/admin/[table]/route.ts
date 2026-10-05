import { NextResponse } from 'next/server'
import { isAdmin } from '@/lib/adminAuth'
import { getSupabaseAdmin } from '@/lib/supabaseAdmin'
import { ADMIN_TABLES, pickWritable } from '@/lib/adminTables'

export const dynamic = 'force-dynamic'

export async function GET(_request: Request, { params }: { params: { table: string } }) {
  if (!isAdmin()) return NextResponse.json({ error: 'No autorizado.' }, { status: 401 })
  const config = ADMIN_TABLES[params.table]
  if (!config) return NextResponse.json({ error: 'Tabla no permitida.' }, { status: 404 })

  const { data, error } = await getSupabaseAdmin()
    .from(params.table)
    .select(config.select)
    .order(config.order.column, { ascending: config.order.ascending })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data })
}

export async function POST(request: Request, { params }: { params: { table: string } }) {
  if (!isAdmin()) return NextResponse.json({ error: 'No autorizado.' }, { status: 401 })
  const config = ADMIN_TABLES[params.table]
  if (!config || !config.canCreate) {
    return NextResponse.json({ error: 'Operación no permitida.' }, { status: 404 })
  }

  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Solicitud inválida.' }, { status: 400 })
  }

  const { data, error } = await getSupabaseAdmin()
    .from(params.table)
    .insert(pickWritable(body, config.writable))
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ data })
}
