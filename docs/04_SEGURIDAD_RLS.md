# EcoFlow — Seguridad y RLS

## Identidad y autoridad

Supabase Auth autentica al usuario. La autoridad se deriva de `auth.uid()` y de `public.perfiles`, no de metadata editable desde el cliente. `raw_user_meta_data` no se usa para autorización. El frontend solo recibe la clave pública `anon`; nunca recibe `service_role`.

## Provisionamiento seguro de administradores

El registro/invitación normal no permite enviar `admin`. Una cuenta administradora se crea o eleva mediante un procedimiento controlado por un operador con acceso al proyecto, una migración revisada o una función backend con `service_role` que no se expone al navegador. Debe existir auditoría del cambio y, en producción, MFA para administradores.

## Funciones auxiliares

Se recomienda crear funciones `security definer` con `search_path` fijo y permisos mínimos:

```sql
create function public.current_profile()
returns public.perfiles
language sql stable security definer
set search_path = public
as $$
  select p.* from public.perfiles p where p.usuario_id = auth.uid();
$$;

create function public.is_admin()
returns boolean
language sql stable security definer
set search_path = public
as $$
  select exists (
    select 1 from public.perfiles p
    where p.usuario_id = auth.uid() and p.rol = 'admin'
  );
$$;
```

En la implementación real se limitará el `grant execute`, se validará que la función no sea mutable y se revisará el riesgo de recursión RLS.

## Políticas previstas

- **Perfiles:** cada usuario puede leer su propio perfil; solo el flujo administrativo controlado puede modificar roles. No hay `INSERT/UPDATE` de rol para usuarios normales.
- **Proyectos:** admin puede `SELECT/INSERT/UPDATE` dentro de su organización; installer solo `SELECT` si existe asignación en `proyecto_instaladores`.
- **Asignaciones:** admin gestiona filas de su organización; installer puede leer únicamente sus propias asignaciones.
- **Materiales:** admin gestiona catálogo de su organización; installer lee activos y no modifica catálogo.
- **Consumos:** admin gestiona consumos de proyectos de su organización; installer inserta/actualiza consumos solo de proyectos asignados, nunca de proyectos ajenos.

Ejemplo conceptual para proyectos:

```sql
alter table public.proyectos enable row level security;

create policy "admins manage organization projects"
on public.proyectos for all to authenticated
using (public.is_admin() and organizacion_id = (select organizacion_id from public.current_profile()))
with check (public.is_admin() and organizacion_id = (select organizacion_id from public.current_profile()));

create policy "installers read assigned projects"
on public.proyectos for select to authenticated
using (exists (
  select 1 from public.proyecto_instaladores pi
  join public.instaladores i on i.id = pi.instalador_id
  join public.perfiles p on p.id = i.perfil_id
  where pi.proyecto_id = proyectos.id
    and p.usuario_id = auth.uid()
));
```

El SQL es diseño de referencia, no una migración ejecutada en esta fase. Las políticas de `INSERT/UPDATE/DELETE` para instaladores deben ser explícitas y estrechas; no se usará una política amplia `for all` para ambos roles.

## Controles adicionales

- Validar origen, sesión y expiración en cliente y servidor.
- Aplicar rate limits y MFA según el entorno.
- No registrar tokens, contraseñas ni datos sensibles.
- Revisar cada política con casos positivos y negativos usando usuarios de prueba aislados.

## Implementación de esta fase

La migración `supabase/migrations/20261118120000_initial_schema.sql` activa RLS en todas las tablas de negocio y define políticas separadas para administradores, instaladores asignados y usuarios de otra organización. No se concede mutación de `perfiles` a usuarios autenticados; esto impide autoasignación de rol, cambio de identidad y cambio de organización desde el cliente.

Las funciones `current_organization_id`, `is_ecoflow_admin` y `can_access_project` son `SECURITY DEFINER` porque deben consultar `perfiles` sin provocar recursión RLS. Tienen `search_path = public, pg_temp`, no realizan mutaciones, y su `EXECUTE` se revoca a `public` y se concede solo a `authenticated`. El trigger `assert_ecoflow_organization_integrity` también es `SECURITY DEFINER`, pero se usa exclusivamente como trigger para validar relaciones cruzadas; no se expone para invocación directa.

Ese trigger valida además que los actores de auditoría (`creado_por`, `asignado_por` y `registrado_por`) pertenezcan a la misma organización que la fila afectada.

Se espera que el propietario de funciones y tablas sea el propietario administrativo de la base Supabase (normalmente `postgres` en el entorno gestionado). El rol `service_role` se reserva para operaciones operativas fuera del navegador y evade RLS únicamente bajo control del backend.

## Primer administrador

1. Crear la organización mediante un operador autorizado en el entorno de administración.
2. Crear el usuario en Supabase Auth usando el flujo administrativo, nunca desde un formulario que acepte `rol`.
3. Insertar el perfil con `rol = 'admin'` y la organización elegida desde una migración/operación controlada.
4. Verificar que la cuenta puede consultar solo su organización y registrar la operación fuera de la aplicación.
5. Crear los perfiles `installer` y sus filas en `instaladores` mediante el mismo flujo controlado hasta que exista una pantalla administrativa con RPC auditada.

La migración no crea usuarios, organizaciones ni credenciales y no se ha ejecutado.

