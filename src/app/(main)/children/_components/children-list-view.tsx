"use client";

import { useCallback, useRef, useState, useTransition } from "react";
import type { ChildWithFamily } from "@/services/children/get-children";
import type { GroupOption } from "@/services/groups/get-groups-options";
import { getChildrenAction } from "../_lib/get-children.action";
import { ChildrenCardsGrid } from "./children-cards-grid";
import { ChildrenFilters } from "./children-filters";

type ClubOption = {
  id: string;
  name: string;
};

interface ChildrenListViewProps {
  initialChildren: ChildWithFamily[];
  clubs: ClubOption[];
  groups: GroupOption[];
  mentorGroupIds?: string[];
}

export function ChildrenListView({
  initialChildren,
  clubs,
  groups,
  mentorGroupIds,
}: ChildrenListViewProps) {
  const [children, setChildren] = useState<ChildWithFamily[]>(initialChildren);
  const [selectedClubId, setSelectedClubId] = useState("all");
  const [selectedGroupId, setSelectedGroupId] = useState("all");
  const [search, setSearch] = useState("");
  const [isPending, startTransition] = useTransition();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchChildren = useCallback(
    (clubId: string, groupId: string, searchTerm: string) => {
      startTransition(async () => {
        const result = await getChildrenAction({
          clubId: clubId === "all" ? undefined : clubId,
          groupId: groupId === "all" ? undefined : groupId,
          search: searchTerm || undefined,
          mentorGroupIds,
        });
        setChildren(result);
      });
    },
    [mentorGroupIds],
  );

  const handleClubChange = (clubId: string) => {
    setSelectedClubId(clubId);
    setSelectedGroupId("all");
    fetchChildren(clubId, "all", search);
  };

  const handleGroupChange = (groupId: string) => {
    setSelectedGroupId(groupId);
    fetchChildren(selectedClubId, groupId, search);
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchChildren(selectedClubId, selectedGroupId, value);
    }, 300);
  };

  const isFiltered =
    selectedClubId !== "all" ||
    selectedGroupId !== "all" ||
    search.trim().length > 0;

  return (
    <div className="space-y-4">
      <ChildrenFilters
        clubs={clubs}
        groups={groups}
        selectedClubId={selectedClubId}
        selectedGroupId={selectedGroupId}
        searchValue={search}
        showGroupFilters={!mentorGroupIds}
        onClubChange={handleClubChange}
        onGroupChange={handleGroupChange}
        onSearchChange={handleSearchChange}
      />

      <div className="flex items-center justify-between px-1">
        <p className="text-xs text-muted-foreground">
          {isPending ? (
            "Cargando..."
          ) : (
            <>
              {children.length} {children.length === 1 ? "niño" : "niños"}
            </>
          )}
        </p>
      </div>

      {isPending ? (
        <div className="flex items-center justify-center py-16">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      ) : (
        <ChildrenCardsGrid childList={children} isFiltered={isFiltered} />
      )}
    </div>
  );
}
