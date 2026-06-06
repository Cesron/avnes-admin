"use client";

import { SearchXIcon, UsersIcon } from "lucide-react";
import type { FamilyWithChildren } from "@/services/families/get-families";
import { FamilyCard } from "./family-card";

interface FamiliesCardsGridProps {
  familyList: FamilyWithChildren[];
  /**
   * When true, the empty state is shown as "no matches for your filters"
   * instead of "no families registered yet".
   */
  isFiltered?: boolean;
}

export function FamiliesCardsGrid({
  familyList,
  isFiltered = false,
}: FamiliesCardsGridProps) {
  if (familyList.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center rounded-xl border border-dashed bg-muted/30">
        {isFiltered ? (
          <>
            <SearchXIcon className="size-12 text-muted-foreground/50 mb-3" />
            <h3 className="text-base font-medium text-muted-foreground">
              No se encontraron familias
            </h3>
            <p className="text-sm text-muted-foreground/80 mt-1 max-w-sm">
              No hay resultados que coincidan con la búsqueda aplicada. Intenta
              ajustar el término.
            </p>
          </>
        ) : (
          <>
            <UsersIcon className="size-12 text-muted-foreground/50 mb-3" />
            <h3 className="text-base font-medium text-muted-foreground">
              No hay familias registradas
            </h3>
            <p className="text-sm text-muted-foreground/80 mt-1 max-w-sm">
              Comienza agregando una nueva familia usando el botón
              &ldquo;Agregar Familia&rdquo; en la parte superior.
            </p>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="grid gap-3 sm:gap-4 grid-cols-1 md:grid-cols-2">
      {familyList.map((family) => (
        <FamilyCard key={family.id} family={family} />
      ))}
    </div>
  );
}
