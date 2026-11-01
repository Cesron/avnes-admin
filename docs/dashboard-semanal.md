# Dashboard semanal de administración y coordinación

El dashboard prioriza la supervisión por club y grupo. Sustituye los totales
generales y rankings por asistencia registrada, avance de captura y pendientes.
La vista de mentoras conserva su comportamiento previo y queda para otra etapa.

## Definiciones

- Semana: lunes a domingo, usando `America/El_Salvador` para determinar hoy.
- Solo se evalúan fechas de actividad finalizadas, nunca futuras o canceladas.
- Una observación es un niño en una fecha de actividad; no representa un niño
  único en toda la semana, porque puede asistir a varias fechas.
- Asistencia: presentes / (presentes + ausentes). Los justificados se muestran
  por separado y no forman parte del denominador.
- Captura: (presentes + ausentes + justificados) / registros esperados.
- Pendientes: registros esperados sin estado válido capturado. No son ausencias.
- Sin presentes ni ausentes, la asistencia es `Sin datos`, incluso si todos los
  registros existentes son justificados. Cero por ciento requiere ausencias reales.
- Cada par niño/fecha se deduplica en el resumen y en cada club. Un niño de varios
  grupos aparece en cada grupo pertinente; por eso no se deben sumar los desgloses
  para reconstruir el total general.

## Consultas

`get-weekly-dashboard.ts` ejecuta una sola consulta con una base común de fechas
elegibles y participantes. Los agregados del resumen, clubes, grupos y pendientes
se calculan sobre el mismo snapshot de PostgreSQL. Los límites de fecha usan
comparaciones sobre `start_datetime`, compatibles con su índice existente.
La lista de pendientes muestra como máximo ocho fechas, con enlaces para capturar.

Se retiraron las antiguas consultas del ranking, asistencia por club y alertas
mensuales que ya no utiliza el dashboard. Las consultas de mentoras no se cambiaron.

## Alcance histórico

El esquema actual no almacena el grupo/club del niño en el momento de registrar
asistencia ni fechas de alta y baja de membresías. Los reportes por grupo y los
participantes esperados usan membresías activas actuales. No se consideran
esperados los niños creados después de la actividad, salvo que tengan un registro
de asistencia explícito para esa fecha (por ejemplo, datos importados).

Una reasignación, desactivación o importación puede cambiar el reporte histórico.
Para garantizar históricos inmutables se necesita guardar participantes y grupo/club
por ocurrencia. Esa migración y reconstrucción histórica quedan fuera de este cambio;
no se inventan asignaciones pasadas a partir de datos que el esquema no conserva.

## Validación

```powershell
$env:PGOPTIONS='-c default_transaction_read_only=on'
node --env-file=.env --import tsx --test tests/dashboard.test.ts
```

Las pruebas SQL usan CTEs con datos ficticios que sustituyen las tablas en la
consulta, sin modificar registros. Cubren actividades compartidas, deduplicación,
pendientes, justificados, cancelaciones, actividades futuras, filtro de club,
semanas vacías y zona horaria. Requieren PostgreSQL; sin `DB_HOST` esa prueba se omite.
