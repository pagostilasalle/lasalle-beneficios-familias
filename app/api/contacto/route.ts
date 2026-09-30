import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { supabase } from '@/lib/supabaseClient'
import { isAudience, audienceLabel } from '@/lib/utils'

export async function POST(request: Request) {
  const resend = new Resend(process.env.RESEND_API_KEY)

  try {
    const { name, email, phone, message, audience } = await request.json()

    if (!name || !email || !message || !isAudience(audience)) {
      return NextResponse.json({ error: 'Faltan campos obligatorios.' }, { status: 400 })
    }

    const { error: dbError } = await supabase
      .from('contact_messages')
      .insert({ name, email, phone: phone || null, message, audience, status: 'pending' })

    if (dbError) {
      console.error('Error guardando mensaje:', dbError)
    }

    await resend.emails.send({
      from: `Comunidad de Beneficios La Salle <${process.env.CONTACT_FROM_EMAIL}>`,
      to: process.env.CONTACT_TO_EMAIL || 'beneficios@lasalle.edu.ar',
      reply_to: email,
      subject: `Nuevo mensaje de contacto (${audienceLabel(audience)}) — ${name}`,
      text: `Comunidad: ${audienceLabel(audience)}\nNombre: ${name}\nEmail: ${email}\nTeléfono: ${phone || '-'}\n\nMensaje:\n${message}`,
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Error en /api/contacto:', err)
    return NextResponse.json({ error: 'No pudimos enviar tu mensaje. Probá de nuevo.' }, { status: 500 })
  }
}
