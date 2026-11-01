"use client";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ListPagination({
  previous,
  next,
  busy,
  count,
  onNavigate,
}: {
  previous: string | null;
  next: string | null;
  busy: boolean;
  count: number;
  onNavigate: (changes: Record<string, string | null>) => void;
}) {
  return (
    <nav
      aria-label="Paginación"
      className="flex flex-wrap items-center justify-between gap-3 border-t pt-4"
    >
      <output className="text-xs text-muted-foreground" aria-live="polite">
        {busy ? "Cargando..." : `${count} registros en esta página`}
      </output>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={busy || !previous}
          onClick={() => onNavigate({ before: previous })}
        >
          <ChevronLeftIcon />
          Anterior
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={busy || !next}
          onClick={() => onNavigate({ after: next })}
        >
          Siguiente
          <ChevronRightIcon />
        </Button>
        {count === 0 && (
          <Button
            variant="ghost"
            size="sm"
            disabled={busy}
            onClick={() => onNavigate({})}
          >
            Primera página
          </Button>
        )}
      </div>
    </nav>
  );
}
