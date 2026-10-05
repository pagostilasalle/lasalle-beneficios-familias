// Columnas de "benefits" que el público puede leer.
// IMPORTANTE: tiene que coincidir con el "grant select (...)" de supabase/private-fields.sql.
// Los datos internos (email, teléfono, vigencia, notas) NO están acá a propósito.
export const BENEFIT_PUBLIC_COLUMNS = [
  'id', 'title', 'company_name', 'category_id', 'audience', 'logo_url', 'cover_image_url',
  'short_description', 'full_description', 'who_can_apply', 'how_to_apply', 'how_to_redeem',
  'terms_conditions', 'external_link', 'status', 'is_featured', 'is_new', 'slug',
  'created_at', 'updated_at',
].join(', ')
