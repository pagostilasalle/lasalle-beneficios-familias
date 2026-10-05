# Comunidad de Beneficios La Salle

Sitio institucional del Distrito La Salle Argentina-Paraguay. Un solo sitio que sirve a
**dos comunidades separadas**, sin login:

- `/familias` — Familias y Estudiantes
- `/docentes` — Personal Docente y No Docente

La raíz (`/`) es una pantalla selectora: la persona elige su comunidad y a partir de ahí
navega solo dentro de ella (convenios, FAQ, contacto), sin ver contenido de la otra.

## Stack

Next.js 14 (App Router) + TypeScript, Supabase, Tailwind CSS, Resend, Vercel.
Mismo proyecto de Supabase que se usó desde el principio (`lasalle-comunidad-beneficios`) —
no hace falta crear tablas nuevas, ya tienen la columna `audience`.

## Qué cambió respecto a la primera versión

- Logo institucional real (`public/logo-lasalle.png`).
- Estructura de rutas: todo lo público vive ahora bajo `app/[audience]/...` en vez de la raíz.
- Se sacó la sección "¿Tenés una empresa y querés sumarte?" del Home — la Home ya no invita
  a empresas a contactarse; el formulario de Contacto queda simple, sin copy de venta.
- Convenios, FAQ y Mensajes de contacto ahora tienen un campo **Comunidad** (`audience`) en
  el admin, para poder cargar contenido específico de cada una.
- Los **rubros** (categorías) siguen siendo compartidos entre ambas comunidades.

## Migración desde la versión anterior (para reemplazar en tu carpeta local)

Si ya tenías el proyecto anterior corriendo en tu compu:

1. **Borrá** estas carpetas/archivos viejos (ya no se usan, quedaron reemplazados por `app/[audience]/...`):
   - `app/convenios/`
   - `app/preguntas-frecuentes/`
   - `app/contacto/`
   - `app/page.tsx` (se reemplaza por el nuevo selector)
2. Copiá todo el contenido de este ZIP sobre tu carpeta del proyecto, reemplazando lo que ya existía.
3. Tu `.env.local` (con las claves de Supabase, admin password, etc.) **no se toca** — sigue funcionando igual.
4. Corré `npm install` de nuevo (por si acaso) y `npm run dev` para probar en local.
5. `git add .`, `git commit`, `git push` — Vercel va a redeployar solo.

## Puesta en marcha (referencia general)

Ver instrucciones completas de Supabase, Resend y Vercel en las conversaciones previas del proyecto.

## Seguridad (v4)

- El backoffice **ya no escribe en la base desde el navegador**. Todo pasa por rutas del servidor
  (`/api/admin/...`) que exigen una sesión válida (cookie segura, 8 horas).
- Variables **secretas** (solo servidor, sin `NEXT_PUBLIC_`): `ADMIN_PASSWORD` y `SUPABASE_SERVICE_ROLE_KEY`.
  La variable vieja `NEXT_PUBLIC_ADMIN_PASSWORD` **ya no se usa y hay que borrarla** de Vercel y de `.env.local`.
- `supabase/security.sql` cierra los permisos públicos de la base (correr una vez, al final).

## Información interna de los convenios (v6)

- El email, teléfono, vigencia (desde/hasta) y las notas internas de cada convenio **no se muestran en el sitio**:
  solo se ven en el backoffice. Están protegidos en la base de datos (permisos por columna), no solo ocultos en pantalla.
- Las páginas públicas piden únicamente las columnas listadas en `lib/benefitColumns.ts`.
  Si se suma una columna pública nueva, hay que agregarla ahí **y** en `supabase/private-fields-2-cerrar-permisos.sql`.
- Los scripts SQL se corren en orden: `private-fields-1-...` (antes del deploy) y `private-fields-2-...` (después).
