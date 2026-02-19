"use client";

import { Button } from "@/components/ui/button";
import { formatDateLocal } from "@/utils/week-helpers";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

interface WeekNavigatorProps {
  currentWeekStart: string; // YYYY-MM-DD (Monday)
  onWeekChange: (newWeekStart: string) => void;
}

const DAY_NAMES_SHORT: Record<string, string> = {
  Mon: "Lun",
  Tue: "Mar",
  Wed: "Mié",
  Thu: "Jue",
  Fri: "Vie",
  Sat: "Sáb",
  Sun: "Dom",
};

function formatWeekRange(weekStart: string): string {
  const [y, m, d] = weekStart.split("-").map(Number);
  const monday = new Date(y, m - 1, d);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  const formatOpts: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "short",
  };

  const mondayStr = monday.toLocaleDateString("es-ES", formatOpts);
  const sundayStr = sunday.toLocaleDateString("es-ES", {
    ...formatOpts,
    year: "numeric",
  });

  return `${mondayStr} – ${sundayStr}`;
}

export function WeekNavigator({
  currentWeekStart,
  onWeekChange,
}: WeekNavigatorProps) {
  const handlePrevWeek = () => {
    const [y, m, d] = currentWeekStart.split("-").map(Number);
    const current = new Date(y, m - 1, d);
    current.setDate(current.getDate() - 7);
    onWeekChange(formatDateLocal(current));
  };

  const handleNextWeek = () => {
    const [y, m, d] = currentWeekStart.split("-").map(Number);
    const current = new Date(y, m - 1, d);
    current.setDate(current.getDate() + 7);
    onWeekChange(formatDateLocal(current));
  };

  const handleToday = () => {
    const today = new Date();
    const day = today.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    today.setDate(today.getDate() + diff);
    onWeekChange(formatDateLocal(today));
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" onClick={handlePrevWeek}>
          <ChevronLeftIcon className="size-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={handleNextWeek}>
          <ChevronRightIcon className="size-4" />
        </Button>
        <Button variant="outline" size="sm" onClick={handleToday}>
          Hoy
        </Button>
      </div>

      <span className="text-lg font-medium">
        {formatWeekRange(currentWeekStart)}
      </span>
    </div>
  );
}
