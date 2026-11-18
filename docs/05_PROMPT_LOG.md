# EcoFlow — Bitácora de IA

## Entrada 001 — Prompt utilizado íntegramente

```text
Actúa como arquitecto de software senior especializado en React, TypeScript, Supabase y desarrollo basado en especificaciones.

Vamos a construir EcoFlow, una aplicación interna para gestionar proyectos de instalación de paneles solares.

Este es un proyecto académico independiente. No debes modificar TaskMaster AI ni ninguno de sus repositorios.

## Objetivo de esta primera fase

Preparar la estructura del nuevo proyecto y crear una especificación técnica detallada ANTES de implementar funcionalidades.

## Stack tecnológico

- React
- TypeScript
- Vite
- Supabase Auth
- Supabase PostgreSQL
- Row Level Security (RLS)
- Tailwind CSS
- Arquitectura modular basada en componentes, hooks y servicios

## Requisitos funcionales

1. Autenticación mediante Supabase Auth.
2. Dos roles: administrador e instalador.
3. Dashboard con proyectos pendientes, en progreso y completados.
4. Formulario para crear proyectos con validaciones.
5. Asignación de uno o varios instaladores a proyectos.
6. Consulta de proyectos asignados al instalador autenticado.
7. Gestión de materiales utilizados en instalaciones.
8. Estados de carga, error y vacío.
9. Interfaz profesional, responsiva y reutilizable.

## Requisitos de base de datos

Diseñar como mínimo:

- proyectos
- instaladores
- materiales

Puedes proponer tablas adicionales justificadas, como:

- perfiles
- proyecto_instaladores
- proyecto_materiales

Utiliza claves primarias, claves foráneas, restricciones CHECK, índices y políticas RLS.

Los instaladores únicamente podrán consultar los proyectos asignados. Los administradores podrán gestionar los proyectos de la organización.

Define cómo se identifican de forma segura los administradores y evita permitir que un usuario se otorgue ese rol.

## Actividades

1. Inspecciona el directorio de trabajo actual.
2. Crea una carpeta independiente llamada `ecoflow` si no existe.
3. Inicializa un proyecto React + TypeScript + Vite.
4. Configura Tailwind CSS utilizando una versión compatible con Vite.
5. Crea la estructura inicial de carpetas, sin implementar todavía la lógica funcional.
6. Crea los documentos:

- docs/01_ESPECIFICACION_TECNICA.md
- docs/02_ARQUITECTURA.md
- docs/03_MODELO_DATOS.md
- docs/04_SEGURIDAD_RLS.md
- docs/05_PROMPT_LOG.md
- docs/06_PLAN_DESARROLLO.md

## Documento de especificación

Incluye:

- Objetivo del producto.
- Alcance y exclusiones.
- Roles y permisos.
- Historias de usuario.
- Reglas de negocio.
- Requisitos funcionales y no funcionales.
- Criterios de aceptación verificables.
- Arquitectura de componentes, hooks y servicios.
- Modelo relacional.
- Estrategia RLS.
- Estrategia de validación.
- Estrategia de pruebas.

Incluye un diagrama Mermaid del modelo de datos y explica las relaciones.

## Prompt maestro

Dentro de la especificación crea una sección titulada "Prompt maestro de arquitectura" que pueda reutilizarse para guiar las siguientes fases con IA.

Debe establecer restricciones de arquitectura, seguridad, tipado, modularidad, validaciones y documentación.

## Bitácora de IA

Registra íntegramente este prompt en `docs/05_PROMPT_LOG.md`.

En las siguientes fases también documentaremos:

- Prompt utilizado.
- Respuesta de la IA.
- Decisiones arquitectónicas.
- Problemas detectados.
- Correcciones solicitadas.
- Resultado de validaciones.

## Restricciones

- No reutilizar el código de TaskMaster AI.
- No conectar Supabase todavía.
- No crear credenciales.
- No implementar el dashboard funcional.
- No ejecutar migraciones.
- No hacer commits ni push.
- No inventar pruebas ni resultados.

## Validación

Ejecuta las verificaciones disponibles del proyecto inicial y reporta sus resultados.

## Entrega

Al finalizar informa:

1. Ruta del proyecto creado.
2. Estructura de carpetas.
3. Documentos generados.
4. Modelo de datos propuesto.
5. Decisiones arquitectónicas.
6. Validaciones realizadas.
7. Dudas o decisiones pendientes.

Detente después de esta fase y espera nuevas instrucciones.
```

## Respuesta y decisiones de esta fase

- Se creó un proyecto independiente; no se leyó ni modificó código de `taskmaster-ai`.
- Se eligió Tailwind CSS con `@tailwindcss/vite`, compatible con el Vite generado.
- Se añadió `organizaciones` para que el aislamiento de datos sea explícito.
- El rol administrador queda fuera de la autoridad del cliente y se provisiona mediante operación controlada.
- No se ejecutaron migraciones, no se crearon credenciales y no se conectó Supabase.

## Problemas detectados y correcciones

