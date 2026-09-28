import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { supabase } from '@/lib/supabaseClient'

export async function POST(request: Request) {
  const resend = new Resend(process.env.RESEND_API_KEY)

  try {
    const { name, email, phone, message } = await request.json()

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Faltan campos obligatorios.' }, { status: 400 })
    }

    // Guardamos el mensaje en Supabase (igual patrón que "pedidos" en merch)
    const { error: dbError } = await supabase
      .from('contact_messages')
      .insert({ name, email, phone: phone || null, message, status: 'pending' })

    if (dbError) {
      console.error('Error guardando mensaje:', dbError)
    }

    // Enviamos el mail vía Resend
    await resend.emails.send({
      from: `Comunidad de Beneficios La Salle <${process.env.CONTACT_FROM_EMAIL}>`,
      to: process.env.CONTACT_TO_EMAIL || 'beneficios@lasalle.edu.ar',
      reply_to: email,
      subject: `Nuevo mensaje de contacto — ${name}`,
      text: `Nombre: ${name}\nEmail: ${email}\nTeléfono: ${phone || '-'}\n\nMensaje:\n${message}`,
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Error en /api/contacto:', err)
    return NextResponse.json({ error: 'No pudimos enviar tu mensaje. Probá de nuevo.' }, { status: 500 })
  }
}