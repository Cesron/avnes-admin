import { ArrowUpRightIcon, ClipboardListIcon } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { dashboardWeek } from "@/lib/dashboard-week";
import { getClubsOptions } from "@/services/clubs/get-clubs-options";
import {
  type AttendanceBreakdown,
  attendancePercentage,
  getWeeklyDashboard,
} from "@/services/dashboard/get-weekly-dashboard";
import { DashboardFilters } from "./dashboard-filters";

function Breakdown({
  rows,
  groups = false,
}: {
  rows: AttendanceBreakdown[];
  groups?: boolean;
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{groups ? "Grupo" : "Club"}</TableHead>
          <TableHead className="text-right">Presentes</TableHead>
          <TableHead className="text-right">Ausentes</TableHead>
          <TableHead className="text-right">Justificados</TableHead>
          <TableHead className="text-right">Pendientes</TableHead>
          <TableHead className="text-right">Asistencia</TableHead>
          <TableHead className="text-right">Captura</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row) => {
          const percentage = attendancePercentage(row);
          return (
            <TableRow key={row.id}>
              <TableCell className="font-medium">
                <span className="block">{row.name}</span>
                {groups && (
                  <span className="text-xs font-normal text-muted-foreground">
                    {row.club_name}
                  </span>
                )}
              </TableCell>
              <TableCell className="text-right tabular-nums">
                {row.present}
              </TableCell>
              <TableCell className="text-right tabular-nums">
                {row.absent > 0 ? (
                  <span className="text-destructive">{row.absent}</span>
                ) : (
                  0
                )}
              </TableCell>
              <TableCell className="text-right tabular-nums text-muted-foreground">
                {row.excused}
              </TableCell>
              <TableCell className="text-right tabular-nums">
                {row.pending > 0 ? (
                  <Badge
                    variant="outline"
                    className="border-amber-500/25 bg-amber-500/10 text-amber-700 dark:text-amber-400"
                  >
                    {row.pending}
                  </Badge>
                ) : (
                  0
                )}
              </TableCell>
              <TableCell className="text-right font-semibold tabular-nums">
                {percentage === null ? (
                  <span className="font-normal text-muted-foreground">
                    Sin datos
                  </span>
                ) : (
                  `${percentage}%`
                )}
              </TableCell>
              <TableCell className="text-right text-xs tabular-nums text-muted-foreground">
                {row.expected
                  ? `${row.recorded} / ${row.expected}`
                  : "Sin actividad"}
              </TableCell>
            </TableRow>
          );
        })}
        {rows.length === 0 && (
          <TableRow>
            <TableCell
              colSpan={7}
              className="h-24 text-center text-muted-foreground"
            >
              No hay grupos para este club.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}

export async function AdminDashboard({
  weekInput,
  clubInput,
}: {
  weekInput?: string;
  clubInput?: string;
}) {
  const current = dashboardWeek();
  const requested = dashboardWeek(weekInput);
  const week = requested.start > current.start ? current : requested;
  const clubs = await getClubsOptions();
  const clubId = clubs.find((club) => club.id === clubInput)?.id;
  const data = await getWeeklyDashboard(week.start, week.endExclusive, clubId);
  const s = data.summary;
  const attendance = attendancePercentage(s);
  const capture = s.expected
    ? Math.round((s.recorded / s.expected) * 100)
    : null;
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Asistencia semanal
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Supervisa los resultados de tus clubes y el avance de la captura.
        </p>
      </div>
      <DashboardFilters
        week={week.start}
        currentWeek={current.start}
        clubId={clubId}
        clubs={clubs}
      />
      <section
        aria-label="Resumen semanal"
        className="grid gap-4 md:grid-cols-3"
      >
        <Card className="border-primary/20 bg-primary/5 shadow-none">
          <CardHeader>
            <CardDescription>Asistencia registrada</CardDescription>
            <CardTitle className="text-4xl font-semibold tracking-tight tabular-nums">
              {attendance === null ? "Sin datos" : `${attendance}%`}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground tabular-nums">
            {s.present} presentes · {s.absent} ausentes
            <p className="mt-1 text-xs">
              {s.excused} justificados, excluidos del porcentaje
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-none">
          <CardHeader>
            <CardDescription>Avance de captura</CardDescription>
            <CardTitle className="text-4xl font-semibold tracking-tight tabular-nums">
              {capture === null ? "Sin datos" : `${capture}%`}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground tabular-nums">
            {s.recorded} de {s.expected} registros completados
            <p className="mt-1 text-xs">
              Una asistencia por niño y fecha de actividad
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-none">
          <CardHeader>
            <CardDescription>Pendientes de capturar</CardDescription>
            <CardTitle className="text-4xl font-semibold tracking-tight tabular-nums">
              {s.pending}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground tabular-nums">
            En {data.pendingCount} fechas de actividad
            <p className="mt-1 text-xs">
              Los pendientes no cuentan como ausencias
            </p>
          </CardContent>
        </Card>
      </section>
      {s.expected === 0 && (
        <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
          No hay asistencias esperadas para actividades finalizadas en esta
          semana y selección.
        </div>
      )}
      {s.pending > 0 && (
        <p className="rounded-lg border border-amber-500/20 bg-amber-500/5 px-4 py-3 text-sm text-amber-800 dark:text-amber-300">
          La captura está incompleta. El porcentaje refleja únicamente los
          registros confirmados y puede cambiar al completar los pendientes.
        </p>
      )}
      <Card className="overflow-hidden shadow-none">
        <CardHeader>
          <CardTitle>Asistencia por club</CardTitle>
          <CardDescription>
            Resultados y registros pendientes, sin clasificación competitiva.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Breakdown rows={data.clubs} />
        </CardContent>
      </Card>
      <Card className="overflow-hidden shadow-none">
        <CardHeader>
          <CardTitle>Detalle por grupo</CardTitle>
          <CardDescription>
            Identifica dónde faltan registros antes de interpretar los
            porcentajes.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Breakdown rows={data.groups} groups />
        </CardContent>
      </Card>
      <Card className="shadow-none">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ClipboardListIcon className="size-4" />
            Por completar
          </CardTitle>
          <CardDescription>
            {data.pendingCount > 8
              ? `Mostrando las 8 fechas más antiguas de ${data.pendingCount} pendientes en la semana.`
              : "Actividades finalizadas que aún tienen registros pendientes."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {data.pending.length ? (
            <ul className="divide-y">
              {data.pending.map((item) => (
                <li
                  key={item.id}
                  className="flex flex-wrap items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium">{item.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.date.split("-").reverse().join("/")} · {item.groups}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs tabular-nums text-muted-foreground">
                      {item.pending} pendientes de {item.expected}
                    </span>
                    <Button asChild size="sm" variant="outline">
                      <Link href={`/attendance/${item.id}`}>
                        Completar
                        <ArrowUpRightIcon className="size-3.5" />
                      </Link>
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="py-4 text-sm text-muted-foreground">
              {s.expected
                ? "La captura de esta selección está completa."
                : "Sin pendientes para esta selección."}
            </p>
          )}
        </CardContent>
      </Card>
      <p className="text-xs leading-relaxed text-muted-foreground">
        Semana de lunes a domingo · Hora de El Salvador · Solo actividades
        finalizadas, excluyendo canceladas. La asistencia se calcula como
        presentes / (presentes + ausentes). Los desgloses usan las asignaciones
        actuales de grupos; un niño en varios grupos se cuenta una sola vez en
        el total general.
      </p>
    </div>
  );
}
