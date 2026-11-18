-- EcoFlow / Prompt 02
-- Diseño versionado. Esta migración se prepara pero no se ejecuta en esta fase.

create extension if not exists pgcrypto;

create table public.organizaciones (
  id uuid primary key default gen_random_uuid(),
  nombre text not null check (length(trim(nombre)) between 2 and 120),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.perfiles (
  id uuid primary key references auth.users(id) on delete cascade,
  organizacion_id uuid not null references public.organizaciones(id) on delete restrict,
  rol text not null default 'installer' check (rol in ('admin', 'installer')),
  nombre_completo text not null check (length(trim(nombre_completo)) between 2 and 160),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.instaladores (
  id uuid primary key default gen_random_uuid(),
  perfil_id uuid not null unique references public.perfiles(id) on delete restrict,
  telefono text check (telefono is null or length(trim(telefono)) <= 30),
  activo boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.proyectos (
  id uuid primary key default gen_random_uuid(),
  organizacion_id uuid not null references public.organizaciones(id) on delete restrict,
  nombre text not null check (length(trim(nombre)) between 2 and 160),
  cliente_nombre text not null check (length(trim(cliente_nombre)) between 2 and 160),
  direccion text not null check (length(trim(direccion)) between 5 and 300),
  potencia_kw numeric(10, 2) not null check (potencia_kw > 0 and potencia_kw <= 100000),
  estado text not null default 'pending' check (estado in ('pending', 'in_progress', 'completed')),
  fecha_planificada date,
  notas text check (notas is null or length(notas) <= 5000),
  creado_por uuid not null references auth.users(id) on delete restrict,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  check (fecha_planificada is null or fecha_planificada >= created_at::date)
);

create table public.materiales (
  id uuid primary key default gen_random_uuid(),
  organizacion_id uuid not null references public.organizaciones(id) on delete restrict,
  nombre text not null check (length(trim(nombre)) between 2 and 160),
  unidad text not null check (unidad in ('unit', 'meter', 'kilogram', 'liter', 'box')),
  activo boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (organizacion_id, nombre)
);

create table public.proyecto_instaladores (
  proyecto_id uuid not null references public.proyectos(id) on delete cascade,
  instalador_id uuid not null references public.instaladores(id) on delete restrict,
  asignado_por uuid not null references auth.users(id) on delete restrict,
  asignado_en timestamptz not null default timezone('utc', now()),
  primary key (proyecto_id, instalador_id)
);

create table public.proyecto_materiales (
  proyecto_id uuid not null references public.proyectos(id) on delete cascade,
  material_id uuid not null references public.materiales(id) on delete restrict,
  cantidad numeric(12, 3) not null check (cantidad > 0),
  registrado_por uuid not null references auth.users(id) on delete restrict,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  primary key (proyecto_id, material_id)
);

create index proyectos_organizacion_estado_idx on public.proyectos (organizacion_id, estado);
create index proyectos_fecha_planificada_idx on public.proyectos (fecha_planificada);
create index perfiles_organizacion_rol_idx on public.perfiles (organizacion_id, rol);
create index proyecto_instaladores_instalador_proyecto_idx on public.proyecto_instaladores (instalador_id, proyecto_id);
create index materiales_organizacion_activo_idx on public.materiales (organizacion_id, activo);
create index proyecto_materiales_material_idx on public.proyecto_materiales (material_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public, pg_temp
as $$
begin
  new.updated_at := timezone('utc', now());
  return new;
end;
$$;

create trigger organizaciones_set_updated_at before update on public.organizaciones
for each row execute function public.set_updated_at();
create trigger perfiles_set_updated_at before update on public.perfiles
for each row execute function public.set_updated_at();
create trigger instaladores_set_updated_at before update on public.instaladores
for each row execute function public.set_updated_at();
create trigger proyectos_set_updated_at before update on public.proyectos
for each row execute function public.set_updated_at();
create trigger materiales_set_updated_at before update on public.materiales
for each row execute function public.set_updated_at();
create trigger proyecto_materiales_set_updated_at before update on public.proyecto_materiales
for each row execute function public.set_updated_at();

-- Integridad que cruza filas: evita relaciones entre organizaciones distintas.
create or replace function public.assert_ecoflow_organization_integrity()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  project_org uuid;
  installer_org uuid;
  material_org uuid;
  actor_org uuid;
begin
  if tg_table_name = 'proyectos' then
    select p.organizacion_id into actor_org from public.perfiles p where p.id = new.creado_por;
    if actor_org is null or actor_org <> new.organizacion_id then
      raise exception 'El creador del proyecto debe pertenecer a la misma organización';
    end if;
  elsif tg_table_name = 'instaladores' then
    if not exists (
      select 1 from public.perfiles p where p.id = new.perfil_id and p.rol = 'installer'
    ) then
      raise exception 'El perfil de un instalador debe tener rol installer';
    end if;
  elsif tg_table_name = 'proyecto_instaladores' then
    select p.organizacion_id into project_org from public.proyectos p where p.id = new.proyecto_id;
    select p.organizacion_id into installer_org
      from public.instaladores i join public.perfiles p on p.id = i.perfil_id
      where i.id = new.instalador_id;
    select organizacion_id into actor_org from public.perfiles where id = new.asignado_por;
    if project_org is null or installer_org is null or actor_org is null
      or project_org <> installer_org or project_org <> actor_org then
      raise exception 'Proyecto e instalador deben pertenecer a la misma organización';
    end if;
  elsif tg_table_name = 'proyecto_materiales' then
    select organizacion_id into project_org from public.proyectos where id = new.proyecto_id;
    select organizacion_id into material_org from public.materiales where id = new.material_id;
    select organizacion_id into actor_org from public.perfiles where id = new.registrado_por;
    if project_org is null or material_org is null or actor_org is null
      or project_org <> material_org or project_org <> actor_org then
      raise exception 'Proyecto y material deben pertenecer a la misma organización';
    end if;
  end if;
  return new;
end;
$$;

create trigger instaladores_organization_guard before insert or update on public.instaladores
for each row execute function public.assert_ecoflow_organization_integrity();
create trigger proyectos_actor_organization_guard before insert or update on public.proyectos
for each row execute function public.assert_ecoflow_organization_integrity();
create trigger proyecto_instaladores_organization_guard before insert or update on public.proyecto_instaladores
for each row execute function public.assert_ecoflow_organization_integrity();
create trigger proyecto_materiales_organization_guard before insert or update on public.proyecto_materiales
for each row execute function public.assert_ecoflow_organization_integrity();

-- Funciones usadas por RLS. SECURITY DEFINER evita recursión al consultar perfiles.
create or replace function public.current_organization_id()
returns uuid
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select p.organizacion_id from public.perfiles p where p.id = auth.uid();
$$;

create or replace function public.is_ecoflow_admin()
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select exists (
    select 1 from public.perfiles p
    where p.id = auth.uid() and p.rol = 'admin'
  );
$$;

create or replace function public.can_access_project(target_project_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select public.is_ecoflow_admin() and exists (
    select 1 from public.proyectos p where p.id = target_project_id and p.organizacion_id = public.current_organization_id()
  )
  or exists (
    select 1
    from public.proyecto_instaladores pi
    join public.instaladores i on i.id = pi.instalador_id
    join public.perfiles pf on pf.id = i.perfil_id
    join public.proyectos p on p.id = pi.proyecto_id
    where pi.proyecto_id = target_project_id
      and pf.id = auth.uid()
      and p.organizacion_id = pf.organizacion_id
  );
$$;

revoke all on function public.current_organization_id() from public;
revoke all on function public.is_ecoflow_admin() from public;
revoke all on function public.can_access_project(uuid) from public;
grant execute on function public.current_organization_id() to authenticated;
grant execute on function public.is_ecoflow_admin() to authenticated;
grant execute on function public.can_access_project(uuid) to authenticated;

alter table public.organizaciones enable row level security;
alter table public.perfiles enable row level security;
alter table public.instaladores enable row level security;
alter table public.proyectos enable row level security;
alter table public.proyecto_instaladores enable row level security;
alter table public.materiales enable row level security;
alter table public.proyecto_materiales enable row level security;

create policy organizaciones_select_same_org on public.organizaciones
for select to authenticated using (id = public.current_organization_id());

create policy perfiles_select_self_or_admin on public.perfiles
for select to authenticated using (id = auth.uid() or (public.is_ecoflow_admin() and organizacion_id = public.current_organization_id()));

create policy instaladores_admin_manage on public.instaladores
for all to authenticated
using (public.is_ecoflow_admin() and exists (select 1 from public.perfiles p where p.id = perfil_id and p.organizacion_id = public.current_organization_id()))
with check (public.is_ecoflow_admin() and exists (select 1 from public.perfiles p where p.id = perfil_id and p.organizacion_id = public.current_organization_id() and p.rol = 'installer'));

create policy instaladores_installer_read_org on public.instaladores
for select to authenticated using (exists (select 1 from public.perfiles p where p.id = perfil_id and p.organizacion_id = public.current_organization_id()));

create policy proyectos_admin_manage_org on public.proyectos
for all to authenticated
using (public.is_ecoflow_admin() and organizacion_id = public.current_organization_id())
with check (public.is_ecoflow_admin() and organizacion_id = public.current_organization_id());

create policy proyectos_installer_read_assigned on public.proyectos
for select to authenticated using (public.can_access_project(id) and not public.is_ecoflow_admin());

create policy asignaciones_admin_manage_org on public.proyecto_instaladores
for all to authenticated
using (public.is_ecoflow_admin() and exists (select 1 from public.proyectos p where p.id = proyecto_id and p.organizacion_id = public.current_organization_id()))
with check (public.is_ecoflow_admin() and exists (select 1 from public.proyectos p join public.instaladores i on i.id = instalador_id join public.perfiles pf on pf.id = i.perfil_id where p.id = proyecto_id and p.organizacion_id = public.current_organization_id() and pf.organizacion_id = p.organizacion_id));

create policy asignaciones_installer_read_self on public.proyecto_instaladores
for select to authenticated using (exists (select 1 from public.instaladores i join public.perfiles p on p.id = i.perfil_id where i.id = instalador_id and p.id = auth.uid()));

create policy materiales_admin_manage_org on public.materiales
for all to authenticated
using (public.is_ecoflow_admin() and organizacion_id = public.current_organization_id())
with check (public.is_ecoflow_admin() and organizacion_id = public.current_organization_id());

create policy materiales_installer_read_active_org on public.materiales
for select to authenticated using (activo and organizacion_id = public.current_organization_id());

create policy consumos_admin_manage_org on public.proyecto_materiales
for all to authenticated
using (public.is_ecoflow_admin() and exists (select 1 from public.proyectos p where p.id = proyecto_id and p.organizacion_id = public.current_organization_id()))
with check (public.is_ecoflow_admin() and exists (select 1 from public.proyectos p join public.materiales m on m.id = material_id where p.id = proyecto_id and p.organizacion_id = public.current_organization_id() and m.organizacion_id = p.organizacion_id));

create policy consumos_installer_read_or_write_assigned on public.proyecto_materiales
for select to authenticated using (public.can_access_project(proyecto_id) and not public.is_ecoflow_admin());

create policy consumos_installer_insert_assigned on public.proyecto_materiales
for insert to authenticated
with check (not public.is_ecoflow_admin() and public.can_access_project(proyecto_id) and exists (select 1 from public.materiales m where m.id = material_id and m.organizacion_id = public.current_organization_id() and m.activo));

create policy consumos_installer_update_assigned on public.proyecto_materiales
for update to authenticated
using (not public.is_ecoflow_admin() and public.can_access_project(proyecto_id))
with check (not public.is_ecoflow_admin() and public.can_access_project(proyecto_id) and exists (select 1 from public.materiales m where m.id = material_id and m.organizacion_id = public.current_organization_id() and m.activo));

