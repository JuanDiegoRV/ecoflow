# EcoFlow

Aplicación interna para gestionar proyectos de instalación de paneles solares, instaladores, materiales y consumos por proyecto.

## Tecnologías

- React 19 + TypeScript.
- Vite + Tailwind CSS 4.
- Supabase Auth, PostgreSQL y Row Level Security.
- React Router.
- TanStack Query.
- Vitest y Oxlint.

## Requisitos

- Node.js compatible con Vite 8.
- Proyecto Supabase de pruebas autorizado.
- Variables públicas de Supabase.

## Instalación

```bash
npm install
Copy-Item .env.example .env.local
```

Editar `.env.local` con la URL raíz del proyecto y la clave pública:

```text
VITE_SUPABASE_URL=https://<project-ref>.supabase.co
VITE_SUPABASE_ANON_KEY=<public-anon-key>
```

No usar `service_role` en React. No publicar `.env.local`.

## Ejecución local

```bash
npm run dev
```

Rutas principales:

- `/login`: autenticación.
- `/`: dashboard.
- `/projects`: listado y filtros.
- `/projects/new`: creación administrativa.
- `/materials`: catálogo de materiales.
- `/diagnostic`: diagnóstico temporal de RLS.

## Scripts

```bash
npm run lint   # Oxlint
npm test       # Vitest
npm run build  # TypeScript + Vite
```

## Estructura

```text
src/
├── components/       # layout, proyectos, materiales y estados UI
├── features/         # auth, dashboard, proyectos y materiales
├── hooks/             # sesión, perfil, consultas y mutaciones
├── lib/               # permisos y presentación
├── services/         # frontera de acceso a Supabase
├── types/            # contratos TypeScript
└── validators/       # validadores y pruebas
supabase/
├── migrations/       # esquema versionado y RLS
└── tests/            # pruebas pgTAP y verificaciones de solo lectura
docs/                  # arquitectura, seguridad, prompts y entrega
```

## Seguridad

- La autorización definitiva está en RLS.
- Los instaladores solo consultan proyectos asignados.
- Los administradores operan dentro de su organización.
- El frontend no acepta roles u organizaciones como autoridad.
- No se almacenan contraseñas ni tokens en el repositorio.
- `.env`, `.env.*`, `node_modules` y `dist` están excluidos; `.env.example` sí se conserva.

## Estado académico

Implementado: autenticación, dashboard, proyectos, instaladores, materiales, consumos, estados, RLS y pruebas unitarias básicas.

Pendiente de validación manual: pruebas de navegador de mutaciones contra Supabase, pruebas E2E y generación de tipos oficiales desde una instancia conectada.

Consulta [docs/ENTREGA_ARQUITECTURA_ECOFLOW.md](docs/ENTREGA_ARQUITECTURA_ECOFLOW.md) para la arquitectura completa y [docs/GUIÓN_DEMO_3_A_5_MIN.md](docs/GUIÓN_DEMO_3_A_5_MIN.md) para la demostración.
