# EcoFlow — Pruebas RLS reales

## Propósito

La aplicación incluye una pantalla temporal de diagnóstico para iniciar sesión con usuarios reales de Supabase Auth y consultar `public.proyectos` desde el navegador usando únicamente la sesión autenticada y la clave pública.

No guarda contraseñas, tokens ni resultados fuera de la sesión/pantalla. No usa `service_role`, RPC administrativa ni operaciones de escritura.

## Cómo ejecutar

1. Confirmar que `.env.local` contiene `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` sin copiar sus valores a logs.
   `VITE_SUPABASE_URL` debe apuntar a la raíz del proyecto, sin `/rest/v1/`.
2. Ejecutar `npm run dev`.
3. Abrir la URL local mostrada por Vite.
4. Iniciar sesión con un usuario de prueba.
5. Revisar el UUID de sesión, el estado de consulta y las filas devueltas.
6. Cerrar sesión y repetir con el siguiente usuario.
7. Registrar el resultado real en la matriz siguiente, sin guardar contraseñas ni tokens.

## Matriz de escenarios

| Caso | Usuario | Resultado esperado | Resultado real | Fecha/evidencia |
|---|---|---|---|---|
| RLS-01 | Administrador QA | Puede consultar `Instalación Solar QA 001` | Exitoso, reportado manualmente por el usuario | Reporte del usuario |
| RLS-02 | Instalador QA 1 | Puede consultar `Instalación Solar QA 001` | Exitoso, reportado manualmente por el usuario | Reporte del usuario |
| RLS-03 | Instalador QA 2 | Consulta exitosa con cero proyectos | Exitoso, reportado manualmente por el usuario | Reporte del usuario |
| RLS-04 | Sin sesión | No puede consultar proyectos; se muestra login | Exitoso, reportado manualmente por el usuario | Reporte del usuario |

## Interpretación

- `success` con filas: la sesión puede leer esas filas según RLS.
- `success` vacío: la consulta fue autorizada, pero RLS no devolvió proyectos para ese usuario.
- `error`: registrar el mensaje técnico sin incluir tokens; puede indicar credenciales, sesión, esquema o política.
- `loading`: estado transitorio mientras se consulta Supabase.

## Límites

- La pantalla es temporal y no representa el dashboard definitivo.
- La consulta no prueba mutaciones, asignaciones, materiales ni permisos administrativos de escritura.
- La ausencia de filas no distingue por sí sola entre usuario no asignado y fixture incorrecto; comprobar el usuario y los datos desde un canal administrativo autorizado.
- El SQL Editor usa un rol privilegiado y no sustituye esta prueba con sesión real.

## Resultado de esta fase

Los cuatro escenarios fueron reportados como exitosos por el usuario. Codex no los ejecutó automáticamente y no se presentan como una ejecución propia.