- El scaffold inicial traía la pantalla de bienvenida de Vite; se sustituyó por una pantalla estática de identidad EcoFlow sin comportamiento de negocio.
- No se detectaron errores de instalación ni vulnerabilidades en la auditoría de dependencias ejecutada.

## Resultado de validaciones

`npm install`, `npm audit`, `npm run lint` y `npm run build` se ejecutaron correctamente; `npm audit` reportó 0 vulnerabilidades y el build generó `dist/`. No se declaran pruebas funcionales porque todavía no hay lógica implementada.

## Entrada 002 — Prompt utilizado íntegramente

```text
# EcoFlow — Prompt 02: Esquema PostgreSQL y seguridad RLS

Trabaja exclusivamente en:

C:\Users\strik\OneDrive\Documentos\SWNT\ecoflow

## Contexto

La Fase 1 está completada y contiene las especificaciones del sistema.

Antes de implementar, lee íntegramente:

- docs/01_ESPECIFICACION_TECNICA.md
- docs/02_ARQUITECTURA.md
- docs/03_MODELO_DATOS.md
- docs/04_SEGURIDAD_RLS.md
- docs/05_PROMPT_LOG.md
- docs/06_PLAN_DESARROLLO.md

No reemplaces arbitrariamente las decisiones anteriores. Si encuentras inconsistencias, documenta la corrección y su justificación.

## Objetivo

Implementar el esquema PostgreSQL de EcoFlow y las políticas RLS mediante migraciones versionadas y pruebas SQL reproducibles.

Todavía no conectaremos una instancia remota de Supabase.

## Decisiones para esta fase

- Arquitectura preparada para múltiples organizaciones.
- Primera versión operativa con una organización.
- Roles: administrador e instalador.
- Autenticación mediante Supabase Auth.
- Sin invitaciones automatizadas ni MFA en esta versión.
- React Router y TanStack Query quedan aprobados para la futura fase de frontend, pero no deben instalarse todavía.

## 1. Esquema de datos

Implementa las tablas especificadas:

- organizaciones
- perfiles
- instaladores
- proyectos
- proyecto_instaladores
- materiales
- proyecto_materiales

Define:

- Claves primarias UUID.
- Claves foráneas.
- Restricciones NOT NULL, UNIQUE y CHECK.
- Índices justificados.
- Campos de auditoría created_at y updated_at donde corresponda.
- Estados de proyecto: pendiente, en_progreso y completado.
- Integridad entre organizaciones.
- Relaciones N:M para instaladores y materiales.

Evita redundancias innecesarias.

## 2. Autenticación y roles

Vincula los perfiles con auth.users.

Define un mecanismo seguro para identificar al administrador.

No permitas que un usuario autenticado:

- Se otorgue el rol administrador.
- Modifique su organización.
- Modifique su identidad.
- Cree una organización sin autorización.
- Modifique perfiles de terceros sin permisos.

No utilices metadatos editables por el usuario como fuente de autoridad para roles.

Documenta el procedimiento seguro para crear el primer administrador de una organización.

## 3. Row Level Security

Activa RLS en todas las tablas de negocio.

Implementa políticas que garanticen:

1. El instalador solo puede consultar proyectos asignados.
2. El administrador consulta y gestiona proyectos de su organización.
3. Un usuario no puede consultar proyectos de otras organizaciones.
4. Las asignaciones deben respetar la organización de proyecto e instalador.
5. Solo los administradores autorizados gestionan asignaciones.
6. Los materiales se consultan y gestionan según el rol y la organización.
7. Ningún instalador puede modificar permisos o asignarse proyectos.
8. La actualización de un proyecto no puede modificar su organización.
9. La eliminación de datos debe estar restringida.

Si utilizas funciones SECURITY DEFINER:

- Justifica su necesidad.
- Define search_path seguro.
- Limita permisos EXECUTE.
- Evita recursión RLS.
- Documenta propietarios y privilegios esperados.
- Diferencia funciones invocadas por políticas de funciones usadas exclusivamente por triggers.

## 4. Integridad y protección adicional

Evalúa triggers o restricciones para impedir:

- Cambios no autorizados de identidad.
- Cambios de organización.
- Asignaciones entre organizaciones.
- Escalada de privilegios.
- Modificaciones de campos sensibles.

Considera condiciones de concurrencia y cambios de rol.

## 5. Pruebas SQL

Crea pruebas SQL reproducibles que cubran:

- Administrador autorizado.
- Instalador asignado.
- Instalador no asignado.
- Usuario de otra organización.
- Escalada de privilegios.
- Inserción y modificación de asignaciones.
- Restricciones de claves foráneas.
- Permisos de funciones SECURITY DEFINER.

Si utilizas pgTAP, documenta cómo ejecutarlo.

No afirmes que las pruebas se ejecutaron si no existe PostgreSQL disponible.

## 6. Tipos TypeScript

Genera los tipos TypeScript correspondientes al esquema propuesto.

Como todavía no existe una base conectada:

- Distingue los tipos derivados manualmente del esquema SQL de los generados automáticamente mediante Supabase CLI.
- No presentes tipos manuales como si hubieran sido generados desde una instancia real.
- Prepara el comando reproducible para generar los tipos oficiales posteriormente.

## 7. Documentación

Actualiza:

- docs/03_MODELO_DATOS.md
- docs/04_SEGURIDAD_RLS.md
- docs/05_PROMPT_LOG.md
- docs/06_PLAN_DESARROLLO.md

Crea:

- docs/07_VALIDACION_SQL.md

Incluye el diagrama Mermaid actualizado y una matriz de permisos por rol.

Registra íntegramente este prompt y las decisiones adoptadas.

## 8. Validación

Ejecuta las comprobaciones locales disponibles:

- npm run build
- npm run lint

Si existe una instancia PostgreSQL local, informa primero su disponibilidad. No ejecutes migraciones sin autorización.

No instales herramientas adicionales sin justificarlo.

## Restricciones

- No modificar TaskMaster AI.
- No conectar Supabase remoto.
- No crear credenciales.
- No ejecutar migraciones remotas.
- No implementar frontend funcional.
- No hacer commits ni push.
- No avanzar a otra fase.

## Entrega

Reporta:

1. Migraciones creadas.
2. Tablas y relaciones.
3. Políticas RLS implementadas.
4. Mecanismo de administración inicial.
5. Pruebas SQL preparadas o ejecutadas.
6. Tipos TypeScript creados.
7. Validaciones realizadas.
8. Riesgos o decisiones pendientes.

Detente al finalizar.
```

