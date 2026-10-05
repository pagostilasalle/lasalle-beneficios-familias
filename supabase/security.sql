-- =========================================================
-- CIERRE DE PERMISOS — correr UNA VEZ en el SQL Editor de Supabase
-- DESPUÉS de que el sitio nuevo esté online y el admin funcione.
--
-- Efecto:
--  * El público (clave anon) solo puede LEER convenios activos, rubros activos
--    y preguntas frecuentes activas.
--  * Nadie con la clave pública puede escribir, borrar ni leer mensajes de contacto.
--  * Todo lo demás pasa por el servidor con la clave secreta (service role),
--    que no está sujeta a estas reglas.
-- =========================================================

-- 1) Sacar las políticas abiertas de la primera versión
drop policy if exists "public read categories" on categories;
drop policy if exists "public read benefits" on benefits;
drop policy if exists "public read faqs" on faqs;
drop policy if exists "anon write categories" on categories;
drop policy if exists "anon write benefits" on benefits;
drop policy if exists "anon write faqs" on faqs;
drop policy if exists "anon insert contact_messages" on contact_messages;
drop policy if exists "anon read/update contact_messages" on contact_messages;
drop policy if exists "anon update contact_messages" on contact_messages;

-- 2) Asegurar que RLS esté activo
alter table categories enable row level security;
alter table benefits enable row level security;
alter table faqs enable row level security;
alter table contact_messages enable row level security;

-- 3) Lectura pública, solo de contenido activo
create policy "public read active categories" on categories
  for select using (active = true);
create policy "public read active benefits" on benefits
  for select using (status = 'active');
create policy "public read active faqs" on faqs
  for select using (active = true);

-- contact_messages: sin políticas = sin acceso público de ningún tipo.

-- 4) Refuerzo: quitar permisos de escritura a los roles públicos
revoke insert, update, delete on categories, benefits, faqs from anon, authenticated;
revoke all on contact_messages from anon, authenticated;
