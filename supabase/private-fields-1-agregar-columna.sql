-- PASO 1 de 2 — Agrega la columna de notas internas.
-- Es inofensivo: no cambia nada de lo que ve el público. Correr ANTES de subir el código nuevo.
alter table public.benefits add column if not exists internal_notes text;
