# EcoFlow — Guion de demostración (aprox. 4 minutos)

## 0:00–0:30 — Introducción

**Mostrar:** pantalla de login y nombre EcoFlow.

**Explicar:** EcoFlow es una aplicación interna para coordinar instalaciones solares, con proyectos, instaladores y materiales. El problema que resuelve es centralizar el seguimiento operativo y restringir la información según el rol.

## 0:30–1:00 — Arquitectura

**Mostrar:** README o `docs/ENTREGA_ARQUITECTURA_ECOFLOW.md`, sección de arquitectura.

**Explicar:** React y TypeScript organizan la interfaz por dominios; React Router protege rutas; hooks y servicios aíslan el acceso a Supabase; TanStack Query administra caché y estados de servidor.

## 1:00–1:35 — Supabase y modelo de datos

**Mostrar:** consola Supabase con el esquema y, si está autorizada, la vista de tablas/políticas. No mostrar claves.

**Explicar:** existen siete tablas: organizaciones, perfiles, instaladores, proyectos, proyecto_instaladores, materiales y proyecto_materiales. Las tablas puente resuelven relaciones N:M. `perfiles` vincula Auth con rol y organización.

## 1:35–2:05 — Autenticación y roles

**Mostrar:** iniciar sesión con un usuario de prueba; luego el menú lateral.

**Explicar:** la sesión se persiste con Supabase Auth. El rol se consulta desde `perfiles`; el administrador ve controles de gestión y el instalador no ve acciones administrativas. Esta visibilidad no reemplaza RLS.

## 2:05–2:45 — Dashboard y proyectos

**Mostrar:** tarjetas de conteo, filtros, listado, detalle y formulario de nuevo proyecto si se usa el administrador.

**Explicar:** el dashboard agrupa `pending`, `in_progress` y `completed`. El detalle muestra cliente, potencia, fecha y dirección. El formulario valida campos y potencia positiva. La organización y el usuario creador se derivan del perfil autenticado.

## 2:45–3:20 — Instaladores y materiales

**Mostrar:** detalle de proyecto con instaladores asignados y materiales utilizados; después `/materials` con catálogo.

**Explicar:** el administrador consulta instaladores activos y asigna usando `instaladores.id`; la PK compuesta evita duplicados. Los materiales respetan la unidad del esquema y los consumos exigen cantidades positivas. Repetir un material actualiza su cantidad.

## 3:20–3:45 — RLS y seguridad

**Mostrar:** políticas RLS en Supabase o la ruta `/diagnostic` con usuarios de prueba, sin mostrar tokens.

**Explicar:** el administrador ve proyectos de su organización; el Instalador QA 1 ve su proyecto asignado; el Instalador QA 2 obtiene cero proyectos; sin sesión no se consulta. Estos cuatro resultados fueron reportados manualmente por el usuario, no ejecutados automáticamente por Codex.

## 3:45–4:00 — Cierre

**Mostrar:** README y comandos `npm run lint`, `npm test`, `npm run build`.

**Explicar:** la entrega incluye arquitectura, RLS, pruebas automatizadas básicas y documentación de límites. Quedan como trabajo posterior las pruebas E2E y la validación manual de mutaciones remotas si la rúbrica las exige.

## Reglas para la grabación

- No mostrar `.env.local`, claves, contraseñas ni tokens.
- Usar únicamente usuarios de prueba autorizados.
- No ejecutar migraciones durante la demostración.
- No afirmar resultados que no estén documentados como ejecutados o reportados.
- Mantener la demostración entre 3 y 5 minutos.
