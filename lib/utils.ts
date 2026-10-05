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

// Las fechas de la base vienen como 'AAAA-MM-DD'. Se arman como fecha LOCAL para que no
// se corran un día por la zona horaria (new Date('2026-12-31') mostraba 30/12 en Argentina).
function parseLocalDate(date: string): Date {
  const [y, m, d] = date.slice(0, 10).split('-').map(Number)
  return new Date(y, m - 1, d)
}

export function formatDate(date: string | null): string {
  if (!date) return 'Sin fecha'
  return parseLocalDate(date).toLocaleDateString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

export type VigenciaEstado = { tone: 'none' | 'ok' | 'soon' | 'expired'; label: string }

// Estado de vigencia para el listado del admin. "soon" = vence en 30 días o menos.
export function vigenciaEstado(validUntil: string | null, hoy: Date = new Date()): VigenciaEstado {
  if (!validUntil) return { tone: 'none', label: 'Sin fecha' }
  const fin = parseLocalDate(validUntil)
  const inicioHoy = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate())
  const dias = Math.round((fin.getTime() - inicioHoy.getTime()) / 86400000)
  if (dias < 0) return { tone: 'expired', label: `Vencido el ${formatDate(validUntil)}` }
  if (dias <= 30) return { tone: 'soon', label: `Vence el ${formatDate(validUntil)}` }
  return { tone: 'ok', label: `Hasta el ${formatDate(validUntil)}` }
}

// true si el texto existe y no es solo espacios en blanco. Se usa para no mostrar secciones vacías.
export function hasText(value: string | null | undefined): boolean {
  return typeof value === 'string' && value.trim().length > 0
}

export type Audience = 'familias' | 'docentes'

export function isAudience(value: string): value is Audience {
  return value === 'familias' || value === 'docentes'
}

export function audienceLabel(audience: Audience): string {
  return audience === 'familias' ? 'Familias y Estudiantes' : 'Personal Docente y No Docente'
}

// Un convenio puede ser de una comunidad o de ambas. (FAQ y mensajes siguen siendo de una sola.)
export type BenefitAudience = Audience | 'ambas'

export function benefitAudienceLabel(audience: BenefitAudience): string {
  return audience === 'ambas' ? 'Ambas comunidades' : audienceLabel(audience)
}

// Qué valores de "audience" ve cada comunidad: los suyos + los de "ambas".
export function visibleAudiences(audience: Audience): BenefitAudience[] {
  return [audience, 'ambas']
}
