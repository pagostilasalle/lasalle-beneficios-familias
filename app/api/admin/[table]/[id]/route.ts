import { NextResponse } from 'next/server'
import { isAdmin } from '@/lib/adminAuth'
import { getSupabaseAdmin } from '@/lib/supabaseAdmin'
import { ADMIN_TABLES, pickWritable } from '@/lib/adminTables'

export const dynamic = 'force-dynamic'

type Ctx = { params: { table: string; id: string } }

export async function GET(_request: Request, { params }: Ctx) {
  if (!isAdmin()) return NextResponse.json({ error: 'No autorizado.' }, { status: 401 })
  const config = ADMIN_TABLES[params.table]
  if (!config) return NextResponse.json({ error: 'Tabla no permitida.' }, { status: 404 })

  const { data, error } = await getSupabaseAdmin()
    .from(params.table)
    .select(config.select)
    .eq('id', params.id)
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 404 })
  return NextResponse.json({ data })
}

export async function PATCH(request: Request, { params }: Ctx) {
  if (!isAdmin()) return NextResponse.json({ error: 'No autorizado.' }, { status: 401 })
  const config = ADMIN_TABLES[params.table]
  if (!config) return NextResponse.json({ error: 'Tabla no permitida.' }, { status: 404 })

  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Solicitud inválida.' }, { status: 400 })
  }

  const { data, error } = await getSupabaseAdmin()
    .from(params.table)
    .update(pickWritable(body, config.writable))
    .eq('id', params.id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ data })
}

export async function DELETE(_request: Request, { params }: Ctx) {
  if (!isAdmin()) return NextResponse.json({ error: 'No autorizado.' }, { status: 401 })
  const config = ADMIN_TABLES[params.table]
  if (!config) return NextResponse.json({ error: 'Tabla no permitida.' }, { status: 404 })

  const { error } = await getSupabaseAdmin().from(params.table).delete().eq('id', params.id)
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ ok: true })
}