## Entrada 002 — Decisiones, correcciones y resultado

- Se creó una migración única y versionada sin ejecutarla.
- Se mantuvo el aislamiento multi-organización y la operación inicial con una organización.
- Se corrigió el estado de proyecto: el SQL usa solo `pending`, `in_progress` y `completed`, porque Prompt 02 reemplaza la propuesta anterior que incluía `cancelled`.
- Se eligieron funciones `SECURITY DEFINER` mínimas para las políticas que consultan perfiles y asignaciones sin recursión RLS.
- Se evitó instalar React Router, TanStack Query, Supabase CLI y pgTAP en esta fase.
- Se preparó un arnés pgTAP, pero no se ejecutó por ausencia de una instancia PostgreSQL local confirmada.
- Los tipos en `src/types/database.ts` son manuales y se dejó el comando oficial de generación para una fase conectada.

## Entrada 003 — Prompt utilizado íntegramente

```text
# EcoFlow — Prompt 03: Preparación y revisión de integración Supabase

Trabaja exclusivamente en:

C:\Users\strik\OneDrive\Documentos\SWNT\ecoflow

## Objetivo

Preparar EcoFlow para conectarse a una instancia Supabase de pruebas, revisar la migración inicial y establecer un procedimiento reproducible para validar RLS.

No ejecutes migraciones ni operaciones remotas todavía.

## 1. Auditoría de migración

Inspecciona íntegramente:

- supabase/migrations/20261118120000_initial_schema.sql
- supabase/tests/rls.sql
- supabase/tests/README.md
- docs/03_MODELO_DATOS.md
- docs/04_SEGURIDAD_RLS.md
- docs/07_VALIDACION_SQL.md

Verifica especialmente:

- Dependencias y orden de creación de funciones, tablas, triggers y políticas.
- Referencias a auth.users.
- Claves foráneas y restricciones entre organizaciones.
- Prevención de recursión RLS.
- Políticas SELECT, INSERT, UPDATE y DELETE.
- Restricciones sobre cambios de organización, identidad y rol.
- Propietarios esperados de funciones SECURITY DEFINER.
- Permisos EXECUTE.
- Compatibilidad de las pruebas pgTAP con el esquema.
- Posibles problemas de bootstrap del primer administrador.

No inventes resultados de ejecución SQL.

## 2. Preparación de cliente Supabase

Instala @supabase/supabase-js si no está instalado.

Crea:

- src/config/supabase.ts
- .env.example

Utiliza:

- VITE_SUPABASE_URL
- VITE_SUPABASE_ANON_KEY

No introduzcas claves service_role ni credenciales privilegiadas en el frontend.

Asegura que .gitignore excluya .env, .env.local y otros archivos privados de entorno, conservando .env.example.

El cliente debe manejar claramente la ausencia de configuración sin exponer secretos.

## 3. Guía de configuración

Crea:

docs/08_CONFIGURACION_SUPABASE.md

Incluye instrucciones para:

1. Crear un proyecto Supabase de pruebas independiente.
2. Obtener URL y clave pública del proyecto.
3. Configurar .env.local.
4. Aplicar migraciones de manera controlada.
5. Crear usuarios de prueba.
6. Crear el primer administrador mediante un procedimiento seguro.
7. Ejecutar pruebas de aislamiento y RLS.
8. Inspeccionar los resultados.
9. Generar tipos TypeScript oficiales desde Supabase.

Explica qué pasos requieren autorización o ejecución manual.

No solicites ni muestres claves secretas.

## 4. Preparación de pruebas

Revisa si las pruebas pgTAP cubren:

- Administrador autorizado.
- Instalador asignado.
- Instalador no asignado.
- Usuario de otra organización.
- Escalada de privilegios.
- Asignaciones entre organizaciones.
- Protección de identidad.
- Permisos de funciones SECURITY DEFINER.

Si faltan escenarios esenciales, prepara las pruebas correspondientes.

No afirmes que se ejecutaron.

## 5. Documentación

Actualiza:

- docs/05_PROMPT_LOG.md
- docs/06_PLAN_DESARROLLO.md
- docs/07_VALIDACION_SQL.md

Registra íntegramente este prompt, las decisiones, los cambios y las limitaciones.

## 6. Validaciones locales

Ejecuta:

- npm run lint
- npm run build

No conectes Supabase remoto ni ejecutes migraciones.

## Restricciones

- No modificar otros proyectos.
- No crear usuarios remotos.
- No ejecutar SQL remoto.
- No almacenar credenciales reales.
- No desarrollar todavía el dashboard.
- No hacer commits ni push.
- No avanzar automáticamente.

## Entrega

Reporta:

1. Hallazgos de auditoría de la migración.
2. Archivos creados o modificados.
3. Configuración Supabase preparada.
4. Cobertura de pruebas SQL.
5. Resultados de lint y build.
6. Riesgos pendientes de validación real.

Detente al finalizar.
```

