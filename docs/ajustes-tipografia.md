# Ajustes de tipografía

Fecha: 2 de noviembre de 2026. Modo: `full`, limitado a los tres conceptos solicitados: Text wrapping, Tabular numbers y Make text crispy.

Proyecto: `C:/adilson/avnes-admin`. Framework: Next.js 16 y React 19. Estilos: Tailwind 4, utilidades existentes y `@apply` dentro de `@layer base`. Fuente existente: Geist. El proyecto coming-soon queda fuera del alcance.

## Cobertura

| Categoría | Evidencia inspeccionada | Resultado |
| --- | --- | --- |
| Tipografía | Layout raíz, CSS global, componentes Card/Dialog/Sheet/Field/Input, KPI compartidos y del dashboard, tablas, paginación, contadores, calendario y agenda. Navegador: acceso, dashboard vacío y con datos, actividades, diálogo de grupos, agenda y calendario. | Saltos de línea y cifras corregidos; suavizado ya presente. |
| Superficies | No revisadas: fuera del alcance solicitado. | Not reviewed |
| Animaciones | No revisadas: fuera del alcance solicitado. | Not reviewed; no se modificó movimiento, no corresponde reproducción al 10 %. |
| Iconos | No revisados: fuera del alcance solicitado. | Not reviewed |
| Rendimiento | Alcance limitado a implementación tipográfica: CSS estático, sin dependencias ni lógica nueva; excepción para notas largas. | Sin hallazgos dentro de este alcance; sin perfilado general. |

## Cambios aplicados

Todos los hallazgos de esta tabla quedaron resueltos.

### Text wrapping

| Severity | Location | Before | After | Why |
| --- | --- | --- | --- | --- |
| LOW | `src/app/globals.css:170` | Encabezados y títulos compartidos sin una regla común de ajuste. | `text-balance` en h1–h6 y slots de títulos de Card/Dialog/Sheet, en la capa base. | Text Wrapping: distribuye mejor títulos de varias líneas; las utilidades de truncado conservan prioridad. |
| LOW | `src/app/globals.css:181`, `src/app/globals.css:186`, `src/components/list-pagination.tsx:24` | Descripciones y mensajes sin tratamiento uniforme de palabras aisladas. | `text-pretty` en párrafos, listas, captions, citas, descripciones compartidas, errores de campos y salida de paginación. Las notas `whitespace-pre-wrap` usan `text-wrap: wrap`. | Text Wrapping: mejora los saltos de texto breve y medio; las notas libres conservan saltos manuales y evitan el ajuste pretty en contenido potencialmente largo. |

### Tabular numbers

| Severity | Location | Before | After | Why |
| --- | --- | --- | --- | --- |
| MEDIUM | `src/components/kpi-card.tsx:138`; `src/app/(main)/dashboard/_components/kpi-card.tsx:43`, `:47`; `src/app/(main)/dashboard/_components/admin-dashboard.tsx:164`, `:178`, `:192`; `src/app/(main)/dashboard/_components/attendance-bars.tsx:35` | Algunas cifras principales ya eran tabulares, pero otros KPI, sus resúmenes y los porcentajes del gráfico usaban cifras proporcionales. | `tabular-nums` en los valores y descripciones numéricas que faltaban. | Tabular Numbers: iguala el ancho de cada dígito al actualizar las métricas. No reserva espacio para cambios en la cantidad de dígitos ni en las etiquetas. |
| MEDIUM | `src/components/list-pagination.tsx:24`; `src/app/(main)/children/[childId]/attendance/page.tsx:172`, `:173`; `src/app/(main)/groups/_components/groups-list.tsx:26`; `src/app/(main)/clubs/_components/clubs-list.tsx:26`; `src/app/(main)/families/_components/family-card.tsx:198`; `src/app/(main)/activities/_components/activity-card.tsx:106`; `src/app/(main)/activities/_components/groups-list-dialog.tsx:41`; `src/app/(main)/attendance/_components/occurrence-card.tsx:53`, `:123`, `:172` | Contadores de registros, páginas, grupos, niños y asistencias sin ancho uniforme por dígito. | `tabular-nums` aplicado a esos contadores. | Tabular Numbers: estabiliza la presentación de cantidades que pueden cambiar. |
| LOW | `src/app/globals.css:194`; `src/app/(main)/attendance/_components/calendar-day-cell.tsx:36`, `:70`; `src/app/(main)/attendance/_components/attendance-agenda-view.tsx:68`, `:91`; `src/app/(main)/attendance/_components/week-day-column.tsx:37`; `src/app/(main)/attendance/_components/week-navigator.tsx:82`; `src/app/(main)/attendance/_components/month-navigator.tsx:78`; `src/app/(main)/attendance/[occurrenceId]/_components/occurrence-header.tsx:89` | Días, navegación de fechas y algunos horarios y campos numéricos sin regla tabular. | `tabular-nums` en esos valores y, como regla base, en `time` e inputs number/date/time/datetime-local. | Tabular Numbers: mantiene cifras alineadas al navegar fechas o editar cantidades y horarios. |

