import {
  ArrowRightIcon,
  CalendarDaysIcon,
  CheckCircle2Icon,
  InfoIcon,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  dashboardPeriod,
  periodQuery,
  shiftPeriod,
} from "@/lib/dashboard-period";
import { getClubsOptions } from "@/services/clubs/get-clubs-options";
import {
  attendancePercentage,
  getWeeklyDashboard,
} from "@/services/dashboard/get-weekly-dashboard";
import { AttendanceComparison } from "./attendance-comparison";
import { DashboardFilters } from "./dashboard-filters";

export async function AdminDashboard({
  weekInput,
  monthInput,
  viewInput,
  clubInput,
}: {
  weekInput?: string;
  monthInput?: string;
  viewInput?: string;
  clubInput?: string;
}) {
  const {
    view,
    current,
    period: week,
  } = dashboardPeriod(
    viewInput,
    viewInput === "month" ? monthInput : weekInput,
  );
  const monthly = view === "month";
  const clubs = await getClubsOptions();
  const club = clubs.find((item) => item.id === clubInput);
  const data = await getWeeklyDashboard(
    week.start,
    week.endExclusive,
    club?.id,
  );
  const s = data.summary;
  const attendance = attendancePercentage(s);
  const capture = s.expected
    ? Math.round((s.recorded / s.expected) * 100)
    : null;
  const previousParams = periodQuery(
    view,
    shiftPeriod(view, week.start, -1),
    club?.id,
  );
  return (
    <div className="space-y-7 pb-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight">
            Asistencia {monthly ? "mensual" : "semanal"}
          </h1>
          <p className="max-w-prose text-sm text-muted-foreground">
            {club
              ? `Resultados de ${club.name}`
              : "Una mirada a todos los clubes de AVNES"}
            . Compara la asistencia y el avance del registro.
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href="/attendance">
            <CalendarDaysIcon aria-hidden="true" />
            Ver actividades
          </Link>
        </Button>
      </div>
      <DashboardFilters
        view={view}
        start={week.start}
        currentStart={current.start}
        today={current.today}
        clubId={club?.id}
        clubs={clubs}
      />
      <section
        aria-label={monthly ? "Resumen mensual" : "Resumen semanal"}
        className="border-y py-5"
      >
        <dl className="grid gap-5 sm:grid-cols-3 sm:gap-6 sm:divide-x">
          <div className="space-y-2 sm:pr-5">
            <dt className="text-sm font-medium text-muted-foreground">
              Asistencia registrada
            </dt>
            <dd className="text-3xl font-semibold tracking-tight tabular-nums">
              {attendance === null ? "Sin datos" : `${attendance}%`}
            </dd>
            <dd className="text-sm text-muted-foreground tabular-nums">
              {s.present} presentes · {s.absent} ausentes
            </dd>
          </div>
          <div className="space-y-2 sm:px-5">
            <dt className="text-sm font-medium text-muted-foreground">
              Registro completado
            </dt>
            <dd className="text-3xl font-semibold tracking-tight tabular-nums">
              {capture === null ? "Sin datos" : `${capture}%`}
            </dd>
            <dd className="text-sm text-muted-foreground tabular-nums">
              {s.recorded} de {s.expected} registros esperados
            </dd>
          </div>
          <div className="space-y-2 sm:pl-5">
            <dt className="text-sm font-medium text-muted-foreground">
              Por registrar
            </dt>
            <dd className="text-3xl font-semibold tracking-tight tabular-nums">
              {s.pending}
            </dd>
            <dd className="text-sm text-muted-foreground">
              {data.pendingCount ? (
                <a
                  href="#pending-attendance"
                  className="rounded-sm underline underline-offset-4 hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring"
                >
                  En {data.pendingCount}{" "}
                  {data.pendingCount === 1 ? "actividad" : "actividades"} · Ver
                  pendientes
                </a>
              ) : (
                "Sin pendientes en esta selección"
              )}
            </dd>
          </div>
        </dl>
      </section>
      {s.expected === 0 ? (
        <div className="flex flex-col gap-4 rounded-xl bg-muted/50 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <h2 className="font-medium">
              No hay registros esperados en esta selección
            </h2>
            <p className="max-w-prose text-sm text-muted-foreground">
              El análisis incluye solo actividades finalizadas. Consulta un
              período anterior o revisa las actividades programadas.
            </p>
          </div>
          <Button asChild variant="outline" className="self-start sm:self-auto">
            <Link href={`/dashboard?${previousParams}`}>
              Ver {monthly ? "mes" : "semana"} anterior
              <ArrowRightIcon aria-hidden="true" />
            </Link>
          </Button>
        </div>
      ) : s.pending > 0 ? (
        <div className="flex items-start gap-3 rounded-lg bg-amber-subtle px-4 py-3 text-amber-subtle-foreground">
          <InfoIcon aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
          <p className="text-sm">
            <strong className="font-semibold">Registro incompleto.</strong> Los
            porcentajes pueden cambiar al completar los {s.pending} pendientes.
            Un registro pendiente no es una ausencia.
          </p>
        </div>
      ) : null}
      <AttendanceComparison
        key={`${view}:${week.start}:${club?.id ?? "all"}`}
        clubs={data.clubs.map((row) => ({
          ...row,
          percentage: attendancePercentage(row),
        }))}
        groups={data.groups.map((row) => ({
          ...row,
          percentage: attendancePercentage(row),
        }))}
        periodView={view}
        periodStart={week.start}
      />
      <section
        id="pending-attendance"
        aria-labelledby="pending-heading"
        className="scroll-mt-6 space-y-4"
      >
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 id="pending-heading" className="text-lg font-semibold">
            Completar registros
          </h2>
          <p className="text-sm text-muted-foreground">
            Actividades finalizadas {monthly ? "del mes" : "de la semana"}
          </p>
        </div>
        {data.pending.length ? (
          <ul className="divide-y rounded-xl border px-5 sm:px-6">
            {data.pending.map((item) => (
              <li
                key={item.id}
                className="flex flex-wrap items-center justify-between gap-4 py-5"
              >
                <div className="min-w-0 flex-1 basis-60 space-y-1">
                  <h3 className="text-sm font-semibold break-words">
                    {item.name}
                  </h3>
                  <p className="text-sm text-muted-foreground break-words">
                    {item.date.split("-").reverse().join("/")} · {item.groups}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-4">
                  <span className="text-sm tabular-nums text-amber-subtle-foreground">
                    {item.pending} de {item.expected} pendientes
                  </span>
                  <Button asChild variant="outline">
                    <Link href={`/attendance/${item.id}`}>
                      Completar
                      <ArrowRightIcon aria-hidden="true" />
                    </Link>
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex items-center gap-3 rounded-xl border px-5 py-5">
            <CheckCircle2Icon
              aria-hidden="true"
              className="size-5 shrink-0 text-muted-foreground"
            />
            <p className="text-sm text-muted-foreground">
              {s.expected
                ? "Todos los registros de esta selección están completos."
                : "No hay registros pendientes para esta selección."}
            </p>
          </div>
        )}
        {data.pendingCount > 8 && (
          <p className="text-sm text-muted-foreground">
            Se muestran las 8 actividades más antiguas de {data.pendingCount}{" "}
            con registros pendientes.
          </p>
        )}
      </section>
      <details className="border-t pt-4 text-sm text-muted-foreground">
        <summary className="w-fit cursor-pointer rounded-sm py-2 font-medium text-foreground focus-visible:outline-2 focus-visible:outline-ring">
          Cómo se calcula este informe
        </summary>
        <div className="mt-3 max-w-prose space-y-2 leading-relaxed">
          <p>
            La asistencia es presentes / (presentes + ausentes). Los {s.excused}{" "}
            permisos registrados no entran en ese porcentaje. El avance del
            registro incluye presentes, ausentes y permisos.
          </p>
          <p>
            {monthly
              ? "Mes calendario, del primer al último día"
              : "Semana de lunes a domingo"}
            , hora de El Salvador. Se incluyen solo actividades finalizadas y se
            excluyen las canceladas. Cada registro corresponde a un niño y una
            fecha de actividad.
          </p>
          <p>
            Los desgloses usan las asignaciones actuales de grupos. Un niño en
            varios grupos se cuenta una sola vez en el total general; los
            subtotales de grupos pueden solaparse.
          </p>
        </div>
      </details>
    </div>
  );
}
