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

// Un convenio puede ser de una comunidad o de ambas. (FAQ y mensajes siguen siendo de una sola.)
export type BenefitAudience = Audience | 'ambas'

export function benefitAudienceLabel(audience: BenefitAudience): string {
  return audience === 'ambas' ? 'Ambas comunidades' : audienceLabel(audience)
}

// Qué valores de "audience" ve cada comunidad: los suyos + los de "ambas".
export function visibleAudiences(audience: Audience): BenefitAudience[] {
  return [audience, 'ambas']
}
