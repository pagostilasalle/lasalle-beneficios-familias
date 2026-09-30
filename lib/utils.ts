// Normaliza texto para búsqueda sin tildes ni mayúsculas
export function normalizar(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
}

export function slugify(texto: string): string {
  return normalizar(texto)
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export function formatDate(date: string | null): string {
  if (!date) return 'Sin vencimiento'
  return new Date(date).toLocaleDateString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

export type Audience = 'familias' | 'docentes'

export function isAudience(value: string): value is Audience {
  return value === 'familias' || value === 'docentes'
}

export function audienceLabel(audience: Audience): string {
  return audience === 'familias' ? 'Familias y Estudiantes' : 'Personal Docente y No Docente'
}