### Make text crispy

`src/app/layout.tsx:45` ya aplica `antialiased` en el body raíz. Se conserva esa implementación y la fuente Geist. No hizo falta modificar el layout ni añadir reglas duplicadas. La apariencia específica en macOS no se puede verificar desde este equipo Windows.

## Considerado y descartado

| Location | Candidate | Rejected because |
| --- | --- | --- |
| `src/app/(main)/activities/_components/activity-card.tsx:57` y demás tarjetas compactas | Sustituir todos los `truncate` por títulos multilínea. | Cambiaría la densidad y altura de las tarjetas. Se verificó que mantienen `white-space: nowrap` y elipsis. |
| `src/app/globals.css:181`; `src/app/(main)/children/[childId]/attendance/page.tsx:159` | Heredar `pretty` desde el body completo. | Afectaría controles y contenido extenso. Se usan elementos semánticos y slots concretos, con excepción explícita para notas libres. |
| `src/app/globals.css:194`; códigos de familia en `src/app/(main)/families/_components/family-card.tsx:151` | Activar números tabulares globalmente. | No es necesario para nombres, correos, identificadores ni números decorativos. Se limita a métricas y valores que cambian; los códigos conservan su estilo existente. |

## Verificación

- `npm run build`: correcto; compilación de producción, comprobación TypeScript y generación de 17 páginas terminadas.
- `npx tsc --noEmit`: correcto al ejecutarse después de la compilación. Un intento inicial concurrente con el build encontró archivos temporales de `.next/types` ausentes; la repetición secuencial pasó.
- `git diff --check`: correcto.
- `npx biome check --formatter-enabled=false --assist-enabled=false` sobre los 19 archivos de código modificados: un error previo de semántica en `month-navigator.tsx` (`role="group"`) y un aviso previo de variable sin uso en `week-navigator.tsx` (`DAY_NAMES_SHORT`). La comparación con `git show HEAD:<ruta>` confirma que ambas construcciones ya existían. Los otros 17 archivos pasan este chequeo.
- `npm run lint`: no pasa por problemas existentes de formato, imports y reglas del repositorio (192 errores y 42 avisos en esta ejecución). No se aplicaron arreglos automáticos generales.
- Navegador local de producción: acceso y dashboard; semana sin datos y semana con 86 % de asistencia, 50 % de captura y 38 pendientes. Se verificaron estados de carga y controles deshabilitados durante la navegación.
- A 390 px: dashboard y agenda sin desbordamiento horizontal; tarjetas de actividades y diálogo de 12 grupos legibles. Se comprobó en estilos calculados `balance` en títulos, `pretty` en descripciones y `tabular-nums` en cifras. Los títulos truncados mantienen elipsis y nowrap. Se abrió también el calendario compacto y se restauró el tamaño del navegador al terminar.
- No se crearon ni editaron registros durante la comprobación visual.
- **Not verified**: renderizado en macOS, modo claro, Firefox/Safari, cada formulario y variante de error, vista exclusiva del rol mentor, historial individual y todas las rutas del panel en navegador. Los componentes y selectores correspondientes se inspeccionaron en código, sin afirmar cobertura visual completa.

## Veredicto

**Approve**, limitado a estos tres conceptos y con las comprobaciones no verificadas indicadas arriba. Sin hallazgos tipográficos accionables pendientes en el alcance inspeccionado. El lint general continúa con deuda previa fuera de este cambio.
