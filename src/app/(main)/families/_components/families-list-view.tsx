"use client";
import { ListPagination } from "@/components/list-pagination";
import { CardsSkeleton } from "@/components/loading-skeletons";
import { useListNavigation } from "@/hooks/use-list-navigation";
import type { PageResult } from "@/lib/pagination";
import type { FamilyWithChildren } from "@/services/families/get-families";
import { FamiliesCardsGrid } from "./families-cards-grid";
import { FamiliesFilters } from "./families-filters";

export function FamiliesListView({
  initialFamilies,
}: {
  initialFamilies: PageResult<FamilyWithChildren>;
}) {
  const navigation = useListNavigation();
  return (
    <div className="space-y-4" aria-busy={navigation.busy}>
      <fieldset disabled={navigation.isPending} className="min-w-0">
        <FamiliesFilters
          searchValue={navigation.search}
          onSearchChange={navigation.changeSearch}
        />
      </fieldset>
      {navigation.busy ? (
        <CardsSkeleton kind="families" count={initialFamilies.items.length} />
      ) : (
        <FamiliesCardsGrid
          familyList={initialFamilies.items}
          isFiltered={!!navigation.search.trim()}
        />
      )}
      <ListPagination
        {...initialFamilies}
        count={initialFamilies.items.length}
        busy={navigation.busy}
        onNavigate={navigation.navigate}
      />
    </div>
  );
}
