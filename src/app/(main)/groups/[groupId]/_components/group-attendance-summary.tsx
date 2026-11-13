import { InfoIcon } from "lucide-react";
import {
  type AttendanceMetrics,
  attendancePercentage,
} from "@/services/dashboard/get-weekly-dashboard";

export function GroupAttendanceSummary({
  summary: s,
  childrenCount,
}: {
  summary: AttendanceMetrics;
  childrenCount: number;
}) {
  const attendance = attendancePercentage(s);
  const capture = s.expected
    ? Math.round((s.recorded / s.expected) * 100)
    : null;

  return (
    <section
      aria-labelledby="group-attendance-heading"
      className="overflow-hidden rounded-xl border bg-card"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-2 px-5 pt-5 sm:px-6 sm:pt-6">
        <h2 id="group-attendance-heading" className="text-lg font-semibold">
          Asistencia del grupo
        </h2>
        <p className="text-sm text-muted-foreground tabular-nums">
          {s.occurrences}{" "}
          {s.occurrences === 1
            ? "actividad finalizada"
            : "actividades finalizadas"}{" "}
          en el período
        </p>
      </div>
      <dl className="grid gap-6 p-5 sm:grid-cols-3 sm:divide-x sm:p-6">
        <div className="space-y-2 sm:pr-5">
          <dt className="text-sm font-medium text-muted-foreground">
            Niños en el grupo
          </dt>
          <dd className="text-3xl font-semibold tracking-tight tabular-nums">
            {childrenCount}
          </dd>
          <dd className="text-sm text-muted-foreground">
            Con asignación activa actualmente
          </dd>
        </div>
        <div className="space-y-2 sm:pr-5">
          <dt className="text-sm font-medium text-muted-foreground">
            Asistencia registrada
          </dt>
          <dd className="text-3xl font-semibold tracking-tight tabular-nums">
            {attendance === null ? "Sin datos" : `${attendance}%`}
          </dd>
          <dd className="space-y-2">
            <div
              aria-hidden="true"
              className="h-2 overflow-hidden rounded-full bg-muted"
            >
              <div
                className="h-full rounded-full bg-primary"
                style={{ width: `${attendance ?? 0}%` }}
              />
            </div>
            <p className="text-sm text-muted-foreground tabular-nums">
              {s.present} presentes · {s.absent} ausentes
            </p>
          </dd>
        </div>
        <div className="space-y-2">
          <dt className="text-sm font-medium text-muted-foreground">
            Registro completado
          </dt>
          <dd className="text-3xl font-semibold tracking-tight tabular-nums">
            {capture === null ? "Sin datos" : `${capture}%`}
          </dd>
          <dd className="space-y-2">
            <div
              aria-hidden="true"
              className="h-2 overflow-hidden rounded-full bg-muted"
            >
              <div
                className="h-full rounded-full bg-muted-foreground"
                style={{ width: `${capture ?? 0}%` }}
              />
            </div>
            <p className="text-sm text-muted-foreground tabular-nums">
              {s.recorded} de {s.expected} registros esperados
            </p>
          </dd>
        </div>
      </dl>
      <dl className="grid grid-cols-2 gap-4 border-t bg-muted/30 px-5 py-4 sm:grid-cols-4 sm:px-6">
        {[
          ["Presentes", s.present],
          ["Ausentes", s.absent],
          ["Con permiso", s.excused],
          ["Por registrar", s.pending],
        ].map(([label, count]) => (
          <div key={label} className="space-y-1">
            <dt className="text-xs text-muted-foreground">{label}</dt>
            <dd className="text-lg font-semibold tabular-nums">{count}</dd>
          </div>
        ))}
      </dl>
      {s.expected === 0 ? (
        <p className="border-t px-5 py-4 text-sm text-muted-foreground sm:px-6">
          No hay registros esperados para este grupo en el período. Consulta una
          semana o un mes anterior.
        </p>
      ) : s.pending > 0 ? (
        <div className="flex items-start gap-2 border-t bg-amber-subtle px-5 py-3 text-sm text-amber-subtle-foreground sm:px-6">
          <InfoIcon aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
          <p>
            Hay {s.pending}{" "}
            {s.pending === 1 ? "registro pendiente" : "registros pendientes"}.
            El porcentaje puede cambiar al completarlos; un pendiente no es una
            ausencia.
          </p>
        </div>
      ) : null}
      <details className="border-t px-5 py-3 text-sm text-muted-foreground sm:px-6">
        <summary className="w-fit cursor-pointer rounded-sm py-1 font-medium text-foreground focus-visible:outline-2 focus-visible:outline-ring">
          Cómo se calcula la asistencia
        </summary>
        <p className="mt-2 max-w-prose pb-1 leading-relaxed">
          Asistencia = presentes / (presentes + ausentes). Los permisos se
          incluyen en el avance del registro y se excluyen del porcentaje de
          asistencia. Se consideran las asignaciones actuales de este grupo y
          solo sus actividades finalizadas, excluyendo las canceladas, en hora
          de El Salvador. Cada registro corresponde a un niño y una fecha de
          actividad.
        </p>
      </details>
    </section>
  );
}
