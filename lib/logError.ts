// Deja anotado en los registros del servidor (Vercel → Logs) por qué falló una consulta,
// para que un error de la base no se confunda con "no hay contenido".
export function logError(donde: string, error: unknown) {
  if (error) console.error(`[sitio-publico] ${donde}:`, JSON.stringify(error))
}
