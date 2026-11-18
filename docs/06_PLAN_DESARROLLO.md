# EcoFlow — Plan de desarrollo

## Fase 1 — Completada

- Scaffold React + TypeScript + Vite.
- Tailwind compatible con Vite.
- Estructura modular y carpeta `supabase/migrations` reservada.
- Especificación, arquitectura, datos, seguridad, bitácora y plan.
- Validaciones del scaffold ejecutadas.

## Fase 2 — Fundación de aplicación

1. Añadir cliente Supabase mediante variables de entorno documentadas, sin secretos en git.
2. Implementar tipos de dominio y validadores.
3. Crear migraciones versionadas y probarlas localmente.
4. Implementar `AuthProvider`, login, logout y recuperación de sesión.
5. Implementar `ProtectedRoute` y `RoleGate`.

## Fase 3 — Proyectos y dashboard

1. Servicios y hooks de proyectos.
2. Lista paginada y filtros por estado.
3. Formulario de alta/edición.
4. Asignación múltiple de instaladores.
5. Dashboard con estados de carga/error/vacío.

## Fase 4 — Materiales

1. Catálogo administrativo.
2. Registro de consumos por proyecto.
3. Validación de cantidades y unidades.
4. Revisión de permisos para instaladores asignados.

## Fase 5 — Calidad y entrega

- Pruebas unitarias, componentes, integración, E2E y RLS.
- Accesibilidad, responsive, rendimiento y revisión de errores.
- Documentación de decisiones y resultados reales.
- Revisión de seguridad y checklist de despliegue.

## Definition of Done por fase

Una fase termina cuando la funcionalidad tiene tipos, validación, estados de UI, permisos RLS si aplica, documentación y verificaciones ejecutadas. Los resultados se registran como evidencia; si una prueba no se ejecutó, se marca como pendiente.

## Verificaciones de esta fase

- `npm install`: correcto; dependencias instaladas.
- `npm audit`: correcto en la instalación reportada; 0 vulnerabilidades.
- `npm run build`: correcto; TypeScript y Vite generaron `dist/` sin errores.
- `npm run lint`: correcto; Oxlint no reportó errores.
- Migraciones, Supabase y pruebas funcionales: no ejecutadas por restricción de alcance.

## Fase 2 — Estado de esta entrega

- Migración preparada: `supabase/migrations/20261118120000_initial_schema.sql`.
- Pruebas SQL preparadas: `supabase/tests/rls.sql`.
- Tipos manuales preparados: `src/types/database.ts`.
- No se ejecutó la migración porque el Prompt 02 indica prepararla sin conectar una instancia remota y no hay una instancia PostgreSQL local confirmada.
- No se instaló Supabase CLI ni pgTAP; la prueba SQL documenta pgTAP como prerrequisito opcional del entorno de ejecución.

## Fase 3 — Preparación de integración Supabase

- Añadido `@supabase/supabase-js` sin conectar una instancia.
- Añadidos `src/config/supabase.ts` y `.env.example`.
- La configuración devuelve un cliente `null` cuando faltan variables y expone un error accionable sin revelar secretos.
- `*.env` queda excluido por `.gitignore`; `.env.example` se conserva.
- Añadida la guía [08_CONFIGURACION_SUPABASE.md](08_CONFIGURACION_SUPABASE.md).
- Auditoría SQL documentada; no se ejecutó migración ni prueba remota.
- Auditoría adicional: los actores de auditoría (`creado_por`, `asignado_por`, `registrado_por`) deben pertenecer a la organización de la fila mediante trigger.

## Fase 5 — Dashboard y gestión de proyectos

- Instaladas dependencias: `@tanstack/react-query` y `react-router-dom`.
- Añadido `AuthProvider`, rutas protegidas, sincronización de sesión y consulta de perfil/rol.
- Añadidos servicios para Auth, perfiles y proyectos.
- Añadidos hooks `useAuth`, `useCurrentProfile`, `useProjects` y mutación de creación.
- Implementados dashboard, listado filtrable, detalle y formulario administrativo de proyectos.
- Conservada la ruta temporal `/diagnostic` para repetir pruebas RLS.
- El formulario no recibe `organizacion_id`; lo obtiene del perfil autenticado y `creado_por` se deriva del usuario real.
- Los cuatro escenarios RLS fueron reportados exitosos por el usuario; Codex no los ejecutó automáticamente.
- Pruebas de navegador con cada rol: pendientes de ejecución por Codex; los cuatro escenarios RLS fueron reportados por el usuario.
- El bundle inicial quedó optimizado con chunks separados y sin aviso de tamaño superior a 500 kB.

## Fase 6 — Funcionalidad final y optimización

- Asignación administrativa de instaladores activos por proyecto, con prevención visual de duplicados e invalidación de caché.
- Catálogo de materiales con creación administrativa y consulta según RLS.
- Asociación/upsert de materiales y cantidades por proyecto.
- Cambio de estado administrativo entre `pending`, `in_progress` y `completed`.
- Validación de cantidades positivas y campos obligatorios.
- División de código con `React.lazy`/`Suspense` y chunks manuales de Supabase, Router y Query.
- Pruebas Vitest de validadores, etiquetas de estado, unidades y permisos de presentación.
- No se modificaron migraciones, políticas RLS ni datos remotos.

## Fase 4 — Preparación de migración real

- Guía manual creada: `docs/09_GUIA_MIGRACION_REAL.md`.
- Consultas de verificación de solo lectura creadas: `supabase/tests/verify_migration.sql`.
- La migración quedó preparada para revisión manual en SQL Editor.
- `.env.local` no fue encontrado durante la comprobación; no se mostraron ni crearon valores.
- No se conectó Supabase, no se ejecutó SQL remoto y no se modificaron datos.

