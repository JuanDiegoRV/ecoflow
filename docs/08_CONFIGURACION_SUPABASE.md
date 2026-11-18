# EcoFlow — Configuración de Supabase de pruebas

Esta guía prepara una integración controlada. No contiene credenciales reales y no autoriza por sí misma operaciones remotas.

## 1. Crear un proyecto de pruebas

Crear un proyecto Supabase independiente del proyecto productivo y de cualquier otro proyecto académico. Esta acción requiere autorización del propietario de la cuenta y debe conservarse separada de TaskMaster AI.

No reutilizar proyectos, usuarios, claves ni bases de datos de otros sistemas.

## 2. Obtener URL y clave pública

Desde el panel del proyecto de pruebas, consultar la URL del proyecto y la clave pública `anon`/publishable. Solo la URL y la clave pública se usan en el navegador. Nunca copiar `service_role`, claves secretas o tokens al repositorio.

## 3. Configurar `.env.local`

```powershell
Copy-Item .env.example .env.local
```

Editar `.env.local` con valores del proyecto de pruebas:

```text
VITE_SUPABASE_URL=https://<project-ref>.supabase.co
VITE_SUPABASE_ANON_KEY=<public-anon-key>
```

`VITE_SUPABASE_URL` debe ser la URL raíz del proyecto. No debe terminar en `/rest/v1/`; ese es el endpoint REST y produce errores de ruta durante Auth. El cliente actual tolera ese sufijo y lo elimina, pero se recomienda corregir `.env.local` manualmente.

`.env.local` está excluido por `.gitignore`. El archivo `.env.example` contiene únicamente placeholders.

El cliente en `src/config/supabase.ts` no crea una conexión si falta alguna variable. `getSupabaseClient()` lanza un error descriptivo, sin incluir valores de URL, claves ni tokens.

## 4. Aplicar migraciones de forma controlada

Primero revisar la migración y obtener autorización explícita para el entorno de pruebas. Después, con Supabase CLI instalada y autenticada en el equipo autorizado:

```bash
supabase login
supabase link --project-ref <project-ref>
supabase db push
```

Estos comandos son operaciones remotas y no se ejecutaron en esta fase. Antes de `db push` se debe confirmar el proyecto enlazado, revisar el diff y verificar que no existan migraciones destructivas.

## 5. Crear usuarios de prueba

Crear cuatro usuarios aislados en el panel Auth o mediante un flujo administrativo autorizado:

- administrador de la organización A;
- instalador asignado de la organización A;
- instalador no asignado de la organización A;
- usuario de la organización B.

No registrar contraseñas en el repositorio ni en la bitácora. Los UUID se pasan localmente al arnés de pruebas mediante variables de entorno o parámetros de `psql`.

## 6. Crear el primer administrador de forma segura

1. Crear la organización desde el SQL Editor o un backend administrativo autorizado.
2. Crear el usuario Auth desde el panel o API administrativa.
3. Insertar su fila en `public.perfiles` con `rol = 'admin'` y la organización elegida.
4. Crear perfiles `installer` y filas `public.instaladores` para los usuarios de prueba.
5. Crear proyectos, materiales y solo las asignaciones necesarias para el fixture.
6. Revisar auditoría y cerrar cualquier acceso administrativo temporal.

La aplicación web no debe aceptar `rol`, `organizacion_id` ni `service_role`. Este procedimiento requiere autorización manual y no se automatiza todavía.

## 7. Ejecutar pruebas RLS

Con la migración aplicada, pgTAP disponible y fixtures creados:

```bash
supabase test db --local
```

Para ejecución directa:

```bash
psql "$DATABASE_URL" \
  -v admin_user_id="<uuid>" \
  -v assigned_installer_user_id="<uuid>" \
  -v unassigned_installer_user_id="<uuid>" \
  -v other_org_user_id="<uuid>" \
  -f supabase/tests/rls.sql
```

No ejecutar estos comandos contra producción. El arnés cubre lectura por rol, aislamiento entre organizaciones, modificación de asignaciones, escalada de privilegios, identidad, organización, FKs y permisos de helpers `SECURITY DEFINER`.

## 8. Inspeccionar resultados

Guardar la salida de pgTAP con fecha, hash o versión de migración y entorno. Ante un fallo, detener el proceso, revisar la política/fixture y registrar el diagnóstico en `docs/05_PROMPT_LOG.md`. No marcar una prueba como pasada sin salida real.

## 9. Generar tipos oficiales

Con el proyecto local o enlazado autorizado:

```bash
npx supabase gen types typescript --local > src/types/database.generated.ts
```

Para un proyecto remoto, usar el mecanismo oficial equivalente solo con autorización y sin exponer tokens. Comparar el resultado con `src/types/database.ts`; los tipos manuales actuales no deben presentarse como generados desde Supabase.

## Limitaciones actuales

- No existe una instancia PostgreSQL local confirmada.
- No se instaló Supabase CLI ni pgTAP.
- No se ejecutaron migraciones.
- No se crearon usuarios remotos.
- No se configuró `.env.local` con valores reales.
