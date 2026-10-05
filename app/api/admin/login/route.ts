import { NextResponse } from 'next/server'
import { checkPassword, createSessionToken, SESSION_COOKIE, SESSION_MAX_AGE } from '@/lib/adminAuth'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  let password = ''
  try {
    const body = await request.json()
    password = typeof body.password === 'string' ? body.password : ''
  } catch {
    return NextResponse.json({ error: 'Solicitud inválida.' }, { status: 400 })
  }

  if (!checkPassword(password)) {
    // Pequeña demora para desalentar intentos automáticos de adivinar la contraseña.
    await new Promise((resolve) => setTimeout(resolve, 700))
    return NextResponse.json({ error: 'Contraseña incorrecta.' }, { status: 401 })
  }

  const token = createSessionToken()
  if (!token) {
    return NextResponse.json({ error: 'El servidor no está configurado.' }, { status: 500 })
  }

  const response = NextResponse.json({ ok: true })
  response.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: SESSION_MAX_AGE,
  })
  return response
}
