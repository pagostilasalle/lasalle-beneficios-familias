import { createHash, createHmac, timingSafeEqual } from 'crypto'
import { cookies } from 'next/headers'

export const SESSION_COOKIE = 'admin_session'
export const SESSION_MAX_AGE = 60 * 60 * 8 // 8 horas

// La clave para firmar sesiones se deriva de dos secretos que solo existen en el servidor.
function getSecret(): Buffer | null {
  const pw = process.env.ADMIN_PASSWORD
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!pw || !key) return null
  return createHash('sha256').update(`${pw}:${key}`).digest()
}

function sign(payload: string, secret: Buffer): string {
  return createHmac('sha256', secret).update(payload).digest('hex')
}

export function checkPassword(input: string): boolean {
  const pw = process.env.ADMIN_PASSWORD
  if (!pw) return false
  const a = createHash('sha256').update(input).digest()
  const b = createHash('sha256').update(pw).digest()
  return timingSafeEqual(a, b)
}

export function createSessionToken(): string | null {
  const secret = getSecret()
  if (!secret) return null
  const payload = String(Date.now() + SESSION_MAX_AGE * 1000)
  return `${payload}.${sign(payload, secret)}`
}

export function verifySessionToken(token: string | undefined): boolean {
  if (!token) return false
  const secret = getSecret()
  if (!secret) return false
  const [payload, signature] = token.split('.')
  if (!payload || !signature) return false
  const expected = Buffer.from(sign(payload, secret))
  const received = Buffer.from(signature)
  if (expected.length !== received.length || !timingSafeEqual(expected, received)) return false
  return Number(payload) > Date.now()
}

export function isAdmin(): boolean {
  return verifySessionToken(cookies().get(SESSION_COOKIE)?.value)
}