## Entrada 003 — Decisiones, cambios y limitaciones

- Se instaló `@supabase/supabase-js` porque no estaba presente.
- Se creó `src/config/supabase.ts` con cliente nullable y error explícito cuando faltan variables.
- Se creó `.env.example` sin credenciales reales y se reforzó `.gitignore` para conservar únicamente el ejemplo.
- El orden de la migración es consistente: tablas → triggers/funciones → grants → RLS/políticas.
- Se verificó que las funciones RLS evitan recursión mediante `SECURITY DEFINER`, `search_path` fijo y consultas internas.
- Se ampliaron las pruebas pgTAP a identidad, organización, modificación de asignaciones y permisos de los tres helpers.
- No se confirmó PostgreSQL local, Supabase CLI ni pgTAP; por tanto, no se ejecutaron migraciones ni pruebas SQL.
- No se crearon usuarios remotos, no se configuró `.env.local`, no se conectó Supabase y no se modificaron otros proyectos.
- Revisión posterior: se reforzó el trigger de integridad para validar también la organización de `creado_por`, `asignado_por` y `registrado_por`.

## Entrada 004 — Prompt utilizado íntegramente

```text
# EcoFlow — Prompt 04: Preparación de migración real en Supabase

Trabaja exclusivamente en:

C:\Users\strik\OneDrive\Documentos\SWNT\ecoflow

## Contexto

Ya se configuró `.env.local` con la URL y la clave pública del proyecto Supabase.

Existe una migración inicial:

supabase/migrations/20261118120000_initial_schema.sql

También existen pruebas SQL preparadas en:

supabase/tests/rls.sql

## Objetivo

Preparar la aplicación de la migración inicial en Supabase y facilitar su ejecución manual desde SQL Editor.

## Actividades

1. Revisa la migración completa y comprueba que sea compatible con Supabase.
2. Verifica las dependencias de auth.users, funciones, triggers, tablas y políticas RLS.
3. Confirma que la migración no contenga operaciones destructivas sobre tablas preexistentes.
4. Revisa la seguridad de las funciones SECURITY DEFINER, search_path, permisos EXECUTE y protección de roles.
5. Comprueba que las políticas no produzcan recursión RLS.
6. Verifica que el proyecto tenga configuradas las variables públicas necesarias, sin mostrar sus valores.
7. Prepara un archivo:

   docs/09_GUIA_MIGRACION_REAL.md

   Incluye instrucciones paso a paso para ejecutar la migración en Supabase SQL Editor.
8. Prepara consultas SQL de solo lectura para comprobar posteriormente:
   - Existencia de las siete tablas.
   - Activación de RLS.
   - Políticas creadas.
   - Funciones y permisos.
   - Triggers.
   - Relaciones y claves foráneas.
9. Prepara el procedimiento para crear una organización y su primer administrador de forma controlada.
10. Explica cómo validar las políticas con usuarios autenticados reales, sin depender exclusivamente del rol privilegiado del SQL Editor.

## Seguridad

- No muestres credenciales.
- No utilices service_role en React.
- No ejecutes migraciones automáticamente.
- No te conectes a la base de datos remota.
- No modifiques datos reales.
- No generes credenciales de prueba automáticamente.
- No hagas commits ni push.

## Documentación

Actualiza:

- docs/05_PROMPT_LOG.md
- docs/06_PLAN_DESARROLLO.md

Registra íntegramente este prompt y las decisiones técnicas.

## Validación

Ejecuta:

- npm run lint
- npm run build

## Entrega

Informa:

1. Si la migración está preparada para ejecutarse.
2. Si identificaste riesgos o errores.
3. Dónde se encuentra la guía.
4. Cómo ejecutar el SQL desde Supabase.
5. Qué consultas de verificación quedaron preparadas.

Detente y espera autorización antes de ejecutar cualquier operación remota.
```

