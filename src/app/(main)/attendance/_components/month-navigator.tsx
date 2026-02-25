"use client";

import { Button } from "@/components/ui/button";
import { formatDateLocal, getMonthStart } from "@/utils/week-helpers";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

interface MonthNavigatorProps {
  currentMonthStart: string;
  onMonthChange: (newMonthStart: string) => void;
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
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" onClick={handlePrevMonth}>
          <ChevronLeftIcon className="size-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={handleNextMonth}>
          <ChevronRightIcon className="size-4" />
        </Button>
        <Button variant="outline" size="sm" onClick={handleToday}>
          Hoy
        </Button>
      </div>

      <span className="text-lg font-medium">
        {formatMonthLabel(currentMonthStart)}
      </span>
    </div>
  );
}
