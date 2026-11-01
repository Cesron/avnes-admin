"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { shiftDate, weekLabel } from "@/lib/dashboard-week";

export function DashboardFilters({
  week,
  currentWeek,
  clubId,
  clubs,
}: {
  week: string;
  currentWeek: string;
  clubId?: string;
  clubs: { id: string; name: string }[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  function navigate(nextWeek: string, club: string | null = clubId ?? null) {
    const params = new URLSearchParams({ week: nextWeek });
    if (club) params.set("club", club);
    startTransition(() =>
      router.push(`/dashboard?${params}`, { scroll: false }),
    );
  }
  return (
    <div
      className="flex flex-wrap items-center justify-between gap-4"
      aria-busy={pending}
    >
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center rounded-lg border bg-card">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Semana anterior"
            disabled={pending}
            onClick={() => navigate(shiftDate(week, -7))}
          >
            <ChevronLeftIcon className="size-4" />
          </Button>
          <span className="px-2 text-sm font-medium tabular-nums">
            {weekLabel(week)}
          </span>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Semana siguiente"
            disabled={pending || week >= currentWeek}
            onClick={() => navigate(shiftDate(week, 7))}
          >
            <ChevronRightIcon className="size-4" />
          </Button>
        </div>
        <Button
          variant="outline"
          size="sm"
          disabled={pending || week === currentWeek}
          onClick={() => navigate(currentWeek)}
        >
          Esta semana
        </Button>
      </div>
      <div className="flex items-center gap-3">
        <output className="text-xs text-muted-foreground">
          {pending ? "Actualizando…" : ""}
        </output>
        <Select
          value={clubId ?? "all"}
          disabled={pending}
          onValueChange={(value) =>
            navigate(week, value === "all" ? null : value)
          }
        >
          <SelectTrigger className="w-52" aria-label="Filtrar por club">
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
