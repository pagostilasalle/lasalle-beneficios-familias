-- =========================================================
-- Comunidad de Beneficios La Salle
-- Schema Supabase — proyecto compartido entre los dos sitios:
--   - Estudiantes y Familias  (audience = 'familias')
--   - Personal docente y no docente (audience = 'docentes')
-- Los rubros (categories) se comparten entre ambos públicos.
-- =========================================================

create extension if not exists "pgcrypto";

-- Rubros / categorías
create table if not exists categories (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  slug        text not null unique,
  icon        text,
  sort_order  int not null default 0,
  active      boolean not null default true,
  created_at  timestamptz not null default now()
);

-- Convenios / beneficios
create table if not exists benefits (
  id                  uuid primary key default gen_random_uuid(),
  title               text not null,
  company_name        text not null,
  category_id         uuid not null references categories(id) on delete restrict,
  audience            text not null default 'familias' check (audience in ('familias','docentes')),
  logo_url            text,
  cover_image_url     text,
  short_description   text not null,
  full_description    text not null,
  who_can_apply       text not null,
  how_to_apply        text not null,
  how_to_redeem       text not null,
  terms_conditions    text,
  external_link       text,
  contact_email       text,
  contact_phone       text,
  valid_from          date,
  valid_until         date,
  status              text not null default 'active' check (status in ('active','inactive')),
  is_featured         boolean not null default false,
  is_new              boolean not null default false,
  slug                text not null unique,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

create index if not exists idx_benefits_category on benefits(category_id);
create index if not exists idx_benefits_status on benefits(status);
create index if not exists idx_benefits_audience on benefits(audience);

-- Preguntas frecuentes
create table if not exists faqs (
  id          uuid primary key default gen_random_uuid(),
  question    text not null,
  answer      text not null,
  audience    text not null default 'familias' check (audience in ('familias','docentes')),
  sort_order  int not null default 0,
  active      boolean not null default true,
  created_at  timestamptz not null default now()
);

-- Mensajes de contacto
create table if not exists contact_messages (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  email       text not null,
  phone       text,
  message     text not null,
  audience    text not null default 'familias' check (audience in ('familias','docentes')),
  status      text not null default 'pending' check (status in ('pending','read')),
  created_at  timestamptz not null default now()
);

-- Trigger simple para updated_at en benefits
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_benefits_updated_at on benefits;
create trigger trg_benefits_updated_at
  before update on benefits
  for each row execute function set_updated_at();

-- =========================================================
-- Seed inicial de rubros
-- =========================================================
insert into categories (name, slug, icon, sort_order) values
  ('Turismo', 'turismo', 'plane', 1),
  ('Educación', 'educacion', 'graduation-cap', 2),
  ('Deportes', 'deportes', 'dumbbell', 3),
  ('Gastronomía', 'gastronomia', 'utensils', 4),
  ('Entretenimiento', 'entretenimiento', 'ticket', 5)
on conflict (slug) do nothing;

-- =========================================================
-- RLS (Row Level Security)
-- Lectura pública de datos activos; escritura solo vía
-- Service Role Key (usada por el backoffice / API routes).
-- El admin de este proyecto usa Supabase client directo con
-- la ANON key + password propia (mismo patrón que merch), así
-- que dejamos escritura abierta a la anon key igual que en
-- merch para no romper ese patrón. Si más adelante quieren
-- reforzar seguridad, migrar a Supabase Auth + políticas por rol.
-- =========================================================

alter table categories enable row level security;
alter table benefits enable row level security;
alter table faqs enable row level security;
alter table contact_messages enable row level security;

create policy "public read categories" on categories for select using (true);
create policy "public read benefits" on benefits for select using (true);
create policy "public read faqs" on faqs for select using (true);

create policy "anon write categories" on categories for all using (true) with check (true);
create policy "anon write benefits" on benefits for all using (true) with check (true);
create policy "anon write faqs" on faqs for all using (true) with check (true);
create policy "anon insert contact_messages" on contact_messages for insert with check (true);
create policy "anon read/update contact_messages" on contact_messages for select using (true);
create policy "anon update contact_messages" on contact_messages for update using (true) with check (true);
