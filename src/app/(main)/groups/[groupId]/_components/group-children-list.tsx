"use client";

import { BabyIcon, SearchIcon } from "lucide-react";
import { useId } from "react";
import { ChildrenCardsGrid } from "@/app/(main)/children/_components/children-cards-grid";
import { ListPagination } from "@/components/list-pagination";
import { CardsSkeleton } from "@/components/loading-skeletons";
import { Input } from "@/components/ui/input";
import { useListNavigation } from "@/hooks/use-list-navigation";
import type { PageResult } from "@/lib/pagination";
import type { ChildWithFamily } from "@/services/children/get-children";

export function GroupChildrenList({
  childrenPage,
  total,
}: {
  childrenPage: PageResult<ChildWithFamily>;
  total: number;
}) {
  const navigation = useListNavigation();
  const searchId = useId();

  return (
    <section
      aria-labelledby="group-children-heading"
      aria-busy={navigation.busy}
      className="space-y-4"
    >
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div className="space-y-1">
          <h2 id="group-children-heading" className="text-lg font-semibold">
            Niños del grupo{" "}
            <span className="ml-1 text-sm font-normal text-muted-foreground tabular-nums">
              ({total})
            </span>
          </h2>
          <p className="text-sm text-muted-foreground">
            Integrantes actuales y su historial de asistencia.
          </p>
        </div>
        {total > 0 ? (
          <div className="space-y-2 sm:w-72">
            <label htmlFor={searchId} className="text-sm font-medium">
              Buscar en este grupo
            </label>
            <div className="relative">
              <SearchIcon
                aria-hidden="true"
                className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              />
              <Input
                id={searchId}
                type="search"
                placeholder="Nombre del niño o niña"
                className="pl-9"
                value={navigation.search}
                onChange={(event) =>
                  navigation.changeSearch(event.target.value)
                }
              />
            </div>
          </div>
        ) : null}
      </div>
      {total === 0 ? (
        <div className="flex flex-col items-center rounded-xl border border-dashed bg-muted/30 px-5 py-12 text-center">
          <BabyIcon
            aria-hidden="true"
            className="mb-3 size-10 text-muted-foreground/50"
          />
          <h3 className="font-medium">
            Este grupo aún no tiene niños asignados
          </h3>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            Asigna niños a este grupo desde su ficha en la lista general de
            niños.
          </p>
        </div>
      ) : navigation.busy ? (
        <CardsSkeleton kind="children" count={childrenPage.items.length} />
      ) : childrenPage.items.length === 0 && !navigation.search.trim() ? (
        <p className="rounded-xl border border-dashed px-5 py-12 text-center text-sm text-muted-foreground">
          No hay niños en esta página. Vuelve a la primera página para ver los
          integrantes del grupo.
        </p>
      ) : (
        <ChildrenCardsGrid
          childList={childrenPage.items}
          isFiltered={!!navigation.search.trim()}
        />
      )}
      {total > 0 ? (
        <ListPagination
          {...childrenPage}
          count={childrenPage.items.length}
          busy={navigation.busy}
          onNavigate={navigation.navigate}
        />
      ) : null}
    </section>
  );
}
