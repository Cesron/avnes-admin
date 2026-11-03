"use client";

import { ArrowUpRightIcon, SearchIcon } from "lucide-react";
import Link from "next/link";
import { useId, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/cn";
import { type DashboardView, periodQuery } from "@/lib/dashboard-period";
import type { AttendanceBreakdown } from "@/services/dashboard/get-weekly-dashboard";
import { normalizeString } from "@/utils/normalize-string";

export type ComparisonRow = AttendanceBreakdown & { percentage: number | null };
type Order = "name" | "attendance" | "pending";

export function AttendanceComparison({
  clubs,
  groups,
  periodView,
  periodStart,
}: {
  clubs: ComparisonRow[];
  groups: ComparisonRow[];
  periodView: DashboardView;
  periodStart: string;
}) {
  const [view, setView] = useState<"clubs" | "groups">("clubs");
  const [search, setSearch] = useState("");
  const [order, setOrder] = useState<Order>("name");
  const searchId = useId();
  const sortId = useId();
  const query = normalizeString(search.trim());
  const source = view === "clubs" ? clubs : groups;
  const rows = source
    .filter((row) =>
      normalizeString(`${row.name} ${row.club_name ?? ""}`).includes(query),
    )
    .sort((a, b) => {
      if (order === "attendance")
        return (
          (b.percentage ?? -1) - (a.percentage ?? -1) ||
          a.name.localeCompare(b.name, "es")
        );
      if (order === "pending")
        return b.pending - a.pending || a.name.localeCompare(b.name, "es");
      return a.name.localeCompare(b.name, "es");
    });
  return (
    <section
      aria-labelledby="comparison-heading"
      className="overflow-hidden rounded-xl border bg-card"
    >
      <div className="space-y-5 p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-1">
            <h2 id="comparison-heading" className="text-lg font-semibold">
              Comparar asistencia
            </h2>
            <p className="max-w-prose text-sm text-muted-foreground">
              Lee cada porcentaje junto al avance del registro.
            </p>
          </div>
          <fieldset
            aria-label="Comparar por"
            className="flex min-w-0 rounded-lg bg-muted p-1"
          >
            {(
              [
                ["clubs", "Clubes"],
                ["groups", "Grupos"],
              ] as const
            ).map(([value, label]) => (
              <Button
                key={value}
                type="button"
                variant="ghost"
                aria-pressed={view === value}
                className={cn(
                  "min-h-10 px-4",
                  view === value &&
                    "bg-background text-foreground shadow-sm hover:bg-background",
                )}
                onClick={() => {
                  setView(value);
                  setSearch("");
                }}
              >
                {label}
                <span className="text-xs text-muted-foreground tabular-nums">
                  {value === "clubs" ? clubs.length : groups.length}
                </span>
              </Button>
            ))}
          </fieldset>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="w-full space-y-1.5 sm:max-w-xs">
            <label htmlFor={searchId} className="text-sm font-medium">
              {view === "clubs" ? "Buscar club" : "Buscar grupo"}
            </label>
            <div className="relative">
              <SearchIcon
                aria-hidden="true"
                className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              />
              <Input
                id={searchId}
                type="search"
                placeholder={
                  view === "clubs"
                    ? "Nombre del club…"
                    : "Nombre del grupo o club…"
                }
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-1.5 sm:w-52">
            <label htmlFor={sortId} className="text-sm font-medium">
              Ordenar por
            </label>
            <Select
              value={order}
              onValueChange={(value) => setOrder(value as Order)}
            >
              <SelectTrigger id={sortId} className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Nombre</SelectItem>
                <SelectItem value="attendance">Mayor asistencia</SelectItem>
                <SelectItem value="pending">Más pendientes</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      <div
        aria-hidden="true"
        className="hidden grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)_minmax(0,1fr)] gap-8 border-y bg-muted/40 px-6 py-3 text-xs font-medium text-muted-foreground lg:grid"
      >
        <span>{view === "clubs" ? "Club" : "Grupo"}</span>
        <span>Asistencia · presentes / (presentes + ausentes)</span>
        <span>Registro · completados / esperados</span>
      </div>
      <ul className="divide-y">
        {rows.map((row) => (
          <li key={row.id} className="px-5 py-5 sm:px-6">
            <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)_minmax(0,1fr)] lg:gap-8">
              <div className="min-w-0 space-y-1">
                <h3 className="font-semibold break-words">
                  {view === "clubs" ? (
                    <Link
                      className="inline-flex max-w-full items-center gap-2 rounded-sm underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-ring"
                      href={
                        "/dashboard?" +
                        periodQuery(periodView, periodStart, row.id)
                      }
                    >
                      {row.name}
                      <ArrowUpRightIcon
                        aria-hidden="true"
                        className="size-3.5 shrink-0 text-muted-foreground"
                      />
                    </Link>
                  ) : (
                    row.name
                  )}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {view === "groups" && row.club_name
                    ? `${row.club_name} · `
                    : ""}
                  {row.occurrences}{" "}
                  {row.occurrences === 1
                    ? "actividad finalizada"
                    : "actividades finalizadas"}
                </p>
              </div>
              <div className="min-w-0 space-y-2">
                <div className="flex items-baseline justify-between gap-2 text-sm">
                  <span className="text-muted-foreground lg:sr-only">
                    Asistencia
                  </span>
                  <span className="font-semibold tabular-nums">
                    {row.percentage === null
                      ? "Sin datos"
                      : `${row.percentage}%`}
                  </span>
                  <span className="text-xs tabular-nums text-muted-foreground">
                    {row.present} de {row.present + row.absent}
                  </span>
                </div>
                <div
                  aria-hidden="true"
                  className="h-2 overflow-hidden rounded-full bg-muted"
                >
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${row.percentage ?? 0}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  {row.percentage === null
                    ? row.expected
                      ? "Aún no hay presentes ni ausentes registrados."
                      : "Sin registros esperados en este período."
                    : "Sobre presentes y ausentes registrados"}
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex items-baseline justify-between gap-2 text-sm tabular-nums">
                  <span className="text-muted-foreground">Registro</span>
                  <span className="font-medium">
                    {row.recorded} / {row.expected}
                  </span>
                </div>
                <div
                  aria-hidden="true"
                  className="h-1.5 overflow-hidden rounded-full bg-muted"
                >
                  <div
                    className="h-full rounded-full bg-muted-foreground"
                    style={{
                      width: `${
                        row.expected ? (row.recorded / row.expected) * 100 : 0
                      }%`,
                    }}
                  />
                </div>
                <p
                  className={cn(
                    "text-xs tabular-nums",
                    row.pending
                      ? "text-amber-subtle-foreground"
                      : "text-muted-foreground",
                  )}
                >
                  {row.pending
                    ? `${row.pending} pendientes`
                    : row.expected
                      ? "Registro completo"
                      : "Sin actividad"}
                </p>
              </div>
            </div>
            {row.expected > 0 && (
              <details className="mt-3 text-sm">
                <summary className="w-fit cursor-pointer rounded-sm py-1 text-muted-foreground underline-offset-4 hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring">
                  Ver registros de {row.name}
                </summary>
                <dl className="mt-2 flex flex-wrap gap-x-6 gap-y-2 tabular-nums">
                  <div className="flex gap-2">
                    <dt>Presentes</dt>
                    <dd className="font-medium">{row.present}</dd>
                  </div>
                  <div className="flex gap-2">
                    <dt>Ausentes</dt>
                    <dd className="font-medium">{row.absent}</dd>
                  </div>
                  <div className="flex gap-2">
                    <dt>Permisos</dt>
                    <dd className="font-medium">{row.excused}</dd>
                  </div>
                  <div className="flex gap-2">
                    <dt>Pendientes</dt>
                    <dd className="font-medium">{row.pending}</dd>
                  </div>
                </dl>
              </details>
            )}
          </li>
        ))}
      </ul>
      {rows.length === 0 && (
        <div className="space-y-3 px-6 py-10 text-center">
          <p className="text-sm text-muted-foreground">
            {query
              ? "No hay resultados para esa búsqueda."
              : "No hay " +
                (view === "clubs" ? "clubes" : "grupos") +
                " en esta selección."}
          </p>
          {query && (
            <Button variant="outline" onClick={() => setSearch("")}>
              Limpiar búsqueda
            </Button>
          )}
        </div>
      )}
      <div className="border-t px-5 py-3 sm:px-6">
        <output className="text-xs text-muted-foreground tabular-nums">
          {rows.length} de {source.length}{" "}
          {view === "clubs" ? "clubes" : "grupos"} · Escala de asistencia de 0 a
          100%
        </output>
      </div>
    </section>
  );
}
