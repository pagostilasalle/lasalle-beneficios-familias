import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { getSupabaseAdmin } from '@/lib/supabaseAdmin'
import { isAudience, audienceLabel } from '@/lib/utils'

export const dynamic = 'force-dynamic'

const MAX = { name: 120, email: 160, phone: 40, message: 4000 }
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(request: Request) {
  let body: any
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Solicitud inválida.' }, { status: 400 })
  }

  const name = typeof body.name === 'string' ? body.name.trim() : ''
  const email = typeof body.email === 'string' ? body.email.trim() : ''
  const phone = typeof body.phone === 'string' ? body.phone.trim() : ''
  const message = typeof body.message === 'string' ? body.message.trim() : ''
  const audience = body.audience

  if (!name || !email || !message || !isAudience(audience) || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: 'Revisá los datos del formulario.' }, { status: 400 })
  }
  if (
    name.length > MAX.name || email.length > MAX.email ||
    phone.length > MAX.phone || message.length > MAX.message
  ) {
    return NextResponse.json({ error: 'Alguno de los campos es demasiado largo.' }, { status: 400 })
  }

  try {
    // Se guarda con la clave del servidor: la base de datos ya no acepta escrituras públicas.
    const { error: dbError } = await getSupabaseAdmin()
      .from('contact_messages')
      .insert({ name, email, phone: phone || null, message, audience, status: 'pending' })

    if (dbError) {
      console.error('Error guardando mensaje:', dbError)
      return NextResponse.json({ error: 'No pudimos guardar tu mensaje. Probá de nuevo.' }, { status: 500 })
    }
  } catch (err) {
    console.error('Error en /api/contacto (base de datos):', err)
    return NextResponse.json({ error: 'No pudimos enviar tu mensaje. Probá de nuevo.' }, { status: 500 })
  }

  // El mensaje ya quedó guardado. Si falla el aviso por mail, no se le muestra error a la persona.
  try {
    if (process.env.RESEND_API_KEY) {
      const resend = new Resend(process.env.RESEND_API_KEY)
      await resend.emails.send({
        from: `Comunidad de Beneficios La Salle <${process.env.CONTACT_FROM_EMAIL}>`,
        to: process.env.CONTACT_TO_EMAIL || 'beneficios@lasalle.edu.ar',
        reply_to: email,
        subject: `Nuevo mensaje de contacto (${audienceLabel(audience)}) — ${name}`,
        text: `Comunidad: ${audienceLabel(audience)}\nNombre: ${name}\nEmail: ${email}\nTeléfono: ${phone || '-'}\n\nMensaje:\n${message}`,
      })
    }
  } catch (err) {
    console.error('Error enviando mail con Resend:', err)
  }

  return NextResponse.json({ ok: true })
}