## Entrada 004 — Decisiones y limitaciones

- La migración quedó preparada para ejecución manual, sin automatizarla.
- Se creó `supabase/tests/verify_migration.sql` con consultas exclusivamente de lectura.
- Se creó `docs/09_GUIA_MIGRACION_REAL.md` con pasos de SQL Editor, bootstrap controlado y validación con sesiones reales.
- La comprobación local no encontró `.env.local`; se registró la discrepancia sin mostrar valores ni crear credenciales.
- La revisión estática no encontró operaciones destructivas.
- No se conectó Supabase remoto, no se ejecutó SQL remoto, no se crearon usuarios y no se modificaron datos.

## Entrada 006 — Prompt utilizado íntegramente

```text
# EcoFlow — Prompt 06: Dashboard React y gestión de proyectos

Trabaja exclusivamente en:
C:\Users\strik\OneDrive\Documentos\SWNT\ecoflow

## Contexto

EcoFlow ya cuenta con una base de datos Supabase real y políticas RLS activas.

Se realizaron exitosamente cuatro pruebas manuales:

- Administrador QA: visualiza el proyecto.
- Instalador QA 1: visualiza su proyecto asignado.
- Instalador QA 2: obtiene cero proyectos.
- Sin sesión: no accede a la consulta.

Estos resultados fueron reportados por el usuario. No afirmes que Codex los ejecutó automáticamente.

## Objetivo

Transformar la pantalla temporal de diagnóstico en una aplicación React profesional y modular para gestionar proyectos de instalación solar.

## Arquitectura

Utiliza:

- React 19.
- TypeScript estricto.
- Vite.
- Tailwind CSS 4.
- Supabase Auth.
- TanStack Query.
- React Router.
- Componentes, hooks y servicios separados.

## Funcionalidades

1. Autenticación:
   - Login y logout.
   - Persistencia y sincronización de sesión.
   - Rutas protegidas.
   - Identificación del rol desde la tabla perfiles.
2. Dashboard:
   - Tarjetas con conteos de proyectos pendientes, en progreso y completados.
   - Listado de proyectos accesibles según RLS.
   - Indicadores de carga, error y estado vacío.
   - Actualización de datos mediante TanStack Query.
3. Proyectos:
   - Listado con nombre, cliente, potencia, estado y fecha planificada.
   - Filtros por estado.
   - Vista de detalle.
   - Formulario de creación para administradores.
   - Validaciones de campos obligatorios y potencia mayor que cero.
   - Mensajes de éxito y error.
   - Invalidación de caché después de mutaciones.
4. Roles:
   - Administrador: puede acceder a funciones de gestión.
   - Instalador: solo consulta sus proyectos asignados.
   - No permitir que un instalador visualice controles administrativos.
   - No depender del frontend como control de autorización: Supabase RLS sigue siendo definitivo.
5. Diseño:
   - Interfaz moderna y profesional orientada al sector de energías renovables.
   - Diseño responsivo.
   - Barra lateral o navegación superior.
   - Tarjetas estadísticas.
   - Tablas o tarjetas de proyectos.
   - Estados visuales diferenciados.
   - Componentes reutilizables.
   - Accesibilidad básica.

## Integración Supabase

- Reutiliza src/config/supabase.ts.
- Utiliza únicamente la clave pública.
- No utilices service_role.
- No introduzcas datos simulados en las consultas reales.
- Conserva la compatibilidad con los estados SQL: pending, in_progress, completed.
- Presenta sus etiquetas en español.
- Utiliza tipos TypeScript para todas las operaciones.
- No confíes en IDs de organización proporcionados libremente por el usuario.
- Obtén el contexto de organización y rol del perfil autenticado.
- Maneja correctamente errores de RLS y restricciones SQL.

## Precaución sobre creación de proyectos

Antes de implementar el INSERT, revisa la política RLS correspondiente y las columnas obligatorias.

Comprueba que el administrador autenticado puede crear proyectos utilizando su identidad real.

Si existe una incompatibilidad entre la política y el formulario, no debilites RLS para resolverla: documenta el problema y solicita revisión.

## Pruebas

- Conserva o traslada la pantalla temporal de diagnóstico para no perder la capacidad de comprobar RLS.
- Crea pruebas de componentes y validadores cuando sea viable.
- Ejecuta npm run lint.
- Ejecuta npm run build.
- No declares pruebas de navegador como ejecutadas si no lo fueron.

## Documentación

Actualiza:

- docs/05_PROMPT_LOG.md
- docs/06_PLAN_DESARROLLO.md
- docs/10_PRUEBAS_RLS_REALES.md

Registra los cuatro escenarios manuales como reportados por el usuario.

Documenta:

- Arquitectura de componentes.
- Servicios y hooks.
- Dependencias instaladas.
- Decisiones técnicas.
- Problemas encontrados.
- Validaciones realizadas.

## Restricciones

- No modificar otros proyectos.
- No ejecutar nuevas migraciones.
- No cambiar políticas RLS.
- No eliminar los datos de prueba.
- No hacer commits ni push.
- No desplegar la aplicación.
- No avanzar automáticamente a otra fase.

## Entrega

Reporta:

1. Archivos creados o modificados.
2. Funcionalidades implementadas.
3. Estructura de componentes, hooks y servicios.
4. Validaciones ejecutadas.
5. Funcionalidades que requieren pruebas manuales.
6. Problemas o decisiones pendientes.

Detente al finalizar.
```

