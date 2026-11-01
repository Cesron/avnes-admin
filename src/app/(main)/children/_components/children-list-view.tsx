"use client";
import { ListPagination } from "@/components/list-pagination";
import { CardsSkeleton } from "@/components/loading-skeletons";
import { useListNavigation } from "@/hooks/use-list-navigation";
import type { PageResult } from "@/lib/pagination";
import type { ChildWithFamily } from "@/services/children/get-children";
import type { GroupOption } from "@/services/groups/get-groups-options";
import { ChildrenCardsGrid } from "./children-cards-grid";
import { ChildrenFilters } from "./children-filters";

export function ChildrenListView({
  initialChildren,
  clubs,
  groups,
  mentorGroupIds,
}: {
  initialChildren: PageResult<ChildWithFamily>;
  clubs: { id: string; name: string }[];
  groups: GroupOption[];
  mentorGroupIds?: string[];
}) {
  const navigation = useListNavigation();
  const clubId = navigation.params.get("clubId") ?? "all";
  const groupId = navigation.params.get("groupId") ?? "all";
  return (
    <div className="space-y-4" aria-busy={navigation.busy}>
      <fieldset className="min-w-0">
        <ChildrenFilters
          clubs={clubs}
          groups={groups}
          selectedClubId={clubId}
          selectedGroupId={groupId}
          searchValue={navigation.search}
          showGroupFilters={mentorGroupIds === undefined}
          onSearchChange={navigation.changeSearch}
          onClubChange={(value) =>
            navigation.navigate({
              clubId: value === "all" ? null : value,
              groupId: null,
              search: navigation.search.trim(),
            })
          }
          onGroupChange={(value) =>
            navigation.navigate({
              groupId: value === "all" ? null : value,
              search: navigation.search.trim(),
            })
          }
        />
      </fieldset>
      {navigation.busy ? (
        <CardsSkeleton kind="children" count={initialChildren.items.length} />
      ) : (
        <ChildrenCardsGrid
          childList={initialChildren.items}
          isFiltered={
            !!navigation.search.trim() || clubId !== "all" || groupId !== "all"
          }
        />
      )}
      <ListPagination
        {...initialChildren}
        count={initialChildren.items.length}
        busy={navigation.busy}
        onNavigate={navigation.navigate}
      />
    </div>
  );
}
