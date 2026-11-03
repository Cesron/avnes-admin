export function AttendanceStatsCards({
  total,
  present,
  absent,
  excused,
}: {
  total: number;
  present: number;
  absent: number;
  excused: number;
}) {
  const recorded = present + absent + excused;
  const pending = total - recorded;
  return (
    <section aria-label="Resumen de asistencia" className="space-y-3">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-lg font-semibold">Registro de asistencia</h2>
        <output className="text-sm tabular-nums">
          {recorded} de {total} registrados · {pending} pendientes
        </output>
      </div>
      <progress
        aria-label="Avance del registro"
        value={recorded}
        max={total || 1}
        className="attendance-progress h-2 w-full overflow-hidden rounded-full"
      />
      <dl className="flex flex-wrap gap-x-5 gap-y-2 text-sm tabular-nums">
        <div className="flex gap-2">
          <dt>Presentes</dt>
          <dd className="font-semibold text-green-subtle-foreground">
            {present}
          </dd>
        </div>
        <div className="flex gap-2">
          <dt>Ausentes</dt>
          <dd className="font-semibold text-red-subtle-foreground">{absent}</dd>
        </div>
        <div className="flex gap-2">
          <dt>Permisos</dt>
          <dd className="font-semibold text-amber-subtle-foreground">
            {excused}
          </dd>
        </div>
      </dl>
      <p className="text-sm text-muted-foreground">
        Cada selección se guarda automáticamente. Puedes cambiarla si necesitas
        corregirla.
      </p>
    </section>
  );
}