## Entrada 006 — Decisiones, problemas y validaciones

- Se instalaron `@tanstack/react-query` y `react-router-dom`.
- Se implementó `AuthProvider`, rutas protegidas y consulta de rol desde `perfiles`.
- Se implementaron servicios separados para Auth, perfiles y proyectos.
- Se implementaron dashboard, filtros, detalle y alta administrativa.
- El `INSERT` obtiene `organizacion_id` del perfil autenticado y `creado_por` del usuario autenticado; no acepta esos valores desde el formulario.
- Se mantuvo `/diagnostic` para repetir las pruebas RLS.
- El tipado manual de Supabase necesitó una frontera documentada en el `insert` hasta generar tipos oficiales.
- `npm run lint` y `npm run build` fueron exitosos.
- El build informa un aviso de bundle inicial superior a 500 kB; queda como optimización futura.
- Los cuatro resultados RLS fueron reportados manualmente por el usuario; Codex no los ejecutó automáticamente.

## Entrada 005 — Prompt utilizado íntegramente

```text
# EcoFlow — Prompt 05: Validación real de RLS con Supabase Auth

Trabaja exclusivamente en:

C:\Users\strik\OneDrive\Documentos\SWNT\ecoflow

## Objetivo

Crear una pantalla temporal de diagnóstico que permita iniciar sesión con usuarios reales de Supabase Auth y comprobar las políticas RLS mediante consultas ejecutadas desde el navegador.

## Contexto

La migración ya fue aplicada en Supabase.

Se verificó que:

- Existen siete tablas con RLS activado.
- Existen 14 políticas.
- Existe la organización EcoFlow QA.
- Existe un administrador QA.
- Existen dos instaladores activos.
- Existe el proyecto Instalación Solar QA 001.
- El proyecto está asignado únicamente al Instalador QA 1.

## Actividades

1. Verifica que .env.local exista y que las variables requeridas estén definidas, sin mostrar sus valores.
2. Revisa src/config/supabase.ts.
3. Implementa una pantalla temporal de diagnóstico con:
   - Formulario de inicio de sesión por correo y contraseña.
   - Botón de cerrar sesión.
   - Identificador del usuario autenticado.
   - Consulta SELECT a la tabla proyectos.
   - Visualización de los proyectos devueltos.
   - Mensajes claros de carga, error y resultado vacío.
4. Utiliza exclusivamente el cliente público de Supabase y la sesión autenticada.
5. No uses service_role, funciones privilegiadas ni consultas administrativas para obtener proyectos.
6. Permite repetir la prueba iniciando sesión con diferentes usuarios.
7. Registra los resultados de manera que puedan documentarse posteriormente, sin guardar contraseñas ni tokens.
8. Documenta los escenarios esperados:
   - Administrador QA: puede consultar el proyecto.
   - Instalador QA 1: puede consultar Instalación Solar QA 001.
   - Instalador QA 2: obtiene cero proyectos.
   - Usuario sin sesión: no puede consultar proyectos.
9. Crea docs/10_PRUEBAS_RLS_REALES.md con una matriz de casos, pasos de ejecución y espacios para registrar resultados reales.
10. Actualiza docs/05_PROMPT_LOG.md.

## Restricciones

- No modificar el esquema SQL ni las políticas RLS.
- No insertar ni modificar datos remotos.
- No implementar todavía el dashboard definitivo.
- No guardar contraseñas.
- No hacer commits ni push.
- No afirmar que las pruebas pasaron sin ejecutarlas.

## Validaciones

Ejecuta:

- npm run lint
- npm run build

## Entrega

Informa:

1. Archivos creados o modificados.
2. Cómo iniciar la aplicación.
3. Cómo probar cada usuario.
4. Resultados de lint y build.
5. Riesgos pendientes.

Detente al finalizar.
```

## Entrada 005 — Decisiones y limitaciones

- `.env.local` fue verificado por nombres de variables; no se mostraron sus valores.
- La pantalla temporal consulta únicamente `proyectos` mediante `getSupabaseClient().from('proyectos').select('*')`.
- La contraseña se mantiene solo en el estado efímero del formulario y se limpia después de iniciar sesión; no se persiste.
- Se añadieron estados de autenticación, carga, error, vacío y resultado.
- La sesión puede cerrarse para repetir la prueba con otro usuario.
- Se preparó la matriz en `docs/10_PRUEBAS_RLS_REALES.md`, pero no se declararon resultados reales.

## Corrección posterior — URL Supabase

