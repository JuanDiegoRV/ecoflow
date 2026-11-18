# EcoFlow — Modelo de datos

## Tablas

| Tabla | Propósito | Restricciones clave |
|---|---|---|
| `organizaciones` | Aislamiento de tenant | `nombre` requerido y único |
| `perfiles` | Rol y pertenencia | `usuario_id` único, `rol` CHECK |
| `instaladores` | Datos operativos | `perfil_id` FK, `activo` |
| `proyectos` | Unidad de trabajo | estado CHECK, organización FK |
| `proyecto_instaladores` | Asignación N:M | PK compuesta, FKs CASCADE |
| `materiales` | Catálogo por organización | unidad CHECK, nombre indexado |
| `proyecto_materiales` | Consumo por proyecto | PK compuesta, cantidad > 0 |

## Tipos recomendados

- `rol`: `admin | installer`.
- `estado_proyecto`: `pending | in_progress | completed | cancelled`.
- `unidad_material`: `unit | meter | kilogram | liter | box`.
- Identificadores: `uuid` generado en PostgreSQL.
- Auditoría: `created_at`, `updated_at`, `created_by` cuando aplique.

## Índices

Crear índices sobre `proyectos(organizacion_id, estado)`, `proyectos(fecha_planificada)`, `proyecto_instaladores(instalador_id, proyecto_id)`, `proyecto_materiales(proyecto_id)`, y `materiales(organizacion_id, activo)`. Las PK/FK y la unicidad de nombres relevantes deben quedar respaldadas por índices.

## Integridad

Las FKs deben impedir huérfanos. Se recomienda `ON DELETE CASCADE` solo en tablas puente y consumos dependientes; los proyectos y materiales deben preferir baja lógica (`activo`/`cancelled`) para conservar trazabilidad. Las operaciones compuestas de asignación y consumo deben ser transaccionales.

## Esquema implementado en migración

La migración `supabase/migrations/20261118120000_initial_schema.sql` materializa las siete tablas, sus índices, auditoría temporal, triggers de `updated_at`, restricciones de dominio y validaciones de pertenencia organizacional.

Corrección respecto a la especificación inicial: esta fase usa exactamente `pending`, `in_progress` y `completed`, según Prompt 02. El estado `cancelled` no se incorpora todavía; se reserva para una futura migración con reglas explícitas de baja lógica.

Los tipos TypeScript en `src/types/database.ts` son manuales y derivados de esa migración. No deben presentarse como tipos generados por Supabase hasta ejecutar el comando documentado.

