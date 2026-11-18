# Pruebas SQL de EcoFlow

`rls.sql` es un arnés reproducible basado en pgTAP. No se ejecutó en esta fase.

## Prerrequisitos

- Proyecto Supabase local o PostgreSQL compatible.
- Migración inicial aplicada en una base de pruebas.
- Extensión pgTAP disponible en la base de pruebas.
- Cuatro usuarios Auth y perfiles de fixture: administrador, instalador asignado, instalador no asignado y usuario de otra organización.

## Ejecución futura

```bash
supabase test db --local
```

Alternativamente, con `psql` y variables de usuario:

```bash
psql "$DATABASE_URL" \
  -v admin_user_id="<uuid>" \
  -v assigned_installer_user_id="<uuid>" \
  -v unassigned_installer_user_id="<uuid>" \
  -v other_org_user_id="<uuid>" \
  -f supabase/tests/rls.sql
```

La prueba cubre aislamiento por organización, lectura de instalador asignado/no asignado, escalada de privilegios, inserción de asignaciones, CHECK de cantidades y relaciones cruzadas. La salida real debe registrarse después de disponer de una base de pruebas; no se inventan resultados.
