// Tablas que el backoffice puede manejar, y qué columnas se pueden escribir en cada una.
type TableConfig = {
  select: string
  order: { column: string; ascending: boolean }
  writable: string[]
  canCreate: boolean
}

export const ADMIN_TABLES: Record<string, TableConfig> = {
  benefits: {
    select: '*, category:categories(*)',
    order: { column: 'created_at', ascending: false },
    canCreate: true,
    writable: [
      'title', 'company_name', 'category_id', 'audience', 'logo_url', 'cover_image_url',
      'short_description', 'full_description', 'who_can_apply', 'how_to_apply', 'how_to_redeem',
      'terms_conditions', 'external_link', 'contact_email', 'contact_phone', 'internal_notes',
      'valid_from', 'valid_until', 'status', 'is_featured', 'is_new', 'slug',
    ],
  },
  categories: {
    select: '*',
    order: { column: 'sort_order', ascending: true },
    canCreate: true,
    writable: ['name', 'slug', 'icon', 'sort_order', 'active'],
  },
  faqs: {
    select: '*',
    order: { column: 'sort_order', ascending: true },
    canCreate: true,
    writable: ['question', 'answer', 'audience', 'sort_order', 'active'],
  },
  contact_messages: {
    select: '*',
    order: { column: 'created_at', ascending: false },
    canCreate: false,
    writable: ['status'],
  },
}

export function pickWritable(body: Record<string, unknown>, writable: string[]) {
  const out: Record<string, unknown> = {}
  for (const key of writable) {
    if (key in body) out[key] = body[key]
  }
  return out
}
