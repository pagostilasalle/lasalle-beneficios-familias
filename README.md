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
