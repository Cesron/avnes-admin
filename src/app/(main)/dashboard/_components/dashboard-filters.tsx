"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useId, useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  type DashboardView,
  periodLabel,
  periodQuery,
  shiftPeriod,
} from "@/lib/dashboard-period";
import { dashboardWeek } from "@/lib/dashboard-week";

export function DashboardFilters({
  view,
  start,
  currentStart,
  today,
  clubId,
  clubs,
}: {
  view: DashboardView;
  start: string;
  currentStart: string;
  today: string;
  clubId?: string;
  clubs: { id: string; name: string }[];
}) {
  const router = useRouter();
  const clubSelectId = useId();
  const [pending, startTransition] = useTransition();
  function navigate(
    nextStart: string,
    club: string | null = clubId ?? null,
    nextView = view,
  ) {
    const params = periodQuery(nextView, nextStart, club);
    startTransition(() =>
      router.push(`/dashboard?${params}`, { scroll: false }),
    );
  }
  return (
    <div
      className="flex flex-col justify-between gap-4 rounded-xl border bg-card p-4 sm:flex-row sm:flex-wrap sm:items-end"
      aria-busy={pending}
    >
      <fieldset className="space-y-2">
        <legend className="text-sm font-medium">Vista</legend>
        <div className="flex rounded-lg border bg-background p-1">
          {(["week", "month"] as const).map((option) => (
            <Button
              key={option}
              variant={view === option ? "secondary" : "ghost"}
              size="sm"
              aria-pressed={view === option}
              disabled={pending}
              onClick={() => {
                const anchor = start === currentStart ? today : start;
                navigate(
                  option === "month"
                    ? `${anchor.slice(0, 7)}-01`
                    : dashboardWeek(anchor).start,
                  clubId,
                  option,
                );
              }}
            >
              {option === "week" ? "Semanas" : "Meses"}
            </Button>
          ))}
        </div>
      </fieldset>
      <div className="min-w-0 space-y-2 sm:flex-1">
        <p className="text-sm font-medium">Período del informe</p>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex min-w-0 max-w-full items-center rounded-lg border bg-background">
            <Button
              variant="ghost"
              size="icon"
              aria-label={view === "month" ? "Mes anterior" : "Semana anterior"}
              disabled={pending}
              onClick={() => navigate(shiftPeriod(view, start, -1))}
            >
              <ChevronLeftIcon className="size-4" />
            </Button>
            <span className="min-w-0 px-1 text-center text-xs font-medium tabular-nums sm:px-2 sm:text-sm">
              {periodLabel(view, start)}
            </span>
            <Button
              variant="ghost"
              size="icon"
              aria-label={
                view === "month" ? "Mes siguiente" : "Semana siguiente"
              }
              disabled={pending || start >= currentStart}
              onClick={() => navigate(shiftPeriod(view, start, 1))}
            >
              <ChevronRightIcon className="size-4" />
            </Button>
          </div>
          <Button
            variant="outline"
            size="sm"
            disabled={pending || start === currentStart}
            onClick={() => navigate(currentStart)}
          >
            {view === "month" ? "Este mes" : "Esta semana"}
          </Button>
        </div>
      </div>
      <div className="min-w-0 space-y-2 sm:w-52">
        <label htmlFor={clubSelectId} className="text-sm font-medium">
          Club
        </label>
        <output className="sr-only">{pending ? "Actualizando…" : ""}</output>
        <Select
          value={clubId ?? "all"}
          disabled={pending}
          onValueChange={(value) =>
            navigate(start, value === "all" ? null : value)
          }
        >
          <SelectTrigger
            id={clubSelectId}
            className="w-full"
            aria-label="Filtrar por club"
          >
            <SelectValue placeholder="Todos los clubes" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los clubes</SelectItem>
            {clubs.map((club) => (
              <SelectItem key={club.id} value={club.id}>
                {club.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
