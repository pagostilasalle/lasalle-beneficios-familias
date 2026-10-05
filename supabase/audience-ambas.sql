-- =========================================================
-- Permite que un convenio sea de "ambas" comunidades.
-- Correr UNA VEZ en el SQL Editor de Supabase.
-- Es seguro correrlo antes o después de subir el código nuevo.
-- Los convenios que ya existen no se tocan.
-- =========================================================

-- 1) Sacar la regla vieja que solo permitía 'familias' o 'docentes'
do $$
declare c record;
begin
  for c in
    select conname from pg_constraint
    where conrelid = 'public.benefits'::regclass
      and contype = 'c'
      and pg_get_constraintdef(oid) ilike '%audience%'
  loop
    execute format('alter table public.benefits drop constraint %I', c.conname);
  end loop;
end $$;

-- 2) Poner la regla nueva, que además permite 'ambas'
alter table public.benefits
  add constraint benefits_audience_check
  check (audience in ('familias', 'docentes', 'ambas'));