La pantalla reportó `Invalid path specified in request URL`. La auditoría local detectó que `VITE_SUPABASE_URL` contenía el sufijo `/rest/v1/`, que corresponde al endpoint REST y no a la URL raíz requerida por `createClient`. `src/config/supabase.ts` ahora normaliza ese sufijo; la configuración recomendada sigue siendo la URL raíz del proyecto.

## Entrada 007 — Prompt utilizado íntegramente

```text
# EcoFlow — Prompt 07: Finalización funcional y optimización

Trabaja exclusivamente en:

C:\Users\strik\OneDrive\Documentos\SWNT\ecoflow

## Contexto

EcoFlow ya cuenta con:

- React 19, TypeScript, Vite y Tailwind CSS 4.
- Supabase Auth y PostgreSQL.
- Siete tablas de negocio.
- Políticas RLS activadas.
- Dashboard y gestión básica de proyectos.
- Autenticación y rutas protegidas.
- Validaciones de formularios.
- TanStack Query.
- React Router.

El usuario confirmó que el dashboard y la creación de proyectos funcionan correctamente en Supabase.

## Objetivo

Completar las funcionalidades pendientes de EcoFlow, optimizar la aplicación y dejarla preparada para la entrega académica.

No generes capturas de pantalla ni evidencias visuales adicionales.

## 1. Asignación de instaladores

Implementa una interfaz administrativa para:

- Consultar instaladores activos de la organización.
- Consultar instaladores asignados a cada proyecto.
- Asignar instaladores a proyectos.
- Evitar asignaciones duplicadas.
- Mostrar errores y mensajes de éxito.
- Actualizar la interfaz después de cada operación.

Respeta las políticas RLS existentes.

## 2. Gestión de materiales

Implementa:

- Listado de materiales.
- Formulario administrativo para crear materiales.
- Asociación de materiales a proyectos.
- Visualización de cantidades asociadas.
- Validaciones de cantidades y campos obligatorios.
- Estados de carga, error y vacío.

Consulta el esquema SQL real antes de implementar formularios y operaciones.

No inventes columnas.

## 3. Estados de proyecto

Permite a los administradores actualizar el estado:

- pending
- in_progress
- completed

Muestra etiquetas en español:

- Pendiente
- En progreso
- Completado

Comprueba que las políticas RLS permitan la operación.

Si la base de datos la rechaza, informa el problema y no debilites las políticas automáticamente.

## 4. Arquitectura y seguridad

- Mantén separación entre componentes, hooks, servicios y tipos.
- Usa TanStack Query para consultas y mutaciones.
- Invalida caché después de operaciones exitosas.
- Conserva rutas protegidas.
- No expongas service_role.
- No permitas que el cliente modifique roles u organizaciones.
- No uses consultas privilegiadas para evitar RLS.
- No introduzcas datos simulados en las pantallas reales.

## 5. Optimización

- Implementa división de código por rutas mediante React.lazy y Suspense cuando corresponda.
- Revisa el aviso del bundle superior a 500 kB.
- Evita dependencias innecesarias.
- Conserva una interfaz profesional y responsiva.

## 6. Pruebas

Agrega pruebas automatizadas básicas para:

- Validadores.
- Conversión de estados.
- Reglas de presentación según rol.
- Utilidades relevantes.

Ejecuta:

- npm run lint
- npm run build
- Pruebas automatizadas disponibles.

No inventes resultados de pruebas de navegador o de Supabase.

## 7. Documentación

Actualiza:

- docs/05_PROMPT_LOG.md
- docs/06_PLAN_DESARROLLO.md

Documenta:

- Funcionalidades implementadas.
- Arquitectura final.
- Dependencias.
- Decisiones técnicas.
- Problemas encontrados.
- Validaciones realizadas.
- Limitaciones pendientes.

Registra íntegramente este prompt.

## Restricciones

- No modificar otros proyectos.
- No ejecutar migraciones remotas.
- No cambiar RLS sin autorización.
- No borrar datos existentes.
- No hacer commits ni push.
- No desplegar.
- No crear capturas ni videos.
- No avanzar automáticamente a otra fase.

## Entrega

Informa:

1. Funcionalidades completadas.
2. Archivos principales creados.
3. Resultados de lint, build y pruebas.
4. Estado del bundle.
5. Funcionalidades que no pudieron completarse.
6. Problemas pendientes para la entrega.

Detente al finalizar.
```

## Entrada 007 — Decisiones, problemas y validaciones

- Se implementaron asignaciones de instaladores, catálogo de materiales, consumos y cambios de estado.
- Las operaciones usan servicios y hooks TanStack Query con invalidación posterior.
- Se respetó el esquema real: no se añadieron columnas ni se modificaron políticas.
- La organización y el usuario de auditoría se derivan de la sesión/perfil; no se reciben libremente del cliente.
- Se añadió división de código con `React.lazy`, `Suspense` y chunks manuales.
- Se añadió Vitest con 6 pruebas automatizadas de validadores, presentación y permisos.
- `npm run lint`: exitoso.
- `npm test`: 3 archivos y 6 pruebas exitosas.
- `npm run build`: exitoso; el bundle inicial quedó separado y sin el aviso anterior de tamaño.
- No se ejecutaron pruebas de navegador, mutaciones remotas ni cambios de estado contra Supabase durante esta fase.

