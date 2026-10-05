-- PASO 2 de 2 — Hace PRIVADOS el email, teléfono, vigencia y notas internas.
-- Correr SOLO DESPUÉS de que el código nuevo esté online (Vercel en "Ready"),
-- porque desde acá el público ya no puede pedir "todas las columnas" de un convenio.
--
-- Efecto: la clave pública (anon) solo puede leer las columnas de la lista de abajo.
-- El backoffice usa la clave del servidor, que sigue viendo todo.
-- Si se agrega una columna pública nueva en el futuro, hay que sumarla acá y en lib/benefitColumns.ts.

revoke select on public.benefits from anon, authenticated;

grant select (
  id, title, company_name, category_id, audience, logo_url, cover_image_url,
  short_description, full_description, who_can_apply, how_to_apply, how_to_redeem,
  terms_conditions, external_link, status, is_featured, is_new, slug, created_at, updated_at
) on public.benefits to anon, authenticated;
