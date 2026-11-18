# EcoFlow — Arquitectura

## Principios

- Modularidad por dominio y dependencias unidireccionales.
- Presentación sin conocimiento de SQL ni de credenciales.
- Servicios como única frontera de acceso a Supabase.
- RLS como control definitivo; la UI solo mejora la experiencia.
- Tipos explícitos y validadores compartidos.

## Estructura propuesta

```text
src/
├── components/       # UI reutilizable y layout
├── config/            # configuración no secreta y feature flags
├── features/          # auth, dashboard, projects, materials
├── hooks/             # sesión y queries/mutations por dominio
├── lib/               # cliente Supabase futuro, utilidades y errores
├── services/          # authService, projectService, installerService, materialService
├── types/             # modelos, DTOs y tipos de dominio
└── validators/        # esquemas de entrada
supabase/
└── migrations/        # reservado para una fase posterior
docs/                  # especificación, seguridad y bitácora
```

## Flujo de dependencias

`Página/feature → hook → service → cliente Supabase → PostgreSQL/RLS`. Los componentes reutilizables reciben datos y callbacks tipados. Un error de red se transforma en un error de dominio en el servicio y se representa mediante `AsyncState`.

## Estado

La sesión y el perfil se mantienen en un proveedor de autenticación. Las consultas de servidor se centralizarán en hooks; la primera implementación puede usar React Query si el equipo lo aprueba. El estado de formulario será local y validado por esquema. No se duplicará en estado global información que pueda derivarse de la consulta.

## Navegación y protección

`ProtectedRoute` exige sesión y perfil cargado. `RoleGate` controla visibilidad de acciones, pero no sustituye RLS. Las rutas administrativas se definen como capacidades, no como comprobaciones dispersas de strings.

## Decisiones pendientes

- Elegir React Router y librería de queries en la fase funcional.
- Confirmar si la primera versión requiere una o varias organizaciones reales.
- Confirmar proveedor de correo y política de invitaciones.

