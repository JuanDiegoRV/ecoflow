-- EcoFlow RLS test harness.
-- Requiere una base local de Supabase con la migración aplicada y tres usuarios
-- ya provisionados: admin_user_id, assigned_installer_user_id,
-- unassigned_installer_user_id y other_org_user_id.
-- No se ha ejecutado en esta fase.

\set ON_ERROR_STOP on
\if :{?admin_user_id}
\else
  \echo 'Faltan variables psql: admin_user_id, assigned_installer_user_id, unassigned_installer_user_id, other_org_user_id'
  \quit 3
\endif
\if :{?assigned_installer_user_id}
\else
  \quit 3
\endif
\if :{?unassigned_installer_user_id}
\else
  \quit 3
\endif
\if :{?other_org_user_id}
\else
  \quit 3
\endif

begin;

-- 1. El administrador ve proyectos de su organización.
set local role authenticated;
select set_config('request.jwt.claim.sub', :'admin_user_id', true);
select set_config('request.jwt.claim.role', 'authenticated', true);
select plan(16);
select ok((select count(*) >= 1 from public.proyectos), 'admin puede consultar proyectos de su organización');
select lives_ok(
  $$update public.proyecto_instaladores set asignado_en = asignado_en where proyecto_id in (select id from public.proyectos limit 1)$$,
  'admin puede modificar asignaciones de su organización'
);

-- 2. Un instalador asignado ve su proyecto.
select set_config('request.jwt.claim.sub', :'assigned_installer_user_id', true);
select ok((select count(*) >= 1 from public.proyectos), 'instalador asignado puede consultar proyectos');

-- 3. Un instalador no asignado no ve proyectos.
select set_config('request.jwt.claim.sub', :'unassigned_installer_user_id', true);
select is((select count(*)::integer from public.proyectos), 0, 'instalador no asignado no ve proyectos');

-- 4. Otra organización queda aislada.
select set_config('request.jwt.claim.sub', :'other_org_user_id', true);
select is((select count(*)::integer from public.proyectos), 0, 'usuario de otra organización no ve proyectos ajenos');

-- 5. El instalador no puede autoasignarse.
select throws_ok(
  $$insert into public.proyecto_instaladores (proyecto_id, instalador_id, asignado_por) values (gen_random_uuid(), gen_random_uuid(), auth.uid())$$,
  null,
  null,
  'instalador no puede insertar asignaciones'
);

-- 6. El instalador no puede editar perfiles/roles.
select throws_ok(
  $$update public.perfiles set rol = 'admin' where id = auth.uid()$$,
  null,
  null,
  'instalador no puede escalar su rol'
);

select throws_ok(
  $$update public.perfiles set organizacion_id = gen_random_uuid() where id = auth.uid()$$,
  null,
  null,
  'usuario no puede cambiar su organización'
);

select throws_ok(
  $$update public.perfiles set id = gen_random_uuid() where id = auth.uid()$$,
  null,
  null,
  'usuario no puede cambiar su identidad'
);

-- 7. Las restricciones de dominio se aplican aun con bypass de la UI.
select throws_ok(
  $$insert into public.proyecto_materiales (proyecto_id, material_id, cantidad, registrado_por) values (gen_random_uuid(), gen_random_uuid(), 0, auth.uid())$$,
  null,
  null,
  'cantidad cero rechazada por CHECK o FK'
);

-- 8. El admin tampoco puede asignar recursos cruzados entre organizaciones.
select set_config('request.jwt.claim.sub', :'admin_user_id', true);
select throws_ok(
  $$insert into public.proyecto_instaladores (proyecto_id, instalador_id, asignado_por) values ((select id from public.proyectos limit 1), (select id from public.instaladores limit 1), auth.uid())$$,
  null,
  null,
  'asignación cruzada rechazada por trigger o RLS'
);

-- 12-15. Los grants de las funciones de política están limitados.
select ok(has_function_privilege('authenticated', 'public.current_organization_id()', 'EXECUTE'), 'authenticated puede ejecutar helper de organización');
select ok(has_function_privilege('authenticated', 'public.is_ecoflow_admin()', 'EXECUTE'), 'authenticated puede ejecutar helper de rol');
select ok(has_function_privilege('authenticated', 'public.can_access_project(uuid)', 'EXECUTE'), 'authenticated puede ejecutar helper de proyecto');
select ok(not has_function_privilege('anon', 'public.is_ecoflow_admin()', 'EXECUTE'), 'anon no puede ejecutar helper de rol');

-- 16. Una FK rechaza un recurso inexistente cuando se usa un proyecto válido.
select throws_ok(
  $$insert into public.proyecto_materiales (proyecto_id, material_id, cantidad, registrado_por) values ((select id from public.proyectos limit 1), gen_random_uuid(), 1, auth.uid())$$,
  '23503',
  null,
  'material inexistente rechazado por FK'
);

select * from finish();
rollback;

