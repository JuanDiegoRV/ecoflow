# EcoFlow — Validación SQL

## Estado

Estado: preparado, no ejecutado. No se confirmó una instancia PostgreSQL local ni se conectó Supabase remoto.

## Artefactos

- Migración: `supabase/migrations/20261118120000_initial_schema.sql`.
- Prueba RLS: `supabase/tests/rls.sql`.
- Instrucciones de ejecución: `supabase/tests/README.md`.
- Tipos manuales: `src/types/database.ts`.

## Matriz de permisos prevista

| Recurso/operación | Admin de organización | Instalador asignado | Instalador no asignado | Otra organización |
|---|---:|---:|---:|---:|
| Consultar proyectos | Sí, propios | Sí, asignados | No | No |
| Crear/editar proyectos | Sí | No | No | No |
| Gestionar asignaciones | Sí | No | No | No |
| Consultar materiales activos | Sí | Sí, de su organización | Sí, de su organización | No |
| Gestionar catálogo | Sí | No | No | No |
| Registrar consumos | Sí | Sí, en asignados | No | No |
| Modificar perfiles/roles | Flujo controlado | No | No | No |
| Crear organizaciones | Flujo operativo | No | No | No |

## Casos cubiertos por las pruebas

1. Administrador autorizado consulta proyectos de su organización.
2. Instalador asignado consulta proyectos asignados.
3. Instalador no asignado obtiene cero proyectos.
4. Usuario de otra organización queda aislado.
5. Instalador no puede insertar una asignación.
6. Instalador no puede escalar su rol a administrador.
7. `CHECK` y FKs rechazan consumos inválidos.
8. Trigger/RLS rechaza asignaciones cruzadas entre organizaciones.
9. El rol `authenticated` conserva únicamente el `EXECUTE` previsto sobre los helpers de política.
10. Una FK rechaza un material inexistente.

La versión actual del arnés contiene 16 aserciones: incluye modificación de asignaciones por administrador, intentos de cambiar rol, organización e identidad, y verificación de `EXECUTE` para los tres helpers RLS y denegación al rol `anon`.

La migración también valida por trigger que `creado_por`, `asignado_por` y `registrado_por` pertenezcan a la organización de la fila. Esta protección queda preparada para validarse con un fixture multi-organización; no se afirma su ejecución.

## Ejecución pendiente

Cuando exista una base local, se debe provisionar el fixture de usuarios, organizaciones, perfiles, instaladores, proyectos y materiales; aplicar la migración; habilitar pgTAP; y ejecutar:

```bash
supabase test db --local
```

La salida deberá anexarse a esta bitácora con fecha, versión de migración y resultado real. No se reportan pruebas ejecutadas en esta fase.

## Tipos oficiales posteriores

```bash
npx supabase gen types typescript --local > src/types/database.generated.ts
```

El archivo generado deberá compararse con `src/types/database.ts` y reemplazarlo solo después de revisar diferencias de nombres, nulabilidad, enums y permisos.
