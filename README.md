# Comunidad de Beneficios La Salle — Estudiantes y Familias

Sitio institucional del Distrito La Salle Argentina-Paraguay para difundir y gestionar
convenios/descuentos para estudiantes y familias de la Red La Salle.

Proyecto **independiente** del portal de merchandising (`lasalle-merch`), aunque comparte
la misma estética, stack técnico y patrones de diseño.

## Stack

- Next.js 14 (App Router) + TypeScript
- Supabase (base de datos + storage de logos si se necesita)
- Tailwind CSS
- Resend (envío de mails desde `beneficios@lasalle.edu.ar`)
- Vercel (hosting)

## Paleta y tipografía

- Azul marino: `#1B2A6B`
- Naranja: `#F4821F`
- Fondo: `#F5F6FA`
- Tipografía: Montserrat (400/500/600/700)

## Estructura

```
app/
  page.tsx                     Home
  convenios/page.tsx           Listado de convenios (acordeón por rubro)
  convenios/[slug]/page.tsx    Detalle de convenio
  preguntas-frecuentes/        FAQ
  contacto/                    Formulario de contacto
  api/contacto/route.ts        Envío de mail vía Resend + guardado en Supabase
  admin/                       Backoffice (login, dashboard, CRUD)
components/                    Componentes reutilizables
lib/                           Cliente de Supabase, tipos, utils (normalizar, slugify)
supabase/schema.sql            Schema completo + seed de rubros iniciales
```

## Puesta en marcha

1. Crear un proyecto nuevo en Supabase (independiente del de merch).
2. Correr `supabase/schema.sql` en el SQL Editor de Supabase. Esto crea las tablas
   (`categories`, `benefits`, `faqs`, `contact_messages`) y siembra los 5 rubros iniciales:
   Turismo, Educación, Deportes, Gastronomía, Entretenimiento.
3. Completar las variables de entorno (ver `.env.example`):
   - `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_ADMIN_PASSWORD` (password del backoffice)
   - `RESEND_API_KEY`
   - `CONTACT_TO_EMAIL` / `CONTACT_FROM_EMAIL` → `beneficios@lasalle.edu.ar`
4. Verificar en Resend que el dominio `lasalle.edu.ar` esté verificado para poder enviar
   desde `beneficios@lasalle.edu.ar` (igual que se hizo para `merchandising@lasalle.edu.ar`).
5. Agregar los assets visuales en `/public`: `logo-lasalle.png`, `banner.png`, `banner2.png`,
   `banner3.png`, `banner4.png` (mismos banners que merch, o versiones propias con la misma
   línea visual).
6. `npm install && npm run dev`

## Backoffice (`/admin`)

- Login simple por password (`NEXT_PUBLIC_ADMIN_PASSWORD`), guardado en `localStorage`,
  igual patrón que merch.
- **Convenios**: alta/edición/baja, marcar como destacado o nuevo, activar/desactivar.
- **Rubros**: alta de nuevos rubros, reordenar, activar/desactivar. Un rubro solo aparece
  en el sitio público si está activo **y** tiene al menos un convenio activo.
- **Preguntas frecuentes**: alta/edición/baja, activar/desactivar.
- **Mensajes**: bandeja de mensajes recibidos por el formulario de contacto.
- **Dashboard**: convenios activos/inactivos, convenios activos por rubro, mensajes sin leer.

## Pendientes / próximos pasos sugeridos

- Subir los banners y el logo institucional a `/public`.
- Cargar los primeros convenios reales desde `/admin/convenios/nuevo`.
- Reforzar seguridad del admin más adelante con Supabase Auth (hoy usa el mismo patrón
  simple que merch: password + anon key).
- Cuando este sitio esté validado, clonar el repo como base para el sitio de
  **Personal docente y no docente**, ajustando textos y — si corresponde — el set de
  convenios (podrían compartir o no las mismas tablas de Supabase según se defina).
