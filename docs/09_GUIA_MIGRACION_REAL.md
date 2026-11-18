# EcoFlow — Guía de migración real en Supabase

Esta guía prepara la ejecución manual en un proyecto Supabase de pruebas. No se ejecutó ninguna operación remota durante esta fase.

## Estado previo

La migración revisada es:

`supabase/migrations/20261118120000_initial_schema.sql`

La revisión estática confirmó:

- 7 tablas de negocio.
- 7 activaciones RLS.
- 14 políticas.
- 5 funciones públicas, 3 de ellas auxiliares RLS.
- 10 triggers.
- Dependencias explícitas a `auth.users`.
- Sin `DROP`, `TRUNCATE`, `DELETE` ni `ALTER TABLE ... DROP`.

La migración no contiene operaciones destructivas sobre tablas preexistentes, pero debe ejecutarse únicamente en el proyecto de pruebas confirmado.

## 1. Confirmar el proyecto destino

En el panel de Supabase:

1. Abrir el proyecto de pruebas correcto.
2. Confirmar el `project ref` y el entorno antes de abrir SQL Editor.
3. Confirmar que no es producción ni otro proyecto académico.
4. Obtener autorización explícita para crear el esquema.

Estas comprobaciones requieren intervención manual.

## 2. Ejecutar la migración desde SQL Editor

1. Abrir **SQL Editor** → **New query**.
2. Copiar el contenido completo de `supabase/migrations/20261118120000_initial_schema.sql`.
3. Revisar que el texto coincida con el archivo local y no contenga valores secretos.
4. Ejecutar una sola vez sobre el proyecto de pruebas.
5. Si aparece un error, detenerse, conservar el mensaje y no reejecutar parcialmente sin revisar el estado.

La migración usa `auth.users`, por lo que debe ejecutarse dentro de Supabase o un entorno que tenga el esquema Auth equivalente. El SQL Editor opera con privilegios administrativos y no representa por sí mismo el comportamiento de un usuario `authenticated`.

## 3. Verificar el esquema

Después de una ejecución exitosa, copiar `supabase/tests/verify_migration.sql` en una consulta nueva y ejecutarlo. Son consultas de solo lectura y verifican:

- existencia de las siete tablas;
- activación y forzado de RLS;
- políticas por tabla y operación;
- funciones, propietarios, `SECURITY DEFINER` y configuración;
- permisos `EXECUTE` para `authenticated` y `anon`;
- triggers;
- claves foráneas y referencias a `auth.users`.

Guardar la salida con fecha y referencia de migración en la bitácora. No se debe reportar una migración como validada si estas consultas no se revisaron.

## 4. Crear la organización y el primer administrador

Primero crear el usuario desde **Authentication → Users → Add user** o mediante un flujo administrativo autorizado. No insertar manualmente en `auth.users` y no incluir contraseñas en el repositorio.

Copiar el UUID del usuario creado y reemplazar los placeholders antes de ejecutar este bloque en SQL Editor:

```sql
begin;

with nueva_organizacion as (
  insert into public.organizaciones (nombre, slug)
  values ('EcoFlow QA', 'ecoflow-qa')
  returning id
)
insert into public.perfiles (id, organizacion_id, rol, nombre_completo)
select '<AUTH_USER_UUID>'::uuid, id, 'admin', 'Administrador QA'
from nueva_organizacion;

commit;
```

Este procedimiento requiere autorización administrativa. La aplicación web no debe aceptar `rol = 'admin'`, `organizacion_id` ni claves privilegiadas.

Para los fixtures de RLS, crear también usuarios instaladores desde Auth, insertar sus perfiles con `rol = 'installer'`, crear filas en `instaladores`, y asignar solo uno de ellos a un proyecto de prueba.

## 5. Validar con usuarios autenticados reales

El SQL Editor usa un rol privilegiado y puede omitir RLS; no sirve como única prueba de autorización.

Validación recomendada:

1. Configurar la aplicación con las variables públicas del proyecto de pruebas en `.env.local`.
2. Iniciar sesión con el administrador y confirmar que solo consulta proyectos de su organización.
3. Iniciar sesión con el instalador asignado y confirmar que ve únicamente su proyecto.
4. Iniciar sesión con el instalador no asignado y confirmar que no ve proyectos.
5. Repetir con un usuario de otra organización.
6. Intentar desde el cliente cambiar rol, organización, identidad o asignación; todas las operaciones deben fallar.
7. Ejecutar `supabase/tests/rls.sql` con el fixture autorizado cuando pgTAP esté disponible.

Para inspecciones HTTP futuras se puede usar el token de sesión emitido por Auth y la clave pública `anon`; no usar `service_role` en React ni en solicitudes del navegador. Los tokens reales no deben pegarse en documentación ni logs.

## 6. Consultas preparadas

El archivo `supabase/tests/verify_migration.sql` contiene las consultas de solo lectura. No modifica tablas ni datos y debe ejecutarse después de la migración.

## 7. Riesgos y límites

- `.env.local` no se encontró durante esta revisión; no se mostraron ni se crearon valores.
- No se confirmó conexión con el proyecto remoto.
- No se ejecutó la migración ni el script de verificación.
- Deben confirmarse los propietarios efectivos de las funciones `SECURITY DEFINER`.
- Debe verificarse el comportamiento de `auth.uid()` con sesiones reales.
- Las pruebas deben ejecutarse con fixtures aislados y no con datos productivos.
