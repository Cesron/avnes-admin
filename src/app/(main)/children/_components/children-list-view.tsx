"use client";

import type { ChildWithFamily } from "@/services/children/get-children";
import type { GroupOption } from "@/services/groups/get-groups-options";
import { useCallback, useRef, useState, useTransition } from "react";
import { getChildrenAction } from "../_lib/get-children.action";
import { ChildrenFilters } from "./children-filters";
import { ChildrenTableContent } from "./children-table-content";

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

  return (
    <div>
      <ChildrenFilters
        clubs={clubs}
        groups={groups}
        selectedClubId={selectedClubId}
        selectedGroupId={selectedGroupId}
        searchValue={search}
        onClubChange={handleClubChange}
        onGroupChange={handleGroupChange}
        onSearchChange={handleSearchChange}
      />

      {isPending ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      ) : (
        <ChildrenTableContent children={children} />
      )}
    </div>
  );
}