## Entrada 008 — Prompt utilizado íntegramente

```text
# EcoFlow — Prompt 08: Cierre académico y preparación de entrega

Trabaja exclusivamente en:

C:\Users\strik\OneDrive\Documentos\SWNT\ecoflow

## Objetivo

Preparar la entrega final del proyecto EcoFlow, siguiendo estrictamente los requisitos y la rúbrica académica.

La aplicación ya está implementada. No desarrolles funcionalidades adicionales salvo correcciones indispensables detectadas durante las validaciones.

## Entregables obligatorios

1. Repositorio GitHub o GitLab con código fuente.
2. Documento de arquitectura en Markdown con:
   - Descripción del sistema.
   - Arquitectura React + Supabase.
   - Diagrama del modelo de datos.
   - Relaciones y claves.
   - Políticas RLS y justificación.
   - Estructura de componentes, hooks y servicios.
   - Uso de TypeScript.
   - Prompts principales utilizados.
   - Ejemplo concreto de cómo la IA ayudó a resolver un problema técnico.
   - Pruebas y resultados verificables.
   - Limitaciones.
3. Guion para una demostración grabada de 3 a 5 minutos que muestre la aplicación y la consola Supabase.

## 1. Revisión del proyecto

Inspecciona:

- package.json
- src/
- supabase/
- docs/
- .gitignore
- .env.example

Verifica que el código esté organizado, sea coherente con las especificaciones y no contenga secretos.

Comprueba que .env.local esté excluido del repositorio.

## 2. Documento final

Crea:

docs/ENTREGA_ARQUITECTURA_ECOFLOW.md

Debe ser un documento académico profesional, claro y suficientemente detallado.

Incluye un diagrama Mermaid real del modelo de datos y explica las siete tablas.

Incluye una matriz de permisos por rol.

Explica el uso de Supabase Auth, PostgreSQL, RLS, React Router y TanStack Query.

Diferencia claramente:

- Funcionalidades implementadas.
- Pruebas automatizadas ejecutadas.
- Pruebas manuales reportadas por el usuario.
- Operaciones pendientes de validación.

## 3. Evidencia del uso de IA

Utiliza docs/05_PROMPT_LOG.md como fuente principal.

Selecciona los prompts más relevantes y explica:

- Objetivo del prompt.
- Resultado generado.
- Decisión arquitectónica.
- Correcciones realizadas.
- Cómo se verificó el resultado.

Incluye el caso real de corrección del UUID del instalador y la validación RLS.

No inventes resultados ni afirmes que la IA ejecutó pruebas que fueron realizadas manualmente.

## 4. README

Actualiza README.md con:

- Descripción de EcoFlow.
- Tecnologías.
- Requisitos.
- Instalación.
- Configuración de variables públicas.
- Ejecución local.
- Scripts de pruebas.
- Estructura del repositorio.
- Seguridad.
- Estado del proyecto.

No incluyas credenciales reales.

## 5. Guion de demostración

Crea:

docs/GUIÓN_DEMO_3_A_5_MIN.md

Organiza una presentación de aproximadamente cuatro minutos:

- Introducción y problema.
- Arquitectura.
- Supabase y modelo de datos.
- Autenticación y roles.
- Dashboard y proyectos.
- Instaladores y materiales.
- RLS y seguridad.
- Conclusión.

Incluye qué mostrar en pantalla y qué explicar oralmente.

No afirmes que una funcionalidad fue validada si todavía no existe evidencia.

## 6. Revisión para GitHub

Prepara el repositorio para publicación.

Comprueba:

- Exclusión de .env.local.
- Ausencia de contraseñas y tokens.
- Exclusión de node_modules y dist.
- README correcto.
- Documentación completa.

Si Git todavía no está inicializado, puedes inicializarlo localmente.

No crees un repositorio remoto, no hagas push y no publiques nada sin autorización.

## 7. Validación final

Ejecuta:

- npm run lint
- npm test
- npm run build

Reporta resultados reales.

## 8. Bitácora

Actualiza docs/05_PROMPT_LOG.md con este prompt y el cierre del proyecto.

## Entrega

Informa:

1. Documentos finales creados.
2. Estado del README.
3. Estado de Git.
4. Resultados de las pruebas.
5. Riesgos pendientes.
6. Pasos exactos para publicar en GitHub.
7. Pasos para grabar la demostración.

Detente al finalizar.
```

## Entrada 008 — Cierre y resultado

- Se creó el documento académico final y el guion de demostración.
- Se reemplazó el README del scaffold por documentación específica de EcoFlow.
- Se inicializó Git localmente, sin commit, remoto ni push.
- `.env.local`, `node_modules` y `dist` están ignorados.
- `npm run lint`, `npm test` y `npm run build` fueron ejecutados correctamente.
- El bundle se optimizó con lazy loading y separación manual de vendors.
- El cierre no incluye pruebas remotas nuevas: los resultados RLS manuales permanecen atribuidos al usuario.

