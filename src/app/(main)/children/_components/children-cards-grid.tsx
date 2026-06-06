"use client";

import { BabyIcon, SearchXIcon } from "lucide-react";
import type { ChildWithFamily } from "@/services/children/get-children";
import { ChildCard } from "./child-card";

interface ChildrenCardsGridProps {
  childList: ChildWithFamily[];
  /**
   * When true, the empty state is shown as "no matches for your filters"
   * instead of "no children registered yet".
   */
  isFiltered?: boolean;
}

export function ChildrenCardsGrid({
  childList,
  isFiltered = false,
}: ChildrenCardsGridProps) {
  if (childList.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center rounded-xl border border-dashed bg-muted/30">
        {isFiltered ? (
          <>
            <SearchXIcon className="size-12 text-muted-foreground/50 mb-3" />
            <h3 className="text-base font-medium text-muted-foreground">
              No se encontraron niños
            </h3>
            <p className="text-sm text-muted-foreground/80 mt-1 max-w-sm">
              No hay resultados que coincidan con los filtros aplicados. Intenta
              ajustar la búsqueda.
            </p>
          </>
        ) : (
          <>
            <BabyIcon className="size-12 text-muted-foreground/50 mb-3" />
            <h3 className="text-base font-medium text-muted-foreground">
              No hay niños registrados
            </h3>
            <p className="text-sm text-muted-foreground/80 mt-1 max-w-sm">
              Comienza agregando un nuevo niño o niña usando el botón
              &ldquo;Agregar Niño&rdquo; en la parte superior.
            </p>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="grid gap-3 sm:gap-4 grid-cols-1 md:grid-cols-2">
      {childList.map((child) => (
        <ChildCard key={child.id} child={child} />
      ))}
    </div>
  );
}
