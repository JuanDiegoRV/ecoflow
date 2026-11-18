-- EcoFlow: consultas de verificación de solo lectura.
-- Ejecutar después de aplicar la migración en el proyecto de pruebas.
-- No crea, modifica ni elimina datos.

-- 1. Existencia de las siete tablas.
select expected.table_name,
       to_regclass('public.' || expected.table_name) is not null as exists
from (values
  ('organizaciones'), ('perfiles'), ('instaladores'), ('proyectos'),
  ('proyecto_instaladores'), ('materiales'), ('proyecto_materiales')
) as expected(table_name)
order by expected.table_name;

-- 2. RLS habilitada y forzada en tablas de negocio.
select c.relname as table_name,
       c.relrowsecurity as rls_enabled,
       c.relforcerowsecurity as rls_forced
from pg_class c
join pg_namespace n on n.oid = c.relnamespace
where n.nspname = 'public'
  and c.relname in (
    'organizaciones', 'perfiles', 'instaladores', 'proyectos',
    'proyecto_instaladores', 'materiales', 'proyecto_materiales'
  )
order by c.relname;

-- 3. Políticas por tabla, operación y roles.
select schemaname, tablename, policyname, permissive, roles, cmd,
       qual, with_check
from pg_policies
where schemaname = 'public'
order by tablename, policyname;

-- 4. Funciones auxiliares, seguridad y configuración de search_path.
select n.nspname as schema_name,
       p.proname as function_name,
       pg_get_function_identity_arguments(p.oid) as arguments,
       p.prosecdef as security_definer,
       p.proconfig as configuration,
       pg_get_userbyid(p.proowner) as owner
from pg_proc p
join pg_namespace n on n.oid = p.pronamespace
where n.nspname = 'public'
  and p.proname in ('current_organization_id', 'is_ecoflow_admin', 'can_access_project')
order by p.proname;

-- 5. EXECUTE explícito de helpers: authenticated sí, anon/public no.
select has_function_privilege('authenticated', 'public.current_organization_id()', 'EXECUTE') as authenticated_org,
       has_function_privilege('authenticated', 'public.is_ecoflow_admin()', 'EXECUTE') as authenticated_admin,
       has_function_privilege('authenticated', 'public.can_access_project(uuid)', 'EXECUTE') as authenticated_project,
       has_function_privilege('anon', 'public.is_ecoflow_admin()', 'EXECUTE') as anon_admin;

-- 6. Triggers de auditoría e integridad.
select event_object_table as table_name,
       trigger_name,
       action_timing,
       event_manipulation,
       action_statement
from information_schema.triggers
where trigger_schema = 'public'
order by event_object_table, trigger_name;

-- 7. Relaciones y claves foráneas.
select con.conname as constraint_name,
       rel.relname as table_name,
       ref.relname as referenced_table,
       pg_get_constraintdef(con.oid) as definition
from pg_constraint con
join pg_class rel on rel.oid = con.conrelid
join pg_namespace rel_ns on rel_ns.oid = rel.relnamespace
join pg_class ref on ref.oid = con.confrelid
where con.contype = 'f'
  and rel_ns.nspname = 'public'
order by rel.relname, con.conname;

-- 8. Referencias a auth.users.
select con.conname as constraint_name,
       rel.relname as table_name,
       pg_get_constraintdef(con.oid) as definition
from pg_constraint con
join pg_class rel on rel.oid = con.conrelid
join pg_class ref on ref.oid = con.confrelid
join pg_namespace ref_ns on ref_ns.oid = ref.relnamespace
where con.contype = 'f'
  and ref_ns.nspname = 'auth'
  and ref.relname = 'users'
order by rel.relname, con.conname;

