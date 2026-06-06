"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { formatDateLocal, getMonthStart } from "@/utils/week-helpers";
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon, LayoutListIcon } from "lucide-react";

export type MonthViewMode = "month" | "agenda";

interface MonthNavigatorProps {
  currentMonthStart: string;
  onMonthChange: (newMonthStart: string) => void;
  viewMode?: MonthViewMode;
  onViewModeChange?: (mode: MonthViewMode) => void;
}

function formatMonthLabel(monthStart: string): string {
  const [y, m] = monthStart.split("-").map(Number);
  const date = new Date(y, m - 1, 1);

  const label = date.toLocaleDateString("es-ES", {
    month: "long",
    year: "numeric",
  });

  return label.charAt(0).toUpperCase() + label.slice(1);
}

export function MonthNavigator({
  currentMonthStart,
  onMonthChange,
  viewMode = "month",
  onViewModeChange,
}: MonthNavigatorProps) {
  const handlePrevMonth = () => {
    const [y, m] = currentMonthStart.split("-").map(Number);
    const prev = new Date(y, m - 2, 1);
    onMonthChange(formatDateLocal(prev));
  };

  const handleNextMonth = () => {
    const [y, m] = currentMonthStart.split("-").map(Number);
    const next = new Date(y, m, 1);
    onMonthChange(formatDateLocal(next));
  };

  const handleToday = () => {
    const today = new Date();
    onMonthChange(formatDateLocal(getMonthStart(today)));
  };

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      {/* Left side: nav buttons + month label */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            onClick={handlePrevMonth}
            aria-label="Mes anterior"
          >
            <ChevronLeftIcon className="size-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={handleNextMonth}
            aria-label="Mes siguiente"
          >
            <ChevronRightIcon className="size-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={handleToday}>
            Hoy
          </Button>
        </div>

        <span className="text-base sm:text-lg font-semibold capitalize">
          {formatMonthLabel(currentMonthStart)}
        </span>
      </div>

      {/* Right side: view mode toggle */}
      {onViewModeChange && (
        <div
          className="inline-flex h-9 items-center justify-center rounded-md border bg-muted/40 p-0.5 self-start sm:self-auto"
          role="group"
          aria-label="Modo de vista"
        >
          <button
            type="button"
            onClick={() => onViewModeChange("month")}
            className={cn(
              "inline-flex h-8 items-center gap-1.5 rounded-sm px-2.5 text-xs font-medium transition-all",
              viewMode === "month"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
            aria-pressed={viewMode === "month"}
            aria-label="Vista calendario"
          >
            <CalendarIcon className="size-3.5" />
            <span className="hidden sm:inline">Calendario</span>
          </button>
          <button
            type="button"
            onClick={() => onViewModeChange("agenda")}
            className={cn(
              "inline-flex h-8 items-center gap-1.5 rounded-sm px-2.5 text-xs font-medium transition-all",
              viewMode === "agenda"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
            aria-pressed={viewMode === "agenda"}
            aria-label="Vista lista"
          >
            <LayoutListIcon className="size-3.5" />
            <span className="hidden sm:inline">Lista</span>
          </button>
        </div>
      )}
    </div>
  );
}
