import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Cliente de LECTURA PÚBLICA (clave publicable). Se usa solo en las páginas del sitio.
//
// Por defecto supabase-js manda la clave en dos encabezados: "apikey" y "Authorization".
// La clave publicable no es un token de usuario, así que acá se deja únicamente "apikey",
// que es la forma documentada de usarla. (No hay sesiones de usuario en el sitio público.)
const soloApikey: typeof fetch = (input, init) => {
  const headers = new Headers(init?.headers)
  if (headers.get('Authorization') === `Bearer ${supabaseAnonKey}`) {
    headers.delete('Authorization')
  }
  return fetch(input, { ...init, headers })
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  global: { fetch: soloApikey },
})
