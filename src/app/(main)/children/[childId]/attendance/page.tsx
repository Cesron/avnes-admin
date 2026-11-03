import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { authorize } from "@/lib/auth-utils";
import {
  getChildAttendanceHistory,
  parseHistoryFilters,
} from "@/services/children/get-child-attendance-history";
import type { UserRole } from "@/types/user";

export default async function ChildAttendanceHistoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ childId: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const session = await authorize("/children");
  const { childId } = await params;
  const filters = parseHistoryFilters(await searchParams);
  const data = await getChildAttendanceHistory(
    childId,
    {
      userId: session.user.id,
      role: session.user.role as UserRole,
    },
    filters ?? { from: "", to: "", page: 1 },
  );
  if (!data) notFound();
  const base = `/children/${childId}/attendance`;
  function pageUrl(page: number) {
    const query = new URLSearchParams({
      from: filters?.from ?? "",
      to: filters?.to ?? "",
      page: String(page),
    });
    return `${base}?${query}`;
  }
  const labels = {
    present: "Presente",
    absent: "Ausente",
    excused: "Justificado",
  };
  const variants = {
    present: "green-subtle",
    absent: "destructive",
    excused: "secondary",
  } as const;
  return (
    <>
      <header className="flex min-h-20 items-center gap-3 border-b py-4">
        <SidebarTrigger />
        <Link
          href="/children"
          className="text-sm text-muted-foreground hover:underline"
        >
          Niños
        </Link>
        <span className="text-muted-foreground">/</span>
        <span className="text-sm font-medium">Historial de asistencia</span>
      </header>
      <div className="space-y-6 py-6">
        <div>
          <h1 className="text-2xl font-semibold break-words">
            {data.child.name}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Historial de asistencia
            {data.child.penpal_code
              ? ` · Penpal ${data.child.penpal_code}`
              : ""}
          </p>
        </div>
        <form
          action={base}
          className="flex flex-wrap items-end gap-3 rounded-lg border p-4"
        >
          <div className="space-y-2">
            <label htmlFor="history-from" className="text-sm font-medium">
              Desde
            </label>
            <Input
              id="history-from"
              type="date"
              name="from"
              defaultValue={filters?.from}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="history-to" className="text-sm font-medium">
              Hasta
            </label>
            <Input
              id="history-to"
              type="date"
              name="to"
              defaultValue={filters?.to}
            />
          </div>
          <Button type="submit">Filtrar</Button>
          <Button variant="outline" asChild>
            <Link href={base}>Limpiar</Link>
          </Button>
        </form>
        {!filters ? (
          <p role="alert" className="text-destructive">
            Ingresa fechas válidas; «Desde» debe ser anterior o igual a «Hasta».
          </p>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
              {[
                ["Registros", data.summary.total],
                ["Presentes", data.summary.present],
                ["Ausentes", data.summary.absent],
                ["Justificados", data.summary.excused],
              ].map(([label, count]) => (
                <div key={label} className="rounded-lg border p-4">
                  <p className="text-sm text-muted-foreground">{label}</p>
                  <p className="mt-2 text-2xl font-semibold tabular-nums">
                    {count}
                  </p>
                </div>
              ))}
            </div>
            <p className="text-sm text-muted-foreground">
              El resumen corresponde a todas las fechas filtradas. Solo se
              incluyen asistencias registradas; las actividades sin registro no
              cuentan como ausencias.
            </p>
            {data.items.length === 0 ? (
              <div className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
                No hay registros de asistencia para este período.
              </div>
            ) : (
              <ul className="divide-y rounded-lg border">
                {data.items.map((item) => (
                  <li key={item.id} className="space-y-2 p-4">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="font-medium break-words">
                          {item.activity_name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          <time dateTime={`${item.date}T${item.time}`}>
                            {item.date.split("-").reverse().join("/")} ·{" "}
                            {item.time}
                          </time>
                        </p>
                      </div>
                      <Badge variant={variants[item.status] ?? "secondary"}>
                        {labels[item.status] ?? item.status}
                      </Badge>
                    </div>
                    {item.notes && (
                      <p className="whitespace-pre-wrap break-words text-sm text-muted-foreground">
                        {item.notes}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            )}
            <nav
              aria-label="Paginación del historial"
              className="flex flex-wrap items-center justify-between gap-3"
            >
              <p className="text-sm text-muted-foreground">
                Página <span className="tabular-nums">{data.page}</span> de{" "}
                <span className="tabular-nums">{data.pages}</span>
              </p>
              <div className="flex gap-2">
                {data.page > 1 && (
                  <Button variant="outline" asChild>
                    <Link href={pageUrl(data.page - 1)}>Anterior</Link>
                  </Button>
                )}
                {data.page < data.pages && (
                  <Button variant="outline" asChild>
                    <Link href={pageUrl(data.page + 1)}>Siguiente</Link>
                  </Button>
                )}
              </div>
            </nav>
          </>
        )}
      </div>
    </>
  );
}
